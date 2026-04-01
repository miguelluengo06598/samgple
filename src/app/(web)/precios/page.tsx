import Link from 'next/link'

export default function PreciosPage() {
  const F = 'system-ui,-apple-system,sans-serif'

  const plans = [
    {
      name: 'Starter', price: 15, tokens: 15, perToken: '1.00',
      featured: false, color: '#5da7ec',
      features: ['15 tokens incluidos', 'Análisis IA por pedido (0.17 tkn)', 'Llamadas VAPI automáticas', 'Mensajes WhatsApp IA', 'Dashboard en tiempo real', 'Soporte por chat'],
    },
    {
      name: 'Pro', price: 45, tokens: 50, perToken: '0.90',
      featured: true, color: '#0f172a',
      features: ['50 tokens incluidos', 'Todo lo de Starter', 'Informes semanales IA (0.5 tkn)', 'Consultor de rentabilidad', 'Análisis avanzado de riesgo', 'Soporte prioritario'],
    },
    {
      name: 'Business', price: 100, tokens: 110, perToken: '0.91',
      featured: false, color: '#5da7ec',
      features: ['110 tokens incluidos', 'Todo lo de Pro', 'Múltiples tiendas Shopify', 'API access', 'Onboarding personalizado', 'Account manager dedicado'],
    },
  ]

  const tokenCosts = [
    { action: 'Análisis IA de pedido', cost: '0.17 tkn', desc: 'Una vez por pedido al llegar' },
    { action: 'Llamada exitosa (por minuto)', cost: '0.22 tkn', desc: 'Proporcional a la duración' },
    { action: 'Llamada fallida / no contesta', cost: '0.05 tkn', desc: 'Coste mínimo por intento' },
    { action: 'Mensaje WhatsApp IA', cost: '0.004 tkn', desc: 'Generado y enviado por IA' },
    { action: 'Informe semanal IA', cost: '0.5 tkn', desc: 'Enviado a tu email' },
    { action: 'Reanálisis manual', cost: '0.01 tkn', desc: 'Si quieres actualizar el score' },
  ]

  const faqs = [
    { q: '¿Los tokens caducan?', a: 'No. Tus tokens no tienen fecha de caducidad. Puedes comprarlos ahora y usarlos cuando quieras.' },
    { q: '¿Cuántos pedidos puedo gestionar con 50 tokens?', a: 'Depende del número de llamadas. Con 50 tokens puedes analizar ~294 pedidos o realizar ~227 llamadas de 1 minuto. La mayoría de tiendas obtiene >200 confirmaciones.' },
    { q: '¿Puedo comprar más tokens en cualquier momento?', a: 'Sí. Puedes recargar tokens en cualquier momento desde el panel. También puedes usar cupones de descuento.' },
    { q: '¿Qué pasa si me quedo sin tokens?', a: 'El sistema te avisará cuando tu saldo sea bajo. Las llamadas en curso se completan, pero no se inician nuevas hasta que recargues.' },
    { q: '¿Necesito una cuenta de Twilio o VAPI?', a: 'Sí. Necesitas crear cuentas gratuitas en VAPI y Twilio (solo pagas los tokens de SAMGPLE, no los costes de VAPI directamente). Te guiamos en el proceso.' },
  ]

  return (
    <div style={{ fontFamily: F }}>
      <style>{`
        .plan-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.1) !important; }
        .faq-item:hover { background: #f8fafc !important; }
      `}</style>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px,10vw,100px) 24px', background: 'linear-gradient(180deg,#f0f7ff,#fff)', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Precios</span>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '12px 0 16px', lineHeight: 1.1 }}>Paga solo por lo que usas</h1>
          <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.7, margin: 0 }}>Sistema de tokens sin suscripción mensual. Sin sorpresas. Sin compromiso.</p>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, alignItems: 'start' }}>
            {plans.map((plan, i) => (
              <div key={i} className="plan-card" style={{ borderRadius: 24, padding: '32px 28px', border: plan.featured ? 'none' : '1.5px solid #e2e8f0', background: plan.featured ? '#0f172a' : '#fff', transition: 'all 0.2s', position: 'relative', marginTop: plan.featured ? -8 : 0 }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#5da7ec', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 16px', borderRadius: 20, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Más popular
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: plan.featured ? 'rgba(255,255,255,0.4)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{ fontSize: 52, fontWeight: 800, color: plan.featured ? '#fff' : '#0f172a', letterSpacing: '-2px', lineHeight: 1 }}>{plan.price}€</span>
                  </div>
                  <p style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.4)' : '#94a3b8', margin: '0 0 4px' }}>{plan.tokens} tokens · {plan.perToken}€/token</p>
                  <p style={{ fontSize: 12, color: plan.featured ? 'rgba(255,255,255,0.3)' : '#cbd5e1', margin: 0 }}>Sin caducidad · Un solo pago</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {plan.features.map((feat, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: plan.featured ? 'rgba(93,167,236,0.2)' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#5da7ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.75)' : '#475569' }}>{feat}</span>
                    </div>
                  ))}
                </div>
                <Link href="/registro" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', background: plan.featured ? '#5da7ec' : '#fff', color: plan.featured ? '#fff' : '#0f172a', border: plan.featured ? 'none' : '1.5px solid #e2e8f0' }}>
                  Empezar con {plan.name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token costs */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Coste por acción</span>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>¿Cuánto cuesta cada acción?</h2>
          </div>
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e2e8f0', overflow: 'hidden' }}>
            {tokenCosts.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i < tokenCosts.length - 1 ? '1px solid #f1f5f9' : 'none', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{item.action}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{item.desc}</p>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#5da7ec', flexShrink: 0, background: '#eff6ff', padding: '4px 12px', borderRadius: 20 }}>{item.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FAQ</span>
            <h2 style={{ fontSize: 'clamp(24px,4vw,36px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Preguntas frecuentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item" style={{ borderRadius: 16, padding: '20px 24px', border: '1.5px solid #f1f5f9', background: '#fff', transition: 'all 0.15s' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{faq.q}</p>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>¿Tienes más dudas? Contáctanos directamente.</p>
            <Link href="/contacto" style={{ fontSize: 14, fontWeight: 700, padding: '12px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none' }}>Hablar con el equipo</Link>
          </div>
        </div>
      </section>
    </div>
  )
}