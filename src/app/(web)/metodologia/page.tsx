'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

function useInView(threshold = 0.1) {
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

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    color: '#6366f1',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    title: 'Pedido entra desde Shopify',
    sublabel: 'Webhook instantáneo',
    body: 'En cuanto tu cliente hace un pedido COD, SAMGPLE lo recibe vía webhook y lo muestra en tu panel en segundos. Sin pasos manuales, sin integraciones complejas. Solo conectas y funciona.',
    chips: ['Webhook Shopify', 'Tiempo real', 'Sin código', 'OAuth 2 clics'],
    stat: { v: '< 5s', l: 'Para aparecer' },
  },
  {
    n: '02',
    color: '#8b5cf6',
    icon: 'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z',
    title: 'IA calcula el score de riesgo',
    sublabel: '15+ señales · Score 0–100',
    body: 'El motor analiza más de 15 señales en milisegundos: historial del cliente, zona geográfica, importe del pedido, tipo de producto, velocidad del checkout y más. El resultado es un score 0-100 claro, explicable y trazable.',
    chips: ['Historial cliente', 'Zona geográfica', 'Importe y producto', 'Score 0-100', 'Explicable'],
    stat: { v: '15+', l: 'Señales analizadas' },
  },
  {
    n: '03',
    color: '#06b6d4',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    title: 'El cliente solicita llamada',
    sublabel: 'Control del cliente',
    body: 'Desde su panel, el cliente puede solicitar una llamada cuando necesite confirmar o aclarar su pedido. Sin spam, sin llamadas automáticas. El cliente tiene el control de cuándo quiere ser contactado.',
    chips: ['Panel cliente', 'Solicitud manual', 'Sin spam', 'Notificación admin'],
    stat: { v: '0.5', l: 'tkn primera llamada' },
  },
  {
    n: '04',
    color: '#10b981',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    title: 'Operador llama y registra',
    sublabel: 'Control humano siempre',
    body: 'La solicitud llega al panel de admin en tiempo real. La asignas a un operador, este llama al cliente, registra el resultado con una nota y la IA lo convierte en un mensaje claro para el cliente. El estado del pedido se actualiza al instante.',
    chips: ['Panel admin', 'Asignación operador', 'Nota → GPT', 'Actualización real-time'],
    stat: { v: '1 clic', l: 'Para asignar' },
  },
]

const FEATURES = [
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Score explicable', body: 'No es una caja negra. Cada punto tiene una causa real y trazable. El operador ve exactamente qué señales dispararon el riesgo.', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Control humano siempre', body: 'La IA recomienda. El operador decide. Nunca se cancela un pedido de forma automática sin intervención humana.', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Shopify en 10 minutos', body: 'OAuth en 2 clics. Sin código. Sin agencias. Conectas tu tienda y los primeros pedidos empiezan a analizarse esa misma tarde.', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Aprendizaje continuo', body: 'Cada entrega y cada devolución calibra el modelo. Con el tiempo, SAMGPLE aprende los patrones de tu negocio y reduce los falsos positivos.', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8' },
  { icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', title: 'Alertas en tiempo real', body: 'Cuando llega una solicitud de llamada o se actualiza un pedido, el panel de admin se actualiza al instante sin necesidad de refrescar.', color: '#06b6d4', bg: '#ecfeff', border: '#a5f3fc' },
  { icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', title: 'Informe semanal gratis', body: 'Cada semana recibes un análisis IA de tu negocio directamente en tu email. Confirmaciones, devoluciones, recomendaciones. Sin coste extra.', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff' },
]

const SCORES = [
  { range: '0–24', label: 'Bajo riesgo', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', action: 'Proceder' },
  { range: '25–49', label: 'Riesgo medio', color: '#d97706', bg: '#fffbeb', border: '#fde68a', action: 'Revisar' },
  { range: '50–74', label: 'Alto riesgo', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', action: 'Validar' },
  { range: '75–100', label: 'Muy alto', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', action: 'Bloquear' },
]

const FAQS = [
  { q: '¿Necesito instalar algo en Shopify?', a: 'No. Solo conectas vía OAuth en 2 clics desde el panel de configuración. Todo automático desde ese momento.' },
  { q: '¿El score es igual para todas las tiendas?', a: 'No. Se ajusta con el tiempo a tu historial real de entregas y devoluciones. Cuanto más usas SAMGPLE, más preciso se vuelve.' },
  { q: '¿La IA puede equivocarse?', a: 'Sí. Por eso el control es siempre humano. SAMGPLE genera recomendaciones, no decisiones automáticas.' },
  { q: '¿El cliente ve el resultado de la llamada?', a: 'Sí, en tiempo real. En cuanto el operador registra el resultado, el estado del pedido se actualiza en el panel del cliente al instante.' },
  { q: '¿Cuántos operadores puedo tener?', a: 'Los que necesites. Desde el panel de admin puedes crear operadores, asignarles llamadas y ver el historial de cada uno.' },
  { q: '¿Qué pasa si el cliente no contesta?', a: 'El operador registra "no contesta" y el cliente puede solicitar una rellamada a mitad de precio (0.25 tkn).' },
]

const FLOW = [
  { label: 'Shopify', sub: 'Webhook', color: '#6366f1', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { label: 'SAMGPLE IA', sub: 'Análisis', color: '#8b5cf6', icon: 'M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14Z' },
  { label: 'Panel Admin', sub: 'Asignación', color: '#06b6d4', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { label: 'Operador', sub: 'Llamada', color: '#10b981', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
  { label: 'Cliente', sub: 'Confirmado', color: '#f59e0b', icon: 'M20 6L9 17l-5-5' },
]

export default function MetodologiaPage() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveStep(p => (p + 1) % STEPS.length), 3000)
    return () => clearInterval(t)
  }, [])

  const active = STEPS[activeStep]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #fff; color: #0f172a; overflow-x: hidden; }

        @keyframes sp-pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes sp-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes sp-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes sp-fadein { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes sp-dot    { 0%{left:0%;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{left:100%;opacity:0} }
        @keyframes sp-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes sp-step   { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }

        .sp-btn-primary { display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-size:15px;font-weight:700;text-decoration:none;border:none;cursor:pointer;font-family:inherit;box-shadow:0 4px 24px rgba(99,102,241,0.35);transition:transform 0.2s,box-shadow 0.2s;white-space:nowrap; }
        .sp-btn-primary:hover { transform:translateY(-2px);box-shadow:0 8px 32px rgba(99,102,241,0.45); }
        .sp-btn-ghost { display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border-radius:14px;background:transparent;color:#0f172a;font-size:15px;font-weight:600;text-decoration:none;border:1.5px solid #e2e8f0;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap; }
        .sp-btn-ghost:hover { background:#f8fafc;border-color:#cbd5e1;transform:translateY(-1px); }

        .sp-tag { display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#6366f1;padding:5px 12px;border-radius:100px;background:#eef2ff;border:1px solid #c7d2fe;margin-bottom:14px; }
        .sp-h2 { font-size:clamp(28px,4vw,52px);font-weight:900;line-height:1.05;letter-spacing:-2.5px;color:#0f172a; }
        .sp-sub { font-size:clamp(15px,1.8vw,17px);color:#64748b;line-height:1.75; }
        .sp-section { padding:clamp(72px,9vw,120px) clamp(20px,5vw,40px); }
        .sp-max { max-width:1100px;margin:0 auto; }
        .sp-max-sm { max-width:780px;margin:0 auto; }

        .sp-card { background:#fff;border:1.5px solid #f1f5f9;border-radius:24px;padding:28px;box-shadow:0 2px 16px rgba(0,0,0,0.04);transition:transform 0.2s,box-shadow 0.2s; }
        .sp-card:hover { transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08); }

        .sp-step-pill { transition:all 0.18s ease;cursor:pointer; }
        .sp-step-pill:hover { transform:translateX(3px); }
        .sp-step-detail { animation:sp-step 0.35s cubic-bezier(0.16,1,0.3,1); }

        .sp-ticker { overflow:hidden;background:#0f172a;padding:14px 0; }
        .sp-ticker-track { display:flex;animation:sp-scroll 30s linear infinite;width:max-content; }
        .sp-ticker-track span { display:inline-flex;align-items:center;gap:10px;padding:0 28px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap; }

        .sp-grad-text { background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sp-shimmer 4s linear infinite; }

        .sp-flow-dot { position:absolute;top:50%;width:10px;height:10px;border-radius:50%;transform:translateY(-50%);animation:sp-dot 2s ease-in-out infinite; }

        @media(max-width:900px) { .sp-steps-layout { grid-template-columns:1fr !important; } .sp-step-sidebar { display:none !important; } .sp-grid-3 { grid-template-columns:1fr 1fr !important; } }
        @media(max-width:640px) { .sp-grid-3 { grid-template-columns:1fr !important; } .sp-flow-nodes { gap:8px !important; } .sp-score-grid { grid-template-columns:1fr 1fr !important; } .sp-faq-grid { grid-template-columns:1fr !important; } .sp-ctas { flex-direction:column;align-items:stretch; } .sp-btn-primary,.sp-btn-ghost { justify-content:center; } }
      `}</style>

      {/* ── HERO ── */}
      <section className="sp-section" style={{ paddingTop:'clamp(120px,14vw,160px)', background:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)', backgroundSize:'48px 48px', WebkitMaskImage:'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)', maskImage:'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)' }} />
        <div style={{ position:'absolute', top:-200, left:'50%', transform:'translateX(-50%)', width:800, height:600, background:'radial-gradient(ellipse,rgba(99,102,241,.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div className="sp-max-sm" style={{ textAlign:'center', position:'relative' }}>
          <Reveal>
            <div className="sp-tag" style={{ animation:'sp-fadein 0.4s ease both' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#6366f1', animation:'sp-pulse 2s infinite' }} />
              Metodología
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 style={{ fontSize:'clamp(36px,6vw,68px)', fontWeight:900, letterSpacing:'-3px', lineHeight:1.02, marginBottom:20, color:'#0f172a' }}>
              No es un dashboard.<br />
              Es un <span className="sp-grad-text">sistema de decisión.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="sp-sub" style={{ marginBottom:36, maxWidth:520, margin:'0 auto 36px' }}>
              SAMGPLE actúa entre el pedido y el envío. Evalúa el riesgo con datos reales, gestiona el proceso de confirmación y te da control total sobre cada pedido COD.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="sp-ctas" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:56 }}>
              <Link href="/registro" className="sp-btn-primary">
                Empezar gratis
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" className="sp-btn-ghost">Ver precios</Link>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
              {[
                { v:'4', l:'Pasos clave', c:'#6366f1' },
                { v:'15+', l:'Señales IA', c:'#8b5cf6' },
                { v:'−42%', l:'Devoluciones', c:'#10b981' },
                { v:'< 5s', l:'Por análisis', c:'#f59e0b' },
              ].map((s,i) => (
                <div key={i} style={{ background:'#fff', border:'1.5px solid #f1f5f9', borderRadius:18, padding:'18px 10px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize:'clamp(20px,3vw,30px)', fontWeight:900, color:s.c, margin:'0 0 5px', letterSpacing:'-1.5px', lineHeight:1 }}>{s.v}</p>
                  <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', margin:0, textTransform:'uppercase', letterSpacing:'0.07em' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="sp-ticker">
        <div className="sp-ticker-track">
          {[...Array(2)].map((_,gi) =>
            ['Webhook Shopify','Score 0–100','15+ señales','Control humano','Tiempo real','Sin spam','Aprendizaje continuo','Score explicable','Panel operador'].map((t,i) => (
              <span key={`${gi}-${i}`}>
                <span style={{ width:4, height:4, borderRadius:'50%', background:'#6366f1', flexShrink:0 }} />
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── 4 PASOS ── */}
      <section className="sp-section" id="proceso" style={{ background:'#fafbff' }}>
        <div className="sp-max">
          <div style={{ textAlign:'center', marginBottom:'clamp(48px,6vw,72px)' }}>
            <Reveal>
              <div className="sp-tag">El proceso</div>
              <h2 className="sp-h2" style={{ marginBottom:14 }}>4 pasos. 0 suposiciones.</h2>
              <p className="sp-sub" style={{ maxWidth:480, margin:'0 auto' }}>Desde que llega el pedido hasta que el cliente lo ve confirmado, SAMGPLE gestiona cada paso con transparencia total.</p>
            </Reveal>
          </div>

          <div className="sp-steps-layout" style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:16, alignItems:'start' }}>
            {/* Sidebar pills */}
            <div className="sp-step-sidebar" style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {STEPS.map((s,i) => (
                <div key={i} className="sp-step-pill" onClick={() => setActiveStep(i)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:16, border:`1.5px solid ${activeStep===i ? s.color+'40' : '#e2e8f0'}`, background: activeStep===i ? `${s.color}08` : '#fff' }}>
                  <div style={{ width:36, height:36, borderRadius:11, flexShrink:0, background: activeStep===i ? s.color : '#f8fafc', border:`1.5px solid ${activeStep===i ? s.color : '#e2e8f0'}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={activeStep===i ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"><path d={s.icon}/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:9, fontWeight:700, color: activeStep===i ? s.color : '#94a3b8', margin:'0 0 2px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Paso {s.n}</p>
                    <p style={{ fontSize:12, fontWeight:600, color: activeStep===i ? '#0f172a' : '#64748b', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.title}</p>
                  </div>
                  {activeStep===i && <div style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0 }} />}
                </div>
              ))}
              <div style={{ margin:'8px auto 0', opacity:0.25 }}>
                <svg width="2" height="60" viewBox="0 0 2 60"><line x1="1" y1="0" x2="1" y2="60" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4"/></svg>
              </div>
            </div>

            {/* Step detail */}
            <div key={activeStep} className="sp-step-detail" style={{ background:'#fff', borderRadius:24, border:`2px solid ${active.color}30`, padding:'clamp(22px,3vw,36px)', boxShadow:`0 16px 56px ${active.color}12`, minHeight:300, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${active.color},${active.color}60)` }} />
              <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle,${active.color}10,transparent 70%)`, pointerEvents:'none' }} />

              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24, flexWrap:'wrap' }}>
                <div style={{ width:54, height:54, borderRadius:18, background:`${active.color}12`, border:`1.5px solid ${active.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, animation:'sp-float 4s ease-in-out infinite' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active.color} strokeWidth="2" strokeLinecap="round"><path d={active.icon}/></svg>
                </div>
                <div style={{ flex:1, minWidth:160 }}>
                  <p style={{ fontSize:10, fontWeight:700, color:active.color, margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.07em' }}>Paso {active.n} de {STEPS.length} · {active.sublabel}</p>
                  <h3 style={{ fontSize:'clamp(18px,2.5vw,26px)', fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.8px', lineHeight:1.2 }}>{active.title}</h3>
                </div>
                <div style={{ background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:16, padding:'12px 16px', textAlign:'center', flexShrink:0 }}>
                  <p style={{ fontSize:22, fontWeight:900, color:active.color, letterSpacing:'-1px', margin:'0 0 3px' }}>{active.stat.v}</p>
                  <p style={{ fontSize:9, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>{active.stat.l}</p>
                </div>
              </div>

              <p style={{ fontSize:15, color:'#475569', lineHeight:1.8, margin:'0 0 22px', maxWidth:560 }}>{active.body}</p>

              <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:28 }}>
                {active.chips.map((chip,i) => (
                  <span key={i} style={{ fontSize:11, fontWeight:600, color:active.color, background:`${active.color}10`, border:`1px solid ${active.color}30`, borderRadius:100, padding:'5px 13px' }}>{chip}</span>
                ))}
              </div>

              <div style={{ display:'flex', gap:6 }}>
                {STEPS.map((_,i) => (
                  <div key={i} onClick={() => setActiveStep(i)} style={{ flex: i===activeStep ? 2 : 1, height:3, borderRadius:3, cursor:'pointer', background: i===activeStep ? active.color : '#f1f5f9', transition:'all 0.3s ease' }} />
                ))}
              </div>
            </div>
          </div>

          {/* Mobile step cards */}
          <div style={{ marginTop:16 }}>
            {STEPS.map((s,i) => (
              <div key={i} className="sp-card" style={{ marginBottom:12, borderColor:`${s.color}20`, display:'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div style={{ width:42, height:42, borderRadius:13, background:`${s.color}12`, border:`1.5px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"><path d={s.icon}/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize:9, fontWeight:700, color:s.color, margin:'0 0 2px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Paso {s.n}</p>
                    <h3 style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:0 }}>{s.title}</h3>
                  </div>
                </div>
                <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, margin:'0 0 14px' }}>{s.body}</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {s.chips.map((c,ci) => <span key={ci} style={{ fontSize:11, fontWeight:600, color:s.color, background:`${s.color}10`, border:`1px solid ${s.color}30`, borderRadius:100, padding:'3px 10px' }}>{c}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLUJO DE DATOS ── */}
      <section className="sp-section" style={{ background:'#0f172a' }}>
        <div className="sp-max-sm">
          <div style={{ textAlign:'center', marginBottom:'clamp(40px,5vw,60px)' }}>
            <Reveal>
              <div className="sp-tag" style={{ background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', color:'#818cf8' }}>Flujo de datos</div>
              <h2 className="sp-h2" style={{ color:'#fff', marginBottom:14 }}>Así fluye la información</h2>
              <p className="sp-sub" style={{ color:'rgba(255,255,255,0.45)', maxWidth:440, margin:'0 auto' }}>Cada pedido recorre este camino de forma automática y transparente.</p>
            </Reveal>
          </div>
          <Reveal delay={0.08}>
            <div className="sp-flow-nodes" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'clamp(8px,3vw,24px)', flexWrap:'nowrap', overflowX:'auto', paddingBottom:8 }}>
              {FLOW.map((node,i,arr) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:0 }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, minWidth:'clamp(60px,8vw,90px)' }}>
                    <div style={{ width:'clamp(44px,6vw,56px)', height:'clamp(44px,6vw,56px)', borderRadius:'50%', background:`${node.color}15`, border:`2px solid ${node.color}40`, display:'flex', alignItems:'center', justifyContent:'center', animation:'sp-float 4s ease-in-out infinite', animationDelay:`${i*0.5}s`, boxShadow:`0 0 0 8px ${node.color}08` }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={node.color} strokeWidth="2" strokeLinecap="round"><path d={node.icon}/></svg>
                    </div>
                    <div style={{ textAlign:'center' }}>
                      <p style={{ fontSize:11, fontWeight:800, color:'#fff', margin:'0 0 2px' }}>{node.label}</p>
                      <p style={{ fontSize:9, color:'rgba(255,255,255,0.35)', margin:0, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em' }}>{node.sub}</p>
                    </div>
                  </div>
                  {i < arr.length-1 && (
                    <div style={{ width:'clamp(20px,4vw,40px)', height:2, position:'relative', margin:'0 4px', marginBottom:28, flexShrink:0 }}>
                      <div style={{ width:'100%', height:'100%', background:`linear-gradient(90deg,${node.color},${arr[i+1].color})`, opacity:0.3, borderRadius:2 }} />
                      <div className="sp-flow-dot" style={{ background:node.color, boxShadow:`0 0 6px ${node.color}`, animationDelay:`${i*0.4}s` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CARACTERÍSTICAS ── */}
      <section className="sp-section" style={{ background:'#fff' }}>
        <div className="sp-max">
          <div style={{ textAlign:'center', marginBottom:'clamp(48px,6vw,72px)' }}>
            <Reveal>
              <div className="sp-tag">Características</div>
              <h2 className="sp-h2" style={{ marginBottom:14 }}>Lo que hace diferente a SAMGPLE</h2>
              <p className="sp-sub" style={{ maxWidth:460, margin:'0 auto' }}>Cada decisión tiene una razón. Cada acción tiene un responsable.</p>
            </Reveal>
          </div>
          <div className="sp-grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {FEATURES.map((f,i) => (
              <Reveal key={i} delay={i*0.06}>
                <div className="sp-card">
                  <div style={{ width:48, height:48, borderRadius:16, background:f.bg, border:`1.5px solid ${f.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round"><path d={f.icon}/></svg>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', margin:'0 0 10px' }}>{f.title}</h3>
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, margin:0 }}>{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORING ── */}
      <section className="sp-section" style={{ background:'#fafbff' }}>
        <div className="sp-max-sm">
          <div style={{ textAlign:'center', marginBottom:'clamp(40px,5vw,60px)' }}>
            <Reveal>
              <div className="sp-tag">Sistema de scoring</div>
              <h2 className="sp-h2" style={{ marginBottom:14 }}>Cada punto tiene una causa.</h2>
              <p className="sp-sub" style={{ maxWidth:440, margin:'0 auto' }}>El score 0-100 no es una caja negra. Cada señal suma o resta puntos de forma explicable y trazable.</p>
            </Reveal>
          </div>
          <Reveal delay={0.07}>
            <div className="sp-score-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
              {SCORES.map((s,i) => (
                <div key={i} style={{ background:s.bg, border:`2px solid ${s.border}`, borderRadius:20, padding:'22px 14px', textAlign:'center' }}>
                  <p style={{ fontSize:'clamp(18px,2.5vw,26px)', fontWeight:900, color:s.color, margin:'0 0 6px', letterSpacing:'-1px' }}>{s.range}</p>
                  <p style={{ fontSize:11, fontWeight:700, color:s.color, margin:'0 0 8px' }}>{s.label}</p>
                  <span style={{ fontSize:10, fontWeight:700, color:s.color, background:'rgba(255,255,255,0.8)', border:`1px solid ${s.border}`, borderRadius:100, padding:'3px 10px' }}>→ {s.action}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div style={{ background:'linear-gradient(135deg,#eef2ff,#faf5ff)', border:'1.5px solid #c7d2fe', borderRadius:20, padding:'22px 24px', display:'flex', alignItems:'flex-start', gap:14 }}>
              <div style={{ width:42, height:42, borderRadius:13, background:'#fff', border:'1.5px solid #c7d2fe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'#3730a3', margin:'0 0 6px' }}>La IA no genera el score. Lo explica.</p>
                <p style={{ fontSize:13, color:'#4338ca', lineHeight:1.7, margin:0, opacity:0.85 }}>El score viene de datos reales y reglas definidas. La IA traduce ese número a lenguaje natural, señala qué lo causó y recomienda qué hacer al operador.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sp-section" style={{ background:'#fff' }}>
        <div className="sp-max-sm">
          <div style={{ textAlign:'center', marginBottom:'clamp(40px,5vw,60px)' }}>
            <Reveal>
              <div className="sp-tag">Preguntas frecuentes</div>
              <h2 className="sp-h2">Lo que suelen preguntar</h2>
            </Reveal>
          </div>
          <div className="sp-faq-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {FAQS.map((f,i) => (
              <Reveal key={i} delay={i*0.06}>
                <div className="sp-card" style={{ height:'100%' }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 10px', lineHeight:1.4 }}>{f.q}</p>
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, margin:0 }}>{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ background:'linear-gradient(135deg,#0c0a1e 0%,#1a1040 50%,#0c0a1e 100%)', position:'relative', overflow:'hidden', padding:'clamp(80px,10vw,120px) clamp(20px,5vw,40px)', textAlign:'center' }}>
        <div style={{ position:'absolute', top:-100, left:'50%', transform:'translateX(-50%)', width:700, height:500, background:'radial-gradient(ellipse,rgba(99,102,241,.15) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, right:'20%', width:400, height:300, background:'radial-gradient(ellipse,rgba(139,92,246,.1) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div className="sp-max-sm" style={{ position:'relative' }}>
          <Reveal>
            <div style={{ width:60, height:60, borderRadius:20, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px', boxShadow:'0 8px 32px rgba(99,102,241,0.4)', animation:'sp-float 3s ease-in-out infinite' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <p style={{ fontSize:13, fontWeight:700, color:'rgba(129,140,248,0.8)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:18 }}>Empieza hoy</p>
            <h2 style={{ fontSize:'clamp(30px,5vw,56px)', fontWeight:900, color:'#fff', letterSpacing:'-2.5px', lineHeight:1.03, marginBottom:20 }}>
              Conecta tu tienda.<br /><span style={{ color:'#818cf8' }}>Ve el riesgo real.</span>
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', marginBottom:36, lineHeight:1.75, maxWidth:440, margin:'0 auto 36px' }}>
              En 10 minutos tienes Shopify conectado y los primeros pedidos analizados. Sin tarjeta de crédito.
            </p>
            <div className="sp-ctas" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
              <Link href="/registro" className="sp-btn-primary" style={{ fontSize:16, padding:'16px 32px' }}>
                Crear cuenta gratis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/precios" className="sp-btn-ghost" style={{ fontSize:16, padding:'16px 28px', borderColor:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)' }}>
                Ver precios →
              </Link>
            </div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.2)' }}>Sin tarjeta · Tokens de prueba incluidos · Sin permanencia</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}