'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  )
}

export default function MetodologiaPage() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % 7), 2400)
    return () => clearInterval(t)
  }, [])

  const steps = [
    {
      n: '01', color: '#2EC4B6', label: 'Shopify envía el pedido',
      icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18',
      body: 'El momento en que un cliente hace un pedido COD, SAMGPLE lo recibe automáticamente vía webhook. Sin demora ni intervención manual.',
      chips: [{ t: 'Webhook instantáneo', c: '#2EC4B6', bg: '#f0fdf4', b: '#bbf7d0' }, { t: 'Cliente registrado', c: '#2EC4B6', bg: '#f0fdf4', b: '#bbf7d0' }, { t: 'Producto creado', c: '#2EC4B6', bg: '#f0fdf4', b: '#bbf7d0' }],
    },
    {
      n: '02', color: '#6366f1', label: 'Motor analiza 15+ señales',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10',
      body: 'El motor evalúa más de 15 señales agrupadas en 5 categorías. Cada señal tiene un peso. El análisis completo se ejecuta en menos de 5 segundos.',
      chips: [{ t: 'Historial cliente', c: '#6366f1', bg: '#eef2ff', b: '#c7d2fe' }, { t: 'Dirección', c: '#6366f1', bg: '#eef2ff', b: '#c7d2fe' }, { t: 'Zona logística', c: '#6366f1', bg: '#eef2ff', b: '#c7d2fe' }, { t: 'Producto', c: '#6366f1', bg: '#eef2ff', b: '#c7d2fe' }, { t: 'Señales operativas', c: '#6366f1', bg: '#eef2ff', b: '#c7d2fe' }],
    },
    {
      n: '03', color: '#f59e0b', label: 'Score de riesgo generado',
      icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
      body: 'El resultado del análisis se convierte en un número entre 0 y 100. Cada punto tiene una causa real y trazable. No es estimación, es cálculo.',
      chips: [{ t: '0–24 Bajo → Proceder', c: '#0f766e', bg: '#f0fdf4', b: '#bbf7d0' }, { t: '25–49 Medio → Revisar', c: '#d97706', bg: '#fffbeb', b: '#fde68a' }, { t: '50–74 Alto → Validar', c: '#ea580c', bg: '#fff7ed', b: '#fed7aa' }, { t: '75–100 Muy alto → Bloquear', c: '#dc2626', bg: '#fef2f2', b: '#fecaca' }],
    },
    {
      n: '04', color: '#0ea5e9', label: 'IA explica y recomienda',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      body: 'La IA no decide. Traduce el score a lenguaje natural. Genera una recomendación específica y, si es necesario, redacta el mensaje para el cliente.',
      quote: '"Score 68. Dirección incompleta + 2 devoluciones previas. Recomendado: llamada de confirmación antes de enviar."',
      chips: [],
    },
    {
      n: '05', color: '#10b981', label: 'Operador decide en 1 clic',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      body: 'El operador ve cada pedido en una tarjeta visual con el score, señales y recomendación. Decide en un clic sin ambigüedad.',
      chips: [{ t: '✓ Proceder', c: '#0f766e', bg: '#f0fdf4', b: '#bbf7d0' }, { t: '⏸ Posponer', c: '#64748b', bg: '#f8fafc', b: '#e2e8f0' }, { t: '📋 Revisar', c: '#0284c7', bg: '#f0f9ff', b: '#bae6fd' }, { t: '📞 Llamar', c: '#7c3aed', bg: '#faf5ff', b: '#e9d5ff' }, { t: '✕ Cancelar', c: '#dc2626', bg: '#fef2f2', b: '#fecaca' }],
    },
    {
      n: '06', color: '#ec4899', label: 'Llamada o WhatsApp',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      body: 'Antes de que salga el envío, el cliente recibe una llamada automática con tu voz de marca (Vapi + Cartesia) o un WhatsApp personalizado.',
      chips: [{ t: '📞 Llamada Vapi', c: '#be185d', bg: '#fdf2f8', b: '#fbcfe8' }, { t: '💬 WhatsApp IA', c: '#be185d', bg: '#fdf2f8', b: '#fbcfe8' }, { t: '👁 Revisión manual', c: '#be185d', bg: '#fdf2f8', b: '#fbcfe8' }],
    },
    {
      n: '07', color: '#8b5cf6', label: 'Sistema aprende y mejora',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      body: 'Cada acción alimenta el sistema. Con el tiempo, el score se ajusta a los patrones reales de tu negocio: zonas, clientes, productos.',
      chips: [{ t: 'Llamadas → mejora detección', c: '#7c3aed', bg: '#faf5ff', b: '#e9d5ff' }, { t: 'Resultados → calibración zona', c: '#7c3aed', bg: '#faf5ff', b: '#e9d5ff' }, { t: 'Devoluciones → ajuste pesos', c: '#7c3aed', bg: '#faf5ff', b: '#e9d5ff' }],
    },
  ]

  const signals = [
    { cat: 'Historial', items: ['Pedidos anteriores', 'Tasa de entrega', 'Devoluciones'], color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
    { cat: 'Dirección', items: ['Completitud', 'Coherencia', 'Señales sospechosas'], color: '#2EC4B6', bg: '#f0fdf4', border: '#bbf7d0' },
    { cat: 'Zona', items: ['Ratio de éxito', 'Dificultad logística', 'Historial geo'], color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    { cat: 'Producto', items: ['Ratio devolución', 'Compra impulsiva', 'Categoría riesgo'], color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8' },
    { cat: 'Operativo', items: ['Teléfono raro', 'Inconsistencias', 'Patrón extraño'], color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
  ]

  const scores = [
    { range: '0–24', label: 'Bajo', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', action: 'Proceder' },
    { range: '25–49', label: 'Medio', color: '#d97706', bg: '#fffbeb', border: '#fde68a', action: 'Revisar' },
    { range: '50–74', label: 'Alto', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', action: 'Validar' },
    { range: '75–100', label: 'Muy alto', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', action: 'Bloquear' },
  ]

  const comparison = [
    { label: 'Riesgo visible', bad: 'Todos los pedidos parecen iguales', good: 'Score individual con causa trazable' },
    { label: 'Historial cliente', bad: 'Solo ves el pedido actual', good: 'Acumulado: entregas, incidencias, bajas' },
    { label: 'Confirmación', bad: 'Manual y lenta', good: 'Llamada o WhatsApp automático' },
    { label: 'Aprendizaje', bad: 'Cada pedido es nuevo', good: 'Mejora con tu historial real' },
  ]

  const faqs = [
    { q: '¿Necesito instalar algo en Shopify?', a: 'No. Solo conectas vía OAuth en 2 clics. Todo automático desde ese momento.' },
    { q: '¿El score es igual para todas las tiendas?', a: 'No. Se ajusta con el tiempo a tu historial real de entregas y devoluciones.' },
    { q: '¿Qué pasa si el cliente no contesta?', a: 'SAMGPLE reagenda automáticamente. Tú decides el número de intentos máximos.' },
    { q: '¿La IA puede equivocarse?', a: 'Sí. Por eso el control es siempre humano. Genera recomendaciones, no decisiones.' },
  ]

  const ticker = ['Webhook Shopify', 'Score 0–100', '15+ señales', 'Vapi + Cartesia', 'WhatsApp automático', 'Aprendizaje continuo', 'IA explicable', 'Decisión humana']

  return (
    <div style={{ fontFamily: F, overflowX: 'hidden' }}>
      <style>{`
        * { box-sizing:border-box; }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
        .grad-text {
          background:linear-gradient(135deg,#2EC4B6,#6366f1,#2EC4B6);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .step-pill { transition:all 0.18s ease; cursor:pointer; }
        .step-pill:hover { transform:translateX(3px); }
        .signal-card { transition:all 0.18s ease; }
        .signal-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.08)!important; }
        .faq-card { transition:all 0.15s ease; }
        .faq-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.07)!important; background:#fff!important; }
        .cta-btn { transition:all 0.15s ease; }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(46,196,182,0.35)!important; }
        .cta-ghost { transition:all 0.15s ease; }
        .cta-ghost:hover { background:#f8fafc!important; }
        @media(max-width:900px) {
          .steps-layout { grid-template-columns:1fr!important; }
          .step-pills    { display:none!important; }
        }
        @media(max-width:768px) {
          .signals-grid  { grid-template-columns:1fr 1fr!important; }
          .compare-row   { grid-template-columns:1fr!important; }
          .faq-grid      { grid-template-columns:1fr!important; }
          .hero-stats    { grid-template-columns:repeat(2,1fr)!important; }
          .comp-head     { display:none!important; }
          .hero-btns     { flex-direction:column!important; }
        }
        @media(max-width:480px) {
          .signals-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(150deg,#f8fffe 0%,#f0fdf9 45%,#eef2ff 100%)', padding: 'clamp(90px,11vw,140px) 24px clamp(60px,8vw,100px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -120, right: -80, width: 520, height: 520, background: 'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 420, height: 420, background: 'radial-gradient(circle,rgba(99,102,241,0.07),transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(46,196,182,0.08)', border: '1px solid rgba(46,196,182,0.2)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2EC4B6', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', letterSpacing: '0.07em' }}>SISTEMA DE VALIDACIÓN COD</span>
            </div>
          </Reveal>

          <Reveal delay={0.07}>
            <h1 style={{ fontSize: 'clamp(34px,6vw,70px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-3px', margin: '0 0 20px', lineHeight: 1.02 }}>
              No es un dashboard.<br />
              Es un <span className="grad-text">sistema de decisión.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: '#475569', lineHeight: 1.75, margin: '0 0 8px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
              SAMGPLE actúa entre el pedido y el envío. Evalúa el riesgo, puntúa con datos reales y te dice qué hacer. El control siempre es tuyo.
            </p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 36px' }}>Datos reales · Reglas estructuradas · Inteligencia artificial</p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="hero-btns" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
              <Link href="/registro" className="cta-btn"
                style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 13, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 20px rgba(46,196,182,0.3)' }}>
                Empezar gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" className="cta-ghost"
                style={{ fontSize: 14, fontWeight: 600, padding: '13px 24px', borderRadius: 13, border: '1.5px solid #e2e8f0', background: '#fff', color: '#0f172a', textDecoration: 'none' }}>
                Ver precios
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {[
                { v: '15+', l: 'Señales', c: '#2EC4B6' },
                { v: '< 5s', l: 'Por pedido', c: '#6366f1' },
                { v: '−42%', l: 'Devoluciones', c: '#10b981' },
                { v: '7', l: 'Pasos', c: '#f59e0b' },
              ].map(s => (
                <div key={s.v} style={{ background: '#fff', border: '1.5px solid #f1f5f9', borderRadius: 16, padding: '16px 8px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: s.c, margin: '0 0 4px', letterSpacing: '-1px' }}>{s.v}</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: '#0f172a', padding: '11px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'scroll 26s linear infinite', width: 'max-content' }}>
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '0 26px', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.07em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2EC4B6', flexShrink: 0 }} />{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── 7 PASOS ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>El proceso</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,48px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-2px', margin: '10px 0 0' }}>7 pasos. 0 suposiciones.</h2>
            </div>
          </Reveal>

          <div className="steps-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

            {/* Pills */}
            <div className="step-pills" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {steps.map((s, i) => (
                <div key={i} className="step-pill" onClick={() => setActiveStep(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 14, border: `1.5px solid ${activeStep === i ? s.color + '40' : '#f1f5f9'}`, background: activeStep === i ? `${s.color}08` : '#fafafa' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: activeStep === i ? s.color : '#fff', border: `1.5px solid ${activeStep === i ? s.color : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={activeStep === i ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"><path d={s.icon}/></svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: activeStep === i ? s.color : '#94a3b8', margin: '0 0 1px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Paso {s.n}</p>
                    <p style={{ fontSize: 12, fontWeight: 600, color: activeStep === i ? '#0f172a' : '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</p>
                  </div>
                  {activeStep === i && <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color, flexShrink: 0 }} />}
                </div>
              ))}
            </div>

            {/* Detalle */}
            <div key={activeStep} style={{ background: '#fff', borderRadius: 22, border: `2px solid ${steps[activeStep].color}20`, padding: 'clamp(22px,3vw,32px)', boxShadow: `0 16px 48px ${steps[activeStep].color}12`, minHeight: 280, position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${steps[activeStep].color},${steps[activeStep].color}50)` }} />
              <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle,${steps[activeStep].color}12,transparent 70%)`, pointerEvents: 'none' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 50, height: 50, borderRadius: 15, background: `${steps[activeStep].color}12`, border: `1.5px solid ${steps[activeStep].color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'float 4s ease-in-out infinite' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={steps[activeStep].color} strokeWidth="2" strokeLinecap="round"><path d={steps[activeStep].icon}/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: steps[activeStep].color, margin: '0 0 3px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Paso {steps[activeStep].n} de 7</p>
                  <h3 style={{ fontSize: 'clamp(17px,2.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{steps[activeStep].label}</h3>
                </div>
              </div>

              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75, margin: '0 0 18px' }}>{steps[activeStep].body}</p>

              {steps[activeStep].quote && (
                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 13, padding: '14px 16px', marginBottom: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#0369a1', margin: '0 0 5px' }}>Ejemplo de recomendación IA</p>
                  <p style={{ fontSize: 13, color: '#0c4a6e', margin: 0, fontStyle: 'italic', lineHeight: 1.6 }}>{steps[activeStep].quote}</p>
                </div>
              )}

              {steps[activeStep].chips.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {steps[activeStep].chips.map((chip, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 600, color: chip.c, background: chip.bg, border: `1px solid ${chip.b}`, borderRadius: 20, padding: '4px 11px' }}>
                      {chip.t}
                    </span>
                  ))}
                </div>
              )}

              {/* Progreso */}
              <div style={{ position: 'absolute', bottom: 14, left: 20, right: 20, display: 'flex', gap: 4 }}>
                {steps.map((_, i) => (
                  <div key={i} onClick={() => setActiveStep(i)}
                    style={{ flex: 1, height: 3, borderRadius: 3, background: i <= activeStep ? steps[activeStep].color : '#f1f5f9', cursor: 'pointer', transition: 'background 0.3s', opacity: i === activeStep ? 1 : 0.35 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÑALES ── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Motor de análisis</span>
              <h2 style={{ fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '10px 0 0' }}>15+ señales. Ninguna es decorativa.</h2>
            </div>
          </Reveal>
          <div className="signals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
            {signals.map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="signal-card" style={{ background: '#fff', borderRadius: 18, padding: '20px', border: `1.5px solid ${s.border}`, height: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: s.color }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>{s.cat}</p>
                  {s.items.map((item, ii) => (
                    <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize: 11, color: '#64748b' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORING ── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Scoring</span>
              <h2 style={{ fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '10px 0 0' }}>Cada punto tiene una causa.</h2>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ display: 'flex', gap: 0, height: 'clamp(64px,10vw,88px)', borderRadius: 18, overflow: 'hidden', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: 20 }}>
              {scores.map((s, i) => (
                <div key={i} style={{ flex: 1, background: s.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRight: i < scores.length - 1 ? `1px solid ${s.border}` : 'none', padding: '0 6px' }}>
                  <span style={{ fontSize: 'clamp(14px,2.5vw,20px)', fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>{s.range}</span>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: s.color, background: 'rgba(255,255,255,0.7)', border: `1px solid ${s.border}`, borderRadius: 20, padding: '1px 7px' }}>{s.label}</span>
                    <span style={{ fontSize: 9, color: s.color, opacity: 0.7 }}>→ {s.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background: 'linear-gradient(135deg,#eef2ff,#f0fdf9)', border: '1.5px solid #c7d2fe', borderRadius: 18, padding: 'clamp(16px,3vw,22px)', display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', border: '1.5px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#3730a3', margin: '0 0 4px' }}>La IA no genera el score. Lo explica.</p>
                <p style={{ fontSize: 12, color: '#4338ca', lineHeight: 1.7, margin: 0, opacity: 0.85 }}>El score viene de datos reales y reglas definidas. La IA traduce ese número a lenguaje natural, señala qué lo causó y recomienda qué hacer.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── COMPARATIVA ── */}
      <section style={{ background: 'linear-gradient(150deg,#0f172a,#1e1b4b,#0f172a)', padding: 'clamp(60px,8vw,96px) 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -60, width: 420, height: 420, background: 'radial-gradient(circle,rgba(99,102,241,0.1),transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SAMGPLE vs Shopify</span>
              <h2 style={{ fontSize: 'clamp(24px,4vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '10px 0 12px', lineHeight: 1.1 }}>
                Shopify ve pedidos.<br />
                <span style={{ color: '#2EC4B6' }}>SAMGPLE ve riesgo.</span>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>Shopify es para vender. No para validar si un pedido COD merece salir al reparto.</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
              <div className="comp-head" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Qué evalúa', 'Sin SAMGPLE', 'Con SAMGPLE'].map((h, i) => (
                  <div key={i} style={{ padding: '11px 20px', background: i === 1 ? 'rgba(239,68,68,0.05)' : i === 2 ? 'rgba(46,196,182,0.05)' : 'transparent', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: i === 1 ? '#f87171' : i === 2 ? '#2EC4B6' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{h}</p>
                  </div>
                ))}
              </div>
              {comparison.map((row, i) => (
                <div key={i} className="compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ padding: '13px 20px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                  </div>
                  <div style={{ padding: '13px 20px', background: 'rgba(239,68,68,0.03)', borderLeft: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'rgba(248,113,113,0.8)', lineHeight: 1.5 }}>❌ {row.bad}</span>
                  </div>
                  <div style={{ padding: '13px 20px', background: 'rgba(46,196,182,0.03)', borderLeft: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(46,196,182,0.9)', lineHeight: 1.5 }}>✓ {row.good}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FAQ</span>
              <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '10px 0 0' }}>Lo que suelen preguntar</h2>
            </div>
          </Reveal>
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="faq-card" style={{ background: '#f8fafc', borderRadius: 18, padding: 'clamp(18px,3vw,22px)', border: '1.5px solid #f1f5f9', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4 }}>{faq.q}</p>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(60px,8vw,96px) 24px', background: 'linear-gradient(135deg,#f0fdf9,#eef2ff)', textAlign: 'center' }}>
        <Reveal>
          <div style={{ maxWidth: 540, margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(46,196,182,0.1)', border: '1px solid rgba(46,196,182,0.22)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2EC4B6', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', letterSpacing: '0.07em' }}>SIN TARJETA · SIN PERMANENCIA</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4.5vw,50px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-2px', margin: '0 0 16px', lineHeight: 1.1 }}>
              Conecta tu tienda.<br />
              <span style={{ color: '#2EC4B6' }}>Empieza a ver el riesgo real.</span>
            </h2>
            <p style={{ fontSize: 15, color: '#475569', margin: '0 0 32px', lineHeight: 1.7 }}>
              En 10 minutos tienes Shopify conectado y los primeros pedidos analizados.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
              <Link href="/registro" className="cta-btn"
                style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 13, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 20px rgba(46,196,182,0.3)' }}>
                Empezar gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" className="cta-ghost"
                style={{ fontSize: 14, fontWeight: 600, padding: '13px 22px', borderRadius: 13, border: '1.5px solid #e2e8f0', background: '#fff', color: '#0f172a', textDecoration: 'none' }}>
                Ver precios
              </Link>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Tokens de bienvenida incluidos · Cancela cuando quieras</p>
          </div>
        </Reveal>
      </section>
    </div>
  )
}