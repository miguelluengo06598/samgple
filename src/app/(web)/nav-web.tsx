'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function NavWeb() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const textColor = scrolled ? '#0f172a' : '#fff'
  const mutedColor = scrolled ? '#64748b' : 'rgba(255,255,255,0.75)'

  // Bloquea scroll cuando menú abierto
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

  const linkIcons: Record<string, string> = {
    '/':            'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    '/metodologia': 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10',
    '/precios':     'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    '/contacto':    'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes nv-pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
        @keyframes nv-in     { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nv-fade   { from{opacity:0} to{opacity:1} }

        /* ── DESKTOP LINKS ── */
        .nv-dlink {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px; font-weight: 500;
          text-decoration: none;
          padding: 7px 13px; border-radius: 10px;
          transition: background .15s, color .15s;
          white-space: nowrap;
          position: relative;
        }
        .nv-dlink::after {
          content:''; position:absolute;
          bottom:3px; left:13px; right:13px; height:1.5px;
          background:#2EC4B6; border-radius:2px;
          transform:scaleX(0); transition:transform .2s ease;
          transform-origin:left;
        }
        .nv-dlink:hover::after { transform:scaleX(1); }
        .nv-dlink.dark:hover  { background:rgba(255,255,255,0.09) !important; color:#fff !important; }
        .nv-dlink.light:hover { background:rgba(46,196,182,0.07) !important; color:#0f172a !important; }

        /* ── SIGNUP BTN ── */
        .nv-signup {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 700;
          padding: 9px 19px; border-radius: 11px;
          background: linear-gradient(135deg,#2EC4B6,#1A9E8F);
          color: #fff !important; text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 16px rgba(46,196,182,.42);
          transition: all .18s cubic-bezier(.34,1.56,.64,1);
          will-change: transform; border: none; white-space: nowrap;
        }
        .nv-signup:hover  { transform:translateY(-1px); box-shadow:0 8px 24px rgba(46,196,182,.55); }
        .nv-signup:active { transform:scale(.97); }

        /* ── LOGIN BTN ── */
        .nv-login {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 8px 17px; border-radius: 10px;
          text-decoration: none; background: transparent;
          transition: background .15s; white-space: nowrap;
        }
        .nv-login:hover { background: rgba(255,255,255,0.07); }
        .nv-login.light:hover { background: #f1f5f9; }

        /* ── HAMBURGER ── */
        .nv-ham {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .18s ease;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .nv-ham:active { transform: scale(.93); }

        /* ── HIDE/SHOW ── */
        @media (min-width: 769px) {
          .nv-ham     { display: none !important; }
          .nv-overlay { display: none !important; }
          .nv-drawer  { display: none !important; }
        }
        @media (max-width: 768px) {
          .nv-desktop-links   { display: none !important; }
          .nv-desktop-actions { display: none !important; }
        }

        /* ── OVERLAY ── */
        .nv-overlay {
          position: fixed; inset: 0; z-index: 1100;
          background: rgba(10,18,38,.6);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          animation: nv-fade .2s ease;
        }

        /* ── DRAWER ── */
        .nv-drawer {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1200;
          background: #ffffff;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          box-shadow: 0 24px 64px rgba(0,0,0,.18);
          animation: nv-in .26s cubic-bezier(.34,1.2,.64,1);
          overflow: hidden;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .nv-drawer-top {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px 14px;
          border-bottom: 1px solid #f1f5f9;
        }

        .nv-mob-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 13px 16px; border-radius: 14px;
          font-size: 16px; font-weight: 600; color: #0f172a;
          text-decoration: none; margin: 0 4px 3px;
          transition: background .14s;
          -webkit-tap-highlight-color: transparent;
        }
        .nv-mob-link:hover  { background: #f8fafc; }
        .nv-mob-link:active { background: #f1f5f9; }

        .nv-mob-actions {
          padding: 4px 4px 8px;
          display: flex; flex-direction: column; gap: 8px;
        }

        .nv-mob-login-btn {
          display: flex; align-items: center; justify-content: center;
          padding: 13px; border-radius: 13px;
          font-size: 15px; font-weight: 600; color: #0f172a;
          text-decoration: none;
          border: 1.5px solid #e2e8f0; background: #fff;
          transition: all .14s; font-family: 'DM Sans', system-ui, sans-serif;
          -webkit-tap-highlight-color: transparent;
        }
        .nv-mob-login-btn:hover  { background: #f8fafc; border-color: #cbd5e1; }
        .nv-mob-login-btn:active { background: #f1f5f9; }

        .nv-mob-signup-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 14px; border-radius: 14px;
          font-size: 15px; font-weight: 700; color: #fff;
          text-decoration: none;
          background: linear-gradient(135deg,#2EC4B6,#1A9E8F);
          box-shadow: 0 6px 20px rgba(46,196,182,.38);
          font-family: 'DM Sans', system-ui, sans-serif;
          -webkit-tap-highlight-color: transparent;
          transition: opacity .14s;
        }
        .nv-mob-signup-btn:active { opacity: .88; }

        .nv-mob-footer {
          margin: 4px 4px 20px;
          padding: 14px 16px; border-radius: 16px;
          background: linear-gradient(135deg,rgba(46,196,182,.07),rgba(99,102,241,.05));
          border: 1px solid rgba(46,196,182,.18);
          display: flex; align-items: center; gap: 12px;
        }

        .nv-live {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 11px; border-radius: 20px;
        }
        .nv-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #2EC4B6; display: inline-block;
          box-shadow: 0 0 6px rgba(46,196,182,.7);
          animation: nv-pulse 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000, height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(14px,4vw,44px)',
        background: scrolled
          ? 'rgba(255,255,255,0.96)'
          : 'rgba(8,15,36,0.55)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled
          ? '1px solid rgba(226,232,240,.8)'
          : '1px solid rgba(255,255,255,.07)',
        boxShadow: scrolled
          ? '0 1px 0 rgba(0,0,0,.04),0 4px 20px rgba(0,0,0,.05)'
          : 'none',
        transition: 'background .3s,border-color .3s,box-shadow .3s',
        fontFamily: F,
      }}>

        {/* LOGO */}
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:9, flexShrink:0 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(46,196,182,.42)', flexShrink:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{ fontSize:17, fontWeight:800, letterSpacing:'-0.6px', color:textColor, transition:'color .3s', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
          </span>
        </Link>

        {/* LINKS DESKTOP */}
        <div className="nv-desktop-links" style={{ display:'flex', alignItems:'center', gap:2 }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={`nv-dlink ${scrolled ? 'light' : 'dark'}`}
              style={{ color: mutedColor, transition:'color .3s,background .15s' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* ACCIONES DESKTOP */}
        <div className="nv-desktop-actions" style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
          <div className="nv-live" style={{ background: scrolled ? 'rgba(46,196,182,.07)' : 'rgba(46,196,182,.12)', border:`1px solid ${scrolled ? 'rgba(46,196,182,.2)' : 'rgba(46,196,182,.28)'}`, marginRight:3 }}>
            <span className="nv-live-dot" />
            <span style={{ fontSize:11, fontWeight:700, color: scrolled ? '#0f766e' : '#5eead4', letterSpacing:'.04em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>EN VIVO</span>
          </div>
          <Link href="/login" className={`nv-login ${scrolled ? 'light' : ''}`}
            style={{ border:`1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,.22)'}`, color:textColor }}>
            Iniciar sesión
          </Link>
          <Link href="/registro" className="nv-signup">
            Empezar gratis
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* HAMBURGER — solo móvil */}
        <button
          className="nv-ham"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Abrir menú"
          style={{
            border:`1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,.22)'}`,
            background: scrolled ? '#fff' : 'rgba(255,255,255,.09)',
          }}
        >
          {menuOpen
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </nav>

      {/* ══════════ MENÚ MÓVIL ══════════ */}
      {menuOpen && (
        <>
          {/* Overlay cierra al tocar fuera */}
          <div className="nv-overlay" onClick={() => setMenuOpen(false)} />

          <div className="nv-drawer">
            {/* Cabecera del drawer */}
            <div className="nv-drawer-top">
              <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:9 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(46,196,182,.35)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <span style={{ fontSize:16, fontWeight:800, letterSpacing:'-0.5px', color:'#0f172a', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
                </span>
              </Link>
              <button onClick={() => setMenuOpen(false)} style={{ width:36, height:36, borderRadius:10, border:'1.5px solid #f1f5f9', background:'#f8fafc', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Links de navegación */}
            <div style={{ padding:'8px 4px 4px' }}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} className="nv-mob-link" onClick={() => setMenuOpen(false)}>
                  <span style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <span style={{ width:36, height:36, borderRadius:11, background:'#f1f5f9', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={linkIcons[l.href]}/>
                      </svg>
                    </span>
                    {l.label}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>

            {/* Divisor */}
            <div style={{ height:1, background:'#f1f5f9', margin:'4px 20px 12px' }} />

            {/* Botones CTA */}
            <div className="nv-mob-actions">
              <Link href="/login" className="nv-mob-login-btn" onClick={() => setMenuOpen(false)}>
                Iniciar sesión
              </Link>
              <Link href="/registro" className="nv-mob-signup-btn" onClick={() => setMenuOpen(false)}>
                Empezar gratis
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            {/* Footer info */}
            <div className="nv-mob-footer">
              <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 3px 10px rgba(46,196,182,.3)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>¿Tienes dudas?</p>
                <p style={{ fontSize:12, color:'#64748b', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>hola@samgple.com · Resp. en &lt;24h</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}