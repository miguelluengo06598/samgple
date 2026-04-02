'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

const TYPEWRITER_WORDS = ['COD fallidos', 'devoluciones', 'pedidos sin confirmar', 'entregas perdidas', 'clientes fantasma']

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function TypewriterText() {
  const [display, setDisplay] = useState('')
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = TYPEWRITER_WORDS[wi]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, ci + 1))
        setCi(c => c + 1)
        if (ci + 1 === word.length) setTimeout(() => setDeleting(true), 1800)
      } else {
        setDisplay(word.slice(0, ci - 1))
        setCi(c => c - 1)
        if (ci - 1 === 0) { setDeleting(false); setWi(i => (i + 1) % TYPEWRITER_WORDS.length) }
      }
    }, deleting ? 50 : 80)
    return () => clearTimeout(timeout)
  }, [ci, deleting, wi])

  return (
    <span style={{ color: '#5da7ec' }}>
      {display}
      <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#5da7ec', borderRadius: 2, marginLeft: 3, verticalAlign: 'middle', animation: 'blink 0.8s infinite' }} />
    </span>
  )
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    const duration = 1200
    const steps = 40
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), value))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])
  return <span ref={ref}>{current}{suffix}</span>
}

function Section({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)', ...style }}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Score de riesgo IA', desc: 'Cada pedido recibe una puntuación 0-100 basada en historial del cliente, zona, importe y 15+ señales de comportamiento.', color: '#5da7ec', bg: '#eff6ff', border: '#bfdbfe', stat: '15+ señales analizadas' },
    { icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', title: 'Llamadas automáticas', desc: 'Tu asistente IA llama al cliente, confirma el pedido y actualiza el estado automáticamente. Sin intervención humana.', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', stat: '87% tasa de confirmación' },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Integración Shopify', desc: 'Conecta tu tienda en 2 clics. Los pedidos entran solos vía webhook y el proceso arranca automáticamente.', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', stat: 'Conectado en 10 minutos' },
    { icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Finanzas en tiempo real', desc: 'Dashboard de ingresos confirmados, tasa de entrega, ROI de campañas y métricas de llamadas actualizado al instante.', color: '#d97706', bg: '#fffbeb', border: '#fde68a', stat: 'Actualización instantánea' },
  ]

  const testimonials = [
    { name: 'Alejandro M.', role: 'CEO · TiendaRopa.es', text: 'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato.', avatar: 'A', color: '#5da7ec' },
    { name: 'Carmen R.', role: 'Fundadora · BeautyDrop', text: 'El asistente IA llama mejor que mis agentes humanos. Los clientes confirman más porque la llamada es rápida y clara.', avatar: 'C', color: '#ec4899' },
    { name: 'David F.', role: 'Operaciones · ShopXpress', text: 'Conectamos Shopify en 10 minutos. Los pedidos empezaron a confirmarse solos esa misma tarde. Increíble.', avatar: 'D', color: '#0f766e' },
  ]

  const howItWorks = [
    { n: '01', title: 'Pedido entra de Shopify', desc: 'Webhook instantáneo. El pedido aparece en tu panel en segundos sin ninguna acción manual.', color: '#5da7ec' },
    { n: '02', title: 'IA analiza el riesgo', desc: 'Score 0-100 en milisegundos. Historial, zona, importe, comportamiento y 15+ señales.', color: '#7c3aed' },
    { n: '03', title: 'Llamada automática', desc: 'Tu asistente llama al cliente con tu nombre de empresa. Confirma, cancela o reagenda.', color: '#0f766e' },
    { n: '04', title: 'Estado actualizado solo', desc: 'El pedido se actualiza en tiempo real. Confirmado, cancelado o reagendado automáticamente.', color: '#d97706' },
  ]

  return (
    <div style={{ fontFamily: F, overflowX: 'hidden' }}>
      <style>{`
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .cta-main  { transition:all 0.15s ease; }
        .cta-main:hover  { background:#4a96db!important; transform:translateY(-2px); box-shadow:0 8px 24px rgba(93,167,236,0.4)!important; }
        .cta-ghost { transition:all 0.15s ease; }
        .cta-ghost:hover { background:#f8fafc!important; transform:translateY(-1px); }
        .feat-tab  { transition:all 0.2s ease; cursor:pointer; }
        .feat-tab:hover  { background:#f8fafc!important; }
        .testi-card{ transition:all 0.2s ease; }
        .testi-card:hover{ transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,0.1)!important; }
        .step-card { transition:all 0.15s ease; }
        .step-card:hover { transform:translateY(-2px); }
        .logo-badge { animation:float 3s ease-in-out infinite; }
        @media(max-width:768px) {
          .hero-grid   { grid-template-columns:1fr!important; }
          .feat-layout { grid-template-columns:1fr!important; }
          .testi-grid  { grid-template-columns:1fr!important; }
          .how-grid    { grid-template-columns:1fr 1fr!important; }
          .stats-grid  { grid-template-columns:1fr 1fr!important; }
          .problem-grid{ grid-template-columns:1fr!important; }
          .cta-btns    { flex-direction:column!important; align-items:center!important; }
        }
        @media(max-width:480px) {
          .how-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(80px,10vw,120px) 24px clamp(60px,8vw,80px)', background: '#fff', position: 'relative', overflow: 'hidden' }}>

        {/* Fondo decorativo */}
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(93,167,236,0.07),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(93,167,236,0.05),transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }}>

            {/* Izquierda */}
            <div style={{ animation: 'fadeUp 0.6s ease both' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, color: '#0f766e', marginBottom: 28 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                120+ tiendas confirmando con IA
              </div>

              <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 12px' }}>
                Para de perder<br />dinero en
              </h1>
              <div style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24, minHeight: 'clamp(44px,6vw,74px)' }}>
                <TypewriterText />
              </div>

              <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: '#64748b', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 480 }}>
                SAMGPLE analiza cada pedido COD con IA, llama automáticamente al cliente y confirma la entrega antes de enviar. <strong style={{ color: '#0f172a' }}>Reduce devoluciones hasta un 42%.</strong>
              </p>

              <div className="cta-btns" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                <Link href="/registro" className="cta-main"
                  style={{ fontSize: 15, fontWeight: 700, padding: '14px 28px', borderRadius: 14, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(93,167,236,0.3)' }}>
                  Empezar gratis
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/metodologia" className="cta-ghost"
                  style={{ fontSize: 15, fontWeight: 600, padding: '14px 24px', borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#fff', color: '#0f172a', textDecoration: 'none' }}>
                  Ver cómo funciona
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex' }}>
                  {['#5da7ec','#0f766e','#7c3aed','#ec4899'].map((c, i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>
                      {['A','M','C','D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                    {[1,2,3,4,5].map(s => <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>+120 tiendas · 4.9/5 valoración</p>
                </div>
              </div>
            </div>

            {/* Derecha — Dashboard mockup */}
            <div style={{ animation: 'fadeUp 0.6s ease 0.15s both' }}>
              <div style={{ background: '#0f172a', borderRadius: 24, padding: 3, boxShadow: '0 32px 80px rgba(15,23,42,0.25)', position: 'relative' }}>

                {/* Barra superior */}
                <div style={{ background: '#1e293b', borderRadius: '21px 21px 0 0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
                  <div style={{ flex: 1, height: 18, background: 'rgba(255,255,255,0.04)', borderRadius: 6, maxWidth: 220, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>app.samgple.com/pedidos</span>
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ padding: 'clamp(14px,2vw,20px)', borderRadius: '0 0 21px 21px', background: '#0f172a' }}>

                  {/* Métricas */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    {[
                      { label: 'Ingresos hoy', value: '4,892€', color: '#22c55e', up: '+12%' },
                      { label: 'Confirmados', value: '87%', color: '#5da7ec', up: '↑ 3pts' },
                      { label: 'Llamadas', value: '143', color: '#a78bfa', up: 'en vivo' },
                      { label: 'Score medio', value: '34', color: '#f59e0b', up: 'bajo riesgo' },
                    ].map(m => (
                      <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{m.label}</p>
                        <p style={{ fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 800, color: m.color, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{m.value}</p>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>{m.up}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pedidos recientes */}
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', margin: '0 0 10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Últimos pedidos</p>
                    {[
                      { name: 'María G.', amount: '44.99€', status: 'Confirmado', color: '#22c55e' },
                      { name: 'Carlos R.', amount: '89.50€', status: 'Llamando...', color: '#5da7ec' },
                      { name: 'Ana M.', amount: '32.00€', status: 'Pendiente', color: '#f59e0b' },
                    ].map((o, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 22, height: 22, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>
                            {o.name.charAt(0)}
                          </div>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>{o.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{o.amount}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: `${o.color}20`, color: o.color }}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge flotante */}
              <div className="logo-badge" style={{ position: 'absolute', top: -16, right: -16, background: '#fff', borderRadius: 16, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #f1f5f9' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#0f172a', margin: 0 }}>+87% confirmados</p>
                  <p style={{ fontSize: 9, color: '#94a3b8', margin: 0 }}>esta semana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#0f172a', padding: 'clamp(36px,5vw,56px) 24px' }}>
        <Section>
          <div className="stats-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(20px,4vw,40px)', textAlign: 'center' }}>
            {[
              { value: 42, suffix: '%', pre: '-', label: 'Menos devoluciones' },
              { value: 87, suffix: '%', pre: '', label: 'Tasa de confirmación' },
              { value: 5, suffix: 'min', pre: '<', label: 'Por confirmación' },
              { value: 120, suffix: '+', pre: '', label: 'Tiendas activas' },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#5da7ec', margin: '0 0 4px', letterSpacing: '-1.5px' }}>
                  {s.pre}<AnimatedNumber value={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Section>
            <div style={{ textAlign: 'center', marginBottom: 52 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Proceso</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 14px' }}>4 pasos, 0 intervención humana</h2>
              <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Desde que llega el pedido hasta que está confirmado, SAMGPLE lo hace todo solo en menos de 5 minutos.</p>
            </div>
          </Section>

          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {howItWorks.map((step, i) => (
              <Section key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="step-card" style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1.5px solid #f1f5f9', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: step.color }} />
                  <span style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-2px', display: 'block', marginBottom: 12 }}>{step.n}</span>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,6vw,80px)', alignItems: 'center' }}>
            <Section>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>El problema</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1.1, margin: '12px 0 20px' }}>
                El COD tiene un problema de confianza
              </h2>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: '0 0 16px' }}>
                Entre el 25% y el 45% de los pedidos COD no se entregan. Devoluciones, costes de envío perdidos y productos dañados.
              </p>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
                La mayoría de tiendas envían sin validar. <strong style={{ color: '#0f172a' }}>Nosotros confirmamos primero, enviamos después.</strong>
              </p>
            </Section>
            <Section style={{ transitionDelay: '0.1s' }}>
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
            </Section>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Section>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Características</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Todo para dominar el COD</h2>
            </div>
          </Section>

          <div className="feat-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {features.map((f, i) => (
                <div key={i} className="feat-tab" onClick={() => setActiveFeature(i)}
                  style={{ padding: '14px 16px', borderRadius: 16, border: `1.5px solid ${activeFeature === i ? f.border : '#f1f5f9'}`, background: activeFeature === i ? f.bg : '#fff', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: activeFeature === i ? f.bg : '#f8fafc', border: `1.5px solid ${activeFeature === i ? f.border : '#f1f5f9'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeFeature === i ? f.color : '#94a3b8'} strokeWidth="2" strokeLinecap="round"><path d={f.icon}/></svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: activeFeature === i ? 700 : 500, color: activeFeature === i ? '#0f172a' : '#64748b' }}>{f.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detalle */}
            <div style={{ background: features[activeFeature].bg, borderRadius: 24, padding: 'clamp(28px,4vw,40px)', border: `1.5px solid ${features[activeFeature].border}`, transition: 'all 0.2s ease' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: `0 4px 14px ${features[activeFeature].border}` }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={features[activeFeature].color} strokeWidth="2" strokeLinecap="round"><path d={features[activeFeature].icon}/></svg>
              </div>
              <h3 style={{ fontSize: 'clamp(20px,3vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.5px' }}>{features[activeFeature].title}</h3>
              <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: '0 0 24px' }}>{features[activeFeature].desc}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 20, padding: '8px 16px', border: `1px solid ${features[activeFeature].border}` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={features[activeFeature].color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: features[activeFeature].color }}>{features[activeFeature].stat}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Section>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Testimonios</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Lo que dicen nuestros clientes</h2>
            </div>
          </Section>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {testimonials.map((t, i) => (
              <Section key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="testi-card" style={{ background: '#fff', borderRadius: 24, padding: '28px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', height: '100%' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {[1,2,3,4,5].map(s => <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, margin: '0 0 24px', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 12, background: `linear-gradient(135deg,${t.color},${t.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: 'linear-gradient(135deg,#060d1f,#0c1e42)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)', pointerEvents: 'none' }} />
        <Section>
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(93,167,236,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Empieza hoy</span>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '12px 0 20px', lineHeight: 1.1 }}>
              Confirma pedidos COD<br />con IA desde hoy
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: '0 0 36px', lineHeight: 1.7 }}>
              Tokens de bienvenida incluidos. Sin suscripción mensual. Cancela cuando quieras.
            </p>
            <div className="cta-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <Link href="/registro" className="cta-main"
                style={{ fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 14, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(93,167,236,0.35)' }}>
                Crear cuenta gratis
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" className="cta-ghost"
                style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', background: 'transparent' }}>
                Ver precios
              </Link>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Cancela cuando quieras</p>
          </div>
        </Section>
      </section>
    </div>
  )
}