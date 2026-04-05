'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavLink {
  href: string
  label: string
  shortcut: string
  Icon: React.FC<{ size?: number; active?: boolean }>
}

// ─── SVG Icons (inline, zero deps) ───────────────────────────────────────────
const IconFinanzas = ({ size = 16, active }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    <path d="M2 17l10 5 10-5"/>
    <path d="M2 12l10 5 10-5"/>
  </svg>
)

const IconPedidos = ({ size = 16, active }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8M12 17v4"/>
  </svg>
)

const IconTienda = ({ size = 16, active }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)

const IconHerramientas = ({ size = 16, active }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
)

const IconCuenta = ({ size = 16, active }: { size?: number; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={active ? 2.1 : 1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
)

const IconChevronLeft = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const IconSearch = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const IconZap = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
)

const IconClose = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// ─── Nav config (hoisted — static, no re-creation) ───────────────────────────
const LINKS: NavLink[] = [
  { href: '/finanzas',      label: 'Finanzas',     shortcut: 'F', Icon: IconFinanzas },
  { href: '/pedidos',       label: 'Pedidos',       shortcut: 'P', Icon: IconPedidos },
  { href: '/tienda',        label: 'Tienda',        shortcut: 'T', Icon: IconTienda },
  { href: '/herramientas',  label: 'Herramientas',  shortcut: 'H', Icon: IconHerramientas },
  { href: '/configuracion', label: 'Cuenta',        shortcut: 'C', Icon: IconCuenta },
]

// ─── Tooltip (sidebar collapsed state) ───────────────────────────────────────
const Tooltip = memo(function Tooltip({ label, shortcut }: { label: string; shortcut: string }) {
  return (
    <div style={{
      position: 'absolute', left: '100%', top: '50%',
      transform: 'translateY(-50%)',
      marginLeft: 10, zIndex: 200,
      background: '#0f172a', color: '#f8fafc',
      fontSize: 12, fontWeight: 600,
      padding: '5px 10px', borderRadius: 8,
      whiteSpace: 'nowrap', pointerEvents: 'none',
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      letterSpacing: '-0.1px',
    }}>
      {label}
      <kbd style={{
        fontSize: 10, padding: '2px 5px', borderRadius: 5,
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.18)',
        fontFamily: 'inherit', lineHeight: 1.4,
      }}>{shortcut}</kbd>
    </div>
  )
})

// ─── Command palette (Cmd+K) ──────────────────────────────────────────────────
const CommandPalette = memo(function CommandPalette({
  open, onClose, onNavigate,
}: {
  open: boolean
  onClose: () => void
  onNavigate: (href: string) => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const results = useMemo(() =>
    LINKS.filter(l =>
      l.label.toLowerCase().includes(query.toLowerCase()) ||
      l.href.toLowerCase().includes(query.toLowerCase())
    ), [query])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 'min(12vh, 120px)',
        animation: 'cmd-fadein 0.15s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 20,
          width: '100%', maxWidth: 520,
          margin: '0 16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          animation: 'cmd-slidein 0.18s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px',
          borderBottom: '1px solid #f1f5f9',
        }}>
          <IconSearch size={16} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Navegar a…"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, color: '#0f172a',
              fontFamily: 'inherit', fontWeight: 500,
              background: 'transparent',
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'Enter' && results.length > 0) {
                onNavigate(results[0].href)
              }
            }}
          />
          <kbd
            onClick={onClose}
            style={{
              fontSize: 11, padding: '3px 7px', borderRadius: 7,
              background: '#f1f5f9', border: '1px solid #e2e8f0',
              color: '#64748b', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div style={{ padding: '8px 10px 10px' }}>
          {results.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '20px 0', margin: 0 }}>
              Sin resultados para "{query}"
            </p>
          ) : (
            results.map(link => {
              const { Icon } = link
              return (
                <button
                  key={link.href}
                  onClick={() => onNavigate(link.href)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    width: '100%', padding: '10px 12px',
                    border: 'none', background: 'transparent',
                    borderRadius: 12, cursor: 'pointer',
                    textAlign: 'left', fontFamily: 'inherit',
                    transition: 'background 0.1s',
                  }}
                  className="cmd-result"
                >
                  <span style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: '#f8fafc', border: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#475569', flexShrink: 0,
                  }}>
                    <Icon size={15} />
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', flex: 1 }}>
                    {link.label}
                  </span>
                  <kbd style={{
                    fontSize: 11, padding: '2px 6px', borderRadius: 6,
                    background: '#f1f5f9', border: '1px solid #e2e8f0',
                    color: '#94a3b8', fontFamily: 'inherit',
                  }}>
                    {link.shortcut}
                  </kbd>
                </button>
              )
            })
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          padding: '8px 18px',
          display: 'flex', gap: 16,
        }}>
          {[['↵', 'Ir'], ['↑↓', 'Navegar'], ['Esc', 'Cerrar']].map(([k, v]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
              <kbd style={{
                padding: '1px 5px', borderRadius: 5,
                background: '#f8fafc', border: '1px solid #e2e8f0',
                fontFamily: 'inherit', fontSize: 10,
              }}>{k}</kbd>
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
})

// ─── Token badge ──────────────────────────────────────────────────────────────
const TokenBadge = memo(function TokenBadge({ collapsed }: { collapsed: boolean }) {
  const tokens = 0.17 // ← valor real; en prod vendría de props/context
  const pct = Math.min((tokens / 1) * 100, 100)

  if (collapsed) {
    return (
      <div
        title={`${tokens} tokens disponibles`}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'rgba(46,196,182,0.08)',
          border: '1.5px solid rgba(46,196,182,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'default',
        }}
      >
        <IconZap size={13} style={{ color: '#2EC4B6' }} />
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(46,196,182,0.06)',
      border: '1px solid rgba(46,196,182,0.16)',
      borderRadius: 14, padding: '10px 13px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 7,
            background: 'rgba(46,196,182,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#2EC4B6',
          }}>
            <IconZap size={11} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', letterSpacing: '-0.1px' }}>
            Tokens
          </span>
        </div>
        <span style={{
          fontSize: 13, fontWeight: 800, color: '#0f172a',
          letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums',
        }}>
          {tokens}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, borderRadius: 4, background: 'rgba(46,196,182,0.12)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          borderRadius: 4,
          background: 'linear-gradient(90deg, #2EC4B6, #1A9E8F)',
          boxShadow: '0 0 8px rgba(46,196,182,0.45)',
          animation: 'token-glow 3s ease-in-out infinite',
        }} />
      </div>

      <p style={{ fontSize: 10, color: '#94a3b8', margin: '5px 0 0', fontWeight: 500 }}>
        Plan Starter · <span style={{ color: '#2EC4B6', fontWeight: 700 }}>Activo</span>
      </p>
    </div>
  )
})

// ─── Sidebar nav item ─────────────────────────────────────────────────────────
const SidebarItem = memo(function SidebarItem({
  link, isActive, collapsed, onClick,
}: {
  link: NavLink
  isActive: boolean
  collapsed: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const { Icon } = link

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={collapsed ? link.label : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: collapsed ? 0 : 10,
          width: '100%',
          padding: collapsed ? '10px' : '9px 12px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius: 11,
          border: 'none',
          background: isActive
            ? 'rgba(46,196,182,0.08)'
            : hovered
            ? 'rgba(241,245,249,0.8)'
            : 'transparent',
          color: isActive ? '#0f766e' : hovered ? '#475569' : '#64748b',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.12s ease',
          position: 'relative',
          outline: 'none',
        }}
      >
        {/* Active indicator bar */}
        {isActive && (
          <span style={{
            position: 'absolute', left: 0, top: '20%', bottom: '20%',
            width: 3, borderRadius: '0 3px 3px 0',
            background: '#2EC4B6',
            boxShadow: '0 0 8px rgba(46,196,182,0.5)',
          }} />
        )}

        <span style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.15s',
          transform: isActive ? 'scale(1.05)' : 'scale(1)',
        }}>
          <Icon size={17} active={isActive} />
        </span>

        {!collapsed && (
          <span style={{
            fontSize: 13, fontWeight: isActive ? 700 : 500,
            letterSpacing: '-0.15px', flex: 1, textAlign: 'left',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {link.label}
          </span>
        )}

        {!collapsed && (
          <kbd style={{
            fontSize: 10, padding: '2px 5px', borderRadius: 5,
            background: isActive ? 'rgba(46,196,182,0.12)' : '#f1f5f9',
            border: `1px solid ${isActive ? 'rgba(46,196,182,0.2)' : '#e2e8f0'}`,
            color: isActive ? '#0f766e' : '#94a3b8',
            fontFamily: 'inherit', flexShrink: 0,
            opacity: hovered || isActive ? 1 : 0,
            transition: 'opacity 0.15s',
          }}>
            {link.shortcut}
          </kbd>
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {collapsed && hovered && <Tooltip label={link.label} shortcut={link.shortcut} />}
    </div>
  )
})

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
const MobileNav = memo(function MobileNav({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number
  onNavigate: (i: number) => void
}) {
  const textRefs = useRef<(HTMLElement | null)[]>([])
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const setLineWidth = () => {
      const el = itemRefs.current[activeIndex]
      const tx = textRefs.current[activeIndex]
      if (el && tx) el.style.setProperty('--lineWidth', `${tx.offsetWidth}px`)
    }
    setLineWidth()
    window.addEventListener('resize', setLineWidth)
    return () => window.removeEventListener('resize', setLineWidth)
  }, [activeIndex])

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      width: '100%', height: '100%', padding: '0 4px',
    }}>
      {LINKS.map((link, index) => {
        const isActive = index === activeIndex
        const { Icon } = link
        return (
          <button
            key={link.href}
            ref={el => { itemRefs.current[index] = el }}
            onClick={() => onNavigate(index)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 3, flex: 1, height: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '8px 4px 6px', position: 'relative',
              color: isActive ? '#0f766e' : '#94a3b8',
              transition: 'color 0.2s',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              /* bottom indicator */
            } as React.CSSProperties}
          >
            {/* bottom line */}
            <span style={{
              position: 'absolute', bottom: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: isActive ? 'var(--lineWidth, 24px)' : '0px',
              height: 2, borderRadius: '2px 2px 0 0',
              background: '#2EC4B6',
              transition: 'width 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }} />

            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: isActive ? 'translateY(-1px)' : 'none',
              transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <Icon size={20} active={isActive} />
            </span>

            <strong
              ref={el => { textRefs.current[index] = el as HTMLElement | null }}
              style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.01em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(4px)',
                transition: 'opacity 0.2s, transform 0.2s',
                lineHeight: 1,
              }}
            >
              {link.label}
            </strong>
          </button>
        )
      })}
    </nav>
  )
})

// ─── Global CSS (static — hoisted) ───────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --sidebar-width: 224px;
    --sidebar-collapsed-width: 64px;
    --header-height: 0px;
  }

  /* sidebar transitions */
  .snav-sidebar {
    transition: width 0.22s cubic-bezier(0.22,1,0.36,1);
    will-change: width;
  }

  /* command palette animations */
  @keyframes cmd-fadein  { from{opacity:0} to{opacity:1} }
  @keyframes cmd-slidein { from{opacity:0;transform:translateY(-12px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

  /* token glow */
  @keyframes token-glow {
    0%,100% { box-shadow: 0 0 8px rgba(46,196,182,0.45); }
    50%      { box-shadow: 0 0 16px rgba(46,196,182,0.7); }
  }

  /* live dot pulse */
  @keyframes snav-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.55; transform:scale(0.8); }
  }

  /* command result hover */
  .cmd-result:hover { background: #f8fafc !important; }

  /* sidebar scrollbar */
  .snav-scroll::-webkit-scrollbar { width: 3px; }
  .snav-scroll::-webkit-scrollbar-track { background: transparent; }
  .snav-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 3px; }

  /* ── Layout shell ── */
  .snav-shell {
    display: flex;
    min-height: 100vh;
    font-family: 'DM Sans', system-ui, sans-serif;
  }

  /* ── Sidebar ── */
  .snav-sidebar-wrap {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  /* ── Main content area offset ── */
  .snav-main {
    flex: 1;
    transition: margin-left 0.22s cubic-bezier(0.22,1,0.36,1);
  }

  /* ── Mobile: hide sidebar, show bottom bar ── */
  @media (max-width: 680px) {
    .snav-sidebar-wrap { display: none !important; }
    .snav-main { margin-left: 0 !important; }
    .snav-mobile { display: flex !important; }
    .snav-mobile-spacer { display: block !important; }
  }

  @media (min-width: 681px) {
    .snav-mobile { display: none !important; }
    .snav-mobile-spacer { display: none !important; }
  }

  /* collapse toggle button */
  .snav-toggle {
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), opacity 0.15s;
  }
  .snav-toggle:hover { opacity: 0.7; }

  /* nav item hover (prevent re-render on hover via CSS) */
  .snav-cmd-trigger:hover {
    background: rgba(241,245,249,0.9) !important;
    border-color: rgba(226,232,240,0.9) !important;
  }
  .snav-cmd-trigger:active { transform: scale(0.97) !important; }
`

function GlobalStyles() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />
}

// ─── Main NavBottom component ─────────────────────────────────────────────────
export default function NavBottom() {
  // ── LÓGICA ORIGINAL INTACTA ──────────────────────────────────────────────
  const pathname = usePathname()
  const router   = useRouter()

  const activeIndex = useMemo(() => {
    const idx = LINKS.findIndex(l => pathname.startsWith(l.href))
    return idx >= 0 ? idx : 0
  }, [pathname])

  function handleMobileNavigate(index: number) {
    router.push(LINKS[index].href)
  }
  // ── FIN LÓGICA ORIGINAL ──────────────────────────────────────────────────

  const [collapsed, setCollapsed]   = useState(false)
  const [cmdOpen,   setCmdOpen]     = useState(false)
  const sidebarWidth = collapsed ? 64 : 224

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey

      // Cmd+K / Ctrl+K → command palette
      if (mod && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(o => !o)
        return
      }

      // [ → collapse sidebar
      if (e.key === '[' && !e.target) {
        setCollapsed(o => !o)
        return
      }

      // Letter shortcuts when palette is closed
      if (cmdOpen) return
      const focused = document.activeElement
      if (focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA')) return

      LINKS.forEach(link => {
        if (e.key.toUpperCase() === link.shortcut && !mod) {
          e.preventDefault()
          router.push(link.href)
        }
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [cmdOpen, router])

  const handleCmd = useCallback((href: string) => {
    setCmdOpen(false)
    router.push(href)
  }, [router])

  const handleNavItem = useCallback((href: string) => {
    router.push(href)
  }, [router])

  return (
    <>
      <GlobalStyles />

      {/* ── Command Palette ── */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} onNavigate={handleCmd} />

      {/* ── Desktop Sidebar ── */}
      <div
        className="snav-sidebar-wrap snav-sidebar"
        style={{ width: sidebarWidth }}
      >
        <div style={{
          width: '100%', height: '100%',
          background: '#fff',
          borderRight: '1px solid #f1f5f9',
          display: 'flex', flexDirection: 'column',
          overflowX: 'hidden',
        }}>

          {/* Logo */}
          <div style={{
            padding: collapsed ? '18px 0' : '18px 16px',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            borderBottom: '1px solid #f8fafc',
            flexShrink: 0,
          }}>
            {!collapsed && (
              <Link href="/pedidos" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: 'linear-gradient(135deg, #2EC4B6 0%, #1A9E8F 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(46,196,182,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  flexShrink: 0,
                }}>
                  <IconZap size={13} />
                </div>
                <span style={{
                  fontSize: 14, fontWeight: 800, color: '#0f172a',
                  letterSpacing: '-0.5px',
                }}>
                  SAMG<span style={{ color: '#2EC4B6' }}>PLE</span>
                </span>
              </Link>
            )}

            {collapsed && (
              <Link href="/pedidos" style={{ textDecoration: 'none' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: 'linear-gradient(135deg, #2EC4B6 0%, #1A9E8F 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 10px rgba(46,196,182,0.3)',
                }}>
                  <IconZap size={14} />
                </div>
              </Link>
            )}

            {/* Collapse toggle */}
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                className="snav-toggle"
                title="Colapsar barra [ ]"
                style={{
                  width: 26, height: 26, borderRadius: 8,
                  border: '1px solid #f1f5f9', background: '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#94a3b8', flexShrink: 0,
                }}
              >
                <IconChevronLeft size={13} />
              </button>
            )}
          </div>

          {/* Cmd+K trigger */}
          <div style={{ padding: collapsed ? '12px 8px 8px' : '12px 12px 8px', flexShrink: 0 }}>
            {collapsed ? (
              <button
                onClick={() => setCmdOpen(true)}
                title="Búsqueda (⌘K)"
                style={{
                  width: '100%', padding: '10px',
                  border: '1.5px solid #f1f5f9', borderRadius: 11,
                  background: '#f8fafc', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8',
                }}
              >
                <IconSearch size={15} />
              </button>
            ) : (
              <button
                onClick={() => setCmdOpen(true)}
                className="snav-cmd-trigger"
                style={{
                  width: '100%', padding: '8px 12px',
                  border: '1.5px solid #f1f5f9', borderRadius: 11,
                  background: '#f8fafc', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: '#94a3b8', transition: 'all 0.12s',
                }}
              >
                <IconSearch size={13} />
                <span style={{ fontSize: 12, fontWeight: 500, flex: 1, textAlign: 'left' }}>
                  Ir a…
                </span>
                <kbd style={{
                  fontSize: 10, padding: '2px 5px', borderRadius: 5,
                  background: '#fff', border: '1px solid #e2e8f0',
                  color: '#94a3b8', fontFamily: 'inherit',
                }}>
                  ⌘K
                </kbd>
              </button>
            )}
          </div>

          {/* Nav items */}
          <nav
            className="snav-scroll"
            style={{
              flex: 1, overflowY: 'auto', overflowX: 'hidden',
              padding: collapsed ? '4px 8px' : '4px 10px',
              display: 'flex', flexDirection: 'column', gap: 2,
            }}
          >
            {LINKS.map(link => (
              <SidebarItem
                key={link.href}
                link={link}
                isActive={pathname.startsWith(link.href)}
                collapsed={collapsed}
                onClick={() => handleNavItem(link.href)}
              />
            ))}
          </nav>

          {/* Expand button when collapsed */}
          {collapsed && (
            <div style={{ padding: '8px', flexShrink: 0 }}>
              <button
                onClick={() => setCollapsed(false)}
                title="Expandir barra"
                style={{
                  width: '100%', padding: '9px',
                  border: '1px solid #f1f5f9', borderRadius: 10,
                  background: '#f8fafc', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          )}

          {/* Footer — live badge + token badge */}
          <div style={{
            padding: collapsed ? '12px 8px' : '12px 12px',
            borderTop: '1px solid #f8fafc',
            display: 'flex', flexDirection: 'column', gap: 10,
            flexShrink: 0,
          }}>
            {/* Live indicator */}
            {!collapsed && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 11px', borderRadius: 11,
                background: 'rgba(34,197,94,0.05)',
                border: '1px solid rgba(34,197,94,0.12)',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 6px rgba(34,197,94,0.6)',
                  animation: 'snav-pulse 2.5s ease-in-out infinite',
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#15803d', flex: 1 }}>
                  Panel activo
                </span>
                <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                  En vivo
                </span>
              </div>
            )}

            {/* Token badge */}
            <TokenBadge collapsed={collapsed} />
          </div>
        </div>
      </div>

      {/* Sidebar spacer (pushes main content right) */}
      <div
        className="snav-sidebar"
        style={{ width: sidebarWidth, flexShrink: 0, display: 'none' }}
        aria-hidden
      />

      {/* ── Mobile bottom nav ── */}
      <div
        className="snav-mobile"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 100, height: 60,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderTop: '1px solid rgba(226,232,240,0.8)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.05)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <MobileNav activeIndex={activeIndex} onNavigate={handleMobileNavigate} />
      </div>

      {/* Mobile bottom spacer */}
      <div
        className="snav-mobile-spacer"
        style={{ height: 60, display: 'none' }}
        aria-hidden
      />
    </>
  )
}

