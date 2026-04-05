'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
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
      transform: inView ? 'translateY(0)' : 'translateY(22px)',
      transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const plans = [
  {
    name: 'Starter',
    price: 25,
    tokens: 25,
    perToken: '1.00',
    featured: false,
    badge: null,
    desc: 'Perfecto para empezar y validar el sistema con tus primeros pedidos COD.',
    accent: '#5da7ec',
    accentLight: '#eff6ff',
    accentBorder: '#bfdbfe',
    features: [
      { text: '25 tokens incluidos', highlight: false },
      { text: 'Análisis IA por pedido', highlight: false },
      { text: 'Llamadas VAPI automáticas', highlight: false },
      { text: 'Mensajes WhatsApp IA', highlight: false },
      { text: 'Dashboard en tiempo real', highlight: false },
      { text: 'Soporte por chat', highlight: false },
    ],
  },
  {
    name: 'Pro',
    price: 45,
    tokens: 50,
    perToken: '0.90',
    featured: true,
    badge: 'Más popular',
    desc: 'El preferido por tiendas con volumen medio-alto y equipos en crecimiento.',
    accent: '#5da7ec',
    accentLight: '#eff6ff',
    accentBorder: '#bfdbfe',
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
    name: 'Business',
    price: 100,
    tokens: 115,
    perToken: '0.87',
    featured: false,
    badge: 'Mejor precio/token',
    desc: 'Para operaciones grandes con múltiples tiendas y alto volumen de pedidos.',
    accent: '#0f766e',
    accentLight: '#f0fdf4',
    accentBorder: '#bbf7d0',
    features: [
      { text: '115 tokens incluidos', highlight: true },
      { text: 'Todo lo de Pro', highlight: false },
      { text: 'Múltiples tiendas Shopify', highlight: false },
      { text: 'Acceso a API', highlight: false },
      { text: 'Onboarding personalizado', highlight: false },
      { text: 'Account manager dedicado', highlight: false },
    ],
  },
]

const tokenCosts = [
  { action: 'Análisis IA de pedido', cost: '0.17', desc: 'Una vez por pedido al llegar', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff' },
  { action: 'Llamada exitosa / min', cost: '0.22', desc: 'Proporcional a la duración', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  { action: 'Llamada fallida / no contesta', cost: '0.05', desc: 'Coste mínimo por intento', icon: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', color: '#ea580c', bg: '#fff7ed', border: '#fed7aa' },
  { action: 'Mensaje WhatsApp IA', cost: '0.004', desc: 'Generado y enviado por IA', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { action: 'Informe semanal IA', cost: '0.5', desc: 'Análisis completo a tu email', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6', color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8' },
  { action: 'Reanálisis manual', cost: '0.01', desc: 'Actualiza el score cuando quieras', icon: 'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10 M3.51 15a9 9 0 0014.85 3.36L23 14', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
]

const faqs = [
  { q: '¿Los tokens caducan?', a: 'No. Tus tokens no tienen fecha de caducidad. Compra ahora y úsalos cuando quieras, sin ninguna presión ni urgencia.' },
  { q: '¿Cuántos pedidos gestiono con 50 tokens?', a: 'Con 50 tokens puedes analizar ~294 pedidos o realizar ~227 llamadas de 1 minuto. La mayoría de clientes Pro obtiene más de 200 confirmaciones.' },
  { q: '¿Puedo comprar más tokens en cualquier momento?', a: 'Sí. Recargas desde el panel en cualquier momento. También puedes canjear cupones que ofrecemos periódicamente.' },
  { q: '¿Qué pasa si me quedo sin tokens?', a: 'Te avisamos cuando el saldo es bajo. Las llamadas en curso se completan, pero no se inician nuevas hasta que recargues.' },
  { q: '¿Necesito cuenta de Twilio o VAPI?', a: 'Sí, pero son gratuitas de crear. Solo pagas los tokens de SAMGPLE. Te guiamos paso a paso en la configuración inicial.' },
  { q: '¿Hay permanencia o contrato?', a: 'No. SAMGPLE es completamente sin compromiso. Compras tokens cuando los necesitas y paras cuando quieras. Sin letra pequeña.' },
]

const guarantees = [
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Sin permanencia', desc: 'Para cuando quieras', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  { icon: 'M18 8h1a4 4 0 010 8h-1 M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3 M10 1v3 M14 1v3', title: 'Sin caducidad', desc: 'Tokens para siempre', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Activación inmediata', desc: 'Listo en 10 minutos', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { icon: 'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3', title: 'Paga por uso real', desc: 'Solo cuando SAMGPLE trabaja', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
]

/* ─────────────────────────────────────────
   FAQ ACCORDION ITEM
───────────────────────────────────────── */
function FaqItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div
      style={{
        borderRadius: 16,
        border: `1.5px solid ${open ? '#bfdbfe' : '#f1f5f9'}`,
        background: open ? '#f8fbff' : '#fff',
        overflow: 'hidden',
        transition: 'border-color 0.2s, background 0.2s',
        boxShadow: open ? '0 4px 20px rgba(93,167,236,0.08)' : '0 2px 8px rgba(0,0,0,0.03)',
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '18px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{q}</span>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: open ? '#5da7ec' : '#f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s, transform 0.3s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? '#fff' : '#64748b'} strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </button>

      <div style={{
        maxHeight: open ? 200 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ padding: '0 20px 18px' }}>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   BORDER BEAM (CSS animation)
   Simula el efecto "border-beam" de Magic UI
   con un gradiente que recorre el borde
───────────────────────────────────────── */
function BeamBorder({ color = '#5da7ec', children }: { color?: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', borderRadius: 26, padding: 2, background: `conic-gradient(from var(--beam-angle, 0deg), transparent 20%, ${color} 40%, transparent 60%)`, animation: 'beam-rotate 3s linear infinite' }}>
      <style>{`
        @property --beam-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
        @keyframes beam-rotate { to { --beam-angle: 360deg; } }
      `}</style>
      <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function PreciosPage() {
  const [pedidos, setPedidos] = useState(50)
  const [llamadas, setLlamadas] = useState(35)
  const [fallidas, setFallidas] = useState(8)

  const totalTkn = (pedidos * 0.17 + llamadas * 0.22 + fallidas * 0.05).toFixed(2)
  const monthlyTkn = (parseFloat(totalTkn) * 4)
  const suggestedPlan = monthlyTkn <= 25 ? plans[0] : monthlyTkn <= 50 ? plans[1] : plans[2]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; }

        @keyframes pr-pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes pr-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes pr-scroll  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pr-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pr-check-in {
          0%   { stroke-dashoffset: 20; opacity: 0; }
          60%  { opacity: 1; }
          100% { stroke-dashoffset: 0; }
        }

        .pr-check-icon {
          stroke-dasharray: 20;
          stroke-dashoffset: 20;
          animation: pr-check-in 0.4s 0.1s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        .pr-plan-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .pr-plan-card:hover { transform: translateY(-5px); box-shadow: 0 28px 64px rgba(0,0,0,0.12) !important; }

        .pr-cost-row { transition: background 0.12s; }
        .pr-cost-row:hover { background: #f8fafc !important; }

        .pr-guar-card { transition: all 0.15s ease; }
        .pr-guar-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07) !important; }

        .pr-cta-btn { transition: all 0.15s ease; }
        .pr-cta-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(93,167,236,0.38) !important; }
        .pr-cta-ghost { transition: all 0.15s ease; }
        .pr-cta-ghost:hover { background: rgba(255,255,255,0.06) !important; }

        .pr-plan-btn { transition: all 0.15s ease; }
        .pr-plan-btn:hover { opacity: 0.88; transform: translateY(-1px); }

        input[type=range] {
          -webkit-appearance: none;
          width: 100%; height: 4px; border-radius: 2px; outline: none; cursor: pointer;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: #5da7ec; cursor: pointer;
          box-shadow: 0 2px 8px rgba(93,167,236,0.4);
          border: 2px solid #fff;
        }
        input[type=range]::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: #5da7ec; cursor: pointer; border: 2px solid #fff;
        }

        /* RESPONSIVE */
        @media (max-width: 960px) {
          .pr-plans-grid { grid-template-columns: 1fr !important; max-width: 480px !important; margin: 0 auto !important; }
          .pr-guar-grid  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 680px) {
          .pr-guar-grid { grid-template-columns: 1fr 1fr !important; }
          .pr-faq-col   { columns: 1 !important; }
          .pr-hero-btns { flex-direction: column !important; align-items: center !important; }
        }
        @media (max-width: 440px) {
          .pr-guar-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(140deg,#050d1f 0%,#0c1e42 55%,#071428 100%)',
        padding: 'clamp(100px,12vw,148px) 20px clamp(64px,8vw,88px)',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position:'absolute',top:-120,left:'50%',transform:'translateX(-50%)',width:640,height:640,background:'radial-gradient(circle,rgba(93,167,236,0.12),transparent 70%)',pointerEvents:'none' }} />
        <div style={{ position:'absolute',bottom:-60,right:-60,width:320,height:320,background:'radial-gradient(circle,rgba(14,165,233,0.07),transparent 70%)',pointerEvents:'none' }} />

        <div style={{ maxWidth:640,margin:'0 auto',position:'relative' }}>
          <Reveal>
            <div style={{ display:'inline-flex',alignItems:'center',gap:7,background:'rgba(93,167,236,0.1)',border:'1px solid rgba(93,167,236,0.22)',borderRadius:100,padding:'5px 14px',marginBottom:22 }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#5da7ec',animation:'pr-pulse 2s infinite' }} />
              <span style={{ fontSize:11,fontWeight:700,color:'#5da7ec',letterSpacing:'0.07em' }}>SIN SUSCRIPCIÓN · SIN PERMANENCIA</span>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 style={{ fontSize:'clamp(32px,5.5vw,62px)',fontWeight:800,color:'#fff',letterSpacing:'-2.5px',margin:'0 0 20px',lineHeight:1.04 }}>
              Paga solo por lo que<br /><span style={{ color:'#5da7ec' }}>realmente usas</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p style={{ fontSize:'clamp(15px,1.8vw,17px)',color:'rgba(255,255,255,0.5)',lineHeight:1.75,margin:'0 0 36px',maxWidth:500,marginLeft:'auto',marginRight:'auto' }}>
              Sistema de tokens sin sorpresas. Compra una vez, usa cuando quieras. Sin mensualidades, sin contratos, sin letra pequeña.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="pr-hero-btns" style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap' }}>
              <Link href="/registro" className="pr-cta-btn"
                style={{ fontSize:14,fontWeight:700,padding:'13px 28px',borderRadius:13,background:'#5da7ec',color:'#fff',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:7,boxShadow:'0 4px 20px rgba(93,167,236,0.35)' }}>
                Crear cuenta gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/contacto" className="pr-cta-ghost"
                style={{ fontSize:14,fontWeight:600,padding:'13px 22px',borderRadius:13,border:'1.5px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.7)',textDecoration:'none' }}>
                Hablar con ventas
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GARANTÍAS ── */}
      <section style={{ background:'#f8fafc',borderBottom:'1px solid #f1f5f9',padding:'24px 20px' }}>
        <Reveal>
          <div className="pr-guar-grid" style={{ maxWidth:920,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10 }}>
            {guarantees.map((g, i) => (
              <div key={i} className="pr-guar-card" style={{ display:'flex',alignItems:'center',gap:11,padding:'14px 15px',background:'#fff',borderRadius:14,border:`1.5px solid ${g.border}`,boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ width:34,height:34,borderRadius:10,background:g.bg,border:`1px solid ${g.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={g.color} strokeWidth="2" strokeLinecap="round"><path d={g.icon}/></svg>
                </div>
                <div>
                  <p style={{ fontSize:12,fontWeight:700,color:'#0f172a',margin:'0 0 1px' }}>{g.title}</p>
                  <p style={{ fontSize:11,color:'#94a3b8',margin:0 }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── PLANES ── */}
      <section style={{ padding:'clamp(64px,8vw,104px) 20px',background:'#fff' }}>
        <div style={{ maxWidth:1040,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#5da7ec',textTransform:'uppercase',letterSpacing:'0.08em' }}>Packs de tokens</span>
              <h2 style={{ fontSize:'clamp(26px,4vw,46px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 12px',lineHeight:1.08 }}>
                Elige tu pack de inicio
              </h2>
              <p style={{ fontSize:15,color:'#64748b',maxWidth:420,margin:'0 auto',lineHeight:1.7 }}>Todos incluyen acceso completo. Sin funciones bloqueadas. Sin sorpresas.</p>
            </div>
          </Reveal>

          <div className="pr-plans-grid" style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,alignItems:'stretch' }}>
            {plans.map((plan, i) => {
              const inner = (
                <div
                  className={plan.featured ? '' : 'pr-plan-card'}
                  style={{
                    borderRadius: plan.featured ? 24 : 24,
                    padding: 'clamp(24px,3vw,32px)',
                    background: plan.featured ? '#0f172a' : '#fff',
                    border: plan.featured ? 'none' : '1.5px solid #e2e8f0',
                    position: 'relative', overflow: 'hidden',
                    boxShadow: plan.featured ? '0 24px 64px rgba(15,23,42,0.28)' : '0 2px 12px rgba(0,0,0,0.04)',
                    height: '100%',
                    display: 'flex', flexDirection: 'column',
                  }}
                >
                  {/* Top accent line */}
                  {!plan.featured && (
                    <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:plan.name==='Business'?'linear-gradient(90deg,#0f766e,#0d9488)':'#f1f5f9',borderRadius:'24px 24px 0 0' }} />
                  )}
                  {plan.featured && (
                    <div style={{ position:'absolute',top:0,left:0,right:0,height:3,background:'linear-gradient(90deg,#5da7ec,#2563eb)',borderRadius:'24px 24px 0 0' }} />
                  )}

                  {/* Glow orb */}
                  {plan.featured && (
                    <div style={{ position:'absolute',top:-60,right:-60,width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)',pointerEvents:'none' }} />
                  )}

                  {/* Badge */}
                  {plan.badge && (
                    <div style={{ position:'absolute',top:14,right:14,background:plan.featured?'#5da7ec':plan.name==='Business'?'#0f766e':'#64748b',color:'#fff',fontSize:9,fontWeight:800,padding:'3px 10px',borderRadius:100,textTransform:'uppercase',letterSpacing:'0.06em' }}>
                      {plan.badge}
                    </div>
                  )}

                  <p style={{ fontSize:10,fontWeight:700,color:plan.featured?'rgba(255,255,255,0.35)':'#94a3b8',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:16 }}>{plan.name}</p>

                  {/* Price */}
                  <div style={{ display:'flex',alignItems:'flex-end',gap:4,marginBottom:8 }}>
                    <span style={{ fontSize:'clamp(44px,5vw,56px)',fontWeight:800,color:plan.featured?'#fff':'#0f172a',letterSpacing:'-2.5px',lineHeight:1 }}>{plan.price}</span>
                    <span style={{ fontSize:18,fontWeight:700,color:plan.featured?'rgba(255,255,255,0.45)':'#64748b',marginBottom:8 }}>€</span>
                  </div>

                  {/* Token badge */}
                  <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
                    <span style={{ fontSize:12,fontWeight:700,color:'#5da7ec',background:plan.featured?'rgba(93,167,236,0.15)':'#eff6ff',padding:'3px 10px',borderRadius:100,border:plan.featured?'1px solid rgba(93,167,236,0.25)':'1px solid #bfdbfe' }}>
                      {plan.tokens} tokens
                    </span>
                    <span style={{ fontSize:11,color:plan.featured?'rgba(255,255,255,0.3)':'#94a3b8' }}>{plan.perToken}€/token</span>
                  </div>

                  <p style={{ fontSize:13,color:plan.featured?'rgba(255,255,255,0.4)':'#64748b',marginBottom:22,lineHeight:1.6 }}>{plan.desc}</p>

                  {/* Features */}
                  <div style={{ display:'flex',flexDirection:'column',gap:10,marginBottom:26,flex:1 }}>
                    {plan.features.map((feat, fi) => (
                      <div key={fi} style={{ display:'flex',alignItems:'center',gap:10 }}>
                        <div style={{ width:18,height:18,borderRadius:'50%',background:plan.featured?'rgba(93,167,236,0.18)':'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#5da7ec" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline className="pr-check-icon" points="20 6 9 17 4 12"/>
                          </svg>
                        </div>
                        <span style={{ fontSize:13,color:plan.featured?(feat.highlight?'#fff':'rgba(255,255,255,0.55)'):(feat.highlight?'#0f172a':'#475569'),fontWeight:feat.highlight?600:400 }}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button — mantiene tu lógica de href intacta */}
                  <Link
                    href="/registro"
                    className="pr-plan-btn"
                    style={{
                      display:'flex',alignItems:'center',justifyContent:'center',gap:7,
                      padding:'13px',borderRadius:14,
                      fontSize:13,fontWeight:700,textDecoration:'none',
                      background: plan.featured ? '#5da7ec' : plan.name==='Business' ? '#0f766e' : '#f8fafc',
                      color: plan.featured || plan.name==='Business' ? '#fff' : '#0f172a',
                      border: plan.featured || plan.name==='Business' ? 'none' : '1.5px solid #e2e8f0',
                      boxShadow: plan.featured ? '0 4px 20px rgba(93,167,236,0.4)' : plan.name==='Business' ? '0 4px 20px rgba(15,118,110,0.3)' : 'none',
                    }}
                  >
                    Empezar con {plan.name}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                </div>
              )

              return (
                <Reveal key={i} delay={i * 0.07}>
                  {plan.featured
                    ? <BeamBorder color="#5da7ec">{inner}</BeamBorder>
                    : inner
                  }
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={0.22}>
            <p style={{ textAlign:'center',fontSize:13,color:'#94a3b8',marginTop:24 }}>
              ¿Necesitas más volumen?{' '}
              <Link href="/contacto" style={{ color:'#5da7ec',fontWeight:600,textDecoration:'none' }}>
                Contáctanos para un plan personalizado →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CALCULADORA ── */}
      <section style={{ padding:'clamp(64px,8vw,100px) 20px',background:'#f8fafc' }}>
        <div style={{ maxWidth:760,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:44 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#5da7ec',textTransform:'uppercase',letterSpacing:'0.08em' }}>Calculadora</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,42px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 12px',lineHeight:1.08 }}>
                ¿Cuántos tokens necesitas?
              </h2>
              <p style={{ fontSize:15,color:'#64748b',maxWidth:400,margin:'0 auto',lineHeight:1.7 }}>
                Ajusta los sliders según tu volumen real y calcula al instante.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div style={{ background:'#fff',borderRadius:24,border:'1.5px solid #f1f5f9',padding:'clamp(22px,4vw,36px)',boxShadow:'0 4px 28px rgba(0,0,0,0.05)' }}>

              {[
                { label:'Pedidos COD / semana', val:pedidos, set:setPedidos, min:10, max:300, color:'#8b5cf6', cost:0.17 },
                { label:'Llamadas exitosas (1 min)',  val:llamadas, set:setLlamadas, min:0, max:200, color:'#0f766e', cost:0.22 },
                { label:'Llamadas fallidas / no contesta', val:fallidas, set:setFallidas, min:0, max:100, color:'#ea580c', cost:0.05 },
              ].map((s, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 28 : 0 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
                    <label style={{ fontSize:13,fontWeight:600,color:'#0f172a' }}>{s.label}</label>
                    <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                      <span style={{ fontSize:16,fontWeight:800,color:s.color }}>{s.val}</span>
                      <span style={{ fontSize:11,color:'#94a3b8',padding:'2px 8px',background:'#f8fafc',borderRadius:20,border:'1px solid #f1f5f9',whiteSpace:'nowrap' }}>
                        {(s.val * s.cost).toFixed(2)} tkn
                      </span>
                    </div>
                  </div>
                  <input
                    type="range" min={s.min} max={s.max} value={s.val}
                    onChange={e => s.set(Number(e.target.value))}
                    style={{ background:`linear-gradient(90deg,${s.color} ${((s.val-s.min)/(s.max-s.min))*100}%,#f1f5f9 ${((s.val-s.min)/(s.max-s.min))*100}%)` }}
                  />
                  <div style={{ display:'flex',justifyContent:'space-between',marginTop:4 }}>
                    <span style={{ fontSize:10,color:'#cbd5e1' }}>{s.min}</span>
                    <span style={{ fontSize:10,color:'#cbd5e1' }}>{s.max}</span>
                  </div>
                </div>
              ))}

              {/* Result */}
              <div style={{ background:'linear-gradient(135deg,#0f172a,#1e3a5f)',borderRadius:18,padding:'20px 24px',marginTop:28,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
                <div>
                  <p style={{ fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.35)',margin:'0 0 4px',textTransform:'uppercase',letterSpacing:'0.06em' }}>Consumo estimado / semana</p>
                  <p style={{ fontSize:13,color:'rgba(255,255,255,0.35)',margin:0 }}>{pedidos} análisis · {llamadas} llamadas · {fallidas} fallidas</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:30,fontWeight:800,color:'#5da7ec',margin:0,letterSpacing:'-1.5px' }}>{totalTkn} tkn</p>
                  <p style={{ fontSize:11,color:'rgba(255,255,255,0.25)',margin:'2px 0 0' }}>≈ {monthlyTkn.toFixed(0)} tkn / mes</p>
                </div>
              </div>

              {/* Plan suggestion */}
              <div style={{ marginTop:12,padding:'13px 16px',background:'#eff6ff',borderRadius:13,border:'1px solid #bfdbfe',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
                <p style={{ fontSize:13,color:'#1d4ed8',margin:0,fontWeight:600 }}>
                  💡 Con este volumen te recomendamos el pack <strong>{suggestedPlan.name}</strong> ({suggestedPlan.tokens} tokens)
                </p>
                <Link href="/registro" style={{ fontSize:12,fontWeight:700,color:'#5da7ec',textDecoration:'none',whiteSpace:'nowrap' }}>
                  Empezar →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── COSTE POR ACCIÓN ── */}
      <section style={{ padding:'clamp(64px,8vw,100px) 20px',background:'#fff' }}>
        <div style={{ maxWidth:780,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:44 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#5da7ec',textTransform:'uppercase',letterSpacing:'0.08em' }}>Transparencia total</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,42px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 12px',lineHeight:1.08 }}>
                ¿Cuánto cuesta cada acción?
              </h2>
              <p style={{ fontSize:15,color:'#64748b',maxWidth:400,margin:'0 auto',lineHeight:1.7 }}>
                Sin costes ocultos. Sabes exactamente cuánto gastas por cada operación.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div style={{ background:'#fff',borderRadius:24,border:'1.5px solid #f1f5f9',overflow:'hidden',boxShadow:'0 4px 28px rgba(0,0,0,0.04)' }}>
              {tokenCosts.map((item, i) => (
                <div
                  key={i}
                  className="pr-cost-row"
                  style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'clamp(13px,2vw,17px) clamp(16px,3vw,24px)',borderBottom:i<tokenCosts.length-1?'1px solid #f8fafc':'none',gap:14,cursor:'default' }}
                >
                  <div style={{ display:'flex',alignItems:'center',gap:12,minWidth:0 }}>
                    <div style={{ width:38,height:38,borderRadius:12,background:item.bg,border:`1px solid ${item.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:13,fontWeight:600,color:'#0f172a',margin:'0 0 2px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{item.action}</p>
                      <p style={{ fontSize:11,color:'#94a3b8',margin:0 }}>{item.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontSize:13,fontWeight:800,color:item.color,flexShrink:0,background:item.bg,border:`1px solid ${item.border}`,padding:'4px 13px',borderRadius:100,whiteSpace:'nowrap' }}>
                    {item.cost} tkn
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section style={{ padding:'clamp(64px,8vw,100px) 20px',background:'#f8fafc' }}>
        <div style={{ maxWidth:780,margin:'0 auto' }}>
          <Reveal>
            <div style={{ textAlign:'center',marginBottom:44 }}>
              <span style={{ fontSize:11,fontWeight:700,color:'#5da7ec',textTransform:'uppercase',letterSpacing:'0.08em' }}>FAQ</span>
              <h2 style={{ fontSize:'clamp(24px,4vw,42px)',fontWeight:800,color:'#0f172a',letterSpacing:'-2px',margin:'10px 0 0',lineHeight:1.08 }}>
                Preguntas frecuentes
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div style={{ display:'flex',flexDirection:'column',gap:8,marginBottom:36 }}>
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} defaultOpen={i===0} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontSize:14,color:'#64748b',marginBottom:16 }}>¿Tienes más dudas? Nuestro equipo responde en menos de 24h.</p>
              <Link href="/contacto" className="pr-cta-btn"
                style={{ fontSize:14,fontWeight:700,padding:'12px 26px',borderRadius:12,background:'#5da7ec',color:'#fff',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:7,boxShadow:'0 4px 14px rgba(93,167,236,0.3)' }}>
                Hablar con el equipo →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding:'clamp(64px,8vw,100px) 20px',background:'linear-gradient(140deg,#050d1f,#0c1e42,#071428)',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-80,left:'50%',transform:'translateX(-50%)',width:520,height:520,background:'radial-gradient(circle,rgba(93,167,236,0.1),transparent 70%)',pointerEvents:'none' }} />

        <Reveal>
          <div style={{ maxWidth:520,margin:'0 auto',position:'relative' }}>
            <div style={{
              width:52,height:52,borderRadius:16,
              background:'linear-gradient(135deg,#5da7ec,#2563eb)',
              display:'flex',alignItems:'center',justifyContent:'center',
              margin:'0 auto 24px',
              boxShadow:'0 8px 24px rgba(93,167,236,0.3)',
              animation:'pr-float 3s ease-in-out infinite',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>

            <h2 style={{ fontSize:'clamp(26px,4.5vw,48px)',fontWeight:800,color:'#fff',letterSpacing:'-2px',margin:'0 0 16px',lineHeight:1.08 }}>
              Empieza hoy sin riesgos
            </h2>
            <p style={{ fontSize:16,color:'rgba(255,255,255,0.45)',margin:'0 0 32px',lineHeight:1.7 }}>
              Crea tu cuenta gratis y recibe tokens de bienvenida para probar el sistema sin pagar nada.
            </p>

            <div style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:18 }}>
              <Link href="/registro" className="pr-cta-btn"
                style={{ fontSize:14,fontWeight:700,padding:'13px 30px',borderRadius:13,background:'#5da7ec',color:'#fff',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:8,boxShadow:'0 4px 24px rgba(93,167,236,0.35)' }}>
                Crear cuenta gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/metodologia" className="pr-cta-ghost"
                style={{ fontSize:14,fontWeight:600,padding:'13px 24px',borderRadius:13,border:'1.5px solid rgba(255,255,255,0.14)',color:'rgba(255,255,255,0.7)',textDecoration:'none' }}>
                Ver cómo funciona
              </Link>
            </div>

            <p style={{ fontSize:12,color:'rgba(255,255,255,0.2)' }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Sin permanencia</p>
          </div>
        </Reveal>
      </section>
    </>
  )
}