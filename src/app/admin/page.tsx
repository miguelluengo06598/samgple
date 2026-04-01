'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const F = 'system-ui,-apple-system,sans-serif'

type Section = 'stats' | 'users' | 'support' | 'invoices' | 'coupons' | 'packs' | 'contacts'

const NAV: { key: Section; label: string; color: string; iconPath: string }[] = [
  { key: 'stats',    label: 'Resumen',   color: '#2EC4B6', iconPath: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z' },
  { key: 'users',   label: 'Usuarios',  color: '#3b82f6', iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75' },
  { key: 'support', label: 'Soporte',   color: '#f59e0b', iconPath: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
  { key: 'invoices',label: 'Facturas',  color: '#8b5cf6', iconPath: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8' },
  { key: 'coupons', label: 'Cupones',   color: '#ec4899', iconPath: 'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01' },
  { key: 'packs',   label: 'Packs',     color: '#ea580c', iconPath: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { key: 'contacts',label: 'Contactos', color: '#22c55e', iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
]

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  active:      { bg: '#dcfce7', color: '#15803d', label: 'Activo' },
  suspended:   { bg: '#fee2e2', color: '#b91c1c', label: 'Suspendido' },
  open:        { bg: '#dbeafe', color: '#1d4ed8', label: 'Abierto' },
  in_progress: { bg: '#ccfbf1', color: '#0f766e', label: 'En curso' },
  resolved:    { bg: '#dcfce7', color: '#15803d', label: 'Resuelto' },
  closed:      { bg: '#f1f5f9', color: '#475569', label: 'Cerrado' },
  pending:     { bg: '#fef3c7', color: '#92400e', label: 'Pendiente' },
  in_review:   { bg: '#ede9fe', color: '#6d28d9', label: 'En revisión' },
  sent:        { bg: '#dcfce7', color: '#15803d', label: 'Enviada' },
  rejected:    { bg: '#fee2e2', color: '#b91c1c', label: 'Rechazada' },
  new:         { bg: '#dbeafe', color: '#1d4ed8', label: 'Nuevo' },
  read:        { bg: '#f1f5f9', color: '#475569', label: 'Leído' },
  replied:     { bg: '#dcfce7', color: '#15803d', label: 'Respondido' },
}

function Badge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? { bg: '#f1f5f9', color: '#475569', label: status }
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, fontFamily: F, whiteSpace: 'nowrap' }}>{c.label}</span>
}

function Icon({ path, color = '#64748b', size = 16 }: { path: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '20px', border: '1px solid #f1f5f9', marginBottom: 14 }
const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #f1f5f9', background: '#f8fafc', fontSize: 13, outline: 'none', color: '#0f172a', boxSizing: 'border-box', fontFamily: F }
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }
const td: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' }

function btnOutline(color: string, border: string): React.CSSProperties {
  return { padding: '8px 14px', borderRadius: 10, border: `2px solid ${border}`, background: '#fff', color, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: F, whiteSpace: 'nowrap' }
}

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('stats')
  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [tokenAmount, setTokenAmount] = useState('')
  const [tokenDesc, setTokenDesc] = useState('')
  const [adminReply, setAdminReply] = useState('')
  const [threadStatus, setThreadStatus] = useState('open')
  const [newCoupon, setNewCoupon] = useState({ code: '', tokens: '', max_uses: '1' })
  const [newPack, setNewPack] = useState({ name: '', tokens: '', price_eur: '', lemon_url: '' })
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null)

  const loadSection = useCallback(async (s: Section) => {
    setLoading(true)
    try {
      const endpoints: Record<Section, string> = {
        stats:    '/api/admin/stats',
        users:    '/api/admin/users',
        support:  '/api/admin/support',
        invoices: '/api/admin/invoices',
        coupons:  '/api/admin/coupons',
        packs:    '/api/admin/packs',
        contacts: '/api/admin/contacts',
      }
      const res = await fetch(endpoints[s])
      if (res.status === 401) { router.push('/admin/login'); return }
      const json = await res.json()
      setData((prev: any) => ({ ...prev, [s]: json }))
    } finally { setLoading(false) }
  }, [router])

  useEffect(() => { loadSection(section) }, [section, loadSection])

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel('admin-realtime')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'support_messages' }, () => {
      if (section === 'support') loadSection('support')
    })
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'support_threads' }, (payload: any) => {
      if (section === 'support') loadSection('support')
      if (payload.eventType === 'UPDATE' && selectedThread?.id === payload.new.id) {
        setSelectedThread((prev: any) => ({ ...prev, ...payload.new }))
      }
    })
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'invoice_requests' }, () => {
      if (section === 'invoices') loadSection('invoices')
    })
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => {
      if (section === 'users') loadSection('users')
      if (section === 'stats') loadSection('stats')
    })
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_movements' }, () => {
      if (section === 'users') loadSection('users')
      if (section === 'stats') loadSection('stats')
    })
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      if (section === 'stats') loadSection('stats')
    })
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, () => {
      if (section === 'contacts') loadSection('contacts')
    })
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [section, selectedThread, loadSection])

  async function adminAction(endpoint: string, body: any, reloadSection?: Section) {
    setSaving(true)
    try {
      await fetch(endpoint, {
        method: body._method ?? 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await loadSection(reloadSection ?? section)
    } finally { setSaving(false) }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const activeNav = NAV.find(n => n.key === section)!

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F, display: 'flex' }}>

      <style>{`
        * { box-sizing: border-box; }
        tr:hover { background: #fafafa; }
        @media (min-width: 768px) {
          .adm-sidebar { left: 0 !important; box-shadow: none !important; }
          .adm-main { margin-left: 230px !important; padding: 24px 28px !important; }
          .adm-menu-btn { display: none !important; }
          .adm-stats { grid-template-columns: repeat(3,1fr) !important; }
          .adm-two-col { grid-template-columns: 1fr 300px !important; }
          .adm-user-grid { grid-template-columns: 1fr 1fr !important; }
          .adm-hide-mobile { display: table-cell !important; }
        }
        @media (max-width: 767px) {
          .adm-main { margin-left: 0 !important; padding: 16px 14px !important; }
          .adm-sidebar { width: 260px !important; }
          .adm-stats { grid-template-columns: 1fr 1fr !important; }
          .adm-two-col { grid-template-columns: 1fr !important; }
          .adm-user-grid { grid-template-columns: 1fr !important; }
          .adm-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 16px; }
          .adm-table-wrap table { min-width: 520px; }
          .adm-hide-mobile { display: none !important; }
          .adm-topbar h1 { font-size: 16px !important; }
          .adm-two-col > div:last-child { margin-top: 0; }
        }
      `}</style>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 19 }} />
      )}

      {/* Sidebar */}
      <div className="adm-sidebar"
        style={{ position: 'fixed', top: 0, left: sidebarOpen ? 0 : -270, bottom: 0, width: 230, background: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', padding: '0 10px 16px', zIndex: 20, transition: 'left 0.25s cubic-bezier(0.32,0.72,0,1)', boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.12)' : 'none' }}>

        <div style={{ padding: '22px 8px 16px', borderBottom: '1px solid #f1f5f9', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>SAMGPLE</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Panel admin</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {NAV.map(n => {
            const active = section === n.key
            const isContacts = n.key === 'contacts'
            const newContacts = isContacts ? (data.contacts?.contacts ?? []).filter((c: any) => c.status === 'new').length : 0
            return (
              <button key={n.key}
                onClick={() => { setSection(n.key); setSidebarOpen(false); setSelectedUser(null); setSelectedThread(null) }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 14, border: 'none', cursor: 'pointer', background: active ? `${n.color}14` : 'transparent', transition: 'all 0.15s', textAlign: 'left', width: '100%' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: active ? n.color : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                  <Icon path={n.iconPath} color={active ? '#fff' : '#94a3b8'} size={14} />
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? n.color : '#64748b', flex: 1 }}>{n.label}</span>
                {isContacts && newContacts > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 20, background: '#22c55e', color: '#fff', flexShrink: 0 }}>{newContacts}</span>
                )}
                {active && !isContacts && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: n.color, flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>

        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 12px', borderRadius: 14, border: '2px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 13, fontWeight: 700, width: '100%', marginTop: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </div>

      {/* Main */}
      <div className="adm-main" style={{ flex: 1, padding: '24px 28px', minHeight: '100vh', marginLeft: 0 }}>

        {/* Top bar */}
        <div className="adm-topbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="adm-menu-btn" onClick={() => setSidebarOpen(true)}
              style={{ width: 38, height: 38, borderRadius: 12, border: '1.5px solid #f1f5f9', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: `${activeNav.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon path={activeNav.iconPath} color={activeNav.color} size={16} />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{activeNav.label}</h1>
              {loading && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>Actualizando...</p>}
            </div>
          </div>
          <button onClick={() => loadSection(section)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, border: '1.5px solid #f1f5f9', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            <span className="adm-hide-mobile" style={{ display: 'inline' }}>Actualizar</span>
          </button>
        </div>

        {/* ── STATS ── */}
        {section === 'stats' && (
          <div className="adm-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'Cuentas',  value: data.stats?.stats?.total_accounts ?? '—', color: '#2EC4B6', bg: '#f0fdf4', border: '#bbf7d0', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z' },
              { label: 'Pedidos',  value: data.stats?.stats?.total_orders ?? '—',   color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' },
              { label: 'Entregados', value: data.stats?.stats?.total_delivered ?? '—', color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', icon: 'M20 6L9 17l-5-5' },
              { label: 'Ingresos', value: `${Number(data.stats?.stats?.total_revenue ?? 0).toFixed(0)}€`, color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
              { label: 'Tokens',   value: Number(data.stats?.stats?.total_tokens_balance ?? 0).toFixed(1), color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', icon: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2' },
              { label: 'Tickets',  value: data.stats?.stats?.open_tickets ?? '—',   color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
              { label: 'Facturas', value: data.stats?.stats?.pending_invoices ?? '—', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, borderRadius: 20, padding: '16px 18px', border: `1.5px solid ${s.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, fontFamily: F }}>{s.label}</p>
                  <Icon path={s.icon} color={s.color} size={14} />
                </div>
                <p style={{ fontSize: 26, fontWeight: 800, color: s.color, margin: 0, letterSpacing: '-0.5px', fontFamily: F }}>{loading ? '—' : s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── USERS ── */}
        {section === 'users' && (
          <>
            {selectedUser ? (
              <>
                <button onClick={() => setSelectedUser(null)} style={{ ...btnOutline('#0f766e', '#2EC4B6'), marginBottom: 16 }}>← Volver</button>
                <div className="adm-user-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={card}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {selectedUser.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedUser.name}</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedUser.email}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                      <Badge status={selectedUser.status} />
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6', fontFamily: F }}>{selectedUser.plan}</span>
                    </div>
                    <button onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action: 'toggle_status' })} disabled={saving}
                      style={{ ...btnOutline(selectedUser.status === 'active' ? '#dc2626' : '#16a34a', selectedUser.status === 'active' ? '#fecaca' : '#bbf7d0'), width: '100%', justifyContent: 'center', display: 'flex' }}>
                      {selectedUser.status === 'active' ? 'Suspender cuenta' : 'Activar cuenta'}
                    </button>
                  </div>
                  <div style={card}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px', fontFamily: F }}>Tokens</p>
                    <p style={{ fontSize: 34, fontWeight: 800, color: '#2EC4B6', margin: '0 0 16px', letterSpacing: '-1px', fontFamily: F }}>
                      {Number(selectedUser.wallets?.[0]?.balance ?? 0).toFixed(2)}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input style={inp} type="number" placeholder="Cantidad de tokens" value={tokenAmount} onChange={e => setTokenAmount(e.target.value)} />
                      <input style={inp} placeholder="Descripción del ajuste" value={tokenDesc} onChange={e => setTokenDesc(e.target.value)} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <button onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action: 'add_tokens', amount: parseFloat(tokenAmount), description: tokenDesc })} disabled={!tokenAmount || saving}
                          style={{ ...btnOutline('#16a34a', '#bbf7d0'), justifyContent: 'center', display: 'flex', opacity: !tokenAmount ? 0.5 : 1 }}>
                          + Añadir
                        </button>
                        <button onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action: 'remove_tokens', amount: parseFloat(tokenAmount), description: tokenDesc })} disabled={!tokenAmount || saving}
                          style={{ ...btnOutline('#dc2626', '#fecaca'), justifyContent: 'center', display: 'flex', opacity: !tokenAmount ? 0.5 : 1 }}>
                          − Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={card}>
                <div className="adm-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={th}>Usuario</th>
                        <th style={th} className="adm-hide-mobile">Plan</th>
                        <th style={th}>Tokens</th>
                        <th style={th} className="adm-hide-mobile">Estado</th>
                        <th style={th}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} style={{ padding: 24, color: '#94a3b8', textAlign: 'center', fontFamily: F }}>Cargando...</td></tr>
                      ) : (data.users?.accounts ?? []).map((acc: any) => (
                        <tr key={acc.id}>
                          <td style={td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                {acc.name?.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.name}</p>
                                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={td} className="adm-hide-mobile">
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6', fontFamily: F }}>{acc.plan}</span>
                          </td>
                          <td style={td}>
                            <span style={{ fontWeight: 800, color: '#2EC4B6', fontSize: 14, fontFamily: F }}>{Number(acc.wallets?.[0]?.balance ?? 0).toFixed(2)}</span>
                          </td>
                          <td style={td} className="adm-hide-mobile"><Badge status={acc.status} /></td>
                          <td style={td}>
                            <button onClick={() => { setSelectedUser(acc); setTokenAmount(''); setTokenDesc('') }} style={btnOutline('#0f766e', '#cce8e6')}>
                              Gestionar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── SUPPORT ── */}
        {section === 'support' && (
          <>
            {selectedThread ? (
              <>
                <button onClick={() => setSelectedThread(null)} style={{ ...btnOutline('#0f766e', '#2EC4B6'), marginBottom: 16 }}>← Volver</button>
                <div style={card}>
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', fontFamily: F }}>{selectedThread.subject}</p>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontFamily: F }}>{selectedThread.accounts?.name} · {selectedThread.accounts?.email}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto', marginBottom: 16 }}>
                    {selectedThread.support_messages?.map((m: any) => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'client' ? 'flex-start' : 'flex-end' }}>
                        <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: m.sender === 'client' ? '18px 18px 18px 4px' : '18px 18px 4px 18px', background: m.sender === 'admin' ? 'linear-gradient(135deg,#2EC4B6,#1D9E75)' : '#f8fafc', border: m.sender === 'client' ? '1px solid #f1f5f9' : 'none' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: m.sender === 'admin' ? 'rgba(255,255,255,0.7)' : '#94a3b8', margin: '0 0 3px', fontFamily: F }}>{m.sender === 'admin' ? 'Admin' : selectedThread.accounts?.name}</p>
                          <p style={{ fontSize: 13, color: m.sender === 'admin' ? '#fff' : '#0f172a', margin: 0, lineHeight: 1.5, fontFamily: F }}>{m.content}</p>
                          <p style={{ fontSize: 10, color: m.sender === 'admin' ? 'rgba(255,255,255,0.6)' : '#94a3b8', margin: '4px 0 0', textAlign: 'right', fontFamily: F }}>{new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input style={{ ...inp, flex: 1, minWidth: 120 }} placeholder="Escribe tu respuesta..." value={adminReply} onChange={e => setAdminReply(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && adminReply) { adminAction('/api/admin/support', { thread_id: selectedThread.id, account_id: selectedThread.account_id, content: adminReply, status: threadStatus, _method: 'POST' }).then(() => setAdminReply('')) } }} />
                    <select style={{ ...inp, width: 'auto', cursor: 'pointer', flexShrink: 0 }} value={threadStatus} onChange={e => setThreadStatus(e.target.value)}>
                      {['open', 'in_progress', 'resolved', 'closed'].map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>)}
                    </select>
                    <button
                      onClick={async () => { if (!adminReply) return; await adminAction('/api/admin/support', { thread_id: selectedThread.id, account_id: selectedThread.account_id, content: adminReply, status: threadStatus, _method: 'POST' }); setAdminReply('') }}
                      disabled={!adminReply || saving}
                      style={{ padding: '11px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: !adminReply ? 0.5 : 1, whiteSpace: 'nowrap', fontFamily: F, flexShrink: 0 }}>
                      Enviar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={card}>
                <div className="adm-table-wrap">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={th}>Usuario</th>
                        <th style={th}>Asunto</th>
                        <th style={th} className="adm-hide-mobile">Mensajes</th>
                        <th style={th}>Estado</th>
                        <th style={th}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} style={{ padding: 24, color: '#94a3b8', textAlign: 'center', fontFamily: F }}>Cargando...</td></tr>
                      ) : (data.support?.threads ?? []).map((t: any) => (
                        <tr key={t.id}>
                          <td style={td}>
                            <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: F }}>{t.accounts?.name}</p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>{t.accounts?.email}</p>
                          </td>
                          <td style={td}><p style={{ margin: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F }}>{t.subject}</p></td>
                          <td style={td} className="adm-hide-mobile"><span style={{ fontWeight: 700, color: '#0f172a', fontFamily: F }}>{t.support_messages?.length ?? 0}</span></td>
                          <td style={td}><Badge status={t.status} /></td>
                          <td style={td}><button onClick={() => { setSelectedThread(t); setThreadStatus(t.status) }} style={btnOutline('#f59e0b', '#fde68a')}>Responder</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── INVOICES ── */}
        {section === 'invoices' && (
          <div style={card}>
            <div className="adm-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Usuario</th>
                    <th style={th} className="adm-hide-mobile">Período</th>
                    <th style={th} className="adm-hide-mobile">Notas</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Cambiar</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ padding: 24, color: '#94a3b8', textAlign: 'center', fontFamily: F }}>Cargando...</td></tr>
                  ) : (data.invoices?.invoices ?? []).map((inv: any) => (
                    <tr key={inv.id}>
                      <td style={td}>
                        <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: F }}>{inv.accounts?.name}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>{inv.accounts?.email}</p>
                      </td>
                      <td style={td} className="adm-hide-mobile"><span style={{ fontFamily: F }}>{inv.period}</span></td>
                      <td style={td} className="adm-hide-mobile">
                        <p style={{ margin: 0, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: 12, fontFamily: F }}>{inv.notes ?? '—'}</p>
                      </td>
                      <td style={td}><Badge status={inv.status} /></td>
                      <td style={td}>
                        <select defaultValue={inv.status} onChange={e => adminAction('/api/admin/invoices', { id: inv.id, status: e.target.value })}
                          style={{ ...inp, width: 'auto', padding: '7px 10px', cursor: 'pointer', fontSize: 12 }}>
                          {['pending', 'in_review', 'sent', 'rejected'].map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── COUPONS ── */}
        {section === 'coupons' && (
          <div className="adm-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
            <div style={card}>
              <div className="adm-table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={th}>Código</th>
                      <th style={th}>Tokens</th>
                      <th style={th} className="adm-hide-mobile">Usos</th>
                      <th style={th}>Estado</th>
                      <th style={th}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ padding: 24, color: '#94a3b8', textAlign: 'center', fontFamily: F }}>Cargando...</td></tr>
                    ) : (data.coupons?.coupons ?? []).map((c: any) => (
                      <tr key={c.id}>
                        <td style={td}><span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f766e', background: '#f0fdf4', padding: '4px 10px', borderRadius: 8, fontSize: 12, border: '1px solid #bbf7d0' }}>{c.code}</span></td>
                        <td style={td}><span style={{ fontWeight: 800, color: '#2EC4B6', fontFamily: F }}>{c.tokens}</span></td>
                        <td style={td} className="adm-hide-mobile"><span style={{ color: '#64748b', fontFamily: F }}>{c.uses}/{c.max_uses}</span></td>
                        <td style={td}><Badge status={c.active ? 'active' : 'suspended'} /></td>
                        <td style={td}>
                          <button onClick={() => adminAction('/api/admin/coupons', { id: c.id, active: !c.active })}
                            style={btnOutline(c.active ? '#dc2626' : '#16a34a', c.active ? '#fecaca' : '#bbf7d0')}>
                            {c.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={card}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', fontFamily: F }}>Nuevo cupón</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Código', key: 'code', ph: 'PROMO2025', upper: true },
                  { label: 'Tokens', key: 'tokens', ph: '10', type: 'number' },
                  { label: 'Usos máximos', key: 'max_uses', ph: '1', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block', fontFamily: F }}>{f.label}</label>
                    <input style={inp} type={f.type ?? 'text'} placeholder={f.ph}
                      value={(newCoupon as any)[f.key]}
                      onChange={e => setNewCoupon(p => ({ ...p, [f.key]: f.upper ? e.target.value.toUpperCase() : e.target.value }))} />
                  </div>
                ))}
                <button
                  onClick={async () => { await adminAction('/api/admin/coupons', { ...newCoupon, tokens: parseFloat(newCoupon.tokens), max_uses: parseInt(newCoupon.max_uses), _method: 'POST' }); setNewCoupon({ code: '', tokens: '', max_uses: '1' }) }}
                  disabled={!newCoupon.code || !newCoupon.tokens || saving}
                  style={{ width: '100%', padding: '13px', borderRadius: 14, border: '2px solid #2EC4B6', background: '#fff', color: '#0f766e', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: (!newCoupon.code || !newCoupon.tokens) ? 0.5 : 1, fontFamily: F }}>
                  <span>Crear cupón</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PACKS ── */}
        {section === 'packs' && (
          <div className="adm-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
            <div style={card}>
              <div className="adm-table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={th}>Nombre</th>
                      <th style={th}>Tokens</th>
                      <th style={th}>Precio</th>
                      <th style={th} className="adm-hide-mobile">€/token</th>
                      <th style={th} className="adm-hide-mobile">Estado</th>
                      <th style={th}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ padding: 24, color: '#94a3b8', textAlign: 'center', fontFamily: F }}>Cargando...</td></tr>
                    ) : (data.packs?.packs ?? []).map((p: any) => (
                      <tr key={p.id}>
                        <td style={td}><span style={{ fontWeight: 800, color: '#0f172a', fontFamily: F }}>{p.name}</span></td>
                        <td style={td}><span style={{ fontWeight: 800, color: '#2EC4B6', fontFamily: F }}>{p.tokens}</span></td>
                        <td style={td}><span style={{ fontWeight: 800, color: '#0f766e', fontFamily: F }}>{p.price_eur}€</span></td>
                        <td style={td} className="adm-hide-mobile"><span style={{ color: '#64748b', fontFamily: F }}>{(p.price_eur / p.tokens).toFixed(2)}€</span></td>
                        <td style={td} className="adm-hide-mobile"><Badge status={p.active ? 'active' : 'suspended'} /></td>
                        <td style={td}>
                          <button onClick={() => adminAction('/api/admin/packs', { id: p.id, active: !p.active })}
                            style={btnOutline(p.active ? '#dc2626' : '#16a34a', p.active ? '#fecaca' : '#bbf7d0')}>
                            {p.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={card}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px', fontFamily: F }}>Nuevo pack</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Nombre', key: 'name', ph: 'Pro' },
                  { label: 'Tokens', key: 'tokens', ph: '25', type: 'number' },
                  { label: 'Precio (€)', key: 'price_eur', ph: '22', type: 'number' },
                  { label: 'URL Lemon Squeezy', key: 'lemon_url', ph: 'https://...' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block', fontFamily: F }}>{f.label}</label>
                    <input style={inp} type={f.type ?? 'text'} placeholder={f.ph}
                      value={(newPack as any)[f.key]}
                      onChange={e => setNewPack(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <button
                  onClick={async () => { await adminAction('/api/admin/packs', { ...newPack, tokens: parseFloat(newPack.tokens), price_eur: parseFloat(newPack.price_eur), _method: 'POST' }); setNewPack({ name: '', tokens: '', price_eur: '', lemon_url: '' }) }}
                  disabled={!newPack.name || !newPack.tokens || !newPack.price_eur || saving}
                  style={{ width: '100%', padding: '13px', borderRadius: 14, border: '2px solid #ea580c', background: '#fff', color: '#ea580c', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: (!newPack.name || !newPack.tokens) ? 0.5 : 1, fontFamily: F }}>
                  <span>Crear pack</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CONTACTS ── */}
        {section === 'contacts' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: F }}>Mensajes de contacto</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontFamily: F }}>
                  {(data.contacts?.contacts ?? []).filter((c: any) => c.status === 'new').length} nuevos ·{' '}
                  {(data.contacts?.contacts ?? []).length} total
                </p>
              </div>
            </div>
            <div className="adm-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Contacto</th>
                    <th style={th} className="adm-hide-mobile">Empresa</th>
                    <th style={th} className="adm-hide-mobile">Pedidos/mes</th>
                    <th style={th}>Mensaje</th>
                    <th style={th}>Demo</th>
                    <th style={th}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ padding: 24, color: '#94a3b8', textAlign: 'center', fontFamily: F }}>Cargando...</td></tr>
                  ) : (data.contacts?.contacts ?? []).length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: 32, color: '#94a3b8', textAlign: 'center', fontFamily: F }}>Sin mensajes todavía</td></tr>
                  ) : (data.contacts?.contacts ?? []).map((c: any) => (
                    <>
                      <tr key={c.id} onClick={() => setExpandedMsg(expandedMsg === c.id ? null : c.id)}
                        style={{ cursor: 'pointer' }}>
                        <td style={td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                              {c.name?.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: 13, fontFamily: F }}>{c.name}</p>
                              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>{c.email}</p>
                              <p style={{ fontSize: 10, color: '#cbd5e1', margin: 0, fontFamily: F }}>{new Date(c.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </td>
                        <td style={td} className="adm-hide-mobile">
                          <span style={{ fontFamily: F, color: '#64748b' }}>{c.company ?? '—'}</span>
                        </td>
                        <td style={td} className="adm-hide-mobile">
                          <span style={{ fontFamily: F, color: '#64748b' }}>{c.orders ?? '—'}</span>
                        </td>
                        <td style={td}>
                          <p style={{ margin: 0, maxWidth: 200, fontSize: 12, color: '#374151', lineHeight: 1.5, fontFamily: F, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: expandedMsg === c.id ? 'normal' : 'nowrap' }}>
                            {c.message}
                          </p>
                        </td>
                        <td style={td}>
                          {c.wants_demo
                            ? <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#dbeafe', color: '#1d4ed8', fontFamily: F }}>Sí</span>
                            : <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: F }}>No</span>
                          }
                        </td>
                        <td style={td}>
                          <select
                            defaultValue={c.status}
                            onClick={e => e.stopPropagation()}
                            onChange={e => adminAction('/api/admin/contacts', { id: c.id, status: e.target.value })}
                            style={{ ...inp, width: 'auto', padding: '6px 10px', cursor: 'pointer', fontSize: 12 }}>
                            <option value="new">Nuevo</option>
                            <option value="read">Leído</option>
                            <option value="replied">Respondido</option>
                          </select>
                        </td>
                      </tr>
                      {expandedMsg === c.id && (
                        <tr key={`${c.id}-expanded`}>
                          <td colSpan={6} style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', fontFamily: F }}>Mensaje completo</p>
                                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0, fontFamily: F }}>{c.message}</p>
                              </div>
                              <a href={`mailto:${c.email}`}
                                style={{ ...btnOutline('#22c55e', '#bbf7d0'), textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                Responder email
                              </a>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}