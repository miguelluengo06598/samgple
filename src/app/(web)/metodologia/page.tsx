import Link from 'next/link'

export default function MetodologiaPage() {

  const steps = [
    {
      n: '01', color: '#2EC4B6', bg: '#f0fdf9', border: '#99f6e4',
      icon: 'M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16',
      title: 'Entrada de pedidos',
      desc: 'Los pedidos llegan desde Shopify en tiempo real vía webhook. El sistema registra el pedido, crea el cliente, el producto y almacena toda la información estructurada.',
      detail: ['Registro automático sin intervención', 'Creación de cliente y producto', 'Webhook instantáneo desde Shopify'],
    },
    {
      n: '02', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'Análisis del pedido',
      desc: 'Cada pedido pasa por un motor de análisis que evalúa más de 15 señales: historial del cliente, dirección, zona logística, producto y señales operativas.',
      detail: ['Historial: entregas, incidencias, devoluciones', 'Dirección: coherencia y señales sospechosas', 'Zona, producto y comportamiento operativo'],
    },
    {
      n: '03', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
      icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      title: 'Score de riesgo',
      desc: 'El sistema genera un score de 0 a 100 basado en datos reales y reglas estructuradas. No es aleatorio. Cada punto tiene una causa trazable.',
      detail: ['0–24: riesgo bajo → proceder', '25–74: riesgo medio/alto → revisar', '75–100: riesgo muy alto → validar'],
    },
    {
      n: '04', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      title: 'Capa de inteligencia',
      desc: 'La IA no decide sola. Trabaja sobre los datos reales del pedido para explicar el riesgo, generar recomendaciones y redactar mensajes al cliente.',
      detail: ['Explica el riesgo en lenguaje natural', 'Genera recomendaciones accionables', 'Etiqueta señales y redacta mensajes'],
    },
    {
      n: '05', color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      title: 'Decisión operativa',
      desc: 'El operador ve cada pedido en tarjetas visuales. Puede posponer, revisar, contactar o cambiar el estado. SAMGPLE ayuda a decidir, no elimina el juicio humano.',
      detail: ['Interfaz visual por tarjetas', 'Acciones: posponer, revisar, llamar', 'Cambio de estado en un clic'],
    },
    {
      n: '06', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      title: 'Validación real',
      desc: 'El pedido se confirma vía WhatsApp, llamada o revisión manual. Esta es la etapa donde se evita la pérdida real antes de que salga el envío.',
      detail: ['Llamada automática vía Vapi + Cartesia', 'Mensaje WhatsApp personalizado', 'Revisión manual si el caso lo requiere'],
    },
    {
      n: '07', color: '#8b5cf6', bg: '#faf5ff', border: '#ddd6fe',
      icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      title: 'Aprendizaje continuo',
      desc: 'Cada acción (llamada, cambio de estado, resultado de entrega) alimenta el sistema. Con el tiempo, el análisis mejora con los datos reales de tu negocio.',
      detail: ['Retroalimentación de cada pedido', 'El score mejora con tu historial', 'Reglas ajustadas a tu operativa'],
    },
  ]

  const scores = [
    { range: '0 – 24', label: 'Bajo', color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0', desc: 'Señales positivas. Cliente con historial limpio, dirección verificada. Proceder con normalidad.', action: 'Proceder' },
    { range: '25 – 49', label: 'Medio', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', desc: 'Alguna señal ambigua. Revisar manualmente o validar por WhatsApp antes de enviar.', action: 'Revisar' },
    { range: '50 – 74', label: 'Alto', color: '#f97316', bg: '#fff7ed', border: '#fed7aa', desc: 'Varias señales de alerta. Llamada de confirmación recomendada antes de procesar el envío.', action: 'Validar' },
    { range: '75 – 100', label: 'Muy alto', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'Combinación de señales críticas. Alta probabilidad de devolución o rechazo. Acción inmediata.', action: 'Bloquear' },
  ]

  const signals = [
    { cat: 'Historial del cliente', items: ['Pedidos anteriores', 'Tasa de entrega real', 'Incidencias registradas', 'Devoluciones previas'], color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
    { cat: 'Dirección', items: ['Completitud del campo', 'Coherencia con la zona', 'Señales sospechosas', 'Historial de la dirección'], color: '#2EC4B6', bg: '#f0fdf9', border: '#99f6e4' },
    { cat: 'Zona logística', items: ['Comportamiento de entregas', 'Dificultad operativa', 'Ratio de éxito de la zona', 'Historial geográfico'], color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    { cat: 'Producto', items: ['Ratio de devolución', 'Si es compra impulsiva', 'Precio relativo', 'Categoría de riesgo'], color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8' },
    { cat: 'Señales operativas', items: ['Teléfono incoherente', 'Comportamiento extraño', 'Inconsistencias en datos', 'Patrón de pedido'], color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
  ]

  const comparison = [
    { label: 'Visibilidad del riesgo', shopify: 'No existe. Todos los pedidos parecen iguales.', samgple: 'Score de riesgo individual por pedido con causas trazables.' },
    { label: 'Historial del cliente', shopify: 'Solo ves el pedido actual, sin contexto anterior.', samgple: 'Historial acumulado: entregas, incidencias, devoluciones.' },
    { label: 'Análisis de dirección', shopify: 'Un campo de texto. Sin validación ni señales.', samgple: 'Coherencia, completitud y señales sospechosas analizadas.' },
    { label: 'Confirmación del pedido', shopify: 'Manual, lenta, dependiente del equipo.', samgple: 'Llamada o WhatsApp automático con voz personalizada.' },
    { label: 'Decisión informada', shopify: 'Intuición del operador o ninguna revisión.', samgple: 'Recomendación de la IA basada en 15+ señales reales.' },
    { label: 'Aprendizaje del sistema', shopify: 'Ninguno. Cada pedido es nuevo para Shopify.', samgple: 'Cada acción mejora el análisis de los siguientes pedidos.' },
  ]

  const faqs = [
    { q: '¿Necesito instalar algo en Shopify?', a: 'No. Conectas tu tienda vía OAuth en 2 clics desde el panel de SAMGPLE. Todo funciona automáticamente desde ese momento.' },
    { q: '¿El score es el mismo para todas las tiendas?', a: 'No. El sistema aprende con los datos de tu tienda. Con el tiempo, el score se ajusta a tu historial real de entregas y devoluciones.' },
    { q: '¿Qué pasa si el cliente no contesta?', a: 'SAMGPLE reagenda automáticamente según tu configuración. Puedes definir el número de intentos y el intervalo entre llamadas.' },
    { q: '¿La IA puede equivocarse?', a: 'Sí. Por eso no automatiza decisiones. Genera recomendaciones que el operador puede aceptar o ignorar. El control siempre es humano.' },
    { q: '¿Funciona con cualquier volumen de pedidos?', a: 'Sí. El sistema escala sin configuración adicional. Da igual si tienes 20 pedidos al día o 2.000.' },
    { q: '¿Puedo ver por qué un pedido tiene score alto?', a: 'Sí. Cada score incluye las señales que lo generaron, explicadas en lenguaje natural por la capa de IA.' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        * { box-sizing: border-box; }

        .met-section { animation: fadeUp 0.5s ease both; }

        .ticker-track { display:flex; gap:0; animation: ticker 30s linear infinite; width:max-content; }
        .ticker-track:hover { animation-play-state: paused; }

        .step-card {
          background:#fff;
          border-radius:20px;
          padding:28px 24px;
          border:1.5px solid #f1f5f9;
          transition: all 0.2s ease;
          position:relative;
          overflow:hidden;
        }
        .step-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }

        .score-card {
          border-radius:18px;
          padding:22px;
          transition:transform 0.2s ease;
        }
        .score-card:hover { transform:scale(1.02); }

        .signal-card {
          border-radius:16px;
          padding:20px;
          transition:all 0.2s ease;
        }
        .signal-card:hover {
          transform:translateY(-2px);
          box-shadow:0 8px 24px rgba(0,0,0,0.07);
        }

        .faq-card {
          background:#f8fafc;
          border-radius:18px;
          padding:22px;
          border:1.5px solid #f1f5f9;
          transition:all 0.15s ease;
        }
        .faq-card:hover { background:#fff; box-shadow:0 4px 20px rgba(0,0,0,0.05); }

        .cta-btn-primary {
          font-size:15px; font-weight:700;
          padding:14px 32px; border-radius:14px;
          background:linear-gradient(135deg,#2EC4B6,#1A9E8F);
          color:#fff; text-decoration:none;
          display:inline-flex; align-items:center; gap:9px;
          box-shadow:0 8px 24px rgba(46,196,182,0.35);
          transition:all 0.18s cubic-bezier(0.34,1.56,0.64,1);
          font-family:'DM Sans',system-ui,sans-serif;
          letter-spacing:-0.2px;
        }
        .cta-btn-primary:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(46,196,182,0.45); }
        .cta-btn-primary:active { transform:scale(0.97); }

        .cta-btn-secondary {
          font-size:15px; font-weight:600;
          padding:14px 28px; border-radius:14px;
          border:1.5px solid #e2e8f0; color:#0f172a;
          text-decoration:none; background:#fff;
          display:inline-flex; align-items:center; gap:7px;
          transition:all 0.15s ease;
          font-family:'DM Sans',system-ui,sans-serif;
        }
        .cta-btn-secondary:hover { border-color:#cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,0.06); }

        .gradient-text {
          background: linear-gradient(135deg,#2EC4B6,#6366f1,#2EC4B6);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }

        @media(max-width:900px) {
          .steps-grid { grid-template-columns:1fr 1fr !important; }
          .scores-grid { grid-template-columns:1fr 1fr !important; }
          .signals-grid { grid-template-columns:1fr 1fr !important; }
          .faq-grid { grid-template-columns:1fr !important; }
          .hero-stats { grid-template-columns:repeat(2,1fr) !important; }
          .compare-row { grid-template-columns:1fr !important; }
          .compare-row > div:first-child { border-bottom:1px solid #f1f5f9; }
        }

        @media(max-width:600px) {
          .steps-grid { grid-template-columns:1fr !important; }
          .scores-grid { grid-template-columns:1fr !important; }
          .signals-grid { grid-template-columns:1fr !important; }
          .hero-btns { flex-direction:column !important; }
          .hero-btns a { width:100%; justify-content:center; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(150deg,#f8fffe 0%,#f0fdf9 40%,#eef2ff 100%)', padding:'clamp(80px,10vw,130px) 24px clamp(60px,8vw,100px)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-120, right:-120, width:500, height:500, background:'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:400, height:400, background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.08)', border:'1px solid rgba(46,196,182,0.2)', borderRadius:20, padding:'5px 14px', marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#2EC4B6', display:'inline-block', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#0f766e', letterSpacing:'0.07em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>SISTEMA DE VALIDACIÓN COD</span>
          </div>

          <h1 style={{ fontSize:'clamp(34px,5.5vw,64px)', fontWeight:800, color:'#0f172a', letterSpacing:'-2.5px', margin:'0 0 20px', lineHeight:1.05, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            No es un dashboard.<br />
            Es un <span className="gradient-text">sistema de decisión.</span>
          </h1>

          <p style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'#475569', lineHeight:1.75, margin:'0 0 16px', maxWidth:580, marginLeft:'auto', marginRight:'auto', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            SAMGPLE actúa entre el momento en que llega un pedido y el momento en que sale el envío. Evalúa, puntúa y recomienda. El control sigue siendo tuyo.
          </p>
          <p style={{ fontSize:14, color:'#94a3b8', margin:'0 0 40px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            Sistema híbrido: datos reales + reglas estructuradas + inteligencia artificial
          </p>

          <div className="hero-btns" style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginBottom:60 }}>
            <Link href="/registro" className="cta-btn-primary">
              Empezar gratis
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" className="cta-btn-secondary">
              Ver precios
            </Link>
          </div>

          <div className="hero-stats" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {[
              { value:'15+', label:'Señales analizadas', color:'#2EC4B6' },
              { value:'< 5s', label:'Tiempo de análisis', color:'#6366f1' },
              { value:'−42%', label:'Tasa de devolución', color:'#10b981' },
              { value:'7 pasos', label:'Proceso completo', color:'#f59e0b' },
            ].map(s => (
              <div key={s.value} style={{ background:'#fff', border:'1.5px solid #f1f5f9', borderRadius:16, padding:'16px 10px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                <p style={{ fontSize:'clamp(20px,2.8vw,28px)', fontWeight:800, color:s.color, margin:'0 0 4px', letterSpacing:'-1px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.value}</p>
                <p style={{ fontSize:10, color:'#94a3b8', margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background:'#0f172a', padding:'12px 0', overflow:'hidden', borderTop:'1px solid #1e293b', borderBottom:'1px solid #1e293b' }}>
        <div className="ticker-track">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} style={{ display:'flex', gap:0 }}>
              {['Entrada automática Shopify','Score de riesgo 0–100','Análisis de 15+ señales','Llamada Vapi + Cartesia','Validación por WhatsApp','Aprendizaje continuo','Decisión asistida por IA','Historial del cliente'].map((t, i) => (
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:16, padding:'0 32px', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)', letterSpacing:'0.04em', textTransform:'uppercase', whiteSpace:'nowrap', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'#2EC4B6', display:'inline-block', flexShrink:0 }} />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── LOS 7 PASOS ── */}
      <section className="met-section" style={{ padding:'clamp(60px,8vw,100px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:1140, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>El proceso completo</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,46px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'12px 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>7 pasos de validación estructurada</h2>
            <p style={{ fontSize:15, color:'#64748b', maxWidth:520, margin:'0 auto', lineHeight:1.7, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Cada pedido COD pasa por este proceso. Ningún paso es opcional. Ninguno es aleatorio.</p>
          </div>

          <div className="steps-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
            {steps.map((step, i) => (
              <div key={i} className="step-card">
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:step.color, borderRadius:'20px 20px 0 0' }} />
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:step.bg, border:`1.5px solid ${step.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={step.icon}/></svg>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:step.color, letterSpacing:'0.06em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>PASO {step.n}</span>
                </div>
                <h3 style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-0.3px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.title}</h3>
                <p style={{ fontSize:12, color:'#64748b', lineHeight:1.65, margin:'0 0 16px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{step.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {step.detail.map((d, di) => (
                    <div key={di} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                      <div style={{ width:16, height:16, borderRadius:5, background:step.bg, border:`1px solid ${step.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize:11, color:'#475569', lineHeight:1.5, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Último paso ocupa 3 columnas */}
            <div className="step-card" style={{ gridColumn:'span 3' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#2EC4B6,#6366f1)', borderRadius:'20px 20px 0 0' }} />
              <div style={{ display:'flex', alignItems:'flex-start', gap:24, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#f0fdf9,#eef2ff)', border:'1.5px solid #c7d2fe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, color:'#6366f1', letterSpacing:'0.06em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>CÓMO MEJORA EL SISTEMA</span>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-0.3px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>El sistema aprende con cada acción que tomas</h3>
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Cada vez que cambias el estado de un pedido, registras una llamada o confirmas una entrega, esa información se acumula. Con el tiempo, el sistema conoce los patrones reales de tu negocio: qué zonas fallan más, qué productos se devuelven, qué tipo de cliente suele rechazar el pedido.</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, minWidth:180 }}>
                  {['Llamadas completadas', 'Cambios de estado', 'Resultados de entrega', 'Patrones por zona', 'Historial por cliente'].map((item, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:8, background:'#f8fafc', borderRadius:10, padding:'8px 12px', border:'1px solid #f1f5f9' }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'#2EC4B6', flexShrink:0 }} />
                      <span style={{ fontSize:12, color:'#374151', fontWeight:500, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEÑALES ANALIZADAS ── */}
      <section className="met-section" style={{ padding:'clamp(60px,8vw,100px) 24px', background:'#f8fafc' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Motor de análisis</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'12px 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>15+ señales. Ninguna es decorativa.</h2>
            <p style={{ fontSize:15, color:'#64748b', maxWidth:500, margin:'0 auto', lineHeight:1.7, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Cada señal tiene un peso en el score final. Aquí están las categorías que el motor evalúa en cada pedido.</p>
          </div>

          <div className="signals-grid" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
            {signals.map((s, i) => (
              <div key={i} className="signal-card" style={{ background:'#fff', border:`1.5px solid ${s.border}` }}>
                <div style={{ width:36, height:36, borderRadius:10, background:s.bg, border:`1px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:s.color, display:'inline-block' }} />
                </div>
                <p style={{ fontSize:12, fontWeight:800, color:'#0f172a', margin:'0 0 10px', letterSpacing:'-0.2px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.cat}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {s.items.map((item, ii) => (
                    <div key={ii} style={{ display:'flex', alignItems:'center', gap:7 }}>
                      <span style={{ width:4, height:4, borderRadius:'50%', background:s.color, flexShrink:0, opacity:0.7 }} />
                      <span style={{ fontSize:11, color:'#64748b', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORE ── */}
      <section className="met-section" style={{ padding:'clamp(60px,8vw,100px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Sistema de scoring</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'12px 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>El score tiene una causa. Siempre.</h2>
            <p style={{ fontSize:15, color:'#64748b', maxWidth:520, margin:'0 auto', lineHeight:1.7, fontFamily:"'DM Sans',system-ui,sans-serif" }}>No es un número aleatorio. Cada score es el resultado de combinar las señales analizadas con reglas estructuradas. Puedes ver qué lo generó.</p>
          </div>

          <div className="scores-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:32 }}>
            {scores.map((s, i) => (
              <div key={i} className="score-card" style={{ background:s.bg, border:`1.5px solid ${s.border}` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ fontSize:24, fontWeight:800, color:s.color, letterSpacing:'-1px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.range}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:s.color, background:'rgba(255,255,255,0.7)', border:`1px solid ${s.border}`, borderRadius:20, padding:'3px 10px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.label}</span>
                </div>
                <p style={{ fontSize:12, color:'#475569', lineHeight:1.6, margin:'0 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.desc}</p>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.8)', border:`1px solid ${s.border}`, borderRadius:20, padding:'4px 12px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  <span style={{ fontSize:11, fontWeight:700, color:s.color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Acción: {s.action}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Nota sobre la IA */}
          <div style={{ background:'#f8fafc', border:'1.5px solid #e2e8f0', borderRadius:20, padding:'24px 28px', display:'flex', alignItems:'flex-start', gap:20, flexWrap:'wrap' }}>
            <div style={{ width:44, height:44, borderRadius:13, background:'linear-gradient(135deg,#eef2ff,#f0fdf9)', border:'1.5px solid #c7d2fe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            </div>
            <div style={{ flex:1, minWidth:240 }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 6px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Sobre el papel de la IA en el scoring</p>
              <p style={{ fontSize:13, color:'#64748b', lineHeight:1.7, margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>La IA no genera el score. Lo que hace es <strong style={{ color:'#374151' }}>explicarlo</strong>: traduce los datos y señales en lenguaje natural, genera una recomendación y redacta el mensaje para el cliente si se necesita contactar. El score siempre viene de datos reales y reglas definidas, no de una predicción opaca.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── POR QUÉ NO ES SHOPIFY ── */}
      <section className="met-section" style={{ background:'linear-gradient(150deg,#0f172a,#1e1b4b,#0f172a)', padding:'clamp(60px,8vw,100px) 24px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, right:-100, width:500, height:500, background:'radial-gradient(circle,rgba(99,102,241,0.12),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:400, height:400, background:'radial-gradient(circle,rgba(46,196,182,0.08),transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1000, margin:'0 auto', position:'relative' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>SAMGPLE vs Shopify</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', margin:'12px 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.1 }}>
              Shopify ve pedidos.<br />
              <span style={{ color:'#2EC4B6' }}>SAMGPLE ve riesgo.</span>
            </h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', maxWidth:500, margin:'0 auto', lineHeight:1.7, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Shopify es una herramienta de venta. No está diseñada para validar si un pedido COD merece salir al reparto. Para eso existe SAMGPLE.</p>
          </div>

          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:24, overflow:'hidden' }}>
            {/* Header */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ padding:'14px 24px', background:'rgba(255,255,255,0.02)' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'0.07em', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Capacidad</p>
              </div>
              <div style={{ padding:'14px 24px', textAlign:'center', background:'rgba(239,68,68,0.06)', borderLeft:'1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#f87171', textTransform:'uppercase', letterSpacing:'0.07em', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Solo Shopify</p>
              </div>
              <div style={{ padding:'14px 24px', textAlign:'center', background:'rgba(46,196,182,0.06)', borderLeft:'1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.07em', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Con SAMGPLE</p>
              </div>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className="compare-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ padding:'14px 24px', display:'flex', alignItems:'center' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{row.label}</span>
                </div>
                <div style={{ padding:'14px 24px', background:'rgba(239,68,68,0.03)', display:'flex', alignItems:'center', justifyContent:'center', borderLeft:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:12, color:'rgba(248,113,113,0.8)', textAlign:'center', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{row.shopify}</span>
                </div>
                <div style={{ padding:'14px 24px', background:'rgba(46,196,182,0.03)', display:'flex', alignItems:'center', justifyContent:'center', borderLeft:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:12, fontWeight:600, color:'rgba(46,196,182,0.9)', textAlign:'center', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{row.samgple}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="met-section" style={{ padding:'clamp(60px,8vw,100px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Preguntas frecuentes</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'12px 0 0', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Lo que suelen preguntar</h2>
          </div>
          <div className="faq-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-card">
                <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 8px', lineHeight:1.4, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{faq.q}</p>
                <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="met-section" style={{ padding:'clamp(60px,8vw,100px) 24px', background:'linear-gradient(135deg,#f0fdf9,#eef2ff)', textAlign:'center' }}>
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.1)', border:'1px solid rgba(46,196,182,0.2)', borderRadius:20, padding:'5px 14px', marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#2EC4B6', animation:'pulse 2s infinite', display:'inline-block' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#0f766e', letterSpacing:'0.07em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>SIN PERMANENCIA · SIN TARJETA</span>
          </div>
          <h2 style={{ fontSize:'clamp(26px,4.5vw,48px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'0 0 16px', lineHeight:1.1, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            Conecta tu tienda.<br />
            <span style={{ color:'#2EC4B6' }}>Empieza a ver el riesgo real.</span>
          </h2>
          <p style={{ fontSize:15, color:'#475569', margin:'0 0 36px', lineHeight:1.7, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            En 10 minutos tienes Shopify conectado y los primeros pedidos analizados. Sin configuración compleja. Sin integración costosa.
          </p>
          <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/registro" className="cta-btn-primary">
              Empezar gratis
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" className="cta-btn-secondary">
              Ver precios
            </Link>
          </div>
          <p style={{ fontSize:12, color:'#94a3b8', marginTop:20, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Tokens de bienvenida incluidos · Cancela cuando quieras</p>
        </div>
      </section>
    </div>
  )
}