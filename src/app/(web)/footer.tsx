// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .footer-root {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #0a0f1e;
          color: #fff;
          padding: clamp(56px,8vw,96px) clamp(20px,5vw,80px) 0;
          position: relative;
          overflow: hidden;
        }

        .footer-orb-1 {
          position: absolute; top: -120px; left: -80px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(46,196,182,0.08), transparent 65%);
          pointer-events: none;
        }
        .footer-orb-2 {
          position: absolute; bottom: -80px; right: -60px;
          width: 360px; height: 360px; border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.06), transparent 65%);
          pointer-events: none;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: clamp(32px,5vw,64px);
          padding-bottom: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          position: relative;
          z-index: 1;
        }

        .footer-link {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          text-decoration: none;
          display: block;
          padding: 4px 0;
          transition: color 0.15s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .footer-link:hover { color: rgba(255,255,255,0.9); }

        .footer-col-title {
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 16px;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0;
          flex-wrap: wrap;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .footer-social {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          display: inline-flex; align-items: center; justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .footer-social:hover {
          background: rgba(46,196,182,0.15);
          border-color: rgba(46,196,182,0.3);
        }

        .footer-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(46,196,182,0.08);
          border: 1px solid rgba(46,196,182,0.18);
          border-radius: 20px; padding: 5px 13px;
          margin-bottom: 20px;
        }

        .footer-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #2EC4B6;
          box-shadow: 0 0 6px rgba(46,196,182,0.8);
          animation: ft-pulse 2.5s ease-in-out infinite;
        }
        @keyframes ft-pulse {
          0%,100%{opacity:1;transform:scale(1)}
          50%{opacity:.45;transform:scale(.75)}
        }

        .footer-cta-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 700;
          padding: 10px 20px; border-radius: 11px;
          background: linear-gradient(135deg,#2EC4B6,#1A9E8F);
          color: #fff; text-decoration: none;
          box-shadow: 0 4px 14px rgba(46,196,182,0.35);
          transition: all 0.18s cubic-bezier(.34,1.56,.64,1);
          font-family: 'DM Sans', system-ui, sans-serif;
          white-space: nowrap;
        }
        .footer-cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(46,196,182,0.45);
        }

        @media(max-width:900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px 28px;
          }
          .footer-brand { grid-column: span 2; }
        }
        @media(max-width:520px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-brand { grid-column: span 1; }
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-orb-1" />
        <div className="footer-orb-2" />

        <div className="footer-grid">

          {/* ── MARCA ── */}
          <div className="footer-brand">
            <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(46,196,182,.4)', flexShrink:0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <span style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.6px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
              </span>
            </Link>

            <div className="footer-badge">
              <span className="footer-live-dot" />
              <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:'0.05em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>120+ TIENDAS ACTIVAS</span>
            </div>

            <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.75, margin:'0 0 24px', maxWidth:300, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Validación de pedidos COD con inteligencia artificial. Reduce devoluciones hasta un 42% antes de enviar.
            </p>

            <Link href="/registro" className="footer-cta-btn">
              Empezar gratis
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* ── PRODUCTO ── */}
          <div>
            <p className="footer-col-title">Producto</p>
            <Link href="/" className="footer-link">Inicio</Link>
            <Link href="/metodologia" className="footer-link">Cómo funciona</Link>
            <Link href="/precios" className="footer-link">Precios</Link>
            <Link href="/registro" className="footer-link">Crear cuenta</Link>
            <Link href="/login" className="footer-link">Iniciar sesión</Link>
          </div>

          {/* ── SOPORTE ── */}
          <div>
            <p className="footer-col-title">Soporte</p>
            <Link href="/contacto" className="footer-link">Contacto</Link>
            <a href="mailto:soporte@samgple.com" className="footer-link">soporte@samgple.com</a>
            <Link href="/contacto" className="footer-link">Demo gratuita</Link>
            <Link href="/metodologia" className="footer-link">Documentación</Link>
          </div>

          {/* ── LEGAL ── */}
          <div>
            <p className="footer-col-title">Legal</p>
            <Link href="/privacidad" className="footer-link">Política de privacidad</Link>
            <Link href="/cookies" className="footer-link">Política de cookies</Link>
            <Link href="/aviso-legal" className="footer-link">Aviso legal</Link>
            <Link href="/terminos" className="footer-link">Términos y condiciones</Link>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="footer-bottom">
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.2)', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              © {new Date().getFullYear()} SAMGPLE. Todos los derechos reservados.
            </p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {[
                { label:'Privacidad', href:'/privacidad' },
                { label:'Cookies', href:'/cookies' },
                { label:'Términos', href:'/terminos' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ fontSize:11, color:'rgba(255,255,255,0.18)', textDecoration:'none', fontFamily:"'DM Sans',system-ui,sans-serif", transition:'color .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='rgba(255,255,255,0.5)')}
                  onMouseLeave={e => (e.currentTarget.style.color='rgba(255,255,255,0.18)')}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Redes sociales */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* Instagram */}
            <a href="#" className="footer-social" aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="rgba(255,255,255,0.45)"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="footer-social" aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" className="footer-social" aria-label="X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.45)">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* Email */}
            <a href="mailto:soporte@samgple.com" className="footer-social" aria-label="Email">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── TAGLINE FINAL ── */}
        <div style={{ textAlign:'center', padding:'20px 0 32px', position:'relative', zIndex:1 }}>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.1)', margin:0, letterSpacing:'0.15em', textTransform:'uppercase', fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:600 }}>
            Hecho con precisión para el eCommerce COD
          </p>
        </div>

      </footer>
    </>
  )
}