'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'

const STATUS: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  pending:   { label: 'Pendiente',   color: '#92400e', bg: '#fef3c7', border: '#fde68a', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  in_review: { label: 'En revisión', color: '#6d28d9', bg: '#ede9fe', border: '#c4b5fd', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
  sent:      { label: 'Enviada',     color: '#15803d', bg: '#dcfce7', border: '#bbf7d0', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  rejected:  { label: 'Rechazada',   color: '#b91c1c', bg: '#fee2e2', border: '#fecaca', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
}

export default function FacturasClient({ invoices, accountId }: { invoices: any[]; accountId: string }) {
  const [local, setLocal]   = useState(invoices)
  const [notes, setNotes]   = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]       = useState('')
  const [error, setError]   = useState('')

  useRealtime([{
    table: 'invoice_requests',
    filter: `account_id=eq.${accountId}`,
    onInsert: (i: any) => setLocal(prev => [i, ...prev]),
    onUpdate: (i: any) => setLocal(prev => prev.map(x => x.id === i.id ? { ...x, ...i } : x)),
  }])

  async function handleRequest() {
    setLoading(true)
    setMsg('')
    setError('')
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      if (data.invoice) {
        setMsg('Solicitud enviada correctamente')
        setNotes('')
        setTimeout(() => setMsg(''), 4000)
      } else {
        setError(data.error ?? 'Error al enviar la solicitud')
      }
    } finally { setLoading(false) }
  }

  const pendingCount  = local.filter(i => i.status === 'pending').length
  const sentCount     = local.filter(i => i.status === 'sent').length

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .inp-wrap { transition:border-color 0.15s,box-shadow 0.15s; }
        .inp-wrap:focus-within { border-color:#8b5cf6!important; box-shadow:0 0 0 3px rgba(139,92,246,0.08)!important; }
        .btn-request { transition:all 0.15s ease; }
        .btn-request:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(139,92,246,0.25)!important; }
        .btn-request:active:not(:disabled) { transform:scale(0.98); }
        .inv-row { transition:background 0.1s; }
        .inv-row:hover { background:#f8fafc; border-radius:14px; }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/configuracion"
              style={{ width: 36, height: 36, borderRadius: 11, background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Facturas</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Solicita y gestiona tus facturas · Realtime</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>En vivo</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, animation: 'fadeUp 0.2s ease both' }}>
            {[
              { label: 'Total',      value: String(local.length),  color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff' },
              { label: 'Pendientes', value: String(pendingCount),  color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
              { label: 'Enviadas',   value: String(sentCount),     color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: '14px 16px', border: `1.5px solid ${s.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', opacity: 0.7 }}>{s.label}</p>
                <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color: s.color, margin: 0, letterSpacing: '-0.5px' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Solicitar factura */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.05s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(139,92,246,0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Nueva solicitud</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>El equipo la procesará en menos de 48h</p>
              </div>
            </div>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7, display: 'block' }}>
              Notas adicionales (opcional)
            </label>
            <div className="inp-wrap" style={{ border: '1.5px solid #f1f5f9', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ej: Factura enero 2025, periodo trimestral, datos fiscales específicos..."
                style={{ width: '100%', padding: '13px 16px', background: '#f8fafc', border: 'none', fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: F, minHeight: 90, resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', fontWeight: 400 } as React.CSSProperties}
              />
            </div>

            {/* Feedback */}
            {msg && (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, animation: 'popIn 0.2s ease both' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 600 }}>{msg}</p>
              </div>
            )}
            {error && (
              <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, animation: 'popIn 0.2s ease both' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>{error}</p>
              </div>
            )}

            <button onClick={handleRequest} disabled={loading} className="btn-request"
              style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: loading ? '#f1f5f9' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: loading ? '#94a3b8' : '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: loading ? 'none' : '0 4px 20px rgba(139,92,246,0.3)' }}>
              {loading ? (
                <>
                  <div style={{ width: 15, height: 15, border: '2px solid #e2e8f0', borderTopColor: '#94a3b8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Enviando solicitud...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  Solicitar factura
                </>
              )}
            </button>
          </div>

          {/* Historial */}
          {local.length > 0 && (
            <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.1s both' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Historial</p>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#faf5ff', color: '#8b5cf6', border: '1px solid #e9d5ff' }}>
                  {local.length} solicitud{local.length !== 1 ? 'es' : ''}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {local.map((inv, i) => {
                  const st = STATUS[inv.status] ?? STATUS.pending
                  return (
                    <div key={inv.id} className="inv-row"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 8px', borderBottom: i < local.length - 1 ? '1px solid #f8fafc' : 'none', animation: `fadeUp 0.2s ease ${i * 0.03}s both` }}>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: st.bg, border: `1.5px solid ${st.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={st.color} strokeWidth="2" strokeLinecap="round">
                            <path d={st.icon}/>
                          </svg>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inv.period ?? 'Factura'}
                          </p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                            {new Date(inv.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                          {inv.notes && (
                            <p style={{ fontSize: 11, color: '#64748b', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                              {inv.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div style={{ flexShrink: 0, marginLeft: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '5px 11px', borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}>
                          {inv.status === 'pending' && <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.color, display: 'inline-block', animation: 'pulse 2s infinite' }} />}
                          {st.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {local.length === 0 && (
            <div style={{ background: '#fff', borderRadius: 24, padding: '48px 24px', textAlign: 'center', border: '1.5px dashed #e2e8f0', animation: 'fadeUp 0.2s ease 0.1s both' }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: '#faf5ff', border: '1.5px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Sin facturas todavía</p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                Solicita tu primera factura usando el formulario de arriba. La recibirás en menos de 48h.
              </p>
            </div>
          )}

          {/* Info proceso */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,20px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.15s both' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Proceso de facturación</p>
            {[
              { n: '1', title: 'Solicita la factura',   desc: 'Rellena las notas si necesitas algo específico', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff' },
              { n: '2', title: 'Revisamos tu solicitud', desc: 'El equipo la procesa en menos de 48 horas',      color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
              { n: '3', title: 'Recibes la factura',    desc: 'Te la enviamos al email de tu cuenta',           color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
            ].map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: 12, padding: '8px', marginBottom: i < 2 ? 4 : 0, borderRadius: 12, transition: 'background 0.1s' }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: s.bg, border: `1.5px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.n}</span>
                </div>
                <div style={{ paddingTop: 3 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}