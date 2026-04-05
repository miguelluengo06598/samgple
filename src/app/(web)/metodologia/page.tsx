'use client'

import { useState, useEffect, useRef } from 'react'
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
        transform: inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────── */
const icons = {
  mic: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8',
  brain: 'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z',
  database: 'M12 2C6.48 2 2 4.24 2 7s4.48 5 10 5 10-2.24 10-5-4.48-5-10-5z M2 7v5c0 2.76 4.48 5 10 5s10-2.24 10-5V7 M2 12v5c0 2.76 4.48 5 10 5s10-2.24 10-5v-5',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  check: 'M20 6L9 17l-5-5',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 11a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  refresh: 'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15',
  bar: 'M18 20V10 M12 20V4 M6 20v-6',
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const steps = [
  {
    n: '01',
    color: '#2EC4B6',
    bg: 'linear-gradient(135deg,rgba(46,196,182,0.08),rgba(46,196,182,0.04))',
    border: 'rgba(46,196,182,0.2)',
    glow: 'rgba(46,196,182,0.15)',
    label: 'Captura de Voz',
    sublabel: 'Vapi + IA conversacional',
    body: 'En el momento en que llega un pedido COD, SAMGPLE inicia una llamada automática al cliente usando tu voz de marca. La IA conversacional (Vapi + Cartesia) identifica la intención, confirma la dirección y detecta señales de riesgo en tiempo real.',
    icon: icons.mic,
    chips: ['Vapi', 'Cartesia TTS', 'NLP en tiempo real', 'Voz personalizada'],
    stat: { v: '< 30s', l: 'Por llamada' },
  },
  {
    n: '02',
    color: '#6366f1',
    bg: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(99,102,241,0.04))',
    border: 'rgba(99,102,241,0.2)',
    glow: 'rgba(99,102,241,0.15)',
    label: 'Análisis Inteligente',
    sublabel: '15+ señales · Score 0–100',
    body: 'El motor evalúa más de 15 señales agrupadas en 5 categorías: historial del cliente, dirección, zona logística, producto y señales operativas. El resultado es un score de riesgo preciso, explicable y trazable — en menos de 5 segundos.',
    icon: icons.brain,
    chips: ['Historial cliente', 'Zona geo', 'Producto', 'Operativo', 'Score 0-100'],
    stat: { v: '< 5s', l: 'Análisis completo' },
  },
  {
    n: '03',
    color: '#10b981',
    bg: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.04))',
    border: 'rgba(16,185,129,0.2)',
    glow: 'rgba(16,185,129,0.15)',
    label: 'Registro y Acción',
    sublabel: 'Supabase · Shopify sync',
    body: 'Todo queda registrado de forma segura en Supabase. El operador recibe la tarjeta de decisión con el score, señales y recomendación. En un clic: proceder, revisar, llamar o cancelar. Shopify se actualiza automáticamente.',
    icon: icons.database,
    chips: ['Supabase', 'Shopify Webhooks', '1-clic decisión', 'Sync automático'],
    stat: { v: '1 clic', l: 'Para decidir' },
  },
  {
    n: '04',
    color: '#f59e0b',
    bg: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.04))',
    border: 'rgba(245,158,11,0.2)',
    glow: 'rgba(245,158,11,0.15)',
    label: 'Feedback en Tiempo Real',
    sublabel: 'Aprendizaje continuo',
    body: 'Cada resultado alimenta el sistema. Devoluciones, entregas exitosas, zonas problemáticas — todo calibra el score para adaptarse a tu negocio real. Con el tiempo, SAMGPLE aprende tus patrones y reduce los falsos positivos.',
    icon: icons.refresh,
    chips: ['Aprendizaje continuo', 'Calibración zona', 'Ajuste de pesos', 'Mejora automática'],
    stat: { v: '−42%', l: 'Devoluciones' },
  },
]

const bentoCards = [
  {
    title: 'Score explicable',
    body: 'No es una caja negra. Cada punto tiene una causa real y trazable.',
    icon: icons.bar,
    color: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe',
    span: 1,
    tall: false,
  },
  {
    title: 'Control humano siempre',
    body: 'La IA recomienda. El operador decide. Siempre.',
    icon: icons.shield,
    color: '#10b981',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    span: 1,
    tall: false,
  },
  {
    title: '7 pasos automatizados, 0 intervención manual por defecto',
    body: 'Desde el webhook hasta la actualización en Shopify, el flujo completo puede ser 100% automático — o con revisión humana cuando tú lo definas.',
    icon: icons.zap,
    color: '#2EC4B6',
    bg: 'linear-gradient(135deg,rgba(46,196,182,0.06),rgba(99,102,241,0.04))',
    border: 'rgba(46,196,182,0.2)',
    span: 2,
    tall: false,
  },
  {
    title: 'Llamada o WhatsApp',
    body: 'Confirma con tu voz de marca por teléfono o WhatsApp antes de enviar.',
    icon: icons.phone,
    color: '#ec4899',
    bg: '#fdf2f8',
    border: '#fbcfe8',
    span: 1,
    tall: false,
  },
  {
    title: 'Integración Shopify en 10 min',
    body: 'OAuth en 2 clics. Sin código. Sin agencias.',
    icon: icons.check,
    color: '#f59e0b',
    bg: '#fffbeb',
    border: '#fde68a',
    span: 1,
    tall: false,
  },
]

const scores = [
  { range: '0–24', label: 'Bajo', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', action: 'Proceder' },
  { range: '25–49', label: 'Medio', color: '#d97706', bg: '#fffbeb', border: '#fde68a', action: 'Revisar' },
  { range: '50–74', label: 'Alto', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', action: 'Validar' },
  { range: '75–100', label: 'Muy alto', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', action: 'Bloquear' },
]

const faqs = [
  { q: '¿Necesito instalar algo en Shopify?', a: 'No. Solo conectas vía OAuth en 2 clics. Todo automático desde ese momento.' },
  { q: '¿El score es igual para todas las tiendas?', a: 'No. Se ajusta con el tiempo a tu historial real de entregas y devoluciones.' },
  { q: '¿Qué pasa si el cliente no contesta?', a: 'SAMGPLE reagenda automáticamente. Tú decides el número de intentos máximos.' },
  { q: '¿La IA puede equivocarse?', a: 'Sí. Por eso el control es siempre humano. Genera recomendaciones, no decisiones.' },
]

const ticker = ['Webhook Shopify', 'Score 0–100', '15+ señales', 'Vapi + Cartesia', 'WhatsApp automático', 'Aprendizaje continuo', 'IA explicable', 'Decisión humana']

/* ─────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────── */
export default function MetodologiaPage() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % steps.length), 2800)
    return () => clearInterval(t)
  }, [])

  const active = steps[activeStep]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; }

        @keyframes met-pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes met-scroll   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes met-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes met-shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes met-beam     { 0%{stroke-dashoffset:200} 100%{stroke-dashoffset:0} }
        @keyframes met-dot-in   { 0%{r:0;opacity:0} 80%{r:5;opacity:1} 100%{r:4;opacity:1} }
        @keyframes met-fadein   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

        .met-grad-text {
          background: linear-gradient(135deg, #2EC4B6, #6366f1, #2EC4B6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: met-shimmer 4s linear infinite;
        }

        .met-step-pill { transition: all 0.18s ease; cursor: pointer; }
        .met-step-pill:hover { transform: translateX(3px); }

        .met-bento-card { transition: all 0.2s ease; }
        .met-bento-card:hover { transform: translateY(-3px); box-shadow: 0 20px 48px rgba(0,0,0,0.09) !important; }

        .met-faq-card { transition: all 0.15s ease; }
        .met-faq-card:hover { transform: translateY(-2px); background: #fff !important; box-shadow: 0 8px 28px rgba(0,0,0,0.07) !important; }

        .met-cta-btn { transition: all 0.15s ease; }
        .met-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(46,196,182,0.38) !important; }
        .met-cta-ghost { transition: all 0.15s ease; }
        .met-cta-ghost:hover { background: #f8fafc !important; }

        /* BEAM SVG */
        .met-beam-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: met-beam 1.6s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .met-beam-dot {
          animation: met-dot-in 0.4s 1.4s cubic-bezier(0.16,1,0.3,1) forwards;
          r: 0;
        }

        /* STEP DETAIL */
        .met-step-detail {
          animation: met-fadein 0.35s cubic-bezier(0.16,1,0.3,1);
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .met-steps-layout { grid-template-columns: 1fr !important; }
          .met-step-pills   { display: none !important; }
          .met-bento-grid   { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 680px) {
          .met-bento-grid  { grid-template-columns: 1fr !important; }
          .met-bento-span  { grid-column: span 1 !important; }
          .met-score-bar   { flex-direction: column !important; }
          .met-faq-grid    { grid-template-columns: 1fr !important; }
          .met-hero-stats  { grid-template-columns: repeat(2,1fr) !important; }
          .met-hero-btns   { flex-direction: column !important; }
          .met-comp-head   { display: none !important; }
        }
        @media (max-width: 400px) {
          .met-hero-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(160deg,#f8fffe 0%,#f0fdf9 45%,#eef2ff 100%)',
        padding: 'clamp(96px,12vw,148px) 20px clamp(64px,9vw,108px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute',top:-140,right:-80,width:540,height:540,background:'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-80,left:-80,width:420,height:420,background:'radial-gradient(circle,rgba(99,102,241,0.07),transparent 65%)',pointerEvents:'none' }} />

        <div style={{ maxWidth:820,margin:'0 auto',textAlign:'center',position:'relative' }}>
          <Reveal>
            <div style={{ display:'inline-flex',alignItems:'center',gap:7,background:'rgba(46,196,182,0.09)',border:'1px solid rgba(46,196,182,0.22)',borderRadius:100,padding:'5px 14px',marginBottom:22 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#2EC4B6',animation:'met-pulse 2s infinite' }} />
              <span style={{ fontSize:11,fontWeight:700,color:'#0f766e',letterSpacing:'0.07em' }}>METODOLOGÍA SAMGPLE</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 style={{ fontSize:'clamp(34px,6vw,72px)',fontWeight:800,color:'#0f172a',letterSpacing:'-3px',margin:'0 0 20px',lineHeight:1.02 }}>
              No es un dashboard.<br />
              Es un <span className="met-grad-text">sistema de decisión.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ fontSize:'clamp(15px,1.8vw,18px)',color:'#475569',lineHeight:1.75,margin:'0 0 36px',maxWidth:540,marginLeft:'auto',marginRight:'auto' }}>
              SAMGPLE actúa entre el pedido y el envío. Evalúa el riesgo, puntúa con datos reales y te dice qué hacer. El control siempre es tuyo.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="met-hero-btns" style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:52 }}>
              <Link href="/registro" className="met-cta-btn"
                style={{ fontSize:14,fontWeight:700,padding:'13px 28px',borderRadius:13,background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)',color:'#fff',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 6px 20px rgba(46,196,182,0.3)' }}>
                Empezar gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d={icons.arrow}/></svg>
              </Link>
              <Link href="/precios" className="met-cta-ghost"
                style={{ fontSize:14,fontWeight:600,padding:'13px 24px',borderRadius:13,border:'1.5px solid #e2e8f0',background:'#fff',color:'#0f172a',textDecoration:'none' }}>
                Ver precios
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="met-hero-stats" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10 }}>
              {[
                { v:'4',    l:'Pasos clave',       c:'#2EC4B6' },
                { v:'15+',  l:'Señales de riesgo', c:'#6366f1' },
                { v:'−42%', l:'Devoluciones',      c:'#10b981' },
                { v:'< 5s', l:'Por análisis',      c:'#f59e0b' },
              ].map(s => (
                <div key={s.v} style={{ background:'#fff',border:'1.5px solid #f1f5f9',borderRadius:16,padding:'16px 8px',textAlign:'center',boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize:'clamp(20px,3vw,28px)',fontWeight:800,color:s.c,margin:'0 0 4px',letterSpacing:'-1px' }}>{s.v}</p>
                  <p style={{ fontSize:10,color:'#94a3b8',margin:0,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background:'#0f172a',padding:'11px 0',overflow:'hidden' }}>
        <div style={{ display:'flex',animation:'met-scroll 26s linear infinite',width:'max-content' }}>
          {[...ticker,...ticker].map((t,i) => (
            <span key={i} style={{ display:'inline-flex',alignItems:'center',gap:12,padding:'0 26px',fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.35)',letterSpacing:'0.07em',textTransform:'uppercase',whiteSpace:'nowrap' }}>
              <span style={{ width:4,height:4,borderRadius:'50%',background:'#2EC4B6',flexShrink:0 }} />{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── 4 PASOS ── */}
      <section style={{ padding:'clamp(64px,8vw,104px) 20px',background:'#f8fafc' }}>
        <div style={{ maxWidth:1060,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#2EC4B6',textTransform:'uppercase',letterSpacing:'0.08em' }}>El proceso</span>
              <h2 style={{ fontSize:'clamp(26px,4vw,50px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2.5px',margin:'10px 0 0',lineHeight:1.05 }}>
                4 pasos. 0 suposiciones.
              </h2>
            </div>
          </Reveal>

          <div className="met-steps-layout" style={{ display:'grid',gridTemplateColumns:'260px 1fr',gap:16,alignItems:'start' }}>

            {/* ── Pills sidebar ── */}
            <div className="met-step-pills" style={{ display:'flex',flexDirection:'column',gap:6 }}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  className="met-step-pill"
                  onClick={() => setActiveStep(i)}
                  style={{
                    display:'flex',alignItems:'center',gap:10,
                    padding:'11px 14px',borderRadius:16,
                    border:`1.5px solid ${activeStep===i ? s.color+'40' : '#e2e8f0'}`,
                    background: activeStep===i ? `${s.color}09` : '#fff',
                  }}
                >
                  <div style={{
                    width:34,height:34,borderRadius:11,flexShrink:0,
                    background: activeStep===i ? s.color : '#f8fafc',
                    border:`1.5px solid ${activeStep===i ? s.color : '#e2e8f0'}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    transition:'all 0.2s',
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeStep===i ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round">
                      <path d={s.icon}/>
                    </svg>
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <p style={{ fontSize:9,fontWeight:700,color:activeStep===i ? s.color : '#94a3b8',margin:'0 0 1px',letterSpacing:'0.06em',textTransform:'uppercase' }}>Paso {s.n}</p>
                    <p style={{ fontSize:12,fontWeight:600,color:activeStep===i ? '#0f172a' : '#64748b',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{s.label}</p>
                  </div>
                  {activeStep===i && (
                    <div style={{ width:6,height:6,borderRadius:'50%',background:s.color,flexShrink:0 }} />
                  )}
                </div>
              ))}

              {/* Flow SVG (desktop only) */}
              <div style={{ margin:'10px auto 0',opacity:0.35 }}>
                <svg width="24" height="80" viewBox="0 0 24 80" fill="none">
                  <line x1="12" y1="0" x2="12" y2="80" stroke="#2EC4B6" strokeWidth="1.5" strokeDasharray="4 4"/>
                </svg>
              </div>
            </div>

            {/* ── Step detail ── */}
            <div
              key={activeStep}
              className="met-step-detail"
              style={{
                background:'#fff',
                borderRadius:24,
                border:`2px solid ${active.border}`,
                padding:'clamp(22px,3vw,34px)',
                boxShadow:`0 16px 56px ${active.glow}`,
                minHeight:290,
                position:'relative',
                overflow:'hidden',
              }}
            >
              {/* Top bar */}
              <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${active.color},${active.color}50)` }} />

              {/* Glow orb */}
              <div style={{ position:'absolute',top:-60,right:-60,width:200,height:200,borderRadius:'50%',background:`radial-gradient(circle,${active.glow},transparent 70%)`,pointerEvents:'none' }} />

              {/* Header */}
              <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:22 }}>
                <div style={{
                  width:52,height:52,borderRadius:16,
                  background:active.bg,
                  border:`1.5px solid ${active.border}`,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  flexShrink:0,
                  animation:'met-float 4s ease-in-out infinite',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active.color} strokeWidth="2" strokeLinecap="round">
                    <path d={active.icon}/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize:10,fontWeight:700,color:active.color,margin:'0 0 3px',letterSpacing:'0.07em',textTransform:'uppercase' }}>
                    Paso {active.n} de {steps.length} · {active.sublabel}
                  </p>
                  <h3 style={{ fontSize:'clamp(18px,2.5vw,24px)',fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.5px' }}>
                    {active.label}
                  </h3>
                </div>

                {/* Stat badge */}
                <div style={{ marginLeft:'auto',textAlign:'center',flexShrink:0,background:'#f8fafc',border:'1.5px solid #f1f5f9',borderRadius:14,padding:'10px 14px' }}>
                  <p style={{ fontSize:'clamp(16px,2vw,22px)',fontWeight:800,color:active.color,letterSpacing:'-1px',margin:'0 0 2px' }}>{active.stat.v}</p>
                  <p style={{ fontSize:9,color:'#94a3b8',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',margin:0 }}>{active.stat.l}</p>
                </div>
              </div>

              {/* Body */}
              <p style={{ fontSize:14,color:'#475569',lineHeight:1.8,margin:'0 0 20px',maxWidth:580 }}>{active.body}</p>

              {/* Chips */}
              <div style={{ display:'flex',flexWrap:'wrap',gap:7,marginBottom:28 }}>
                {active.chips.map((chip, i) => (
                  <span key={i} style={{
                    fontSize:11,fontWeight:600,
                    color:active.color,
                    background:`${active.color}12`,
                    border:`1px solid ${active.border}`,
                    borderRadius:100,padding:'4px 12px',
                  }}>{chip}</span>
                ))}
              </div>

              {/* Progress dots */}
              <div style={{ display:'flex',gap:6,alignItems:'center' }}>
                {steps.map((_,i) => (
                  <div
                    key={i}
                    onClick={() => setActiveStep(i)}
                    style={{
                      flex: i===activeStep ? 2 : 1,
                      height:3,borderRadius:3,cursor:'pointer',
                      background: i===activeStep ? active.color : '#f1f5f9',
                      transition:'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Mobile step cards ── */}
          <div style={{ marginTop:16 }} className="met-mobile-steps">
            {steps.map((s, i) => (
              <div key={i} style={{
                display:'none', // shown via media query override below
                background:'#fff',borderRadius:20,border:`1.5px solid ${s.border}`,
                padding:'20px',marginBottom:12,
                boxShadow:`0 4px 20px ${s.glow}`,
              }}>
                <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
                  <div style={{ width:40,height:40,borderRadius:12,background:s.bg,border:`1.5px solid ${s.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"><path d={s.icon}/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize:9,fontWeight:700,color:s.color,margin:'0 0 2px',letterSpacing:'0.06em',textTransform:'uppercase' }}>Paso {s.n}</p>
                    <h3 style={{ fontSize:15,fontWeight:800,color:'#0f172a',margin:0,letterSpacing:'-0.3px' }}>{s.label}</h3>
                  </div>
                </div>
                <p style={{ fontSize:13,color:'#475569',lineHeight:1.7,margin:'0 0 14px' }}>{s.body}</p>
                <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                  {s.chips.map((c,ci) => (
                    <span key={ci} style={{ fontSize:11,fontWeight:600,color:s.color,background:`${s.color}12`,border:`1px solid ${s.border}`,borderRadius:100,padding:'3px 10px' }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEAM FLOW ── */}
      <section style={{ padding:'clamp(56px,7vw,88px) 20px',background:'#fff' }}>
        <div style={{ maxWidth:860,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:44 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#2EC4B6',textTransform:'uppercase',letterSpacing:'0.08em' }}>Flujo de datos</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,46px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 0',lineHeight:1.08 }}>
                Así fluye la información
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div style={{ position:'relative',padding:'32px 0',overflowX:'auto' }}>
              {/* Flow nodes */}
              <div style={{ display:'flex',alignItems:'center',gap:0,minWidth:520,justifyContent:'center',flexWrap:'nowrap' }}>
                {[
                  { label:'Shopify', sub:'Webhook', color:'#2EC4B6', icon:icons.zap },
                  { label:'SAMGPLE', sub:'Motor IA', color:'#6366f1', icon:icons.brain },
                  { label:'Operador', sub:'Decisión', color:'#10b981', icon:icons.check },
                  { label:'Supabase', sub:'Registro', color:'#f59e0b', icon:icons.database },
                  { label:'Cliente', sub:'Confirmación', color:'#ec4899', icon:icons.phone },
                ].map((node, i, arr) => (
                  <div key={i} style={{ display:'flex',alignItems:'center',gap:0 }}>
                    {/* Node */}
                    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:8,minWidth:80 }}>
                      <div style={{
                        width:52,height:52,borderRadius:'50%',
                        background:`${node.color}12`,
                        border:`2px solid ${node.color}30`,
                        display:'flex',alignItems:'center',justifyContent:'center',
                        boxShadow:`0 0 0 6px ${node.color}08`,
                        animation:'met-float 4s ease-in-out infinite',
                        animationDelay:`${i*0.4}s`,
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={node.color} strokeWidth="2" strokeLinecap="round">
                          <path d={node.icon}/>
                        </svg>
                      </div>
                      <div style={{ textAlign:'center' }}>
                        <p style={{ fontSize:11,fontWeight:800,color:'#0f172a',margin:0 }}>{node.label}</p>
                        <p style={{ fontSize:9,color:'#94a3b8',margin:0,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em' }}>{node.sub}</p>
                      </div>
                    </div>

                    {/* Connector beam */}
                    {i < arr.length - 1 && (
                      <div style={{ width:48,height:2,position:'relative',margin:'0 4px',marginBottom:24 }}>
                        <div style={{ width:'100%',height:'100%',background:`linear-gradient(90deg,${node.color},${arr[i+1].color})`,borderRadius:2,opacity:0.4 }} />
                        {/* Moving dot */}
                        <div style={{
                          position:'absolute',top:'50%',left:0,
                          width:8,height:8,borderRadius:'50%',
                          background:node.color,
                          transform:'translateY(-50%)',
                          animation:`met-scroll ${1.5+i*0.3}s linear infinite`,
                          boxShadow:`0 0 6px ${node.color}`,
                        }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BENTO GRID ── */}
      <section style={{ padding:'clamp(56px,7vw,88px) 20px',background:'#f8fafc' }}>
        <div style={{ maxWidth:960,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:44 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#6366f1',textTransform:'uppercase',letterSpacing:'0.08em' }}>Características</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,46px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 0',lineHeight:1.08 }}>
                Lo que hace diferente a SAMGPLE
              </h2>
            </div>
          </Reveal>

          <div className="met-bento-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14 }}>
            {bentoCards.map((card, i) => (
              <Reveal key={i} delay={i*0.06}>
                <div
                  className={`met-bento-card${card.span===2 ? ' met-bento-span' : ''}`}
                  style={{
                    gridColumn: card.span===2 ? 'span 2' : 'span 1',
                    background: card.bg.startsWith('linear') ? card.bg : card.bg,
                    border: `1.5px solid ${card.border}`,
                    borderRadius:24,
                    padding: card.span===2 ? '26px 28px' : '24px',
                    boxShadow:'0 2px 12px rgba(0,0,0,0.04)',
                    position:'relative',
                    overflow:'hidden',
                    display:'flex',
                    flexDirection: card.span===2 ? 'row' : 'column',
                    alignItems: card.span===2 ? 'center' : 'flex-start',
                    gap: card.span===2 ? 20 : 0,
                  }}
                >
                  <div style={{ position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:`${card.color}06`,pointerEvents:'none' }} />
                  <div style={{
                    width:44,height:44,borderRadius:14,
                    background:`${card.color}14`,
                    border:`1px solid ${card.border}`,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    flexShrink:0,
                    marginBottom: card.span===2 ? 0 : 16,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth="2" strokeLinecap="round">
                      <path d={card.icon}/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: card.span===2 ? 17 : 15, fontWeight:800,color:'#0f172a',marginBottom:7,letterSpacing:'-0.3px',lineHeight:1.3 }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize:13,color:'#64748b',lineHeight:1.65,margin:0 }}>{card.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORING ── */}
      <section style={{ padding:'clamp(56px,7vw,88px) 20px',background:'#fff' }}>
        <div style={{ maxWidth:820,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:40 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#f59e0b',textTransform:'uppercase',letterSpacing:'0.08em' }}>Scoring</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,46px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 0',lineHeight:1.08 }}>
                Cada punto tiene una causa.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.07}>
            <div className="met-score-bar" style={{ display:'flex',height:'auto',borderRadius:20,overflow:'hidden',border:'1.5px solid #f1f5f9',boxShadow:'0 4px 20px rgba(0,0,0,0.05)',marginBottom:18 }}>
              {scores.map((s, i) => (
                <div key={i} style={{
                  flex:1,background:s.bg,
                  display:'flex',flexDirection:'column',
                  alignItems:'center',justifyContent:'center',
                  gap:6,padding:'18px 8px',
                  borderRight: i < scores.length-1 ? `1px solid ${s.border}` : 'none',
                }}>
                  <span style={{ fontSize:'clamp(15px,2.5vw,22px)',fontWeight:800,color:s.color,letterSpacing:'-0.5px' }}>{s.range}</span>
                  <div style={{ display:'flex',flexWrap:'wrap',gap:4,justifyContent:'center' }}>
                    <span style={{ fontSize:9,fontWeight:700,color:s.color,background:'rgba(255,255,255,0.8)',border:`1px solid ${s.border}`,borderRadius:100,padding:'2px 7px' }}>{s.label}</span>
                    <span style={{ fontSize:9,color:s.color,opacity:0.7 }}>→ {s.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div style={{
              background:'linear-gradient(135deg,#eef2ff,#f0fdf9)',
              border:'1.5px solid #c7d2fe',
              borderRadius:18,padding:'20px 22px',
              display:'flex',alignItems:'flex-start',gap:14,flexWrap:'wrap',
            }}>
              <div style={{ width:40,height:40,borderRadius:12,background:'#fff',border:'1.5px solid #c7d2fe',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01"/>
                </svg>
              </div>
              <div style={{ flex:1,minWidth:200 }}>
                <p style={{ fontSize:13,fontWeight:700,color:'#3730a3',margin:'0 0 5px' }}>La IA no genera el score. Lo explica.</p>
                <p style={{ fontSize:12,color:'#4338ca',lineHeight:1.7,margin:0,opacity:0.85 }}>El score viene de datos reales y reglas definidas. La IA traduce ese número a lenguaje natural, señala qué lo causó y recomienda qué hacer.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:'clamp(56px,7vw,88px) 20px',background:'#f8fafc' }}>
        <div style={{ maxWidth:740,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:40 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#2EC4B6',textTransform:'uppercase',letterSpacing:'0.08em' }}>FAQ</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,42px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 0',lineHeight:1.08 }}>
                Lo que suelen preguntar
              </h2>
            </div>
          </Reveal>

          <div className="met-faq-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }}>
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i*0.07}>
                <div className="met-faq-card" style={{
                  background:'#fff',borderRadius:20,
                  padding:'clamp(18px,3vw,22px)',
                  border:'1.5px solid #f1f5f9',height:'100%',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <p style={{ fontSize:14,fontWeight:700,color:'#0f172a',margin:'0 0 8px',lineHeight:1.4 }}>{faq.q}</p>
                  <p style={{ fontSize:13,color:'#64748b',lineHeight:1.65,margin:0 }}>{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding:'clamp(64px,8vw,96px) 20px',background:'linear-gradient(135deg,#f0fdf9,#eef2ff)',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-80,right:-80,width:400,height:400,background:'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-60,left:-60,width:320,height:320,background:'radial-gradient(circle,rgba(99,102,241,0.07),transparent 65%)',pointerEvents:'none' }} />

        <Reveal>
          <div style={{ maxWidth:540,margin:'0 auto',position:'relative' }}>
            <div style={{ display:'inline-flex',alignItems:'center',gap:7,background:'rgba(46,196,182,0.1)',border:'1px solid rgba(46,196,182,0.22)',borderRadius:100,padding:'5px 14px',marginBottom:24 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#2EC4B6',animation:'met-pulse 2s infinite' }} />
              <span style={{ fontSize:11,fontWeight:700,color:'#0f766e',letterSpacing:'0.07em' }}>SIN TARJETA · SIN PERMANENCIA</span>
            </div>

            <h2 style={{ fontSize:'clamp(28px,4.5vw,52px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'0 0 16px',lineHeight:1.08 }}>
              Conecta tu tienda.<br />
              <span style={{ color:'#2EC4B6' }}>Empieza a ver el riesgo real.</span>
            </h2>

            <p style={{ fontSize:15,color:'#475569',margin:'0 0 32px',lineHeight:1.7 }}>
              En 10 minutos tienes Shopify conectado y los primeros pedidos analizados.
            </p>

            <div style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:16 }}>
              <Link href="/registro" className="met-cta-btn"
                style={{ fontSize:14,fontWeight:700,padding:'13px 28px',borderRadius:13,background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)',color:'#fff',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 6px 20px rgba(46,196,182,0.3)' }}>
                Empezar gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d={icons.arrow}/></svg>
              </Link>
              <Link href="/precios" className="met-cta-ghost"
                style={{ fontSize:14,fontWeight:600,padding:'13px 22px',borderRadius:13,border:'1.5px solid #e2e8f0',background:'#fff',color:'#0f172a',textDecoration:'none' }}>
                Ver precios
              </Link>
            </div>

            <p style={{ fontSize:12,color:'#94a3b8' }}>Tokens de bienvenida incluidos · Cancela cuando quieras</p>
          </div>
        </Reveal>
      </section>
    </>
  )
}