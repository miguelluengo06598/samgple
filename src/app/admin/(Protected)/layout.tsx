import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/admin/stats',      label: 'Resumen',    color: '#2EC4B6', icon: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
  { href: '/admin/llamadas',   label: 'Llamadas',   color: '#0284c7', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' },
  { href: '/admin/users',      label: 'Usuarios',   color: '#3b82f6', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z' },
  { href: '/admin/packs',      label: 'Packs',      color: '#ea580c', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { href: '/admin/coupons',    label: 'Cupones',    color: '#ec4899', icon: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01' },
  { href: '/admin/support',    label: 'Soporte',    color: '#f59e0b', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  { href: '/admin/invoices',   label: 'Facturas',   color: '#8b5cf6', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6' },
  { href: '/admin/operadores', label: 'Operadores', color: '#0f766e', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75' },
  { href: '/admin/contacts',   label: 'Contactos',  color: '#22c55e', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
]

const F = "'DM Sans', system-ui, sans-serif"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const secret = cookieStore.get('admin_secret')?.value

  // Si no está autenticado, redirigir a login
  // El layout de login NO debe estar aquí — login está fuera de este layout
  if (secret !== process.env.ADMIN_SECRET) {
    redirect('/admin/login')
  }

  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, fontFamily: F, background: '#f1f5f9' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
          *, *::before, *::after { box-sizing: border-box; }
          @keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
          .adm-nav-link {
            transition: all .15s; text-decoration: none;
            display: flex; align-items: center; gap: 10px;
            padding: 9px 12px; border-radius: 14px;
            font-family: ${F};
          }
          .adm-nav-link:hover { background: rgba(0,0,0,.03); }
          .adm-logout {
            display: flex; align-items: center; gap: 8px;
            padding: 10px 12px; border-radius: 14px;
            border: 1.5px solid #fecaca; background: #fff;
            color: #dc2626; cursor: pointer; font-size: 13px;
            font-weight: 700; width: 100%; margin-top: 8px;
            transition: all .15s; font-family: ${F};
          }
          .adm-logout:hover { background: #fef2f2; }
          @media(max-width:767px) {
            .adm-sidebar { left: -260px !important; }
            .adm-main { margin-left: 0 !important; padding: 20px 16px !important; }
          }
          @media(min-width:768px) {
            .adm-sidebar { left: 0 !important; }
            .adm-main { margin-left: 240px; }
          }
        `}</style>

        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <aside className="adm-sidebar" style={{ position: 'fixed', top: 0, bottom: 0, width: 240, background: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', padding: '0 10px 16px', zIndex: 50 }}>
            {/* Logo */}
            <div style={{ padding: '20px 10px 16px', borderBottom: '1px solid #f1f5f9', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(46,196,182,.35)', flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>SAMGPLE</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6', animation: 'adm-pulse 2s infinite', display: 'inline-block' }} />
                    <p style={{ fontSize: 10, color: '#0f766e', margin: 0, fontWeight: 600 }}>Admin panel</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
              {NAV.map(n => (
                <Link key={n.href} href={n.href} className="adm-nav-link">
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${n.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={n.color} strokeWidth="2" strokeLinecap="round">
                      <path d={n.icon} />
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>{n.label}</span>
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <button className="adm-logout"
              onClick={async () => {
                await fetch('/api/admin/auth', { method: 'DELETE' })
                window.location.href = '/admin/login'
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar sesión
            </button>
          </aside>

          <main className="adm-main" style={{ flex: 1, minHeight: '100vh', padding: 'clamp(20px,3vw,32px)' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}