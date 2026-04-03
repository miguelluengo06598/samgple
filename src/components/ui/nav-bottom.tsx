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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .nav-root {
          font-family: 'DM Sans', system-ui, sans-serif;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 58px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(226,232,240,0.7);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(12px, 4vw, 32px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04);
          will-change: transform;
        }

        .nav-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        .nav-logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2EC4B6 0%, #1A9E8F 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(46,196,182,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        .nav-logo-text {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.6px;
        }

        .nav-logo-text span {
          color: #2EC4B6;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1px;
          background: rgba(241,245,249,0.6);
          border-radius: 14px;
          padding: 3px;
          border: 1px solid rgba(226,232,240,0.5);
        }

        .nav-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 11px;
          text-decoration: none;
          color: #94a3b8;
          font-size: clamp(11px, 1.4vw, 13px);
          font-weight: 500;
          letter-spacing: -0.2px;
          transition: all 0.15s ease;
          white-space: nowrap;
          position: relative;
          will-change: transform;
        }

        .nav-item:hover {
          color: #475569;
          background: rgba(255,255,255,0.7);
        }

        .nav-item:active {
          transform: scale(0.96);
        }

        .nav-item.active {
          background: #ffffff;
          color: #0f766e;
          font-weight: 700;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(46,196,182,0.12);
        }

        .nav-item.active svg {
          filter: drop-shadow(0 0 4px rgba(46,196,182,0.3));
        }

        .nav-badge {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 11px;
          border-radius: 20px;
          background: rgba(46,196,182,0.06);
          border: 1px solid rgba(46,196,182,0.18);
        }

        .nav-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2EC4B6;
          box-shadow: 0 0 6px rgba(46,196,182,0.6);
          animation: pulse-dot 2.5s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        .nav-badge-text {
          font-size: 12px;
          font-weight: 700;
          color: #0f766e;
          letter-spacing: -0.2px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        /* Responsive: ocultar labels en pantallas pequeñas */
        @media (max-width: 520px) {
          .nav-item {
            padding: 7px 10px;
            gap: 0;
          }
          .nav-label {
            display: none;
          }
          .nav-links {
            gap: 0;
          }
          .nav-badge-text {
            display: none;
          }
          .nav-badge {
            padding: 6px 8px;
          }
        }

        @media (max-width: 360px) {
          .nav-item {
            padding: 7px 8px;
          }
        }
      `}</style>

      <nav className="nav-root">

        {/* Logo */}
        <Link href="/pedidos" className="nav-logo">
          <div className="nav-logo-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span className="nav-logo-text">
            SAMG<span>PLE</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="nav-links">
          {links.map(link => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item${isActive ? ' active' : ''}`}
              >
                {link.icon(isActive)}
                <span className="nav-label">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Saldo rápido */}
        <div className="nav-badge">
          <span className="nav-badge-dot" />
          <span className="nav-badge-text">Panel</span>
        </div>

      </nav>

      {/* Spacer para que el contenido no quede bajo el nav */}
      <div style={{ height: 58 }} />
    </>
  )
}