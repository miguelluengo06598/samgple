'use client'

import { useState } from 'react'

export default function ContactForm() {
  // ── LÓGICA SAGRADA — sin tocar ───────────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    orders: '',
    message: '',
    demo: false,
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
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Error al enviar. Inténtalo de nuevo.')
      else setSent(true)
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setSending(false)
    }
  }

  const isReady = !!(form.name && form.email && form.message)
  // ── fin LÓGICA SAGRADA ────────────────────────────────────────────────────

  if (sent) return (
    <>
      <style>{STYLES}</style>
      <div className="cf-success">
        <div className="cf-check">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 className="cf-success-title">Mensaje recibido</h3>
        <p className="cf-success-sub">
          Te respondemos en menos de 24 h
          {form.whatsapp ? ' por WhatsApp' : ''}.
          Mientras tanto puedes crear tu cuenta gratis.
        </p>
        <a href="/registro" className="cf-success-btn">
          Empezar gratis
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </>
  )

  return (
    <>
      <style>{STYLES}</style>

      <div className="cf-wrap">
        {/* Header */}
        <div className="cf-header">
          <div className="cf-live">
            <span className="cf-dot" />
            <span>Respuesta en &lt; 24 h</span>
          </div>
          <h2 className="cf-title">Empieza a recuperar<br/><span>pedidos hoy</span></h2>
          <p className="cf-sub">Cuéntanos tu situación y te mostramos cuánto puedes recuperar.</p>
        </div>

        {/* Stats strip */}
        <div className="cf-stats">
          {[['94%','confirmación'],['3 min','setup'],['0 €','prueba']].map(([v,l]) => (
            <div key={l} className="cf-stat">
              <span className="cf-stat-val">{v}</span>
              <span className="cf-stat-label">{l}</span>
            </div>
          ))}
        </div>

        {/* Fields */}
        <div className="cf-fields">

          {/* Fila 1: nombre + email */}
          <div className="cf-row2">
            <CfField label="Nombre" required>
              <CfInput placeholder="Tu nombre" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
            </CfField>
            <CfField label="Email" required>
              <CfInput type="email" placeholder="tu@email.com" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
            </CfField>
          </div>

          {/* Fila 2: WhatsApp + empresa */}
          <div className="cf-row2">
            <CfField label="WhatsApp">
              <div className="cf-wa-wrap">
                <span className="cf-wa-prefix">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.428a.75.75 0 00.921.908l5.687-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.93-1.344l-.354-.21-3.668.961.976-3.564-.23-.368A9.719 9.719 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                </span>
                <CfInput
                  className="cf-wa-input"
                  type="tel"
                  placeholder="+34 600 000 000"
                  value={form.whatsapp}
                  onChange={e => setForm(p => ({...p, whatsapp: e.target.value}))}
                />
              </div>
            </CfField>
            <CfField label="Empresa">
              <CfInput placeholder="Nombre de tu tienda" value={form.company} onChange={e => setForm(p => ({...p, company: e.target.value}))} />
            </CfField>
          </div>

          {/* Fila 3: pedidos/mes */}
          <CfField label="Pedidos / mes">
            <CfSelect value={form.orders} onChange={e => setForm(p => ({...p, orders: e.target.value}))}>
              <option value="">Seleccionar…</option>
              <option value="<50">Menos de 50</option>
              <option value="50-200">50 – 200</option>
              <option value="200-500">200 – 500</option>
              <option value="500+">Más de 500</option>
            </CfSelect>
          </CfField>

          {/* Mensaje */}
          <CfField label="Mensaje" required>
            <CfTextarea
              placeholder="Cuéntanos tu tasa de devoluciones actual, qué canales usas o cualquier duda sobre la integración."
              value={form.message}
              onChange={e => setForm(p => ({...p, message: e.target.value}))}
            />
          </CfField>

          {/* Demo toggle */}
          <button
            type="button"
            onClick={() => setForm(p => ({...p, demo: !p.demo}))}
            className={`cf-demo-toggle ${form.demo ? 'active' : ''}`}
          >
            <span className={`cf-checkbox ${form.demo ? 'checked' : ''}`}>
              {form.demo && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </span>
            <span className="cf-demo-text">
              <span className="cf-demo-main">Quiero una demo personalizada gratuita</span>
              <span className="cf-demo-hint">Panel en vivo con datos de tu sector · 30 min</span>
            </span>
          </button>

          {/* Error */}
          {error && <p className="cf-error">⚠ {error}</p>}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            className={`cf-submit ${isReady ? 'ready' : ''}`}
          >
            {sending ? (
              <><span className="cf-spinner"/> Enviando…</>
            ) : isReady ? (
              <>Enviar mensaje <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
            ) : (
              'Completa los campos obligatorios'
            )}
          </button>

          <p className="cf-footnote">
            Sin tarjeta · Sin permanencia ·{' '}
            <a href="/privacidad">Privacidad</a>
          </p>
        </div>
      </div>
    </>
  )
}

function CfField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="cf-field">
      <label className="cf-label">{label}{required && <span className="cf-req">*</span>}</label>
      {children}
    </div>
  )
}

function CfInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`cf-input ${className}`} {...props} />
}

function CfSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="cf-select" {...props} />
}

function CfTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="cf-textarea" {...props} />
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap');

  @keyframes cf-spin  { to { transform: rotate(360deg); } }
  @keyframes cf-in    { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
  @keyframes cf-check { from { transform: scale(0.5); opacity:0; } to { transform: scale(1); opacity:1; } }
  @keyframes cf-pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

  .cf-wrap {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: clamp(24px,4vw,36px);
    position: sticky;
    top: 88px;
    animation: cf-in .4s cubic-bezier(.16,1,.3,1) both;
  }

  .cf-header { margin-bottom: 20px; }

  .cf-live {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10px;
    font-weight: 600;
    color: #0f766e;
    letter-spacing: .07em;
    text-transform: uppercase;
    margin-bottom: 14px;
  }
  .cf-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #2EC4B6;
    animation: cf-pulse 2s infinite;
    display: inline-block;
  }

  .cf-title {
    font-size: clamp(20px,2.8vw,26px);
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px;
    letter-spacing: -.6px;
    line-height: 1.2;
  }
  .cf-title span { color: #2EC4B6; }

  .cf-sub {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
    line-height: 1.6;
  }

  .cf-stats {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 8px;
    margin-bottom: 22px;
    padding: 14px 0;
    border-top: 1px solid #f3f4f6;
    border-bottom: 1px solid #f3f4f6;
  }
  .cf-stat { text-align: center; }
  .cf-stat-val {
    display: block;
    font-size: 17px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -.5px;
  }
  .cf-stat-label {
    display: block;
    font-size: 10px;
    color: #9ca3af;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .06em;
    margin-top: 2px;
  }

  .cf-fields { display: flex; flex-direction: column; gap: 12px; }

  .cf-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media(max-width:480px) { .cf-row2 { grid-template-columns: 1fr; } }

  .cf-field { display: flex; flex-direction: column; gap: 5px; }

  .cf-label {
    font-size: 11px;
    font-weight: 600;
    color: #374151;
    letter-spacing: .04em;
  }
  .cf-req { color: #2EC4B6; margin-left: 2px; }

  .cf-input, .cf-select, .cf-textarea {
    width: 100%;
    padding: 10px 13px;
    border-radius: 9px;
    border: 1px solid #e5e7eb;
    background: #fafafa;
    font-size: 13px;
    font-family: inherit;
    color: #0f172a;
    outline: none;
    box-sizing: border-box;
    transition: border-color .15s, background .15s, box-shadow .15s;
    -webkit-appearance: none;
  }
  .cf-input::placeholder, .cf-textarea::placeholder { color: #9ca3af; }
  .cf-input:focus, .cf-select:focus, .cf-textarea:focus {
    border-color: #2EC4B6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(46,196,182,.1);
  }
  .cf-input:hover:not(:focus), .cf-select:hover:not(:focus), .cf-textarea:hover:not(:focus) {
    border-color: #d1d5db;
    background: #fff;
  }

  .cf-select {
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='7' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239ca3af' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 13px center;
    padding-right: 34px;
    cursor: pointer;
  }

  .cf-textarea {
    min-height: 96px;
    resize: vertical;
    line-height: 1.65;
  }

  /* WhatsApp input */
  .cf-wa-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .cf-wa-prefix {
    position: absolute;
    left: 11px;
    display: flex;
    align-items: center;
    pointer-events: none;
    z-index: 1;
  }
  .cf-wa-input {
    padding-left: 34px !important;
  }

  .cf-demo-toggle {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 12px 13px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    background: #fafafa;
    cursor: pointer;
    transition: border-color .15s, background .15s;
    width: 100%;
    text-align: left;
    font-family: inherit;
  }
  .cf-demo-toggle:hover { border-color: #d1d5db; background: #fff; }
  .cf-demo-toggle.active { border-color: #2EC4B6; background: #f0fdf9; }

  .cf-checkbox {
    width: 17px; height: 17px;
    border-radius: 5px;
    border: 1.5px solid #d1d5db;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all .15s;
  }
  .cf-checkbox.checked { background: #2EC4B6; border-color: #2EC4B6; }

  .cf-demo-text { display: flex; flex-direction: column; gap: 2px; }
  .cf-demo-main { font-size: 12px; font-weight: 600; color: #374151; }
  .cf-demo-hint { font-size: 11px; color: #9ca3af; }
  .cf-demo-toggle.active .cf-demo-main { color: #0f766e; }

  .cf-error {
    font-size: 12px;
    color: #dc2626;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 10px 12px;
    margin: 0;
  }

  .cf-submit {
    width: 100%;
    padding: 12px 20px;
    border-radius: 10px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all .15s;
    background: #f3f4f6;
    color: #9ca3af;
  }
  .cf-submit.ready { background: #0f172a; color: #fff; }
  .cf-submit.ready:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(15,23,42,.2); }
  .cf-submit.ready:active { transform: translateY(0); }
  .cf-submit:disabled { opacity: .7; cursor: not-allowed; }

  .cf-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(255,255,255,.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: cf-spin .7s linear infinite;
    flex-shrink: 0;
  }

  .cf-footnote {
    font-size: 11px;
    color: #9ca3af;
    text-align: center;
    margin: 0;
    line-height: 1.6;
  }
  .cf-footnote a { color: #6b7280; text-decoration: none; }
  .cf-footnote a:hover { color: #374151; }

  .cf-success {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: clamp(40px,6vw,60px) clamp(24px,4vw,40px);
    text-align: center;
    animation: cf-in .4s cubic-bezier(.16,1,.3,1) both;
  }
  .cf-check {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 18px;
    animation: cf-check .4s cubic-bezier(.34,1.56,.64,1) both;
  }
  .cf-success-title {
    font-size: 21px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px;
    letter-spacing: -.5px;
  }
  .cf-success-sub {
    font-size: 13px;
    color: #6b7280;
    margin: 0 auto 22px;
    max-width: 280px;
    line-height: 1.65;
  }
  .cf-success-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 20px;
    border-radius: 10px;
    background: #0f172a;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    font-family: inherit;
    text-decoration: none;
    transition: all .15s;
  }
  .cf-success-btn:hover { background: #1e293b; transform: translateY(-1px); }
`