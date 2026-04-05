// contacto/contact-form.tsx
'use client'

import { useState } from 'react'

/* ─────────────────────────────────────────
   FLOATING LABEL FIELD
   – Label flota al hacer focus o si hay valor
   – Shimmer border: conic-gradient animado
   – Glow on focus: box-shadow teal suave
   – TODA la lógica onChange original intacta
───────────────────────────────────────── */
function FloatField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  as,
  rows,
  options,
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  required?: boolean
  as?: 'textarea' | 'select'
  rows?: number
  options?: { value: string; label: string }[]
}) {
  const [focused, setFocused] = useState(false)
  const isFloated = focused || value.length > 0
  const isSelect  = as === 'select'
  const isArea    = as === 'textarea'

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 16,
        /* Shimmer border trick: padding + conic-gradient background */
        padding: focused ? 1.5 : 1.5,
        background: focused
          ? `conic-gradient(from var(--cf-angle, 0deg),
              #2EC4B6 0%,
              #6366f1 25%,
              #ec4899 50%,
              #f59e0b 75%,
              #2EC4B6 100%)`
          : value.length > 0
          ? 'linear-gradient(135deg,#94a3b8,#cbd5e1)'
          : '#d1d5db',   /* borde gris siempre visible en reposo */
        animation: focused ? 'cf2-border-spin 3s linear infinite' : 'none',
        transition: 'background 0.25s',
      }}
    >
      <div style={{ position: 'relative', borderRadius: 15, overflow: 'hidden' }}>
        {/* Floating label — always visible, floats up on focus/value */}
        <label
          htmlFor={id}
          style={{
            position: 'absolute',
            left: 15,
            top: isFloated ? 8 : isArea ? 15 : '50%',
            transform: isFloated ? 'none' : isArea ? 'none' : 'translateY(-50%)',
            fontSize: isFloated ? 10 : 13,
            fontWeight: isFloated ? 700 : 500,
            // Always dark enough to read — teal when focused, gray-600 at rest
            color: focused ? '#2EC4B6' : isFloated ? '#94a3b8' : '#64748b',
            letterSpacing: isFloated ? '0.06em' : '0',
            textTransform: isFloated ? 'uppercase' as const : 'none' as const,
            pointerEvents: 'none',
            transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
            zIndex: 2,
          }}
        >
          {label}
          {required && <span style={{ color: '#2EC4B6', marginLeft: 2 }}>*</span>}
        </label>

        {/* Shine layer on focus */}
        {focused && (
          <div
            style={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'linear-gradient(105deg,transparent 35%,rgba(46,196,182,0.05) 55%,transparent 72%)',
              backgroundSize: '200% 100%',
              animation: 'cf2-shine 1.1s ease forwards',
            }}
          />
        )}

        {/* Field */}
        {isSelect ? (
          <>
            <select
              id={id}
              value={value}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={()  => setFocused(false)}
              style={{
                width: '100%',
                background: focused ? '#fff' : '#f8fafc',
                border: 'none',
                borderRadius: 15,
                padding: '20px 36px 6px 15px',
                fontSize: 14,
                color: value ? '#0f172a' : '#9ca3af',
                fontFamily: 'system-ui,-apple-system,sans-serif',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                boxShadow: focused
                  ? '0 0 0 2px rgba(46,196,182,0.08)'
                  : 'none',
                transition: 'background 0.2s',
                position: 'relative', zIndex: 2,
                height: 52,
              }}
            >
              <option value="" disabled />
              {options?.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div style={{ position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',zIndex:3 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke={focused ? '#2EC4B6' : '#94a3b8'} strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          </>
        ) : isArea ? (
          <textarea
            id={id}
            value={value}
            rows={rows ?? 4}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
            onFocus={() => setFocused(true)}
            onBlur={()  => setFocused(false)}
            style={{
              width: '100%',
              background: focused ? '#fff' : '#f8fafc',
              border: 'none',
              borderRadius: 15,
              padding: '22px 15px 10px',
              fontSize: 14,
              color: '#0f172a',
              fontFamily: 'system-ui,-apple-system,sans-serif',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.65,
              transition: 'background 0.2s',
              position: 'relative', zIndex: 2,
            }}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onFocus={() => setFocused(true)}
            onBlur={()  => setFocused(false)}
            style={{
              width: '100%',
              height: 52,
              background: focused ? '#fff' : '#f8fafc',
              border: 'none',
              borderRadius: 15,
              padding: '20px 15px 6px',
              fontSize: 14,
              color: '#0f172a',
              fontFamily: 'system-ui,-apple-system,sans-serif',
              outline: 'none',
              transition: 'background 0.2s',
              position: 'relative', zIndex: 2,
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   SHIMMER BUTTON
   Gradiente animado en reposo + sweep de luz
   al pasar el cursor
───────────────────────────────────────── */
function ShimmerButton({
  children,
  onClick,
  disabled,
  ready,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  ready?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        padding: '15px 24px',
        borderRadius: 16,
        border: 'none',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: 'system-ui,-apple-system,sans-serif',
        color: ready ? '#fff' : '#94a3b8',
        background: ready
          ? 'linear-gradient(135deg,#2EC4B6 0%,#1A9E8F 35%,#2EC4B6 70%,#0ea5e9 100%)'
          : '#f1f5f9',
        backgroundSize: ready ? '200% auto' : 'auto',
        animation: ready ? 'cf2-btn-gradient 2.8s linear infinite' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        boxShadow: ready
          ? hovered
            ? '0 12px 32px rgba(46,196,182,0.42), 0 0 0 1px rgba(46,196,182,0.25)'
            : '0 6px 20px rgba(46,196,182,0.28)'
          : 'none',
        transform: ready && hovered && !disabled ? 'translateY(-1px)' : 'none',
        transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s',
      }}
    >
      {/* Sweep shine on hover */}
      {ready && hovered && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'linear-gradient(105deg,transparent 20%,rgba(255,255,255,0.2) 50%,transparent 75%)',
          backgroundSize: '200% 100%',
          animation: 'cf2-btn-sweep 0.55s ease forwards',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </span>
    </button>
  )
}

/* ─────────────────────────────────────────
   MAIN EXPORT
   ✅ Estado 100% original:
     useState({ name, email, company, orders, message, demo })
     setSending / setSent / setError
     handleSubmit → fetch('/api/contact')
     isReady
     setForm(p => ({ ...p, field: value }))
───────────────────────────────────────── */
export default function ContactForm() {
  // ── ESTADO ORIGINAL INTACTO ──
  const [form, setForm] = useState({
    name: '', email: '', company: '', orders: '', message: '', demo: false,
  })
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  // ── SUBMIT ORIGINAL INTACTO ──
  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) {
      setError('Por favor rellena nombre, email y mensaje.')
      return
    }
    setError('')
    setSending(true)
    try {
      const res  = await fetch('/api/contact', {
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

  // ── isReady ORIGINAL INTACTO ──
  const isReady = !!(form.name && form.email && form.message)

  /* ── SUCCESS STATE ── */
  if (sent) return (
    <div style={{
      background: 'linear-gradient(135deg,#f0fdf9,#ecfdf5)',
      borderRadius: 24,
      padding: 'clamp(40px,6vw,64px) clamp(24px,4vw,40px)',
      textAlign: 'center',
      border: '1.5px solid #bbf7d0',
      boxShadow: '0 20px 60px rgba(16,185,129,0.08)',
      animation: 'cf2-fadeup 0.5s ease',
      fontFamily: 'system-ui,-apple-system,sans-serif',
    }}>
      <div style={{
        width: 68, height: 68, borderRadius: '50%',
        background: 'linear-gradient(135deg,#10b981,#059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        boxShadow: '0 12px 32px rgba(16,185,129,0.3)',
        animation: 'cf2-pop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div style={{ display:'flex',gap:2,justifyContent:'center',marginBottom:16 }}>
        {[1,2,3,4,5].map(s => (
          <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"
            style={{ animation: `cf2-starpop .3s ${s * 0.06}s both` }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        ))}
      </div>
      <h3 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
        ¡Hablamos pronto!
      </h3>
      <p style={{ fontSize: 14, color: '#475569', margin: '0 0 28px', lineHeight: 1.7, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
        Nuestro equipo te responde en menos de 24h. Mientras tanto, empieza gratis y analiza tus primeros pedidos hoy.
      </p>
      <a href="/registro" style={{
        fontSize: 14, fontWeight: 700, padding: '13px 26px', borderRadius: 13,
        background: 'linear-gradient(135deg,#2EC4B6,#059669)', color: '#fff',
        textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
        boxShadow: '0 8px 24px rgba(46,196,182,0.35)',
      }}>
        Crear cuenta gratis
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  )

  return (
    <>
      <style>{`
        /* @property necesario para animar la variable CSS del conic-gradient */
        @property --cf-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes cf2-border-spin  { to { --cf-angle: 360deg; } }
        @keyframes cf2-shine        { 0%{background-position:200% center} 100%{background-position:-50% center} }
        @keyframes cf2-btn-gradient { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes cf2-btn-sweep    { 0%{background-position:200% center} 100%{background-position:-50% center} }
        @keyframes cf2-fadeup       { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes cf2-pop          { 0%{transform:scale(0)} 70%{transform:scale(1.1)} 100%{transform:scale(1)} }
        @keyframes cf2-starpop      { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }
        @keyframes cf2-fadein       { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes cf2-spin         { to{transform:rotate(360deg)} }
        @keyframes cf2-pulse-dot    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes cf2-check-draw   {
          from { stroke-dasharray:20; stroke-dashoffset:20; }
          to   { stroke-dasharray:20; stroke-dashoffset:0;  }
        }

        .cf2-root { font-family:system-ui,-apple-system,sans-serif; animation:cf2-fadeup 0.4s ease; }
        .cf2-g2   { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

        input::placeholder, textarea::placeholder { color:#9ca3af; font-size:13px; }
        input, textarea, select { -webkit-font-smoothing:antialiased; }

        @media (max-width:480px) {
          .cf2-g2 { grid-template-columns:1fr; }
        }
      `}</style>

      <div
        className="cf2-root"
        style={{
          background: '#fff',
          borderRadius: 24,
          padding: 'clamp(24px,4vw,36px)',
          border: '1.5px solid #f1f5f9',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 88,
        }}
      >
        {/* ── HEADER ── */}
        <div style={{ marginBottom: 22 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(46,196,182,0.08)',
            border: '1px solid rgba(46,196,182,0.2)',
            borderRadius: 100, padding: '4px 12px', marginBottom: 14,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6',
              animation: 'cf2-pulse-dot 2s infinite',
            }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#0f766e', letterSpacing: '0.07em' }}>
              RESPUESTA EN &lt; 24H
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 800, color: '#0f172a',
            margin: '0 0 6px', letterSpacing: '-0.5px', lineHeight: 1.25,
          }}>
            Empieza a recuperar<br />
            <span style={{ color: '#2EC4B6' }}>pedidos perdidos hoy</span>
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            Cuéntanos tu situación y te mostramos cuánto puedes recuperar.
          </p>
        </div>

        {/* ── MINI STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 22 }}>
          {[
            { val: '94%',  label: 'confirmación' },
            { val: '3min', label: 'setup'         },
            { val: '0€',   label: 'prueba'        },
          ].map(s => (
            <div key={s.label} style={{
              background: '#f8fafc', borderRadius: 12, padding: '9px 10px',
              textAlign: 'center', border: '1px solid #f1f5f9',
            }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 1px', letterSpacing: '-0.5px' }}>
                {s.val}
              </p>
              <p style={{ fontSize: 9, color: '#94a3b8', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── CAMPOS con floating labels ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          <div className="cf2-g2">
            {/* name — onChange ORIGINAL */}
            <FloatField id="cf-name" label="Nombre" required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
            {/* email — onChange ORIGINAL */}
            <FloatField id="cf-email" label="Email" type="email" required
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>

          <div className="cf2-g2">
            {/* company — onChange ORIGINAL */}
            <FloatField id="cf-company" label="Empresa"
              value={form.company}
              onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
            />
            {/* orders — onChange ORIGINAL */}
            <FloatField id="cf-orders" label="Pedidos / mes" as="select"
              value={form.orders}
              onChange={e => setForm(p => ({ ...p, orders: e.target.value }))}
              options={[
                { value: '<50',     label: 'Menos de 50' },
                { value: '50-200',  label: '50 – 200'    },
                { value: '200-500', label: '200 – 500'   },
                { value: '500+',    label: 'Más de 500'  },
              ]}
            />
          </div>

          {/* message — onChange ORIGINAL */}
          <FloatField id="cf-message" label="Mensaje" required as="textarea" rows={4}
            value={form.message}
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          />

          {/* demo checkbox — onClick ORIGINAL */}
          <div
            onClick={() => setForm(p => ({ ...p, demo: !p.demo }))}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 16, cursor: 'pointer',
              background: form.demo ? 'rgba(46,196,182,0.05)' : '#f8fafc',
              border: `1.5px solid ${form.demo ? 'rgba(46,196,182,0.28)' : '#f1f5f9'}`,
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 8, flexShrink: 0,
              border: `2px solid ${form.demo ? '#2EC4B6' : '#cbd5e1'}`,
              background: form.demo ? '#2EC4B6' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow: form.demo ? '0 2px 10px rgba(46,196,182,0.35)' : 'none',
            }}>
              {form.demo && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="3.5" strokeLinecap="round"
                  style={{ strokeDasharray: 20, strokeDashoffset: 20, animation: 'cf2-check-draw 0.25s ease forwards' }}>
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: form.demo ? '#0f766e' : '#374151', margin: '0 0 2px', transition: 'color 0.15s' }}>
                Quiero una demo personalizada gratuita
              </p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                Panel en vivo con datos de tu sector · 30 minutos
              </p>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              padding: '11px 14px', borderRadius: 12,
              background: '#fef2f2', border: '1px solid #fecaca',
              animation: 'cf2-fadein 0.2s ease',
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: '#fee2e2', border: '1px solid #fecaca',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {/* Shimmer Button — onClick = handleSubmit ORIGINAL */}
          <ShimmerButton
            onClick={handleSubmit}
            disabled={sending}
            ready={isReady}
          >
            {sending ? (
              <>
                <div style={{
                  width: 14, height: 14,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'cf2-spin 0.7s linear infinite',
                }} />
                Enviando...
              </>
            ) : isReady ? (
              <>
                Enviar y hablar con el equipo
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            ) : (
              'Completa los campos obligatorios'
            )}
          </ShimmerButton>

          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            Sin tarjeta de crédito · Sin permanencia ·{' '}
            <a href="#" style={{ color: '#2EC4B6', textDecoration: 'none', fontWeight: 600 }}>
              Política de privacidad
            </a>
          </p>
        </div>
      </div>
    </>
  )
}