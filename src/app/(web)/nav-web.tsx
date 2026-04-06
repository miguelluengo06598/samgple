'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NavWeb() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Inicio',        href: '/' },
    { label: 'Cómo funciona', href: '/metodologia' },
    { label: 'Precios',       href: '/precios' },
    { label: 'Contacto',      href: '/contacto' },
  ]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes nv-slidedown {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes nv-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes nv-drawerslide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nv-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.45; transform: scale(0.72); }
        }
        @keyframes nv-signup-shine {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        /* ── NAV WRAPPER ── */
        .nv-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          padding: 14px 16px 0;
          pointer-events: none;
        }

        /* ── PILL ── */
        .nv-pill {
          pointer-events: all;
          width: 100%;
          max-width: 900px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px 0 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.9) inset,
            0 4px 24px rgba(0, 0, 0, 0.07),
            0 1px 4px rgba(0, 0, 0, 0.04);
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
          animation: nv-slidedown 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .nv-pill.scrolled {
          background: rgba(255, 255, 255, 0.92);
          box-shadow:
            0 1px 0 0 rgba(255,255,255,0.9) inset,
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.05);
          border-color: rgba(0, 0, 0, 0.07);
        }

        /* ── LOGO ── */
        .nv-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nv-logo-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2EC4B6, #1D9E75);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 10px rgba(46,196,182,0.35);
          flex-shrink: 0;
        }
        .nv-logo-text {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.4px;
          color: #0f172a;
        }
        .nv-logo-text span { color: #2EC4B6; }
        .nv-logo-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          margin-left: 2px;
          animation: nv-dot-pulse 2.2s ease-in-out infinite;
        }

        /* ── DESKTOP LINKS ── */
        .nv-links {
          display: flex;
          align-items: center;
          gap: 2px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nv-link {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          text-decoration: none;
          padding: 6px 11px;
          border-radius: 9999px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .nv-link:hover {
          color: #0f172a;
          background: rgba(0, 0, 0, 0.05);
        }

        /* ── DESKTOP ACTIONS ── */
        .nv-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .nv-login {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
          padding: 7px 14px;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: transparent;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .nv-login:hover {
          background: rgba(0, 0, 0, 0.04);
          border-color: rgba(0, 0, 0, 0.16);
        }
        .nv-signup {
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #2EC4B6, #1D9E75);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          border: none;
          cursor: pointer;
          box-shadow: 0 3px 12px rgba(46,196,182,0.35);
          transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.18s;
        }
        .nv-signup:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(46,196,182,0.48);
        }
        .nv-signup:active { transform: scale(0.97); }

        /* ── HAMBURGER ── */
        .nv-ham {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(0, 0, 0, 0.03);
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .nv-ham:hover { background: rgba(0, 0, 0, 0.07); }
        .nv-ham:active { transform: scale(0.94); }

        /* ── MOBILE OVERLAY ── */
        .nv-overlay {
          position: fixed;
          inset: 0;
          z-index: 1100;
          background: rgba(10, 15, 30, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: nv-fade 0.2s ease;
        }

        /* ── MOBILE DRAWER ── */
        .nv-drawer {
          position: fixed;
          top: 14px;
          left: 16px;
          right: 16px;
          z-index: 1200;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0,0,0,0.06);
          overflow: hidden;
          animation: nv-drawerslide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: system-ui, -apple-system, sans-serif;
        }

        /* Drawer top bar */
        .nv-drawer-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .nv-drawer-close {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(0, 0, 0, 0.03);
          cursor: pointer;
        }

        /* Drawer links */
        .nv-drawer-links {
          padding: 8px 8px 4px;
        }
        .nv-drawer-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 13px 14px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
          margin-bottom: 2px;
          transition: background 0.12s;
          -webkit-tap-highlight-color: transparent;
        }
        .nv-drawer-link:hover  { background: rgba(0, 0, 0, 0.04); }
        .nv-drawer-link:active { background: rgba(0, 0, 0, 0.07); }
        .nv-drawer-link-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-right: 12px;
        }
        .nv-drawer-link-left {
          display: flex;
          align-items: center;
        }

        /* Drawer divider */
        .nv-drawer-divider {
          height: 1px;
          background: rgba(0, 0, 0, 0.05);
          margin: 4px 16px 8px;
        }

        /* Drawer CTAs */
        .nv-drawer-ctas {
          padding: 0 8px 8px;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .nv-drawer-login {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          text-decoration: none;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: transparent;
          -webkit-tap-highlight-color: transparent;
        }
        .nv-drawer-signup {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg, #2EC4B6, #1D9E75);
          box-shadow: 0 4px 16px rgba(46,196,182,0.35);
          -webkit-tap-highlight-color: transparent;
        }

        /* Drawer info card */
        .nv-drawer-card {
          margin: 4px 8px 14px;
          padding: 13px 14px;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(46,196,182,0.07), rgba(29,158,117,0.05));
          border: 1px solid rgba(46,196,182,0.2);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nv-drawer-card-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2EC4B6, #1D9E75);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(46,196,182,0.3);
        }
        .nv-drawer-card-title {
          font-size: 12px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 2px;
        }
        .nv-drawer-card-sub {
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }

        /* ── RESPONSIVE ── */
        @media (min-width: 769px) {
          .nv-ham     { display: none !important; }
          .nv-overlay { display: none !important; }
          .nv-drawer  { display: none !important; }
        }
        @media (max-width: 768px) {
          .nv-links   { display: none !important; }
          .nv-actions { display: none !important; }
        }
        @media (max-width: 400px) {
          .nv-root { padding: 10px 10px 0; }
          .nv-pill { height: 48px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <div className="nv-root">
        <div className={`nv-pill${scrolled ? ' scrolled' : ''}`}>

          {/* Logo */}
          <Link href="/" className="nv-logo">
            <div className="nv-logo-icon">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span className="nv-logo-text">
              SAMG<span>PLE</span>
            </span>
            <div className="nv-logo-dot" />
          </Link>

          {/* Desktop links */}
          <ul className="nv-links">
            {navLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href} className="nv-link">{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="nv-actions">
            <Link href="/login" className="nv-login">Iniciar sesión</Link>
            <Link href="/registro" className="nv-signup">
              Empezar gratis
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="nv-ham"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menú"
          >
            {menuOpen
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="17" y2="12"/><line x1="3" y1="18" x2="13" y2="18"/></svg>
            }
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <>
          <div className="nv-overlay" onClick={() => setMenuOpen(false)} />

          <div className="nv-drawer">

            {/* Drawer header */}
            <div className="nv-drawer-top">
              <Link href="/" className="nv-logo" onClick={() => setMenuOpen(false)}>
                <div className="nv-logo-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <span className="nv-logo-text">SAMG<span>PLE</span></span>
              </Link>
              <button className="nv-drawer-close" onClick={() => setMenuOpen(false)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Drawer links */}
            <div className="nv-drawer-links">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="nv-drawer-link"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="nv-drawer-link-left">
                    <span className="nv-drawer-link-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </span>
                    {l.label}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Link>
              ))}
            </div>

            <div className="nv-drawer-divider" />

            {/* Drawer CTAs */}
            <div className="nv-drawer-ctas">
              <Link href="/login" className="nv-drawer-login" onClick={() => setMenuOpen(false)}>
                Iniciar sesión
              </Link>
              <Link href="/registro" className="nv-drawer-signup" onClick={() => setMenuOpen(false)}>
                Empezar gratis
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* Info card */}
            <div className="nv-drawer-card">
              <div className="nv-drawer-card-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <p className="nv-drawer-card-title">¿Tienes dudas?</p>
                <p className="nv-drawer-card-sub">soporte@samgple.com · Resp. en &lt;24h</p>
              </div>
            </div>

          </div>
        </>
      )}
    </>
  )
}