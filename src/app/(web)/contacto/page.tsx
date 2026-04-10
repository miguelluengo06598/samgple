'use client'

import { useEffect, useRef, useState } from 'react'
import ContactForm from './contact-form'
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

const TRUST = [
  { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', title: 'Sin humo', desc: 'Respuestas directas sobre si SAMGPLE encaja contigo.' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff', title: 'Setup incluido', desc: 'Te ayudamos a conectar Shopify y lanzar la primera llamada.' },
  { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1', color: '#06b6d4', bg: '#ecfeff', border: '#a5f3fc', title: 'Sin compromiso', desc: 'No hay contrato mínimo. Si no te convence, no pagas nada.' },
  { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', title: 'Equipo humano', desc: 'Hablas con personas que conocen el eCommerce COD.' },
]

export default function ContactoPage() {
  const [tab, setTab] = useState<'llamada' | 'mensaje'>('llamada')

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
        @keyframes sp-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes sp-tab-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }

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

        .sp-trust-card { transition:all 0.15s; }
        .sp-trust-card:hover { transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.09) !important; }

        .sp-tab-content { animation:sp-tab-in 0.3s cubic-bezier(0.16,1,0.3,1); }

        .sp-ticker { overflow:hidden;background:#0f172a;padding:14px 0; }
        .sp-ticker-track { display:flex;animation:sp-scroll 30s linear infinite;width:max-content; }
        .sp-ticker-track span { display:inline-flex;align-items:center;gap:10px;padding:0 28px;font-size:10px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap; }

        @media(max-width:768px) { .sp-trust-grid { grid-template-columns:1fr 1fr !important; } .sp-ctas { flex-direction:column;align-items:stretch; } .sp-btn-primary,.sp-btn-ghost { justify-content:center; } }
        @media(max-width:480px) { .sp-trust-grid { grid-template-columns:1fr !important; } }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:'#fff', paddingTop:'clamp(120px,14vw,160px)', paddingBottom:'clamp(72px,8vw,100px)', paddingLeft:'clamp(20px,5vw,40px)', paddingRight:'clamp(20px,5vw,40px)', position:'relative', overflow:'hidden', textAlign:'center' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)', backgroundSize:'48px 48px', WebkitMaskImage:'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)', maskImage:'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)' }} />
        <div style={{ position:'absolute', top:-200, left:'50%', transform:'translateX(-50%)', width:800, height:600, background:'radial-gradient(ellipse,rgba(99,102,241,.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div className="sp-max-sm" style={{ position:'relative' }}>
          <Reveal>
            <div className="sp-tag">
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#6366f1', animation:'sp-pulse 2s infinite' }} />
              Respuesta en menos de 24h
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 style={{ fontSize:'clamp(36px,6vw,68px)', fontWeight:900, letterSpacing:'-3px', lineHeight:1.02, marginBottom:20, color:'#0f172a' }}>
              Hablemos de tu<br />
              <span style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>negocio COD</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="sp-sub" style={{ maxWidth:500, margin:'0 auto 48px' }}>
              Cuéntanos tu situación y en 30 minutos te mostramos exactamente cómo SAMGPLE reduciría tus devoluciones — sin compromiso.
            </p>
          </Reveal>

          {/* ── STATS ── */}
          <Reveal delay={0.14}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, maxWidth:480, margin:'0 auto' }}>
              {[
                { v:'< 24h', l:'Respuesta', c:'#6366f1' },
                { v:'Gratis', l:'Consultoría', c:'#8b5cf6' },
                { v:'10 min', l:'Setup Shopify', c:'#10b981' },
              ].map((s,i) => (
                <div key={i} style={{ background:'#fff', border:'1.5px solid #f1f5f9', borderRadius:18, padding:'18px 10px', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize:'clamp(18px,3vw,26px)', fontWeight:900, color:s.c, margin:'0 0 5px', letterSpacing:'-1px', lineHeight:1 }}>{s.v}</p>
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
            ['Respuesta en 24h','Demo gratuita','Sin permanencia','Consultoría COD','Setup en 10 min','Soporte real','120+ tiendas activas','Sin tarjeta de crédito'].map((t,i) => (
              <span key={`${gi}-${i}`}>
                <span style={{ width:4, height:4, borderRadius:'50%', background:'#6366f1', flexShrink:0 }} />
                {t}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── TOGGLE + CONTENIDO PRINCIPAL ── */}
      <section className="sp-section" style={{ background:'#fafbff' }}>
        <div className="sp-max-sm">

          {/* Toggle */}
          <Reveal>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:48 }}>
              <div style={{ display:'flex', background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:20, padding:5, gap:4, boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>
                {([
                  { key:'llamada', label:'Reservar llamada', icon:'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { key:'mensaje', label:'Enviar mensaje', icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                ] as const).map(t => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    style={{
                      display:'flex', alignItems:'center', gap:8,
                      padding:'12px 22px', borderRadius:15, border:'none',
                      background: tab === t.key ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                      color: tab === t.key ? '#fff' : '#64748b',
                      fontSize:14, fontWeight:700, cursor:'pointer',
                      fontFamily:'inherit', transition:'all 0.2s',
                      boxShadow: tab === t.key ? '0 4px 16px rgba(99,102,241,0.35)' : 'none',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d={t.icon}/>
                    </svg>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── LLAMADA: Calendly ── */}
          {tab === 'llamada' && (
            <div className="sp-tab-content">
              <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #f1f5f9', overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,0.06)' }}>
                {/* Header */}
                <div style={{ background:'linear-gradient(135deg,#eef2ff,#faf5ff)', padding:'20px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(99,102,241,0.35)', flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:'0 0 3px', letterSpacing:'-0.3px' }}>Reserva una demo de 30 min</p>
                    <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Te mostramos el panel en vivo y configuramos SAMGPLE contigo</p>
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {['Gratis','Sin compromiso','Demo en vivo'].map(b => (
                      <span key={b} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:100, background:'#f0fdf4', color:'#059669', border:'1px solid #bbf7d0' }}>{b}</span>
                    ))}
                  </div>
                </div>
                {/* Calendly iframe — lógica original intacta */}
                <iframe
                  src="https://calendly.com/mluengog06/30min"
                  width="100%"
                  height="660"
                  frameBorder="0"
                  style={{ display:'block', border:'none' }}
                  title="Reserva una llamada con SAMGPLE"
                />
              </div>
            </div>
          )}

          {/* ── MENSAJE: Formulario ── */}
          {tab === 'mensaje' && (
            <div className="sp-tab-content">
              <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #f1f5f9', overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,0.06)' }}>
                {/* Header */}
                <div style={{ background:'linear-gradient(135deg,#eef2ff,#faf5ff)', padding:'20px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(99,102,241,0.35)', flexShrink:0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:'0 0 3px', letterSpacing:'-0.3px' }}>Envíanos un mensaje</p>
                    <p style={{ fontSize:13, color:'#64748b', margin:0 }}>Respondemos en menos de 24h con soluciones reales</p>
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    {['< 24h respuesta','Sin plantillas'].map(b => (
                      <span key={b} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:100, background:'#eef2ff', color:'#4338ca', border:'1px solid #c7d2fe' }}>{b}</span>
                    ))}
                  </div>
                </div>
                {/* Formulario — lógica original intacta */}
                <div style={{ padding:'clamp(24px,4vw,40px)' }}>
                  <ContactForm />
                </div>
              </div>

              {/* Testimonio */}
              <div style={{ marginTop:16, background:'linear-gradient(135deg,#eef2ff,#faf5ff)', borderRadius:20, padding:'20px 24px', border:'1.5px solid #c7d2fe' }}>
                <div style={{ display:'flex', gap:2, marginBottom:10 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  <span style={{ fontSize:11, color:'#94a3b8', marginLeft:6, alignSelf:'center' }}>5.0 · 120+ tiendas</span>
                </div>
                <p style={{ fontSize:13, color:'#374151', lineHeight:1.75, margin:'0 0 14px', fontStyle:'italic' }}>
                  "Me respondieron en menos de 2 horas y me ayudaron a configurar todo desde cero. El trato es excelente y los resultados son reales."
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', flexShrink:0 }}>C</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:0 }}>Carmen R.</p>
                    <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>Fundadora · BeautyDrop</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="sp-section" style={{ background:'#fff', paddingTop:'clamp(48px,6vw,72px)', paddingBottom:'clamp(48px,6vw,72px)' }}>
        <div className="sp-max">
          <Reveal>
            <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em', textAlign:'center', marginBottom:24 }}>Por qué escribirnos</p>
          </Reveal>
          <div className="sp-trust-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {TRUST.map((t,i) => (
              <Reveal key={i} delay={i*0.07}>
                <div className="sp-card sp-trust-card" style={{ borderColor:t.border }}>
                  <div style={{ width:40, height:40, borderRadius:13, background:t.bg, border:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round"><path d={t.icon}/></svg>
                  </div>
                  <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 6px' }}>{t.title}</p>
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, margin:0 }}>{t.desc}</p>
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
            <p style={{ fontSize:13, fontWeight:700, color:'rgba(129,140,248,0.8)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:18 }}>¿Prefieres empezar solo?</p>
            <h2 style={{ fontSize:'clamp(30px,5vw,56px)', fontWeight:900, color:'#fff', letterSpacing:'-2.5px', lineHeight:1.03, marginBottom:20 }}>
              En 10 minutos<br /><span style={{ color:'#818cf8' }}>estás listo.</span>
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', marginBottom:36, lineHeight:1.75, maxWidth:400, margin:'0 auto 36px' }}>
              Crea tu cuenta gratis, conecta Shopify y empieza a confirmar pedidos hoy mismo.
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
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.2)' }}>Tokens de bienvenida incluidos · Cancela cuando quieras</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
///fjojojfosjv