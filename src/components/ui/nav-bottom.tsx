'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, {
  useState, useRef, useEffect, useMemo, useCallback, memo,
} from 'react'

/* ─── Nav config ──────────────────────────────────────────────── */
const LINKS = [
  { href: '/finanzas',      label: 'Finanzas',     shortcut: 'F' },
  { href: '/pedidos',       label: 'Pedidos',       shortcut: 'P' },
  { href: '/tienda',        label: 'Tienda',        shortcut: 'T' },
  { href: '/herramientas',  label: 'Herramientas',  shortcut: 'H' },
  { href: '/configuracion', label: 'Cuenta',        shortcut: 'C' },
] as const

/* ─── Icons ───────────────────────────────────────────────────── */
const svgBase = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const IcFinanzas = (a?: boolean) => <svg width="16" height="16" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.1 : 1.7}><path d="M2 20h20M6 20V10M10 20V4M14 20V14M18 20V8"/></svg>
const IcPedidos = (a?: boolean) => <svg width="16" height="16" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.1 : 1.7}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4M8 13h8M8 17h5"/></svg>
const IcTienda = (a?: boolean) => <svg width="16" height="16" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.1 : 1.7}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IcTools = (a?: boolean) => <svg width="16" height="16" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.1 : 1.7}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
const IcUser = (a?: boolean) => <svg width="16" height="16" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.1 : 1.7}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/></svg>

const IC = [IcFinanzas, IcPedidos, IcTienda, IcTools, IcUser]

const IcZap    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
const IcSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" {...svgBase} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcChevL  = () => <svg width="12" height="12" viewBox="0 0 24 24" {...svgBase} strokeWidth="2.2"><polyline points="15 18 9 12 15 6"/></svg>
const IcChevR  = () => <svg width="12" height="12" viewBox="0 0 24 24" {...svgBase} strokeWidth="2.2"><polyline points="9 18 15 12 9 6"/></svg>
const IcChevU  = () => <svg width="11" height="11" viewBox="0 0 24 24" {...svgBase} strokeWidth="2.2"><polyline points="18 15 12 9 6 15"/></svg>
const IcChevD  = () => <svg width="11" height="11" viewBox="0 0 24 24" {...svgBase} strokeWidth="2.2"><polyline points="6 9 12 15 18 9"/></svg>
const IcLogout = () => <svg width="13" height="13" viewBox="0 0 24 24" {...svgBase} strokeWidth="1.9"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcCog    = () => <svg width="13" height="13" viewBox="0 0 24 24" {...svgBase} strokeWidth="1.9"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
*,*::before,*::after{box-sizing:border-box}

@keyframes nb-slidein {from{opacity:0;transform:translateY(-9px) scale(.97)}to{opacity:1;transform:none}}
@keyframes nb-fadeup  {from{opacity:0;transform:translateY(9px) scale(.97)}to{opacity:1;transform:none}}
@keyframes nb-fadein  {from{opacity:0}to{opacity:1}}
@keyframes nb-tipslide{from{opacity:0;transform:translateX(-5px) translateY(-50%)}to{opacity:1;transform:translateX(0) translateY(-50%)}}
@keyframes nb-dock    {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes nb-liveDot {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.6)}}
@keyframes nb-tokGlow {0%,100%{opacity:.7}50%{opacity:1}}

.nb-bar{transition:width .18s cubic-bezier(.22,1,.36,1);will-change:width}

.nb-btn{
  display:flex;align-items:center;width:100%;
  border:none;background:transparent;cursor:pointer;
  font-family:inherit;outline:none;border-radius:10px;
  -webkit-tap-highlight-color:transparent;
  transition:background .08s,color .08s;position:relative;
}
.nb-btn:not(.nb-on):hover{background:rgba(0,0,0,.05)!important;color:#334155!important}
.nb-btn:active{transform:scale(.96)}
.nb-btn.nb-on{background:rgba(20,184,166,.1)!important;color:#0f766e!important}
.nb-btn .nb-ic{transition:transform .15s cubic-bezier(.34,1.56,.64,1)}
.nb-btn:hover .nb-ic{transform:scale(1.14)}
.nb-btn .nb-k{opacity:0;transition:opacity .1s}
.nb-btn:hover .nb-k,.nb-btn.nb-on .nb-k{opacity:1}

.nb-qk:hover{background:#f1f5f9!important;border-color:#dde3ea!important}

.nb-cr:hover{background:#f8fafc!important}
.nb-pi:hover{background:#f8fafc!important}

.nb-db{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:3px;flex:1;height:100%;
  padding:7px 5px 5px;background:none;border:none;cursor:pointer;
  -webkit-tap-highlight-color:transparent;outline:none;
  font-family:inherit;transition:color .15s;border-radius:22px;
}
.nb-db:active{transform:scale(.88)}
.nb-db .nb-di{transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
.nb-db.nb-da .nb-di{transform:scale(1.24) translateY(-2px)}

.nb-tip{
  position:absolute;left:calc(100% + 9px);top:50%;
  transform:translateY(-50%);
  background:#1a2332;color:#f0f4f8;
  font-size:12px;font-weight:600;
  padding:5px 10px;border-radius:8px;white-space:nowrap;
  pointer-events:none;z-index:400;
  display:flex;align-items:center;gap:6px;
  box-shadow:0 4px 20px rgba(0,0,0,.22);
  animation:nb-tipslide .13s ease;
}

.nb-sc::-webkit-scrollbar{width:2px}
.nb-sc::-webkit-scrollbar-thumb{background:#e0e5eb;border-radius:2px}

@media(max-width:680px){
  .nb-desk{display:none!important}
  .nb-sp{display:none!important}
  .nb-dk{display:flex!important}
  .nb-dkp{display:block!important}
}
@media(min-width:681px){
  .nb-dk{display:none!important}
  .nb-dkp{display:none!important}
}
`

/* ─── Tooltip ─────────────────────────────────────────────────── */
const Tip = memo(({ label, sc }: { label: string; sc: string }) => (
  <div className="nb-tip">
    {label}
    <kbd style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,.13)', border: '1px solid rgba(255,255,255,.18)', fontFamily: 'inherit' }}>{sc}</kbd>
  </div>
))
Tip.displayName = 'Tip'

/* ─── Command Palette ─────────────────────────────────────────── */
const Cmd = memo(({ open, close, go }: { open: boolean; close: () => void; go: (h: string) => void }) => {
  const [q, setQ] = useState('')
  const [cur, setCur] = useState(0)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => { if (open) { setQ(''); setCur(0); setTimeout(() => ref.current?.focus(), 35) } }, [open])
  const res = useMemo(() => LINKS.filter(l => l.label.toLowerCase().includes(q.toLowerCase())), [q])
  useEffect(() => setCur(0), [q])

  if (!open) return null
  return (
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(10,18,36,.52)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 'min(10vh,80px)', animation: 'nb-fadein .12s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 500, margin: '0 16px', background: '#fff', borderRadius: 20, boxShadow: '0 32px 80px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.06)', overflow: 'hidden', animation: 'nb-slidein .15s cubic-bezier(.22,1,.36,1)' }}>
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid #f0f2f5' }}>
          <IcSearch />
          <input ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Navegar a…"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#0f172a', fontFamily: 'inherit', fontWeight: 500, background: 'transparent' }}
            onKeyDown={e => {
              if (e.key === 'Escape') close()
              if (e.key === 'ArrowDown') { e.preventDefault(); setCur(c => Math.min(c + 1, res.length - 1)) }
              if (e.key === 'ArrowUp')   { e.preventDefault(); setCur(c => Math.max(c - 1, 0)) }
              if (e.key === 'Enter' && res[cur]) go(res[cur].href)
            }} />
          <kbd onClick={close} style={{ fontSize: 11, padding: '3px 7px', borderRadius: 7, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>Esc</kbd>
        </div>
        {/* Results */}
        <div style={{ padding: '6px 8px 8px' }}>
          {res.length === 0
            ? <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '18px 0', margin: 0 }}>Sin resultados</p>
            : res.map((l, i) => (
              <button key={l.href} className="nb-cr"
                onMouseEnter={() => setCur(i)}
                onClick={() => go(l.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '9px 10px', border: 'none', background: i === cur ? '#f8fafc' : 'transparent', borderRadius: 11, cursor: 'pointer', fontFamily: 'inherit', outline: i === cur ? '1.5px solid #e8ecf0' : 'none' }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: '#f8fafc', border: '1px solid #f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                  {IC[LINKS.findIndex(x => x.href === l.href)]?.()}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{l.label}</span>
                <kbd style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#94a3b8', fontFamily: 'inherit' }}>{l.shortcut}</kbd>
              </button>
            ))
          }
        </div>
        {/* Footer */}
        <div style={{ borderTop: '1px solid #f0f2f5', padding: '7px 16px', display: 'flex', gap: 14 }}>
          {[['↵', 'Ir'], ['↑↓', 'Mover'], ['Esc', 'Cerrar']].map(([k, v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
              <kbd style={{ padding: '1px 5px', borderRadius: 4, background: '#f8fafc', border: '1px solid #e8ecf0', fontFamily: 'inherit', fontSize: 10 }}>{k}</kbd>{v}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})
Cmd.displayName = 'Cmd'

/* ─── Token badge ─────────────────────────────────────────────── */
const Tok = memo(({ col, val }: { col: boolean; val: number }) => {
  const pct   = Math.min(val * 100, 100)
  const color = val < 0.1 ? '#ef4444' : val < 0.5 ? '#f59e0b' : '#14b8a6'
  if (col) return (
    <div title={`${val} tokens`} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(20,184,166,.08)', border: '1.5px solid rgba(20,184,166,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6', cursor: 'default' }}>
      <IcZap />
    </div>
  )
  return (
    <div style={{ borderRadius: 12, padding: '10px 12px', background: 'rgba(20,184,166,.05)', border: '1px solid rgba(20,184,166,.12)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(20,184,166,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14b8a6' }}><IcZap /></span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e' }}>Tokens</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '-.5px', fontVariantNumeric: 'tabular-nums' }}>{val}</span>
      </div>
      <div style={{ height: 3, borderRadius: 3, background: 'rgba(20,184,166,.1)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg,${color},${color}cc)`, animation: 'nb-tokGlow 2.8s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Plan Starter</span>
        <span style={{ fontSize: 10, color: '#14b8a6', fontWeight: 700 }}>Activo</span>
      </div>
    </div>
  )
})
Tok.displayName = 'Tok'

/* ─── Profile dropdown ────────────────────────────────────────── */
const Prof = memo(({ col, close }: { col: boolean; close: () => void }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [close])

  return (
    <div ref={ref} style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: col ? 'calc(100% + 10px)' : 0, right: col ? 'auto' : 0, minWidth: 210, background: '#fff', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,.14), 0 0 0 1px rgba(0,0,0,.06)', overflow: 'hidden', animation: 'nb-fadeup .16s cubic-bezier(.22,1,.36,1)', zIndex: 200 }}>
      {/* Header */}
      <div style={{ padding: '13px 13px 11px', borderBottom: '1px solid #f0f2f5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>M</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Miguel L.</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>hola@samgple.com</p>
          </div>
        </div>
      </div>
      <div style={{ padding: '6px 6px' }}>
        <Link href="/configuracion" onClick={close} className="nb-pi"
          style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10, color: '#374151', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
          <IcCog />Configuración
        </Link>
      </div>
      <div style={{ borderTop: '1px solid #f0f2f5', padding: '6px 6px 8px' }}>
        <button className="nb-pi" onClick={close}
          style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 10px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#ef4444', fontFamily: 'inherit' }}>
          <IcLogout />Cerrar sesión
        </button>
      </div>
    </div>
  )
})
Prof.displayName = 'Prof'

/* ─── Sidebar item ─────────────────────────────────────────────── */
const SBtn = memo(({ href, label, sc, idx, active, col, go }: {
  href: string; label: string; sc: string; idx: number
  active: boolean; col: boolean; go: () => void
}) => {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button className={`nb-btn${active ? ' nb-on' : ''}`} onClick={go}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ gap: col ? 0 : 9, padding: col ? '9px' : '8px 10px', justifyContent: col ? 'center' : 'flex-start', color: active ? '#0f766e' : '#64748b' }}>
        {active && <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: '0 3px 3px 0', background: '#2EC4B6', boxShadow: '0 0 8px rgba(46,196,182,.55)' }} />}
        <span className="nb-ic" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {IC[idx]?.(active)}
        </span>
        {!col && (
          <>
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, letterSpacing: '-.15px', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
            <kbd className="nb-k" style={{ fontSize: 9, padding: '2px 5px', borderRadius: 5, background: active ? 'rgba(20,184,166,.12)' : '#f1f5f9', border: `1px solid ${active ? 'rgba(20,184,166,.22)' : '#e4e8ed'}`, color: active ? '#0f766e' : '#94a3b8', fontFamily: 'inherit', flexShrink: 0 }}>{sc}</kbd>
          </>
        )}
      </button>
      {col && hov && <Tip label={label} sc={sc} />}
    </div>
  )
})
SBtn.displayName = 'SBtn'

/* ─── Mobile dock ─────────────────────────────────────────────── */
const Dock = memo(({ ai, go }: { ai: number; go: (i: number) => void }) => (
  <div className="nb-dk" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, display: 'none', justifyContent: 'center', padding: '0 0 calc(env(safe-area-inset-bottom,8px) + 8px)', pointerEvents: 'none' }}>
    <nav style={{ pointerEvents: 'all', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)', borderRadius: 9999, border: '1px solid rgba(220,227,235,.8)', boxShadow: '0 8px 40px rgba(0,0,0,.1),0 1px 0 rgba(255,255,255,.9) inset', padding: '5px 6px', gap: 2, animation: 'nb-dock .3s cubic-bezier(.22,1,.36,1)' }}>
      {LINKS.map((l, i) => {
        const a = i === ai
        return (
          <button key={l.href} className={`nb-db${a ? ' nb-da' : ''}`} onClick={() => go(i)}
            style={{ color: a ? '#0f766e' : '#94a3b8', minWidth: 56, background: a ? 'rgba(20,184,166,.09)' : 'transparent', transition: 'background .15s,color .15s' }}>
            <span className="nb-di">{IC[i]?.(a)}</span>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', lineHeight: 1, maxHeight: a ? 14 : 0, overflow: 'hidden', opacity: a ? 1 : 0, transform: a ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity .18s,transform .18s,max-height .18s', whiteSpace: 'nowrap' }}>
              {l.label}
            </span>
          </button>
        )
      })}
    </nav>
  </div>
))
Dock.displayName = 'Dock'

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT — toda la lógica original intacta
═══════════════════════════════════════════════════════════════ */
export default function NavBottom() {
  // ── LÓGICA ORIGINAL INTACTA ──────────────────────────────
  const pathname = usePathname()
  const router   = useRouter()

  const activeIndex = useMemo(() => {
    const idx = LINKS.findIndex(l => pathname.startsWith(l.href))
    return idx >= 0 ? idx : 0
  }, [pathname])

  function handleMobileNavigate(index: number) {
    router.push(LINKS[index].href)
  }
  // ── FIN LÓGICA ORIGINAL ──────────────────────────────────

  const tokens = 0.17

  const [col,  setCol]  = useState(false)
  const [cmd,  setCmd]  = useState(false)
  const [prof, setProf] = useState(false)
  const W = col ? 60 : 220

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'k') { e.preventDefault(); setCmd(o => !o); return }
      if (cmd) return
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '[' && !mod) { setCol(o => !o); return }
      LINKS.forEach(l => {
        if (e.key.toUpperCase() === l.shortcut && !mod) { e.preventDefault(); router.push(l.href) }
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cmd, router])

  const goCmd  = useCallback((h: string) => { setCmd(false); router.push(h) }, [router])
  const goItem = useCallback((h: string) => { router.push(h) }, [router])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Cmd open={cmd} close={() => setCmd(false)} go={goCmd} />

      {/* ── SIDEBAR ── */}
      <aside className="nb-desk nb-bar"
        style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: W, zIndex: 100, display: 'flex', flexDirection: 'column', background: '#fafafa', borderRight: '1px solid #ebebeb' }}>

        {/* Logo */}
        <div style={{ height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: col ? 'center' : 'space-between', padding: col ? '0 12px' : '0 12px 0 14px', borderBottom: '1px solid #ebebeb' }}>
          {col
            ? <Link href="/pedidos" style={{ textDecoration: 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(46,196,182,.3)', color: '#fff' }}><IcZap /></div>
              </Link>
            : <>
                <Link href="/pedidos" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(46,196,182,.3)', flexShrink: 0, color: '#fff' }}><IcZap /></div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '-.4px' }}>SAMG<span style={{ color: '#2EC4B6' }}>PLE</span></span>
                </Link>
                <button onClick={() => setCol(true)}
                  style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid #ebebeb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', flexShrink: 0, transition: 'background .12s' }}
                  title="Colapsar [">
                  <IcChevL />
                </button>
              </>
          }
        </div>

        {/* Search */}
        <div style={{ padding: '10px 10px 6px', flexShrink: 0 }}>
          <button className="nb-qk" onClick={() => setCmd(true)}
            style={{ width: '100%', padding: col ? '8px' : '7px 10px', borderRadius: 9, border: '1.5px solid #ebebeb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: col ? 'center' : 'flex-start', gap: 7, color: '#94a3b8', transition: 'all .12s', fontFamily: 'inherit' }}>
            <IcSearch />
            {!col && (
              <>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, textAlign: 'left' }}>Ir a…</span>
                <kbd style={{ fontSize: 10, padding: '1px 5px', borderRadius: 5, background: '#f8fafc', border: '1px solid #e4e8ed', color: '#94a3b8', fontFamily: 'inherit' }}>⌘K</kbd>
              </>
            )}
          </button>
        </div>

        {/* Section label */}
        {!col && <p style={{ fontSize: 9, fontWeight: 700, color: '#b8c0ca', textTransform: 'uppercase', letterSpacing: '.1em', margin: '6px 0 2px', padding: '0 14px' }}>Menú</p>}

        {/* Nav items */}
        <nav className="nb-sc" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: col ? '2px 10px' : '2px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {LINKS.map((l, i) => (
            <SBtn key={l.href} href={l.href} label={l.label} sc={l.shortcut} idx={i}
              active={pathname.startsWith(l.href)} col={col}
              go={() => goItem(l.href)} />
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: col ? '10px' : '10px', borderTop: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

          {/* Live dot */}
          {!col && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 10, background: 'rgba(34,197,94,.04)', border: '1px solid rgba(34,197,94,.1)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,.6)', animation: 'nb-liveDot 2.5s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d', flex: 1 }}>Panel activo</span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>En vivo</span>
            </div>
          )}

          <Tok col={col} val={tokens} />

          {col && (
            <button onClick={() => setCol(false)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ebebeb', borderRadius: 9, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <IcChevR />
            </button>
          )}

          {/* Avatar + dropdown */}
          <div style={{ position: 'relative' }}>
            {prof && <Prof col={col} close={() => setProf(false)} />}
            <button onClick={() => setProf(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: col ? 0 : 9, width: '100%', padding: col ? '6px' : '7px 8px', borderRadius: 11, border: 'none', background: prof ? '#f1f5f9' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', justifyContent: col ? 'center' : 'flex-start', transition: 'background .12s' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>M</div>
              {!col && (
                <>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Miguel L.</p>
                    <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Starter</p>
                  </div>
                  {prof ? <IcChevU /> : <IcChevD />}
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar spacer */}
      <div className="nb-sp nb-bar" style={{ width: W, flexShrink: 0 }} aria-hidden />

      {/* ── MOBILE DOCK ── */}
      <Dock ai={activeIndex} go={handleMobileNavigate} />
      <div className="nb-dkp" style={{ height: 76, display: 'none' }} aria-hidden />
    </>
  )
}