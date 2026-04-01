'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NavWeb() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{`
        @media(max-width:768px){ .nav-links-desktop{display:none!important} .nav-menu-btn{display:flex!important} }
        @media(min-width:769px){ .nav-mobile-menu{display:none!important} }
      `}</style>
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          SAMG<span style={{ color: '#5da7ec' }}>PLE</span>
        </Link>
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[{ label: 'Cómo funciona', href: '/metodologia' }, { label: 'Precios', href: '/precios' }, { label: 'Contacto', href: '/contacto' }].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 14, fontWeight: 500, color: '#475569', textDecoration: 'none' }}>{l.label}</Link>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login" style={{ fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', background: '#fff' }}>
              Iniciar sesión
            </Link>
            <Link href="/registro" style={{ fontSize: 13, fontWeight: 700, padding: '8px 18px', borderRadius: 10, border: 'none', background: '#5da7ec', color: '#fff', textDecoration: 'none' }}>
              Empezar gratis →
            </Link>
          </div>
        </div>
        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', width: 38, height: 38, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
      </nav>
      {menuOpen && (
        <div className="nav-mobile-menu" style={{ position: 'fixed', inset: '64px 0 0 0', background: '#fff', zIndex: 99, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid #f1f5f9' }}>
          {[{ label: 'Cómo funciona', href: '/metodologia' }, { label: 'Precios', href: '/precios' }, { label: 'Contacto', href: '/contacto' }].map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', textDecoration: 'none', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>{l.label}</Link>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, fontWeight: 600, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', color: '#0f172a', textDecoration: 'none', textAlign: 'center' }}>Iniciar sesión</Link>
          <Link href="/registro" onClick={() => setMenuOpen(false)} style={{ fontSize: 14, fontWeight: 700, padding: '12px', borderRadius: 12, background: '#5da7ec', color: '#fff', textDecoration: 'none', textAlign: 'center' }}>Empezar gratis →</Link>
        </div>
      )}
    </>
  )
}