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
        @media(max-width:768px){
          .nv-links{display:none!important}
          .nv-actions{display:none!important}
          .nv-burger{display:flex!important}
        }
        @media(min-width:769px){
          .nv-mobile{display:none!important}
        }
        .nv-item:hover{ opacity:1!important; }
        .nv-login:hover{ background:rgba(255,255,255,0.1)!important; }
        .nv-signup:hover{ background:#4a96db!important; transform:translateY(-1px); }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px,4vw,48px)',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(5,13,31,0.6)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid #f1f5f9' : '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.3s ease',
        fontFamily: F,
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: 'linear-gradient(135deg,#5da7ec,#2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(93,167,236,0.4)',
            flexShrink: 0,
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', color: textColor, transition: 'color 0.3s' }}>
            SAMG<span style={{ color: '#5da7ec' }}>PLE</span>
          </span>
        </Link>

        {/* Centro — links */}
        <div className="nv-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {[
            { label: 'Inicio', href: '/' },
            { label: 'Cómo funciona', href: '/metodologia' },
            { label: 'Precios', href: '/precios' },
            { label: 'Contacto', href: '/contacto' },
          ].map(l => (
            <Link key={l.href} href={l.href} className="nv-item"
              style={{
                fontSize: 14, fontWeight: 500, color: mutedColor,
                textDecoration: 'none', padding: '8px 14px', borderRadius: 10,
                transition: 'all 0.15s', opacity: 0.85,
              }}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Derecha — botones */}
        <div className="nv-actions" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link href="/login" className="nv-login"
            style={{
              fontSize: 13, fontWeight: 600,
              padding: '9px 18px', borderRadius: 10,
              border: `1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.18)'}`,
              color: textColor, textDecoration: 'none',
              background: 'transparent',
              transition: 'all 0.15s',
            }}>
            Iniciar sesión
          </Link>
          <Link href="/registro" className="nv-signup"
            style={{
              fontSize: 13, fontWeight: 700,
              padding: '9px 20px', borderRadius: 10,
              background: '#5da7ec', color: '#fff',
              textDecoration: 'none', border: 'none',
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 12px rgba(93,167,236,0.4)',
            }}>
            Empezar gratis
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Hamburger móvil */}
        <button className="nv-burger" onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', width: 40, height: 40, borderRadius: 11,
            border: `1.5px solid ${scrolled ? '#e2e8f0' : 'rgba(255,255,255,0.18)'}`,
            background: scrolled ? '#fff' : 'rgba(255,255,255,0.08)',
            cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
          {menuOpen
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={textColor} strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="nv-mobile" style={{
          position: 'fixed', top: 68, left: 0, right: 0, bottom: 0,
          background: '#fff', zIndex: 999,
          padding: '20px 20px 40px',
          display: 'flex', flexDirection: 'column', gap: 6,
          overflowY: 'auto', fontFamily: F,
          borderTop: '1px solid #f1f5f9',
        }}>
          {[
            { label: 'Inicio', href: '/' },
            { label: 'Cómo funciona', href: '/metodologia' },
            { label: 'Precios', href: '/precios' },
            { label: 'Contacto', href: '/contacto' },
          ].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 17, fontWeight: 600, color: '#0f172a',
                textDecoration: 'none', padding: '14px 16px',
                borderRadius: 14, background: '#f8fafc',
                display: 'block', transition: 'background 0.15s',
              }}>
              {l.label}
            </Link>
          ))}

          <div style={{ height: 1, background: '#f1f5f9', margin: '8px 0' }} />

          <Link href="/login" onClick={() => setMenuOpen(false)}
            style={{
              fontSize: 15, fontWeight: 600, padding: '14px',
              borderRadius: 12, border: '1.5px solid #e2e8f0',
              color: '#0f172a', textDecoration: 'none',
              textAlign: 'center', display: 'block', background: '#fff',
            }}>
            Iniciar sesión
          </Link>
          <Link href="/registro" onClick={() => setMenuOpen(false)}
            style={{
              fontSize: 15, fontWeight: 700, padding: '14px',
              borderRadius: 12, background: '#5da7ec',
              color: '#fff', textDecoration: 'none',
              textAlign: 'center', display: 'block',
              boxShadow: '0 4px 14px rgba(93,167,236,0.3)',
            }}>
            Empezar gratis →
          </Link>

          <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 14, background: '#f0f7ff', border: '1px solid #bfdbfe' }}>
            <p style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 600, margin: '0 0 4px' }}>¿Tienes dudas?</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Escríbenos a hola@samgple.com y te respondemos en menos de 24h.</p>
          </div>
        </div>
      )}
    </>
  )
}