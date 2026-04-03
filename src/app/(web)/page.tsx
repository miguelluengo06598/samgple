'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const TYPEWRITER_WORDS = ['COD fallidos', 'devoluciones', 'pedidos sin confirmar', 'entregas perdidas', 'clientes fantasma']

function useInView(threshold = 0.15) {
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
    <span style={{ color:'#2EC4B6' }}>
      {display}
      <span style={{ display:'inline-block', width:3, height:'0.85em', background:'#2EC4B6', borderRadius:2, marginLeft:3, verticalAlign:'middle', animation:'blink 0.8s infinite' }} />
    </span>
  )
}

function AnimatedNumber({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [current, setCurrent] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    const steps = 40
    const increment = value / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      setCurrent(Math.min(Math.round(increment * step), value))
      if (step >= steps) clearInterval(timer)
    }, 1200 / steps)
    return () => clearInterval(timer)
  }, [inView, value])
  return <span ref={ref}>{prefix}{current}{suffix}</span>
}

function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}s, transform .7s cubic-bezier(.16,1,.3,1) ${delay}s`,
      ...style
    }}>
      {children}
    </div>
  )
}

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'Score de riesgo IA',
      desc: 'Cada pedido recibe una puntuación 0–100 basada en historial del cliente, zona, importe y 15+ señales de comportamiento.',
      color: '#2EC4B6', bg: '#f0fdf9', border: '#99f6e4',
      stat: '15+ señales analizadas',
    },
    {
      icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
      title: 'Llamadas automáticas',
      desc: 'Tu asistente IA llama al cliente, confirma el pedido y actualiza el estado automáticamente. Sin intervención humana.',
      color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
      stat: '87% tasa de confirmación',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      title: 'Integración Shopify',
      desc: 'Conecta tu tienda en 2 clics. Los pedidos entran solos vía webhook y el proceso arranca automáticamente.',
      color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
      stat: 'Conectado en 10 minutos',
    },
    {
      icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      title: 'Finanzas en tiempo real',
      desc: 'Dashboard de ingresos confirmados, tasa de entrega, ROI y métricas de llamadas actualizado al instante.',
      color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
      stat: 'Actualización instantánea',
    },
  ]

  const howItWorks = [
    { n:'01', title:'Pedido entra de Shopify', desc:'Webhook instantáneo. El pedido aparece en tu panel en segundos sin ninguna acción manual.', color:'#2EC4B6' },
    { n:'02', title:'IA analiza el riesgo', desc:'Score 0–100 en milisegundos. Historial, zona, importe, comportamiento y 15+ señales.', color:'#16a34a' },
    { n:'03', title:'Llamada automática', desc:'Tu asistente llama al cliente con el nombre de tu empresa. Confirma, cancela o reagenda.', color:'#6366f1' },
    { n:'04', title:'Estado actualizado solo', desc:'El pedido se actualiza en tiempo real. Confirmado, cancelado o reagendado automáticamente.', color:'#f59e0b' },
  ]

  const testimonials = [
    { name:'Alejandro M.', role:'CEO · TiendaRopa.es', text:'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato.', avatar:'A', color:'#2EC4B6' },
    { name:'Carmen R.', role:'Fundadora · BeautyDrop', text:'El asistente IA llama mejor que mis agentes humanos. Los clientes confirman más porque la llamada es rápida y clara.', avatar:'C', color:'#16a34a' },
    { name:'David F.', role:'Operaciones · ShopXpress', text:'Conectamos Shopify en 10 minutos. Los pedidos empezaron a confirmarse solos esa misma tarde. Increíble.', avatar:'D', color:'#6366f1' },
  ]

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", overflowX:'hidden', background:'#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; }

        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes starPop  { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }
        @keyframes slideIn  { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }

        .hp-gradient-text {
          background: linear-gradient(135deg,#2EC4B6 0%,#16a34a 50%,#2EC4B6 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        .hp-cta-main {
          font-family:'DM Sans',system-ui,sans-serif;
          font-size:15px; font-weight:700;
          padding:14px 32px; border-radius:14px;
          background:linear-gradient(135deg,#2EC4B6,#16a34a);
          color:#fff; text-decoration:none;
          display:inline-flex; align-items:center; gap:8px;
          box-shadow:0 8px 28px rgba(46,196,182,0.35);
          transition:all .2s cubic-bezier(.34,1.56,.64,1);
          will-change:transform; border:none; cursor:pointer;
          letter-spacing:-.2px;
        }
        .hp-cta-main:hover  { transform:translateY(-2px); box-shadow:0 16px 40px rgba(46,196,182,.5); }
        .hp-cta-main:active { transform:scale(.97); }

        .hp-cta-ghost {
          font-family:'DM Sans',system-ui,sans-serif;
          font-size:15px; font-weight:600;
          padding:14px 28px; border-radius:14px;
          border:1.5px solid #e2e8f0; color:#0f172a;
          text-decoration:none; background:#fff;
          display:inline-flex; align-items:center; gap:7px;
          transition:all .15s ease; letter-spacing:-.1px;
        }
        .hp-cta-ghost:hover { border-color:#cbd5e1; box-shadow:0 4px 16px rgba(0,0,0,.07); transform:translateY(-1px); }

        .hp-step-card {
          background:#fff; border-radius:24px; padding:28px 24px;
          border:1px solid #f1f5f9;
          transition:all .22s ease; position:relative; overflow:hidden;
          will-change:transform;
        }
        .hp-step-card:hover { transform:translateY(-4px); box-shadow:0 20px 50px rgba(0,0,0,.08); border-color:#e2e8f0; }

        .hp-feat-tab {
          display:flex; align-items:center; gap:12px;
          padding:13px 16px; border-radius:16px;
          cursor:pointer; transition:all .18s ease;
          border:1.5px solid transparent;
        }
        .hp-feat-tab:hover { background:#f8fafc; }

        .hp-testi-card {
          background:#fff; border-radius:24px; padding:32px;
          border:1px solid #f1f5f9;
          transition:all .22s ease; will-change:transform;
        }
        .hp-testi-card:hover { transform:translateY(-4px); box-shadow:0 20px 52px rgba(0,0,0,.09); border-color:#e2e8f0; }

        .hp-live-dot {
          width:7px; height:7px; border-radius:50%;
          background:#2EC4B6; display:inline-block;
          box-shadow:0 0 8px rgba(46,196,182,.8);
          animation:pulse 2.5s ease-in-out infinite;
        }

        .hp-float { animation:floatY 5s ease-in-out infinite; }

        .hp-prob-row {
          display:flex; align-items:center; gap:18px;
          padding:18px 22px; border-radius:18px;
          transition:all .2s ease;
        }
        .hp-prob-row:hover { transform:translateX(5px); }

        @media(max-width:960px) {
          .hp-hero-grid    { grid-template-columns:1fr !important; }
          .hp-feat-layout  { grid-template-columns:1fr !important; }
          .hp-testi-grid   { grid-template-columns:1fr !important; }
          .hp-problem-grid { grid-template-columns:1fr !important; }
          .hp-stats-grid   { grid-template-columns:repeat(2,1fr) !important; }
          .hp-how-grid     { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:600px) {
          .hp-how-grid   { grid-template-columns:1fr !important; }
          .hp-cta-btns   { flex-direction:column !important; }
          .hp-cta-btns a,.hp-cta-btns button { width:100%; justify-content:center; }
          .hp-hero-stats { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section style={{ padding:'clamp(96px,11vw,148px) clamp(20px,5vw,80px) clamp(72px,9vw,120px)', background:'#fff', position:'relative', overflow:'hidden' }}>

        {/* Decoración de fondo muy sutil */}
        <div style={{ position:'absolute', top:-200, right:-160, width:700, height:700, background:'radial-gradient(circle,rgba(46,196,182,0.06),transparent 60%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-160, left:-120, width:600, height:600, background:'radial-gradient(circle,rgba(22,163,74,0.05),transparent 60%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <div className="hp-hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(48px,7vw,96px)', alignItems:'center' }}>

            {/* Texto */}
            <div style={{ animation:'fadeUp .6s ease both' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(46,196,182,0.06)', border:'1px solid rgba(46,196,182,0.18)', borderRadius:20, padding:'6px 14px', marginBottom:32 }}>
                <span className="hp-live-dot" />
                <span style={{ fontSize:12, fontWeight:700, color:'#0f766e', letterSpacing:'0.04em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>120+ tiendas confirmando con IA</span>
              </div>

              <h1 style={{ fontSize:'clamp(38px,5.5vw,68px)', fontWeight:800, color:'#0f172a', lineHeight:1.03, letterSpacing:'-3px', margin:'0 0 12px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Para de perder<br />dinero en
              </h1>
              <div style={{ fontSize:'clamp(38px,5.5vw,68px)', fontWeight:800, lineHeight:1.03, letterSpacing:'-3px', marginBottom:28, minHeight:'clamp(46px,6.5vw,82px)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                <TypewriterText />
              </div>

              <p style={{ fontSize:'clamp(16px,1.8vw,18px)', color:'#64748b', lineHeight:1.8, margin:'0 0 40px', maxWidth:500, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                SAMGPLE analiza cada pedido COD con IA, llama automáticamente al cliente y confirma la entrega antes de enviar.{' '}
                <strong style={{ color:'#0f172a', fontWeight:700 }}>Reduce devoluciones hasta un 42%.</strong>
              </p>

              <div className="hp-cta-btns" style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:40 }}>
                <Link href="/registro" className="hp-cta-main">
                  Empezar gratis
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/metodologia" className="hp-cta-ghost">
                  Ver cómo funciona
                </Link>
              </div>

              {/* Social proof */}
              <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
                <div style={{ display:'flex' }}>
                  {['#2EC4B6','#16a34a','#6366f1','#f59e0b'].map((c,i) => (
                    <div key={i} style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${c},${c}bb)`, border:'2.5px solid #fff', marginLeft:i===0?0:-10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', boxShadow:`0 2px 8px ${c}40` }}>
                      {['A','M','C','D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display:'flex', gap:2, marginBottom:3 }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b" style={{ animation:`starPop .3s ${s*.06}s both` }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>+120 tiendas · 4.9/5 valoración</p>
                </div>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div style={{ animation:'fadeUp .6s ease .15s both', position:'relative' }}>
              <div style={{ background:'#0f172a', borderRadius:28, overflow:'hidden', boxShadow:'0 48px 100px rgba(15,23,42,0.28), 0 0 0 1px rgba(255,255,255,0.04)' }}>
                {/* Barra superior */}
                <div style={{ background:'rgba(255,255,255,0.04)', padding:'13px 18px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  {['#ef4444','#f59e0b','#22c55e'].map(c => (
                    <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c, boxShadow:`0 0 6px ${c}80` }} />
                  ))}
                  <div style={{ flex:1, height:20, background:'rgba(255,255,255,0.04)', borderRadius:6, maxWidth:240, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>app.samgple.com/pedidos</span>
                  </div>
                </div>

                {/* Contenido */}
                <div style={{ padding:'clamp(14px,2vw,22px)' }}>
                  {/* Métricas */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                    {[
                      { label:'INGRESOS HOY', value:'4,892€', color:'#2EC4B6', up:'+12%' },
                      { label:'CONFIRMADOS',  value:'87%',    color:'#22c55e', up:'↑ 3pts' },
                      { label:'LLAMADAS',     value:'143',    color:'#a78bfa', up:'en vivo' },
                      { label:'SCORE MEDIO',  value:'34',     color:'#f59e0b', up:'bajo riesgo' },
                    ].map(m => (
                      <div key={m.label} style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'13px 14px', border:'1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ fontSize:9, color:'rgba(255,255,255,0.3)', margin:'0 0 6px', textTransform:'uppercase', letterSpacing:'0.07em', fontWeight:700, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{m.label}</p>
                        <p style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:800, color:m.color, margin:'0 0 2px', letterSpacing:'-0.8px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{m.value}</p>
                        <span style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontWeight:600, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{m.up}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pedidos recientes */}
                  <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:14, padding:'13px 15px', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize:9, color:'rgba(255,255,255,0.25)', margin:'0 0 12px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Últimos pedidos</p>
                    {[
                      { name:'María G.',  amount:'44.99€', status:'Confirmado',  color:'#22c55e' },
                      { name:'Carlos R.', amount:'89.50€', status:'Llamando...', color:'#2EC4B6' },
                      { name:'Ana M.',    amount:'32.00€', status:'Pendiente',   color:'#f59e0b' },
                    ].map((o,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderBottom:i<2?'1px solid rgba(255,255,255,0.04)':'none' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <div style={{ width:25, height:25, borderRadius:8, background:'rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'rgba(255,255,255,0.5)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{o.name.charAt(0)}</div>
                          <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:500, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{o.name}</span>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.55)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{o.amount}</span>
                          <span style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:20, background:`${o.color}20`, color:o.color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Badge flotante */}
              <div className="hp-float" style={{ position:'absolute', top:-18, right:-16, background:'#fff', borderRadius:18, padding:'12px 16px', boxShadow:'0 12px 36px rgba(0,0,0,0.14)', display:'flex', alignItems:'center', gap:10, border:'1px solid #f1f5f9' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#2EC4B6,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(46,196,182,.4)' }}>
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

      {/* ══════════════════════════════
          STATS
      ══════════════════════════════ */}
      <section style={{ background:'#f8fafc', borderTop:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9', padding:'clamp(40px,5vw,64px) clamp(20px,5vw,80px)' }}>
        <Reveal>
          <div className="hp-stats-grid" style={{ maxWidth:960, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
            {[
              { value:42,  suffix:'%', prefix:'-', label:'Menos devoluciones',   color:'#2EC4B6' },
              { value:87,  suffix:'%', prefix:'',  label:'Tasa de confirmación', color:'#16a34a' },
              { value:5,   suffix:'min', prefix:'<', label:'Por confirmación',   color:'#6366f1' },
              { value:120, suffix:'+', prefix:'',  label:'Tiendas activas',      color:'#f59e0b' },
            ].map((s,i) => (
              <div key={i} style={{ textAlign:'center', padding:'clamp(20px,3vw,32px) 16px', borderRight:i<3?'1px solid #f1f5f9':'none' }}>
                <p style={{ fontSize:'clamp(30px,4vw,48px)', fontWeight:800, color:s.color, margin:'0 0 6px', letterSpacing:'-2px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  <AnimatedNumber value={s.value} suffix={s.suffix} prefix={s.prefix} />
                </p>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ══════════════════════════════
          CÓMO FUNCIONA
      ══════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,128px) clamp(20px,5vw,80px)', background:'#fff' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>El proceso</span>
              <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, color:'#0f172a', letterSpacing:'-2px', margin:'12px 0 16px', fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.1 }}>
                4 pasos.<br className="hp-mobile-br" /> 0 intervención humana.
              </h2>
              <p style={{ fontSize:17, color:'#64748b', maxWidth:480, margin:'0 auto', lineHeight:1.75, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Desde que llega el pedido hasta que está confirmado, SAMGPLE lo hace todo solo en menos de 5 minutos.
              </p>
            </div>
          </Reveal>

          <div className="hp-how-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
            {howItWorks.map((step,i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="hp-step-card">
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:step.color, borderRadius:'24px 24px 0 0' }} />
                  <div style={{ width:48, height:48, borderRadius:15, background:`${step.color}12`, border:`1.5px solid ${step.color}25`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                    <span style={{ fontSize:18, fontWeight:800, color:step.color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.n}</span>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:'0 0 10px', letterSpacing:'-0.4px', lineHeight:1.3, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.title}</h3>
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          EL PROBLEMA
      ══════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,128px) clamp(20px,5vw,80px)', background:'#f8fafc' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div className="hp-problem-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(48px,7vw,96px)', alignItems:'center' }}>
            <Reveal>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>El problema</span>
              <h2 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:800, color:'#0f172a', letterSpacing:'-2px', lineHeight:1.08, margin:'12px 0 20px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                El COD tiene un problema<br />de confianza
              </h2>
              <p style={{ fontSize:16, color:'#64748b', lineHeight:1.8, margin:'0 0 18px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                Entre el 25% y el 45% de los pedidos COD no se entregan. Devoluciones, costes de envío perdidos y productos dañados.
              </p>
              <p style={{ fontSize:16, color:'#64748b', lineHeight:1.8, margin:'0 0 36px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                La mayoría de tiendas envían sin validar.{' '}
                <strong style={{ color:'#0f172a', fontWeight:700 }}>Nosotros confirmamos primero, enviamos después.</strong>
              </p>
              <Link href="/metodologia" className="hp-cta-ghost" style={{ alignSelf:'flex-start' }}>
                Ver cómo funciona
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { pct:'38%',  label:'Pedidos COD que no se entregan de media',    color:'#dc2626', bg:'#fef2f2', border:'#fecaca' },
                  { pct:'2.4x', label:'Más caro gestionar una devolución que prevenirla', color:'#d97706', bg:'#fffbeb', border:'#fde68a' },
                  { pct:'-42%', label:'Reducción de devoluciones con SAMGPLE',       color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0' },
                ].map((s,i) => (
                  <div key={i} className="hp-prob-row" style={{ background:s.bg, border:`1.5px solid ${s.border}` }}>
                    <span style={{ fontSize:'clamp(24px,3vw,32px)', fontWeight:800, color:s.color, letterSpacing:'-1.5px', flexShrink:0, minWidth:72, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.pct}</span>
                    <span style={{ fontSize:14, color:'#475569', lineHeight:1.55, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURES
      ══════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,128px) clamp(20px,5vw,80px)', background:'#fff' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Características</span>
              <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, color:'#0f172a', letterSpacing:'-2px', margin:'12px 0 0', fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.1 }}>
                Todo para dominar el COD
              </h2>
            </div>
          </Reveal>

          <div className="hp-feat-layout" style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:16 }}>
            {/* Tabs */}
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {features.map((f,i) => (
                <div key={i} className="hp-feat-tab" onClick={() => setActiveFeature(i)}
                  style={{
                    background: activeFeature===i ? f.bg : 'transparent',
                    border: `1.5px solid ${activeFeature===i ? f.border : 'transparent'}`,
                  }}>
                  <div style={{ width:38, height:38, borderRadius:12, background: activeFeature===i ? '#fff' : '#f8fafc', border:`1.5px solid ${activeFeature===i ? f.border : '#f1f5f9'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .18s', boxShadow:activeFeature===i ? `0 3px 10px ${f.color}20` : 'none' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeFeature===i ? f.color : '#94a3b8'} strokeWidth="2" strokeLinecap="round"><path d={f.icon}/></svg>
                  </div>
                  <span style={{ fontSize:14, fontWeight:activeFeature===i ? 700 : 500, color:activeFeature===i ? '#0f172a' : '#64748b', fontFamily:"'DM Sans',system-ui,sans-serif", letterSpacing:'-0.2px' }}>{f.title}</span>
                </div>
              ))}
            </div>

            {/* Panel */}
            <div key={activeFeature} style={{ background:features[activeFeature].bg, borderRadius:28, padding:'clamp(28px,4vw,44px)', border:`2px solid ${features[activeFeature].border}`, position:'relative', overflow:'hidden', animation:'slideIn .3s ease' }}>
              <div style={{ position:'absolute', top:-80, right:-80, width:240, height:240, background:`radial-gradient(circle,${features[activeFeature].color}12,transparent 70%)`, pointerEvents:'none' }} />
              <div style={{ width:56, height:56, borderRadius:18, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24, boxShadow:`0 6px 20px ${features[activeFeature].color}25`, border:`1.5px solid ${features[activeFeature].border}` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={features[activeFeature].color} strokeWidth="2" strokeLinecap="round"><path d={features[activeFeature].icon}/></svg>
              </div>
              <h3 style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:'#0f172a', margin:'0 0 14px', letterSpacing:'-1px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{features[activeFeature].title}</h3>
              <p style={{ fontSize:16, color:'#64748b', lineHeight:1.8, margin:'0 0 28px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{features[activeFeature].desc}</p>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', borderRadius:20, padding:'10px 20px', border:`1.5px solid ${features[activeFeature].border}`, boxShadow:`0 3px 10px ${features[activeFeature].color}15` }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={features[activeFeature].color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize:13, fontWeight:700, color:features[activeFeature].color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{features[activeFeature].stat}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          TESTIMONIOS
      ══════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,128px) clamp(20px,5vw,80px)', background:'#f8fafc' }}>
        <div style={{ maxWidth:1160, margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:64 }}>
              <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Testimonios</span>
              <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, color:'#0f172a', letterSpacing:'-2px', margin:'12px 0 0', fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.1 }}>
                Lo que dicen nuestros clientes
              </h2>
            </div>
          </Reveal>

          <div className="hp-testi-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {testimonials.map((t,i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="hp-testi-card">
                  <div style={{ display:'flex', gap:3, marginBottom:20 }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" style={{ animation:`starPop .3s ${s*.06}s both` }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontSize:15, color:'#374151', lineHeight:1.8, margin:'0 0 28px', fontStyle:'italic', fontFamily:"'DM Sans',system-ui,sans-serif" }}>"{t.text}"</p>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:13, background:`linear-gradient(135deg,${t.color},${t.color}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', boxShadow:`0 4px 12px ${t.color}40` }}>
                      {t.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{t.name}</p>
                      <p style={{ fontSize:12, color:'#94a3b8', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CTA FINAL
      ══════════════════════════════ */}
      <section style={{ padding:'clamp(80px,10vw,128px) clamp(20px,5vw,80px)', background:'#fff', textAlign:'center' }}>
        <Reveal>
          <div style={{ maxWidth:640, margin:'0 auto' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.07)', border:'1px solid rgba(46,196,182,0.2)', borderRadius:20, padding:'6px 15px', marginBottom:28 }}>
              <span className="hp-live-dot" />
              <span style={{ fontSize:11, fontWeight:700, color:'#0f766e', letterSpacing:'0.05em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>EMPIEZA HOY · SIN TARJETA</span>
            </div>
            <h2 style={{ fontSize:'clamp(30px,5vw,60px)', fontWeight:800, color:'#0f172a', letterSpacing:'-2.5px', margin:'0 0 20px', lineHeight:1.05, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Confirma pedidos COD<br />
              <span className="hp-gradient-text">con IA desde hoy</span>
            </h2>
            <p style={{ fontSize:17, color:'#64748b', margin:'0 0 40px', lineHeight:1.75, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Tokens de bienvenida incluidos. Sin suscripción mensual.<br />Cancela cuando quieras.
            </p>
            <div className="hp-cta-btns" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:24 }}>
              <Link href="/registro" className="hp-cta-main">
                Crear cuenta gratis
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" className="hp-cta-ghost">
                Ver precios
              </Link>
            </div>
            <p style={{ fontSize:12, color:'#94a3b8', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Sin tarjeta · Tokens de prueba incluidos · Cancela cuando quieras
            </p>
          </div>
        </Reveal>
      </section>

    </div>
  )
}