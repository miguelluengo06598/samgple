'use client'

import { useState } from 'react'

const F = 'system-ui,-apple-system,sans-serif'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '', demo: false })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const inp: React.CSSProperties = { width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: F, boxSizing: 'border-box' }
  const label: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return
    setSending(true)
    // Aquí conectarías con tu API de email (Resend, etc.)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ background: '#f0fdf4', borderRadius: 24, padding: '48px 32px', textAlign: 'center', border: '1.5px solid #bbf7d0' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>¡Mensaje enviado!</h3>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>Te responderemos en menos de 24 horas. Mientras tanto, puedes <a href="/registro" style={{ color: '#5da7ec', fontWeight: 600 }}>crear tu cuenta gratis</a>.</p>
      </div>
    )
  }

  return (
    <div style={{ background: '#fff', borderRadius: 24, padding: '32px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={label}>Nombre</label>
            <input style={inp} placeholder="Tu nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label style={label}>Email</label>
            <input style={inp} type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label style={label}>Empresa (opcional)</label>
          <input style={inp} placeholder="Nombre de tu tienda o empresa" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
        </div>
        <div>
          <label style={label}>Mensaje</label>
          <textarea style={{ ...inp, minHeight: 120, resize: 'vertical', lineHeight: 1.6 } as React.CSSProperties} placeholder="Cuéntanos tu situación actual con pedidos COD..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: '#f0f7ff', border: '1.5px solid #bfdbfe', cursor: 'pointer' }} onClick={() => setForm(p => ({ ...p, demo: !p.demo }))}>
          <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${form.demo ? '#5da7ec' : '#cbd5e1'}`, background: form.demo ? '#5da7ec' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
            {form.demo && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1d4ed8' }}>Quiero una demo personalizada gratuita</span>
        </div>
        <button onClick={handleSubmit} disabled={sending || !form.name || !form.email || !form.message}
          style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: (!form.name || !form.email || !form.message) ? '#e2e8f0' : '#5da7ec', color: (!form.name || !form.email || !form.message) ? '#94a3b8' : '#fff', fontSize: 14, fontWeight: 700, cursor: (!form.name || !form.email || !form.message) ? 'not-allowed' : 'pointer', fontFamily: F, transition: 'all 0.15s' }}>
          {sending ? 'Enviando...' : 'Enviar mensaje →'}
        </button>
      </div>
    </div>
  )
}