'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NavWeb() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const F = 'system-ui,-apple-system,sans-serif'

  return (
    <>
      <style>{`
        @media(max-width:768px){
          .nav-desktop{display:none!important}
          .nav-hamburger{display:flex!important}
        }
        @media(min-width:769px){
          .nav-mobile{display:none!important}
        }
        .nav-link-item:hover{ color:#0f172a!important }
        .btn-login:hover{ background:#f1f5f9!important }
        .btn-signup:hover{ background:#4a96db!important;transform:translateY(-1px) }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,40px)',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
        fontFamily: F,
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'linear-gradient(135deg,#5da7ec,#3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(93,167,236,0.35)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: scrolled ? '#0f172a' : '#fff', letterSpacing: '-0.5px', transition: 'color 0.3s' }}>
            SAMG<span style={{ color: '#5da7ec' }}>PLE</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { label: 'Cómo funciona', href: '/metodologia' },
            { label: 'Precios', href: '/precios' },
            { label: 'Contacto', href: '/contacto' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="nav-link-item"
              style={{ fontSize: 14, fontWeight: 500, color: scrolled ? '#475569' : 'rgba(255,255,255,0.75)', textDecoration: 'none', padding: '8px 14px', borderRadius: 10, transition: 'all 0.15s' }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/login" className="btn-login"
            style={{ fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 10, border: `1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}`, color: scrolled ? '#0f172a' : '#fff', textDecoration: 'none', background: 'transparent', transition: 'all 0.15s' }}>
            Iniciar sesión
          </Link>
          <Link href="/registro" className="btn-signup"
            style={{ fontSize: 13, fontWeight: 700, padding: '8px 20px', borderRadius: 10, background: '#5da7ec', color: '#fff', textDecoration: 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 10px rgba(93,167,236,0.3)' }}>
            Empezar gratis
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.2)'}`, background: scrolled ? '#fff' : 'rgba(255,255,255,0.1)', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          {menuOpen
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={scrolled ? '#0f172a' : '#fff'} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={scrolled ? '#0f172a' : '#fff'} strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile" style={{ position: 'fixed', inset: '64px 0 0 0', background: '#fff', zIndex: 99, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 8, fontFamily: F, borderTop: '1px solid #f1f5f9', overflowY: 'auto' }}>
          {[
            { label: 'Cómo funciona', href: '/metodologia' },
            { label: 'Precios', href: '/precios' },
            { label: 'Contacto', href: '/contacto' },
          ].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', textDecoration: 'none', padding: '14px 16px', borderRadius: 14, background: '#f8fafc', display: 'block' }}>
              {l.label}
            </Link>
          ))}
          <div style={{ height: 1, background: '#f1f5f9', margin: '8px 0' }} />
          <Link href="/login" onClick={() => setMenuOpen(false)}
            style={{ fontSize: 14, fontWeight: 600, padding: '13px', borderRadius: 12, border: '1.5px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
            Iniciar sesión
          </Link>
          <Link href="/registro" onClick={() => setMenuOpen(false)}
            style={{ fontSize: 14, fontWeight: 700, padding: '13px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', textAlign: 'center', display: 'block' }}>
            Empezar gratis →
          </Link>
        </div>
      )}
    </>
  )
}