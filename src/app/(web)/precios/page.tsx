import Link from 'next/link'

export default function PreciosPage() {
  const F = 'system-ui,-apple-system,sans-serif'

  const plans = [
    {
      name: 'Starter', price: 15, tokens: 15, perToken: '1.00',
      featured: false,
      desc: 'Perfecto para empezar y probar el sistema.',
      features: [
        { text: '15 tokens incluidos', highlight: false },
        { text: 'Análisis IA por pedido', highlight: false },
        { text: 'Llamadas VAPI automáticas', highlight: false },
        { text: 'Mensajes WhatsApp IA', highlight: false },
        { text: 'Dashboard en tiempo real', highlight: false },
        { text: 'Soporte por chat', highlight: false },
      ],
    },
    {
      name: 'Pro', price: 45, tokens: 50, perToken: '0.90',
      featured: true,
      desc: 'El más elegido por tiendas con volumen medio-alto.',
      features: [
        { text: '50 tokens incluidos', highlight: true },
        { text: 'Todo lo de Starter', highlight: false },
        { text: 'Informes semanales IA', highlight: true },
        { text: 'Consultor de rentabilidad', highlight: true },
        { text: 'Análisis avanzado de riesgo', highlight: false },
        { text: 'Soporte prioritario', highlight: false },
      ],
    },
    {
      name: 'Business', price: 100, tokens: 110, perToken: '0.91',
      featured: false,
      desc: 'Para operaciones grandes con múltiples tiendas.',
      features: [
        { text: '110 tokens incluidos', highlight: false },
        { text: 'Todo lo de Pro', highlight: false },
        { text: 'Múltiples tiendas Shopify', highlight: false },
        { text: 'Acceso a API', highlight: false },
        { text: 'Onboarding personalizado', highlight: false },
        { text: 'Account manager dedicado', highlight: false },
      ],
    },
  ]

  const tokenCosts = [
    { action: 'Análisis IA de pedido', cost: '0.17 tkn', desc: 'Una vez por pedido al llegar', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: '#8b5cf6', bg: '#faf5ff' },
    { action: 'Llamada exitosa (por minuto)', cost: '0.22 tkn', desc: 'Proporcional a la duración', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', color: '#0f766e', bg: '#f0fdf4' },
    { action: 'Llamada fallida / no contesta', cost: '0.05 tkn', desc: 'Coste mínimo por intento', icon: 'M13.73 21a2 2 0 01-3.46 0l-8-14A2 2 0 013.27 4h17.46a2 2 0 011.73 3z', color: '#ea580c', bg: '#fff7ed' },
    { action: 'Mensaje WhatsApp IA', cost: '0.004 tkn', desc: 'Generado y enviado por IA', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', color: '#0284c7', bg: '#f0f9ff' },
    { action: 'Informe semanal IA', cost: '0.5 tkn', desc: 'Análisis completo a tu email', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6', color: '#ec4899', bg: '#fdf2f8' },
    { action: 'Reanálisis manual', cost: '0.01 tkn', desc: 'Actualiza el score cuando quieras', icon: 'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 0 0 5.64 5.64L1 10 M3.51 15a9 9 0 0 0 14.85 3.36L23 14', color: '#475569', bg: '#f1f5f9' },
  ]

  const faqs = [
    { q: '¿Los tokens caducan?', a: 'No. Tus tokens no tienen fecha de caducidad. Puedes comprarlos ahora y usarlos cuando quieras, sin presión.' },
    { q: '¿Cuántos pedidos puedo gestionar con 50 tokens?', a: 'Con 50 tokens puedes analizar ~294 pedidos o realizar ~227 llamadas de 1 minuto. La mayoría de tiendas obtiene más de 200 confirmaciones.' },
    { q: '¿Puedo comprar más tokens en cualquier momento?', a: 'Sí. Recargas desde el panel en cualquier momento. También puedes canjear cupones de descuento que ofrecemos periódicamente.' },
    { q: '¿Qué pasa si me quedo sin tokens?', a: 'Te avisamos cuando el saldo es bajo. Las llamadas en curso se completan, pero no se inician nuevas hasta que recargues.' },
    { q: '¿Necesito cuenta de Twilio o VAPI?', a: 'Sí, pero son gratuitas de crear. Solo pagas los tokens de SAMGPLE. Te guiamos paso a paso en la configuración inicial.' },
    { q: '¿Hay permanencia o contrato?', a: 'No. SAMGPLE es completamente sin compromiso. Compras tokens cuando los necesitas y paras cuando quieras. Sin letra pequeña.' },
  ]

  const guarantees = [
    { icon: '🔒', title: 'Sin permanencia', desc: 'Compra tokens cuando quieras. Para cuando quieras.' },
    { icon: '♾️', title: 'Sin caducidad', desc: 'Tus tokens no expiran nunca. Son tuyos para siempre.' },
    { icon: '⚡', title: 'Activación inmediata', desc: 'Desde el pago hasta la primera llamada en menos de 10 min.' },
    { icon: '🎯', title: 'Paga por resultado', desc: 'Solo gastas cuando SAMGPLE trabaja activamente.' },
  ]

  return (
    <div style={{ fontFamily: F }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .plan-hover:hover{transform:translateY(-4px);box-shadow:0 20px 60px rgba(0,0,0,0.12)!important}
        .faq-item:hover{background:#f0f7ff!important;border-color:#bfdbfe!important}
        .cost-row:hover{background:#f8fafc!important}
        @media(max-width:768px){
          .plans-grid{grid-template-columns:1fr!important}
          .guarantee-grid{grid-template-columns:1fr 1fr!important}
          .faq-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:480px){
          .guarantee-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(140deg,#050d1f,#0c1e42,#071428)', padding: 'clamp(100px,12vw,140px) 24px clamp(60px,8vw,80px)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle,rgba(93,167,236,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(93,167,236,0.1)', border: '1px solid rgba(93,167,236,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#5da7ec', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5da7ec', animation: 'pulse 2s infinite' }} />
            Sin suscripción · Sin permanencia
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,60px)', fontWeight: 800, color: '#fff', letterSpacing: '-2px', margin: '0 0 20px', lineHeight: 1.05 }}>
            Paga solo por lo que<br /><span style={{ color: '#5da7ec' }}>realmente usas</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: '0 0 36px', maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Sistema de tokens sin sorpresas. Compra una vez, usa cuando quieras. Sin mensualidades, sin contratos, sin letra pequeña.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 20px rgba(93,167,236,0.35)' }}>
              Crear cuenta gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/contacto" style={{ fontSize: 14, fontWeight: 600, padding: '13px 24px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Hablar con ventas
            </Link>
          </div>
        </div>
      </section>

      {/* ── GARANTÍAS ── */}
      <section style={{ background: '#f8fafc', padding: '32px 24px', borderBottom: '1px solid #f1f5f9' }}>
        <div className="guarantee-grid" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {guarantees.map((g, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff', borderRadius: 14, border: '1.5px solid #f1f5f9' }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{g.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{g.title}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PLANES ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Packs de tokens</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 14px' }}>Elige tu pack de inicio</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>Todos incluyen acceso completo a la plataforma. Sin funciones bloqueadas.</p>
          </div>

          <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'stretch' }}>
            {plans.map((plan, i) => (
              <div key={i} className={plan.featured ? '' : 'plan-hover'}
                style={{
                  borderRadius: 24, padding: '32px 28px',
                  background: plan.featured ? '#0f172a' : '#fff',
                  border: plan.featured ? 'none' : '1.5px solid #e2e8f0',
                  position: 'relative', overflow: 'hidden',
                  transition: 'all 0.2s',
                  boxShadow: plan.featured ? '0 24px 64px rgba(15,23,42,0.25)' : 'none',
                  transform: plan.featured ? 'scale(1.03)' : 'none',
                }}>

                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: plan.featured ? 'linear-gradient(90deg,#5da7ec,#2563eb)' : '#f1f5f9', borderRadius: '24px 24px 0 0' }} />

                {plan.featured && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: '#5da7ec', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Más popular
                  </div>
                )}

                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: plan.featured ? 'rgba(255,255,255,0.35)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>{plan.name}</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 56, fontWeight: 800, color: plan.featured ? '#fff' : '#0f172a', letterSpacing: '-2.5px', lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: 20, fontWeight: 700, color: plan.featured ? 'rgba(255,255,255,0.6)' : '#64748b', marginBottom: 8 }}>€</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: plan.featured ? '#5da7ec' : '#5da7ec', background: plan.featured ? 'rgba(93,167,236,0.15)' : '#eff6ff', padding: '2px 10px', borderRadius: 20 }}>{plan.tokens} tokens</span>
                    <span style={{ fontSize: 12, color: plan.featured ? 'rgba(255,255,255,0.35)' : '#94a3b8' }}>{plan.perToken}€/token</span>
                  </div>
                  <p style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.4)' : '#64748b', margin: '0 0 24px', lineHeight: 1.5 }}>{plan.desc}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {plan.features.map((feat, fi) => (
                    <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: plan.featured ? 'rgba(93,167,236,0.2)' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#5da7ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span style={{ fontSize: 13, color: plan.featured ? (feat.highlight ? '#fff' : 'rgba(255,255,255,0.65)') : (feat.highlight ? '#0f172a' : '#475569'), fontWeight: feat.highlight ? 600 : 400 }}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Link href="/registro"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, textAlign: 'center', padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none', background: plan.featured ? '#5da7ec' : '#fff', color: plan.featured ? '#fff' : '#0f172a', border: plan.featured ? 'none' : '1.5px solid #e2e8f0', boxShadow: plan.featured ? '0 4px 16px rgba(93,167,236,0.4)' : 'none', transition: 'all 0.15s' }}>
                  Empezar con {plan.name}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', marginTop: 24 }}>
            ¿Necesitas más volumen?{' '}
            <Link href="/contacto" style={{ color: '#5da7ec', fontWeight: 600, textDecoration: 'none' }}>Contáctanos para un plan personalizado →</Link>
          </p>
        </div>
      </section>

      {/* ── COSTE POR ACCIÓN ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Transparencia total</span>
            <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 14px' }}>¿Cuánto cuesta cada acción?</h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>Sin costes ocultos. Sabes exactamente cuánto gastas por cada operación.</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
            {tokenCosts.map((item, i) => (
              <div key={i} className="cost-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: i < tokenCosts.length - 1 ? '1px solid #f1f5f9' : 'none', gap: 16, transition: 'background 0.15s', cursor: 'default' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>{item.action}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: item.color, flexShrink: 0, background: item.bg, padding: '5px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>{item.cost}</span>
              </div>
            ))}
          </div>

          {/* Calculadora rápida */}
          <div style={{ marginTop: 20, background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', borderRadius: 20, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Ejemplo práctico</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>50 pedidos · 40 llamadas (1 min) · 10 no contestados</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Coste total estimado</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#5da7ec', margin: 0, letterSpacing: '-1px' }}>17.35 tkn</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FAQ</span>
            <h2 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Preguntas frecuentes</h2>
          </div>
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 40 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item" style={{ borderRadius: 18, padding: '22px 24px', border: '1.5px solid #f1f5f9', background: '#fff', transition: 'all 0.15s', cursor: 'default' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.4 }}>{faq.q}</p>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>¿Tienes más dudas? Nuestro equipo responde en menos de 24h.</p>
            <Link href="/contacto" style={{ fontSize: 14, fontWeight: 700, padding: '12px 28px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: '0 4px 14px rgba(93,167,236,0.3)' }}>
              Hablar con el equipo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: 'linear-gradient(140deg,#050d1f,#0c1e42)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 540, margin: '0 auto', position: 'relative' }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg,#5da7ec,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(93,167,236,0.3)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,46px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '0 0 16px', lineHeight: 1.1 }}>
            Empieza hoy sin riesgos
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', margin: '0 0 36px', lineHeight: 1.7 }}>
            Crea tu cuenta gratis y recibe tokens de bienvenida para probar el sistema sin pagar nada.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(93,167,236,0.35)' }}>
              Crear cuenta gratis
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/metodologia" style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Ver cómo funciona
            </Link>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 20 }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Sin permanencia</p>
        </div>
      </section>
    </div>
  )
}