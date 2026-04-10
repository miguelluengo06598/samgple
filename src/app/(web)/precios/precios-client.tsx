'use client'

import { useState, useEffect, useRef } from 'react'
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

// ── DATOS ──
const TOKEN_COSTS = [
  { action: 'Análisis IA de pedido', cost: '0.17', unit: 'tkn', desc: 'Una vez al entrar el pedido. Score 0-100 con 15+ señales.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { action: 'Primera llamada', cost: '0.50', unit: 'tkn', desc: 'El operador llama al cliente para confirmar el pedido.', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { action: 'Rellamada', cost: '0.25', unit: 'tkn', desc: 'Segunda llamada si el cliente no contestó. Mitad de precio.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { action: 'Informe semanal', cost: 'Gratis', unit: '', desc: 'Resumen IA de tu negocio enviado a tu email cada semana.', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#059669', bg: '#f0fdf4', border: '#a7f3d0' },
  { action: 'Reanálisis manual', cost: '0.02', unit: 'tkn', desc: 'Actualiza el score de riesgo en cualquier momento.', icon: 'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10 M3.51 15a9 9 0 0014.85 3.36L23 14', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
]

const GUARANTEES = [
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Sin permanencia', desc: 'Para cuando quieras', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Sin caducidad', desc: 'Tokens para siempre', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Activación inmediata', desc: 'Listo en 10 minutos', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  { icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', title: 'Pay-per-use real', desc: 'Solo pagas cuando se usa', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
]

const FAQS = [
  { q: '¿Los tokens caducan?', a: 'No. Tus tokens no tienen fecha de caducidad. Compra ahora y úsalos cuando quieras, sin ninguna presión ni urgencia.' },
  { q: '¿Cuántos pedidos gestiono con 50 tokens?', a: 'Con 50 tokens puedes analizar ~294 pedidos o realizar ~100 llamadas completas. La mayoría de clientes obtiene más de 200 confirmaciones.' },
  { q: '¿Puedo comprar más tokens en cualquier momento?', a: 'Sí. Recargas desde el panel en cualquier momento. También puedes canjear cupones que ofrecemos periódicamente.' },
  { q: '¿Qué pasa si me quedo sin tokens?', a: 'Te avisamos cuando el saldo es bajo. Las operaciones en curso se completan, pero no se inician nuevas hasta que recargues.' },
  { q: '¿El informe semanal es realmente gratis?', a: 'Sí, completamente. Cada semana recibes un análisis IA de tu negocio en tu email sin coste adicional.' },
  { q: '¿Hay permanencia o contrato?', a: 'No. SAMGPLE es completamente sin compromiso. Compras tokens cuando los necesitas y paras cuando quieras. Sin letra pequeña.' },
]

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0)
  return (
    <div style={{ borderRadius: 16, border: `1.5px solid ${open ? '#c7d2fe' : '#f1f5f9'}`, background: open ? '#fafbff' : '#fff', overflow: 'hidden', transition: 'all 0.2s', marginBottom: 8 }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: '100%', textAlign: 'left', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.4 }}>{q}</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: open ? '#6366f1' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? '#fff' : '#64748b'} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '0 20px 18px' }}>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, margin: 0 }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

function BeamBorder({ color = '#6366f1', children }: { color?: string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', borderRadius: 26, padding: 2, background: `conic-gradient(from var(--beam-angle, 0deg), transparent 20%, ${color} 40%, transparent 60%)`, animation: 'beam-rotate 3s linear infinite' }}>
      <style>{`@property --beam-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; } @keyframes beam-rotate { to { --beam-angle: 360deg; } }`}</style>
      <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative' }}>{children}</div>
    </div>
  )
}

interface Pack {
  id: string
  name: string
  tokens: number
  price_eur: number
  description?: string | null
  features?: string[] | null
  badge?: string | null
  color?: string | null
  lemon_url?: string | null
  variant_id?: string | null
  is_featured?: boolean
  sort_order?: number
}

const LEMON_URLS: Record<string, string> = {
  '1499065': 'https://samgple.lemonsqueezy.com/buy/1499065',
  '1499070': 'https://samgple.lemonsqueezy.com/buy/1499070',
  '1499072': 'https://samgple.lemonsqueezy.com/buy/1499072',
}

export default function PreciosClient({ packs }: { packs: Pack[] }) {
  const [pedidos, setPedidos]   = useState(50)
  const [llamadas, setLlamadas] = useState(35)
  const [fallidas, setFallidas] = useState(8)

  const totalTkn   = (pedidos * 0.17 + llamadas * 0.5 + fallidas * 0.25).toFixed(2)
  const monthlyTkn = parseFloat(totalTkn) * 4
  const suggestedPack = packs.find(p => p.tokens >= monthlyTkn) ?? packs[packs.length - 1]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #fff; color: #0f172a; overflow-x: hidden; }

        @keyframes sp-pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes sp-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes sp-fadein { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes sp-shimmer{ 0%{background-position:200% center} 100%{background-position:-200% center} }

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

        .sp-plan-card { transition:transform 0.2s,box-shadow 0.2s; }
        .sp-plan-card:hover { transform:translateY(-5px);box-shadow:0 28px 64px rgba(0,0,0,0.12) !important; }
        .sp-plan-btn { transition:all 0.15s ease; }
        .sp-plan-btn:hover { opacity:0.88;transform:translateY(-1px); }
        .sp-cost-row { transition:background 0.12s; }
        .sp-cost-row:hover { background:#f8fafc !important; }
        .sp-guar-card { transition:all 0.15s; }
        .sp-guar-card:hover { transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.07) !important; }

        input[type=range] { -webkit-appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#6366f1;cursor:pointer;box-shadow:0 2px 8px rgba(99,102,241,0.4);border:2px solid #fff; }

        .sp-check-icon { stroke-dasharray:20;stroke-dashoffset:20;animation:sp-check-in 0.4s 0.1s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes sp-check-in { 0%{stroke-dashoffset:20;opacity:0} 60%{opacity:1} 100%{stroke-dashoffset:0} }

        @media(max-width:960px) { .sp-plans-grid { grid-template-columns:1fr !important;max-width:480px !important;margin:0 auto !important; } .sp-guar-grid { grid-template-columns:1fr 1fr !important; } }
        @media(max-width:640px) { .sp-ctas { flex-direction:column;align-items:stretch; } .sp-btn-primary,.sp-btn-ghost { justify-content:center; } .sp-guar-grid { grid-template-columns:1fr 1fr !important; } }
        @media(max-width:400px) { .sp-guar-grid { grid-template-columns:1fr !important; } }
      `}</style>

      {/* ── HERO ── */}
      <section style={{ background:'#fff', paddingTop:'clamp(120px,14vw,160px)', paddingBottom:'clamp(72px,8vw,100px)', paddingLeft:'clamp(20px,5vw,40px)', paddingRight:'clamp(20px,5vw,40px)', position:'relative', overflow:'hidden', textAlign:'center' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)', backgroundSize:'48px 48px', WebkitMaskImage:'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)', maskImage:'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)' }} />
        <div style={{ position:'absolute', top:-200, left:'50%', transform:'translateX(-50%)', width:800, height:600, background:'radial-gradient(ellipse,rgba(99,102,241,.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div className="sp-max-sm" style={{ position:'relative' }}>
          <Reveal>
            <div className="sp-tag" style={{ animation:'sp-fadein 0.4s ease both' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#6366f1', animation:'sp-pulse 2s infinite' }} />
              Sin suscripción · Sin permanencia
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 style={{ fontSize:'clamp(36px,6vw,68px)', fontWeight:900, letterSpacing:'-3px', lineHeight:1.02, marginBottom:20, color:'#0f172a' }}>
              Paga solo por lo que<br /><span style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>realmente usas</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="sp-sub" style={{ maxWidth:480, margin:'0 auto 36px' }}>
              Sistema de tokens sin sorpresas. Compra una vez, usa cuando quieras. Sin mensualidades, sin contratos, sin letra pequeña.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="sp-ctas" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/registro" className="sp-btn-primary">
                Crear cuenta gratis
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/contacto" className="sp-btn-ghost">Hablar con ventas</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── GARANTÍAS ── */}
      <section style={{ background:'#f8fafc', borderTop:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9', padding:'24px clamp(20px,5vw,40px)' }}>
        <Reveal>
          <div className="sp-guar-grid" style={{ maxWidth:960, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {GUARANTEES.map((g,i) => (
              <div key={i} className="sp-guar-card" style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 15px', background:'#fff', borderRadius:14, border:`1.5px solid ${g.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.03)' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:g.bg, border:`1px solid ${g.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={g.color} strokeWidth="2" strokeLinecap="round"><path d={g.icon}/></svg>
                </div>
                <div>
                  <p style={{ fontSize:12, fontWeight:700, color:'#0f172a', margin:'0 0 1px' }}>{g.title}</p>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── PACKS DE TOKENS ── */}
      <section className="sp-section" style={{ background:'#fff' }}>
        <div className="sp-max">
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:52 }}>
              <div className="sp-tag">Packs de tokens</div>
              <h2 className="sp-h2" style={{ marginBottom:12 }}>Elige tu pack de inicio</h2>
              <p className="sp-sub" style={{ maxWidth:420, margin:'0 auto' }}>Todos incluyen acceso completo. Sin funciones bloqueadas. Sin sorpresas.</p>
            </div>
          </Reveal>

          {packs.length === 0 ? (
            <Reveal delay={0.08}>
              <div style={{ textAlign:'center', padding:'72px 24px', background:'#fafbff', borderRadius:24, border:'1.5px solid #e0e7ff' }}>
                <div style={{ width:56, height:56, borderRadius:18, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 8px 24px rgba(99,102,241,0.3)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p style={{ fontSize:18, fontWeight:800, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-0.5px' }}>Packs próximamente</p>
                <p style={{ fontSize:14, color:'#64748b', margin:'0 0 28px', lineHeight:1.7, maxWidth:360, marginLeft:'auto', marginRight:'auto' }}>Estamos configurando los packs de tokens. Mientras tanto, crea tu cuenta gratis y recibe tokens de bienvenida.</p>
                <Link href="/registro" className="sp-btn-primary" style={{ display:'inline-flex' }}>
                  Crear cuenta gratis
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            </Reveal>
          ) : (
            <>
              <div className="sp-plans-grid" style={{ display:'grid', gridTemplateColumns:`repeat(${packs.length},1fr)`, gap:16, alignItems:'stretch' }}>
                {packs.map((pack,i) => {
                  const color      = pack.color ?? '#6366f1'
                  const isFeatured = pack.is_featured
                  const features   = pack.features ?? []
                  const checkoutUrl = pack.lemon_url ?? (pack.variant_id ? LEMON_URLS[pack.variant_id] ?? '/registro' : '/registro')
                  const perToken   = pack.price_eur && pack.tokens ? (pack.price_eur / pack.tokens).toFixed(2) : '—'

                  const inner = (
                    <div
                      className={isFeatured ? '' : 'sp-plan-card'}
                      style={{
                        borderRadius:24, padding:'clamp(24px,3vw,32px)',
                        background: isFeatured ? '#0f172a' : '#fff',
                        border: isFeatured ? 'none' : '1.5px solid #e2e8f0',
                        position:'relative', overflow:'hidden',
                        boxShadow: isFeatured ? '0 24px 64px rgba(15,23,42,0.28)' : '0 2px 12px rgba(0,0,0,0.04)',
                        height:'100%', display:'flex', flexDirection:'column',
                      }}
                    >
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:'24px 24px 0 0' }} />
                      {isFeatured && <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle,${color}18,transparent 70%)`, pointerEvents:'none' }} />}

                      {pack.badge && (
                        <div style={{ position:'absolute', top:14, right:14, background:color, color:'#fff', fontSize:9, fontWeight:800, padding:'3px 10px', borderRadius:100, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                          {pack.badge}
                        </div>
                      )}

                      <p style={{ fontSize:10, fontWeight:700, color:isFeatured?'rgba(255,255,255,0.35)':'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:16 }}>{pack.name}</p>

                      <div style={{ display:'flex', alignItems:'flex-end', gap:4, marginBottom:8 }}>
                        <span style={{ fontSize:'clamp(44px,5vw,56px)', fontWeight:900, color:isFeatured?'#fff':'#0f172a', letterSpacing:'-2.5px', lineHeight:1 }}>{pack.price_eur}</span>
                        <span style={{ fontSize:18, fontWeight:700, color:isFeatured?'rgba(255,255,255,0.45)':'#64748b', marginBottom:8 }}>€</span>
                      </div>

                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                        <span style={{ fontSize:12, fontWeight:700, color, background:isFeatured?`${color}25`:'#f8fafc', padding:'3px 10px', borderRadius:100, border:`1px solid ${color}35` }}>
                          {pack.tokens} tokens
                        </span>
                        <span style={{ fontSize:11, color:isFeatured?'rgba(255,255,255,0.3)':'#94a3b8' }}>{perToken}€/token</span>
                      </div>

                      {pack.description && (
                        <p style={{ fontSize:13, color:isFeatured?'rgba(255,255,255,0.4)':'#64748b', marginBottom:22, lineHeight:1.6 }}>{pack.description}</p>
                      )}

                      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:26, flex:1 }}>
                        {features.map((feat,fi) => (
                          <div key={fi} style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:18, height:18, borderRadius:'50%', background:isFeatured?`${color}25`:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline className="sp-check-icon" points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                            <span style={{ fontSize:13, color:isFeatured?'rgba(255,255,255,0.65)':'#475569' }}>{feat}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href={checkoutUrl}
                        target={checkoutUrl.startsWith('http') ? '_blank' : undefined}
                        rel={checkoutUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="sp-plan-btn"
                        style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'13px', borderRadius:14, fontSize:13, fontWeight:700, textDecoration:'none', background:isFeatured?color:'#f8fafc', color:isFeatured?'#fff':'#0f172a', border:isFeatured?'none':'1.5px solid #e2e8f0', boxShadow:isFeatured?`0 4px 20px ${color}50`:'none' }}
                      >
                        Empezar con {pack.name}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </a>
                    </div>
                  )

                  return (
                    <Reveal key={pack.id} delay={i*0.07}>
                      {isFeatured ? <BeamBorder color={color}>{inner}</BeamBorder> : inner}
                    </Reveal>
                  )
                })}
              </div>
              <Reveal delay={0.22}>
                <p style={{ textAlign:'center', fontSize:13, color:'#94a3b8', marginTop:24 }}>
                  ¿Necesitas más volumen?{' '}
                  <Link href="/contacto" style={{ color:'#6366f1', fontWeight:600, textDecoration:'none' }}>Contáctanos para un plan personalizado →</Link>
                </p>
              </Reveal>
            </>
          )}
        </div>
      </section>

      {/* ── COSTE POR ACCIÓN ── */}
      <section className="sp-section" style={{ background:'#fafbff' }}>
        <div className="sp-max-sm">
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <div className="sp-tag">Transparencia total</div>
              <h2 className="sp-h2" style={{ marginBottom:12 }}>¿Cuánto cuesta cada acción?</h2>
              <p className="sp-sub" style={{ maxWidth:420, margin:'0 auto' }}>Sin costes ocultos. Sabes exactamente cuánto gastas por cada operación.</p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #f1f5f9', overflow:'hidden', boxShadow:'0 4px 28px rgba(0,0,0,0.04)' }}>
              {TOKEN_COSTS.map((item,i) => (
                <div key={i} className="sp-cost-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'clamp(13px,2vw,18px) clamp(16px,3vw,24px)', borderBottom:i<TOKEN_COSTS.length-1?'1px solid #f8fafc':'none', gap:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
                    <div style={{ width:40, height:40, borderRadius:13, background:item.bg, border:`1px solid ${item.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                    </div>
                    <div style={{ minWidth:0 }}>
                      <p style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.action}</p>
                      <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{item.desc}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                    <span style={{ fontSize:14, fontWeight:900, color:item.color, background:item.bg, border:`1px solid ${item.border}`, padding:'5px 14px', borderRadius:100, whiteSpace:'nowrap' }}>
                      {item.cost}{item.unit ? ` ${item.unit}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CALCULADORA ── */}
      <section className="sp-section" style={{ background:'#fff' }}>
        <div className="sp-max-sm">
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <div className="sp-tag">Calculadora</div>
              <h2 className="sp-h2" style={{ marginBottom:12 }}>¿Cuántos tokens necesitas?</h2>
              <p className="sp-sub" style={{ maxWidth:400, margin:'0 auto' }}>Ajusta los sliders según tu volumen real y calcula al instante.</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div style={{ background:'#fafbff', borderRadius:24, border:'1.5px solid #f1f5f9', padding:'clamp(24px,4vw,36px)', boxShadow:'0 4px 28px rgba(0,0,0,0.04)' }}>
              {[
                { label:'Pedidos COD / semana', val:pedidos, set:setPedidos, min:10, max:300, color:'#6366f1', cost:0.17, unit:'análisis' },
                { label:'Llamadas al cliente', val:llamadas, set:setLlamadas, min:0, max:200, color:'#0284c7', cost:0.50, unit:'primera llamada' },
                { label:'Rellamadas', val:fallidas, set:setFallidas, min:0, max:100, color:'#7c3aed', cost:0.25, unit:'rellamada' },
              ].map((s,i) => (
                <div key={i} style={{ marginBottom: i < 2 ? 28 : 0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <label style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{s.label}</label>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:16, fontWeight:900, color:s.color }}>{s.val}</span>
                      <span style={{ fontSize:11, color:'#94a3b8', padding:'2px 8px', background:'#fff', borderRadius:20, border:'1px solid #f1f5f9', whiteSpace:'nowrap' }}>{(s.val * s.cost).toFixed(2)} tkn</span>
                    </div>
                  </div>
                  <input type="range" min={s.min} max={s.max} value={s.val} onChange={e => s.set(Number(e.target.value))} style={{ background:`linear-gradient(90deg,${s.color} ${((s.val-s.min)/(s.max-s.min))*100}%,#e2e8f0 ${((s.val-s.min)/(s.max-s.min))*100}%)` }} />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
                    <span style={{ fontSize:10, color:'#cbd5e1' }}>{s.min}</span>
                    <span style={{ fontSize:10, color:'#cbd5e1' }}>{s.max}</span>
                  </div>
                </div>
              ))}

              <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius:18, padding:'20px 24px', marginTop:28, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
                <div>
                  <p style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.35)', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>Consumo estimado / semana</p>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', margin:0 }}>{pedidos} análisis · {llamadas} llamadas · {fallidas} rellamadas</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:32, fontWeight:900, color:'#818cf8', margin:0, letterSpacing:'-1.5px' }}>{totalTkn} tkn</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', margin:'2px 0 0' }}>≈ {monthlyTkn.toFixed(0)} tkn / mes</p>
                </div>
              </div>

              {suggestedPack && (
                <div style={{ marginTop:12, padding:'13px 16px', background:'#eef2ff', borderRadius:13, border:'1px solid #c7d2fe', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
                  <p style={{ fontSize:13, color:'#4338ca', margin:0, fontWeight:600 }}>
                    💡 Con este volumen te recomendamos <strong>{suggestedPack.name}</strong> ({suggestedPack.tokens} tokens)
                  </p>
                  <Link href="/registro" style={{ fontSize:12, fontWeight:700, color:'#6366f1', textDecoration:'none', whiteSpace:'nowrap' }}>Empezar →</Link>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sp-section" style={{ background:'#fafbff' }}>
        <div className="sp-max-sm">
          <Reveal>
            <div style={{ textAlign:'center', marginBottom:'clamp(40px,5vw,56px)' }}>
              <div className="sp-tag">FAQ</div>
              <h2 className="sp-h2">Preguntas frecuentes</h2>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div style={{ marginBottom:36 }}>
              {FAQS.map((f,i) => <FaqItem key={i} q={f.q} a={f.a} i={i} />)}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontSize:14, color:'#64748b', marginBottom:16 }}>¿Tienes más dudas? Nuestro equipo responde en menos de 24h.</p>
              <Link href="/contacto" className="sp-btn-primary" style={{ display:'inline-flex' }}>
                Hablar con el equipo →
              </Link>
            </div>
          </Reveal>
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
            <p style={{ fontSize:13, fontWeight:700, color:'rgba(129,140,248,0.8)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:18 }}>Empieza hoy</p>
            <h2 style={{ fontSize:'clamp(30px,5vw,56px)', fontWeight:900, color:'#fff', letterSpacing:'-2.5px', lineHeight:1.03, marginBottom:20 }}>
              Empieza hoy<br /><span style={{ color:'#818cf8' }}>sin riesgos</span>
            </h2>
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', marginBottom:36, lineHeight:1.75, maxWidth:440, margin:'0 auto 36px' }}>
              Crea tu cuenta gratis y recibe tokens de bienvenida para probar el sistema sin pagar nada.
            </p>
            <div className="sp-ctas" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
              <Link href="/registro" className="sp-btn-primary" style={{ fontSize:16, padding:'16px 32px' }}>
                Crear cuenta gratis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/metodologia" className="sp-btn-ghost" style={{ fontSize:16, padding:'16px 28px', borderColor:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)' }}>
                Ver cómo funciona →
              </Link>
            </div>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.2)' }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Sin permanencia</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}