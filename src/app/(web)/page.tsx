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

function TypewriterText() {
  const WORDS = ['devoluciones', 'pedidos perdidos', 'clientes fantasma', 'COD sin confirmar', 'envíos fallidos']
  const [display, setDisplay] = useState('')
  const [wi, setWi] = useState(0)
  const [ci, setCi] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const word = WORDS[wi]
    const t = setTimeout(() => {
      if (!del) {
        setDisplay(word.slice(0, ci + 1))
        setCi(c => c + 1)
        if (ci + 1 === word.length) setTimeout(() => setDel(true), 1800)
      } else {
        setDisplay(word.slice(0, ci - 1))
        setCi(c => c - 1)
        if (ci - 1 === 0) { setDel(false); setWi(i => (i + 1) % WORDS.length) }
      }
    }, del ? 45 : 75)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ci, del, wi])
  return (
    <span style={{ color: '#6366f1' }}>
      {display}
      <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#6366f1', borderRadius: 2, marginLeft: 2, verticalAlign: 'middle', animation: 'sp-blink .8s infinite' }} />
    </span>
  )
}

const STEPS = [
  { n: '01', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', title: 'Pedido entra desde Shopify', desc: 'En cuanto tu cliente hace un pedido COD, aparece en tu panel en segundos. Sin pasos manuales, sin integraciones complejas.', color: '#6366f1' },
  { n: '02', icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v10m0 0h10M9 13H5m0 0a2 2 0 01-2-2V9m2 4v4a2 2 0 002 2h2m0 0h4m-6 0a2 2 0 002 2h2m4-4v4a2 2 0 01-2 2h-2m0 0H9', title: 'IA calcula el riesgo', desc: 'Nuestro motor analiza más de 15 señales: historial del cliente, zona geográfica, importe, comportamiento y más. Score 0-100 instantáneo.', color: '#8b5cf6' },
  { n: '03', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Tu cliente solicita llamada', desc: 'Desde su panel, el cliente pulsa "Solicitar llamada" cuando necesita confirmar. Sin spam, sin llamadas automáticas que molestan.', color: '#06b6d4' },
  { n: '04', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', title: 'Tu operador llama y confirma', desc: 'Recibes la solicitud en el panel de admin, la asignas a un operador, este llama y registra el resultado. El cliente lo ve al instante.', color: '#10b981' },
]

const PRICES = [
  { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Análisis IA por pedido', cost: '0.17', unit: 'tkn', desc: 'Score de riesgo con 15+ señales. Se cobra una vez al entrar el pedido.', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Primera llamada', cost: '0.50', unit: 'tkn', desc: 'El operador llama al cliente para confirmar o gestionar el pedido.', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', label: 'Rellamada', cost: '0.25', unit: 'tkn', desc: 'Si el cliente no contestó, puedes solicitar una segunda llamada a mitad de precio.', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', label: 'Informe semanal', cost: 'Gratis', unit: '', desc: 'Resumen IA de tu negocio enviado a tu email cada semana. Sin coste extra.', color: '#059669', bg: '#f0fdf4', border: '#a7f3d0' },
]

const FAQS = [
  { q: '¿Necesito conocimientos técnicos para conectar Shopify?', a: 'No. Te guiamos paso a paso. En menos de 10 minutos tienes el webhook configurado y los pedidos entrando en tiempo real.' },
  { q: '¿Los tokens caducan?', a: 'No. Tus tokens no tienen fecha de caducidad. Compra cuando quieras y úsalos a tu ritmo.' },
  { q: '¿Qué pasa si me quedo sin tokens?', a: 'Te avisamos cuando el saldo es bajo. Puedes recargar desde el panel en cualquier momento. Las solicitudes en curso se completan.' },
  { q: '¿Puedo gestionar varios operadores?', a: 'Sí. Desde el panel de admin puedes crear operadores, asignarles llamadas y ver el historial de cada uno.' },
  { q: '¿El cliente ve el resultado de la llamada?', a: 'Sí. En tiempo real. En cuanto el operador registra el resultado, el estado del pedido se actualiza en el panel del cliente automáticamente.' },
  { q: '¿Hay permanencia o contrato?', a: 'No. SAMGPLE es sin compromiso. Compras tokens cuando los necesitas y paras cuando quieras.' },
]

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(i === 0)
  return (
    <div style={{ borderRadius: 16, border: `1.5px solid ${open ? '#c7d2fe' : '#f1f5f9'}`, background: open ? '#fafbff' : '#fff', overflow: 'hidden', transition: 'all 0.2s', marginBottom: 8 }}>
      <button onClick={() => setOpen(v => !v)} style={{ width: '100%', textAlign: 'left', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', lineHeight: 1.4 }}>{q}</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: open ? '#6366f1' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s', transform: open ? 'rotate(45deg)' : 'rotate(0)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? '#fff' : '#64748b'} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </div>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '0 20px 18px' }}>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: 0 }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #fff; color: #0f172a; overflow-x: hidden; line-height: 1.6; }

        @keyframes sp-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes sp-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes sp-pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes sp-scroll   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes sp-spin     { to{transform:rotate(360deg)} }
        @keyframes sp-fadein   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes sp-scalein  { from{opacity:0;transform:scale(0.94)} to{opacity:1;transform:scale(1)} }
        @keyframes sp-gradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

        .sp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          background-size: 200% 200%;
          color: #fff; font-size: 15px; font-weight: 700;
          text-decoration: none; border: none; cursor: pointer;
          font-family: inherit;
          box-shadow: 0 4px 24px rgba(99,102,241,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: sp-fadein 0.5s ease both;
          white-space: nowrap;
        }
        .sp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.45); }
        .sp-btn-primary:active { transform: scale(0.97); }

        .sp-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 24px; border-radius: 14px;
          background: transparent; color: #0f172a;
          font-size: 15px; font-weight: 600;
          text-decoration: none; border: 1.5px solid #e2e8f0;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s; white-space: nowrap;
        }
        .sp-btn-ghost:hover { background: #f8fafc; border-color: #cbd5e1; transform: translateY(-1px); }

        .sp-card {
          background: #fff; border: 1.5px solid #f1f5f9;
          border-radius: 24px; padding: 28px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .sp-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.08); }

        .sp-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: #6366f1;
          padding: 5px 12px; border-radius: 100px;
          background: #eef2ff; border: 1px solid #c7d2fe;
          margin-bottom: 14px;
        }

        .sp-h1 { font-size: clamp(38px,5.5vw,72px); font-weight: 900; line-height: 1.02; letter-spacing: -3px; color: #0f172a; }
        .sp-h2 { font-size: clamp(28px,4vw,52px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; color: #0f172a; }
        .sp-sub { font-size: clamp(15px,1.8vw,18px); color: #64748b; line-height: 1.75; max-width: 520px; }

        .sp-section { padding: clamp(72px,9vw,120px) clamp(20px,5vw,40px); }
        .sp-max { max-width: 1100px; margin: 0 auto; }
        .sp-max-sm { max-width: 780px; margin: 0 auto; }
        .sp-center { text-align: center; }
        .sp-center .sp-sub { margin: 0 auto; }

        .sp-step-num { font-size: 72px; font-weight: 900; letter-spacing: -4px; line-height: 1; color: #f1f5f9; margin-bottom: 16px; }

        .sp-price-card {
          background: #fff; border: 2px solid #f1f5f9;
          border-radius: 24px; padding: 28px 24px;
          transition: all 0.2s;
          position: relative; overflow: hidden;
        }
        .sp-price-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(0,0,0,0.1); border-color: #e0e7ff; }

        .sp-ticker { overflow: hidden; border-top: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; background: #fafbff; padding: 18px 0; }
        .sp-ticker-track { display: flex; animation: sp-scroll 28s linear infinite; width: max-content; }
        .sp-ticker-track span { font-size: 14px; font-weight: 700; color: #cbd5e1; letter-spacing: -0.3px; padding: 0 40px; white-space: nowrap; }

        .sp-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #eef2ff, #faf5ff);
          border: 1px solid #c7d2fe; border-radius: 100px;
          padding: 6px 16px 6px 8px;
          font-size: 12px; font-weight: 600; color: #4f46e5;
          margin-bottom: 28px;
          animation: sp-fadein 0.4s ease both;
        }
        .sp-hero-dot { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg,#6366f1,#8b5cf6); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

        .sp-dash { background: #0a0a12; border-radius: 20px; overflow: hidden; box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.4); }
        .sp-dash-bar { background: #111118; padding: 12px 16px; display: flex; align-items: center; gap: 7px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .sp-dash-dot { width: 9px; height: 9px; border-radius: 50%; }
        .sp-dash-body { padding: 14px; }
        .sp-dash-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .sp-dash-row:last-child { border-bottom: none; }

        .sp-float {
          position: absolute; background: #fff; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          padding: 12px 16px; display: flex; align-items: center; gap: 10px;
          pointer-events: none;
        }

        .sp-compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; max-width: 820px; margin: 0 auto; }
        .sp-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
        .sp-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .sp-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .sp-stat-box { background: linear-gradient(135deg,#1e1b4b,#312e81); border-radius: 20px; padding: 28px; text-align: center; }

        .sp-cta-section { background: linear-gradient(135deg,#0c0a1e 0%,#1a1040 50%,#0c0a1e 100%); position: relative; overflow: hidden; padding: clamp(80px,10vw,120px) clamp(20px,5vw,40px); text-align: center; }

        @media(max-width:1024px) { .sp-grid-4 { grid-template-columns: 1fr 1fr; } .sp-grid-3 { grid-template-columns: 1fr 1fr; } }
        @media(max-width:768px) { .sp-hero-grid { grid-template-columns: 1fr !important; } .sp-dash-hero { display: none !important; } .sp-compare-grid { grid-template-columns: 1fr; } .sp-grid-2 { grid-template-columns: 1fr; } }
        @media(max-width:640px) { .sp-ctas { flex-direction: column; align-items: stretch; } .sp-btn-primary, .sp-btn-ghost { justify-content: center; } .sp-grid-3 { grid-template-columns: 1fr; } .sp-grid-4 { grid-template-columns: 1fr; } }
      `}</style>

      {/* ── HERO ── */}
      <section className="sp-section" style={{ paddingTop: 'clamp(120px,14vw,160px)', paddingBottom: 'clamp(72px,8vw,100px)', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px)', backgroundSize: '48px 48px', WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 20%, black 40%, transparent 100%)' }} />
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, background: 'radial-gradient(ellipse,rgba(99,102,241,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div className="sp-max" style={{ position: 'relative' }}>
          <div className="sp-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(48px,6vw,80px)', alignItems: 'center' }}>
            {/* Left */}
            <div>
              <div className="sp-hero-badge">
                <div className="sp-hero-dot">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                Más de 120 tiendas reduciendo devoluciones COD
              </div>

              <h1 className="sp-h1" style={{ marginBottom: 24, animation: 'sp-fadein 0.5s 0.1s ease both' }}>
                Deja de perder<br />dinero en<br /><TypewriterText />
              </h1>

              <p className="sp-sub" style={{ marginBottom: 36, animation: 'sp-fadein 0.5s 0.2s ease both' }}>
                SAMGPLE analiza cada pedido COD con inteligencia artificial y gestiona el proceso de confirmación con operadores reales.{' '}
                <strong style={{ color: '#0f172a' }}>Reduce devoluciones hasta un 42%.</strong>
              </p>

              <div className="sp-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40, animation: 'sp-fadein 0.5s 0.25s ease both' }}>
                <Link href="/registro" className="sp-btn-primary">
                  Empezar gratis
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <a href="#como-funciona" className="sp-btn-ghost">
                  Ver cómo funciona
                </a>
              </div>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, animation: 'sp-fadein 0.5s 0.3s ease both' }}>
                <div style={{ display: 'flex' }}>
                  {['#6366f1','#8b5cf6','#06b6d4','#10b981'].map((c,i) => (
                    <div key={i} style={{ width: 32, height: 32, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i === 0 ? 0 : -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                      {['A','M','C','D'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    {[1,2,3,4,5].map(s => <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}><strong style={{ color: '#0f172a' }}>4.9/5</strong> · +120 tiendas activas</p>
                </div>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="sp-dash-hero" style={{ position: 'relative', animation: 'sp-fadein 0.6s 0.15s ease both' }}>
              {/* Float 1 */}
              <div className="sp-float" style={{ top: -20, right: -10, animation: 'sp-float 3s ease-in-out infinite' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>Pedido confirmado</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>hace 2 minutos</p>
                </div>
              </div>
              {/* Float 2 */}
              <div className="sp-float" style={{ bottom: 20, left: -20, animation: 'sp-float 3s 1.5s ease-in-out infinite' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>Score: 28 · Bajo riesgo</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Pedido #1052 analizado</p>
                </div>
              </div>

              <div className="sp-dash">
                <div className="sp-dash-bar">
                  {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} className="sp-dash-dot" style={{ background: c }} />)}
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '3px 12px' }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>app.samgple.com</span>
                    </div>
                  </div>
                </div>
                <div className="sp-dash-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[
                      { l: 'Ingresos hoy', v: '4.892€', c: '#22c55e' },
                      { l: 'Confirmados', v: '87%', c: '#818cf8' },
                      { l: 'Pendientes', v: '12', c: '#fbbf24' },
                      { l: 'Score medio', v: '31', c: '#34d399' },
                    ].map(m => (
                      <div key={m.l} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '11px 13px' }}>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px' }}>{m.l}</p>
                        <p style={{ fontSize: 22, fontWeight: 800, color: m.c, margin: 0, letterSpacing: '-1px' }}>{m.v}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Últimos pedidos</p>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 12, overflow: 'hidden' }}>
                    {[
                      { n: 'María G.', a: '44.99€', s: 'Confirmado', bc: 'rgba(52,211,153,0.15)', tc: '#34d399' },
                      { n: 'Carlos R.', a: '89.50€', s: 'Llamada pend.', bc: 'rgba(129,140,248,0.15)', tc: '#818cf8' },
                      { n: 'Ana M.', a: '32.00€', s: 'Analizando', bc: 'rgba(251,191,36,0.15)', tc: '#fbbf24' },
                    ].map((o, i) => (
                      <div key={i} className="sp-dash-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 24, height: 24, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>{o.n.charAt(0)}</div>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{o.n}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{o.a}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: o.bc, color: o.tc }}>{o.s}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="sp-ticker">
        <div className="sp-ticker-track">
          {[...Array(2)].map((_, gi) =>
            ['TiendaRopa.es','BeautyDrop','ShopXpress','ModaFast','ElectroShop','NutriStore','PetZone','HomeStyle','FashionBox','Cosmética Pro','DeporteYa','KidsWear'].map((l,i) => (
              <span key={`${gi}-${i}`}>{l}</span>
            ))
          )}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{ background: '#0f172a', padding: 'clamp(48px,6vw,72px) clamp(20px,5vw,40px)' }}>
        <div className="sp-max">
          <div className="sp-grid-4">
            {[
              { v: '-42%', l: 'Reducción devoluciones', c: '#818cf8' },
              { v: '87%', l: 'Tasa de confirmación', c: '#34d399' },
              { v: '+120', l: 'Tiendas activas', c: '#60a5fa' },
              { v: '<4min', l: 'Por confirmación media', c: '#fbbf24' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div style={{ textAlign: 'center', padding: 'clamp(20px,3vw,32px) 16px' }}>
                  <p style={{ fontSize: 'clamp(36px,4.5vw,54px)', fontWeight: 900, color: s.c, margin: '0 0 8px', letterSpacing: '-2px', lineHeight: 1 }}>{s.v}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', margin: 0 }}>{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="sp-section" id="como-funciona" style={{ background: '#fafbff' }}>
        <div className="sp-max">
          <div className="sp-center" style={{ marginBottom: 'clamp(48px,6vw,72px)' }}>
            <Reveal>
              <div className="sp-tag">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', animation: 'sp-pulse 2s infinite' }} />
                Proceso
              </div>
              <h2 className="sp-h2" style={{ marginBottom: 16 }}>4 pasos, 0 complicaciones</h2>
              <p className="sp-sub">Desde que llega el pedido hasta que está confirmado, SAMGPLE lo gestiona todo con transparencia total para ti y para tu cliente.</p>
            </Reveal>
          </div>
          <div className="sp-grid-4">
            {STEPS.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="sp-card" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: '24px 24px 0 0' }} />
                  <div className="sp-step-num">{s.n}</div>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: `${s.color}15`, border: `1.5px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"><path d={s.icon}/></svg>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANTES / DESPUÉS ── */}
      <section className="sp-section" style={{ background: '#fff' }}>
        <div className="sp-max">
          <div className="sp-center" style={{ marginBottom: 'clamp(48px,6vw,64px)' }}>
            <Reveal>
              <div className="sp-tag">Comparativa</div>
              <h2 className="sp-h2" style={{ marginBottom: 16 }}>La diferencia es brutal</h2>
              <p className="sp-sub">Compara cómo gestionas el COD hoy vs con SAMGPLE.</p>
            </Reveal>
          </div>
          <div className="sp-compare-grid">
            <Reveal delay={0.05}>
              <div style={{ background: '#fff8f8', border: '2px solid #fecaca', borderRadius: 24, padding: 'clamp(22px,3vw,32px)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fee2e2', color: '#b91c1c', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 24 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Sin SAMGPLE
                </div>
                {['Confirmación manual por agentes', '25-45% de devoluciones de media', '3-8€ de coste por confirmación', 'Sin análisis de riesgo previo', 'Solo en horario laboral'].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 4 ? 14 : 0 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 24, padding: 'clamp(22px,3vw,32px)' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#dcfce7', color: '#166534', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 100, marginBottom: 24 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Con SAMGPLE
                </div>
                {['Score IA en milisegundos al entrar el pedido', 'Reducción del 42% en devoluciones', 'Desde 0.17€ por análisis. Pay-per-use real', '15+ señales de riesgo antes de enviar', 'Panel 24/7 para cliente y operador'].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < 4 ? 14 : 0 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{t}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section className="sp-section" id="precios" style={{ background: '#fafbff' }}>
        <div className="sp-max">
          <div className="sp-center" style={{ marginBottom: 'clamp(48px,6vw,72px)' }}>
            <Reveal>
              <div className="sp-tag">Precios</div>
              <h2 className="sp-h2" style={{ marginBottom: 16 }}>Transparencia total.<br />Sin sorpresas.</h2>
              <p className="sp-sub">Pagas solo por lo que usas. Sin mensualidades, sin contratos, sin letra pequeña.</p>
            </Reveal>
          </div>
          <div className="sp-grid-4" style={{ marginBottom: 40 }}>
            {PRICES.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="sp-price-card">
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: p.color, borderRadius: '24px 24px 0 0' }} />
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: p.bg, border: `1.5px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2" strokeLinecap="round"><path d={p.icon}/></svg>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{p.label}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                    <span style={{ fontSize: p.cost === 'Gratis' ? 28 : 36, fontWeight: 900, color: p.color, letterSpacing: '-1.5px', lineHeight: 1 }}>{p.cost}</span>
                    {p.unit && <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{p.unit}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 24, padding: 'clamp(28px,4vw,40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>¿Cuántos tokens necesito?</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: 0 }}>50 pedidos/semana = ~8.5 tkn análisis + 25 tkn llamadas = ~33 tkn/semana</p>
              </div>
              <Link href="/precios" className="sp-btn-primary" style={{ animation: 'none' }}>
                Ver calculadora completa
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="sp-section" style={{ background: '#fff' }}>
        <div className="sp-max">
          <div className="sp-center" style={{ marginBottom: 'clamp(48px,6vw,72px)' }}>
            <Reveal>
              <div className="sp-tag">Testimonios</div>
              <h2 className="sp-h2" style={{ marginBottom: 16 }}>Resultados reales</h2>
              <p className="sp-sub">Lo que dicen los fundadores que ya dejaron de perder dinero en COD.</p>
            </Reveal>
          </div>
          <div className="sp-grid-3">
            {[
              { name: 'Alejandro M.', role: 'CEO · TiendaRopa.es', text: 'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato.', color: '#6366f1' },
              { name: 'Carmen R.', role: 'Fundadora · BeautyDrop', text: 'El panel es clarísimo. Mis operadores saben exactamente a quién llamar y por qué. Las confirmaciones subieron un 30%.', color: '#8b5cf6' },
              { name: 'David F.', role: 'Director Ops · ShopXpress', text: 'Conectamos Shopify en 10 minutos. Los pedidos empezaron a analizarse solos esa misma tarde. Brutal.', color: '#06b6d4' },
            ].map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="sp-card" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 16, right: 18, fontSize: 56, fontWeight: 900, color: 'rgba(0,0,0,0.04)', lineHeight: 1, fontFamily: 'Georgia,serif' }}>&ldquo;</div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                    {[1,2,3,4,5].map(s => <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                  </div>
                  <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 22 }}>&ldquo;{t.text}&rdquo;</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,${t.color},${t.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{t.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sp-section" style={{ background: '#fafbff' }}>
        <div className="sp-max-sm">
          <div className="sp-center" style={{ marginBottom: 'clamp(40px,5vw,60px)' }}>
            <Reveal>
              <div className="sp-tag">FAQ</div>
              <h2 className="sp-h2">Preguntas frecuentes</h2>
            </Reveal>
          </div>
          <Reveal delay={0.06}>
            <div>
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} i={i} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="sp-cta-section">
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse,rgba(99,102,241,.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: '20%', width: 400, height: 300, background: 'radial-gradient(ellipse,rgba(139,92,246,.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div className="sp-max-sm" style={{ position: 'relative' }}>
          <Reveal>
            <div className="sp-center">
              <div style={{ width: 60, height: 60, borderRadius: 20, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)', animation: 'sp-float 3s ease-in-out infinite' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(129,140,248,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>Empieza hoy</p>
              <h2 style={{ fontSize: 'clamp(32px,5.5vw,60px)', fontWeight: 900, color: '#fff', letterSpacing: '-2.5px', lineHeight: 1.03, marginBottom: 20 }}>
                Confirma pedidos COD<br /><span style={{ color: '#818cf8' }}>con IA desde hoy</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 36, lineHeight: 1.75, maxWidth: 480, margin: '0 auto 36px' }}>
                Conecta Shopify en 10 minutos. Sin tarjeta de crédito. Sin suscripción mensual. Tokens de bienvenida incluidos.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
                <Link href="/registro" className="sp-btn-primary" style={{ fontSize: 16, padding: '16px 32px', animation: 'none' }}>
                  Crear cuenta gratis
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/precios" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 28px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
                  Ver precios →
                </Link>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Sin tarjeta de crédito · Tokens de prueba incluidos · Cancela cuando quieras</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}