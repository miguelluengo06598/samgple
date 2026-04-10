'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const F = "'DM Sans', system-ui, sans-serif"

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: '#dbeafe', color: '#1d4ed8', label: 'Abierto' },
  in_progress: { bg: '#ccfbf1', color: '#0f766e', label: 'En curso' },
  resolved:    { bg: '#dcfce7', color: '#15803d', label: 'Resuelto' },
  closed:      { bg: '#f1f5f9', color: '#475569', label: 'Cerrado' },
}

function Badge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? { bg: '#f1f5f9', color: '#475569', label: status }
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>{c.label}</span>
}

function Spinner({ color = '#fff' }: { color?: string }) {
  return <div style={{ width: 13, height: 13, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}

export default function AdminSupportPage() {
  const [threads, setThreads]           = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [selected, setSelected]         = useState<any>(null)
  const [reply, setReply]               = useState('')
  const [threadStatus, setThreadStatus] = useState('open')
  const [saving, setSaving]             = useState(false)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/support')
    const data = await res.json()
    setThreads(data.threads ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const channel = supabase.channel('admin-support')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, () => load())
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'support_threads' }, (payload: any) => {
      load()
      if (payload.eventType === 'UPDATE' && selected?.id === payload.new.id) {
        setSelected((prev: any) => ({ ...prev, ...payload.new }))
      }
    })
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selected, load])

  async function handleReply() {
    if (!reply || !selected) return
    setSaving(true)
    try {
      await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: selected.id, account_id: selected.account_id, content: reply, status: threadStatus }),
      })
      setReply('')
      await load()
    } finally { setSaving(false) }
  }

  const th: React.CSSProperties = { textAlign: 'left', padding: '11px 16px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' }
  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 11, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13, outline: 'none', color: '#0f172a', boxSizing: 'border-box', fontFamily: F }

  return (
    <>
      <style>{`
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .adm-tr { transition: background .12s; }
        .adm-tr:hover { background: #fafafa !important; }
        .adm-inp:focus { border-color: #2EC4B6 !important; box-shadow: 0 0 0 3px rgba(46,196,182,.12) !important; background: #fff !important; }
        .adm-wrap { overflow-x: auto; border-radius: 16px; }
        .adm-wrap table { min-width: 520px; }
        @media(min-width:768px) { .adm-hm { display: table-cell !important; } }
        @media(max-width:767px) { .adm-hm { display: none !important; } }
      `}</style>

      <div style={{ fontFamily: F }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Soporte</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{threads.filter(t => t.status === 'open').length} tickets abiertos</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {selected && (
              <button onClick={() => setSelected(null)} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Volver
              </button>
            )}
            <button onClick={load} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              Actualizar
            </button>
          </div>
        </div>

        {selected ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid #e8edf2', boxShadow: '0 2px 10px rgba(0,0,0,.05)', animation: 'fadeIn .2s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>{selected.subject}</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{selected.accounts?.name} · {selected.accounts?.email}</p>
              </div>
              <Badge status={selected.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 400, overflowY: 'auto', marginBottom: 20, padding: '4px 0' }}>
              {selected.support_messages?.map((m: any) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'client' ? 'flex-start' : 'flex-end' }}>
                  <div style={{ maxWidth: '72%', padding: '11px 15px', borderRadius: m.sender === 'client' ? '18px 18px 18px 4px' : '18px 18px 4px 18px', background: m.sender === 'admin' ? 'linear-gradient(135deg,#2EC4B6,#1A9E8F)' : '#f8fafc', border: m.sender === 'client' ? '1px solid #f1f5f9' : 'none', boxShadow: m.sender === 'admin' ? '0 4px 12px rgba(46,196,182,.3)' : 'none' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: m.sender === 'admin' ? 'rgba(255,255,255,.7)' : '#94a3b8', margin: '0 0 3px' }}>{m.sender === 'admin' ? 'Admin' : selected.accounts?.name}</p>
                    <p style={{ fontSize: 13, color: m.sender === 'admin' ? '#fff' : '#0f172a', margin: 0, lineHeight: 1.55 }}>{m.content}</p>
                    <p style={{ fontSize: 10, color: m.sender === 'admin' ? 'rgba(255,255,255,.5)' : '#94a3b8', margin: '4px 0 0', textAlign: 'right' }}>
                      {new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input className="adm-inp" style={{ ...inp, flex: 1, minWidth: 120 }} placeholder="Escribe tu respuesta..."
                value={reply} onChange={e => setReply(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && reply) handleReply() }} />
              <select className="adm-inp" style={{ ...inp, width: 'auto', cursor: 'pointer' }} value={threadStatus} onChange={e => setThreadStatus(e.target.value)}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button onClick={handleReply} disabled={!reply || saving}
                style={{ padding: '11px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: !reply ? .5 : 1, fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
                {saving ? <Spinner /> : null}Enviar
              </button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
            <div className="adm-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Usuario</th>
                    <th style={th}>Asunto</th>
                    <th style={th} className="adm-hm">Mensajes</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ padding: 32, color: '#94a3b8', textAlign: 'center' }}>Cargando...</td></tr>
                  ) : threads.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 40, color: '#94a3b8', textAlign: 'center' }}>Sin tickets</td></tr>
                  ) : threads.map(t => (
                    <tr key={t.id} className="adm-tr">
                      <td style={td}>
                        <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.accounts?.name}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.accounts?.email}</p>
                      </td>
                      <td style={td}><p style={{ margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</p></td>
                      <td style={td} className="adm-hm">
                        <span style={{ fontWeight: 700, color: '#0f172a', background: '#f8fafc', border: '1px solid #f1f5f9', padding: '2px 8px', borderRadius: 8, fontSize: 12 }}>{t.support_messages?.length ?? 0}</span>
                      </td>
                      <td style={td}><Badge status={t.status} /></td>
                      <td style={td}>
                        <button onClick={() => { setSelected(t); setThreadStatus(t.status) }}
                          style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #fde68a', background: '#fff', color: '#d97706', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: F }}>
                          Responder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}