import Link from 'next/link'

export default function MetodologiaPage() {
  const F = 'system-ui,-apple-system,sans-serif'

  const steps = [
    {
      n: '01', color: '#5da7ec', bg: '#eff6ff', border: '#bfdbfe',
      icon: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18',
      title: 'Shopify envía el pedido',
      desc: 'En el momento que un cliente hace un pedido COD, Shopify lo envía automáticamente a SAMGPLE vía webhook. Aparece en tu panel en segundos.',
      detail: ['Webhook instantáneo sin configuración manual', 'Captura automática del cliente y producto', 'Compatible con cualquier tienda Shopify'],
    },
    {
      n: '02', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'IA analiza el riesgo',
      desc: 'Nuestro motor evalúa 15+ señales del pedido y el cliente para generar un score de riesgo de 0 a 100 en milisegundos.',
      detail: ['Historial de compras y devoluciones', 'Zona geográfica y dirección de entrega', 'Importe, producto y comportamiento previo'],
    },
    {
      n: '03', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0',
      icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
      title: 'VAPI llama al cliente',
      desc: 'Tu asistente IA llama al cliente con la voz y nombre de tu marca. Confirma el pedido, responde preguntas y registra el resultado.',
      detail: ['Voz y nombre personalizados con tu marca', 'Mensaje adaptado al producto y cliente', 'Detecta confirmación, rechazo o buzón'],
    },
    {
      n: '04', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Estado actualizado solo',
      desc: 'El pedido se actualiza automáticamente según el resultado. Confirmado, cancelado o reagendado. Tu panel refleja todo en tiempo real.',
      detail: ['Actualización instantánea del estado', 'Reagenda si no contesta (2h después)', 'Registro completo para auditoría'],
    },
  ]

  const faqs = [
    { q: '¿Necesito instalar algo en Shopify?', a: 'No. Solo conectas tu tienda vía OAuth en 2 clics desde el panel de SAMGPLE. Todo funciona automáticamente desde ese momento.' },
    { q: '¿Qué pasa si el cliente no contesta?', a: 'SAMGPLE reagenda la llamada automáticamente 2 horas después. Puedes configurar el número máximo de intentos desde tu panel.' },
    { q: '¿La IA habla en nombre de mi empresa?', a: 'Sí. Configuras el nombre de tu asistente, el nombre de tu empresa y el mensaje de bienvenida con variables como {nombre_cliente} y {producto}.' },
    { q: '¿Puedo ver la transcripción de cada llamada?', a: 'Sí. Cada llamada genera un resumen automático con IA y la transcripción completa disponible en el panel de pedidos.' },
    { q: '¿Cuánto tarda en confirmarse un pedido?', a: 'Menos de 5 minutos de media desde que llega el pedido hasta que tienes el resultado de la llamada y el estado actualizado.' },
    { q: '¿Funciona con cualquier número de pedidos?', a: 'Sí. El sistema escala automáticamente. Da igual si tienes 10 pedidos al día o 1.000, SAMGPLE los gestiona todos.' },
  ]

  const comparison = [
    { label: 'Tiempo por confirmación', before: '15-30 min por agente', after: 'Menos de 5 min automático' },
    { label: 'Tasa de devoluciones', before: '25-45% de media', after: 'Reducción del 42%' },
    { label: 'Coste por confirmación', before: '3-8€ (agente humano)', after: 'Desde 0.17 tokens' },
    { label: 'Disponibilidad', before: 'Horario laboral', after: '24/7 automático' },
    { label: 'Análisis de riesgo', before: 'Intuición del agente', after: 'IA con 15+ señales' },
    { label: 'Registro de llamadas', before: 'Manual o inexistente', after: 'Transcripción automática' },
  ]

  return (
    <div style={{ fontFamily: F }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .faq-item:hover{background:#f8fafc!important}
        .step-active{box-shadow:0 8px 32px rgba(0,0,0,0.1)!important}
        @media(max-width:768px){
          .stepper{flex-direction:column!important;gap:0!important}
          .step-connector{width:2px!important;height:40px!important;margin:0 auto!important}
          .steps-grid{grid-template-columns:1fr!important}
          .compare-grid{grid-template-columns:1fr!important}
          .faq-grid{grid-template-columns:1fr!important}
          .hero-stats{grid-template-columns:1fr 1fr!important}
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(140deg,#050d1f,#0c1e42,#071428)', padding: 'clamp(100px,12vw,140px) 24px clamp(60px,8vw,100px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle,rgba(93,167,236,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(93,167,236,0.1)', border: '1px solid rgba(93,167,236,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#5da7ec', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5da7ec', animation: 'pulse 2s infinite' }} />
            Proceso automatizado
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 800, color: '#fff', letterSpacing: '-2px', margin: '0 0 20px', lineHeight: 1.05 }}>
            De pedido recibido a<br /><span style={{ color: '#5da7ec' }}>entrega confirmada</span> en 5 min
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Un proceso de 4 pasos completamente automatizado que transforma cada pedido COD de riesgo en una entrega confirmada. Sin intervención humana, sin errores.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Link href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 20px rgba(93,167,236,0.35)' }}>
              Empezar gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" style={{ fontSize: 14, fontWeight: 600, padding: '13px 24px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Ver precios
            </Link>
          </div>

          {/* Hero stats */}
          <div className="hero-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { value: '-42%', label: 'Devoluciones', color: '#22c55e' },
              { value: '< 5min', label: 'Por pedido', color: '#5da7ec' },
              { value: '87%', label: 'Confirmación', color: '#a78bfa' },
              { value: '24/7', label: 'Automático', color: '#f59e0b' },
            ].map(s => (
              <div key={s.value} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: s.color, margin: '0 0 4px', letterSpacing: '-1px' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPPER ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cómo funciona</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 14px' }}>4 pasos, 0 intervención humana</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Desde que llega el pedido hasta que está confirmado, SAMGPLE lo hace todo solo.</p>
          </div>

          {/* Stepper horizontal */}
          <div className="stepper" style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 48, position: 'relative' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* Línea conectora */}
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', top: 24, left: '50%', width: '100%', height: 2, background: `linear-gradient(90deg,${step.color},${steps[i+1].color})`, zIndex: 0, opacity: 0.3 }} />
                )}
                {/* Círculo */}
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: step.bg, border: `2px solid ${step.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, marginBottom: 16, boxShadow: `0 4px 14px ${step.bg}` }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={step.icon}/></svg>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: step.color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Paso {step.n}</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', textAlign: 'center', margin: 0, padding: '0 8px' }}>{step.title}</p>
              </div>
            ))}
          </div>

          {/* Cards detalle */}
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 20, padding: '24px', border: `1.5px solid ${step.border}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: step.color }} />
                <div style={{ width: 38, height: 38, borderRadius: 11, background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={step.icon}/></svg>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, margin: '0 0 14px' }}>{step.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {step.detail.map((d, di) => (
                    <div key={di} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: step.bg, border: `1px solid ${step.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize: 11, color: '#475569', lineHeight: 1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Antes vs Después</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 14px' }}>La diferencia es brutal</h2>
            <p style={{ fontSize: 15, color: '#64748b', margin: '0 auto', maxWidth: 460, lineHeight: 1.7 }}>Compara tu proceso actual de confirmación COD con SAMGPLE.</p>
          </div>

          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f1f5f9', overflow: 'hidden' }}>
            {/* Header */}
            <div className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div style={{ padding: '14px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Métrica</p>
              </div>
              <div style={{ padding: '14px 24px', background: '#fef2f2', borderBottom: '1px solid #fecaca', textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>❌ Sin SAMGPLE</p>
              </div>
              <div style={{ padding: '14px 24px', background: '#f0fdf4', borderBottom: '1px solid #bbf7d0', textAlign: 'center' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>✓ Con SAMGPLE</p>
              </div>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className="compare-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < comparison.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{row.label}</span>
                </div>
                <div style={{ padding: '14px 24px', background: 'rgba(254,242,242,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, color: '#dc2626', textAlign: 'center' }}>{row.before}</span>
                </div>
                <div style={{ padding: '14px 24px', background: 'rgba(240,253,244,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0f766e', textAlign: 'center' }}>{row.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK SECTION — Por qué automatizar ── */}
      <section style={{ background: 'linear-gradient(140deg,#050d1f,#0c1e42)', padding: 'clamp(60px,8vw,100px) 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, background: 'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Por qué automatizar</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', margin: '12px 0 14px' }}>El coste oculto de no confirmar</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Cada pedido COD no confirmado es dinero que ya has gastado y no vas a recuperar.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14 }}>
            {[
              { icon: '📦', title: 'Coste de envío perdido', desc: 'Pagas el transporte de ida y vuelta aunque no se entregue. Entre 5€ y 15€ por devolución.' },
              { icon: '⏱️', title: 'Tiempo de tu equipo', desc: 'Cada gestión manual consume tiempo de agentes que podrían estar haciendo otra cosa.' },
              { icon: '📉', title: 'Stock inmovilizado', desc: 'Productos en tránsito que no puedes vender durante días, afectando tu flujo de caja.' },
              { icon: '😤', title: 'Fricción con el cliente', desc: 'Las devoluciones sin confirmar generan disputas y dañan la reputación de tu tienda.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '24px' }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FAQ</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Preguntas frecuentes</h2>
          </div>
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item" style={{ background: '#f8fafc', borderRadius: 18, padding: '22px', border: '1.5px solid #f1f5f9', transition: 'all 0.15s' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4 }}>{faq.q}</p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg,#5da7ec,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(93,167,236,0.3)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '0 0 16px', lineHeight: 1.1 }}>
            Empieza a confirmar pedidos hoy mismo
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', margin: '0 0 32px', lineHeight: 1.7 }}>
            Conecta tu tienda Shopify en 10 minutos. Tokens de bienvenida incluidos. Sin suscripción.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 16px rgba(93,167,236,0.3)' }}>
              Empezar gratis →
            </Link>
            <Link href="/precios" style={{ fontSize: 14, fontWeight: 600, padding: '13px 24px', borderRadius: 12, border: '1.5px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', background: '#fff' }}>
              Ver precios
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>Sin tarjeta de crédito · Cancela cuando quieras</p>
        </div>
      </section>
    </div>
  )
}