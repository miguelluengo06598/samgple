'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, {
  useState, useRef, useEffect, useMemo, useCallback, memo,
} from 'react'

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
interface NavLink {
  href: string
  label: string
  shortcut: string
  icon: React.ReactNode
  iconActive: React.ReactNode
}

/* ═══════════════════════════════════════════════════════════════
   ICONS — SVG inline, zero deps, Lucide-style strokes
═══════════════════════════════════════════════════════════════ */
const ic = (paths: string, w = 1.7) => (active = false, sz = 16) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? w + 0.4 : w}
    strokeLinecap="round" strokeLinejoin="round">
    {paths.split('|').map((d, i) => <path key={i} d={d}/>)}
  </svg>
)

const IcFinanzas     = ic('M2 20h20|M6 20V10|M10 20V4|M14 20V14|M18 20V8')
const IcPedidos      = ic('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2|M9 5a2 2 0 002 2h2a2 2 0 002-2|M9 5a2 2 0 012-2h2a2 2 0 012 2|M9 12h6|M9 16h4')
const IcTienda       = ic('M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z|M3 6h18|M16 10a4 4 0 01-8 0')
const IcHerramientas = ic('M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z')
const IcCuenta       = ic('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2|M12 11a4 4 0 100-8 4 4 0 000 8z')
const IcSearch       = ic('M21 21l-4.35-4.35|M17 11A6 6 0 115 11a6 6 0 0112 0z', 1.8)
const IcZap = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
const IcChevL = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
const IcChevR = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
const IcLogout = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4|M16 17l5-5-5-5|M21 12H9"/></svg>
const IcSettings = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>

/* ═══════════════════════════════════════════════════════════════
   NAV CONFIG
═══════════════════════════════════════════════════════════════ */
const LINKS: NavLink[] = [
  { href: '/finanzas',      label: 'Finanzas',    shortcut: 'F', icon: IcFinanzas(false), iconActive: IcFinanzas(true) },
  { href: '/pedidos',       label: 'Pedidos',      shortcut: 'P', icon: IcPedidos(false),  iconActive: IcPedidos(true)  },
  { href: '/tienda',        label: 'Tienda',       shortcut: 'T', icon: IcTienda(false),   iconActive: IcTienda(true)   },
  { href: '/herramientas',  label: 'Herramientas', shortcut: 'H', icon: IcHerramientas(false), iconActive: IcHerramientas(true) },
  { href: '/configuracion', label: 'Cuenta',       shortcut: 'C', icon: IcCuenta(false),   iconActive: IcCuenta(true)   },
]

/* ═══════════════════════════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════════════════════════ */
const CSS = `
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Keyframes ─────────────────────────────────────── */
  @keyframes nb-fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes nb-slide-up  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes nb-slide-rt  { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
  @keyframes nb-pop       { from{opacity:0;transform:scale(0.95) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes nb-pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.7)} }
  @keyframes nb-glow      { 0%,100%{box-shadow:0 0 7px rgba(46,196,182,.4)} 50%{box-shadow:0 0 14px rgba(46,196,182,.7)} }
  @keyframes nb-cmd-in    { from{opacity:0;transform:translateY(-10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes nb-float-in  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }

  /* ── Sidebar width transition ── */
  .nb-sidebar {
    transition: width .2s cubic-bezier(.22,1,.36,1);
    will-change: width;
  }

  /* ── Nav item: CSS-only hover (zero JS re-render on hover) ── */
  .nb-item {
    display: flex; align-items: center; width: 100%;
    border: none; background: transparent; cursor: pointer;
    font-family: inherit; border-radius: 10px;
    outline: none; -webkit-tap-highlight-color: transparent;
    transition: background .1s, color .1s;
    position: relative;
  }
  .nb-item:not(.nb-active):hover  { background: #f1f5f9 !important; color: #334155 !important; }
  .nb-item:active                 { transform: scale(.97); }
  .nb-item.nb-active              { background: rgba(46,196,182,.09) !important; color: #0f766e !important; }
  /* icon scale on hover via CSS */
  .nb-item:hover .nb-icon         { transform: scale(1.1); }
  .nb-item .nb-icon               { transition: transform .15s cubic-bezier(.34,1.56,.64,1); }
  /* kbd: hide until hover/active */
  .nb-item .nb-kbd                { opacity:0; transition: opacity .12s; }
  .nb-item:hover .nb-kbd,
  .nb-item.nb-active .nb-kbd      { opacity:1; }

  /* ── Tooltip ── */
  .nb-tip {
    position: absolute; left: calc(100% + 10px); top: 50%;
    transform: translateY(-50%);
    background: #0f172a; color: #f8fafc;
    font-size: 12px; font-weight: 600;
    padding: 5px 10px; border-radius: 8px;
    white-space: nowrap; pointer-events: none; z-index: 300;
    display: flex; align-items: center; gap: 7px;
    box-shadow: 0 4px 16px rgba(0,0,0,.18);
    animation: nb-slide-rt .12s ease;
  }

  /* ── Cmd palette ── */
  .nb-cmd-result:hover { background: #f8fafc !important; }
  .nb-cmd-result:active { background: #f1f5f9 !important; }

  /* ── Profile dropdown ── */
  .nb-prof-item:hover { background: #f8fafc !important; }

  /* ── Mobile dock button ── */
  .nb-dock-btn {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 3px;
    flex: 1; height: 100%; padding: 8px 4px 6px;
    background: none; border: none; cursor: pointer;
    -webkit-tap-highlight-color: transparent; outline: none;
    font-family: inherit;
    transition: color .18s;
    border-radius: 14px;
  }
  .nb-dock-btn:active { transform: scale(.91); transition: transform .1s; }
  .nb-dock-btn .nb-dock-icon {
    transition: transform .2s cubic-bezier(.34,1.56,.64,1);
  }
  .nb-dock-btn.nb-dock-active .nb-dock-icon {
    transform: scale(1.18) translateY(-2px);
  }

  /* ── Search trigger ── */
  .nb-search-btn:hover {
    background: #f1f5f9 !important;
    border-color: #e2e8f0 !important;
  }

  /* ── Scrollbar ── */
  .nb-scroll::-webkit-scrollbar       { width: 2px; }
  .nb-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .nb-sidebar-wrap { display: none !important; }
    .nb-sidebar-spacer { display: none !important; }
    .nb-dock-wrap { display: flex !important; }
    .nb-dock-spacer { display: block !important; }
  }
  @media (min-width: 681px) {
    .nb-dock-wrap  { display: none !important; }
    .nb-dock-spacer { display: none !important; }
  }
`

/* ═══════════════════════════════════════════════════════════════
   TOOLTIP
═══════════════════════════════════════════════════════════════ */
const Tooltip = memo(({ label, shortcut }: { label: string; shortcut: string }) => (
  <div className="nb-tip">
    {label}
    <kbd style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.16)', fontFamily: 'inherit' }}>
      {shortcut}
    </kbd>
  </div>
))
Tooltip.displayName = 'Tooltip'

/* ═══════════════════════════════════════════════════════════════
   COMMAND PALETTE
═══════════════════════════════════════════════════════════════ */
const CommandPalette = memo(({ open, onClose, onNavigate }: {
  open: boolean; onClose: () => void; onNavigate: (href: string) => void
}) => {
  const [q, setQ] = useState('')
  const [cur, setCur] = useState(0)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setQ(''); setCur(0); setTimeout(() => ref.current?.focus(), 40) }
  }, [open])

  const results = useMemo(() =>
    LINKS.filter(l => l.label.toLowerCase().includes(q.toLowerCase()) || l.href.includes(q.toLowerCase())),
    [q])

  useEffect(() => { setCur(0) }, [q])

  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(15,23,42,.5)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 'min(10vh,96px)', animation: 'nb-fade-in .14s ease' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 520, margin: '0 16px', background: '#fff', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.06)', overflow: 'hidden', animation: 'nb-cmd-in .16s cubic-bezier(.22,1,.36,1)' }}
      >
        {/* Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
          {IcSearch(false, 16)}
          <input
            ref={ref} value={q} onChange={e => setQ(e.target.value)}
            placeholder="Navegar a…"
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#0f172a', fontFamily: 'inherit', fontWeight: 500, background: 'transparent' }}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'ArrowDown') { e.preventDefault(); setCur(c => Math.min(c+1, results.length-1)) }
              if (e.key === 'ArrowUp')   { e.preventDefault(); setCur(c => Math.max(c-1, 0)) }
              if (e.key === 'Enter' && results[cur]) onNavigate(results[cur].href)
            }}
          />
          <kbd onClick={onClose} style={{ fontSize: 11, padding: '3px 7px', borderRadius: 7, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>Esc</kbd>
        </div>
        {/* Results */}
        <div style={{ padding: '6px 8px 8px' }}>
          {results.length === 0
            ? <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '20px 0', margin: 0 }}>Sin resultados para "{q}"</p>
            : results.map((link, i) => (
              <button key={link.href}
                className="nb-cmd-result"
                onMouseEnter={() => setCur(i)}
                onClick={() => onNavigate(link.href)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '9px 11px', border: 'none', background: i === cur ? '#f8fafc' : 'transparent', borderRadius: 11, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', outline: i === cur ? '1.5px solid #e2e8f0' : 'none' }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0 }}>
                  {link.icon}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', flex: 1 }}>{link.label}</span>
                <kbd style={{ fontSize: 10, padding: '2px 6px', borderRadius: 5, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#94a3b8', fontFamily: 'inherit' }}>{link.shortcut}</kbd>
              </button>
            ))
          }
        </div>
        {/* Footer */}
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '7px 16px', display: 'flex', gap: 14 }}>
          {[['↵','Ir'],['↑↓','Mover'],['Esc','Cerrar']].map(([k,v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
              <kbd style={{ padding: '1px 5px', borderRadius: 4, background: '#f8fafc', border: '1px solid #e2e8f0', fontFamily: 'inherit', fontSize: 10 }}>{k}</kbd>{v}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})
CommandPalette.displayName = 'CommandPalette'

/* ═══════════════════════════════════════════════════════════════
   TOKEN BADGE
═══════════════════════════════════════════════════════════════ */
const TokenBadge = memo(({ collapsed, tokens }: { collapsed: boolean; tokens: number }) => {
  const pct   = Math.min((tokens / 1) * 100, 100)
  const color = tokens < 0.1 ? '#ef4444' : tokens < 0.5 ? '#f59e0b' : '#2EC4B6'

  if (collapsed) return (
    <div title={`${tokens} tokens`}
      style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(46,196,182,.08)', border: '1.5px solid rgba(46,196,182,.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2EC4B6', cursor: 'default' }}>
      <IcZap />
    </div>
  )

  return (
    <div style={{ borderRadius: 13, padding: '10px 12px', background: 'rgba(46,196,182,.05)', border: '1px solid rgba(46,196,182,.13)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(46,196,182,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2EC4B6' }}>
            <IcZap />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e' }}>Tokens</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>
          {tokens}
        </span>
      </div>
      <div style={{ height: 3, borderRadius: 3, background: 'rgba(46,196,182,.1)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: `linear-gradient(90deg,${color},${color}bb)`, animation: 'nb-glow 2.8s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
        <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Plan Starter</span>
        <span style={{ fontSize: 10, color: '#2EC4B6', fontWeight: 700 }}>Activo</span>
      </div>
    </div>
  )
})
TokenBadge.displayName = 'TokenBadge'

/* ═══════════════════════════════════════════════════════════════
   PROFILE DROPDOWN — aparece encima del avatar
═══════════════════════════════════════════════════════════════ */
const ProfileDropdown = memo(({ collapsed, onClose }: { collapsed: boolean; onClose: () => void }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div ref={ref}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: collapsed ? 'calc(100% + 10px)' : 0,
        right: collapsed ? 'auto' : 0,
        minWidth: 220,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 -4px 0 0 rgba(0,0,0,.03), 0 20px 60px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.06)',
        overflow: 'hidden',
        animation: 'nb-pop .18s cubic-bezier(.22,1,.36,1)',
        zIndex: 200,
      }}>
      {/* User info */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid #f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            M
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Miguel L.
            </p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              hola@samgple.com
            </p>
          </div>
        </div>
      </div>
      {/* Menu items */}
      <div style={{ padding: '6px 6px' }}>
        {[
          { Icon: IcSettings, label: 'Configuración', href: '/configuracion' },
        ].map(({ Icon, label, href }) => (
          <Link key={href} href={href}
            onClick={onClose}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 10, color: '#374151', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}
            className="nb-prof-item">
            <Icon />
            {label}
          </Link>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #f8fafc', padding: '6px 6px 8px' }}>
        <button
          className="nb-prof-item"
          style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '9px 10px', borderRadius: 10, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#ef4444', fontFamily: 'inherit' }}
          onClick={() => { onClose(); /* tu handler de logout aquí */ }}>
          <IcLogout />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
})
ProfileDropdown.displayName = 'ProfileDropdown'

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR ITEM
═══════════════════════════════════════════════════════════════ */
const SidebarItem = memo(({ link, isActive, collapsed, onClick }: {
  link: NavLink; isActive: boolean; collapsed: boolean; onClick: () => void
}) => {
  const [hovered, setHovered] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        className={`nb-item${isActive ? ' nb-active' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          gap: collapsed ? 0 : 9,
          padding: collapsed ? '9px' : '8px 10px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          color: isActive ? '#0f766e' : '#64748b',
        }}
      >
        {/* Active pill */}
        {isActive && (
          <span style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: 3, borderRadius: '0 3px 3px 0', background: '#2EC4B6', boxShadow: '0 0 8px rgba(46,196,182,.55)' }} />
        )}
        <span className="nb-icon" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isActive ? link.iconActive : link.icon}
        </span>
        {!collapsed && (
          <>
            <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, letterSpacing: '-.15px', flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {link.label}
            </span>
            <kbd className="nb-kbd"
              style={{ fontSize: 9, padding: '2px 5px', borderRadius: 5, background: isActive ? 'rgba(46,196,182,.12)' : '#f1f5f9', border: `1px solid ${isActive ? 'rgba(46,196,182,.2)' : '#e8edf2'}`, color: isActive ? '#0f766e' : '#94a3b8', fontFamily: 'inherit', flexShrink: 0 }}>
              {link.shortcut}
            </kbd>
          </>
        )}
      </button>
      {collapsed && hovered && <Tooltip label={link.label} shortcut={link.shortcut} />}
    </div>
  )
})
SidebarItem.displayName = 'SidebarItem'

/* ═══════════════════════════════════════════════════════════════
   MOBILE DOCK — floating pill, macOS-dock style
═══════════════════════════════════════════════════════════════ */
const MobileDock = memo(({ activeIndex, onNavigate }: {
  activeIndex: number; onNavigate: (i: number) => void
}) => (
  <div className="nb-dock-wrap"
    style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, display: 'none', justifyContent: 'center', padding: '0 0 calc(env(safe-area-inset-bottom, 8px) + 8px)', pointerEvents: 'none' }}>
    <nav
      style={{
        pointerEvents: 'all',
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,.93)',
        backdropFilter: 'blur(28px) saturate(200%)',
        WebkitBackdropFilter: 'blur(28px) saturate(200%)',
        borderRadius: 9999,
        border: '1px solid rgba(226,232,240,.7)',
        boxShadow: '0 8px 32px rgba(0,0,0,.1), 0 1px 0 rgba(255,255,255,.9) inset',
        padding: '5px 6px',
        gap: 2,
        animation: 'nb-float-in .35s cubic-bezier(.22,1,.36,1)',
      }}
    >
      {LINKS.map((link, i) => {
        const isActive = i === activeIndex
        return (
          <button key={link.href}
            className={`nb-dock-btn${isActive ? ' nb-dock-active' : ''}`}
            onClick={() => onNavigate(i)}
            style={{ color: isActive ? '#0f766e' : '#94a3b8', minWidth: 54, borderRadius: 9999, background: isActive ? 'rgba(46,196,182,.09)' : 'transparent', transition: 'background .15s, color .15s' }}>
            <span className="nb-dock-icon">
              {isActive ? link.iconActive : link.icon}
            </span>
            {/* Label: only active, slides in */}
            <span style={{
              fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.04em', lineHeight: 1,
              maxHeight: isActive ? 14 : 0,
              overflow: 'hidden',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(4px)',
              transition: 'opacity .2s, transform .2s, max-height .2s',
              whiteSpace: 'nowrap',
            }}>
              {link.label}
            </span>
          </button>
        )
      })}
    </nav>
  </div>
))
MobileDock.displayName = 'MobileDock'

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function NavBottom() {
  // ── LÓGICA ORIGINAL INTACTA ────────────────────────────────
  const pathname = usePathname()
  const router   = useRouter()

  const activeIndex = useMemo(() => {
    const idx = LINKS.findIndex(l => pathname.startsWith(l.href))
    return idx >= 0 ? idx : 0
  }, [pathname])

  function handleMobileNavigate(index: number) {
    router.push(LINKS[index].href)
  }
  // ── FIN LÓGICA ORIGINAL ────────────────────────────────────

  const tokens = 0.17  // ← reemplaza con props/context en producción

  const [collapsed,    setCollapsed]    = useState(false)
  const [cmdOpen,      setCmdOpen]      = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)

  const sidebarW = collapsed ? 60 : 220

  // ── Keyboard shortcuts (lógica original intacta) ──────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o); return }
      if (cmdOpen) return
      const tag = (document.activeElement as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === '[' && !mod) { setCollapsed(o => !o); return }
      LINKS.forEach(link => {
        if (e.key.toUpperCase() === link.shortcut && !mod) { e.preventDefault(); router.push(link.href) }
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cmdOpen, router])

  const handleCmd  = useCallback((href: string) => { setCmdOpen(false); router.push(href) }, [router])
  const handleItem = useCallback((href: string) => { router.push(href) }, [router])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ── Command palette ── */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={handleCmd} />

      {/* ── Desktop Sidebar ── */}
      <aside
        className="nb-sidebar-wrap nb-sidebar"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: sidebarW, zIndex: 100,
          display: 'flex', flexDirection: 'column',
          background: '#fff',
          borderRight: '1px solid #f0f2f5',
        }}
      >
        {/* Logo + collapse toggle */}
        <div style={{
          height: 56, flexShrink: 0,
          display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0 12px' : '0 12px 0 14px',
          borderBottom: '1px solid #f8fafc',
        }}>
          {collapsed
            ? <Link href="/pedidos" style={{ textDecoration: 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(46,196,182,.28)', color: '#fff' }}>
                  <IcZap />
                </div>
              </Link>
            : <>
                <Link href="/pedidos" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(46,196,182,.28)', flexShrink: 0, color: '#fff' }}>
                    <IcZap />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', letterSpacing: '-.4px' }}>
                    SAMG<span style={{ color: '#2EC4B6' }}>PLE</span>
                  </span>
                </Link>
                <button onClick={() => setCollapsed(true)}
                  style={{ width: 24, height: 24, borderRadius: 7, border: '1px solid #f0f2f5', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', flexShrink: 0, transition: 'background .12s' }}
                  title="Colapsar  [">
                  <IcChevL />
                </button>
              </>
          }
        </div>

        {/* Cmd+K search */}
        <div style={{ padding: '10px 10px 6px', flexShrink: 0 }}>
          <button
            className="nb-search-btn"
            onClick={() => setCmdOpen(true)}
            style={{
              width: '100%', padding: collapsed ? '8px' : '7px 10px',
              borderRadius: 10, border: '1.5px solid #f0f2f5',
              background: '#f8fafc', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 7, color: '#94a3b8', transition: 'all .12s',
              fontFamily: 'inherit',
            }}>
            {IcSearch(false, 13)}
            {!collapsed && (
              <>
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, textAlign: 'left' }}>Ir a…</span>
                <kbd style={{ fontSize: 10, padding: '1px 5px', borderRadius: 5, background: '#fff', border: '1px solid #e8edf2', color: '#94a3b8', fontFamily: 'inherit' }}>⌘K</kbd>
              </>
            )}
          </button>
        </div>

        {/* Section label */}
        {!collapsed && (
          <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.1em', margin: '6px 0 2px', padding: '0 14px' }}>
            Menú
          </p>
        )}

        {/* Nav items */}
        <nav className="nb-scroll"
          style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: collapsed ? '2px 10px' : '2px 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {LINKS.map(link => (
            <SidebarItem
              key={link.href}
              link={link}
              isActive={pathname.startsWith(link.href)}
              collapsed={collapsed}
              onClick={() => handleItem(link.href)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: collapsed ? '10px' : '10px 10px', borderTop: '1px solid #f8fafc', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

          {/* Live dot */}
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', borderRadius: 10, background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.1)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,.6)', animation: 'nb-pulse-dot 2.5s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d', flex: 1 }}>Panel activo</span>
              <span style={{ fontSize: 10, color: '#94a3b8' }}>En vivo</span>
            </div>
          )}

          {/* Tokens */}
          <TokenBadge collapsed={collapsed} tokens={tokens} />

          {/* Expand button when collapsed */}
          {collapsed && (
            <button onClick={() => setCollapsed(false)}
              style={{ width: '100%', padding: '8px', border: '1px solid #f0f2f5', borderRadius: 10, background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
              title="Expandir">
              <IcChevR />
            </button>
          )}

          {/* Profile avatar — with dropdown */}
          <div style={{ position: 'relative' }}>
            {profileOpen && (
              <ProfileDropdown collapsed={collapsed} onClose={() => setProfileOpen(false)} />
            )}
            <button
              onClick={() => setProfileOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 9,
                width: '100%', padding: collapsed ? '6px' : '7px 8px',
                borderRadius: 11, border: 'none', background: profileOpen ? '#f1f5f9' : 'transparent',
                cursor: 'pointer', fontFamily: 'inherit',
                justifyContent: collapsed ? 'center' : 'flex-start',
                transition: 'background .12s',
              }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                M
              </div>
              {!collapsed && (
                <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Miguel L.
                  </p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>
                    Starter
                  </p>
                </div>
              )}
              {!collapsed && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                  <polyline points={profileOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                </svg>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar spacer — empuja el contenido principal */}
      <div className="nb-sidebar-spacer nb-sidebar" style={{ width: sidebarW, flexShrink: 0 }} aria-hidden />

      {/* ── Mobile floating dock ── */}
      <MobileDock activeIndex={activeIndex} onNavigate={handleMobileNavigate} />

      {/* Mobile spacer (evita que el contenido quede debajo del dock) */}
      <div className="nb-dock-spacer" style={{ height: 72, display: 'none' }} aria-hidden />
    </>
  )
}