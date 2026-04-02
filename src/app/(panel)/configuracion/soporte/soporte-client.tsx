'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'

const STATUS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  open:        { label: 'Abierto',   color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  in_progress: { label: 'En curso',  color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  resolved:    { label: 'Resuelto',  color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  closed:      { label: 'Cerrado',   color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
}

export default function SoporteClient({ threads, accountId }: { threads: any[]; accountId: string }) {
  const [localThreads, setLocalThreads] = useState(threads)
  const [selected, setSelected]         = useState<any>(null)
  const [newMsg, setNewMsg]             = useState('')
  const [subject, setSubject]           = useState('')
  const [ticketMsg, setTicketMsg]       = useState('')
  const [showNew, setShowNew]           = useState(false)
  const [sending, setSending]           = useState(false)
  const messagesEndRef                  = useRef<HTMLDivElement>(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.support_messages?.length])

  useRealtime([
    {
      table: 'support_messages',
      filter: `account_id=eq.${accountId}`,
      onInsert: (m: any) => {
        setLocalThreads(prev => prev.map(t =>
          t.id === m.thread_id
            ? { ...t, support_messages: [...(t.support_messages ?? []), m] }
            : t
        ))
        setSelected((prev: any) =>
          prev?.id === m.thread_id
            ? { ...prev, support_messages: [...(prev.support_messages ?? []), m] }
            : prev
        )
      },
    },
    {
      table: 'support_threads',
      filter: `account_id=eq.${accountId}`,
      onInsert: (t: any) => setLocalThreads(prev => [{ ...t, support_messages: [] }, ...prev]),
      onUpdate: (t: any) => setLocalThreads(prev => prev.map(x => x.id === t.id ? { ...x, ...t } : x)),
    },
  ])

  async function sendMessage() {
    if (!newMsg.trim() || !selected) return
    setSending(true)
    const optimistic = {
      id: `tmp-${Date.now()}`,
      thread_id: selected.id,
      content: newMsg,
      sender: 'client',
      created_at: new Date().toISOString(),
    }
    // Optimistic update
    setSelected((prev: any) => ({ ...prev, support_messages: [...(prev.support_messages ?? []), optimistic] }))
    setNewMsg('')
    try {
      await fetch(`/api/support/${selected.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: optimistic.content }),
      })
    } finally { setSending(false) }
  }

  async function createTicket() {
    if (!subject || !ticketMsg) return
    setSending(true)
    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message: ticketMsg }),
      })
      setSubject('')
      setTicketMsg('')
      setShowNew(false)
    } finally { setSending(false) }
  }

  const openCount = localThreads.filter(t => t.status === 'open' || t.status === 'in_progress').length

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes msgIn   { from{opacity:0;transform:translateY(6px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        .thread-row { transition:background 0.12s; cursor:pointer; }
        .thread-row:hover { background:#f8fafc!important; }
        .thread-row:active { transform:scale(0.99); }
        .msg-scroll::-webkit-scrollbar { width:4px; }
        .msg-scroll::-webkit-scrollbar-track { background:transparent; }
        .msg-scroll::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:4px; }
        .send-btn { transition:all 0.12s ease; }
        .send-btn:hover { opacity:0.85; transform:scale(1.05); }
        .send-btn:active { transform:scale(0.95); }
        .new-ticket-btn { transition:all 0.15s ease; }
        .new-ticket-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(59,130,246,0.2)!important; }
        .inp-focus:focus-within { border-color:#3b82f6!important; box-shadow:0 0 0 3px rgba(59,130,246,0.08); }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            {selected ? (
              <button onClick={() => setSelected(null)}
                style={{ width: 36, height: 36, borderRadius: 11, background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              </button>
            ) : (
              <Link href="/configuracion"
                style={{ width: 36, height: 36, borderRadius: 11, background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              </Link>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selected ? selected.subject : 'Soporte'}
              </h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                {selected
                  ? `${selected.support_messages?.length ?? 0} mensajes`
                  : `${openCount} ticket${openCount !== 1 ? 's' : ''} abierto${openCount !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            {selected && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: STATUS[selected.status]?.bg ?? '#f1f5f9', color: STATUS[selected.status]?.color ?? '#475569', border: `1px solid ${STATUS[selected.status]?.border ?? '#e2e8f0'}`, flexShrink: 0 }}>
                {STATUS[selected.status]?.label ?? selected.status}
              </span>
            )}
          </div>
        </div>

        {/* ── LISTA TICKETS ── */}
        {!selected && (
          <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, animation: 'fadeUp 0.2s ease both' }}>
              {[
                { label: 'Abiertos',  value: String(localThreads.filter(t => t.status === 'open').length),        color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'En curso',  value: String(localThreads.filter(t => t.status === 'in_progress').length), color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
                { label: 'Resueltos', value: String(localThreads.filter(t => t.status === 'resolved').length),    color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: '14px 16px', border: `1.5px solid ${s.border}` }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', opacity: 0.7 }}>{s.label}</p>
                  <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color: s.color, margin: 0, letterSpacing: '-0.5px' }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Botón nuevo ticket */}
            <button onClick={() => setShowNew(!showNew)} className="new-ticket-btn"
              style={{ width: '100%', padding: '15px 20px', borderRadius: 18, border: showNew ? '2px solid #bfdbfe' : '2px solid #3b82f6', background: showNew ? '#eff6ff' : '#fff', color: '#1d4ed8', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(59,130,246,0.1)', fontFamily: F, animation: 'fadeUp 0.2s ease 0.05s both', transition: 'all 0.15s' }}>
              <span>{showNew ? 'Cancelar' : 'Nuevo ticket de soporte'}</span>
              {showNew
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              }
            </button>

            {/* Form nuevo ticket */}
            {showNew && (
              <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #bfdbfe', boxShadow: '0 4px 20px rgba(59,130,246,0.08)', animation: 'slideUp 0.2s ease both' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: '#eff6ff', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Nuevo ticket</p>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'block' }}>Asunto</label>
                  <div className="inp-focus" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, transition: 'all 0.15s' }}>
                    <input style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }}
                      placeholder="Describe brevemente el problema" value={subject} onChange={e => setSubject(e.target.value)} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'block' }}>Mensaje</label>
                  <textarea
                    style={{ width: '100%', padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: F, minHeight: 100, resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' } as React.CSSProperties}
                    placeholder="Explica tu consulta con detalle..."
                    value={ticketMsg}
                    onChange={e => setTicketMsg(e.target.value)}
                  />
                </div>

                <button onClick={createTicket} disabled={sending || !subject || !ticketMsg}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: (!subject || !ticketMsg) ? '#f1f5f9' : 'linear-gradient(135deg,#3b82f6,#2563eb)', color: (!subject || !ticketMsg) ? '#94a3b8' : '#fff', cursor: (!subject || !ticketMsg) ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: (!subject || !ticketMsg) ? 'none' : '0 4px 14px rgba(59,130,246,0.25)' }}>
                  {sending
                    ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                  {sending ? 'Enviando...' : 'Enviar ticket'}
                </button>
              </div>
            )}

            {/* Lista threads */}
            {localThreads.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 24, padding: '48px 24px', textAlign: 'center', border: '1.5px dashed #e2e8f0', animation: 'fadeUp 0.2s ease 0.1s both' }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: '#eff6ff', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Sin tickets todavía</p>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.6 }}>
                  Crea un ticket para contactar con nuestro equipo. Respondemos en menos de 24h.
                </p>
                <button onClick={() => setShowNew(true)}
                  style={{ padding: '11px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F }}>
                  Crear primer ticket
                </button>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.1s both' }}>
                {localThreads.map((t, i) => {
                  const st  = STATUS[t.status] ?? STATUS.open
                  const last = t.support_messages?.[t.support_messages.length - 1]
                  const unread = t.support_messages?.filter((m: any) => m.sender === 'admin').length > 0
                  return (
                    <div key={t.id} className="thread-row" onClick={() => setSelected(t)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(12px,3vw,16px) clamp(14px,3vw,20px)', borderBottom: i < localThreads.length - 1 ? '1px solid #f8fafc' : 'none', background: '#fff' }}>

                      <div style={{ width: 42, height: 42, borderRadius: 13, background: st.bg, border: `1.5px solid ${st.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={st.color} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t.subject}</p>
                          {unread && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, animation: 'pulse 2s infinite' }} />}
                        </div>
                        {last && (
                          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {last.sender === 'admin' ? '← ' : '→ '}{last.content}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                          {st.label}
                        </span>
                        <p style={{ fontSize: 10, color: '#cbd5e1', margin: 0 }}>
                          {new Date(t.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Info soporte */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,20px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.15s both' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Horario de soporte</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: '⚡', label: 'Respuesta media',   value: '< 24 horas' },
                  { icon: '📅', label: 'Disponibilidad',    value: 'Lun – Vie, 9h – 18h' },
                  { icon: '✉️', label: 'Email directo',     value: 'hola@samgple.com' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{r.icon}</span>
                      <span style={{ fontSize: 13, color: '#64748b' }}>{r.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── CHAT ── */}
        {selected && (
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>

            {/* Mensajes */}
            <div className="msg-scroll" style={{ flex: 1, overflowY: 'auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.support_messages?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0', animation: 'fadeUp 0.2s ease both' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: '#eff6ff', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Ticket enviado</p>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Nuestro equipo te responderá pronto</p>
                </div>
              )}

              {selected.support_messages?.map((m: any, i: number) => {
                const isClient = m.sender === 'client'
                const isTemp   = m.id?.startsWith('tmp-')
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isClient ? 'flex-end' : 'flex-start', animation: 'msgIn 0.2s ease both' }}>
                    {!isClient && (
                      <div style={{ width: 30, height: 30, borderRadius: 10, background: 'linear-gradient(135deg,#3b82f6,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0, marginRight: 8, alignSelf: 'flex-end' }}>S</div>
                    )}
                    <div style={{ maxWidth: 'min(75%, 340px)', padding: '11px 15px', borderRadius: isClient ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: isClient ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : '#fff', border: isClient ? 'none' : '1.5px solid #f1f5f9', boxShadow: isClient ? '0 4px 12px rgba(59,130,246,0.25)' : '0 2px 8px rgba(0,0,0,0.04)', opacity: isTemp ? 0.7 : 1 }}>
                      {!isClient && (
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Soporte SAMGPLE</p>
                      )}
                      <p style={{ fontSize: 14, color: isClient ? '#fff' : '#0f172a', margin: 0, lineHeight: 1.55 }}>{m.content}</p>
                      <p style={{ fontSize: 10, color: isClient ? 'rgba(255,255,255,0.55)' : '#94a3b8', margin: '5px 0 0', textAlign: 'right' }}>
                        {isTemp ? 'Enviando...' : new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input mensaje */}
            <div style={{ padding: 'clamp(12px,2vw,16px) clamp(16px,4vw,32px)', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', maxWidth: 680, margin: '0 auto' }}>
                <div className="inp-focus"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 16, transition: 'all 0.15s', minHeight: 48 }}>
                  <input
                    style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }}
                    placeholder="Escribe tu mensaje..."
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && newMsg.trim()) { e.preventDefault(); sendMessage() } }}
                  />
                </div>
                <button onClick={sendMessage} disabled={!newMsg.trim() || sending} className="send-btn"
                  style={{ width: 48, height: 48, borderRadius: 16, border: 'none', background: !newMsg.trim() ? '#f1f5f9' : 'linear-gradient(135deg,#3b82f6,#2563eb)', color: !newMsg.trim() ? '#94a3b8' : '#fff', cursor: !newMsg.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: newMsg.trim() ? '0 4px 14px rgba(59,130,246,0.3)' : 'none', transition: 'all 0.15s' }}>
                  {sending
                    ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}