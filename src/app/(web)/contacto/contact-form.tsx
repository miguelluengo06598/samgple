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

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      setError('Por favor rellena nombre, email y mensaje.')
      return
    }
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          orders: form.orders,
          message: form.message,
          demo: form.demo,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al enviar. Inténtalo de nuevo.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  const isReady = !!(form.name && form.email && form.message)

  if (sent) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
          @keyframes scaleIn { from { transform:scale(0.7); opacity:0; } to { transform:scale(1); opacity:1; } }
          .sent-wrap { animation: fadeUp 0.5s ease forwards; font-family:'DM Sans',system-ui,sans-serif; }
          .sent-icon { animation: scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both; }
        `}</style>
        <div className="sent-wrap" style={{ background: 'linear-gradient(135deg,#f0fdf9 0%,#ecfdf5 100%)', borderRadius: 28, padding: '64px 32px', textAlign: 'center', border: '1.5px solid #a7f3d0', boxShadow: '0 20px 60px rgba(16,185,129,0.08)' }}>
          <div className="sent-icon" style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 32px rgba(16,185,129,0.3)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '4px 14px', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#065f46', letterSpacing: '0.04em', fontFamily: "'DM Sans',system-ui,sans-serif" }}>MENSAJE ENVIADO</span>
          </div>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.6px', fontFamily: "'DM Sans',system-ui,sans-serif" }}>¡Hablamos pronto!</h3>
          <p style={{ fontSize: 15, color: '#475569', margin: '0 0 32px', lineHeight: 1.7, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto', fontFamily: "'DM Sans',system-ui,sans-serif" }}>
            Nuestro equipo te responde en menos de 24h. Mientras tanto, empieza gratis y verifica tus primeros pedidos hoy.
          </p>
          <a href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '14px 28px', borderRadius: 14, background: 'linear-gradient(135deg,#2EC4B6,#059669)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 24px rgba(46,196,182,0.35)', fontFamily: "'DM Sans',system-ui,sans-serif", letterSpacing: '-0.2px' }}>
            Crear cuenta gratis
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

        .cf-wrap {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #ffffff;
          border-radius: 28px;
          padding: 36px;
          border: 1.5px solid #f1f5f9;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(0,0,0,0.06);
          position: sticky;
          top: 88px;
          animation: fadeIn 0.4s ease forwards;
        }

        .cf-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 7px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }

        .cf-input {
          width: 100%;
          padding: 11px 15px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          font-family: 'DM Sans', system-ui, sans-serif;
          box-sizing: border-box;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        }

        .cf-input:focus {
          border-color: #2EC4B6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(46,196,182,0.12);
        }

        .cf-input:hover:not(:focus) {
          border-color: #cbd5e1;
          background: #fff;
        }

        .cf-textarea {
          min-height: 112px;
          resize: vertical;
          line-height: 1.65;
        }

        .cf-select {
          appearance: none;
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394a3b8' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .cf-checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .cf-btn {
          width: 100%;
          padding: 15px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 700;
          font-family: 'DM Sans', system-ui, sans-serif;
          transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          letter-spacing: -0.2px;
          cursor: pointer;
          will-change: transform;
        }

        .cf-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(46,196,182,0.45) !important;
        }

        .cf-btn:not(:disabled):active {
          transform: scale(0.97);
        }

        .cf-btn:disabled {
          cursor: not-allowed;
        }

        .cf-error {
          padding: 11px 15px;
          border-radius: 11px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          animation: fadeIn 0.2s ease;
        }

        .cf-spinner {
          width: 15px;
          height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .cf-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .cf-wrap { padding: 24px 20px; border-radius: 20px; }
          .cf-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cf-wrap">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(46,196,182,0.08)', border: '1px solid rgba(46,196,182,0.2)', borderRadius: 20, padding: '4px 12px', marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2EC4B6', display: 'inline-block', boxShadow: '0 0 6px rgba(46,196,182,0.5)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', letterSpacing: '0.07em' }}>RESPUESTA EN &lt; 24H</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.6px', lineHeight: 1.2 }}>
            Empieza a recuperar<br />
            <span style={{ color: '#2EC4B6' }}>pedidos perdidos hoy</span>
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            Cuéntanos tu situación y te mostramos cuánto puedes recuperar con verificación por voz IA.
          </p>
        </div>

        {/* Stats rápidos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 28 }}>
          {[
            { val: '94%', label: 'tasa confirmación' },
            { val: '3min', label: 'setup inicial' },
            { val: '0€', label: 'coste de prueba' },
          ].map(s => (
            <div key={s.label} style={{ background: '#f8fafc', borderRadius: 12, padding: '10px 12px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{s.val}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className="cf-grid-2">
            <div>
              <label className="cf-label">Nombre *</label>
              <input className="cf-input" placeholder="Tu nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="cf-label">Email *</label>
              <input className="cf-input" type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          <div className="cf-grid-2">
            <div>
              <label className="cf-label">Empresa</label>
              <input className="cf-input" placeholder="Nombre de tu tienda" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} />
            </div>
            <div>
              <label className="cf-label">Pedidos / mes</label>
              <select className="cf-input cf-select" value={form.orders} onChange={e => setForm(p => ({ ...p, orders: e.target.value }))}>
                <option value="">Seleccionar...</option>
                <option value="<50">Menos de 50</option>
                <option value="50-200">50 - 200</option>
                <option value="200-500">200 - 500</option>
                <option value="500+">Más de 500</option>
              </select>
            </div>
          </div>

          <div>
            <label className="cf-label">Mensaje *</label>
            <textarea
              className={`cf-input cf-textarea`}
              placeholder="Cuéntanos tu tasa de devoluciones actual, qué canales usas (Shopify, WooCommerce...) o cualquier duda sobre la integración."
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            />
          </div>

          {/* Checkbox demo */}
          <div
            onClick={() => setForm(p => ({ ...p, demo: !p.demo }))}
            className="cf-checkbox-wrap"
            style={{
              background: form.demo ? 'rgba(46,196,182,0.06)' : '#f8fafc',
              border: `1.5px solid ${form.demo ? 'rgba(46,196,182,0.3)' : '#e2e8f0'}`,
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${form.demo ? '#2EC4B6' : '#cbd5e1'}`, background: form.demo ? '#2EC4B6' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s', boxShadow: form.demo ? '0 2px 8px rgba(46,196,182,0.35)' : 'none' }}>
              {form.demo && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: form.demo ? '#0f766e' : '#374151', margin: '0 0 2px' }}>Quiero una demo personalizada gratuita</p>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>Te mostramos el panel en vivo con datos de tu sector en 30 minutos</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="cf-error">
              <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>⚠ {error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="cf-btn"
            style={{
              background: isReady
                ? 'linear-gradient(135deg, #2EC4B6 0%, #1A9E8F 100%)'
                : '#e2e8f0',
              color: isReady ? '#fff' : '#94a3b8',
              boxShadow: isReady ? '0 6px 20px rgba(46,196,182,0.35)' : 'none',
            }}
          >
            {sending ? (
              <>
                <div className="cf-spinner" />
                Enviando...
              </>
            ) : (
              <>
                {isReady ? 'Enviar y hablar con el equipo' : 'Completa los campos obligatorios'}
                {isReady && <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
              </>
            )}
          </button>

          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            Sin tarjeta de crédito · Sin permanencia · Al enviar aceptas nuestra{' '}
            <a href="#" style={{ color: '#2EC4B6', textDecoration: 'none', fontWeight: 600 }}>política de privacidad</a>
          </p>
        </div>
      </div>
    </>
  )
}