// contacto/contact-form.tsx
'use client'

import { useState } from 'react'

const F = 'system-ui,-apple-system,sans-serif'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', company: '', orders: '', message: '', demo: false })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) { setError('Por favor rellena nombre, email y mensaje.'); return }
    setError(''); setSending(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Error al enviar. Inténtalo de nuevo.')
      else setSent(true)
    } catch { setError('Error de conexión. Inténtalo de nuevo.') }
    finally { setSending(false) }
  }

  const isReady = !!(form.name && form.email && form.message)

  if (sent) return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes starPop { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }
      `}</style>
      <div style={{ background: 'linear-gradient(135deg,#f0fdf9,#ecfdf5)', borderRadius: 24, padding: 'clamp(40px,6vw,64px) clamp(24px,4vw,40px)', textAlign: 'center', border: '1.5px solid #bbf7d0', boxShadow: '0 20px 60px rgba(16,185,129,0.08)', animation: 'fadeUp 0.5s ease', fontFamily: F }}>
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 12px 32px rgba(16,185,129,0.3)', animation: 'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 16 }}>
          {[1,2,3,4,5].map(s => <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" style={{ animation: `starPop .3s ${s * 0.06}s both` }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
        </div>
        <h3 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.5px' }}>¡Hablamos pronto!</h3>
        <p style={{ fontSize: 14, color: '#475569', margin: '0 0 28px', lineHeight: 1.7, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
          Nuestro equipo te responde en menos de 24h. Mientras tanto, empieza gratis y analiza tus primeros pedidos hoy.
        </p>
        <a href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '13px 26px', borderRadius: 13, background: 'linear-gradient(135deg,#2EC4B6,#059669)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(46,196,182,0.35)' }}>
          Crear cuenta gratis
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .cf-inp { width:100%; padding:12px 15px; border-radius:13px; border:1.5px solid #f1f5f9; background:#f8fafc; font-size:14px; color:#0f172a; outline:none; font-family:${F}; box-sizing:border-box; transition:border-color 0.15s,background 0.15s,box-shadow 0.15s; }
        .cf-inp:focus { border-color:#2EC4B6; background:#fff; box-shadow:0 0 0 3px rgba(46,196,182,0.1); }
        .cf-inp:hover:not(:focus) { border-color:#e2e8f0; background:#fff; }
        .cf-sel { appearance:none; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394a3b8' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; }
        .cf-btn { width:100%; padding:15px; border-radius:14px; border:none; font-size:14px; font-weight:700; font-family:${F}; display:flex; align-items:center; justify-content:center; gap:9px; cursor:pointer; transition:all 0.18s cubic-bezier(0.34,1.56,0.64,1); will-change:transform; }
        .cf-btn:not(:disabled):hover { transform:translateY(-1px); }
        .cf-btn:not(:disabled):active { transform:scale(0.97); }
        .cf-btn:disabled { cursor:not-allowed; }
        .cf-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        @media(max-width:480px) { .cf-grid2 { grid-template-columns:1fr; } }
      `}</style>

      <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(24px,4vw,36px)', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 6px rgba(0,0,0,0.02),0 20px 60px rgba(0,0,0,0.06)', position: 'sticky', top: 88, fontFamily: F, animation: 'fadeIn 0.4s ease' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(46,196,182,0.08)', border: '1px solid rgba(46,196,182,0.2)', borderRadius: 20, padding: '4px 12px', marginBottom: 14 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#0f766e', letterSpacing: '0.07em' }}>RESPUESTA EN &lt; 24H</span>
          </div>
          <h2 style={{ fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px', lineHeight: 1.25 }}>
            Empieza a recuperar<br /><span style={{ color: '#2EC4B6' }}>pedidos perdidos hoy</span>
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            Cuéntanos tu situación y te mostramos cuánto puedes recuperar.
          </p>
        </div>

        {/* Mini stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 22 }}>
          {[{ val: '94%', label: 'confirmación' }, { val: '3min', label: 'setup' }, { val: '0€', label: 'prueba' }].map(s => (
            <div key={s.label} style={{ background: '#f8fafc', borderRadius: 11, padding: '9px 10px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 1px', letterSpacing: '-0.5px' }}>{s.val}</p>
              <p style={{ fontSize: 9, color: '#94a3b8', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Campos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="cf-grid2">
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Nombre *</label>
              <input className="cf-inp" placeholder="Tu nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Email *</label>
              <input className="cf-inp" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>
          <div className="cf-grid2">
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Empresa</label>
              <input className="cf-inp" placeholder="Nombre de tu tienda" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Pedidos / mes</label>
              <select className="cf-inp cf-sel" value={form.orders} onChange={e => setForm(p => ({ ...p, orders: e.target.value }))}>
                <option value="">Seleccionar...</option>
                <option value="<50">Menos de 50</option>
                <option value="50-200">50 – 200</option>
                <option value="200-500">200 – 500</option>
                <option value="500+">Más de 500</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Mensaje *</label>
            <textarea className="cf-inp" placeholder="Cuéntanos tu tasa de devoluciones actual, qué canales usas o cualquier duda sobre la integración." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              style={{ minHeight: 100, resize: 'vertical', lineHeight: 1.65 }} />
          </div>

          {/* Checkbox demo */}
          <div onClick={() => setForm(p => ({ ...p, demo: !p.demo }))}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, cursor: 'pointer', background: form.demo ? 'rgba(46,196,182,0.05)' : '#f8fafc', border: `1.5px solid ${form.demo ? 'rgba(46,196,182,0.3)' : '#f1f5f9'}`, transition: 'all 0.15s' }}>
            <div style={{ width: 20, height: 20, borderRadius: 7, border: `2px solid ${form.demo ? '#2EC4B6' : '#cbd5e1'}`, background: form.demo ? '#2EC4B6' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', boxShadow: form.demo ? '0 2px 8px rgba(46,196,182,0.3)' : 'none' }}>
              {form.demo && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: form.demo ? '#0f766e' : '#374151', margin: '0 0 2px' }}>Quiero una demo personalizada gratuita</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Panel en vivo con datos de tu sector · 30 minutos</p>
            </div>
          </div>

          {error && (
            <div style={{ padding: '11px 14px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', animation: 'fadeIn 0.2s ease' }}>
              <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>⚠ {error}</p>
            </div>
          )}

          <button onClick={handleSubmit} disabled={sending} className="cf-btn"
            style={{ background: isReady ? 'linear-gradient(135deg,#2EC4B6,#1A9E8F)' : '#f1f5f9', color: isReady ? '#fff' : '#94a3b8', boxShadow: isReady ? '0 6px 20px rgba(46,196,182,0.35)' : 'none' }}>
            {sending ? (
              <>
                <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Enviando...
              </>
            ) : (
              <>
                {isReady ? 'Enviar y hablar con el equipo' : 'Completa los campos obligatorios'}
                {isReady && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
              </>
            )}
          </button>

          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            Sin tarjeta de crédito · Sin permanencia ·{' '}
            <a href="#" style={{ color: '#2EC4B6', textDecoration: 'none', fontWeight: 600 }}>Política de privacidad</a>
          </p>
        </div>
      </div>
    </>
  )
}