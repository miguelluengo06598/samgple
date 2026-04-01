import ContactForm from './contact-form'

export default function ContactoPage() {
  const F = 'system-ui,-apple-system,sans-serif'

  return (
    <div style={{ fontFamily: F }}>
      <section style={{ padding: 'clamp(60px,10vw,100px) 24px', background: 'linear-gradient(180deg,#f0f7ff,#fff)', borderBottom: '1px solid #f1f5f9', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contacto</span>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1.5px', margin: '12px 0 16px', lineHeight: 1.1 }}>
            Hablemos de tu negocio
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            Cuéntanos tu situación y te mostramos cómo SAMGPLE puede reducir tus devoluciones COD.
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 60, alignItems: 'start' }}>

          {/* Info */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', margin: '0 0 16px' }}>¿Por qué contactar?</h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 32px' }}>
              Te ayudamos a evaluar si SAMGPLE encaja con tu operación de COD y te guiamos en la configuración inicial.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Demo personalizada', desc: 'Te mostramos el panel con datos reales de tu sector.' },
                { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Consultoría COD gratuita', desc: 'Analizamos tu tasa de devoluciones actual y estimamos el ahorro.' },
                { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Respuesta en menos de 24h', desc: 'Nuestro equipo responde rápido, siempre.' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5da7ec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </div>
  )
}