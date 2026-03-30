'use client'

import { useState } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function InformeClient() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleReport() {
    setLoading(true); setMsg('')
    try {
      const res = await fetch('/api/reports/request', { method: 'POST' })
      const data = await res.json()
      setMsg(data.ok ? '✓ Informe generado y enviado a tu email' : `✕ ${data.error}`)
    } finally { setLoading(false) }
  }

  const items = [
    { icon: '📈', text: 'Resumen ejecutivo de la semana' },
    { icon: '📦', text: 'Pedidos, entregas, cancelados y devoluciones' },
    { icon: '💰', text: 'Ingresos generados en el periodo' },
    { icon: '🤖', text: 'Análisis IA con puntos fuertes y mejoras' },
    { icon: '🎯', text: '3 recomendaciones para la próxima semana' },
    { icon: '✉️', text: 'Enviado con diseño profesional a tu email' },
  ]

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/configuracion" style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Informe semanal</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Análisis IA de tu negocio</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        <div style={{ background: 'linear-gradient(135deg,#ec4899,#db2777)', borderRadius: 20, padding: '28px 20px', textAlign: 'center', marginBottom: 10, boxShadow: '0 4px 20px rgba(236,72,153,0.25)' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 16, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 4px', fontFamily: F }}>Informe semanal IA</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, fontFamily: F }}>Análisis completo enviado a tu email</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #e8f4f3', marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', fontFamily: F }}>¿Qué incluye?</p>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 13, color: '#374151', fontFamily: F, lineHeight: 1.4 }}>{item.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf2f8', borderRadius: 16, padding: '14px 18px', marginBottom: 10, border: '1px solid #fbcfe8' }}>
          <span style={{ fontSize: 13, color: '#9d174d', fontWeight: 500, fontFamily: F }}>Coste del informe</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#db2777', fontFamily: F }}>0.5</span>
            <span style={{ fontSize: 13, color: '#db2777', fontFamily: F }}>tokens</span>
          </div>
        </div>

        <button onClick={handleReport} disabled={loading} style={{ width: '100%', padding: '15px 18px', borderRadius: 16, border: '2px solid #ec4899', background: '#fff', color: '#db2777', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(236,72,153,0.12)', fontFamily: F, opacity: loading ? 0.6 : 1 }}>
          <span>{loading ? 'Generando informe...' : 'Generar y enviar informe'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </button>

        {msg && (
          <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 14, background: msg.startsWith('✓') ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}` }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: msg.startsWith('✓') ? '#15803d' : '#dc2626', margin: 0, textAlign: 'center', fontFamily: F }}>{msg}</p>
          </div>
        )}
      </div>
    </div>
  )
}