'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

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

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(22px)',
        transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

function TypewriterText() {
  const WORDS = ['COD fallidos', 'devoluciones', 'pedidos sin confirmar', 'entregas perdidas', 'clientes fantasma']
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
    }, del ? 50 : 80)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ci, del, wi])

  return (
    <span style={{ color: '#2563eb' }}>
      {display}
      <span style={{
        display: 'inline-block', width: 3, height: '0.8em',
        background: '#2563eb', borderRadius: 2, marginLeft: 3,
        verticalAlign: 'middle', animation: 'samgple-blink .8s infinite',
      }} />
    </span>
  )
}

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0)
  const { ref, inView } = useInView(0.4)
  const animated = useRef(false)

  useEffect(() => {
    if (!inView || animated.current) return
    animated.current = true
    let step = 0
    const steps = 40
    const timer = setInterval(() => {
      step++
      setVal(Math.min(Math.round((target / steps) * step), target))
      if (step >= steps) clearInterval(timer)
    }, 1200 / steps)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{prefix}{val}{suffix}</span>
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function HomePage() {

  const steps = [
    { n: '01', title: 'Shopify envía el pedido', desc: 'Webhook instantáneo. El pedido aparece en tu panel en segundos sin ninguna acción manual.', color: '#2563eb' },
    { n: '02', title: 'IA analiza el riesgo', desc: 'Score 0–100 en milisegundos con 15+ señales de comportamiento, zona e historial.', color: '#7c3aed' },
    { n: '03', title: 'Llamada automática', desc: 'Tu asistente llama al cliente con tu nombre de empresa. Confirma, cancela o reagenda.', color: '#0f766e' },
    { n: '04', title: 'Estado actualizado solo', desc: 'El pedido se actualiza en tiempo real. Sin intervención humana, sin errores.', color: '#d97706' },
  ]

  const compareLeft = [
    'Confirmación manual por agentes de call center',
    '25–45% de devoluciones de media en el sector',
    '3–8€ de coste por confirmación manual',
    'Sin análisis de riesgo previo al envío',
    'Solo en horario laboral, sin cobertura nocturna',
  ]

  const compareRight = [
    'Confirmación automática con IA y voz natural',
    'Reducción del 42% en devoluciones desde el primer mes',
    'Desde 0.17€ por confirmación. Pay-per-use',
    'Score de riesgo con 15+ señales antes de cada envío',
    '24/7 automático, incluso los fines de semana',
  ]

  const testimonials = [
    { name: 'Alejandro M.', role: 'CEO · TiendaRopa.es', text: 'Antes perdíamos el 35% de pedidos COD. Con SAMGPLE bajamos al 12% en el primer mes. El ROI fue inmediato y brutal.', color: '#2563eb' },
    { name: 'Carmen R.', role: 'Fundadora · BeautyDrop', text: 'El asistente IA llama mejor que mis agentes humanos. Los clientes confirman más porque la llamada es rápida, natural y clara.', color: '#ec4899' },
    { name: 'David F.', role: 'Director Ops · ShopXpress', text: 'Conectamos Shopify en 10 minutos. Los pedidos empezaron a confirmarse solos esa misma tarde. No puedo imaginar volver atrás.', color: '#10b981' },
  ]

  const features = [
    { icon: '🛡️', bg: '#dbeafe', title: 'Motor de IA Risk Score', desc: 'Score 0–100 calculado en milisegundos usando 15+ señales: historial, zona geográfica, velocidad de checkout, dispositivo y más.', pill: '15+ señales en tiempo real', pillColor: '#2563eb' },
    { icon: '🎙️', bg: '#f3e8ff', title: 'Voz IA con tu marca', desc: 'El asistente llama con el nombre de tu empresa. Voz natural, conversación real. Los clientes no saben que es IA.', pill: '24/7 sin operadores', pillColor: '#7c3aed' },
    { icon: '⚡', bg: '#fef9c3', title: 'Shopify en 10 minutos', desc: 'Instala el webhook y empieza a confirmar pedidos esa misma tarde. Sin código. Sin agencias. Sin dolores de cabeza.', pill: 'Setup guiado paso a paso', pillColor: '#d97706' },
    { icon: '📊', bg: '#fff7ed', title: 'Analytics en tiempo real', desc: 'Dashboard con tasas de confirmación, devoluciones evitadas e ingresos recuperados. Mide el ROI al céntimo.', pill: 'ROI medido al instante', pillColor: '#d97706' },
    { icon: '💰', bg: '#f0fdf4', title: 'Sin suscripción fija', desc: 'Pagas solo por lo que usas. Desde 0.17€ por confirmación. Tokens de bienvenida incluidos al registrarte.', pill: 'Pay-per-use real', pillColor: '#10b981' },
    { icon: '🌍', bg: '#fff0f3', title: 'Multi-idioma y mercados', desc: 'Confirma pedidos en ES, PT, FR e IT. Adaptado para COD en mercados hispanohablantes y europeos.', pill: '4 idiomas disponibles', pillColor: '#ec4899' },
  ]

  const logos = ['TiendaRopa.es', 'BeautyDrop', 'ShopXpress', 'ModaFast', 'ElectroShop', 'NutriStore', 'PetZone', 'HomeStyle', 'FashionBox', 'CosméticaPro', 'DeporteYa', 'KidsWear']

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand: #2563eb;
          --brand-dark: #1d4ed8;
          --brand-light: #dbeafe;
          --accent: #0ea5e9;
          --success: #10b981;
          --ink: #0a0a0f;
          --ink2: #1e1e2e;
          --muted: #6b7280;
          --muted2: #9ca3af;
          --surface: #ffffff;
          --surface2: #f8fafc;
          --surface3: #f1f5f9;
          --border: rgba(0,0,0,0.07);
          --border2: rgba(0,0,0,0.12);
          --r: 14px;
          --rl: 20px;
          --rxl: 28px;
        }

        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        body { font-family: 'Geist', system-ui, -apple-system, sans-serif; background: var(--surface); color: var(--ink); overflow-x: hidden; line-height: 1.6; }

        @keyframes samgple-blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes samgple-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes samgple-pulse   { 0%,100%{box-shadow:0 0 0 3px rgba(37,99,235,0.15)} 50%{box-shadow:0 0 0 6px rgba(37,99,235,0.08)} }
        @keyframes samgple-scroll  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes samgple-fadeup  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes samgple-dotpulse{ 0%,100%{opacity:1} 50%{opacity:0.4} }

        .samgple-hero {
          padding: 130px 20px 90px; background: var(--surface);
          position: relative; overflow: hidden; min-height: 100vh;
          display: flex; align-items: center;
        }
        .samgple-hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(rgba(37,99,235,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,.04) 1px, transparent 1px);
          background-size: 50px 50px;
          -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%);
          mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%);
        }
        .samgple-hero-glow {
          position: absolute; top: -200px; left: 50%; transform: translateX(-50%);
          width: 900px; height: 600px;
          background: radial-gradient(ellipse, rgba(37,99,235,.08) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .samgple-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; width: 100%; }
        .samgple-hero-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(40px,5vw,72px); align-items: center;
        }
        .samgple-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--brand-light); border: 1px solid rgba(37,99,235,.25);
          border-radius: 100px; padding: 5px 14px 5px 8px;
          font-size: 12px; font-weight: 600; color: var(--brand-dark);
          margin-bottom: 26px; animation: samgple-fadeup .5s ease both;
        }
        .samgple-badge-dot {
          width: 20px; height: 20px; border-radius: 50%; background: var(--brand);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .samgple-h1 {
          font-size: clamp(36px,4.5vw,62px); font-weight: 800;
          line-height: 1.05; letter-spacing: -2.5px; color: var(--ink);
          margin-bottom: 20px; animation: samgple-fadeup .6s .1s ease both;
        }
        .samgple-hero-sub {
          font-size: clamp(15px,1.6vw,17px); color: var(--muted);
          line-height: 1.75; max-width: 480px; margin-bottom: 34px;
          animation: samgple-fadeup .6s .2s ease both;
        }
        .samgple-ctas {
          display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 38px;
          animation: samgple-fadeup .6s .25s ease both;
        }
        .samgple-btn-primary {
          font-size: 14px; font-weight: 700; padding: 13px 22px; border-radius: 11px;
          background: var(--ink); color: #fff; text-decoration: none; border: none;
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
          transition: all .15s;
          box-shadow: 0 1px 2px rgba(0,0,0,.2), 0 4px 12px rgba(0,0,0,.12);
          white-space: nowrap;
        }
        .samgple-btn-primary:hover { background: #1a1a2e; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,.18); }
        .samgple-btn-secondary {
          font-size: 14px; font-weight: 600; padding: 13px 20px; border-radius: 11px;
          background: transparent; color: var(--ink); text-decoration: none;
          border: 1.5px solid var(--border2);
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
          transition: all .15s; white-space: nowrap;
        }
        .samgple-btn-secondary:hover { background: var(--surface3); border-color: rgba(0,0,0,.2); }

        .samgple-sp { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; animation: samgple-fadeup .6s .3s ease both; }
        .samgple-av-stack { display: flex; }
        .samgple-av {
          width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff;
          margin-left: -8px; display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .samgple-av:first-child { margin-left: 0; }
        .samgple-stars { display: flex; gap: 2px; margin-bottom: 2px; }
        .samgple-sp-txt { font-size: 12px; color: var(--muted); }

        /* Dashboard */
        .samgple-dash-wrap { position: relative; }
        .samgple-dash {
          background: #0d0d14; border-radius: var(--rxl); overflow: hidden;
          box-shadow: 0 0 0 1px rgba(255,255,255,.06), 0 24px 80px rgba(0,0,0,.35);
          animation: samgple-fadeup .6s .15s ease both;
        }
        .samgple-dash-bar {
          background: #161622; padding: 12px 16px;
          display: flex; align-items: center; gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,.04);
        }
        .samgple-dash-dot { width: 9px; height: 9px; border-radius: 50%; }
        .samgple-dash-url {
          flex: 1; height: 18px; border-radius: 5px; background: rgba(255,255,255,.05);
          display: flex; align-items: center; justify-content: center;
          max-width: 180px; margin: 0 auto;
        }
        .samgple-dash-url span { font-size: 9px; color: rgba(255,255,255,.15); font-family: monospace; }
        .samgple-dash-body { padding: 14px; }
        .samgple-dash-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; }
        .samgple-dash-metric {
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.05);
          border-radius: 12px; padding: 11px;
        }
        .samgple-dm-label { font-size: 8px; color: rgba(255,255,255,.3); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }
        .samgple-dm-val { font-size: 20px; font-weight: 800; letter-spacing: -.8px; margin-bottom: 2px; }
        .samgple-dm-sub { font-size: 8px; color: rgba(255,255,255,.2); }
        .samgple-dash-orders-hdr { font-size: 8px; color: rgba(255,255,255,.2); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; padding: 0 2px; }
        .samgple-dash-orders { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.04); border-radius: 12px; overflow: hidden; }
        .samgple-dash-order {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,.03);
        }
        .samgple-dash-order:last-child { border-bottom: none; }
        .samgple-order-info { display: flex; align-items: center; gap: 8px; }
        .samgple-order-av {
          width: 22px; height: 22px; border-radius: 7px;
          background: rgba(255,255,255,.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 8px; font-weight: 800; color: rgba(255,255,255,.35);
        }
        .samgple-order-name { font-size: 10px; color: rgba(255,255,255,.45); }
        .samgple-order-right { display: flex; align-items: center; gap: 8px; }
        .samgple-order-amount { font-size: 10px; font-weight: 700; color: rgba(255,255,255,.5); }
        .samgple-order-badge { font-size: 8px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }

        /* Float badges */
        .samgple-float-badge {
          position: absolute; background: #fff; border-radius: 13px;
          border: 1px solid rgba(0,0,0,.07);
          box-shadow: 0 8px 30px rgba(0,0,0,.12);
          padding: 10px 13px; display: flex; align-items: center; gap: 9px;
        }
        .samgple-float-1 { top: -16px; right: -16px; animation: samgple-float 3s ease-in-out infinite; }
        .samgple-float-2 { bottom: 18px; left: -20px; animation: samgple-float 3s 1.5s ease-in-out infinite; }
        .samgple-fb-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .samgple-fb-title { font-size: 11px; font-weight: 700; color: var(--ink); }
        .samgple-fb-sub { font-size: 9px; color: var(--muted2); }

        /* Logos */
        .samgple-logos { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--surface2); padding: 22px 0; overflow: hidden; }
        .samgple-logos-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--muted2); text-align: center; margin-bottom: 16px; }
        .samgple-logos-track { display: flex; animation: samgple-scroll 26s linear infinite; width: max-content; }
        .samgple-logos-track span { font-size: 14px; font-weight: 700; color: #d1d5db; letter-spacing: -.3px; padding: 0 36px; white-space: nowrap; }

        /* Stats */
        .samgple-stats { background: var(--ink2); padding: clamp(40px,6vw,64px) 20px; }
        .samgple-stats-grid { max-width: 880px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: clamp(16px,3vw,32px); text-align: center; }
        .samgple-stat-num { font-size: clamp(32px,4vw,50px); font-weight: 800; letter-spacing: -2px; color: var(--accent); line-height: 1; }
        .samgple-stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: rgba(255,255,255,.3); margin-top: 6px; }

        /* Sections */
        .samgple-section { padding: clamp(64px,8vw,100px) 20px; }
        .samgple-section-hdr { text-align: center; margin-bottom: clamp(36px,5vw,56px); }
        .samgple-tag { display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--brand); margin-bottom: 13px; }
        .samgple-h2 { font-size: clamp(26px,4vw,46px); font-weight: 800; letter-spacing: -1.5px; color: var(--ink); line-height: 1.1; margin-bottom: 14px; }
        .samgple-sub { font-size: 16px; color: var(--muted); max-width: 500px; margin: 0 auto; line-height: 1.7; }

        /* Pain */
        .samgple-pain-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .samgple-pain-card {
          background: #fff8f8; border: 1.5px solid #fde8e8;
          border-radius: var(--rl); padding: 26px 22px; transition: all .2s;
        }
        .samgple-pain-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(239,68,68,.08); }
        .samgple-pain-icon { width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; font-size: 20px; }
        .samgple-pain-card h3 { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 8px; letter-spacing: -.3px; }
        .samgple-pain-card p { font-size: 13px; color: var(--muted); line-height: 1.6; }
        .samgple-pain-stat { margin-top: 14px; font-size: 24px; font-weight: 800; color: #ef4444; letter-spacing: -1px; }

        /* Steps */
        .samgple-steps-grid { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .samgple-step-card {
          background: #fff; border: 1.5px solid var(--border2); border-radius: var(--rl);
          padding: 22px 18px; position: relative; overflow: hidden; transition: all .2s;
          box-shadow: 0 2px 8px rgba(0,0,0,.03);
        }
        .samgple-step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,.08); }
        .samgple-step-bar { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
        .samgple-step-num { font-size: 46px; font-weight: 800; color: var(--surface3); letter-spacing: -3px; line-height: 1; margin-bottom: 12px; }
        .samgple-step-card h3 { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 7px; line-height: 1.3; }
        .samgple-step-card p { font-size: 12px; color: var(--muted); line-height: 1.6; }

        /* Features */
        .samgple-features-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .samgple-feat-card {
          background: var(--surface2); border: 1.5px solid var(--border);
          border-radius: var(--rxl); padding: 26px 24px; transition: all .2s; position: relative;
        }
        .samgple-feat-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,.07); }
        .samgple-feat-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; margin-bottom: 15px; }
        .samgple-feat-card h3 { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 8px; letter-spacing: -.3px; }
        .samgple-feat-card p { font-size: 13px; color: var(--muted); line-height: 1.65; }
        .samgple-feat-pill {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 100px;
          margin-top: 12px;
        }

        /* Compare */
        .samgple-compare-grid { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .samgple-compare-card { border-radius: var(--rxl); padding: 26px; }
        .samgple-compare-before { background: #fff5f5; border: 1.5px solid #fecaca; }
        .samgple-compare-after  { background: #f0fdf4; border: 1.5px solid #bbf7d0; }
        .samgple-compare-label { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 5px 13px; border-radius: 100px; margin-bottom: 20px; }
        .samgple-compare-before .samgple-compare-label { background: #fee2e2; color: #b91c1c; }
        .samgple-compare-after  .samgple-compare-label { background: #dcfce7; color: #166534; }
        .samgple-compare-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .samgple-compare-icon { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .samgple-compare-before .samgple-compare-icon { background: #fecaca; }
        .samgple-compare-after  .samgple-compare-icon { background: #bbf7d0; }
        .samgple-compare-item span { font-size: 13px; color: #374151; line-height: 1.5; }

        /* Testimonials */
        .samgple-testi-grid { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
        .samgple-testi-card {
          background: var(--surface2); border: 1.5px solid var(--border);
          border-radius: var(--rxl); padding: 26px; transition: all .2s; position: relative; overflow: hidden;
        }
        .samgple-testi-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,.08); }
        .samgple-quote-mark { position: absolute; top: 14px; right: 18px; font-size: 60px; font-weight: 900; color: rgba(0,0,0,.04); line-height: 1; font-family: Georgia,serif; pointer-events: none; }
        .samgple-testi-stars { display: flex; gap: 3px; margin-bottom: 13px; }
        .samgple-testi-text { font-size: 14px; color: var(--ink2); line-height: 1.75; font-style: italic; margin-bottom: 20px; }
        .samgple-testi-author { display: flex; align-items: center; gap: 10px; }
        .samgple-testi-av { width: 38px; height: 38px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; color: #fff; flex-shrink: 0; }
        .samgple-testi-name { font-size: 13px; font-weight: 700; color: var(--ink); }
        .samgple-testi-role { font-size: 11px; color: var(--muted2); margin-top: 1px; }

        /* Pricing */
        .samgple-pricing-grid { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; align-items: start; }
        .samgple-price-card { background: #fff; border: 1.5px solid var(--border2); border-radius: var(--rxl); padding: 26px 22px; transition: all .2s; }
        .samgple-price-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,.08); }
        .samgple-price-popular { background: var(--ink); border-color: var(--ink); position: relative; }
        .samgple-popular-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: var(--brand); color: #fff; font-size: 10px; font-weight: 700;
          padding: 4px 14px; border-radius: 100px; white-space: nowrap; letter-spacing: .04em; text-transform: uppercase;
        }
        .samgple-price-plan { font-size: 13px; font-weight: 700; margin-bottom: 6px; color: var(--muted); }
        .samgple-price-popular .samgple-price-plan { color: rgba(255,255,255,.55); }
        .samgple-price-amount { font-size: 40px; font-weight: 800; letter-spacing: -2px; color: var(--ink); line-height: 1; margin-bottom: 4px; }
        .samgple-price-popular .samgple-price-amount { color: #fff; }
        .samgple-price-period { font-size: 12px; color: var(--muted2); margin-bottom: 18px; }
        .samgple-price-popular .samgple-price-period { color: rgba(255,255,255,.3); }
        .samgple-price-divider { height: 1px; background: var(--border); margin-bottom: 16px; }
        .samgple-price-popular .samgple-price-divider { background: rgba(255,255,255,.08); }
        .samgple-price-feat { display: flex; align-items: center; gap: 9px; font-size: 13px; color: var(--muted); margin-bottom: 10px; }
        .samgple-price-popular .samgple-price-feat { color: rgba(255,255,255,.5); }
        .samgple-price-check { width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0; background: rgba(16,185,129,.15); display: flex; align-items: center; justify-content: center; }
        .samgple-price-popular .samgple-price-check { background: rgba(16,185,129,.2); }
        .samgple-price-btn {
          display: block; width: 100%; text-align: center; margin-top: 20px;
          font-size: 14px; font-weight: 700; padding: 12px 18px; border-radius: 11px;
          text-decoration: none; transition: all .15s; cursor: pointer; border: none;
          font-family: inherit;
        }
        .samgple-price-btn-outline { background: transparent; color: var(--ink); border: 1.5px solid var(--border2); }
        .samgple-price-btn-outline:hover { background: var(--surface3); }
        .samgple-price-btn-filled { background: var(--brand); color: #fff; box-shadow: 0 4px 16px rgba(37,99,235,.3); }
        .samgple-price-btn-filled:hover { background: var(--brand-dark); transform: translateY(-1px); }
        .samgple-price-btn-dark { background: rgba(255,255,255,.1); color: rgba(255,255,255,.85); border: 1px solid rgba(255,255,255,.1); }
        .samgple-price-btn-dark:hover { background: rgba(255,255,255,.15); }

        /* CTA Final */
        .samgple-cta-final {
          padding: clamp(72px,9vw,100px) 20px;
          background: linear-gradient(135deg,#06080f 0%,#0c1228 50%,#060a1a 100%);
          text-align: center; position: relative; overflow: hidden;
        }
        .samgple-cta-glow1 { position: absolute; top: -100px; left: 50%; transform: translateX(-60%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(37,99,235,.15) 0%, transparent 70%); pointer-events: none; }
        .samgple-cta-glow2 { position: absolute; bottom: -100px; right: 20%; width: 400px; height: 300px; background: radial-gradient(ellipse, rgba(14,165,233,.1) 0%, transparent 70%); pointer-events: none; }
        .samgple-cta-inner { max-width: 560px; margin: 0 auto; position: relative; z-index: 1; }
        .samgple-cta-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(99,155,255,.7); margin-bottom: 14px; }
        .samgple-cta-title { font-size: clamp(30px,5vw,56px); font-weight: 800; color: #fff; letter-spacing: -2px; line-height: 1.05; margin-bottom: 18px; }
        .samgple-cta-sub { font-size: 16px; color: rgba(255,255,255,.45); margin-bottom: 34px; line-height: 1.7; }
        .samgple-cta-btns { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
        .samgple-btn-cta-main {
          font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 12px;
          background: var(--brand); color: #fff; text-decoration: none;
          display: inline-flex; align-items: center; gap: 8px; transition: all .15s;
          box-shadow: 0 0 0 1px rgba(37,99,235,.5), 0 4px 24px rgba(37,99,235,.35);
          white-space: nowrap;
        }
        .samgple-btn-cta-main:hover { background: var(--brand-dark); transform: translateY(-2px); }
        .samgple-btn-cta-ghost {
          font-size: 15px; font-weight: 600; padding: 14px 24px; border-radius: 12px;
          background: transparent; color: rgba(255,255,255,.65);
          border: 1.5px solid rgba(255,255,255,.12); text-decoration: none; transition: all .15s;
          white-space: nowrap;
        }
        .samgple-btn-cta-ghost:hover { border-color: rgba(255,255,255,.25); color: rgba(255,255,255,.85); background: rgba(255,255,255,.04); }
        .samgple-cta-footnote { font-size: 12px; color: rgba(255,255,255,.2); }

        /* ── RESPONSIVE MÓVIL ── */

        /* Tablet: ≤1024px */
        @media (max-width: 1024px) {
          .samgple-pain-grid { grid-template-columns: 1fr 1fr; max-width: 720px; margin: 0 auto; }
          .samgple-steps-grid { grid-template-columns: 1fr 1fr; }
          .samgple-features-grid { grid-template-columns: 1fr 1fr; }
          .samgple-testi-grid { grid-template-columns: 1fr 1fr; }
          .samgple-pricing-grid { grid-template-columns: 1fr; max-width: 420px; }
          .samgple-stats-grid { grid-template-columns: repeat(2,1fr); gap: 24px; }
        }

        /* Tablet pequeño / móvil grande: ≤768px */
        @media (max-width: 768px) {
          .samgple-hero-grid { grid-template-columns: 1fr; }
          .samgple-dash-wrap { display: none; }
          .samgple-hero { min-height: auto; padding: 100px 20px 72px; }
          .samgple-h1 { letter-spacing: -1.5px; }
          .samgple-compare-grid { grid-template-columns: 1fr; }
          .samgple-pain-grid { grid-template-columns: 1fr; max-width: 480px; }
          .samgple-testi-grid { grid-template-columns: 1fr; }
        }

        /* Móvil: ≤640px */
        @media (max-width: 640px) {
          .samgple-ctas { flex-direction: column; align-items: stretch; }
          .samgple-btn-primary, .samgple-btn-secondary { justify-content: center; width: 100%; }
          .samgple-steps-grid { grid-template-columns: 1fr; }
          .samgple-features-grid { grid-template-columns: 1fr; }
          .samgple-testi-grid { grid-template-columns: 1fr; }
          .samgple-cta-btns { flex-direction: column; align-items: center; }
          .samgple-btn-cta-main, .samgple-btn-cta-ghost { width: 100%; max-width: 320px; justify-content: center; }
          .samgple-stats-grid { grid-template-columns: repeat(2,1fr); gap: 20px; }
          .samgple-section { padding: 56px 18px; }
          .samgple-hero-badge { font-size: 11px; }
          .samgple-h2 { letter-spacing: -1px; }
          .samgple-pricing-grid { max-width: 340px; }
        }

        /* Móvil pequeño: ≤400px */
        @media (max-width: 400px) {
          .samgple-stats-grid { grid-template-columns: 1fr 1fr; }
          .samgple-stat-num { font-size: 28px; }
          .samgple-hero { padding: 90px 16px 60px; }
          .samgple-h1 { font-size: 32px; letter-spacing: -1px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="samgple-hero">
        <div className="samgple-hero-bg" />
        <div className="samgple-hero-glow" />
        <div className="samgple-hero-inner">
          <div className="samgple-hero-grid">

            {/* Left */}
            <div>
              <div className="samgple-hero-badge">
                <div className="samgple-badge-dot">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                120+ tiendas confirmando pedidos con IA
              </div>

              <h1 className="samgple-h1">
                Para de perder<br />dinero en<br />
                <TypewriterText />
              </h1>

              <p className="samgple-hero-sub">
                SAMGPLE analiza cada pedido COD con IA, llama automáticamente al cliente y confirma la entrega antes de enviar.{' '}
                <strong style={{ color: 'var(--ink)' }}>Reduce devoluciones hasta un 42%.</strong>
              </p>

              <div className="samgple-ctas">
                <Link href="/registro" className="samgple-btn-primary">
                  Empezar gratis — sin tarjeta
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <a href="#como-funciona" className="samgple-btn-secondary">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                  Ver cómo funciona
                </a>
              </div>

              <div className="samgple-sp">
                <div className="samgple-av-stack">
                  {[['#2563eb','A'],['#0f766e','M'],['#7c3aed','C'],['#ec4899','D']].map(([c,l],i) => (
                    <div key={i} className="samgple-av" style={{ background: c }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div className="samgple-stars">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="samgple-sp-txt"><strong>4.9/5</strong> · +120 tiendas activas</p>
                </div>
              </div>
            </div>

            {/* Dashboard mockup — oculto en móvil vía CSS */}
            <div className="samgple-dash-wrap">
              {/* Badge flotante 1 */}
              <div className="samgple-float-badge samgple-float-1">
                <div className="samgple-fb-icon" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div className="samgple-fb-title">+87% confirmados</div>
                  <div className="samgple-fb-sub">esta semana ↑ 3pts</div>
                </div>
              </div>
              {/* Badge flotante 2 */}
              <div className="samgple-float-badge samgple-float-2">
                <div className="samgple-fb-icon" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <div className="samgple-fb-title">IA llamando ahora</div>
                  <div className="samgple-fb-sub">143 llamadas activas</div>
                </div>
              </div>

              <div className="samgple-dash">
                <div className="samgple-dash-bar">
                  {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} className="samgple-dash-dot" style={{ background: c }} />)}
                  <div className="samgple-dash-url"><span>app.samgple.com</span></div>
                </div>
                <div className="samgple-dash-body">
                  <div className="samgple-dash-metrics">
                    {[
                      { l: 'Ingresos hoy',    v: '4.892€', c: '#22c55e', s: '+12% esta semana' },
                      { l: 'Confirmados',     v: '87%',    c: '#60a5fa', s: '↑ 3pts vs mes ant.' },
                      { l: 'Llamadas activas',v: '143',    c: '#a78bfa', s: 'En tiempo real' },
                      { l: 'Score riesgo',    v: '34',     c: '#fbbf24', s: 'Bajo riesgo ✓' },
                    ].map(m => (
                      <div key={m.l} className="samgple-dash-metric">
                        <div className="samgple-dm-label">{m.l}</div>
                        <div className="samgple-dm-val" style={{ color: m.c }}>{m.v}</div>
                        <div className="samgple-dm-sub">{m.s}</div>
                      </div>
                    ))}
                  </div>
                  <div className="samgple-dash-orders-hdr">Últimos pedidos</div>
                  <div className="samgple-dash-orders">
                    {[
                      { n: 'María González', a: '44.99€', s: 'Confirmado', bc: 'rgba(34,197,94,.12)', tc: '#22c55e' },
                      { n: 'Carlos Ruiz',    a: '89.50€', s: 'Llamando...', bc: 'rgba(96,165,250,.12)', tc: '#60a5fa' },
                      { n: 'Ana Martínez',  a: '32.00€', s: 'Pendiente',  bc: 'rgba(251,191,36,.12)', tc: '#fbbf24' },
                    ].map((o, i) => (
                      <div key={i} className="samgple-dash-order">
                        <div className="samgple-order-info">
                          <div className="samgple-order-av">{o.n.charAt(0)}</div>
                          <span className="samgple-order-name">{o.n}</span>
                        </div>
                        <div className="samgple-order-right">
                          <span className="samgple-order-amount">{o.a}</span>
                          <span className="samgple-order-badge" style={{ background: o.bc, color: o.tc }}>{o.s}</span>
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

      {/* ── LOGOS ── */}
      <div className="samgple-logos">
        <div className="samgple-logos-label">Tiendas que ya confirman pedidos con SAMGPLE</div>
        <div className="samgple-logos-track">
          {[...logos, ...logos].map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="samgple-stats">
        <div className="samgple-stats-grid">
          {[
            { prefix: '-', target: 42, suffix: '%', label: 'Reducción en devoluciones' },
            { prefix: '',  target: 87, suffix: '%', label: 'Tasa de confirmación' },
            { prefix: '<', target: 4,  suffix: 'min', label: 'Por confirmación media' },
            { prefix: '',  target: 120, suffix: '+', label: 'Tiendas activas' },
          ].map((s, i) => (
            <Reveal key={i} style={{ transitionDelay: `${i * 0.07}s` } as React.CSSProperties}>
              <div className="samgple-stat-num">
                <Counter target={s.target} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="samgple-stat-label">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DOLOR ── */}
      <section className="samgple-section" id="dolor" style={{ background: 'var(--surface)' }}>
        <div className="samgple-section-hdr">
          <Reveal>
            <div className="samgple-tag">El problema</div>
            <h2 className="samgple-h2">Cada pedido COD sin confirmar<br />es dinero que estás quemando</h2>
            <p className="samgple-sub">El COD es la forma de pago más popular en eCommerce español. También es la más cara si no la gestionas bien.</p>
          </Reveal>
        </div>
        <div className="samgple-pain-grid">
          {[
            { icon: '📦', title: 'Devoluciones masivas', desc: 'Envías stock real, asumes el coste del transporte y el cliente no abre la puerta. Pierdes en ambos sentidos.', stat: '-35%', statLabel: 'Margen que se pierde en devoluciones' },
            { icon: '👻', title: 'Clientes fantasma',   desc: 'Pedidos de clientes que nunca existieron o que pusieron un número falso. Nadie los filtra antes de enviar.', stat: '~20%', statLabel: 'Pedidos COD con datos incorrectos' },
            { icon: '🕐', title: 'Agentes manuales lentos', desc: 'Tu equipo pierde horas llamando uno a uno. Coste alto, horario limitado y tasa de éxito mediocre.', stat: '3–8€', statLabel: 'Coste por confirmación manual' },
          ].map((c, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="samgple-pain-card">
                <div className="samgple-pain-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="samgple-pain-stat">{c.stat}</div>
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{c.statLabel}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="samgple-section" id="como-funciona" style={{ background: 'var(--surface2)' }}>
        <div className="samgple-section-hdr">
          <Reveal>
            <div className="samgple-tag">Proceso</div>
            <h2 className="samgple-h2">4 pasos, 0 intervención humana</h2>
            <p className="samgple-sub">Desde que llega el pedido hasta que está confirmado, SAMGPLE lo hace solo. En tiempo real.</p>
          </Reveal>
        </div>
        <div className="samgple-steps-grid">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="samgple-step-card">
                <div className="samgple-step-bar" style={{ background: step.color }} />
                <div className="samgple-step-num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="samgple-section" id="caracteristicas" style={{ background: 'var(--surface)' }}>
        <div className="samgple-section-hdr">
          <Reveal>
            <div className="samgple-tag">Funcionalidades</div>
            <h2 className="samgple-h2">Todo lo que necesitas.<br />Nada que no necesitas.</h2>
          </Reveal>
        </div>
        <div className="samgple-features-grid">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="samgple-feat-card">
                <div className="samgple-feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="samgple-feat-pill" style={{ background: `${f.pillColor}15`, border: `1px solid ${f.pillColor}30`, color: f.pillColor }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f.pill}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── COMPARE ── */}
      <section className="samgple-section" style={{ background: 'var(--surface2)' }}>
        <div className="samgple-section-hdr">
          <Reveal>
            <div className="samgple-tag">Antes vs Después</div>
            <h2 className="samgple-h2">La diferencia no es gradual.<br />Es brutal.</h2>
            <p className="samgple-sub">Compara tu proceso actual de confirmación COD con lo que SAMGPLE hace por ti.</p>
          </Reveal>
        </div>
        <div className="samgple-compare-grid">
          <Reveal delay={0.05}>
            <div className="samgple-compare-card samgple-compare-before">
              <div className="samgple-compare-label">❌ Sin SAMGPLE</div>
              {compareLeft.map((t, i) => (
                <div key={i} className="samgple-compare-item">
                  <div className="samgple-compare-icon">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </div>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="samgple-compare-card samgple-compare-after">
              <div className="samgple-compare-label">✓ Con SAMGPLE</div>
              {compareRight.map((t, i) => (
                <div key={i} className="samgple-compare-item">
                  <div className="samgple-compare-icon">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIOS ── */}
      <section className="samgple-section" id="testimonios" style={{ background: 'var(--surface)' }}>
        <div className="samgple-section-hdr">
          <Reveal>
            <div className="samgple-tag">Testimonios</div>
            <h2 className="samgple-h2">Resultados reales.<br />Cero excusas.</h2>
            <p className="samgple-sub">Lo que dicen los fundadores que ya dejaron de perder dinero en COD.</p>
          </Reveal>
        </div>
        <div className="samgple-testi-grid">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="samgple-testi-card">
                <div className="samgple-quote-mark">&ldquo;</div>
                <div className="samgple-testi-stars">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <p className="samgple-testi-text">&ldquo;{t.text}&rdquo;</p>
                <div className="samgple-testi-author">
                  <div className="samgple-testi-av" style={{ background: `linear-gradient(135deg,${t.color},${t.color}88)` }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="samgple-testi-name">{t.name}</div>
                    <div className="samgple-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section className="samgple-section" id="precios" style={{ background: 'var(--surface2)' }}>
        <div className="samgple-section-hdr">
          <Reveal>
            <div className="samgple-tag">Precios</div>
            <h2 className="samgple-h2">Solo pagas cuando funciona</h2>
            <p className="samgple-sub">Sin suscripción mensual fija. Sin compromisos. Tokens de bienvenida para que empieces gratis hoy.</p>
          </Reveal>
        </div>
        <div className="samgple-pricing-grid">
          {/* Starter */}
          <Reveal delay={0.05}>
            <div className="samgple-price-card">
              <div className="samgple-price-plan">Starter</div>
              <div className="samgple-price-amount">Gratis</div>
              <div className="samgple-price-period">para siempre · tokens de prueba</div>
              <div className="samgple-price-divider" />
              {['50 confirmaciones gratuitas','Score de riesgo IA incluido','Integración Shopify','Dashboard básico'].map((f,i) => (
                <div key={i} className="samgple-price-feat">
                  <div className="samgple-price-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                  {f}
                </div>
              ))}
              <Link href="/registro" className="samgple-price-btn samgple-price-btn-outline">Empezar gratis</Link>
            </div>
          </Reveal>

          {/* Growth (popular) */}
          <Reveal delay={0.1}>
            <div className="samgple-price-card samgple-price-popular">
              <div className="samgple-popular-badge">🔥 Más popular</div>
              <div className="samgple-price-plan">Growth</div>
              <div className="samgple-price-amount">0.17€</div>
              <div className="samgple-price-period">por confirmación · pay-per-use</div>
              <div className="samgple-price-divider" />
              {['Confirmaciones ilimitadas','Voz IA con tu nombre de marca','Analytics + ROI en tiempo real','15+ señales de riesgo IA','Soporte prioritario 24/7'].map((f,i) => (
                <div key={i} className="samgple-price-feat">
                  <div className="samgple-price-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                  {f}
                </div>
              ))}
              <Link href="/registro" className="samgple-price-btn samgple-price-btn-filled">Empezar ahora</Link>
            </div>
          </Reveal>

          {/* Enterprise */}
          <Reveal delay={0.15}>
            <div className="samgple-price-card">
              <div className="samgple-price-plan">Enterprise</div>
              <div className="samgple-price-amount">Custom</div>
              <div className="samgple-price-period">volumen alto · acuerdo a medida</div>
              <div className="samgple-price-divider" />
              {['Todo lo de Growth','Multi-tienda y multi-idioma','SLA garantizado + API acceso','Onboarding dedicado'].map((f,i) => (
                <div key={i} className="samgple-price-feat">
                  <div className="samgple-price-check"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                  {f}
                </div>
              ))}
              <a href="mailto:hola@samgple.com" className="samgple-price-btn samgple-price-btn-outline">Hablar con ventas</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="samgple-cta-final" id="registro">
        <div className="samgple-cta-glow1" />
        <div className="samgple-cta-glow2" />
        <div className="samgple-cta-inner">
          <Reveal>
            <div className="samgple-cta-tag">Empieza hoy</div>
            <h2 className="samgple-cta-title">
              Confirma pedidos COD<br />con <span style={{ color: 'var(--accent)' }}>IA desde hoy</span>
            </h2>
            <p className="samgple-cta-sub">
              Conecta Shopify en 10 minutos. Tokens de bienvenida incluidos. Sin tarjeta de crédito. Sin suscripción mensual.
            </p>
            <div className="samgple-cta-btns">
              <Link href="/registro" className="samgple-btn-cta-main">
                Crear cuenta gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <a href="#precios" className="samgple-btn-cta-ghost">Ver precios →</a>
            </div>
            <p className="samgple-cta-footnote">Sin tarjeta de crédito · Tokens de prueba incluidos · Cancela cuando quieras</p>
          </Reveal>
        </div>
      </section>

    </>
  )
}