import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const F = "'DM Sans', system-ui, sans-serif"

function Icon({ path, color = '#64748b', size = 15 }: { path: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

export default async function AdminStatsPage() {
  const admin = createAdminClient()
  const { data: statsData } = await admin.from('admin_stats').select('*').single()
  const stats = statsData ?? {}

  // Contactos nuevos
  const { data: contacts } = await admin
    .from('contact_messages')
    .select('id')
    .eq('status', 'new')
  const newContacts = contacts?.length ?? 0

  // Llamadas pendientes
  const { data: calls } = await admin
    .from('call_requests')
    .select('id')
    .eq('status', 'pending')
  const pendingCalls = calls?.length ?? 0

  const CARDS = [
    { label: 'Cuentas',          value: stats.total_accounts ?? '—',                              color: '#2EC4B6', bg: '#f0fdf9', border: '#99f6e4', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z' },
    { label: 'Pedidos',          value: stats.total_orders ?? '—',                                color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' },
    { label: 'Entregados',       value: stats.total_delivered ?? '—',                             color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0', icon: 'M20 6L9 17l-5-5' },
    { label: 'Ingresos',         value: `${Number(stats.total_revenue ?? 0).toFixed(0)}€`,        color: '#0f766e', bg: '#f0fdf9', border: '#99f6e4', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { label: 'Tokens en circulación', value: Number(stats.total_tokens_balance ?? 0).toFixed(1), color: '#8b5cf6', bg: '#faf5ff', border: '#ddd6fe', icon: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2' },
    { label: 'Tickets abiertos', value: stats.open_tickets ?? '—',                               color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { label: 'Facturas pendientes', value: stats.pending_invoices ?? '—',                        color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6' },
    { label: 'Llamadas pendientes', value: pendingCalls,                                          color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' },
    { label: 'Contactos nuevos', value: newContacts > 0 ? `${newContacts} nuevos` : '0',         color: '#22c55e', bg: '#f0fdf4', border: '#a7f3d0', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ]

  return (
    <>
      <style>{`
        @keyframes adm-popIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        @keyframes adm-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .adm-stat-card { transition: transform .18s, box-shadow .18s; cursor: default; }
        .adm-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.07) !important; }
        .adm-stats-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 12; }
        @media(min-width:640px)  { .adm-stats-grid { grid-template-columns: repeat(3,1fr); } }
        @media(min-width:1024px) { .adm-stats-grid { grid-template-columns: repeat(4,1fr); } }
      `}</style>

      <div style={{ fontFamily: F }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Resumen</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2EC4B6', display: 'inline-block', animation: 'adm-pulse 2s infinite' }} />
            Datos en tiempo real
          </p>
        </div>

        {/* Grid */}
        <div className="adm-stats-grid" style={{ display: 'grid', gap: 12 }}>
          {CARDS.map((s, i) => (
            <div key={i} className="adm-stat-card"
              style={{ background: s.bg, borderRadius: 20, padding: 'clamp(16px,2vw,22px)', border: `1.5px solid ${s.border}`, boxShadow: '0 2px 8px rgba(0,0,0,.04)', animation: `adm-popIn .35s ${i * 0.04}s both` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.border}` }}>
                  <Icon path={s.icon} color={s.color} size={15} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 900, color: s.color, margin: 0, letterSpacing: '-1.5px', lineHeight: 1 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}