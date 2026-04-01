import ContactForm from './contact-form'

export default function ContactoPage() {
  const F = 'system-ui,-apple-system,sans-serif'

  return (
    <div style={{ fontFamily: F }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:768px){
          .contact-grid{grid-template-columns:1fr!important}
          .contact-hero-grid{grid-template-columns:1fr!important}
          .info-grid{grid-template-columns:1fr!important}
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(140deg,#050d1f,#0c1e42,#071428)', padding: 'clamp(100px,12vw,140px) 24px clamp(60px,8vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '30%', width: 500, height: 500, background: 'radial-gradient(circle,rgba(93,167,236,0.12),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(93,167,236,0.1)', border: '1px solid rgba(93,167,236,0.2)', borderRadius: 20, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: '#5da7ec', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5da7ec', animation: 'pulse 2s infinite' }} />
            Respuesta en menos de 24h
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,58px)', fontWeight: 800, color: '#fff', letterSpacing: '-2px', margin: '0 0 20px', lineHeight: 1.05 }}>
            Hablemos de tu negocio<br /><span style={{ color: '#5da7ec' }}>COD</span>
          </h1>
          <p style={{ fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, margin: '0 auto', maxWidth: 520 }}>
            Cuéntanos tu situación y te mostramos cómo SAMGPLE puede reducir tus devoluciones y automatizar tus confirmaciones.
          </p>
        </div>

        {/* Stats rápidas */}
        <div style={{ maxWidth: 700, margin: '40px auto 0', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {[
            { value: '< 24h', label: 'Tiempo de respuesta' },
            { value: 'Gratis', label: 'Consultoría inicial' },
            { value: '10min', label: 'Para conectar Shopify' },
          ].map(s => (
            <div key={s.value} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, color: '#5da7ec', margin: '0 0 4px', letterSpacing: '-1px' }}>{s.value}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div className="contact-grid" style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>

          {/* Columna izquierda — info */}
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contacto</span>
            <h2 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 16px', lineHeight: 1.1 }}>
              ¿Tienes dudas? Estamos aquí para ayudarte
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '0 0 36px' }}>
              Tanto si estás evaluando SAMGPLE como si ya eres cliente y necesitas soporte, nuestro equipo te atiende rápido y con soluciones reales.
            </p>

            {/* Info cards */}
            <div className="info-grid" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {[
                {
                  icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
                  color: '#5da7ec', bg: '#eff6ff', border: '#bfdbfe',
                  title: 'Email directo',
                  desc: 'hola@samgple.com',
                  sub: 'Respondemos en menos de 24h',
                },
                {
                  icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                  color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0',
                  title: 'Demo personalizada',
                  desc: 'Te mostramos el panel con datos reales',
                  sub: 'Gratis · Sin compromiso',
                },
                {
                  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
                  color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff',
                  title: 'Consultoría COD gratuita',
                  desc: 'Analizamos tu tasa de devoluciones',
                  sub: 'Estimamos tu ahorro potencial',
                },
                {
                  icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
                  color: '#ea580c', bg: '#fff7ed', border: '#fed7aa',
                  title: 'Soporte rápido',
                  desc: 'Para clientes con cuenta activa',
                  sub: 'Panel de soporte en tiempo real',
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 18px', background: item.bg, borderRadius: 16, border: `1.5px solid ${item.border}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 2px 8px ${item.border}` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: '#374151', margin: '0 0 2px', fontWeight: 500 }}>{item.desc}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial rápido */}
            <div style={{ background: '#f8fafc', borderRadius: 18, padding: '20px 22px', border: '1.5px solid #f1f5f9' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                {[1,2,3,4,5].map(s => <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: '0 0 14px', fontStyle: 'italic' }}>
                "Me respondieron en menos de 2 horas y me ayudaron a configurar todo desde cero. El trato es excelente."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#5da7ec,#2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>C</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Carmen R.</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Fundadora · BeautyDrop</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha — formulario */}
          <ContactForm />
        </div>
      </section>

      {/* ── CALENDLY ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Demo gratuita</span>
            <h2 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 14px' }}>
              Reserva una llamada de 30 min
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Te mostramos el panel en vivo, analizamos tu caso y configuramos SAMGPLE juntos. Sin compromiso.
            </p>
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {['✓ Totalmente gratuito', '✓ Sin compromiso', '✓ Demo en vivo del panel', '✓ Configuración incluida'].map(b => (
              <span key={b} style={{ fontSize: 12, fontWeight: 600, padding: '5px 14px', borderRadius: 20, background: '#f0fdf4', color: '#0f766e', border: '1px solid #bbf7d0' }}>{b}</span>
            ))}
          </div>

          {/* Calendly embed */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            <iframe
              src="https://calendly.com/mluengog06/30min"
              width="100%"
              height="700"
              frameBorder="0"
              style={{ display: 'block', border: 'none' }}
              title="Reserva una llamada con SAMGPLE"
            />
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: 'linear-gradient(140deg,#050d1f,#0c1e42)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 520, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(24px,4vw,42px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '0 0 16px', lineHeight: 1.1 }}>
            ¿Prefieres empezar solo?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '0 0 32px', lineHeight: 1.7 }}>
            Crea tu cuenta gratis y empieza a confirmar pedidos en menos de 10 minutos. Sin ayuda necesaria.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/registro" style={{ fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(93,167,236,0.35)' }}>
              Crear cuenta gratis
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="/precios" style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
              Ver precios
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}