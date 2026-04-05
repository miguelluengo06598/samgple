// contacto/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import ContactForm from './contact-form'
import Link from 'next/link'

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────
   CSS GLOBE — decoración animada pura CSS
───────────────────────────────────────── */
function CSSGlobe() {
  return (
    <div
      style={{
        position: 'relative',
        width: 160,
        height: 160,
        margin: '0 auto',
        flexShrink: 0,
      }}
    >
      {/* Outer pulse glow */}
      <div
        style={{
          position: 'absolute',
          inset: -18,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(46,196,182,0.1),transparent 68%)',
          animation: 'cg-pulse 3.2s ease-in-out infinite',
        }}
      />

      {/* Globe body */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 33% 28%, rgba(46,196,182,0.15) 0%, rgba(99,102,241,0.07) 38%, rgba(15,23,42,0.03) 68%)',
          border: '1.5px solid rgba(46,196,182,0.22)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow:
            '0 0 36px rgba(46,196,182,0.09), inset 0 0 28px rgba(46,196,182,0.04)',
        }}
      >
        {/* Latitude lines */}
        {[12, 25, 38, 50, 62, 75, 88].map((top, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${top}%`,
              height: 1,
              background: `rgba(46,196,182,${i === 3 ? 0.18 : 0.07})`,
            }}
          />
        ))}

        {/* Meridian lines */}
        {[0, 30, 60, 90, 120, 150].map((deg, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: 1,
              background: 'rgba(46,196,182,0.06)',
              transformOrigin: 'center',
              transform: `translateX(-50%) rotate(${deg}deg)`,
              animation: `cg-spin ${14 + i * 2}s linear infinite`,
            }}
          />
        ))}

        {/* Highlight */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '18%',
            width: '38%',
            height: '28%',
            background:
              'radial-gradient(circle,rgba(255,255,255,0.13),transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Orbit ping dot */}
        <div
          style={{
            position: 'absolute',
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#2EC4B6',
            boxShadow: '0 0 10px rgba(46,196,182,0.8)',
            top: '19%',
            left: '62%',
            animation: 'cg-orbit-dot 5s linear infinite',
          }}
        />
      </div>

      {/* Orbit ring */}
      <div
        style={{
          position: 'absolute',
          inset: -14,
          borderRadius: '50%',
          border: '1px solid rgba(46,196,182,0.12)',
          borderTopColor: 'rgba(46,196,182,0.42)',
          animation: 'cg-spin 10s linear infinite',
        }}
      />

      {/* Ping dots */}
      {[
        { top: '32%', left: '42%', delay: '0s' },
        { top: '56%', left: '24%', delay: '0.9s' },
        { top: '44%', left: '68%', delay: '1.8s' },
      ].map((d, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: d.top,
            left: d.left,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#2EC4B6',
            boxShadow: '0 0 8px rgba(46,196,182,0.7)',
            animation: `cg-ping 2.6s ${d.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const infoCards = [
  {
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: '#2EC4B6',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: 'Email directo',
    desc: 'hola@samgple.com',
    sub: 'Respondemos en menos de 24h',
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    title: 'Demo personalizada',
    desc: 'Panel en vivo con datos reales',
    sub: 'Gratis · Sin compromiso',
  },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    title: 'Consultoría COD',
    desc: 'Analizamos tu tasa de devoluciones',
    sub: 'Estimamos tu ahorro potencial',
  },
  {
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#0f766e',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: 'Soporte rápido',
    desc: 'Para clientes con cuenta activa',
    sub: 'Panel de soporte en tiempo real',
  },
]

const trust = [
  {
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    color: '#2EC4B6',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: 'Sin humo',
    desc: 'Respuestas directas sobre si SAMGPLE encaja contigo.',
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: '#7c3aed',
    bg: '#faf5ff',
    border: '#e9d5ff',
    title: 'Setup incluido',
    desc: 'Te ayudamos a conectar Shopify y lanzar la primera llamada.',
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    title: 'Sin compromiso',
    desc: 'No hay contrato mínimo. Si no te convence, no pagas nada.',
  },
  {
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    color: '#0f766e',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    title: 'Equipo humano',
    desc: 'Hablas con personas que conocen el eCommerce COD.',
  },
]

const ticker = [
  'Respuesta en 24h',
  'Demo gratuita',
  'Sin permanencia',
  'Consultoría COD',
  'Setup en 10 min',
  'Soporte real',
  '120+ tiendas activas',
  'Sin tarjeta de crédito',
]

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ContactoPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; }

        /* ── ANIMATIONS ── */
        @keyframes ct-pulse     { 0%,100%{opacity:1} 50%{opacity:0.38} }
        @keyframes ct-scroll    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes ct-float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes ct-starpop   { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }
        @keyframes ct-fadein    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes ct-shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes cg-pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.06)} }
        @keyframes cg-spin      { to{transform:rotate(360deg)} }
        @keyframes cg-orbit-dot { 0%{top:18%;left:62%} 25%{top:62%;left:78%} 50%{top:78%;left:36%} 75%{top:36%;left:14%} 100%{top:18%;left:62%} }
        @keyframes cg-ping      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(1.5)} }
        @keyframes ct-dot-pulse { 0%,100%{box-shadow:0 0 0 3px rgba(46,196,182,0.15)} 50%{box-shadow:0 0 0 6px rgba(46,196,182,0.06)} }
        @keyframes ct-border-glow { 0%,100%{border-color:rgba(46,196,182,0.15)} 50%{border-color:rgba(46,196,182,0.45)} }
        @keyframes ct-badge-in  { from{opacity:0;transform:translateY(-8px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }

        /* ── HOVER INTERACTIONS ── */
        .ct-info-card { transition: transform 0.18s ease, box-shadow 0.18s ease; cursor: default; }
        .ct-info-card:hover { transform: translateX(4px); box-shadow: 0 8px 28px rgba(0,0,0,0.08) !important; }

        .ct-trust-card { transition: transform 0.15s ease, box-shadow 0.15s ease; cursor: default; }
        .ct-trust-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.09) !important; }

        .ct-cta-btn { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .ct-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(46,196,182,0.38) !important; }
        .ct-cta-btn:active { transform: scale(0.98); }

        .ct-cta-ghost { transition: background 0.15s ease, border-color 0.15s ease; }
        .ct-cta-ghost:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(255,255,255,0.28) !important; }

        /* ── DOT PATTERN (bg decorativo) ── */
        .ct-dot-bg {
          background-image: radial-gradient(circle, rgba(46,196,182,0.1) 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .ct-dot-bg-dark {
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .ct-contact-grid { grid-template-columns: 1fr !important; }
          .ct-trust-grid   { grid-template-columns: 1fr 1fr !important; }
          .ct-stats-mini   { grid-template-columns: repeat(3,1fr) !important; }
          .ct-badge-float  { display: none !important; }
        }
        @media (max-width: 640px) {
          .ct-trust-grid  { grid-template-columns: 1fr !important; }
          .ct-cta-btns    { flex-direction: column !important; align-items: center !important; }
          .ct-cta-btns a, .ct-cta-btns button { width: 100% !important; max-width: 320px !important; justify-content: center !important; }
          .ct-stats-mini  { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 400px) {
          .ct-stats-mini { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        style={{
          background: 'linear-gradient(140deg,#060d1f 0%,#0c1e42 55%,#071428 100%)',
          padding: 'clamp(96px,11vw,148px) 20px clamp(56px,7vw,92px)',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Dot pattern overlay */}
        <div
          className="ct-dot-bg-dark"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        {/* Glow orbs */}
        <div style={{ position:'absolute',top:-130,left:'28%',width:540,height:540,background:'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-90,right:-80,width:420,height:420,background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)',pointerEvents:'none' }} />

        {/* Floating badge — desktop */}
        <div
          className="ct-badge-float"
          style={{
            position: 'absolute',
            top: '22%',
            right: 'clamp(16px,5vw,80px)',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 18,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            maxWidth: 200,
            animation: 'ct-float 4s ease-in-out infinite, ct-badge-in 0.6s 0.3s ease both',
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(46,196,182,0.4)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0 }}>+120 tiendas</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', margin: 0 }}>confirmando con IA</p>
          </div>
        </div>

        <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(46,196,182,0.1)',
                border: '1px solid rgba(46,196,182,0.22)',
                borderRadius: 100,
                padding: '5px 14px',
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#2EC4B6',
                  animation: 'ct-pulse 2s infinite',
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', letterSpacing: '0.07em' }}>
                RESPUESTA EN MENOS DE 24H
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.07}>
            <h1
              style={{
                fontSize: 'clamp(34px,5.5vw,66px)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-2.5px',
                margin: '0 0 20px',
                lineHeight: 1.04,
              }}
            >
              Hablemos de tu<br />negocio{' '}
              <span style={{ color: '#2EC4B6' }}>COD</span>
            </h1>
          </Reveal>

          <Reveal delay={0.11}>
            {/* UX Writing empático-profesional */}
            <p
              style={{
                fontSize: 'clamp(15px,1.8vw,17px)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75,
                margin: '0 auto 36px',
                maxWidth: 500,
              }}
            >
              Cuéntanos tu situación y en 30 minutos te mostramos exactamente
              cómo SAMGPLE reduciría tus devoluciones y automatizaría tus
              confirmaciones — sin compromiso.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div
              className="ct-stats-mini"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 10,
              }}
            >
              {[
                { v: '< 24h',  l: 'Respuesta',    c: '#2EC4B6' },
                { v: 'Gratis', l: 'Consultoría',  c: '#a78bfa' },
                { v: '10 min', l: 'Setup Shopify', c: '#34d399' },
              ].map(s => (
                <div
                  key={s.v}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    padding: '14px 8px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 'clamp(17px,2.5vw,26px)', fontWeight: 800, color: s.c, margin: '0 0 4px', letterSpacing: '-1px' }}>
                    {s.v}
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div
        style={{
          background: '#0f172a',
          padding: '11px 0',
          overflow: 'hidden',
          borderTop: '1px solid #1e293b',
        }}
      >
        <div
          style={{
            display: 'flex',
            animation: 'ct-scroll 26s linear infinite',
            width: 'max-content',
          }}
        >
          {[...ticker, ...ticker].map((t, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '0 26px',
                fontSize: 10,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#2EC4B6',
                  flexShrink: 0,
                }}
              />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── BENTO GRID PRINCIPAL ── */}
      <section
        style={{
          padding: 'clamp(60px,8vw,104px) 20px',
          background: '#f8fafc',
          position: 'relative',
        }}
      >
        {/* Dot pattern bg sección */}
        <div
          className="ct-dot-bg"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.6,
            maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 20%, transparent 90%)',
          }}
        />

        <div
          className="ct-contact-grid"
          style={{
            maxWidth: 1060,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(32px,5vw,56px)',
            alignItems: 'start',
            position: 'relative',
          }}
        >
          {/* ── COLUMNA IZQUIERDA (info) ── */}
          <Reveal>
            <div>
              {/* Globo decorativo */}
              <div style={{ marginBottom: 28 }}>
                <CSSGlobe />
              </div>

              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#2EC4B6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Contacto
              </span>

              <h2
                style={{
                  fontSize: 'clamp(24px,3.5vw,42px)',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-1.5px',
                  margin: '12px 0 14px',
                  lineHeight: 1.08,
                }}
              >
                ¿Tienes dudas?<br />
                <span style={{ color: '#2EC4B6' }}>Estamos aquí.</span>
              </h2>

              {/* UX Writing empático */}
              <p
                style={{
                  fontSize: 15,
                  color: '#64748b',
                  lineHeight: 1.75,
                  margin: '0 0 28px',
                  maxWidth: 440,
                }}
              >
                Ya sea tu primera vez evaluando SAMGPLE o ya eres cliente —
                respondemos con soluciones reales, no con plantillas.
                Cada pregunta importa.
              </p>

              {/* Info cards */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  marginBottom: 28,
                }}
              >
                {infoCards.map((item, i) => (
                  <div
                    key={i}
                    className="ct-info-card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '13px 15px',
                      borderRadius: 16,
                      background: item.bg,
                      border: `1.5px solid ${item.border}`,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: '#fff',
                        border: `1.5px solid ${item.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d={item.icon} />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 1px' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: 13, color: '#374151', margin: '0 0 1px', fontWeight: 500 }}>
                        {item.desc}
                      </p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                        {item.sub}
                      </p>
                    </div>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ flexShrink: 0, opacity: 0.45 }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Testimonio */}
              <div
                style={{
                  background: 'linear-gradient(135deg,#f0fdf9,#eef2ff)',
                  borderRadius: 20,
                  padding: '20px 22px',
                  border: '1.5px solid #c7d2fe',
                  boxShadow: '0 2px 12px rgba(99,102,241,0.06)',
                }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg
                      key={s}
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="#f59e0b"
                      style={{ animation: `ct-starpop .3s ${s * 0.06}s both` }}
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 6, alignSelf: 'center' }}>
                    5.0 · 120+ tiendas
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: '#374151',
                    lineHeight: 1.75,
                    margin: '0 0 14px',
                    fontStyle: 'italic',
                  }}
                >
                  "Me respondieron en menos de 2 horas y me ayudaron a
                  configurar todo desde cero. El trato es excelente y los
                  resultados son reales."
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 800,
                      color: '#fff',
                      flexShrink: 0,
                    }}
                  >
                    C
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      Carmen R.
                    </p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                      Fundadora · BeautyDrop
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── COLUMNA DERECHA (formulario importado) ── */}
          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section
        style={{
          padding: 'clamp(40px,5vw,64px) 20px',
          background: '#ffffff',
        }}
      >
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <Reveal>
            <p
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textAlign: 'center',
                marginBottom: 24,
              }}
            >
              Por qué escribirnos
            </p>
          </Reveal>

          <div
            className="ct-trust-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gap: 12,
            }}
          >
            {trust.map((t, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div
                  className="ct-trust-card"
                  style={{
                    background: '#fff',
                    borderRadius: 20,
                    padding: '20px 18px',
                    border: `1.5px solid ${t.border}`,
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: t.bg,
                      border: `1px solid ${t.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={t.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d={t.icon} />
                    </svg>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 5px' }}>
                    {t.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                    {t.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALENDLY ── */}
      <section
        style={{
          padding: 'clamp(60px,8vw,96px) 20px',
          background: '#f8fafc',
          position: 'relative',
        }}
      >
        <div
          className="ct-dot-bg"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.5,
            maskImage: 'radial-gradient(ellipse 60% 70% at 50% 50%, black 10%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 50% 50%, black 10%, transparent 85%)',
          }}
        />

        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#2EC4B6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Demo gratuita
              </span>
              <h2
                style={{
                  fontSize: 'clamp(26px,4vw,46px)',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-1.8px',
                  margin: '12px 0 12px',
                  lineHeight: 1.07,
                }}
              >
                Reserva una llamada de 30 min
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: '#64748b',
                  maxWidth: 440,
                  margin: '0 auto 20px',
                  lineHeight: 1.7,
                }}
              >
                Te mostramos el panel en vivo, analizamos tu caso y
                configuramos SAMGPLE juntos. Sin compromiso.
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  '✓ Totalmente gratuito',
                  '✓ Sin compromiso',
                  '✓ Demo en vivo',
                  '✓ Configuración incluida',
                ].map(b => (
                  <span
                    key={b}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 13px',
                      borderRadius: 100,
                      background: '#f0fdf4',
                      color: '#0f766e',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              style={{
                background: '#fff',
                borderRadius: 24,
                border: '1.5px solid #f1f5f9',
                overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
              }}
            >
              {/* Calendly header */}
              <div
                style={{
                  background: 'linear-gradient(135deg,#f0fdf9,#eef2ff)',
                  padding: '16px 24px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 10px rgba(46,196,182,0.35)',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    Agenda tu demo · SAMGPLE
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                    30 min · Vídeo llamada · Sin coste
                  </p>
                </div>
              </div>

              {/* iframe Calendly — lógica original intacta */}
              <iframe
                src="https://calendly.com/mluengog06/30min"
                width="100%"
                height="660"
                frameBorder="0"
                style={{ display: 'block', border: 'none' }}
                title="Reserva una llamada con SAMGPLE"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section
        style={{
          padding: 'clamp(60px,8vw,96px) 20px',
          background: 'linear-gradient(140deg,#060d1f,#0c1e42,#071428)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="ct-dot-bg-dark"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 90%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 520,
            height: 520,
            background: 'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <Reveal>
          <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(46,196,182,0.1)',
                border: '1px solid rgba(46,196,182,0.22)',
                borderRadius: 100,
                padding: '5px 14px',
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#2EC4B6',
                  animation: 'ct-pulse 2s infinite',
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', letterSpacing: '0.07em' }}>
                SIN TARJETA · SIN PERMANENCIA
              </span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(26px,4.5vw,52px)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-2px',
                margin: '0 0 16px',
                lineHeight: 1.07,
              }}
            >
              ¿Prefieres empezar solo?<br />
              <span style={{ color: '#2EC4B6' }}>En 10 min estás listo.</span>
            </h2>

            <p
              style={{
                fontSize: 15,
                color: 'rgba(255,255,255,0.45)',
                margin: '0 0 32px',
                lineHeight: 1.7,
              }}
            >
              Crea tu cuenta gratis, conecta Shopify y empieza a confirmar
              pedidos hoy mismo.
            </p>

            <div
              className="ct-cta-btns"
              style={{
                display: 'flex',
                gap: 10,
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 16,
              }}
            >
              {/* ── href ORIGINAL intacto ── */}
              <Link
                href="/registro"
                className="ct-cta-btn"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  padding: '13px 28px',
                  borderRadius: 13,
                  background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)',
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 6px 20px rgba(46,196,182,0.3)',
                }}
              >
                Crear cuenta gratis
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>

              {/* ── href ORIGINAL intacto ── */}
              <Link
                href="/precios"
                className="ct-cta-ghost"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '13px 22px',
                  borderRadius: 13,
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  background: 'transparent',
                }}
              >
                Ver precios
              </Link>
            </div>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
              Tokens de bienvenida incluidos · Cancela cuando quieras
            </p>
          </div>
        </Reveal>
      </section>
    </>
  )
}