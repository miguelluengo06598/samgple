import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function Footer() {
  return (
    <>
      <style>{`
        * { box-sizing:border-box; }
        .ft-link { font-size:13px; font-weight:500; color:#64748b; text-decoration:none; display:block; padding:4px 0; transition:color 0.15s; font-family:${F}; }
        .ft-link:hover { color:#0f172a; }
        .ft-social { width:34px; height:34px; border-radius:10px; background:#f8fafc; border:1.5px solid #f1f5f9; display:inline-flex; align-items:center; justify-content:center; transition:all 0.15s; text-decoration:none; flex-shrink:0; }
        .ft-social:hover { background:#f0fdf4; border-color:#bbf7d0; }
        .ft-cta { display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:700; padding:10px 20px; border-radius:12px; background:#0f172a; color:#fff; text-decoration:none; font-family:${F}; transition:all 0.15s ease; box-shadow:0 4px 14px rgba(15,23,42,0.15); white-space:nowrap; }
        .ft-cta:hover { background:#1e293b; transform:translateY(-1px); box-shadow:0 8px 24px rgba(15,23,42,0.2); }
        .ft-bl { font-size:11px; color:#94a3b8; text-decoration:none; transition:color 0.15s; font-family:${F}; }
        .ft-bl:hover { color:#0f172a; }
        @media(max-width:900px) { .ft-grid { grid-template-columns:1fr 1fr!important; } .ft-brand { grid-column:span 2!important; } }
        @media(max-width:520px) { .ft-grid { grid-template-columns:1fr!important; } .ft-brand { grid-column:span 1!important; } .ft-bottom { flex-direction:column!important; align-items:flex-start!important; } }
      `}</style>

      <footer style={{ background: '#fff', borderTop: '1.5px solid #f1f5f9', fontFamily: F }}>

        {/* ── CTA BANNER ── */}
        <div style={{ background: 'linear-gradient(135deg,#f0fdf9,#f0f9ff)', borderBottom: '1.5px solid #f1f5f9', padding: 'clamp(28px,4vw,40px) clamp(20px,5vw,80px)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '4px 12px', marginBottom: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', letterSpacing: '0.07em' }}>120+ TIENDAS ACTIVAS</span>
              </div>
              <h3 style={{ fontSize: 'clamp(18px,3vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                Empieza a confirmar pedidos COD hoy mismo
              </h3>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Sin tarjeta de crédito · Tokens de bienvenida · Sin permanencia</p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/registro" className="ft-cta">
                Crear cuenta gratis
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/contacto"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#0f172a', textDecoration: 'none', transition: 'all 0.15s', fontFamily: F }}>
                Hablar con ventas
              </Link>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,80px)' }}>
          <div className="ft-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'clamp(28px,4vw,56px)', paddingBottom: 40, borderBottom: '1.5px solid #f1f5f9' }}>

            {/* ── MARCA ── */}
            <div className="ft-brand">
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(46,196,182,0.3)', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  SAMG<span style={{ color: '#2EC4B6' }}>PLE</span>
                </span>
              </Link>

              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: '0 0 20px', maxWidth: 280 }}>
                Validación de pedidos COD con inteligencia artificial. Reduce devoluciones hasta un 42% antes de enviar.
              </p>

              {/* Stats mini */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                {[
                  { v: '-42%', l: 'devoluciones', c: '#0f766e', bg: '#f0fdf4', b: '#bbf7d0' },
                  { v: '87%', l: 'confirmación', c: '#0284c7', bg: '#f0f9ff', b: '#bae6fd' },
                  { v: '120+', l: 'tiendas', c: '#7c3aed', bg: '#faf5ff', b: '#e9d5ff' },
                ].map(s => (
                  <div key={s.l} style={{ background: s.bg, border: `1px solid ${s.b}`, borderRadius: 10, padding: '6px 12px', textAlign: 'center' }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: s.c, margin: '0 0 1px', letterSpacing: '-0.5px' }}>{s.v}</p>
                    <p style={{ fontSize: 9, color: s.c, margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Redes */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z', isFill: true },
                  { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z', isFill: false },
                  { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z', isFill: true },
                  { label: 'Email', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7-10-7', isFill: false },
                ].map(s => (
                  <a key={s.label} href={s.label === 'Email' ? 'mailto:soporte@samgple.com' : '#'} className="ft-social" aria-label={s.label}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={s.isFill ? '#94a3b8' : 'none'} stroke={s.isFill ? 'none' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round">
                      <path d={s.path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* ── PRODUCTO ── */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Producto</p>
              <Link href="/" className="ft-link">Inicio</Link>
              <Link href="/metodologia" className="ft-link">Cómo funciona</Link>
              <Link href="/precios" className="ft-link">Precios</Link>
              <Link href="/registro" className="ft-link">Crear cuenta</Link>
              <Link href="/login" className="ft-link">Iniciar sesión</Link>
            </div>

            {/* ── SOPORTE ── */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Soporte</p>
              <Link href="/contacto" className="ft-link">Contacto</Link>
              <a href="mailto:soporte@samgple.com" className="ft-link">soporte@samgple.com</a>
              <Link href="/contacto" className="ft-link">Demo gratuita</Link>
              <Link href="/metodologia" className="ft-link">Documentación</Link>
              <Link href="/configuracion/soporte" className="ft-link">Soporte cliente</Link>
            </div>

            {/* ── LEGAL ── */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>Legal</p>
              <Link href="/privacidad" className="ft-link">Política de privacidad</Link>
              <Link href="/cookies" className="ft-link">Política de cookies</Link>
              <Link href="/aviso-legal" className="ft-link">Aviso legal</Link>
              <Link href="/terminos" className="ft-link">Términos de uso</Link>
            </div>

          </div>

          {/* ── BOTTOM BAR ── */}
          <div className="ft-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                © {new Date().getFullYear()} SAMGPLE. Todos los derechos reservados.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  { label: 'Privacidad', href: '/privacidad' },
                  { label: 'Cookies', href: '/cookies' },
                  { label: 'Términos', href: '/terminos' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="ft-bl">{l.label}</Link>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Sistema operativo · eCommerce COD</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}