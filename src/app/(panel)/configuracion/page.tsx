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

  const [{ data: account }, { data: wallet }, { data: stores }, { data: threads }, { data: invoices }] = await Promise.all([
    admin.from('accounts').select('name,email').eq('id', accountId).single(),
    admin.from('wallets').select('balance').eq('account_id', accountId).single(),
    admin.from('stores').select('id').eq('account_id', accountId),
    admin.from('support_threads').select('id').eq('account_id', accountId).eq('status', 'open'),
    admin.from('invoice_requests').select('id').eq('account_id', accountId).eq('status', 'pending'),
  ])

  const F = 'system-ui,-apple-system,sans-serif'
  const initial = account?.name?.charAt(0).toUpperCase() ?? '?'
  const balance = Number(wallet?.balance ?? 0).toFixed(2)
  const openTickets = threads?.length ?? 0
  const pendingInvoices = invoices?.length ?? 0
  const storeCount = stores?.length ?? 0

  type GroupItem = { href: string; label: string; desc: string; iconColor: string; iconBg: string; svgPath: string; badge?: string; badgeColor?: string; badgeBg?: string }
  type Group = { items: GroupItem[] }

  const groups: Group[] = [
    {
      items: [
        { href: '/configuracion/cuenta', label: 'Cuenta', desc: 'Nombre, email, contraseña y zona horaria', iconColor: '#2EC4B6', iconBg: '#f0fafa', svgPath: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7m-4 0a4 4 0 108 0a4 4 0 10-8 0' },
        { href: '/configuracion/tiendas', label: 'Tiendas', desc: 'Conecta y gestiona tus tiendas Shopify', iconColor: '#16a34a', iconBg: '#f0fdf4', svgPath: 'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18', badge: storeCount > 0 ? `${storeCount} conectada${storeCount > 1 ? 's' : ''}` : undefined, badgeColor: '#15803d', badgeBg: '#dcfce7' },
      ]
    },
    {
      items: [
        { href: '/configuracion/tokens', label: 'Tokens', desc: 'Saldo, cupones y packs de tokens', iconColor: '#d97706', iconBg: '#fffbeb', svgPath: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2', badge: balance, badgeColor: '#92400e', badgeBg: '#fef3c7' },
        { href: '/configuracion/facturas', label: 'Facturas', desc: 'Solicita y gestiona tus facturas', iconColor: '#8b5cf6', iconBg: '#faf5ff', svgPath: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6', badge: pendingInvoices > 0 ? `${pendingInvoices} pendiente${pendingInvoices > 1 ? 's' : ''}` : undefined, badgeColor: '#92400e', badgeBg: '#fef3c7' },
      ]
    },
    {
      items: [
        { href: '/configuracion/soporte', label: 'Soporte', desc: 'Chat y tickets con el equipo', iconColor: '#3b82f6', iconBg: '#eff6ff', svgPath: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', badge: openTickets > 0 ? `${openTickets} abierto${openTickets > 1 ? 's' : ''}` : undefined, badgeColor: '#1d4ed8', badgeBg: '#dbeafe' },
        { href: '/configuracion/informe', label: 'Informe semanal', desc: 'Análisis IA enviado a tu email', iconColor: '#ec4899', iconBg: '#fdf2f8', svgPath: 'M18 20v-10 M12 20v-16 M6 20v-6', badge: '0.5 tkn', badgeColor: '#9d174d', badgeBg: '#fce7f3' },
      ]
    },
  ]

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 20px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Configuración</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '2px 0 0' }}>{account?.name ?? 'Tu cuenta'}</p>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff' }}>
            {initial}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 120px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {groups.map((group, gi) => (
          <div key={gi} style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #e8f4f3' }}>
            {group.items.map((item, ii) => (
              <Link key={item.href} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: ii < group.items.length - 1 ? '1px solid #f1f5f9' : 'none', textDecoration: 'none', background: '#fff' }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={item.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.svgPath}/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: F }}>{item.label}</p>
                  <p style={{ fontSize: 11, color: '#94a3b8', margin: '1px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F }}>{item.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {item.badge && <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: item.badgeBg, color: item.badgeColor, fontFamily: F }}>{item.badge}</span>}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8d8d6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            ))}
          </div>
        ))}

        <LogoutButton />
      </div>
    </div>
  )
}