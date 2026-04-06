import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function Footer() {
  return (
    <>
      <style>{`
        * { box-sizing:border-box; }
        .ft-link {
          font-size:13px; font-weight:500; color:#64748b; text-decoration:none;
          display:flex; align-items:center; gap:6px; padding:5px 0;
          transition:color 0.15s; font-family:${F};
        }
        .ft-link:hover { color:#0f766e; }
        .ft-link:hover .ft-link-dot { opacity:1; transform:translateX(0); }
        .ft-link-dot {
          width:4px; height:4px; border-radius:50%; background:#2EC4B6;
          opacity:0; transform:translateX(-4px); transition:all 0.15s; flex-shrink:0;
        }
        .ft-social {
          width:36px; height:36px; border-radius:10px;
          background:#f8fafc; border:1.5px solid #f1f5f9;
          display:inline-flex; align-items:center; justify-content:center;
          transition:all 0.2s; text-decoration:none; flex-shrink:0;
        }
        .ft-social:hover { background:#f0fdf4; border-color:#86efac; transform:translateY(-2px); box-shadow:0 4px 12px rgba(46,196,182,.15); }
        .ft-social:hover svg { stroke:#2EC4B6 !important; }
        .ft-cta {
          display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:700;
          padding:11px 22px; border-radius:12px;
          background:linear-gradient(135deg,#0f172a,#1e293b);
          color:#fff; text-decoration:none; font-family:${F};
          transition:all 0.2s; box-shadow:0 4px 16px rgba(15,23,42,.2);
          white-space:nowrap;
        }
        .ft-cta:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(15,23,42,.25); }
        .ft-cta-outline {
          display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:600;
          padding:11px 20px; border-radius:12px;
          border:1.5px solid #e2e8f0; background:#fff;
          color:#0f172a; text-decoration:none; font-family:${F};
          transition:all 0.2s;
        }
        .ft-cta-outline:hover { border-color:#bbf7d0; background:#f0fdf4; color:#0f766e; transform:translateY(-2px); }
        .ft-bl { font-size:11px; color:#94a3b8; text-decoration:none; transition:color 0.15s; font-family:${F}; }
        .ft-bl:hover { color:#0f766e; }
        .ft-col-title {
          font-size:10px; font-weight:800; color:#94a3b8;
          text-transform:uppercase; letter-spacing:.12em; margin:0 0 16px;
          display:flex; align-items:center; gap:8px;
        }
        .ft-col-title::after {
          content:''; flex:1; height:1px; background:#f1f5f9;
        }
        @media(max-width:900px) { .ft-grid { grid-template-columns:1fr 1fr!important; } .ft-brand { grid-column:span 2!important; } }
        @media(max-width:520px) { .ft-grid { grid-template-columns:1fr!important; } .ft-brand { grid-column:span 1!important; } .ft-bottom { flex-direction:column!important; align-items:flex-start!important; } }
      `}</style>

      <footer style={{ background: '#fff', borderTop: '1.5px solid #f1f5f9', fontFamily: F }}>

        {/* ── CTA BANNER ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0c1a2e 0%, #0f2a1e 100%)',
          padding: 'clamp(32px,5vw,52px) clamp(20px,5vw,80px)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decoración */}
          <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-40, left:80, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>

          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', position: 'relative' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(46,196,182,.12)', border: '1px solid rgba(46,196,182,.25)', borderRadius: 20, padding: '4px 12px', marginBottom: 12 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6', display: 'inline-block' }}/>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', letterSpacing: '.08em', textTransform: 'uppercase' }}>120+ Tiendas activas</span>
              </div>
              <h3 style={{ fontSize: 'clamp(18px,3vw,28px)', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                Empieza a confirmar pedidos<br/>
                <span style={{ color: '#2EC4B6' }}>COD hoy mismo</span>
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', margin: 0 }}>
                Sin tarjeta de crédito · Tokens de bienvenida · Sin permanencia
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/registro" className="ft-cta" style={{ background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', boxShadow: '0 4px 20px rgba(46,196,182,.35)' }}>
                Crear cuenta gratis
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/contacto" className="ft-cta-outline" style={{ background: 'rgba(255,255,255,.06)', border: '1.5px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.8)' }}>
                Hablar con ventas
              </Link>
            </div>
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(40px,6vw,64px) clamp(20px,5vw,80px)' }}>
          <div className="ft-grid" style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 1fr', gap: 'clamp(28px,4vw,56px)', paddingBottom: 40, borderBottom: '1.5px solid #f1f5f9' }}>

            {/* ── MARCA ── */}
            <div className="ft-brand">
              {/* Logo */}
              <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(46,196,182,.3)', flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  SAMG<span style={{ color: '#2EC4B6' }}>PLE</span>
                </span>
              </Link>

              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8, margin: '0 0 22px', maxWidth: 280 }}>
                Validación de pedidos COD con inteligencia artificial. Reduce devoluciones hasta un 42% antes de enviar.
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
                {[
                  { v: '-42%', l: 'devoluciones', c: '#0f766e', bg: '#f0fdf4', b: '#bbf7d0' },
                  { v: '87%', l: 'confirmación', c: '#0284c7', bg: '#f0f9ff', b: '#bae6fd' },
                  { v: '120+', l: 'tiendas', c: '#7c3aed', bg: '#faf5ff', b: '#e9d5ff' },
                ].map(s => (
                  <div key={s.l} style={{ background: s.bg, border: `1.5px solid ${s.b}`, borderRadius: 12, padding: '8px 14px', textAlign: 'center' }}>
                    <p style={{ fontSize: 16, fontWeight: 900, color: s.c, margin: '0 0 1px', letterSpacing: '-0.5px' }}>{s.v}</p>
                    <p style={{ fontSize: 9, color: s.c, margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.7 }}>{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Redes */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Instagram', href: '#', fill: false, path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                  { label: 'LinkedIn', href: '#', fill: false, path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                  { label: 'X / Twitter', href: '#', fill: true, path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { label: 'Email', href: 'mailto:soporte@samgple.com', fill: false, path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7-10-7' },
                ].map(s => (
                  <a key={s.label} href={s.href} className="ft-social" aria-label={s.label}>
                    <svg width="14" height="14" viewBox="0 0 24 24"
                      fill={s.fill ? '#94a3b8' : 'none'}
                      stroke={s.fill ? 'none' : '#94a3b8'}
                      strokeWidth="1.8" strokeLinecap="round">
                      <path d={s.path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* ── PRODUCTO ── */}
            <div>
              <p className="ft-col-title">Producto</p>
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Cómo funciona', href: '/metodologia' },
                { label: 'Precios', href: '/precios' },
                { label: 'Crear cuenta', href: '/registro' },
                { label: 'Iniciar sesión', href: '/login' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="ft-link">
                  <span className="ft-link-dot"/>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── SOPORTE ── */}
            <div>
              <p className="ft-col-title">Soporte</p>
              {[
                { label: 'Contacto', href: '/contacto' },
                { label: 'soporte@samgple.com', href: 'mailto:soporte@samgple.com' },
                { label: 'Demo gratuita', href: '/contacto' },
                { label: 'Documentación', href: '/metodologia' },
                { label: 'Soporte cliente', href: '/configuracion/soporte' },
              ].map(l => (
                <Link key={l.label} href={l.href} className="ft-link">
                  <span className="ft-link-dot"/>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── LEGAL ── */}
            <div>
              <p className="ft-col-title">Legal</p>
              {[
                { label: 'Política de privacidad', href: '/privacidad' },
                { label: 'Política de cookies', href: '/cookies' },
                { label: 'Aviso legal', href: '/aviso-legal' },
                { label: 'Términos de uso', href: '/terminos' },
              ].map(l => (
                <Link key={l.href} href={l.href} className="ft-link">
                  <span className="ft-link-dot"/>
                  {l.label}
                </Link>
              ))}

              {/* Badges de compliance */}
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { icon: '🔒', label: 'AES-256 Encrypted' },
                  { icon: '🇪🇺', label: 'RGPD Compliant' },
                ].map(b => (
                  <div key={b.label} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#f8fafc', border: '1px solid #f1f5f9',
                    borderRadius: 8, padding: '5px 10px',
                  }}>
                    <span style={{ fontSize: 11 }}>{b.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '.04em' }}>{b.label}</span>
                  </div>
                ))}
              </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,.5)' }}/>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Todos los sistemas operativos · eCommerce COD</span>
            </div>
          </div>
        </div>

      </footer>
    </>
  )
}