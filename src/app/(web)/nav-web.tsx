'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function NavWeb() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Inicio',        href: '/',            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Cómo funciona', href: '/metodologia', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10' },
    { label: 'Precios',       href: '/precios',     icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Contacto',      href: '/contacto',    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; }

        @keyframes nv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
        @keyframes nv-in    { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nv-fade  { from{opacity:0} to{opacity:1} }
        @keyframes nv-pop   { from{opacity:0;transform:scale(0.97) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }

        .nv-link {
          font-family:${F}; font-size:13px; font-weight:600;
          text-decoration:none; padding:7px 12px; border-radius:10px;
          transition:all 0.15s ease; white-space:nowrap; position:relative;
        }
        .nv-link-dark  { color:rgba(255,255,255,0.7); }
        .nv-link-dark:hover  { color:#fff; background:rgba(255,255,255,0.08); }
        .nv-link-light { color:#64748b; }
        .nv-link-light:hover { color:#0f172a; background:#f8fafc; }

        .nv-login {
          font-family:${F}; font-size:13px; font-weight:600;
          text-decoration:none; padding:8px 16px; border-radius:10px;
          transition:all 0.15s; white-space:nowrap; border:1.5px solid;
        }
        .nv-login-dark  { color:rgba(255,255,255,0.8); border-color:rgba(255,255,255,0.18); }
        .nv-login-dark:hover  { background:rgba(255,255,255,0.08); color:#fff; border-color:rgba(255,255,255,0.3); }
        .nv-login-light { color:#0f172a; border-color:#e2e8f0; background:#fff; }
        .nv-login-light:hover { background:#f8fafc; border-color:#cbd5e1; }

        .nv-signup {
          font-family:${F}; font-size:13px; font-weight:700;
          padding:9px 18px; border-radius:11px;
          background:linear-gradient(135deg,#2EC4B6,#1D9E75);
          color:#fff; text-decoration:none;
          display:inline-flex; align-items:center; gap:6px;
          box-shadow:0 4px 14px rgba(46,196,182,0.35);
          transition:all 0.18s cubic-bezier(0.34,1.56,0.64,1);
          will-change:transform; white-space:nowrap; border:none;
        }
        .nv-signup:hover  { transform:translateY(-1px); box-shadow:0 8px 22px rgba(46,196,182,0.5); }
        .nv-signup:active { transform:scale(0.97); }

        .nv-ham {
          width:40px; height:40px; border-radius:11px;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.15s ease; flex-shrink:0;
          -webkit-tap-highlight-color:transparent; border:none;
        }
        .nv-ham:active { transform:scale(0.93); }

        .nv-overlay {
          position:fixed; inset:0; z-index:1100;
          background:rgba(8,15,36,0.55);
          backdrop-filter:blur(6px);
          -webkit-backdrop-filter:blur(6px);
          animation:nv-fade 0.2s ease;
        }

        .nv-drawer {
          position:fixed; top:0; left:0; right:0; z-index:1200;
          background:#fff;
          border-radius:0 0 28px 28px;
          box-shadow:0 24px 64px rgba(0,0,0,0.15);
          animation:nv-in 0.25s cubic-bezier(0.34,1.2,0.64,1);
          overflow:hidden; font-family:${F};
        }

        .nv-mob-link {
          display:flex; align-items:center; justify-content:space-between;
          padding:12px 14px; border-radius:14px;
          font-size:15px; font-weight:600; color:#0f172a;
          text-decoration:none; margin:0 4px 3px;
          transition:background 0.12s;
          -webkit-tap-highlight-color:transparent;
        }
        .nv-mob-link:hover  { background:#f8fafc; }
        .nv-mob-link:active { background:#f1f5f9; }

        /* Pill live */
        .nv-live {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px; border-radius:20px;
        }
        .nv-live-dot {
          width:5px; height:5px; border-radius:50%; background:#22c55e;
          animation:nv-pulse 2.5s ease-in-out infinite;
          box-shadow:0 0 5px rgba(34,197,94,0.7);
        }

        @media(min-width:769px) {
          .nv-ham     { display:none!important; }
          .nv-overlay { display:none!important; }
          .nv-drawer  { display:none!important; }
        }
        @media(max-width:768px) {
          .nv-desk-links   { display:none!important; }
          .nv-desk-actions { display:none!important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 62,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(14px,4vw,44px)',
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(8,15,36,0.5)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid ${scrolled ? 'rgba(226,232,240,0.8)' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.04),0 4px 20px rgba(0,0,0,0.05)' : 'none',
        transition: 'background 0.3s,border-color 0.3s,box-shadow 0.3s',
        fontFamily: F,
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(46,196,182,0.4)', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', color: scrolled ? '#0f172a' : '#fff', transition: 'color 0.3s', fontFamily: F }}>
            SAMG<span style={{ color: '#2EC4B6' }}>PLE</span>
          </span>
        </Link>

        {/* Links desktop */}
        <div className="nv-desk-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={`nv-link ${scrolled ? 'nv-link-light' : 'nv-link-dark'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Acciones desktop */}
        <div className="nv-desk-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {/* Live pill */}
          <div className="nv-live"
            style={{ background: scrolled ? 'rgba(34,197,94,0.07)' : 'rgba(34,197,94,0.1)', border: `1px solid ${scrolled ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.25)'}`, marginRight: 4 }}>
            <span className="nv-live-dot" />
            <span style={{ fontSize: 10, fontWeight: 700, color: scrolled ? '#0f766e' : 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}>EN VIVO</span>
          </div>

          <Link href="/login" className={`nv-login ${scrolled ? 'nv-login-light' : 'nv-login-dark'}`}>
            Iniciar sesión
          </Link>
          <Link href="/registro" className="nv-signup">
            Empezar gratis
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(v => !v)} className="nv-ham" aria-label="Menú"
          style={{ border: `1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}`, background: scrolled ? '#fff' : 'rgba(255,255,255,0.08)' }}>
          {menuOpen
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={scrolled ? '#0f172a' : '#fff'} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={scrolled ? '#0f172a' : '#fff'} strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="17" y2="12"/><line x1="3" y1="18" x2="13" y2="18"/></svg>
          }
        </button>
      </nav>

      {/* ── MENÚ MÓVIL ── */}
      {menuOpen && (
        <>
          <div className="nv-overlay" onClick={() => setMenuOpen(false)} />

          <div className="nv-drawer">
            {/* Header drawer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #f8fafc' }}>
              <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(46,196,182,0.35)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', fontFamily: F }}>SAMG<span style={{ color: '#2EC4B6' }}>PLE</span></span>
              </Link>
              <button onClick={() => setMenuOpen(false)}
                style={{ width: 34, height: 34, borderRadius: 10, border: '1.5px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Links */}
            <div style={{ padding: '8px 6px 4px' }}>
              {navLinks.map((l, i) => (
                <Link key={l.href} href={l.href} className="nv-mob-link" onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${i * 0.04}s` }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 34, height: 34, borderRadius: 10, background: '#f1f5f9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d={l.icon}/></svg>
                    </span>
                    {l.label}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>

            <div style={{ height: 1, background: '#f1f5f9', margin: '4px 18px 10px' }} />

            {/* CTAs */}
            <div style={{ padding: '0 6px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link href="/login" onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', borderRadius: 13, fontSize: 14, fontWeight: 600, color: '#0f172a', textDecoration: 'none', border: '1.5px solid #e2e8f0', background: '#fff', fontFamily: F, transition: 'all 0.14s' }}>
                Iniciar sesión
              </Link>
              <Link href="/registro" onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', boxShadow: '0 6px 18px rgba(46,196,182,0.35)', fontFamily: F }}>
                Empezar gratis
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Footer info drawer */}
            <div style={{ margin: '4px 6px 18px', padding: '13px 14px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(46,196,182,0.06),rgba(93,167,236,0.04))', border: '1px solid rgba(46,196,182,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 3px 10px rgba(46,196,182,0.3)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: '0 0 1px', fontFamily: F }}>¿Tienes dudas?</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0, fontFamily: F }}>hola@samgple.com · Resp. en &lt;24h</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}