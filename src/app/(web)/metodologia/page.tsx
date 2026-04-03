'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function MetodologiaPage() {

  const [activeStep, setActiveStep] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('[data-observe]').forEach(el => {
      observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(p => (p + 1) % 7)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  const steps = [
    { n:'01', color:'#2EC4B6', label:'Shopify envía el pedido', icon:'M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z' },
    { n:'02', color:'#6366f1', label:'Motor analiza 15+ señales', icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10' },
    { n:'03', color:'#f59e0b', label:'Score de riesgo generado', icon:'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { n:'04', color:'#0ea5e9', label:'IA explica y recomienda', icon:'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { n:'05', color:'#10b981', label:'Operador decide en 1 clic', icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { n:'06', color:'#ec4899', label:'Llamada o WhatsApp', icon:'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { n:'07', color:'#8b5cf6', label:'Sistema aprende y mejora', icon:'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  ]

  const scores = [
    { range:'0–24',   label:'Bajo',     color:'#10b981', bg:'#f0fdf4', border:'#a7f3d0', action:'Proceder',  w:'20%'  },
    { range:'25–49',  label:'Medio',    color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', action:'Revisar',   w:'30%'  },
    { range:'50–74',  label:'Alto',     color:'#f97316', bg:'#fff7ed', border:'#fed7aa', action:'Validar',   w:'30%'  },
    { range:'75–100', label:'Muy alto', color:'#dc2626', bg:'#fef2f2', border:'#fecaca', action:'Bloquear',  w:'20%'  },
  ]

  const signals = [
    { cat:'Historial', items:['Pedidos anteriores','Tasa de entrega','Devoluciones'], color:'#6366f1', bg:'#eef2ff', border:'#c7d2fe' },
    { cat:'Dirección', items:['Completitud','Coherencia','Señales sospechosas'], color:'#2EC4B6', bg:'#f0fdf9', border:'#99f6e4' },
    { cat:'Zona', items:['Ratio de éxito','Dificultad logística','Historial geo'], color:'#f59e0b', bg:'#fffbeb', border:'#fde68a' },
    { cat:'Producto', items:['Ratio devolución','Compra impulsiva','Categoría riesgo'], color:'#ec4899', bg:'#fdf2f8', border:'#fbcfe8' },
    { cat:'Operativo', items:['Teléfono raro','Inconsistencias','Patrón extraño'], color:'#10b981', bg:'#f0fdf4', border:'#a7f3d0' },
  ]

  const comparison = [
    { label:'Riesgo visible',       shopify:'❌  Todos los pedidos parecen iguales', samgple:'✓  Score individual con causa trazable' },
    { label:'Historial cliente',    shopify:'❌  Solo ves el pedido actual',          samgple:'✓  Acumulado: entregas, incidencias, bajas' },
    { label:'Confirmación',         shopify:'❌  Manual y lenta',                      samgple:'✓  Llamada o WhatsApp automático' },
    { label:'Aprendizaje',          shopify:'❌  Cada pedido es nuevo',               samgple:'✓  Mejora con tu historial real' },
  ]

  const faqs = [
    { q:'¿Necesito instalar algo en Shopify?', a:'No. Solo conectas vía OAuth en 2 clics. Todo automático desde ese momento.' },
    { q:'¿El score es igual para todas las tiendas?', a:'No. Se ajusta con el tiempo a tu historial real de entregas y devoluciones.' },
    { q:'¿Qué pasa si el cliente no contesta?', a:'SAMGPLE reagenda automáticamente. Tú decides el número de intentos.' },
    { q:'¿La IA puede equivocarse?', a:'Sí. Por eso el control es siempre humano. Genera recomendaciones, no decisiones.' },
  ]

  const isVisible = (id: string) => visibleSections.has(id)

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing:border-box; }

        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn   { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes barFill   { from{width:0} to{width:var(--w)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes spin      { to{transform:rotate(360deg)} }

        .visible-up    { animation: fadeUp    .6s cubic-bezier(.22,1,.36,1) both; }
        .visible-left  { animation: fadeLeft  .6s cubic-bezier(.22,1,.36,1) both; }
        .visible-right { animation: fadeRight .6s cubic-bezier(.22,1,.36,1) both; }
        .visible-scale { animation: scaleIn   .5s cubic-bezier(.22,1,.36,1) both; }

        .delay-1 { animation-delay:.1s }
        .delay-2 { animation-delay:.2s }
        .delay-3 { animation-delay:.3s }
        .delay-4 { animation-delay:.4s }
        .delay-5 { animation-delay:.5s }

        .gradient-text {
          background:linear-gradient(135deg,#2EC4B6,#6366f1,#2EC4B6);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        .ticker-track { display:flex; animation:ticker 28s linear infinite; width:max-content; }
        .ticker-track:hover { animation-play-state:paused; }

        .step-pill {
          display:flex; align-items:center; gap:10px;
          padding:10px 16px; border-radius:14px;
          cursor:pointer;
          transition:all .2s ease;
          border:1.5px solid transparent;
        }
        .step-pill:hover { transform:translateX(3px); }

        .signal-card {
          background:#fff; border-radius:18px; padding:20px;
          transition:all .22s ease;
          will-change:transform;
        }
        .signal-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.08); }

        .faq-card {
          background:#f8fafc; border-radius:18px; padding:22px;
          border:1.5px solid #f1f5f9;
          transition:all .18s ease;
        }
        .faq-card:hover { background:#fff; box-shadow:0 6px 24px rgba(0,0,0,0.06); transform:translateY(-2px); }

        .cta-primary {
          font-size:15px; font-weight:700;
          padding:14px 32px; border-radius:14px;
          background:linear-gradient(135deg,#2EC4B6,#1A9E8F);
          color:#fff; text-decoration:none;
          display:inline-flex; align-items:center; gap:9px;
          box-shadow:0 8px 24px rgba(46,196,182,0.38);
          transition:all .18s cubic-bezier(.34,1.56,.64,1);
          font-family:'DM Sans',system-ui,sans-serif;
          letter-spacing:-.2px;
          will-change:transform;
        }
        .cta-primary:hover  { transform:translateY(-2px); box-shadow:0 14px 36px rgba(46,196,182,.5); }
        .cta-primary:active { transform:scale(.97); }

        .cta-secondary {
          font-size:15px; font-weight:600;
          padding:14px 28px; border-radius:14px;
          border:1.5px solid #e2e8f0; color:#0f172a;
          text-decoration:none; background:#fff;
          display:inline-flex; align-items:center; gap:7px;
          transition:all .15s ease;
          font-family:'DM Sans',system-ui,sans-serif;
        }
        .cta-secondary:hover { border-color:#cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,.06); }

        .float-card { animation:floatY 5s ease-in-out infinite; }

        @media(max-width:768px) {
          .hero-grid    { grid-template-columns:1fr !important; }
          .steps-layout { grid-template-columns:1fr !important; }
          .signals-grid { grid-template-columns:1fr 1fr !important; }
          .scores-bar   { flex-direction:column !important; gap:8px !important; }
          .score-seg    { width:100% !important; }
          .compare-cols { grid-template-columns:1fr !important; }
          .faq-grid     { grid-template-columns:1fr !important; }
          .hero-btns    { flex-direction:column !important; }
          .hero-btns a  { width:100%; justify-content:center; }
          .hero-stats   { grid-template-columns:repeat(2,1fr) !important; }
          .comp-header  { display:none !important; }
        }
        @media(max-width:480px) {
          .signals-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(150deg,#f8fffe 0%,#f0fdf9 45%,#eef2ff 100%)', padding:'clamp(90px,11vw,140px) 24px clamp(60px,8vw,100px)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-140, right:-100, width:560, height:560, background:'radial-gradient(circle,rgba(46,196,182,0.12),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-100, left:-100, width:460, height:460, background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div className="visible-up" style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.08)', border:'1px solid rgba(46,196,182,0.2)', borderRadius:20, padding:'5px 14px', marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#2EC4B6', display:'inline-block', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#0f766e', letterSpacing:'0.07em' }}>SISTEMA DE VALIDACIÓN COD</span>
          </div>

          <h1 className="visible-up delay-1" style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:800, color:'#0f172a', letterSpacing:'-3px', margin:'0 0 20px', lineHeight:1.02 }}>
            No es un dashboard.<br />
            Es un <span className="gradient-text">sistema de decisión.</span>
          </h1>

          <p className="visible-up delay-2" style={{ fontSize:'clamp(15px,1.9vw,19px)', color:'#475569', lineHeight:1.75, margin:'0 0 12px', maxWidth:600, marginLeft:'auto', marginRight:'auto' }}>
            SAMGPLE actúa entre el pedido y el envío. Evalúa el riesgo, puntúa con datos reales y te dice qué hacer. El control siempre es tuyo.
          </p>
          <p className="visible-up delay-2" style={{ fontSize:13, color:'#94a3b8', margin:'0 0 40px' }}>
            Datos reales · Reglas estructuradas · Inteligencia artificial
          </p>

          <div className="hero-btns visible-up delay-3" style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:56 }}>
            <Link href="/registro" className="cta-primary">
              Empezar gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" className="cta-secondary">Ver precios</Link>
          </div>

          <div className="hero-stats visible-up delay-4" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {[
              { v:'15+',    l:'Señales',      c:'#2EC4B6' },
              { v:'< 5s',   l:'Por pedido',   c:'#6366f1' },
              { v:'−42%',   l:'Devoluciones', c:'#10b981' },
              { v:'7',      l:'Pasos',        c:'#f59e0b' },
            ].map(s => (
              <div key={s.v} style={{ background:'#fff', border:'1.5px solid #f1f5f9', borderRadius:16, padding:'16px 8px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:s.c, margin:'0 0 4px', letterSpacing:'-1.2px' }}>{s.v}</p>
                <p style={{ fontSize:10, color:'#94a3b8', margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background:'#0f172a', padding:'11px 0', overflow:'hidden' }}>
        <div className="ticker-track">
          {[...Array(2)].map((_,ri) => (
            <div key={ri} style={{ display:'flex' }}>
              {['Webhook Shopify','Score 0–100','15+ señales','Vapi + Cartesia','WhatsApp automático','Aprendizaje continuo','IA explicable','Decisión humana'].map((t,i) => (
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:14, padding:'0 28px', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.45)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'#2EC4B6', flexShrink:0 }} />{t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── 7 PASOS — layout interactivo ── */}
      <section id="pasos" data-observe style={{ padding:'clamp(64px,8vw,100px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }} className={isVisible('pasos') ? 'visible-up' : ''}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em' }}>El proceso</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,48px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.8px', margin:'10px 0 0' }}>7 pasos. 0 suposiciones.</h2>
          </div>

          <div className="steps-layout" style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:24, alignItems:'start' }}>

            {/* Lista de pasos */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={`step-pill ${isVisible('pasos') ? 'visible-left' : ''}`}
                  style={{
                    animationDelay:`${i * 0.07}s`,
                    background: activeStep === i ? `${s.color}10` : '#f8fafc',
                    border: `1.5px solid ${activeStep === i ? s.color + '40' : '#f1f5f9'}`,
                  }}
                  onClick={() => setActiveStep(i)}
                >
                  <div style={{ width:34, height:34, borderRadius:10, background: activeStep === i ? s.color : '#fff', border:`1.5px solid ${activeStep === i ? s.color : '#e2e8f0'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeStep === i ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon}/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize:10, fontWeight:700, color: activeStep === i ? s.color : '#94a3b8', margin:'0 0 1px', letterSpacing:'0.05em', textTransform:'uppercase' }}>Paso {s.n}</p>
                    <p style={{ fontSize:13, fontWeight:600, color: activeStep === i ? '#0f172a' : '#64748b', margin:0, letterSpacing:'-0.2px' }}>{s.label}</p>
                  </div>
                  {activeStep === i && (
                    <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Panel detalle del paso activo */}
            <div key={activeStep} className="visible-scale" style={{ background:'#fff', borderRadius:24, border:`2px solid ${steps[activeStep].color}25`, padding:'32px', boxShadow:`0 20px 60px ${steps[activeStep].color}15`, minHeight:320, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle,${steps[activeStep].color}15,transparent 70%)`, pointerEvents:'none' }} />
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${steps[activeStep].color},${steps[activeStep].color}60)`, borderRadius:'24px 24px 0 0' }} />

              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
                <div style={{ width:52, height:52, borderRadius:16, background:`${steps[activeStep].color}15`, border:`2px solid ${steps[activeStep].color}30`, display:'flex', alignItems:'center', justifyContent:'center', animation:'floatY 4s ease-in-out infinite' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={steps[activeStep].color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={steps[activeStep].icon}/></svg>
                </div>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, color:steps[activeStep].color, margin:'0 0 3px', letterSpacing:'0.07em', textTransform:'uppercase' }}>Paso {steps[activeStep].n} de 7</p>
                  <h3 style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.8px' }}>{steps[activeStep].label}</h3>
                </div>
              </div>

              {/* Contenido por paso */}
              {activeStep === 0 && (
                <div>
                  <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, margin:'0 0 20px' }}>El momento en que un cliente hace un pedido COD en tu tienda Shopify, SAMGPLE lo recibe automáticamente vía webhook. Sin demora, sin intervención manual.</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {['Webhook instantáneo','Cliente registrado','Producto creado'].map((t,i) => (
                      <div key={i} style={{ background:'#f0fdf9', border:'1px solid #99f6e4', borderRadius:12, padding:'12px', textAlign:'center' }}>
                        <p style={{ fontSize:12, fontWeight:700, color:'#0f766e', margin:0 }}>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeStep === 1 && (
                <div>
                  <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, margin:'0 0 20px' }}>El motor evalúa más de 15 señales agrupadas en 5 categorías. Cada señal tiene un peso. El análisis completo se ejecuta en menos de 5 segundos.</p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {['Historial del cliente','Dirección','Zona logística','Tipo de producto','Señales operativas'].map((t,i) => (
                      <span key={i} style={{ fontSize:12, fontWeight:600, color:'#6366f1', background:'#eef2ff', border:'1px solid #c7d2fe', borderRadius:20, padding:'5px 12px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {activeStep === 2 && (
                <div>
                  <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, margin:'0 0 20px' }}>El resultado del análisis se convierte en un número entre 0 y 100. Cada punto tiene una causa real y trazable. No es estimación, es cálculo.</p>
                  <div style={{ display:'flex', gap:4, height:48, borderRadius:12, overflow:'hidden' }}>
                    {scores.map((s,i) => (
                      <div key={i} style={{ flex:1, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:2 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:s.color }}>{s.range}</span>
                        <span style={{ fontSize:9, color:s.color, opacity:0.7 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeStep === 3 && (
                <div>
                  <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, margin:'0 0 20px' }}>La IA no decide. Traduce el score y las señales a lenguaje natural. Genera una recomendación específica y, si es necesario, redacta el mensaje para el cliente.</p>
                  <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:14, padding:'14px 16px' }}>
                    <p style={{ fontSize:12, color:'#0369a1', margin:'0 0 6px', fontWeight:700 }}>Ejemplo de recomendación IA</p>
                    <p style={{ fontSize:12, color:'#0c4a6e', margin:0, fontStyle:'italic', lineHeight:1.6 }}>"Score 68. Dirección incompleta + 2 devoluciones previas. Recomendado: llamada de confirmación antes de enviar."</p>
                  </div>
                </div>
              )}
              {activeStep === 4 && (
                <div>
                  <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, margin:'0 0 20px' }}>El operador ve cada pedido en una tarjeta visual con el score, las señales y la recomendación. Decide en un clic: proceder, revisar, llamar o posponer.</p>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {['✓ Proceder','⏸ Posponer','📋 Revisar','📞 Llamar','✕ Cancelar'].map((t,i) => (
                      <span key={i} style={{ fontSize:12, fontWeight:600, color:'#374151', background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'6px 12px' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {activeStep === 5 && (
                <div>
                  <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, margin:'0 0 20px' }}>Aquí se evita la pérdida real. Antes de que salga el envío, el cliente recibe una llamada automática (Vapi + Cartesia) o un mensaje de WhatsApp personalizado.</p>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {['📞 Llamada Vapi','💬 WhatsApp','👁 Manual'].map((t,i) => (
                      <div key={i} style={{ background:'#fdf2f8', border:'1px solid #fbcfe8', borderRadius:12, padding:'12px', textAlign:'center' }}>
                        <p style={{ fontSize:12, fontWeight:700, color:'#be185d', margin:0 }}>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeStep === 6 && (
                <div>
                  <p style={{ fontSize:14, color:'#475569', lineHeight:1.75, margin:'0 0 20px' }}>Cada acción que realizas alimenta el sistema. Con el tiempo, el score se ajusta a los patrones reales de tu negocio: zonas, clientes, productos.</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {['Llamadas completadas → mejora detección','Cambios de estado → ajuste de pesos','Resultados de entrega → calibración de zona'].map((t,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:10, background:'#faf5ff', border:'1px solid #ddd6fe', borderRadius:12, padding:'10px 14px' }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:'#8b5cf6', flexShrink:0 }} />
                        <span style={{ fontSize:12, color:'#5b21b6', fontWeight:500 }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Barra de progreso */}
              <div style={{ position:'absolute', bottom:16, left:32, right:32, display:'flex', gap:4 }}>
                {steps.map((_,i) => (
                  <div key={i} onClick={() => setActiveStep(i)} style={{ flex:1, height:3, borderRadius:3, background: i <= activeStep ? steps[activeStep].color : '#f1f5f9', cursor:'pointer', transition:'background .3s', opacity: i === activeStep ? 1 : 0.4 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÑALES VISUALES ── */}
      <section id="signals" data-observe style={{ padding:'clamp(60px,8vw,96px) 24px', background:'#f8fafc' }}>
        <div style={{ maxWidth:1060, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }} className={isVisible('signals') ? 'visible-up' : ''}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em' }}>Motor de análisis</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,44px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'10px 0 0' }}>15+ señales. Ninguna es decorativa.</h2>
          </div>
          <div className="signals-grid" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {signals.map((s, i) => (
              <div key={i} className={`signal-card ${isVisible('signals') ? 'visible-up' : ''}`} style={{ border:`1.5px solid ${s.border}`, animationDelay:`${i * 0.1}s` }}>
                <div style={{ width:40, height:40, borderRadius:12, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <span style={{ width:12, height:12, borderRadius:'50%', background:s.color, display:'inline-block' }} />
                </div>
                <p style={{ fontSize:13, fontWeight:800, color:'#0f172a', margin:'0 0 12px', letterSpacing:'-0.3px' }}>{s.cat}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {s.items.map((item, ii) => (
                    <div key={ii} style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <div style={{ width:14, height:14, borderRadius:4, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize:11, color:'#64748b' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORE VISUAL BARRA ── */}
      <section id="score" data-observe style={{ padding:'clamp(60px,8vw,96px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }} className={isVisible('score') ? 'visible-up' : ''}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em' }}>Scoring</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,44px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'10px 0 0' }}>Cada punto tiene una causa.</h2>
          </div>

          {/* Barra visual del score */}
          <div className={isVisible('score') ? 'visible-up delay-1' : ''} style={{ marginBottom:28 }}>
            <div className="scores-bar" style={{ display:'flex', gap:0, height:80, borderRadius:20, overflow:'hidden', border:'1.5px solid #f1f5f9', boxShadow:'0 4px 20px rgba(0,0,0,0.05)' }}>
              {scores.map((s, i) => (
                <div key={i} className="score-seg" style={{ flex:1, background:s.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, borderRight: i < scores.length-1 ? `1px solid ${s.border}` : 'none', padding:'0 8px', cursor:'default', transition:'flex .3s ease' }}>
                  <span style={{ fontSize:'clamp(16px,2.5vw,22px)', fontWeight:800, color:s.color, letterSpacing:'-0.8px' }}>{s.range}</span>
                  <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                    <span style={{ fontSize:10, fontWeight:700, color:s.color, background:'rgba(255,255,255,0.8)', border:`1px solid ${s.border}`, borderRadius:20, padding:'2px 8px' }}>{s.label}</span>
                    <span style={{ fontSize:10, color:s.color, opacity:0.7 }}>→ {s.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nota IA */}
          <div className={isVisible('score') ? 'visible-up delay-2' : ''} style={{ background:'linear-gradient(135deg,#eef2ff,#f0fdf9)', border:'1.5px solid #c7d2fe', borderRadius:20, padding:'22px 26px', display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap' }}>
            <div style={{ width:42, height:42, borderRadius:12, background:'#fff', border:'1.5px solid #c7d2fe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            </div>
            <div style={{ flex:1, minWidth:200 }}>
              <p style={{ fontSize:13, fontWeight:700, color:'#3730a3', margin:'0 0 4px' }}>La IA no genera el score. Lo explica.</p>
              <p style={{ fontSize:12, color:'#4338ca', lineHeight:1.7, margin:0, opacity:0.85 }}>El score viene de datos reales y reglas definidas. La IA traduce ese número a lenguaje natural, señala qué lo causó y recomienda qué hacer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA DARK ── */}
      <section id="compare" data-observe style={{ background:'linear-gradient(150deg,#0f172a,#1e1b4b,#0f172a)', padding:'clamp(60px,8vw,96px) 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, right:-80, width:480, height:480, background:'radial-gradient(circle,rgba(99,102,241,0.12),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:860, margin:'0 auto', position:'relative' }}>
          <div style={{ textAlign:'center', marginBottom:48 }} className={isVisible('compare') ? 'visible-up' : ''}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em' }}>SAMGPLE vs Shopify</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,44px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', margin:'10px 0 14px', lineHeight:1.1 }}>
              Shopify ve pedidos.<br />
              <span style={{ color:'#2EC4B6' }}>SAMGPLE ve riesgo.</span>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', maxWidth:440, margin:'0 auto', lineHeight:1.7 }}>Shopify es para vender. No para validar si un pedido COD merece salir al reparto.</p>
          </div>

          <div className={isVisible('compare') ? 'visible-up delay-1' : ''} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:22, overflow:'hidden' }}>
            <div className="comp-header" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              {['Qué evalúa', 'Sin SAMGPLE', 'Con SAMGPLE'].map((h, i) => (
                <div key={i} style={{ padding:'12px 22px', background: i===1 ? 'rgba(239,68,68,0.05)' : i===2 ? 'rgba(46,196,182,0.05)' : 'transparent', borderLeft: i>0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <p style={{ fontSize:11, fontWeight:700, color: i===1 ? '#f87171' : i===2 ? '#2EC4B6' : 'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.07em', margin:0 }}>{h}</p>
                </div>
              ))}
            </div>
            {comparison.map((row, i) => (
              <div key={i} className="compare-cols" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom: i < comparison.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ padding:'14px 22px', display:'flex', alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.55)' }}>{row.label}</span>
                </div>
                <div style={{ padding:'14px 22px', background:'rgba(239,68,68,0.03)', display:'flex', alignItems:'center', borderLeft:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:12, color:'rgba(248,113,113,0.8)', lineHeight:1.5 }}>{row.shopify}</span>
                </div>
                <div style={{ padding:'14px 22px', background:'rgba(46,196,182,0.03)', display:'flex', alignItems:'center', borderLeft:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:12, fontWeight:600, color:'rgba(46,196,182,0.9)', lineHeight:1.5 }}>{row.samgple}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" data-observe style={{ padding:'clamp(60px,8vw,96px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:44 }} className={isVisible('faq') ? 'visible-up' : ''}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em' }}>FAQ</span>
            <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'10px 0 0' }}>Lo que suelen preguntar</h2>
          </div>
          <div className="faq-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-card ${isVisible('faq') ? 'visible-up' : ''}`} style={{ animationDelay:`${i*0.1}s` }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 8px', lineHeight:1.4 }}>{faq.q}</p>
                <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, margin:0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section id="cta" data-observe style={{ padding:'clamp(60px,8vw,96px) 24px', background:'linear-gradient(135deg,#f0fdf9,#eef2ff)', textAlign:'center' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }} className={isVisible('cta') ? 'visible-up' : ''}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.1)', border:'1px solid rgba(46,196,182,0.22)', borderRadius:20, padding:'5px 14px', marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#2EC4B6', animation:'pulse 2s infinite', display:'inline-block' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#0f766e', letterSpacing:'0.07em' }}>SIN TARJETA · SIN PERMANENCIA</span>
          </div>
          <h2 style={{ fontSize:'clamp(28px,4.5vw,50px)', fontWeight:800, color:'#0f172a', letterSpacing:'-2px', margin:'0 0 16px', lineHeight:1.1 }}>
            Conecta tu tienda.<br />
            <span style={{ color:'#2EC4B6' }}>Empieza a ver el riesgo real.</span>
          </h2>
          <p style={{ fontSize:15, color:'#475569', margin:'0 0 36px', lineHeight:1.7 }}>
            En 10 minutos tienes Shopify conectado y los primeros pedidos analizados.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/registro" className="cta-primary">
              Empezar gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" className="cta-secondary">Ver precios</Link>
          </div>
          <p style={{ fontSize:12, color:'#94a3b8', marginTop:20 }}>Tokens de bienvenida incluidos · Cancela cuando quieras</p>
        </div>
      </section>
    </div>
  )
}