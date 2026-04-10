'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const F = "'DM Sans', system-ui, sans-serif"

export default function AdminContactsPage() {
  const [contacts, setContacts]     = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [expanded, setExpanded]     = useState<string | null>(null)
  const [saving, setSaving]         = useState<Record<string, boolean>>({})
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/contacts')
    const data = await res.json()
    setContacts(data.contacts ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const channel = supabase.channel('admin-contacts')
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, () => load())
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [load])

  async function handleStatus(id: string, status: string) {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch('/api/admin/contacts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    } finally { setSaving(prev => ({ ...prev, [id]: false })) }
  }

  const newCount = contacts.filter(c => c.status === 'new').length
  const th: React.CSSProperties = { textAlign: 'left', padding: '11px 16px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' }
  const inp: React.CSSProperties = { padding: '6px 10px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 12, outline: 'none', color: '#0f172a', cursor: 'pointer', fontFamily: F }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .adm-tr { transition: background .12s; cursor: pointer; }
        .adm-tr:hover { background: #fafafa !important; }
        .adm-wrap { overflow-x: auto; border-radius: 16px; }
        .adm-wrap table { min-width: 560px; }
        @media(min-width:768px) { .adm-hm { display: table-cell !important; } }
        @media(max-width:767px) { .adm-hm { display: none !important; } }
      `}</style>

      <div style={{ fontFamily: F }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Contactos</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              {newCount > 0 && <>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{newCount} nuevo{newCount > 1 ? 's' : ''} ·</span>
              </>}
              {contacts.length} mensajes total
            </p>
          </div>
          <button onClick={load} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Actualizar
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
          <div className="adm-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Contacto</th>
                  <th style={th} className="adm-hm">Empresa</th>
                  <th style={th} className="adm-hm">Pedidos/mes</th>
                  <th style={th}>Mensaje</th>
                  <th style={th}>Demo</th>
                  <th style={th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ padding: 32, color: '#94a3b8', textAlign: 'center' }}>Cargando...</td></tr>
                ) : contacts.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: 40, color: '#94a3b8', textAlign: 'center' }}>Sin mensajes todavía</td></tr>
                ) : contacts.map(c => (
                  <>
                    <tr key={c.id} className="adm-tr" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: 13 }}>
                              {c.status === 'new' && <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e', marginRight: 5, verticalAlign: 'middle' }} />}
                              {c.name}
                            </p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{c.email}</p>
                            <p style={{ fontSize: 10, color: '#cbd5e1', margin: 0 }}>
                              {new Date(c.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={td} className="adm-hm"><span style={{ color: '#64748b' }}>{c.company ?? '—'}</span></td>
                      <td style={td} className="adm-hm"><span style={{ color: '#64748b' }}>{c.orders ?? '—'}</span></td>
                      <td style={td}>
                        <p style={{ margin: 0, maxWidth: 200, fontSize: 12, color: '#374151', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: expanded === c.id ? 'normal' : 'nowrap' }}>
                          {c.message}
                        </p>
                      </td>
                      <td style={td}>
                        {c.wants_demo
                          ? <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#dbeafe', color: '#1d4ed8' }}>Sí</span>
                          : <span style={{ fontSize: 11, color: '#94a3b8' }}>No</span>}
                      </td>
                      <td style={td}>
                        <select value={c.status} onClick={e => e.stopPropagation()} onChange={e => handleStatus(c.id, e.target.value)} disabled={!!saving[c.id]} style={{ ...inp, opacity: saving[c.id] ? .5 : 1 }}>
                          <option value="new">Nuevo</option>
                          <option value="read">Leído</option>
                          <option value="replied">Respondido</option>
                        </select>
                      </td>
                    </tr>
                    {expanded === c.id && (
                      <tr key={`${c.id}-exp`}>
                        <td colSpan={6} style={{ padding: '14px 20px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', margin: '0 0 7px' }}>Mensaje completo</p>
                              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>{c.message}</p>
                            </div>
                            <a href={`mailto:${c.email}`} onClick={e => e.stopPropagation()}
                              style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #a7f3d0', background: '#fff', color: '#22c55e', textDecoration: 'none', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                              Responder email
                            </a>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}