'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

const WORDS = ['COD fallidos', 'devoluciones', 'pedidos sin confirmar', 'entregas perdidas', 'clientes fantasma']

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

function TypewriterText() {
  const [display, setDisplay] = useState('')
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const word = WORDS[wi]
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(word.slice(0, ci + 1))
        setCi(c => c + 1)
        if (ci + 1 === word.length) setTimeout(() => setDel(true), 1800)
      } else {
        setDisplay(word.slice(0, ci - 1))
        setCi(c => c - 1)
        if (ci - 1 === 0) { setDel(false); setWi(i => (i + 1) % WORDS.length) }
      }
    }, del ? 50 : 80)
    return () => clearTimeout(t)
  }, [ci, del, wi])
  return (
    <span style={{ color: '#5da7ec' }}>
      {display}
      <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#5da7ec', borderRadius: 2, marginLeft: 3, verticalAlign: 'middle', animation: 'blink .8s infinite' }} />
    </span>
  )
}

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let step = 0
    const steps = 40
    const timer = setInterval(() => {
      step++
      setVal(Math.min(Math.round((target / steps) * step), target))
      if (step >= steps) clearInterval(timer)
    }, 1200 / steps)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

export default function HomePage() {
  const logos = ['TiendaRopa.es', 'BeautyDrop', 'ShopXpress', 'ModaFast', 'ElectroShop', 'NutriStore', 'PetZone', 'HomeStyle']

  const steps = [
    { n: '01', title: 'Shopify envía el pedido', desc: 'Webhook instantáneo. El pedido aparece en tu panel en segundos sin ninguna acción manual.', color: '#5da7ec' },
    { n: '02', title: 'IA analiza el riesgo', desc: 'Score 0-100 en milisegundos con 15+ señales de comportamiento, zona e historial.', color: '#7c3aed' },
    { n: '03', title: 'Llamada automática', desc: 'Tu asistente llama al cliente con tu nombre de empresa. Confirma, cancela o reagenda.', color: '#0f766e' },
    { n: '04', title: 'Estado actualizado solo', desc: 'El pedido se actualiza en tiempo real. Sin intervención humana, sin errores.', color: '#d97706' },
  ]

  const compareLeft = [
    'Confirmación manual por agentes',
    '25-45% devoluciones de media',
    '3-8€ por confirmación manual',
    'Sin análisis de riesgo previo',
    'Solo en horario laboral',
  ]

  const compareRight = [
    'Confirmación automática con IA',
    'Reducción del 42% en devoluciones',
    'Desde 0.17 tokens por pedido',
    'Score de riesgo con 15+ señales',
    '24/7 automático sin intervención',
  ]

  const testimonials = [
    { name: 'Alejandro M.', role: 'CEO · TiendaRopa.es', text: 'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato.', color: '#5da7ec' },
    { name: 'Carmen R.', role: 'Fundadora · BeautyDrop', text: 'El asistente IA llama mejor que mis agentes humanos. Los clientes confirman más porque la llamada es rápida y clara.', color: '#ec4899' },
    { name: 'David F.', role: 'Operaciones · ShopXpress', text: 'Conectamos Shopify en 10 minutos. Los pedidos empezaron a confirmarse solos esa misma tarde. Increíble.', color: '#0f766e' },
  ]

  return (
    <div style={{ fontFamily: F, overflowX: 'hidden' }}>
      <style>{`
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        * { box-sizing:border-box; }
        .cta-main  { transition:all .15s ease; }
        .cta-main:hover  { background:#4a96db!important; transform:translateY(-2px); box-shadow:0 8px 24px rgba(93,167,236,0.4)!important; }
        .cta-ghost { transition:all .15s ease; }
        .cta-ghost:hover { background:#f8fafc!important; }
        .step-card { transition:all .15s ease; }
        .step-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.08)!important; }
        .testi-card{ transition:all .2s ease; }
        .testi-card:hover{ transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,0.1)!important; }
        @media(max-width:768px){
          .hero-grid   { grid-template-columns:1fr!important; }
          .steps-grid  { grid-template-columns:1fr 1fr!important; }
          .compare-grid{ grid-template-columns:1fr!important; }
          .testi-grid  { grid-template-columns:1fr!important; }
          .stats-grid  { grid-template-columns:1fr 1fr!important; }
          .hero-dash   { display:none!important; }
          .cta-btns    { flex-direction:column!important; align-items:stretch!important; }
          .cta-btns a  { text-align:center!important; }
        }
        @media(max-width:480px){
          .steps-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(72px,10vw,120px) 24px clamp(52px,7vw,80px)', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -160, right: -160, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(93,167,236,0.07),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>

            {/* Texto */}
            <div style={{ animation: 'none' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '5px 13px', fontSize: 11, fontWeight: 700, color: '#0f766e', marginBottom: 22 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                120+ tiendas confirmando con IA
              </div>

              <h1 style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 8px' }}>
                Para de perder<br />dinero en
              </h1>
              <div style={{ fontSize: 'clamp(36px,5vw,58px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 22, minHeight: 'clamp(44px,6vw,72px)' }}>
                <TypewriterText />
              </div>

              <p style={{ fontSize: 'clamp(15px,1.7vw,17px)', color: '#64748b', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 440 }}>
                SAMGPLE analiza cada pedido COD con IA, llama automáticamente al cliente y confirma la entrega antes de enviar.{' '}
                <strong style={{ color: '#0f172a' }}>Reduce devoluciones hasta un 42%.</strong>
              </p>

              <div className="cta-btns" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
                <Link href="/registro" className="cta-main"
                  style={{ fontSize: 14, fontWeight: 700, padding: '13px 26px', borderRadius: 13, background: '#0f172a', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(15,23,42,0.2)' }}>
                  Empezar gratis
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/metodologia" className="cta-ghost"
                  style={{ fontSize: 14, fontWeight: 600, padding: '13px 22px', borderRadius: 13, border: '1.5px solid #e2e8f0', background: '#fff', color: '#0f172a', textDecoration: 'none' }}>
                  Ver cómo funciona
                </Link>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex' }}>
                  {['#5da7ec', '#0f766e', '#7c3aed', '#ec4899'].map((c, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>
                      {['A', 'M', 'C', 'D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                    {[1,2,3,4,5].map(s => <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>4.9/5 · +120 tiendas activas</p>
                </div>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="hero-dash" style={{ position: 'relative' }}>
              <div style={{ background: '#0f172a', borderRadius: 22, overflow: 'hidden', boxShadow: '0 28px 70px rgba(15,23,42,0.22)' }}>
                <div style={{ background: '#1e293b', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {['#ef4444', '#f59e0b', '#22c55e'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                  <div style={{ flex: 1, height: 15, background: 'rgba(255,255,255,0.04)', borderRadius: 4, maxWidth: 180, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.15)' }}>app.samgple.com</span>
                  </div>
                </div>
                <div style={{ padding: 'clamp(12px,2vw,18px)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    {[
                      { l: 'Ingresos hoy', v: '4.892€', c: '#22c55e', s: '+12% semana' },
                      { l: 'Confirmados', v: '87%', c: '#5da7ec', s: '↑ 3pts vs mes' },
                      { l: 'Llamadas', v: '143', c: '#a78bfa', s: 'En vivo' },
                      { l: 'Score riesgo', v: '34', c: '#f59e0b', s: 'Bajo riesgo ✓' },
                    ].map(m => (
                      <div key={m.l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '11px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{m.l}</p>
                        <p style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 800, color: m.c, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{m.v}</p>
                        <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', margin: 0 }}>{m.s}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Últimos pedidos</p>
                    {[
                      { n: 'María G.', a: '44.99€', s: 'Confirmado', c: '#22c55e' },
                      { n: 'Carlos R.', a: '89.50€', s: 'Llamando...', c: '#5da7ec' },
                      { n: 'Ana M.', a: '32.00€', s: 'Pendiente', c: '#f59e0b' },
                    ].map((o, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 20, height: 20, borderRadius: 7, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>{o.n.charAt(0)}</div>
                          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{o.n}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{o.a}</span>
                          <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 20, background: `${o.c}20`, color: o.c }}>{o.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Badge flotante */}
              <div style={{ position: 'absolute', top: -12, right: -12, background: '#fff', borderRadius: 14, padding: '9px 13px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #f1f5f9', animation: 'float 3s ease-in-out infinite' }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', margin: 0 }}>+87% confirmados</p>
                  <p style={{ fontSize: 8, color: '#94a3b8', margin: 0 }}>esta semana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS CARRUSEL ── */}
      <section style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: '#fafafa', padding: '20px 0', overflow: 'hidden' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Tiendas que ya confirman con SAMGPLE
        </p>
        <div style={{ display: 'flex', animation: 'scroll 20s linear infinite', width: 'max-content' }}>
          {[...logos, ...logos].map((l, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1', letterSpacing: '-0.3px', padding: '0 32px', whiteSpace: 'nowrap' }}>{l}</span>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#0f172a', padding: 'clamp(36px,5vw,52px) 24px' }}>
        <Reveal>
          <div className="stats-grid" style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(16px,3vw,32px)', textAlign: 'center' }}>
            {[
              { prefix: '-', target: 42, suffix: '%', label: 'Devoluciones COD' },
              { prefix: '', target: 87, suffix: '%', label: 'Tasa confirmación' },
              { prefix: '<', target: 5, suffix: 'min', label: 'Por confirmación' },
              { prefix: '', target: 120, suffix: '+', label: 'Tiendas activas' },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#5da7ec', margin: '0 0 4px', letterSpacing: '-1.5px' }}>
                  <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Proceso</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 12px' }}>4 pasos, 0 intervención humana</h2>
              <p style={{ fontSize: 15, color: '#64748b', maxWidth: 460, margin: '0 auto', lineHeight: 1.7 }}>Desde que llega el pedido hasta que está confirmado, SAMGPLE lo hace todo solo.</p>
            </div>
          </Reveal>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {steps.map((step, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="step-card" style={{ background: '#fff', borderRadius: 20, padding: '22px', border: '1.5px solid #f1f5f9', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: step.color }} />
                  <p style={{ fontSize: 36, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-2px', margin: '0 0 10px' }}>{step.n}</p>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 7px', lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Antes vs Después</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 12px' }}>La diferencia es brutal</h2>
              <p style={{ fontSize: 15, color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>Compara tu proceso actual de confirmación COD con SAMGPLE.</p>
            </div>
          </Reveal>
          <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Reveal delay={0.05}>
              <div style={{ background: '#fef2f2', borderRadius: 22, padding: 'clamp(20px,3vw,28px)', border: '1.5px solid #fecaca', height: '100%' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fee2e2', color: '#b91c1c', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 18 }}>
                  ❌ Sin SAMGPLE
                </div>
                {compareLeft.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background: '#f0fdf4', borderRadius: 22, padding: 'clamp(20px,3vw,28px)', border: '1.5px solid #bbf7d0', height: '100%' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#dcfce7', color: '#0f766e', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 18 }}>
                  ✓ Con SAMGPLE
                </div>
                {compareRight.map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Testimonios</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Lo que dicen nuestros clientes</h2>
            </div>
          </Reveal>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="testi-card" style={{ background: '#f8fafc', borderRadius: 22, padding: 'clamp(20px,3vw,26px)', border: '1.5px solid #f1f5f9', height: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                    {[1,2,3,4,5].map(s => <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.75, margin: '0 0 20px', fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 11, background: `linear-gradient(135deg,${t.color},${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: 'linear-gradient(140deg,#060d1f,#0c1e42)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)', pointerEvents: 'none' }} />
        <Reveal>
          <div style={{ maxWidth: 580, margin: '0 auto', position: 'relative' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(93,167,236,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Empieza hoy</span>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '12px 0 18px', lineHeight: 1.1 }}>
              Confirma pedidos COD<br />con IA desde hoy
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', lineHeight: 1.7 }}>
              Tokens de bienvenida incluidos. Sin suscripción mensual. Cancela cuando quieras.
            </p>
            <div className="cta-btns" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <Link href="/registro" className="cta-main"
                style={{ fontSize: 15, fontWeight: 700, padding: '14px 30px', borderRadius: 14, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 24px rgba(93,167,236,0.35)' }}>
                Crear cuenta gratis
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" className="cta-ghost"
                style={{ fontSize: 15, fontWeight: 600, padding: '14px 26px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', background: 'transparent' }}>
                Ver precios
              </Link>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Cancela cuando quieras</p>
          </div>
        </Reveal>
      </section>
    </div>
  )
}