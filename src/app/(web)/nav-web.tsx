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
  const mutedColor = scrolled ? '#64748b' : 'rgba(255,255,255,0.7)'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .nv-root * { font-family: 'DM Sans', system-ui, sans-serif; }

        @keyframes nv-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes nv-drawer { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nv-overlay { from{opacity:0} to{opacity:1} }

        @media(max-width:768px){
          .nv-links   { display:none !important; }
          .nv-actions { display:none !important; }
          .nv-burger  { display:flex !important; }
        }
        @media(min-width:769px){
          .nv-mobile-overlay { display:none !important; }
          .nv-drawer         { display:none !important; }
        }

        .nv-link {
          font-size: 14px; font-weight: 500;
          text-decoration: none;
          padding: 7px 12px; border-radius: 10px;
          transition: all .15s ease;
          letter-spacing: -.1px;
          white-space: nowrap;
          position: relative;
        }
        .nv-link::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 12px; right: 12px;
          height: 1.5px;
          background: #2EC4B6;
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform .2s ease;
          transform-origin: left;
        }
        .nv-link:hover::after { transform: scaleX(1); }
        .nv-link:hover { color: #0f172a !important; background: rgba(46,196,182,0.06) !important; }

        .nv-link-dark:hover {
          color: #fff !important;
          background: rgba(255,255,255,0.08) !important;
        }
        .nv-link-dark::after { background: #2EC4B6; }

        .nv-btn-login {
          font-size: 13px; font-weight: 600;
          padding: 8px 17px; border-radius: 10px;
          text-decoration: none;
          transition: all .15s ease;
          white-space: nowrap;
          letter-spacing: -.1px;
        }
        .nv-btn-login:hover { background: rgba(255,255,255,0.06); }
        .nv-btn-login.light:hover { background: #f8fafc; }

        .nv-btn-signup {
          font-size: 13px; font-weight: 700;
          padding: 9px 18px; border-radius: 11px;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 6px;
          white-space: nowrap;
          letter-spacing: -.1px;
          background: linear-gradient(135deg, #2EC4B6, #1A9E8F);
          color: #fff;
          box-shadow: 0 4px 16px rgba(46,196,182,.4);
          transition: all .18s cubic-bezier(.34,1.56,.64,1);
          will-change: transform;
          border: none;
        }
        .nv-btn-signup:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(46,196,182,.5);
        }
        .nv-btn-signup:active { transform: scale(.97); }

        .nv-burger-btn {
          display: none;
          width: 40px; height: 40px; border-radius: 11px;
          cursor: pointer;
          align-items: center; justify-content: center;
          transition: all .2s ease;
          flex-shrink: 0;
        }
        .nv-burger-btn:active { transform: scale(.94); }

        .nv-mobile-overlay {
          position: fixed; inset: 0; z-index: 998;
          background: rgba(15,23,42,.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          animation: nv-overlay .2s ease forwards;
        }

        .nv-drawer {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 999;
          background: #fff;
          border-bottom-left-radius: 26px;
          border-bottom-right-radius: 26px;
          padding: 0 18px 24px;
          display: flex; flex-direction: column; gap: 0;
          animation: nv-drawer .25s cubic-bezier(.34,1.2,.64,1) forwards;
          box-shadow: 0 20px 60px rgba(0,0,0,.14);
          overflow: hidden;
        }

        .nv-drawer-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 15px 0 18px;
          border-bottom: 1px solid #f1f5f9;
          margin-bottom: 14px;
        }

        .nv-mob-link {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 15px; font-weight: 600; color: #0f172a;
          text-decoration: none;
          padding: 12px 13px; border-radius: 13px;
          margin-bottom: 3px;
          transition: background .15s ease;
          letter-spacing: -.2px;
        }
        .nv-mob-link:hover { background: #f8fafc; }
        .nv-mob-link:active { background: #f1f5f9; }

        .nv-mob-divider { height: 1px; background: #f1f5f9; margin: 10px 0; }

        .nv-mob-login {
          display: block; font-size: 14px; font-weight: 600;
          padding: 12px; border-radius: 12px;
          border: 1.5px solid #e2e8f0; color: #0f172a;
          text-decoration: none; text-align: center;
          margin-bottom: 8px;
          background: #fff;
          transition: all .15s ease;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .nv-mob-login:hover { background: #f8fafc; border-color: #cbd5e1; }

        .nv-mob-signup {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 15px; font-weight: 700;
          padding: 13px; border-radius: 14px;
          background: linear-gradient(135deg, #2EC4B6, #1A9E8F);
          color: #fff; text-decoration: none;
          margin-bottom: 16px;
          box-shadow: 0 6px 20px rgba(46,196,182,.35);
          transition: all .15s ease;
          font-family: 'DM Sans', system-ui, sans-serif;
          letter-spacing: -.2px;
        }
        .nv-mob-signup:active { transform: scale(.98); }

        .nv-mob-footer {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 15px; border-radius: 15px;
          background: linear-gradient(135deg, rgba(46,196,182,.06), rgba(99,102,241,.05));
          border: 1px solid rgba(46,196,182,.15);
        }

        .nv-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #2EC4B6; display: inline-block;
          box-shadow: 0 0 6px rgba(46,196,182,.7);
          animation: nv-pulse 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="nv-root" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        zIndex: 1000, height: 66,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,48px)',
        background: scrolled
          ? 'rgba(255,255,255,0.95)'
          : 'rgba(8,15,36,0.52)',
        backdropFilter: 'blur(22px) saturate(180%)',
        WebkitBackdropFilter: 'blur(22px) saturate(180%)',
        borderBottom: scrolled
          ? '1px solid rgba(226,232,240,0.8)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled
          ? '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.05)'
          : 'none',
        transition: 'background .3s ease, border-color .3s ease, box-shadow .3s ease',
        fontFamily: F,
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <div style={{
            width:34, height:34, borderRadius:10,
            background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 14px rgba(46,196,182,0.4)',
            flexShrink:0,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span style={{ fontSize:17, fontWeight:800, letterSpacing:'-0.6px', color:textColor, transition:'color .3s', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
            SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
          </span>
        </Link>

        {/* Centro — links */}
        <div className="nv-links" style={{ display:'flex', alignItems:'center', gap:1 }}>
          {[
            { label:'Inicio',        href:'/' },
            { label:'Cómo funciona', href:'/metodologia' },
            { label:'Precios',       href:'/precios' },
            { label:'Contacto',      href:'/contacto' },
          ].map(l => (
            <Link
              key={l.href} href={l.href}
              className={`nv-link ${scrolled ? '' : 'nv-link-dark'}`}
              style={{ color:mutedColor, transition:'color .3s, background .15s' }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Derecha — botones */}
        <div className="nv-actions" style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>

          {/* Badge live */}
          <div style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'5px 11px', borderRadius:20,
            background: scrolled ? 'rgba(46,196,182,0.06)' : 'rgba(46,196,182,0.1)',
            border: `1px solid ${scrolled ? 'rgba(46,196,182,0.18)' : 'rgba(46,196,182,0.25)'}`,
            marginRight:4,
          }}>
            <span className="nv-live-dot" />
            <span style={{ fontSize:11, fontWeight:700, color: scrolled ? '#0f766e' : '#5eead4', letterSpacing:'0.04em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>EN VIVO</span>
          </div>

          <Link href="/login"
            className={`nv-btn-login ${scrolled ? 'light' : ''}`}
            style={{
              border:`1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}`,
              color:textColor, background:'transparent',
              transition:'all .15s',
            }}>
            Iniciar sesión
          </Link>

          <Link href="/registro" className="nv-btn-signup">
            Empezar gratis
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="nv-burger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            border:`1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}`,
            background: scrolled ? '#fff' : 'rgba(255,255,255,0.07)',
          }}
        >
          {menuOpen
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </nav>

      {/* ── MENÚ MÓVIL ── */}
      {menuOpen && (
        <>
          <div className="nv-mobile-overlay" onClick={() => setMenuOpen(false)} />

          <div className="nv-drawer">
            {/* Cabecera */}
            <div className="nv-drawer-head">
              <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:9 }}>
                <div style={{ width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(46,196,182,.35)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <span style={{ fontSize:15, fontWeight:800, letterSpacing:'-0.5px', color:'#0f172a', fontFamily:"'DM Sans',system-ui,sans-serif" }}>SAMG<span style={{ color:'#2EC4B6' }}>PLE</span></span>
              </Link>
              <button onClick={() => setMenuOpen(false)} style={{ width:34, height:34, borderRadius:10, border:'1.5px solid #f1f5f9', background:'#f8fafc', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Links */}
            {[
              { label:'Inicio',        href:'/', icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { label:'Cómo funciona', href:'/metodologia', icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10' },
              { label:'Precios',       href:'/precios', icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label:'Contacto',      href:'/contacto', icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="nv-mob-link" onClick={() => setMenuOpen(false)}>
                <span style={{ display:'flex', alignItems:'center', gap:11 }}>
                  <span style={{ width:32, height:32, borderRadius:9, background:'#f1f5f9', display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={l.icon}/></svg>
                  </span>
                  {l.label}
                </span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}

            <div className="nv-mob-divider" />

            <Link href="/login" className="nv-mob-login" onClick={() => setMenuOpen(false)}>
              Iniciar sesión
            </Link>
            <Link href="/registro" className="nv-mob-signup" onClick={() => setMenuOpen(false)}>
              Empezar gratis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>

            <div className="nv-mob-footer">
              <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 3px 10px rgba(46,196,182,.3)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </div>
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:'#0f172a', margin:'0 0 2px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>¿Tienes dudas?</p>
                <p style={{ fontSize:11, color:'#64748b', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>hola@samgple.com · Resp. en &lt;24h</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}