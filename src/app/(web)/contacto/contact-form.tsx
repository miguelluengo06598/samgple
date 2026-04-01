'use client'

import { useState } from 'react'

const F = 'system-ui,-apple-system,sans-serif'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', orders: '', message: '', demo: false,
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    border: '1.5px solid #e2e8f0', background: '#f8fafc',
    fontSize: 14, color: '#0f172a', outline: 'none',
    fontFamily: F, boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const label: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#374151',
    marginBottom: 6, display: 'block',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      setError('Por favor rellena nombre, email y mensaje.')
      return
    }
    setError('')
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ background: '#f0fdf4', borderRadius: 24, padding: '56px 32px', textAlign: 'center', border: '1.5px solid #bbf7d0', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(34,197,94,0.3)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.5px' }}>¡Mensaje enviado!</h3>
        <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>
          Te respondemos en menos de 24 horas. Mientras tanto, puedes reservar una llamada abajo o crear tu cuenta gratis.
        </p>
        <a href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '12px 24px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(93,167,236,0.3)' }}>
          Crear cuenta gratis →
        </a>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 24, padding: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', position: 'sticky', top: 88 }}>
      <p style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.3px' }}>Escríbenos</p>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px' }}>Respondemos en menos de 24 horas</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={label}>Nombre *</label>
            <input style={inp} placeholder="Tu nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label style={label}>Email *</label>
            <input style={inp} type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={label}>Empresa</label>
            <input style={inp} placeholder="Nombre de tu tienda" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
          </div>
          <div>
            <label style={label}>Pedidos/mes</label>
            <select style={{ ...inp, cursor: 'pointer' }} value={form.orders} onChange={e => setForm(p => ({ ...p, orders: e.target.value }))}>
              <option value="">Seleccionar...</option>
              <option value="<50">Menos de 50</option>
              <option value="50-200">50 - 200</option>
              <option value="200-500">200 - 500</option>
              <option value="500+">Más de 500</option>
            </select>
          </div>
        </div>

        <div>
          <label style={label}>Mensaje *</label>
          <textarea
            style={{ ...inp, minHeight: 110, resize: 'vertical', lineHeight: 1.6 } as React.CSSProperties}
            placeholder="Cuéntanos tu situación con pedidos COD, tasa de devoluciones actual, o lo que necesites..."
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          />
        </div>

        {/* Checkbox demo */}
        <div
          onClick={() => setForm(p => ({ ...p, demo: !p.demo }))}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: form.demo ? '#f0f7ff' : '#f8fafc', border: `1.5px solid ${form.demo ? '#bfdbfe' : '#e2e8f0'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${form.demo ? '#5da7ec' : '#cbd5e1'}`, background: form.demo ? '#5da7ec' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
            {form.demo && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: form.demo ? '#1d4ed8' : '#374151', margin: 0 }}>Quiero una demo personalizada gratuita</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Te mostramos el panel con datos de tu sector</p>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca' }}>
            <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={sending}
          style={{ width: '100%', padding: '14px', borderRadius: 13, border: 'none', background: (!form.name || !form.email || !form.message) ? '#e2e8f0' : '#5da7ec', color: (!form.name || !form.email || !form.message) ? '#94a3b8' : '#fff', fontSize: 14, fontWeight: 700, cursor: (!form.name || !form.email || !form.message) ? 'not-allowed' : 'pointer', fontFamily: F, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: (!form.name || !form.email || !form.message) ? 'none' : '0 4px 14px rgba(93,167,236,0.3)' }}>
          {sending ? (
            <>
              <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Enviando...
            </>
          ) : (
            <>
              Enviar mensaje
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </>
          )}
        </button>

        <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: 0 }}>
          Al enviar aceptas nuestra{' '}
          <a href="#" style={{ color: '#5da7ec', textDecoration: 'none' }}>política de privacidad</a>
        </p>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}