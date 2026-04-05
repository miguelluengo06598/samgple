'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Shimmer / Border-Beam Button ────────────────────────────────────────────
function ShimmerButton({
  onClick,
  disabled,
  isReady,
  sending,
}: {
  onClick: () => void
  disabled: boolean
  isReady: boolean
  sending: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        padding: '16px 24px',
        borderRadius: 16,
        border: 'none',
        fontSize: 14,
        fontWeight: 600,
        fontFamily: 'inherit',
        letterSpacing: '-0.01em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease, opacity 0.18s',
        background: isReady
          ? 'linear-gradient(135deg, #1A9E8F 0%, #2EC4B6 45%, #0ABFB8 100%)'
          : 'rgba(148,163,184,0.12)',
        color: isReady ? '#fff' : '#94a3b8',
        boxShadow: isReady
          ? '0 1px 0 0 rgba(255,255,255,0.15) inset, 0 8px 32px rgba(46,196,182,0.28), 0 2px 8px rgba(46,196,182,0.18)'
          : 'none',
      }}
      onMouseEnter={e => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
      }}
      onMouseDown={e => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.975)'
      }}
      onMouseUp={e => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
      }}
    >
      {/* Shimmer beam — only when ready */}
      {isReady && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)',
            backgroundSize: '200% 100%',
            animation: 'shimmerSlide 2.4s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Border beam — ultra-thin rotating gradient arc */}
      {isReady && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            padding: 1,
            background:
              'conic-gradient(from var(--beam-angle, 0deg), transparent 60%, rgba(255,255,255,0.55) 80%, transparent 100%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'rotateConic 3s linear infinite',
            pointerEvents: 'none',
          }}
        />
      )}

      {sending ? (
        <>
          <SpinnerIcon />
          Enviando…
        </>
      ) : (
        <>
          {isReady ? 'Enviar y hablar con el equipo' : 'Completa los campos obligatorios'}
          {isReady && <ArrowIcon />}
        </>
      )}
    </button>
  )
}

// ─── Inline SVG atoms ─────────────────────────────────────────────────────────
const SpinnerIcon = () => (
  <span
    style={{
      width: 14,
      height: 14,
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0,
    }}
  />
)

const ArrowIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

// ─── Animated field wrapper — glowing focus ring ──────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#64748b',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          userSelect: 'none',
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#2EC4B6', marginLeft: 3 }}>*</span>
        )}
      </label>
      {children}
    </div>
  )
}

// ─── Shared input/textarea/select styles ──────────────────────────────────────
const BASE_INPUT: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 14,
  border: '1.5px solid rgba(226,232,240,0.8)',
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  fontSize: 14,
  fontWeight: 400,
  color: '#0f172a',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease',
}

const FOCUS_STYLE = {
  borderColor: '#2EC4B6',
  background: 'rgba(255,255,255,0.92)',
  boxShadow: '0 0 0 3.5px rgba(46,196,182,0.14), 0 1px 4px rgba(46,196,182,0.08)',
}

const HOVER_STYLE = {
  borderColor: 'rgba(203,213,225,1)',
  background: 'rgba(255,255,255,0.8)',
}

// ─── Input with glow ──────────────────────────────────────────────────────────
function GlowInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <input
      {...props}
      style={{
        ...BASE_INPUT,
        ...(hovered && !focused ? HOVER_STYLE : {}),
        ...(focused ? FOCUS_STYLE : {}),
      }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
      onMouseEnter={e => { setHovered(true); props.onMouseEnter?.(e) }}
      onMouseLeave={e => { setHovered(false); props.onMouseLeave?.(e) }}
    />
  )
}

// ─── Select with glow ────────────────────────────────────────────────────────
function GlowSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <select
      {...props}
      style={{
        ...BASE_INPUT,
        appearance: 'none',
        cursor: 'pointer',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394a3b8' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center',
        paddingRight: 40,
        ...(hovered && !focused ? HOVER_STYLE : {}),
        ...(focused ? FOCUS_STYLE : {}),
      }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
      onMouseEnter={e => { setHovered(true); props.onMouseEnter?.(e) }}
      onMouseLeave={e => { setHovered(false); props.onMouseLeave?.(e) }}
    />
  )
}

// ─── Textarea with glow ───────────────────────────────────────────────────────
function GlowTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focused, setFocused] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <textarea
      {...props}
      style={{
        ...BASE_INPUT,
        minHeight: 112,
        resize: 'vertical',
        lineHeight: 1.7,
        ...(hovered && !focused ? HOVER_STYLE : {}),
        ...(focused ? FOCUS_STYLE : {}),
      }}
      onFocus={e => { setFocused(true); props.onFocus?.(e) }}
      onBlur={e => { setFocused(false); props.onBlur?.(e) }}
      onMouseEnter={e => { setHovered(true); props.onMouseEnter?.(e) }}
      onMouseLeave={e => { setHovered(false); props.onMouseLeave?.(e) }}
    />
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactForm() {
  // ── LÓGICA SAGRADA — sin tocar ───────────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    email: '',
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

  const F = 'system-ui,-apple-system,sans-serif'

  // ── Success state ─────────────────────────────────────────────────────────
  if (sent)
    return (
      <>
        <GlobalStyles />
        <div
          style={{
            background: 'linear-gradient(145deg,#f0fdf9 0%,#ecfdf5 60%,#f0fdfa 100%)',
            borderRadius: 28,
            padding: 'clamp(48px,7vw,72px) clamp(28px,5vw,48px)',
            textAlign: 'center',
            border: '1.5px solid rgba(187,247,208,0.7)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.8) inset, 0 20px 64px rgba(16,185,129,0.09)',
            animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1)',
            fontFamily: F,
          }}
        >
          {/* Check circle */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#10b981,#059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 36px rgba(16,185,129,0.32)',
              animation: 'scaleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.15s both',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Stars */}
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 20 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <svg
                key={s}
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="#f59e0b"
                style={{ animation: `starPop 0.35s ${s * 0.07}s cubic-bezier(0.34,1.56,0.64,1) both` }}
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          <h3
            style={{
              fontSize: 'clamp(22px,3vw,28px)',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 12px',
              letterSpacing: '-0.6px',
            }}
          >
            ¡Hablamos pronto!
          </h3>
          <p
            style={{
              fontSize: 14,
              color: '#475569',
              margin: '0 auto 32px',
              lineHeight: 1.75,
              maxWidth: 320,
            }}
          >
            Nuestro equipo te responde en menos de 24 h. Mientras tanto, empieza gratis y analiza tus primeros pedidos hoy.
          </p>

          <a
            href="/registro"
            style={{
              fontSize: 14,
              fontWeight: 700,
              padding: '14px 28px',
              borderRadius: 14,
              background: 'linear-gradient(135deg,#2EC4B6,#059669)',
              color: '#fff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              boxShadow: '0 8px 28px rgba(46,196,182,0.38)',
              letterSpacing: '-0.01em',
            }}
          >
            Crear cuenta gratis
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </>
    )

  // ── Form state ────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles />

      <div
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 28,
          padding: 'clamp(28px,4vw,40px)',
          border: '1.5px solid rgba(226,232,240,0.7)',
          boxShadow:
            '0 1px 0 rgba(255,255,255,0.9) inset, 0 4px 6px rgba(0,0,0,0.01), 0 24px 64px rgba(0,0,0,0.055)',
          position: 'sticky',
          top: 88,
          fontFamily: F,
          animation: 'fadeIn 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* ── Header ── */}
        <div style={{ marginBottom: 28 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(46,196,182,0.09)',
              border: '1px solid rgba(46,196,182,0.22)',
              borderRadius: 20,
              padding: '5px 13px',
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#2EC4B6',
                boxShadow: '0 0 0 3px rgba(46,196,182,0.2)',
                animation: 'pulse 2s ease-in-out infinite',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#0f766e',
                letterSpacing: '0.08em',
              }}
            >
              RESPUESTA EN &lt; 24 H
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(19px,2.5vw,23px)',
              fontWeight: 800,
              color: '#0f172a',
              margin: '0 0 8px',
              letterSpacing: '-0.55px',
              lineHeight: 1.22,
            }}
          >
            Empieza a recuperar
            <br />
            <span style={{ color: '#2EC4B6' }}>pedidos perdidos hoy</span>
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.65, fontWeight: 400 }}>
            Cuéntanos tu situación y te mostramos cuánto puedes recuperar.
          </p>
        </div>

        {/* ── Mini stats ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 10,
            marginBottom: 28,
          }}
        >
          {[
            { val: '94%', label: 'confirmación' },
            { val: '3 min', label: 'setup' },
            { val: '0 €', label: 'prueba' },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: 'rgba(248,250,252,0.8)',
                borderRadius: 13,
                padding: '11px 10px',
                textAlign: 'center',
                border: '1px solid rgba(241,245,249,0.9)',
              }}
            >
              <p
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0f172a',
                  margin: '0 0 2px',
                  letterSpacing: '-0.5px',
                }}
              >
                {s.val}
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: '#94a3b8',
                  margin: 0,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Fields ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Row 1 */}
          <div className="cf-grid2">
            <Field label="Nombre" required>
              <GlowInput
                placeholder="Tu nombre"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
            </Field>
            <Field label="Email" required>
              <GlowInput
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="cf-grid2">
            <Field label="Empresa">
              <GlowInput
                placeholder="Nombre de tu tienda"
                value={form.company}
                onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
              />
            </Field>
            <Field label="Pedidos / mes">
              <GlowSelect
                value={form.orders}
                onChange={e => setForm(p => ({ ...p, orders: e.target.value }))}
              >
                <option value="">Seleccionar…</option>
                <option value="<50">Menos de 50</option>
                <option value="50-200">50 – 200</option>
                <option value="200-500">200 – 500</option>
                <option value="500+">Más de 500</option>
              </GlowSelect>
            </Field>
          </div>

          {/* Mensaje */}
          <Field label="Mensaje" required>
            <GlowTextarea
              placeholder="Cuéntanos tu tasa de devoluciones actual, qué canales usas o cualquier duda sobre la integración."
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            />
          </Field>

          {/* Demo checkbox */}
          <div
            onClick={() => setForm(p => ({ ...p, demo: !p.demo }))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 16,
              cursor: 'pointer',
              background: form.demo ? 'rgba(46,196,182,0.06)' : 'rgba(248,250,252,0.7)',
              border: `1.5px solid ${form.demo ? 'rgba(46,196,182,0.28)' : 'rgba(241,245,249,0.9)'}`,
              transition: 'all 0.18s ease',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {/* Custom checkbox */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 8,
                border: `2px solid ${form.demo ? '#2EC4B6' : '#cbd5e1'}`,
                background: form.demo ? '#2EC4B6' : 'rgba(255,255,255,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                boxShadow: form.demo ? '0 2px 10px rgba(46,196,182,0.32)' : 'none',
              }}
            >
              {form.demo && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>

            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: form.demo ? '#0f766e' : '#374151',
                  margin: '0 0 3px',
                  letterSpacing: '-0.01em',
                }}
              >
                Quiero una demo personalizada gratuita
              </p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 400 }}>
                Panel en vivo con datos de tu sector · 30 minutos
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '13px 16px',
                borderRadius: 13,
                background: 'rgba(254,242,242,0.9)',
                border: '1px solid rgba(254,202,202,0.8)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                animation: 'fadeIn 0.22s ease',
              }}
            >
              <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>
                ⚠ {error}
              </p>
            </div>
          )}

          {/* CTA */}
          <ShimmerButton
            onClick={handleSubmit}
            disabled={sending}
            isReady={isReady}
            sending={sending}
          />

          {/* Footer note */}
          <p
            style={{
              fontSize: 11,
              color: '#94a3b8',
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
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

// ─── Global keyframe styles + responsive grid ─────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(22px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes scaleIn {
        from { transform: scale(0.65); opacity: 0; }
        to   { transform: scale(1);    opacity: 1; }
      }
      @keyframes starPop {
        from { opacity: 0; transform: scale(0) rotate(-20deg); }
        to   { opacity: 1; transform: scale(1) rotate(0deg); }
      }
      @keyframes shimmerSlide {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      @keyframes rotateConic {
        from { --beam-angle: 0deg; }
        to   { --beam-angle: 360deg; }
      }
      @property --beam-angle {
        syntax: '<angle>';
        inherits: false;
        initial-value: 0deg;
      }
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 3px rgba(46,196,182,0.2); }
        50%       { box-shadow: 0 0 0 5px rgba(46,196,182,0.08); }
      }
      .cf-grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      @media (max-width: 480px) {
        .cf-grid2 { grid-template-columns: 1fr; }
      }
    `}</style>
  )
}