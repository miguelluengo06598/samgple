'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

const TYPEWRITER_WORDS = ['COD fallidos', 'devoluciones', 'pedidos sin confirmar', 'entregas perdidas']

function TypewriterText() {
  const [display, setDisplay] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = TYPEWRITER_WORDS[wordIndex]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
        if (charIndex + 1 === word.length) {
          setTimeout(() => setDeleting(true), 1800)
        }
      } else {
        setDisplay(word.slice(0, charIndex - 1))
        setCharIndex(c => c - 1)
        if (charIndex - 1 === 0) {
          setDeleting(false)
          setWordIndex(i => (i + 1) % TYPEWRITER_WORDS.length)
        }
      }
    }, deleting ? 55 : 85)
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, wordIndex])

  return (
    <span style={{ color: '#5da7ec', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {display}
      <span style={{ display: 'inline-block', width: 3, height: '0.9em', background: '#5da7ec', borderRadius: 2, marginLeft: 2, animation: 'blink 0.8s infinite', verticalAlign: 'middle' }} />
    </span>
  )
}

export default function HomePage() {

  const features = [
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Score de riesgo IA', desc: 'Cada pedido recibe una puntuación 0-100 basada en historial, zona, importe y 15+ señales de comportamiento.', color: '#5da7ec', bg: '#eff6ff' },
    { icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', title: 'Llamadas automáticas', desc: 'Tu asistente IA llama al cliente, confirma el pedido y actualiza el estado. Sin intervención humana.', color: '#0f766e', bg: '#f0fdf4' },
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Validación inteligente', desc: 'Flujo de decisión automatizado. Aprueba, rechaza o reagenda según llamada y score de riesgo.', color: '#7c3aed', bg: '#faf5ff' },
    { icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Finanzas en tiempo real', desc: 'Dashboard de ingresos confirmados, tasa de entrega y métricas de llamadas actualizado al instante.', color: '#ea580c', bg: '#fff7ed' },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Integración Shopify', desc: 'Conecta tu tienda en 2 clics. Los pedidos entran solos vía webhook y el proceso arranca automáticamente.', color: '#0284c7', bg: '#f0f9ff' },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Resultados en minutos', desc: 'Desde que llega el pedido hasta que tienes la confirmación del cliente pasan menos de 5 minutos.', color: '#d97706', bg: '#fffbeb' },
  ]

  const stats = [
    { value: '-42%', label: 'Devoluciones COD' },
    { value: '+31%', label: 'Tasa de entrega' },
    { value: '< 5min', label: 'Por confirmación' },
    { value: '120+', label: 'Tiendas activas' },
  ]

  const testimonials = [
    { name: 'Alejandro M.', role: 'CEO · TiendaRopa.es', text: 'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato.' },
    { name: 'Carmen R.', role: 'Fundadora · BeautyDrop', text: 'El asistente IA llama mejor que mis agentes humanos. Los clientes confirman más porque la llamada es rápida y clara.' },
    { name: 'David F.', role: 'Operaciones · ShopXpress', text: 'Conectamos Shopify en 10 minutos. Los pedidos empezaron a confirmarse solos esa misma tarde. Increíble.' },
  ]

  const metrics = [
    { label: 'Ingresos confirmados hoy', value: '4,892€', color: '#22c55e', bg: '#f0fdf4', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { label: 'Tasa de confirmación', value: '87%', color: '#5da7ec', bg: '#eff6ff', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' },
    { label: 'Reducción devoluciones', value: '-42%', color: '#8b5cf6', bg: '#faf5ff', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { label: 'Tiempo por confirmación', value: '< 5min', color: '#f59e0b', bg: '#fff7ed', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ]

  return (
    <div style={{ fontFamily: F }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .feat-card:hover { border-color:#5da7ec!important; transform:translateY(-3px); box-shadow:0 12px 40px rgba(93,167,236,0.12)!important; }
        .testi-card:hover { box-shadow:0 8px 32px rgba(0,0,0,0.08)!important; }
        .hero-btn-main:hover { background:#4a96db!important; transform:translateY(-1px); }
        .hero-btn-ghost:hover { background:rgba(255,255,255,0.1)!important; }
        * { box-sizing:border-box; }

        @media(max-width:768px) {
          .hero-grid { grid-template-columns:1fr!important; }
          .hero-left { padding:100px 24px 48px!important; min-height:auto!important; }
          .hero-right { padding:40px 24px!important; }
          .hero-h1 { font-size:clamp(32px,8vw,48px)!important; }
          .hero-tw { font-size:clamp(32px,8vw,48px)!important; }
          .stats-grid { grid-template-columns:1fr 1fr!important; }
          .features-grid { grid-template-columns:1fr!important; }
          .testi-grid { grid-template-columns:1fr!important; }
          .problem-grid { grid-template-columns:1fr!important; }
          .cta-btns { flex-direction:column!important; }
        }
        @media(max-width:480px) {
          .hero-btns-wrap { flex-direction:column!important; }
          .metric-card { padding:14px!important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left — oscuro */}
        <div className="hero-left" style={{ background: 'linear-gradient(135deg,#060d1f,#0f2044,#071428)', padding: 'clamp(100px,12vw,140px) clamp(24px,5vw,72px) clamp(48px,6vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
          {/* Glow effects */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, background: 'radial-gradient(circle,rgba(93,167,236,0.18),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, background: 'radial-gradient(circle,rgba(59,130,246,0.1),transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '40%', left: '60%', width: 200, height: 200, background: 'radial-gradient(circle,rgba(93,167,236,0.07),transparent 70%)', pointerEvents: 'none' }} />

          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(93,167,236,0.1)', border: '1px solid rgba(93,167,236,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#5da7ec', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 28, width: 'fit-content', animation: 'fadeUp 0.5s ease both' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5da7ec', animation: 'pulse 2s infinite' }} />
            IA + Llamadas automáticas
          </div>

          {/* Heading */}
          <h1 className="hero-h1" style={{ fontSize: 'clamp(36px,4vw,58px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', color: '#fff', margin: '0 0 8px', animation: 'fadeUp 0.5s ease 0.1s both' }}>
            Deja de perder dinero
          </h1>
          <div className="hero-tw" style={{ fontSize: 'clamp(36px,4vw,58px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 28, minHeight: 'clamp(44px,5vw,72px)', animation: 'fadeUp 0.5s ease 0.15s both' }}>
            en <TypewriterText />
          </div>

          <p style={{ fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 420, animation: 'fadeUp 0.5s ease 0.2s both' }}>
            SAMGPLE analiza cada pedido COD con IA, llama automáticamente al cliente y confirma la entrega antes de enviar. Reduce devoluciones hasta un 42%.
          </p>

          {/* Buttons */}
          <div className="hero-btns-wrap" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40, animation: 'fadeUp 0.5s ease 0.25s both' }}>
            <Link href="/registro" className="hero-btn-main"
              style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(93,167,236,0.35)' }}>
              Empezar gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/metodologia" className="hero-btn-ghost"
              style={{ fontSize: 14, fontWeight: 600, padding: '13px 24px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'all 0.15s' }}>
              Ver cómo funciona
            </Link>
          </div>

          {/* Trust */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp 0.5s ease 0.3s both' }}>
            <div style={{ display: 'flex' }}>
              {['#5da7ec','#3b82f6','#0f766e','#7c3aed'].map((c, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #0f172a', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>
                  {['A','M','C','D'][i]}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              <strong style={{ color: 'rgba(255,255,255,0.7)' }}>+120 tiendas</strong> ya confirman con SAMGPLE
            </p>
          </div>
        </div>

        {/* Right — claro */}
        <div className="hero-right" style={{ background: '#f8fafc', padding: 'clamp(80px,8vw,120px) clamp(24px,4vw,56px) clamp(48px,6vw,80px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12, borderLeft: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: '#22c55e', marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 1.5s infinite' }} />
            Dashboard en tiempo real
          </div>
          {metrics.map((m, i) => (
            <div key={i} className="metric-card" style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 14, animation: `fadeUp 0.4s ease ${0.1 + i * 0.08}s both` }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={m.icon}/></svg>
              </div>
              <div>
                <p style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: m.color, margin: 0, letterSpacing: '-0.5px', lineHeight: 1 }}>{m.value}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '3px 0 0', fontWeight: 500 }}>{m.label}</p>
              </div>
            </div>
          ))}
          <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', borderRadius: 18, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Último pedido confirmado</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Miguel García · 44.98€</p>
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'rgba(46,196,182,0.2)', color: '#2EC4B6' }}>
              Hace 2min
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <section style={{ background: '#0f172a', padding: 'clamp(32px,4vw,48px) 24px' }}>
        <div className="stats-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.value}>
              <p style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#5da7ec', margin: '0 0 4px', letterSpacing: '-1px' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div className="problem-grid" style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>El problema</span>
            <h2 style={{ fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1.1, margin: '12px 0 20px' }}>El COD tiene un problema de confianza</h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '0 0 16px' }}>Entre el 25% y el 45% de los pedidos COD no se entregan. Devoluciones, costes de envío perdidos y productos dañados.</p>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: 0 }}>La mayoría de tiendas envían sin validar. Nosotros confirmamos primero, enviamos después.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { pct: '38%', label: 'Pedidos COD que no se entregan de media', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
              { pct: '2.4x', label: 'Más caro gestionar una devolución que prevenirla', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
              { pct: '-42%', label: 'Reducción de devoluciones con SAMGPLE', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, background: s.bg, border: `1.5px solid ${s.border}` }}>
                <span style={{ fontSize: 'clamp(22px,3vw,28px)', fontWeight: 800, color: s.color, letterSpacing: '-1px', flexShrink: 0 }}>{s.pct}</span>
                <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Características</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 14px' }}>Todo para dominar el COD</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto' }}>Una plataforma completa que automatiza el proceso de validación de principio a fin.</p>
          </div>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {features.map((f, i) => (
              <div key={i} className="feat-card" style={{ background: '#fff', borderRadius: 20, padding: '26px', border: '1.5px solid #f1f5f9', transition: 'all 0.2s', cursor: 'default' }}>
                <div style={{ width: 42, height: 42, borderRadius: 13, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Testimonios</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Lo que dicen nuestros clientes</h2>
          </div>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card" style={{ background: '#f8fafc', borderRadius: 20, padding: '28px', border: '1.5px solid #f1f5f9', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#5da7ec,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>{t.name.charAt(0)}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: 'linear-gradient(135deg,#060d1f,#0f2044)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(93,167,236,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Empieza hoy</span>
          <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '12px 0 20px', lineHeight: 1.1 }}>
            Confirma pedidos COD<br />con IA desde hoy
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: '0 0 36px', lineHeight: 1.7 }}>
            Tokens de bienvenida incluidos. Sin suscripción mensual. Cancela cuando quieras.
          </p>
          <div className="cta-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(93,167,236,0.35)' }}>
              Crear cuenta gratis
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>
              Ver precios
            </Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 20 }}>Sin tarjeta de crédito · Tokens de prueba incluidos</p>
        </div>
      </section>
    </div>
  )
}