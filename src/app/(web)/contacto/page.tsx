'use client'

import { useEffect, useRef, useState } from 'react'
import ContactForm from './contact-form'
import Link from 'next/link'

export default function ContactoPage() {

  const [visible, setVisible] = useState<Set<string>>(new Set())
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const obs = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    obs.current = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(p => new Set([...p, e.target.id]))
      }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('[data-obs]').forEach(el => obs.current?.observe(el))
    return () => obs.current?.disconnect()
  }, [])

  const isVis = (id: string) => visible.has(id)

  const infoCards = [
    {
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      color: '#2EC4B6', bg: '#f0fdf9', border: '#99f6e4',
      title: 'Email directo',
      desc: 'hola@samgple.com',
      sub: 'Respondemos en menos de 24h',
    },
    {
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe',
      title: 'Demo personalizada',
      desc: 'Panel en vivo con datos reales',
      sub: 'Gratis · Sin compromiso',
    },
    {
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
      color: '#f59e0b', bg: '#fffbeb', border: '#fde68a',
      title: 'Consultoría COD',
      desc: 'Analizamos tu tasa de devoluciones',
      sub: 'Estimamos tu ahorro potencial',
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0',
      title: 'Soporte rápido',
      desc: 'Para clientes con cuenta activa',
      sub: 'Panel de soporte en tiempo real',
    },
  ]

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; }

        @keyframes pulse     { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
        @keyframes shimmer   { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeLeft  { from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes fadeRight { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes starPop   { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }

        .vu  { animation: fadeUp    .6s cubic-bezier(.22,1,.36,1) both; }
        .vl  { animation: fadeLeft  .6s cubic-bezier(.22,1,.36,1) both; }
        .vr  { animation: fadeRight .6s cubic-bezier(.22,1,.36,1) both; }
        .d1  { animation-delay:.1s } .d2 { animation-delay:.2s }
        .d3  { animation-delay:.3s } .d4 { animation-delay:.4s }
        .d5  { animation-delay:.5s }

        .gradient-text {
          background: linear-gradient(135deg,#2EC4B6,#6366f1,#2EC4B6);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text; animation:shimmer 4s linear infinite;
        }

        .ticker-track { display:flex; animation:ticker 26s linear infinite; width:max-content; }
        .ticker-track:hover { animation-play-state:paused; }

        .info-card {
          display:flex; align-items:flex-start; gap:14px;
          padding:18px 20px; border-radius:18px;
          transition:all .2s ease; cursor:default;
          will-change:transform;
        }
        .info-card:hover { transform:translateX(4px); box-shadow:0 8px 28px rgba(0,0,0,0.07); }

        .float-badge { animation:floatY 5s ease-in-out infinite; }

        .cta-btn {
          font-size:15px; font-weight:700;
          padding:14px 32px; border-radius:14px;
          background:linear-gradient(135deg,#2EC4B6,#1A9E8F);
          color:#fff; text-decoration:none;
          display:inline-flex; align-items:center; gap:9px;
          box-shadow:0 8px 24px rgba(46,196,182,.38);
          transition:all .18s cubic-bezier(.34,1.56,.64,1);
          font-family:'DM Sans',system-ui,sans-serif;
          will-change:transform;
        }
        .cta-btn:hover  { transform:translateY(-2px); box-shadow:0 14px 36px rgba(46,196,182,.5); }
        .cta-btn:active { transform:scale(.97); }

        .cta-ghost {
          font-size:15px; font-weight:600;
          padding:14px 28px; border-radius:14px;
          border:1.5px solid rgba(255,255,255,.18);
          color:rgba(255,255,255,.75); text-decoration:none;
          display:inline-flex; align-items:center; gap:7px;
          transition:all .15s ease;
          font-family:'DM Sans',system-ui,sans-serif;
        }
        .cta-ghost:hover { border-color:rgba(255,255,255,.35); color:#fff; background:rgba(255,255,255,.06); }

        .badge-pill {
          font-size:12px; font-weight:600;
          padding:5px 14px; border-radius:20px;
          background:#f0fdf4; color:#0f766e;
          border:1px solid #a7f3d0;
        }

        @media(max-width:900px) {
          .contact-grid  { grid-template-columns:1fr !important; }
          .stats-grid    { grid-template-columns:repeat(2,1fr) !important; }
          .trust-grid    { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:560px) {
          .stats-grid    { grid-template-columns:repeat(3,1fr) !important; }
          .trust-grid    { grid-template-columns:1fr !important; }
          .cta-btns      { flex-direction:column !important; }
          .cta-btns a    { width:100%; justify-content:center; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{ background:'linear-gradient(150deg,#080f24 0%,#0c1a3e 55%,#0d1330 100%)', padding:'clamp(96px,11vw,140px) 24px clamp(56px,7vw,88px)', position:'relative', overflow:'hidden' }}>

        {/* Orbs decorativos */}
        <div style={{ position:'absolute', top:-140, left:'25%', width:560, height:560, background:'radial-gradient(circle,rgba(46,196,182,0.13),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-100, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(99,102,241,0.1),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'30%', right:'10%', width:200, height:200, background:'radial-gradient(circle,rgba(46,196,182,0.07),transparent 70%)', pointerEvents:'none' }} />

        {/* Badge flotante — escritorio */}
        <div className="float-badge" style={{ position:'absolute', top:'18%', right:'clamp(20px,6vw,100px)', background:'rgba(255,255,255,0.06)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:18, padding:'14px 18px', display:'flex', alignItems:'center', gap:12, maxWidth:220 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 12px rgba(46,196,182,.4)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:'0 0 2px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>+120 tiendas</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>confirmando con IA</p>
          </div>
        </div>

        <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center', position:'relative' }}>

          <div className="vu" style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(46,196,182,0.1)', border:'1px solid rgba(46,196,182,0.22)', borderRadius:20, padding:'5px 14px', marginBottom:24 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#2EC4B6', display:'inline-block', animation:'pulse 2s infinite', boxShadow:'0 0 6px rgba(46,196,182,.7)' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:'0.07em' }}>RESPUESTA EN MENOS DE 24H</span>
          </div>

          <h1 className="vu d1" style={{ fontSize:'clamp(34px,5.5vw,64px)', fontWeight:800, color:'#fff', letterSpacing:'-2.5px', margin:'0 0 20px', lineHeight:1.05 }}>
            Hablemos de tu<br />
            negocio <span className="gradient-text">COD</span>
          </h1>

          <p className="vu d2" style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'rgba(255,255,255,0.5)', lineHeight:1.75, margin:'0 auto 40px', maxWidth:520 }}>
            Cuéntanos tu situación y te mostramos en 30 minutos cómo SAMGPLE puede reducir tus devoluciones y automatizar tus confirmaciones.
          </p>

          {/* Stats */}
          <div className="stats-grid vu d3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {[
              { v:'< 24h', l:'Respuesta', c:'#2EC4B6' },
              { v:'Gratis', l:'Consultoría', c:'#a78bfa' },
              { v:'10min', l:'Setup Shopify', c:'#34d399' },
            ].map(s => (
              <div key={s.v} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:'16px 10px', textAlign:'center' }}>
                <p style={{ fontSize:'clamp(20px,2.8vw,28px)', fontWeight:800, color:s.c, margin:'0 0 4px', letterSpacing:'-1px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.v}</p>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.35)', margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background:'#0f172a', padding:'11px 0', overflow:'hidden', borderTop:'1px solid #1e293b' }}>
        <div className="ticker-track">
          {[...Array(2)].map((_,ri) => (
            <div key={ri} style={{ display:'flex' }}>
              {['Respuesta en 24h','Demo gratuita','Sin permanencia','Consultoría COD','Setup en 10 minutos','Soporte real','120+ tiendas activas','Sin tarjeta de crédito'].map((t,i) => (
                <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:14, padding:'0 28px', fontSize:11, fontWeight:700, color:'rgba(255,255,255,.4)', letterSpacing:'0.06em', textTransform:'uppercase', whiteSpace:'nowrap', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:'#2EC4B6', flexShrink:0 }} />{t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══ MAIN GRID ══ */}
      <section id="main" data-obs style={{ padding:'clamp(60px,8vw,100px) 24px', background:'#fff' }}>
        <div className="contact-grid" style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'start' }}>

          {/* ── IZQUIERDA ── */}
          <div className={isVis('main') ? 'vl' : ''}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Contacto</span>
            <h2 style={{ fontSize:'clamp(24px,3.5vw,40px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'12px 0 16px', lineHeight:1.1, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              ¿Tienes dudas?<br />
              <span style={{ color:'#2EC4B6' }}>Estamos aquí.</span>
            </h2>
            <p style={{ fontSize:15, color:'#64748b', lineHeight:1.75, margin:'0 0 32px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Tanto si estás evaluando SAMGPLE como si ya eres cliente, nuestro equipo responde rápido con soluciones reales, no plantillas.
            </p>

            {/* Info cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
              {infoCards.map((item, i) => (
                <div
                  key={i}
                  className="info-card"
                  style={{
                    background: activeCard === i ? '#fff' : item.bg,
                    border:`1.5px solid ${activeCard === i ? item.color + '40' : item.border}`,
                    boxShadow: activeCard === i ? `0 8px 28px ${item.color}18` : 'none',
                    animationDelay:`${i * 0.08}s`,
                  }}
                  onMouseEnter={() => setActiveCard(i)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  <div style={{ width:42, height:42, borderRadius:13, background:'#fff', border:`1.5px solid ${item.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 3px 10px ${item.color}20` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{item.title}</p>
                    <p style={{ fontSize:13, color:'#374151', margin:'0 0 2px', fontWeight:500, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{item.desc}</p>
                    <p style={{ fontSize:11, color:'#94a3b8', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{item.sub}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round" style={{ opacity: activeCard === i ? 1 : 0, transition:'opacity .2s', flexShrink:0 }}><path d="M9 18l6-6-6-6"/></svg>
                </div>
              ))}
            </div>

            {/* Testimonio */}
            <div style={{ background:'linear-gradient(135deg,#f0fdf9,#eef2ff)', borderRadius:20, padding:'22px 24px', border:'1.5px solid #c7d2fe' }}>
              <div style={{ display:'flex', gap:3, marginBottom:10 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" style={{ animation:`starPop .3s ${s * 0.06}s both` }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
                <span style={{ fontSize:11, color:'#94a3b8', marginLeft:6, alignSelf:'center', fontFamily:"'DM Sans',system-ui,sans-serif" }}>5.0 · 120+ tiendas</span>
              </div>
              <p style={{ fontSize:13, color:'#374151', lineHeight:1.75, margin:'0 0 16px', fontStyle:'italic', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                "Me respondieron en menos de 2 horas y me ayudaron a configurar todo desde cero. El trato es excelente y los resultados reales."
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 }}>C</div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Carmen R.</p>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Fundadora · BeautyDrop</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── FORMULARIO ── */}
          <div className={isVis('main') ? 'vr' : ''}>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ══ TRUST STRIP ══ */}
      <section id="trust" data-obs style={{ padding:'clamp(40px,5vw,64px) 24px', background:'#f8fafc' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <p className={`${isVis('trust') ? 'vu' : ''}`} style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em', textAlign:'center', margin:'0 0 28px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            Por qué escribirnos
          </p>
          <div className="trust-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
            {[
              { icon:'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color:'#2EC4B6', bg:'#f0fdf9', border:'#99f6e4', title:'Sin humo', desc:'Respuestas directas y honestas sobre si SAMGPLE encaja contigo.' },
              { icon:'M13 10V3L4 14h7v7l9-11h-7z', color:'#6366f1', bg:'#eef2ff', border:'#c7d2fe', title:'Setup incluido', desc:'Te ayudamos a conectar Shopify y lanzar tu primera llamada.' },
              { icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V7m0 1v8m0 0v1', color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', title:'Sin compromiso', desc:'No hay contrato mínimo. Si no te convence, no pagas nada.' },
              { icon:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color:'#10b981', bg:'#f0fdf4', border:'#a7f3d0', title:'Equipo humano', desc:'Hablas con personas que conocen el eCommerce COD de verdad.' },
            ].map((t, i) => (
              <div key={i} className={`${isVis('trust') ? 'vu' : ''}`} style={{ background:'#fff', borderRadius:20, padding:'22px 20px', border:`1.5px solid ${t.border}`, transition:'transform .2s, box-shadow .2s', animationDelay:`${i * 0.1}s` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
              >
                <div style={{ width:40, height:40, borderRadius:12, background:t.bg, border:`1px solid ${t.border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon}/></svg>
                </div>
                <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 6px', letterSpacing:'-0.3px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{t.title}</p>
                <p style={{ fontSize:12, color:'#64748b', lineHeight:1.65, margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CALENDLY ══ */}
      <section id="cal" data-obs style={{ padding:'clamp(60px,8vw,96px) 24px', background:'#fff' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:36 }} className={isVis('cal') ? 'vu' : ''}>
            <span style={{ fontSize:11, fontWeight:700, color:'#2EC4B6', textTransform:'uppercase', letterSpacing:'0.08em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>Demo gratuita</span>
            <h2 style={{ fontSize:'clamp(26px,4vw,44px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1.5px', margin:'12px 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Reserva una llamada de 30 min
            </h2>
            <p style={{ fontSize:15, color:'#64748b', maxWidth:480, margin:'0 auto 24px', lineHeight:1.7, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Te mostramos el panel en vivo, analizamos tu caso y configuramos SAMGPLE juntos. Sin compromiso.
            </p>
            <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
              {['✓ Totalmente gratuito','✓ Sin compromiso','✓ Demo en vivo','✓ Configuración incluida'].map(b => (
                <span key={b} className="badge-pill">{b}</span>
              ))}
            </div>
          </div>

          <div className={isVis('cal') ? 'vu d2' : ''} style={{ background:'#fff', borderRadius:28, border:'1.5px solid #f1f5f9', overflow:'hidden', boxShadow:'0 8px 48px rgba(0,0,0,0.07)' }}>
            {/* Cabecera decorativa */}
            <div style={{ background:'linear-gradient(135deg,#f0fdf9,#eef2ff)', padding:'18px 28px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(46,196,182,.35)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Agenda tu demo · SAMGPLE</p>
                <p style={{ fontSize:12, color:'#64748b', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>30 min · Vídeo llamada · Sin coste</p>
              </div>
            </div>
            <iframe
              src="https://calendly.com/mluengog06/30min"
              width="100%"
              height="680"
              frameBorder="0"
              style={{ display:'block', border:'none' }}
              title="Reserva una llamada con SAMGPLE"
            />
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section id="cta" data-obs style={{ padding:'clamp(60px,8vw,96px) 24px', background:'linear-gradient(150deg,#080f24,#0c1a3e,#0d1330)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-100, left:'50%', transform:'translateX(-50%)', width:600, height:600, background:'radial-gradient(circle,rgba(46,196,182,0.1),transparent 65%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, right:-80, width:400, height:400, background:'radial-gradient(circle,rgba(99,102,241,0.08),transparent 65%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:560, margin:'0 auto', position:'relative' }} className={isVis('cta') ? 'vu' : ''}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.1)', border:'1px solid rgba(46,196,182,0.22)', borderRadius:20, padding:'5px 14px', marginBottom:24 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:'#2EC4B6', animation:'pulse 2s infinite', display:'inline-block' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:'0.07em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>SIN TARJETA · SIN PERMANENCIA</span>
          </div>
          <h2 style={{ fontSize:'clamp(26px,4.5vw,50px)', fontWeight:800, color:'#fff', letterSpacing:'-2px', margin:'0 0 16px', lineHeight:1.1, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            ¿Prefieres empezar solo?<br />
            <span style={{ color:'#2EC4B6' }}>En 10 min estás listo.</span>
          </h2>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.45)', margin:'0 0 36px', lineHeight:1.7, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            Crea tu cuenta gratis, conecta Shopify y empieza a confirmar pedidos hoy mismo.
          </p>
          <div className="cta-btns" style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/registro" className="cta-btn">
              Crear cuenta gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/precios" className="cta-ghost">Ver precios</Link>
          </div>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)', marginTop:20, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Tokens de bienvenida incluidos · Cancela cuando quieras</p>
        </div>
      </section>
    </div>
  )
}