import Link from 'next/link'

export default function HomePage() {
  const F = 'system-ui,-apple-system,sans-serif'

  const features = [
    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', title: 'Score de riesgo IA', desc: 'Cada pedido recibe una puntuación 0-100 basada en historial del cliente, zona, importe y 15+ señales de comportamiento.' },
    { icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', title: 'Llamadas automáticas', desc: 'Tu asistente IA llama al cliente, confirma el pedido y actualiza el estado automáticamente. Sin intervención humana.' },
    { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Validación inteligente', desc: 'Flujo de decisión automatizado. Aprueba, rechaza o reagenda según el resultado de la llamada y el score de riesgo.' },
    { icon: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', title: 'Finanzas en tiempo real', desc: 'Dashboard de ingresos confirmados, tasa de entrega, ROI de campañas y métricas de llamadas actualizado al instante.' },
    { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Integración Shopify', desc: 'Conecta tu tienda en 2 clics. Los pedidos entran solos vía webhook y el proceso arranca automáticamente.' },
    { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Resultados en minutos', desc: 'Desde que llega el pedido hasta que tienes la confirmación del cliente pasan menos de 5 minutos de media.' },
  ]

  const stats = [
    { value: '-42%', label: 'Devoluciones COD' },
    { value: '+31%', label: 'Tasa de entrega' },
    { value: '< 5min', label: 'Por confirmación' },
    { value: '120+', label: 'Tiendas activas' },
  ]

  const testimonials = [
    { name: 'Alejandro M.', role: 'CEO · TiendaRopa.es', text: 'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato.' },
    { name: 'Carmen R.', role: 'Fundadora · BeautyDrop', text: 'El asistente IA llama mejor que mis agentes humanos. Los clientes confirman más porque la llamada es rápida y clara.' },
    { name: 'David F.', role: 'Operaciones · ShopXpress', text: 'Conectamos Shopify en 10 minutos. Los pedidos empezaron a confirmarse solos esa misma tarde. Increíble.' },
  ]

  return (
    <div style={{ fontFamily: F }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .hero-cta:hover { background: #4a96db !important; transform: translateY(-1px); }
        .ghost-btn:hover { background: #f8fafc !important; }
        .feat-card:hover { border-color: #5da7ec !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(93,167,236,0.12) !important; }
        .testi-card:hover { border-color: #e2e8f0 !important; box-shadow: 0 4px 20px rgba(0,0,0,0.06) !important; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Hero */}
      <section style={{ padding: 'clamp(80px,12vw,140px) 24px clamp(60px,8vw,100px)', textAlign: 'center', background: 'linear-gradient(180deg,#f0f7ff 0%,#fff 100%)', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#1d4ed8', marginBottom: 28, letterSpacing: '0.04em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s infinite' }} />
            NUEVO · Llamadas COD con IA
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.05, letterSpacing: '-2px', margin: '0 0 24px' }}>
            Para de perder dinero<br />en pedidos <span style={{ color: '#5da7ec' }}>COD fallidos</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,2vw,20px)', color: '#64748b', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            SAMGPLE analiza cada pedido con IA, llama automáticamente al cliente y confirma la entrega antes de enviar. Reduce devoluciones hasta un 42%.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" className="hero-cta" style={{ fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', transition: 'all 0.15s', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Empieza gratis hoy
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/metodologia" className="ghost-btn" style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#0f172a', textDecoration: 'none', transition: 'all 0.15s' }}>
              Ver cómo funciona
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Cancela cuando quieras</p>
        </div>

        {/* Mock dashboard */}
        <div style={{ maxWidth: 900, margin: '60px auto 0', background: '#0f172a', borderRadius: 20, padding: 3, boxShadow: '0 32px 80px rgba(0,0,0,0.2)' }}>
          <div style={{ background: '#1e293b', borderRadius: 18, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            <div style={{ flex: 1, height: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 6, maxWidth: 300, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>app.samgple.com/pedidos</span>
            </div>
          </div>
          <div style={{ padding: '24px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12 }}>
            {[
              { label: 'Ingresos confirmados', value: '4,892€', color: '#22c55e', sub: '+12% esta semana' },
              { label: 'Tasa confirmación', value: '87%', color: '#5da7ec', sub: '↑ vs mes anterior' },
              { label: 'Llamadas realizadas', value: '143', color: '#a78bfa', sub: 'Hoy · en tiempo real' },
              { label: 'Score medio riesgo', value: '34', color: '#f59e0b', sub: 'Riesgo bajo ✓' },
            ].map(m => (
              <div key={m.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>{m.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: m.color, margin: '0 0 4px', letterSpacing: '-0.5px' }}>{m.value}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0 }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#0f172a', padding: '40px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 32, textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.value}>
              <p style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#5da7ec', margin: '0 0 4px', letterSpacing: '-1px' }}>{s.value}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>El problema</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1.1, margin: '12px 0 20px' }}>
              El COD tiene un problema de confianza
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: '0 0 20px' }}>
              Entre el 25% y el 45% de los pedidos COD no se entregan. Eso significa devoluciones, costes de envío perdidos y productos dañados.
            </p>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              La mayoría de tiendas envían sin validar. Nosotros confirmamos primero, enviamos después.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { pct: '38%', label: 'Pedidos COD que no se entregan de media', color: '#ef4444' },
              { pct: '2.4x', label: 'Más caro gestionar una devolución que prevenirla', color: '#f59e0b' },
              { pct: '-42%', label: 'Reducción de devoluciones con SAMGPLE', color: '#22c55e' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: '-1px', flexShrink: 0 }}>{s.pct}</span>
                <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Características</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 16px' }}>Todo lo que necesitas para dominar el COD</h2>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 500, margin: '0 auto' }}>Una plataforma completa que automatiza el proceso de validación de principio a fin.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
            {features.map((f, i) => (
              <div key={i} className="feat-card" style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1.5px solid #f1f5f9', transition: 'all 0.2s', cursor: 'default' }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5da7ec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#5da7ec', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Testimonios</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', margin: '12px 0 0' }}>Lo que dicen nuestros clientes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testi-card" style={{ background: '#f8fafc', borderRadius: 20, padding: '28px', border: '1.5px solid #f1f5f9', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#5da7ec,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: 'clamp(60px,8vw,100px) 24px', background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', margin: '0 0 20px', lineHeight: 1.1 }}>
            Empieza a confirmar pedidos hoy mismo
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', margin: '0 0 36px', lineHeight: 1.7 }}>
            Tokens de bienvenida incluidos. Sin suscripción mensual. Cancela cuando quieras.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/registro" style={{ fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Crear cuenta gratis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" style={{ fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff', textDecoration: 'none', background: 'transparent' }}>
              Ver precios
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}