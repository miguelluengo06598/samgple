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

const IcFinanzas = (a?: boolean) => <svg width="15" height="15" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.2 : 1.7}><path d="M2 20h20M6 20V10M10 20V4M14 20V14M18 20V8"/></svg>
const IcPedidos  = (a?: boolean) => <svg width="15" height="15" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.2 : 1.7}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3l-4 4-4-4M8 13h8M8 17h5"/></svg>
const IcTienda   = (a?: boolean) => <svg width="15" height="15" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.2 : 1.7}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IcTools    = (a?: boolean) => <svg width="15" height="15" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.2 : 1.7}><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>
const IcUser     = (a?: boolean) => <svg width="15" height="15" viewBox="0 0 24 24" {...svgBase} strokeWidth={a ? 2.2 : 1.7}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/></svg>

const IC = [IcFinanzas, IcPedidos, IcTienda, IcTools, IcUser]

const IcZap    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
const IcSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" {...svgBase} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcChevD  = () => <svg width="11" height="11" viewBox="0 0 24 24" {...svgBase} strokeWidth="2.2"><polyline points="6 9 12 15 18 9"/></svg>
const IcChevU  = () => <svg width="11" height="11" viewBox="0 0 24 24" {...svgBase} strokeWidth="2.2"><polyline points="18 15 12 9 6 15"/></svg>
const IcLogout = () => <svg width="14" height="14" viewBox="0 0 24 24" {...svgBase} strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcCog    = () => <svg width="14" height="14" viewBox="0 0 24 24" {...svgBase} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
*,*::before,*::after{box-sizing:border-box}

@keyframes nb-slidein {from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:none}}
@keyframes nb-fadedown{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:none}}
@keyframes nb-fadein  {from{opacity:0}to{opacity:1}}
@keyframes nb-dock    {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes nb-live    {0%,100%{opacity:1}50%{opacity:.35}}

/* ── Nav link ── */
.nb-link{
  display:flex;align-items:center;gap:6px;
  padding:7px 13px;border-radius:10px;
  border:none;background:transparent;
  cursor:pointer;font-family:inherit;outline:none;
  font-size:13.5px;font-weight:500;color:#64748b;
  transition:background .12s,color .12s;
  white-space:nowrap;text-decoration:none;
}
.nb-link:hover{background:#f1f5f9;color:#0f172a}
.nb-link:active{transform:scale(.97)}
.nb-link.nb-on{
  background:#f0fdf4;color:#0f766e;font-weight:700;
}

/* ── Profile dropdown items ── */
.nb-pi{transition:background .1s;border-radius:10px}
.nb-pi:hover{background:#f1f5f9!important;color:#0f172a!important}

/* ── Mobile dock ── */
.nb-db{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:3px;flex:1;
  padding:8px 6px 6px;background:none;border:none;cursor:pointer;
  -webkit-tap-highlight-color:transparent;outline:none;
  font-family:inherit;transition:all .15s;border-radius:18px;
}
.nb-db:active{transform:scale(.88)}
.nb-db .nb-di{transition:transform .22s cubic-bezier(.34,1.56,.64,1)}
.nb-db.nb-da .nb-di{transform:scale(1.15) translateY(-2px)}

@media(max-width:680px){
  .nb-topbar{display:none!important}
  .nb-sp{display:none!important}
  .nb-dk{display:flex!important}
  .nb-dkp{display:block!important}
}
@media(min-width:681px){
  .nb-dk{display:none!important}
  .nb-dkp{display:none!important}
}
`

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
    <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(15,23,42,.3)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80, animation: 'nb-fadein .12s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 500, margin: '0 16px', background: '#fff', borderRadius: 22, boxShadow: '0 32px 80px rgba(0,0,0,.16), 0 0 0 1px rgba(0,0,0,.06)', overflow: 'hidden', animation: 'nb-slidein .16s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <span style={{ color: '#94a3b8' }}><IcSearch /></span>
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
        <div style={{ padding: '6px 8px 8px' }}>
          {res.length === 0
            ? <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '18px 0', margin: 0 }}>Sin resultados</p>
            : res.map((l, i) => (
              <button key={l.href} className="nb-pi"
                onMouseEnter={() => setCur(i)}
                onClick={() => go(l.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: '10px 10px', border: 'none', background: i === cur ? '#f8fafc' : 'transparent', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', outline: i === cur ? '1.5px solid #e8ecf0' : 'none', transition: 'all .1s' }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, background: i === cur ? '#f0fdf4' : '#f8fafc', border: `1px solid ${i === cur ? '#bbf7d0' : '#f0f2f5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === cur ? '#0f766e' : '#64748b', flexShrink: 0 }}>
                  {IC[LINKS.findIndex(x => x.href === l.href)]?.()}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1, textAlign: 'left' }}>{l.label}</span>
                <kbd style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#94a3b8', fontFamily: 'inherit' }}>{l.shortcut}</kbd>
              </button>
            ))
          }
        </div>
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '7px 16px', display: 'flex', gap: 14 }}>
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

/* ─── Profile dropdown ────────────────────────────────────────── */
const Prof = memo(({ close }: { close: () => void }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) close() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [close])

  return (
    <div ref={ref} style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, minWidth: 220, background: '#fff', borderRadius: 18, boxShadow: '0 20px 60px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.06)', overflow: 'hidden', animation: 'nb-fadedown .16s cubic-bezier(.22,1,.36,1)', zIndex: 300 }}>
      <div style={{ padding: '13px 13px 11px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>M</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Miguel L.</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '1px 0 0' }}>soporte@samgple.com</p>
          </div>
        </div>
      </div>
      <div style={{ padding: '6px 6px 0' }}>
        <Link href="/configuracion" onClick={close} className="nb-pi"
          style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', color: '#374151', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
          <span style={{ color: '#94a3b8' }}><IcCog /></span>Configuración
        </Link>
      </div>
      <div style={{ borderTop: '1px solid #f1f5f9', padding: '6px 6px 8px', marginTop: 4 }}>
        <button className="nb-pi" onClick={close}
          style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 10px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#ef4444', fontFamily: 'inherit' }}>
          <IcLogout />Cerrar sesión
        </button>
      </div>
    </div>
  )
})
Prof.displayName = 'Prof'

/* ─── Mobile dock ─────────────────────────────────────────────── */
const Dock = memo(({ ai, go }: { ai: number; go: (i: number) => void }) => (
  <div className="nb-dk" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, display: 'none', justifyContent: 'center', padding: '0 16px calc(env(safe-area-inset-bottom,10px) + 10px)', pointerEvents: 'none' }}>
    <nav style={{
      pointerEvents: 'all', display: 'flex', alignItems: 'stretch',
      background: 'rgba(255,255,255,.97)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: 26, border: '1.5px solid #e8edf2',
      boxShadow: '0 8px 32px rgba(0,0,0,.1)',
      padding: '6px 8px', gap: 2,
      animation: 'nb-dock .28s cubic-bezier(.22,1,.36,1)',
      width: '100%', maxWidth: 380,
    }}>
      {LINKS.map((l, i) => {
        const a = i === ai
        return (
          <button key={l.href} className={`nb-db${a ? ' nb-da' : ''}`} onClick={() => go(i)}
            style={{ color: a ? '#0f766e' : '#94a3b8', background: a ? '#f0fdf4' : 'transparent', border: `1.5px solid ${a ? '#bbf7d0' : 'transparent'}`, borderRadius: 18, transition: 'all .18s' }}>
            <span className="nb-di">{IC[i]?.(a)}</span>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', lineHeight: 1, whiteSpace: 'nowrap', maxHeight: a ? 14 : 0, overflow: 'hidden', opacity: a ? 1 : 0, transform: a ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity .18s,transform .18s,max-height .18s' }}>
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
   MAIN — lógica original intacta
═══════════════════════════════════════════════════════════════ */
export default function NavBottom() {
  const pathname = usePathname()
  const router   = useRouter()

  const activeIndex = useMemo(() => {
    const idx = LINKS.findIndex(l => pathname.startsWith(l.href))
    return idx >= 0 ? idx : 0
  }, [pathname])

  function handleMobileNavigate(index: number) {
    router.push(LINKS[index].href)
  }

  const tokens = 0.17

  const [cmd,  setCmd]  = useState(false)
  const [prof, setProf] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'k') { e.preventDefault(); setCmd(o => !o); return }
      if (cmd) return
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
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

      {/* ── TOPBAR FLOTANTE (desktop) ── */}
      <header className="nb-topbar" style={{
        position: 'fixed', top: 14, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100, width: 'calc(100% - 48px)', maxWidth: 900,
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,.92)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderRadius: 18,
        border: '1.5px solid rgba(0,0,0,.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.8) inset',
        padding: '7px 10px',
        gap: 4,
      }}>

        {/* Logo */}
        <Link href="/pedidos" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px', borderRadius: 11, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(46,196,182,.3)', color: '#fff' }}>
            <IcZap />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '-.3px' }}>
            SAMG<span style={{ color: '#2EC4B6' }}>PLE</span>
          </span>
        </Link>

        {/* Separador */}
        <div style={{ width: 1, height: 20, background: '#e8edf2', margin: '0 4px', flexShrink: 0 }} />

        {/* Nav links — centro */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {LINKS.map((l, i) => {
            const active = pathname.startsWith(l.href)
            return (
              <button key={l.href} className={`nb-link${active ? ' nb-on' : ''}`}
                onClick={() => goItem(l.href)}
                style={{ color: active ? '#0f766e' : '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', color: active ? '#0f766e' : '#94a3b8' }}>
                  {IC[i]?.(active)}
                </span>
                {l.label}
              </button>
            )
          })}
        </nav>

        {/* Derecha: tokens + búsqueda + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

          {/* Tokens pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 99, background: 'rgba(46,196,182,.08)', border: '1.5px solid rgba(46,196,182,.18)' }}>
            <span style={{ color: '#2EC4B6', display: 'flex' }}><IcZap /></span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e' }}>{tokens} tkn</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px rgba(34,197,94,.5)', animation: 'nb-live 2s ease-in-out infinite' }} />
          </div>

          {/* Buscar */}
          <button onClick={() => setCmd(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', borderRadius: 11, border: '1.5px solid #e8edf2', background: '#f8fafc', cursor: 'pointer', color: '#94a3b8', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, transition: 'all .15s', outline: 'none' }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.background = '#f1f5f9'; b.style.borderColor = '#dde3ea' }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.background = '#f8fafc'; b.style.borderColor = '#e8edf2' }}>
            <IcSearch />
            <kbd style={{ fontSize: 10, padding: '1px 5px', borderRadius: 5, background: '#fff', border: '1px solid #e2e8f0', color: '#94a3b8', fontFamily: 'inherit' }}>⌘K</kbd>
          </button>

          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            {prof && <Prof close={() => setProf(false)} />}
            <button onClick={() => setProf(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 10px 5px 5px', borderRadius: 12, border: '1.5px solid #e8edf2', background: prof ? '#f1f5f9' : '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s', outline: 'none' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc' }}
              onMouseLeave={e => { if (!prof) (e.currentTarget as HTMLButtonElement).style.background = '#fff' }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>M</div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>Miguel L.</span>
              <span style={{ color: '#94a3b8' }}>{prof ? <IcChevU /> : <IcChevD />}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Spacer para que el contenido no quede debajo del navbar */}
      <div className="nb-sp" style={{ height: 72, flexShrink: 0 }} aria-hidden />

      {/* ── MOBILE DOCK ── */}
      <Dock ai={activeIndex} go={handleMobileNavigate} />
      <div className="nb-dkp" style={{ height: 80, display: 'none' }} aria-hidden />
    </>
  )
}