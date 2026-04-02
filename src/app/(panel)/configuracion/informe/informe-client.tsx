'use client'

import { useState } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function InformeClient({ lastReport }: { lastReport?: any }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState('')
  const [error, setError]     = useState('')

  // Calcular si puede solicitar (cada 2 días)
  const canRequest = !lastReport || (() => {
    const last = new Date(lastReport.created_at)
    const diff = (Date.now() - last.getTime()) / (1000 * 60 * 60)
    return diff >= 48
  })()

  const hoursUntilNext = lastReport ? (() => {
    const last = new Date(lastReport.created_at)
    const diff = 48 - (Date.now() - last.getTime()) / (1000 * 60 * 60)
    return Math.max(0, Math.ceil(diff))
  })() : 0

  async function handleReport() {
    if (!canRequest) return
    setLoading(true)
    setMsg('')
    setError('')
    try {
      const res = await fetch('/api/reports/request', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setMsg('Informe generado y enviado a tu email')
      } else {
        setError(data.error ?? 'Error al generar el informe')
      }
    } finally { setLoading(false) }
  }

  const includes = [
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', title: 'Resumen ejecutivo',     desc: 'Visión global del rendimiento semanal' },
    { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', title: 'Métricas de pedidos',    desc: 'Confirmados, cancelados y devoluciones' },
    { icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', title: 'Análisis de ingresos',  desc: 'Ingresos reales vs potenciales del periodo' },
    { icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', title: 'IA + Recomendaciones', desc: '3 acciones concretas para la próxima semana' },
    { icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', color: '#d97706', bg: '#fffbeb', border: '#fde68a', title: 'Rendimiento llamadas',  desc: 'Tasa de confirmación y análisis de llamadas' },
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', title: 'Email profesional',     desc: 'Diseño premium enviado directamente a tu correo' },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .btn-report { transition:all 0.15s ease; }
        .btn-report:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 32px rgba(236,72,153,0.3)!important; }
        .btn-report:active:not(:disabled) { transform:scale(0.98); }
        .inc-item { transition:background 0.1s; }
        .inc-item:hover { background:#fdf2f8; border-radius:14px; }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/configuracion"
              style={{ width: 36, height: 36, borderRadius: 11, background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Informe semanal</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Análisis IA completo de tu negocio</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Hero */}
          <div style={{ background: 'linear-gradient(135deg,#be185d,#ec4899,#f472b6)', borderRadius: 24, padding: 'clamp(24px,5vw,36px)', textAlign: 'center', boxShadow: '0 8px 32px rgba(236,72,153,0.25)', position: 'relative', overflow: 'hidden', animation: 'fadeUp 0.2s ease both' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />

            <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'float 3s ease-in-out infinite', position: 'relative' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>

            <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Informe semanal IA</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', margin: '0 0 20px', lineHeight: 1.6 }}>
              Análisis inteligente de tu negocio COD enviado directamente a tu correo con diseño profesional
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '8px 16px', backdropFilter: 'blur(8px)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><polyline points="12 16 12.01 16"/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Disponible cada 48 horas · 0.5 tokens</span>
            </div>
          </div>

          {/* Estado del siguiente informe */}
          {!canRequest && (
            <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,20px)', border: '1.5px solid #fde68a', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.05s both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fffbeb', border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' }}>Próximo informe disponible en</p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: '#d97706', margin: 0, letterSpacing: '-0.5px' }}>
                    {hoursUntilNext}h
                  </p>
                </div>
                {lastReport && (
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px' }}>Último</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontWeight: 600 }}>
                      {new Date(lastReport.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 12, height: 4, background: '#fef3c7', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: 'linear-gradient(90deg,#f59e0b,#d97706)', width: `${Math.max(0, 100 - (hoursUntilNext / 48) * 100)}%`, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          )}

          {/* Incluye */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.1s both' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Qué incluye el informe</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {includes.map((item, i) => (
                <div key={i} className="inc-item"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderBottom: i < includes.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: item.bg, border: `1.5px solid ${item.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 1px' }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{item.desc}</p>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              ))}
            </div>
          </div>

          {/* Coste */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,20px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeUp 0.2s ease 0.15s both' }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 3px' }}>Coste del informe</p>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Sin caducidad · Un token por informe</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, background: '#fdf2f8', padding: '10px 18px', borderRadius: 16, border: '1.5px solid #fbcfe8' }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#db2777', letterSpacing: '-1px' }}>0.5</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#db2777' }}>tokens</span>
            </div>
          </div>

          {/* Feedback */}
          {msg && (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, animation: 'popIn 0.2s ease both' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#15803d', margin: '0 0 2px' }}>{msg}</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Revisa tu bandeja de entrada en los próximos minutos</p>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, animation: 'popIn 0.2s ease both' }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {/* Botón */}
          <button onClick={handleReport} disabled={loading || !canRequest} className="btn-report"
            style={{ width: '100%', padding: '17px', borderRadius: 20, border: 'none', background: !canRequest ? '#f1f5f9' : loading ? '#fdf2f8' : 'linear-gradient(135deg,#be185d,#ec4899)', color: !canRequest ? '#94a3b8' : loading ? '#db2777' : '#fff', cursor: (!canRequest || loading) ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: canRequest && !loading ? '0 6px 24px rgba(236,72,153,0.3)' : 'none', animation: 'fadeUp 0.2s ease 0.2s both' }}>
            {loading ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid rgba(219,39,119,0.3)', borderTopColor: '#db2777', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Generando informe IA...
              </>
            ) : !canRequest ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Disponible en {hoursUntilNext}h
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                Generar y enviar informe
              </>
            )}
          </button>

          {canRequest && (
            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', margin: '-4px 0 0' }}>
              Se enviará al email de tu cuenta · Próximo disponible en 48h
            </p>
          )}

        </div>
      </div>
    </>
  )
}