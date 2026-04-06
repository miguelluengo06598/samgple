import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './logout-button'

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const [
    { data: account },
    { data: wallet },
    { data: stores },
    { data: threads },
    { data: invoices },
    { data: vapiConfig },
  ] = await Promise.all([
    admin.from('accounts').select('name,email').eq('id', accountId).single(),
    admin.from('wallets').select('balance').eq('account_id', accountId).single(),
    admin.from('stores').select('id').eq('account_id', accountId),
    admin.from('support_threads').select('id').eq('account_id', accountId).eq('status', 'open'),
    admin.from('invoice_requests').select('id').eq('account_id', accountId).eq('status', 'pending'),
    admin.from('vapi_configs').select('active,assistant_name').eq('account_id', accountId).single(),
  ])

  const F = 'system-ui,-apple-system,sans-serif'
  const initial        = account?.name?.charAt(0).toUpperCase() ?? '?'
  const balance        = Number(wallet?.balance ?? 0).toFixed(2)
  const openTickets    = threads?.length ?? 0
  const pendingInvoices = invoices?.length ?? 0
  const storeCount     = stores?.length ?? 0
  const vapiActive     = vapiConfig?.active ?? false
  const assistantName  = vapiConfig?.assistant_name ?? 'Asistente'

  type Item = {
    href: string; label: string; desc: string
    iconColor: string; iconBg: string; svgPath: string
    badge?: string; badgeColor?: string; badgeBg?: string
    highlight?: boolean
  }
  type Group = { title?: string; items: Item[] }

  const groups: Group[] = [
    {
      title: 'Cuenta',
      items: [
        {
          href: '/configuracion/cuenta',
          label: 'Mi cuenta',
          desc: 'Nombre, email y contraseña',
          iconColor: '#2EC4B6', iconBg: '#f0fdf4',
          svgPath: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7m-4 0a4 4 0 108 0a4 4 0 10-8 0',
        },
        {
          href: '/configuracion/tiendas',
          label: 'Tiendas Shopify',
          desc: 'Conecta y gestiona tus tiendas',
          iconColor: '#16a34a', iconBg: '#f0fdf4',
          svgPath: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18',
          badge: storeCount > 0 ? `${storeCount} conectada${storeCount > 1 ? 's' : ''}` : 'Ninguna',
          badgeColor: storeCount > 0 ? '#15803d' : '#92400e',
          badgeBg: storeCount > 0 ? '#dcfce7' : '#fef3c7',
        },
      ],
    },
    {
      title: 'Asistente IA',
      items: [
        {
          href: '/configuracion/asistente',
          label: vapiActive ? assistantName : 'Asistente de llamadas',
          desc: vapiActive ? 'Activo · Confirmando pedidos automáticamente' : 'Configura tu agente de llamadas VAPI',
          iconColor: vapiActive ? '#0f766e' : '#5da7ec',
          iconBg: vapiActive ? '#f0fdf4' : '#eff6ff',
          svgPath: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z',
          badge: vapiActive ? 'Activo' : 'Inactivo',
          badgeColor: vapiActive ? '#15803d' : '#92400e',
          badgeBg: vapiActive ? '#dcfce7' : '#fef3c7',
          highlight: !vapiActive,
        },
      ],
    },
    {
      title: 'Facturación',
      items: [
        {
          href: '/configuracion/tokens',
          label: 'Tokens',
          desc: 'Saldo, cupones y packs',
          iconColor: '#d97706', iconBg: '#fffbeb',
          svgPath: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2',
          badge: `${balance} tkn`,
          badgeColor: '#92400e', badgeBg: '#fef3c7',
        },
        {
          href: '/configuracion/facturas',
          label: 'Facturas',
          desc: 'Solicita y gestiona facturas',
          iconColor: '#8b5cf6', iconBg: '#faf5ff',
          svgPath: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6',
          badge: pendingInvoices > 0 ? `${pendingInvoices} pendiente${pendingInvoices > 1 ? 's' : ''}` : undefined,
          badgeColor: '#6d28d9', badgeBg: '#ede9fe',
        },
      ],
    },
    {
      title: 'Soporte',
      items: [
        {
          href: '/configuracion/soporte',
          label: 'Soporte',
          desc: 'Chat en tiempo real con el equipo',
          iconColor: '#3b82f6', iconBg: '#eff6ff',
          svgPath: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
          badge: openTickets > 0 ? `${openTickets} abierto${openTickets > 1 ? 's' : ''}` : undefined,
          badgeColor: '#1d4ed8', badgeBg: '#dbeafe',
        },
        {
          href: '/configuracion/informe',
          label: 'Informe semanal',
          desc: 'Análisis IA a tu email cada semana',
          iconColor: '#ec4899', iconBg: '#fdf2f8',
          svgPath: 'M18 20v-10 M12 20v-16 M6 20v-6',
          badge: '0.5 tkn',
          badgeColor: '#9d174d', badgeBg: '#fce7f3',
        },
      ],
    },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .cfg-item { transition:background 0.12s, transform 0.12s; }
        .cfg-item:hover { background:#f8fafc!important; }
        .cfg-item:active { transform:scale(0.99); }
        .cfg-banner { transition:all 0.15s; }
        .cfg-banner:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(46,196,182,0.15)!important; }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Configuración</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>{account?.email ?? 'Tu cuenta'}</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', boxShadow: '0 4px 14px rgba(46,196,182,0.3)', flexShrink: 0 }}>
              {initial}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Stats rápidas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, animation: 'fadeUp 0.2s ease both' }}>
            {[
              { label: 'Tokens',   value: balance,                                   color: '#d97706', bg: '#fffbeb', border: '#fde68a', suffix: 'tkn' },
              { label: 'Tiendas',  value: String(storeCount),                        color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', suffix: '' },
              { label: 'Soporte',  value: String(openTickets),                       color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', suffix: openTickets === 1 ? 'ticket' : 'tickets' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: '14px 16px', border: `1.5px solid ${s.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', opacity: 0.7 }}>{s.label}</p>
                <p style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: 800, color: s.color, margin: 0, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</p>
                {s.suffix && <p style={{ fontSize: 10, color: s.color, margin: '2px 0 0', opacity: 0.6 }}>{s.suffix}</p>}
              </div>
            ))}
          </div>

          {/* Banner VAPI inactivo */}
          {!vapiActive && (
            <Link href="/configuracion/asistente" style={{ textDecoration: 'none' }} className="cfg-banner">
              <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', borderRadius: 20, padding: '18px 20px', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 4px 16px rgba(46,196,182,0.1)', animation: 'fadeUp 0.2s ease 0.05s both' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(46,196,182,0.3)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>Activa tu asistente de llamadas</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Conecta tu número Twilio y empieza a confirmar pedidos automáticamente</p>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            </Link>
          )}

          {/* Grupos */}
          {groups.map((group, gi) => (
            <div key={gi} style={{ animation: `fadeUp 0.2s ease ${0.05 + gi * 0.04}s both` }}>
              {group.title && (
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px 4px' }}>{group.title}</p>
              )}
              <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                {group.items.map((item, ii) => (
                  <Link key={item.href} href={item.href} className="cfg-item"
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 'clamp(14px,3vw,18px) clamp(14px,3vw,20px)', borderBottom: ii < group.items.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration: 'none', background: '#fff' }}>

                    <div style={{ width: 42, height: 42, borderRadius: 13, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={item.svgPath}/>
                      </svg>
                      {item.highlight && (
                        <span style={{ position: 'absolute', top: -3, right: -3, width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', border: '2px solid #fff', animation: 'pulse 2s infinite' }} />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.desc}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      {item.badge && (
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: item.badgeBg, color: item.badgeColor, whiteSpace: 'nowrap' }}>
                          {item.badge}
                        </span>
                      )}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div style={{ animation: `fadeUp 0.2s ease ${0.05 + groups.length * 0.04}s both` }}>
            <LogoutButton />
          </div>

          {/* Footer */}
          <p style={{ fontSize: 11, color: '#cbd5e1', textAlign: 'center', margin: '4px 0 0' }}>
            SAMGPLE · v1.0 · <a href="mailto:soporte@samgple.com" style={{ color: '#94a3b8', textDecoration: 'none' }}>soporte@samgple.com</a>
          </p>

        </div>
      </div>
    </>
  )
}