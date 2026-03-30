'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Abierto',     color: '#1d4ed8', bg: '#dbeafe' },
  in_progress: { label: 'En curso',    color: '#0f766e', bg: '#ccfbf1' },
  resolved:    { label: 'Resuelto',    color: '#15803d', bg: '#dcfce7' },
  closed:      { label: 'Cerrado',     color: '#475569', bg: '#f1f5f9' },
}

export default function SoporteClient({ threads, accountId }: { threads: any[], accountId: string }) {
  const [localThreads, setLocalThreads] = useState(threads)
  const [selected, setSelected] = useState<any>(null)
  const [newMsg, setNewMsg] = useState('')
  const [subject, setSubject] = useState('')
  const [ticketMsg, setTicketMsg] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [sending, setSending] = useState(false)

  useRealtime([
    {
      table: 'support_messages',
      filter: `account_id=eq.${accountId}`,
      onInsert: (m) => {
        setLocalThreads(prev => prev.map(t => t.id === m.thread_id ? { ...t, support_messages: [...(t.support_messages ?? []), m] } : t))
        setSelected((prev: any) => prev?.id === m.thread_id ? { ...prev, support_messages: [...(prev.support_messages ?? []), m] } : prev)
      },
    },
    {
      table: 'support_threads',
      filter: `account_id=eq.${accountId}`,
      onInsert: (t) => setLocalThreads(prev => [{ ...t, support_messages: [] }, ...prev]),
      onUpdate: (t) => setLocalThreads(prev => prev.map(x => x.id === t.id ? { ...x, ...t } : x)),
    },
  ])

  async function sendMessage() {
    if (!newMsg.trim() || !selected) return
    setSending(true)
    try {
      await fetch(`/api/support/${selected.id}/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newMsg }) })
      setNewMsg('')
    } finally { setSending(false) }
  }

  async function createTicket() {
    if (!subject || !ticketMsg) return
    setSending(true)
    try {
      await fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, message: ticketMsg }) })
      setSubject(''); setTicketMsg(''); setShowNew(false)
    } finally { setSending(false) }
  }

  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #e8f4f3', marginBottom: 10 }
  const fieldWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9, padding: '12px 13px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 13, marginBottom: 8 }
  const fieldInput: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }
  const fieldLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, display: 'block', fontFamily: F }

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selected ? (
            <button onClick={() => setSelected(null)} style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
          ) : (
            <Link href="/configuracion" style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
          )}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{selected ? selected.subject : 'Soporte'}</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{selected ? 'Chat con el equipo' : 'Tickets y chat con el equipo'}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        {!selected ? (
          <>
            <button onClick={() => setShowNew(!showNew)} style={{ width: '100%', padding: '15px 18px', borderRadius: 16, border: '2px solid #3b82f6', background: '#fff', color: '#1d4ed8', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(59,130,246,0.1)', fontFamily: F, marginBottom: 10 }}>
              <span>Nuevo ticket</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>

            {showNew && (
              <div style={{ ...card, border: '2px solid #bfdbfe', background: '#eff6ff' }}>
                <span style={fieldLabel}>Asunto</span>
                <div style={fieldWrap}><input style={fieldInput} placeholder="Describe el problema" value={subject} onChange={e => setSubject(e.target.value)} /></div>
                <span style={fieldLabel}>Mensaje</span>
                <textarea style={{ ...fieldInput, padding: '12px 13px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 13, minHeight: 90, resize: 'vertical', display: 'block', marginBottom: 10 } as React.CSSProperties} placeholder="Explica tu consulta..." value={ticketMsg} onChange={e => setTicketMsg(e.target.value)} />
                <button onClick={createTicket} disabled={sending || !subject || !ticketMsg} style={{ width: '100%', padding: '14px', borderRadius: 14, border: '2px solid #3b82f6', background: '#fff', color: '#1d4ed8', cursor: 'pointer', fontSize: 14, fontWeight: 800, fontFamily: F, opacity: (!subject || !ticketMsg) ? 0.5 : 1 }}>
                  {sending ? 'Enviando...' : 'Enviar ticket'}
                </button>
              </div>
            )}

            {localThreads.length === 0 ? (
              <div style={{ ...card, textAlign: 'center', padding: '36px 20px' }}>
                <div style={{ width: 52, height: 52, background: '#eff6ff', borderRadius: 16, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: F }}>Sin tickets todavía</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontFamily: F }}>Crea un ticket para contactar con soporte</p>
              </div>
            ) : (
              <div style={card}>
                {localThreads.map((t, i) => {
                  const st = STATUS[t.status] ?? STATUS.open
                  const last = t.support_messages?.[t.support_messages.length - 1]
                  return (
                    <div key={t.id} onClick={() => setSelected(t)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: i < localThreads.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F }}>{t.subject}</p>
                        {last && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F }}>{last.sender === 'admin' ? '← Admin: ' : 'Tú: '}{last.content}</p>}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0, marginLeft: 10, fontFamily: F }}>{st.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div style={card}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 380, overflowY: 'auto', marginBottom: 14 }}>
              {selected.support_messages?.map((m: any) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: m.sender === 'client' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.sender === 'client' ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : '#f1f5f9', border: m.sender === 'admin' ? '1px solid #e2e8f0' : 'none' }}>
                    <p style={{ fontSize: 13, color: m.sender === 'client' ? '#fff' : '#0f172a', margin: 0, lineHeight: 1.5, fontFamily: F }}>{m.content}</p>
                    <p style={{ fontSize: 10, color: m.sender === 'client' ? 'rgba(255,255,255,0.6)' : '#94a3b8', margin: '4px 0 0', textAlign: 'right', fontFamily: F }}>{new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ ...fieldWrap, flex: 1, marginBottom: 0 }}>
                <input style={fieldInput} placeholder="Escribe tu mensaje..." value={newMsg} onChange={e => setNewMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} />
              </div>
              <button onClick={sendMessage} disabled={sending || !newMsg} style={{ width: 46, height: 46, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', cursor: !newMsg ? 'not-allowed' : 'pointer', opacity: !newMsg ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}