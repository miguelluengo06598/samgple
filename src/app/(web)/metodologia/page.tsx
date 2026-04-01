import Link from 'next/link'

export default function MetodologiaPage() {
  const F = 'system-ui,-apple-system,sans-serif'

  const steps = [
    {
      n: '01', color: '#5da7ec', bg: '#eff6ff', border: '#bfdbfe',
      title: 'Pedido recibido vía Shopify',
      desc: 'En el momento que un cliente realiza un pedido COD en tu tienda, Shopify envía un webhook a SAMGPLE. El pedido aparece en tu panel en tiempo real, sin ninguna acción manual.',
      detail: ['Sincronización instantánea vía webhook', 'Captura automática de datos del cliente', 'Sin configuración manual de pedidos'],
    },
    {
      n: '02', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff',
      title: 'Análisis de riesgo con IA',
      desc: 'Nuestro motor de IA evalúa 15+ señales para generar un score de riesgo de 0 a 100. Cuanto más bajo, más fiable es el pedido.',
      detail: ['Historial de compras y devoluciones del cliente', 'Zona geográfica y dirección de entrega', 'Importe, producto y hora del pedido', 'Comportamiento en pedidos anteriores'],
    },
    {
      n: '03', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0',
      title: 'Llamada automática al cliente',
      desc: 'Tu asistente IA llama al cliente con tu nombre de empresa y voz personalizada. Confirma el pedido, responde preguntas básicas y registra el resultado.',
      detail: ['Voz personalizada con tu marca', 'Mensaje adaptado al producto y cliente', 'Detección de confirmación, rechazo o buzón', 'Resumen automático de la llamada con IA'],
    },
    {
      n: '04', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa',
      title: 'Decisión y actualización automática',
      desc: 'Según el resultado de la llamada, el pedido se actualiza automáticamente. Confirmado, cancelado, reagendado o marcado para revisión manual.',
      detail: ['Actualización del estado en tiempo real', 'Notificación al equipo si hay incidencia', 'Reagenda llamada si no contesta (2h después)', 'Registro completo para auditoría'],
    },
  ]

  return (
    <div style={{ fontFamily: F }}>
      <style>{`.step-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08) !important; }`}</style>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px,10vw,120px) 24px', background: 'linear-gradient(180deg,#f0f7ff,#fff)', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Metodología</span>
          <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '12px 0 20px', lineHeight: 1.1 }}>
            Cómo SAMGPLE confirma tus pedidos COD
          </h1>
          <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7, margin: '0 0 32px' }}>
            Un proceso automatizado de 4 pasos que transforma pedidos de riesgo en entregas confirmadas.
          </p>
          <Link href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none' }}>
            Probarlo gratis →
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {steps.map((step, i) => (
            <div key={i} className="step-card" style={{ background: '#fff', borderRadius: 24, padding: 'clamp(24px,4vw,36px)', border: `1.5px solid ${step.border}`, transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: step.color, borderRadius: '24px 24px 0 0' }} />
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: step.bg, border: `1.5px solid ${step.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: step.color }}>{step.n}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 16px' }}>{step.desc}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {step.detail.map((d, di) => (
                      <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 16, height: 16, borderRadius: '50%', background: step.bg, border: `1px solid ${step.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={step.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span style={{ fontSize: 13, color: '#475569' }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '0 0 16px' }}>¿Listo para automatizar tus confirmaciones?</h2>
          <p style={{ fontSize: 15, color: '#64748b', margin: '0 0 28px', lineHeight: 1.7 }}>Conecta tu tienda en 10 minutos y empieza a confirmar pedidos hoy mismo.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none' }}>Empezar gratis →</Link>
            <Link href="/precios" style={{ fontSize: 14, fontWeight: 600, padding: '13px 24px', borderRadius: 12, border: '1.5px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', background: '#fff' }}>Ver precios</Link>
          </div>
        </div>
      </section>
    </div>
  )
}