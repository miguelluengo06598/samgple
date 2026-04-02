'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  {
    href: '/finanzas',
    label: 'Finanzas',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    href: '/pedidos',
    label: 'Pedidos',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    href: '/tienda',
    label: 'Tienda',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: '/herramientas',
    label: 'Herramientas',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    href: '/configuracion',
    label: 'Cuenta',
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
]

export default function NavBottom() {
  const pathname = usePathname()

  return (
    <>
      <style>{`
        .nav-item { transition: all 0.18s cubic-bezier(0.34,1.56,0.64,1); }
        .nav-item:hover { transform: translateY(1px); }
        .nav-item:active { transform: scale(0.93); }
        .nav-label { transition: all 0.15s ease; }
      `}</style>

      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 56,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #f0fafa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(8px,3vw,24px)',
        fontFamily: 'system-ui,-apple-system,sans-serif',
      }}>

        {/* Logo */}
        <Link href="/pedidos" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(46,196,182,0.3)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
            SAMG<span style={{ color: '#2EC4B6' }}>PLE</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {links.map(link => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="nav-item"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  padding: 'clamp(6px,1.5vw,8px) clamp(8px,2vw,14px)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  background: isActive ? 'rgba(46,196,182,0.08)' : 'transparent',
                  color: isActive ? '#0f766e' : '#94a3b8',
                  position: 'relative',
                }}
              >
                {link.icon(isActive)}
                <span className="nav-label" style={{
                  fontSize: 'clamp(9px,1.5vw,11px)',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '-0.2px',
                  lineHeight: 1,
                }}>
                  {link.label}
                </span>
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: -1,
                    left: '20%',
                    right: '20%',
                    height: 2,
                    background: 'linear-gradient(90deg,#2EC4B6,#1D9E75)',
                    borderRadius: 2,
                  }} />
                )}
              </Link>
            )
          })}
        </div>

        {/* Saldo rápido */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(46,196,182,0.06)', border: '1px solid rgba(46,196,182,0.15)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6', display: 'inline-block' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e' }}>Panel</span>
        </div>

      </nav>

      {/* Spacer para que el contenido no quede bajo el nav */}
      <div style={{ height: 56 }} />
    </>
  )
}