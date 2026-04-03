'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const F = "'DM Sans', system-ui, sans-serif"

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
    <span style={{ color: '#2EC4B6' }}>
      {display}
      <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#2EC4B6', borderRadius: 2, marginLeft: 3, verticalAlign: 'middle', animation: 'blink 0.8s infinite' }} />
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
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity .65s cubic-bezier(.16,1,.3,1), transform .65s cubic-bezier(.16,1,.3,1)',
      ...style
    }}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Score de riesgo IA', desc: 'Cada pedido recibe una puntuación 0-100 basada en historial del cliente, zona, importe y 15+ señales de comportamiento.', color: '#2EC4B6', bg: '#f0fdf9', border: '#99f6e4', stat: '15+ señales analizadas' },
    { icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', title: 'Llamadas automáticas', desc: 'Tu asistente IA llama al cliente, confirma el pedido y actualiza el estado automáticamente. Sin intervención humana.', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', stat: '87% tasa de confirmación' },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Integración Shopify', desc: 'Conecta tu tienda en 2 clics. Los pedidos entran solos vía webhook y el proceso arranca automáticamente.', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', stat: 'Conectado en 10 minutos' },
    { icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Finanzas en tiempo real', desc: 'Dashboard de ingresos confirmados, tasa de entrega, ROI de campañas y métricas de llamadas actualizado al instante.', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', stat: 'Actualización instantánea' },
  ]

  const testimonials = [
    { name: 'Alejandro M.', role: 'CEO · TiendaRopa.es', text: 'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato.', avatar: 'A', color: '#2EC4B6' },
    { name: 'Carmen R.', role: 'Fundadora · BeautyDrop', text: 'El asistente IA llama mejor que mis agentes humanos. Los clientes confirman más porque la llamada es rápida y clara.', avatar: 'C', color: '#ec4899' },
    { name: 'David F.', role: 'Operaciones · ShopXpress', text: 'Conectamos Shopify en 10 minutos. Los pedidos empezaron a confirmarse solos esa misma tarde. Increíble.', avatar: 'D', color: '#6366f1' },
  ]

  const howItWorks = [
    { n: '01', title: 'Pedido entra de Shopify', desc: 'Webhook instantáneo. El pedido aparece en tu panel en segundos sin ninguna acción manual.', color: '#2EC4B6' },
    { n: '02', title: 'IA analiza el riesgo', desc: 'Score 0-100 en milisegundos. Historial, zona, importe, comportamiento y 15+ señales.', color: '#6366f1' },
    { n: '03', title: 'Llamada automática', desc: 'Tu asistente llama al cliente con tu nombre de empresa. Confirma, cancela o reagenda.', color: '#f59e0b' },
    { n: '04', title: 'Estado actualizado solo', desc: 'El pedido se actualiza en tiempo real. Confirmado, cancelado o reagendado automáticamente.', color: '#10b981' },
  ]

  return (
    <div style={{ fontFamily: F, overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes ticker   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(46,196,182,.3)} 50%{box-shadow:0 0 40px rgba(46,196,182,.6)} }
        @keyframes starPop  { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }

        .gradient-text {
          background: linear-gradient(135deg,#2EC4B6,#6366f1,#2EC4B6);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; animation: shimmer 4s linear infinite;
        }

        .ticker-track { display:flex; animation:ticker 28s linear infinite; width:max-content; }
        .ticker-track:hover { animation-play-state:paused; }

        .cta-main {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size:15px; font-weight:700;
          padding:14px 30px; border-radius:14px;
          background:linear-gradient(135deg,#2EC4B6,#1A9E8F);
          color:#fff; text-decoration:none;
          display:inline-flex; align-items:center; gap:8px;
          box-shadow:0 8px 24px rgba(46,196,182,.38);
          transition:all .18s cubic-bezier(.34,1.56,.64,1);
          will-change:transform; border:none;
        }
        .cta-main:hover  { transform:translateY(-2px); box-shadow:0 14px 36px rgba(46,196,182,.5); }
        .cta-main:active { transform:scale(.97); }

        .cta-ghost {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size:15px; font-weight:600;
          padding:14px 26px; border-radius:14px;
          border:1.5px solid #e2e8f0; background:#fff;
          color:#0f172a; text-decoration:none;
          display:inline-flex; align-items:center; gap:7px;
          transition:all .15s ease;
        }
        .cta-ghost:hover { border-color:#cbd5e1; box-shadow:0 4px 14px rgba(0,0,0,.06); transform:translateY(-1px); }

        .feat-tab {
          transition:all .2s ease; cursor:pointer;
          border-radius:16px; padding:14px 16px;
        }
        .feat-tab:hover { transform:translateX(3px); }

        .step-card {
          background:#fff; border-radius:22px; padding:26px 22px;
          border:1.5px solid #f1f5f9;
          transition:all .2s ease; position:relative; overflow:hidden;
          will-change:transform;
        }
        .step-card:hover { transform:translateY(-4px); box-shadow:0 20px 48px rgba(0,0,0,.08); border-color:#e2e8f0; }

        .testi-card {
          background:#fff; border-radius:24px; padding:28px;
          border:1.5px solid #f1f5f9;
          box-shadow:0 2px 12px rgba(0,0,0,.04);
          transition:all .22s ease; will-change:transform;
        }
        .testi-card:hover { transform:translateY(-5px); box-shadow:0 20px 52px rgba(0,0,0,.1); border-color:#e2e8f0; }

        .stat-card {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px; padding:24px 16px; text-align:center;
          transition:all .2s ease;
        }
        .stat-card:hover { background:rgba(255,255,255,0.07); transform:translateY(-2px); }

        .logo-badge { animation:floatY 4s ease-in-out infinite; }

        .prob-card {
          display:flex; align-items:center; gap:18px;
          padding:18px 22px; border-radius:18px;
          transition:all .2s ease;
        }
        .prob-card:hover { transform:translateX(4px); box-shadow:0 8px 24px rgba(0,0,0,.07); }

        @media(max-width:900px) {
          .hero-grid    { grid-template-columns:1fr !important; }
          .feat-layout  { grid-template-columns:1fr !important; }
          .testi-grid   { grid-template-columns:1fr !important; }
          .problem-grid { grid-template-columns:1fr !important; }
          .stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
          .how-grid     { grid-template-columns:repeat(2,1fr) !important; }
          .cta-btns     { flex-direction:column !important; align-items:center !important; }
          .cta-btns a   { width:100%; justify-content:center; }
        }
        @media(max-width:480px) {
          .how-grid   { grid-template-columns:1fr !important; }
          .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ padding:'clamp(88px,10vw,130px) 24px clamp(60px,8vw,90px)', background:'linear-gradient(160deg,#f8fffe 0%,#f0fdf9 40%,#eef2ff 100%)', position:'relative', overflow:'hidden' }}>

        <div style={{ position:'absolute', top:-180, right:-120, width:600, height:600, background:'radial-gradient(circle,rgba(46,196,182,0.12),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-120, left:-100, width:500, height:500, background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'center' }}>

            {/* Izquierda */}
            <div style={{ animation:'fadeUp .6s ease both' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(46,196,182,0.08)', border:'1px solid rgba(46,196,182,0.2)', borderRadius:20, padding:'6px 14px', fontSize:12, fontWeight:700, color:'#0f766e', marginBottom:28, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#2EC4B6', animation:'pulse 2s infinite', boxShadow:'0 0 6px rgba(46,196,182,.7)' }} />
                120+ tiendas confirmando con IA
              </div>

              <h1 style={{ fontSize:'clamp(36px,5vw,62px)', fontWeight:800, color:'#0f172a', lineHeight:1.04, letterSpacing:'-2.5px', margin:'0 0 10px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Para de perder<br />dinero en
              </h1>
              <div style={{ fontSize:'clamp(36px,5vw,62px)', fontWeight:800, lineHeight:1.04, letterSpacing:'-2.5px', marginBottom:26, minHeight:'clamp(44px,6vw,76px)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                <TypewriterText />
              </div>

              <p style={{ fontSize:'clamp(15px,1.8vw,17px)', color:'#475569', lineHeight:1.8, margin:'0 0 36px', maxWidth:480, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                SAMGPLE analiza cada pedido COD con IA, llama automáticamente al cliente y confirma la entrega antes de enviar. <strong style={{ color:'#0f172a' }}>Reduce devoluciones hasta un 42%.</strong>
              </p>

              <div className="cta-btns" style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:32 }}>
                <Link href="/registro" className="cta-main">
                  Empezar gratis
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/metodologia" className="cta-ghost">
                  Ver cómo funciona
                </Link>
              </div>

              {/* Avatares + rating */}
              <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div style={{ display:'flex' }}>
                  {['#2EC4B6','#6366f1','#ec4899','#f59e0b'].map((c, i) => (
                    <div key={i} style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${c},${c}bb)`, border:'2.5px solid #fff', marginLeft: i === 0 ? 0 : -9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', boxShadow:`0 2px 8px ${c}40` }}>
                      {['A','M','C','D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display:'flex', gap:2, marginBottom:3 }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" style={{ animation:`starPop .3s ${s * 0.07}s both` }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize:12, color:'#64748b', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>+120 tiendas · 4.9/5 valoración</p>
                </div>
              </div>
            </div>

            {/* Derecha — Dashboard mockup */}
            <div style={{ animation:'fadeUp .6s ease .15s both', position:'relative' }}>
              <div style={{ background:'linear-gradient(145deg,#0f172a,#1e293b)', borderRadius:28, padding:3, boxShadow:'0 40px 100px rgba(15,23,42,0.3), 0 0 0 1px rgba(255,255,255,0.05)', position:'relative' }}>
                {/* Barra superior */}
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'25px 25px 0 0', padding:'13px 18px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  {['#ef4444','#f59e0b','#22c55e'].map(c => (
                    <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c, boxShadow:`0 0 6px ${c}80` }} />
                  ))}
                  <div style={{ flex:1, height:20, background:'rgba(255,255,255,0.04)', borderRadius:7, maxWidth:240, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>app.samgple.com/pedidos</span>
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ padding:'clamp(14px,2vw,20px)', borderRadius:'0 0 25px 25px' }}>
                  {/* Métricas */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                    {[
                      { label:'INGRESOS HOY', value:'4,892€', color:'#2EC4B6', up:'+12%' },
                      { label:'CONFIRMADOS', value:'87%',    color:'#6366f1', up:'↑ 3pts' },
                      { label:'LLAMADAS',    value:'143',    color:'#a78bfa', up:'en vivo' },
                      { label:'SCORE MEDIO', value:'34',     color:'#f59e0b', up:'bajo riesgo' },
                    ].map(m => (
                      <div key={m.label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'14px', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize:9, color:'rgba(255,255,255,0.3)', margin:'0 0 7px', textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:700, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{m.label}</p>
                        <p style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:800, color:m.color, margin:'0 0 3px', letterSpacing:'-0.8px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{m.value}</p>
                        <span style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontWeight:600, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{m.up}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pedidos */}
                  <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:14, padding:'14px 16px', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize:9, color:'rgba(255,255,255,0.25)', margin:'0 0 12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Últimos pedidos</p>
                    {[
                      { name:'María G.',  amount:'44.99€', status:'Confirmado',  color:'#2EC4B6' },
                      { name:'Carlos R.', amount:'89.50€', status:'Llamando...', color:'#6366f1' },
                      { name:'Ana M.',    amount:'32.00€', status:'Pendiente',   color:'#f59e0b' },
                    ].map((o, i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <div style={{ width:24, height:24, borderRadius:8, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.5)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                            {o.name.charAt(0)}
                          </div>
                          <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:500, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{o.name}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.6)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{o.amount}</span>
                          <span style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:20, background:`${o.color}20`, color:o.color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge flotante */}
              <div className="logo-badge" style={{ position:'absolute', top:-18, right:-14, background:'#fff', borderRadius:18, padding:'11px 15px', boxShadow:'0 12px 32px rgba(0,0,0,0.14)', display:'flex', alignItems:'center', gap:10, border:'1px solid #f1f5f9' }}>
                <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(46,196,182,.4)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:800, color:'#0f172a', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>+87% confirmados</p>
                  <p style={{ fontSize:10, color:'#94a3b8', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>esta semana</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div style={{ background:'#0f172a', padding:'11px 0', overflow:'hidden', borderTop:'1px solid #1e293b', borderBottom:'1px solid #1e293b' }}>
        <div className="ticker-track">
          {[...Array(2)].map((_,ri) => (
            <div key={ri} style={{ display:'flex' }}>
              {['Confirmación automática','Score IA 0–100','Webhook Shopify','Vapi + Cartesia','Sin intervención humana','−42% devoluciones','Llamadas en tiempo real','24/7 activo'].map((t,i) => (
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:14, padding:'0 28px', fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'#2EC4B6', flexShrink:0 }} />{t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══ STATS ══ */}
      <section style={{ background:'linear-gradient(135deg,#0f172a,#1e1b4b,#0f172a)', padding:'clamp(40px,6vw,64px) 24px' }}>
        <Section>
          <div className="stats-grid" style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {[
              { value:42, suffix:'%', pre:'-', label:'Menos devoluciones', color:'#2EC4B6' },
              { value:87, suffix:'%', pre:'',  label:'Tasa de confirmación', color:'#a78bfa' },
              { value:5,  suffix:'min', pre:'<', label:'Por confirmación', color:'#34d399' },
              { value:120, suffix:'+', pre:'', label:'Tiendas activas', color:'#f59e0b' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <p style={{ fontSize:'clamp(28px,4vw,46px)', fontWeight:800, color:s.color, margin:'0 0 6px', letterSpacing:'-2px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  {s.pre}<AnimatedNumber value={s.value} suffix={s.suffix} />
                </p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,.35)', margin:0, textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:600, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* ══ CÓMO FUNCIONA ══ */}
      <section style={{ padding:'clamp(64px,8vw,100px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <Section>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Proceso</span>
              <h2 style={{ fontSize:'clamp(26px,4vw,46px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.8px', margin:'12px 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>4 pasos, 0 intervención humana</h2>
              <p style={{ fontSize:15, color:'#64748b', maxWidth:480, margin:'0 auto', lineHeight:1.75, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Desde que llega el pedido hasta que está confirmado, SAMGPLE lo hace todo solo en menos de 5 minutos.</p>
            </div>
          </Section>

          <div className="how-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {howItWorks.map((step, i) => (
              <Section key={i} style={{ transitionDelay:`${i * 0.09}s` }}>
                <div className="step-card">
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:step.color, borderRadius:'22px 22px 0 0' }} />
                  <div style={{ width:44, height:44, borderRadius:14, background:`${step.color}12`, border:`1.5px solid ${step.color}30`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <span style={{ fontSize:16, fontWeight:800, color:step.color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.n}</span>
                  </div>
                  <h3 style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:'0 0 8px', lineHeight:1.3, letterSpacing:'-0.3px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.title}</h3>
                  <p style={{ fontSize:12, color:'#64748b', lineHeight:1.65, margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROBLEM ══ */}
      <section style={{ padding:'clamp(64px,8vw,100px) 24px', background:'#f8fafc' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div className="problem-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(40px,6vw,80px)', alignItems:'center' }}>
            <Section>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>El problema</span>
              <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', lineHeight:1.1, margin:'12px 0 20px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                El COD tiene un problema de confianza
              </h2>
              <p style={{ fontSize:15, color:'#64748b', lineHeight:1.8, margin:'0 0 16px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Entre el 25% y el 45% de los pedidos COD no se entregan. Devoluciones, costes de envío perdidos y productos dañados.
              </p>
              <p style={{ fontSize:15, color:'#64748b', lineHeight:1.8, margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                La mayoría de tiendas envían sin validar. <strong style={{ color:'#0f172a' }}>Nosotros confirmamos primero, enviamos después.</strong>
              </p>
            </Section>
            <Section style={{ transitionDelay:'0.1s' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { pct:'38%',  label:'Pedidos COD que no se entregan de media', color:'#dc2626', bg:'#fef2f2', border:'#fecaca' },
                  { pct:'2.4x', label:'Más caro gestionar una devolución que prevenirla', color:'#d97706', bg:'#fffbeb', border:'#fde68a' },
                  { pct:'-42%', label:'Reducción de devoluciones con SAMGPLE', color:'#0f766e', bg:'#f0fdf4', border:'#a7f3d0' },
                ].map(s => (
                  <div key={s.label} className="prob-card" style={{ background:s.bg, border:`1.5px solid ${s.border}` }}>
                    <span style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:s.color, letterSpacing:'-1.2px', flexShrink:0, fontFamily:"'DM Sans',system-ui,sans-serif", minWidth:64 }}>{s.pct}</span>
                    <span style={{ fontSize:13, color:'#475569', lineHeight:1.55, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section style={{ padding:'clamp(64px,8vw,100px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <Section>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Características</span>
              <h2 style={{ fontSize:'clamp(26px,4vw,46px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.8px', margin:'12px 0 0', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Todo para dominar el COD</h2>
            </div>
          </Section>

          <div className="feat-layout" style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:14 }}>
            {/* Tabs */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {features.map((f, i) => (
                <div key={i} className="feat-tab" onClick={() => setActiveFeature(i)}
                  style={{ border:`1.5px solid ${activeFeature === i ? f.border : '#f1f5f9'}`, background: activeFeature === i ? f.bg : '#fff' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:11, background: activeFeature === i ? '#fff' : '#f8fafc', border:`1.5px solid ${activeFeature === i ? f.border : '#f1f5f9'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s', boxShadow: activeFeature === i ? `0 3px 10px ${f.color}25` : 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeFeature === i ? f.color : '#94a3b8'} strokeWidth="2" strokeLinecap="round"><path d={f.icon}/></svg>
                    </div>
                    <span style={{ fontSize:13, fontWeight: activeFeature === i ? 700 : 500, color: activeFeature === i ? '#0f172a' : '#64748b', fontFamily:"'DM Sans',system-ui,sans-serif", letterSpacing:'-0.2px' }}>{f.title}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detalle */}
            <div key={activeFeature} style={{ background:features[activeFeature].bg, borderRadius:24, padding:'clamp(28px,4vw,40px)', border:`2px solid ${features[activeFeature].border}`, transition:'all .2s ease', position:'relative', overflow:'hidden', animation:'fadeUp .3s ease' }}>
              <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, background:`radial-gradient(circle,${features[activeFeature].color}15,transparent 70%)`, pointerEvents:'none' }} />
              <div style={{ width:54, height:54, borderRadius:17, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22, boxShadow:`0 6px 20px ${features[activeFeature].color}25`, border:`1.5px solid ${features[activeFeature].border}` }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={features[activeFeature].color} strokeWidth="2" strokeLinecap="round"><path d={features[activeFeature].icon}/></svg>
              </div>
              <h3 style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:800, color:'#0f172a', margin:'0 0 12px', letterSpacing:'-0.8px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{features[activeFeature].title}</h3>
              <p style={{ fontSize:15, color:'#64748b', lineHeight:1.8, margin:'0 0 26px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{features[activeFeature].desc}</p>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', borderRadius:20, padding:'9px 18px', border:`1.5px solid ${features[activeFeature].border}`, boxShadow:`0 3px 10px ${features[activeFeature].color}15` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={features[activeFeature].color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize:13, fontWeight:700, color:features[activeFeature].color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{features[activeFeature].stat}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding:'clamp(64px,8vw,100px) 24px', background:'#f8fafc' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <Section>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Testimonios</span>
              <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'12px 0 0', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Lo que dicen nuestros clientes</h2>
            </div>
          </Section>
          <div className="testi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {testimonials.map((t, i) => (
              <Section key={i} style={{ transitionDelay:`${i * 0.09}s` }}>
                <div className="testi-card">
                  <div style={{ display:'flex', gap:3, marginBottom:18 }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" style={{ animation:`starPop .3s ${s*0.06}s both` }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize:14, color:'#374151', lineHeight:1.8, margin:'0 0 24px', fontStyle:'italic', fontFamily:"'DM Sans',system-ui,sans-serif" }}>"{t.text}"</p>
                  <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                    <div style={{ width:40, height:40, borderRadius:13, background:`linear-gradient(135deg,${t.color},${t.color}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color:'#fff', boxShadow:`0 4px 12px ${t.color}40` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{t.name}</p>
                      <p style={{ fontSize:11, color:'#94a3b8', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section style={{ padding:'clamp(64px,8vw,100px) 24px', background:'linear-gradient(150deg,#080f24,#0c1a3e,#0d1330)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-120, left:'50%', transform:'translateX(-50%)', width:700, height:700, background:'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, right:-80, width:400, height:400, background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)', pointerEvents:'none' }} />
        <Section>
          <div style={{ maxWidth:600, margin:'0 auto', position:'relative' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.1)', border:'1px solid rgba(46,196,182,0.22)', borderRadius:20, padding:'5px 14px', marginBottom:24 }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#2EC4B6', animation:'pulse 2s infinite', display:'inline-block' }} />
              <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:'0.07em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>EMPIEZA HOY</span>
            </div>
            <h2 style={{ fontSize:'clamp(28px,5vw,54px)', fontWeight:800, color:'#fff', letterSpacing:'-2px', margin:'0 0 20px', lineHeight:1.08, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Confirma pedidos COD<br />
              <span style={{ color:'#2EC4B6' }}>con IA desde hoy</span>
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', margin:'0 0 36px', lineHeight:1.75, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Tokens de bienvenida incluidos. Sin suscripción mensual. Cancela cuando quieras.
            </p>
            <div className="cta-btns" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:24 }}>
              <Link href="/registro" className="cta-main">
                Crear cuenta gratis
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" style={{ fontSize:15, fontWeight:600, padding:'14px 28px', borderRadius:14, border:'1.5px solid rgba(255,255,255,0.18)', color:'rgba(255,255,255,0.75)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:7, transition:'all .15s ease', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Ver precios
              </Link>
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.2)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Cancela cuando quieras</p>
          </div>
        </Section>
      </section>
    </div>
  )
}