'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const F = "'DM Sans', system-ui, sans-serif"

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
  return (
    <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color, fontFamily:F, whiteSpace:'nowrap', letterSpacing:'0.02em' }}>
      {c.label}
    </span>
  )
}

function Icon({ path, color = '#64748b', size = 16 }: { path: string; color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

function Spinner() {
  return (
    <div style={{ display:'inline-block', width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'adm-spin .7s linear infinite', flexShrink:0 }} />
  )
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
  const newContactsCount = (data.contacts?.contacts ?? []).filter((c: any) => c.status === 'new').length

  /* ─── ESTILOS REUTILIZABLES ─── */
  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 20,
    border: '1px solid #f1f5f9',
    overflow: 'hidden',
    marginBottom: 14,
  }

  const inp: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 11,
    border: '1.5px solid #e2e8f0',
    background: '#f8fafc',
    fontSize: 13,
    outline: 'none',
    color: '#0f172a',
    boxSizing: 'border-box',
    fontFamily: F,
    transition: 'border-color .15s, box-shadow .15s',
  }

  const th: React.CSSProperties = {
    textAlign: 'left',
    padding: '11px 16px',
    fontSize: 10,
    fontWeight: 700,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    background: '#f8fafc',
    borderBottom: '1px solid #f1f5f9',
    whiteSpace: 'nowrap',
    fontFamily: F,
  }

  const td: React.CSSProperties = {
    padding: '13px 16px',
    fontSize: 13,
    color: '#374151',
    borderBottom: '1px solid #f8fafc',
    verticalAlign: 'middle',
    fontFamily: F,
  }

  function btnPrimary(color: string, bg: string): React.CSSProperties {
    return {
      padding: '8px 16px',
      borderRadius: 10,
      border: 'none',
      background: bg,
      color,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 700,
      fontFamily: F,
      whiteSpace: 'nowrap',
      transition: 'opacity .15s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
    }
  }

  function btnOutline(color: string, border: string): React.CSSProperties {
    return {
      padding: '8px 14px',
      borderRadius: 10,
      border: `1.5px solid ${border}`,
      background: '#fff',
      color,
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 700,
      fontFamily: F,
      whiteSpace: 'nowrap',
      transition: 'all .15s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
    }
  }

  return (
    <div style={{ background:'#f1f5f9', minHeight:'100vh', fontFamily:F, display:'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes adm-spin    { to{transform:rotate(360deg)} }
        @keyframes adm-fadeIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes adm-pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes adm-popIn   { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }

        .adm-content { animation: adm-fadeIn .3s ease both; }
        .adm-card-hover { transition:transform .18s ease, box-shadow .18s ease; }
        .adm-card-hover:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,0,0,.07) !important; }

        .adm-nav-btn { transition:all .15s ease; border:none; cursor:pointer; background:transparent; width:100%; text-align:left; }
        .adm-nav-btn:hover { background:rgba(0,0,0,.03) !important; }

        .adm-tr { transition:background .12s; }
        .adm-tr:hover { background:#fafafa !important; }

        .adm-inp:focus { border-color:#2EC4B6 !important; box-shadow:0 0 0 3px rgba(46,196,182,.12) !important; background:#fff !important; }

        .adm-live { display:inline-block; width:7px; height:7px; border-radius:50%; background:#2EC4B6; box-shadow:0 0 6px rgba(46,196,182,.8); animation:adm-pulse 2s infinite; }

        @media(min-width:768px) {
          .adm-sidebar  { left:0 !important; box-shadow:none !important; }
          .adm-main     { margin-left:240px !important; padding:28px 32px !important; }
          .adm-menu-btn { display:none !important; }
          .adm-stats    { grid-template-columns:repeat(4,1fr) !important; }
          .adm-two-col  { grid-template-columns:1fr 320px !important; }
          .adm-user-grid{ grid-template-columns:1fr 1fr !important; }
          .adm-hm       { display:table-cell !important; }
        }
        @media(max-width:767px) {
          .adm-main     { margin-left:0 !important; padding:16px !important; }
          .adm-sidebar  { width:268px !important; }
          .adm-stats    { grid-template-columns:1fr 1fr !important; }
          .adm-two-col  { grid-template-columns:1fr !important; }
          .adm-user-grid{ grid-template-columns:1fr !important; }
          .adm-hm       { display:none !important; }
          .adm-wrap     { overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:16px; }
          .adm-wrap table { min-width:520px; }
        }
      `}</style>

      {/* ── OVERLAY MÓVIL ── */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,.45)', zIndex:19, backdropFilter:'blur(3px)' }} />
      )}

      {/* ══ SIDEBAR ══ */}
      <div className="adm-sidebar" style={{
        position:'fixed', top:0, left:sidebarOpen ? 0 : -280, bottom:0,
        width:240, background:'#fff',
        borderRight:'1px solid #f1f5f9',
        display:'flex', flexDirection:'column',
        padding:'0 10px 16px', zIndex:20,
        transition:'left .25s cubic-bezier(.32,.72,0,1)',
        boxShadow: sidebarOpen ? '4px 0 32px rgba(0,0,0,.12)' : 'none',
      }}>

        {/* Logo */}
        <div style={{ padding:'20px 10px 16px', borderBottom:'1px solid #f1f5f9', marginBottom:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(46,196,182,.35)', flexShrink:0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div>
              <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.4px' }}>SAMGPLE</p>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span className="adm-live" />
                <p style={{ fontSize:10, color:'#0f766e', margin:0, fontWeight:600 }}>Admin panel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {NAV.map(n => {
            const active = section === n.key
            const isContacts = n.key === 'contacts'
            const badge = isContacts ? newContactsCount : 0
            return (
              <button key={n.key} className="adm-nav-btn"
                onClick={() => { setSection(n.key); setSidebarOpen(false); setSelectedUser(null); setSelectedThread(null) }}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  padding:'9px 12px', borderRadius:14,
                  background: active ? `${n.color}12` : 'transparent',
                }}>
                <div style={{
                  width:32, height:32, borderRadius:10, flexShrink:0,
                  background: active ? n.color : '#f1f5f9',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all .15s',
                  boxShadow: active ? `0 3px 10px ${n.color}40` : 'none',
                }}>
                  <Icon path={n.iconPath} color={active ? '#fff' : '#94a3b8'} size={14} />
                </div>
                <span style={{ fontSize:13, fontWeight: active ? 700 : 500, color: active ? n.color : '#64748b', flex:1, letterSpacing:'-0.1px' }}>{n.label}</span>
                {badge > 0 && (
                  <span style={{ fontSize:10, fontWeight:800, padding:'2px 7px', borderRadius:20, background:'#22c55e', color:'#fff', flexShrink:0 }}>{badge}</span>
                )}
                {active && badge === 0 && (
                  <div style={{ width:5, height:5, borderRadius:'50%', background:n.color, flexShrink:0 }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderRadius:14, border:'1.5px solid #fecaca', background:'#fff', color:'#dc2626', cursor:'pointer', fontSize:13, fontWeight:700, width:'100%', marginTop:8, transition:'all .15s', fontFamily:F }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar sesión
        </button>
      </div>

      {/* ══ MAIN ══ */}
      <div className="adm-main" style={{ flex:1, padding:'28px 32px', minHeight:'100vh', marginLeft:0 }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button className="adm-menu-btn" onClick={() => setSidebarOpen(true)}
              style={{ width:40, height:40, borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>

            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:12, background:`${activeNav.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon path={activeNav.iconPath} color={activeNav.color} size={17} />
              </div>
              <div>
                <h1 style={{ fontSize:'clamp(16px,2vw,20px)', fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.4px' }}>{activeNav.label}</h1>
                {loading && <p style={{ fontSize:10, color:'#94a3b8', margin:0, display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', border:'1.5px solid #94a3b8', borderTopColor:'transparent', display:'inline-block', animation:'adm-spin .7s linear infinite' }} />
                  Actualizando...
                </p>}
              </div>
            </div>
          </div>

          <button onClick={() => loadSection(section)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', cursor:'pointer', fontSize:12, fontWeight:700, color:'#64748b', flexShrink:0, transition:'all .15s', fontFamily:F }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            <span className="adm-hm">Actualizar</span>
          </button>
        </div>

        <div className="adm-content">

          {/* ══ STATS ══ */}
          {section === 'stats' && (
            <div className="adm-stats" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
              {[
                { label:'Cuentas',   value: data.stats?.stats?.total_accounts ?? '—',                                color:'#2EC4B6', bg:'#f0fdf9', border:'#99f6e4', icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z' },
                { label:'Pedidos',   value: data.stats?.stats?.total_orders ?? '—',                                  color:'#3b82f6', bg:'#eff6ff', border:'#bfdbfe', icon:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' },
                { label:'Entregados',value: data.stats?.stats?.total_delivered ?? '—',                               color:'#10b981', bg:'#f0fdf4', border:'#a7f3d0', icon:'M20 6L9 17l-5-5' },
                { label:'Ingresos',  value:`${Number(data.stats?.stats?.total_revenue ?? 0).toFixed(0)}€`,           color:'#0f766e', bg:'#f0fdf9', border:'#99f6e4', icon:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
                { label:'Tokens',    value: Number(data.stats?.stats?.total_tokens_balance ?? 0).toFixed(1),          color:'#8b5cf6', bg:'#faf5ff', border:'#ddd6fe', icon:'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2' },
                { label:'Tickets',   value: data.stats?.stats?.open_tickets ?? '—',                                  color:'#f59e0b', bg:'#fffbeb', border:'#fde68a', icon:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
                { label:'Facturas',  value: data.stats?.stats?.pending_invoices ?? '—',                              color:'#ec4899', bg:'#fdf2f8', border:'#fbcfe8', icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6' },
                { label:'Contactos', value: newContactsCount > 0 ? `${newContactsCount} nuevos` : (data.contacts?.contacts ?? []).length, color:'#22c55e', bg:'#f0fdf4', border:'#a7f3d0', icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              ].map((s, i) => (
                <div key={i} className="adm-card-hover" style={{ background:s.bg, borderRadius:18, padding:'18px 20px', border:`1.5px solid ${s.border}`, cursor:'default', animation:`adm-popIn .4s ${i * 0.05}s both` }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${s.border}` }}>
                      <Icon path={s.icon} color={s.color} size={15} />
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.07em', fontFamily:F }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize:'clamp(22px,3vw,30px)', fontWeight:800, color:s.color, margin:0, letterSpacing:'-1px', fontFamily:F }}>
                    {loading ? '—' : s.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ══ USERS ══ */}
          {section === 'users' && (
            <>
              {selectedUser ? (
                <div style={{ animation:'adm-popIn .3s ease both' }}>
                  <button onClick={() => setSelectedUser(null)} style={{ ...btnOutline('#64748b','#e2e8f0'), marginBottom:20 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Volver
                  </button>
                  <div className="adm-user-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    {/* Info usuario */}
                    <div style={{ ...card, padding:24 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
                        <div style={{ width:52, height:52, borderRadius:16, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'#fff', flexShrink:0, boxShadow:'0 6px 16px rgba(46,196,182,.35)' }}>
                          {selectedUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:'0 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedUser.name}</p>
                          <p style={{ fontSize:12, color:'#64748b', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selectedUser.email}</p>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
                        <Badge status={selectedUser.status} />
                        <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:'#f0fdf9', color:'#0f766e', border:'1px solid #99f6e4', fontFamily:F }}>{selectedUser.plan}</span>
                      </div>
                      <button onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action:'toggle_status' })} disabled={saving}
                        style={{ ...btnOutline(selectedUser.status==='active' ? '#dc2626' : '#16a34a', selectedUser.status==='active' ? '#fecaca' : '#a7f3d0'), width:'100%', justifyContent:'center', padding:'10px' }}>
                        {saving ? <Spinner /> : (selectedUser.status==='active' ? 'Suspender cuenta' : 'Activar cuenta')}
                      </button>
                    </div>

                    {/* Tokens */}
                    <div style={{ ...card, padding:24 }}>
                      <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 6px' }}>Saldo tokens</p>
                      <p style={{ fontSize:38, fontWeight:800, color:'#2EC4B6', margin:'0 0 20px', letterSpacing:'-1.5px', fontFamily:F }}>
                        {Number(selectedUser.wallets?.[0]?.balance ?? 0).toFixed(2)}
                      </p>
                      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        <input className="adm-inp" style={inp} type="number" placeholder="Cantidad de tokens" value={tokenAmount} onChange={e => setTokenAmount(e.target.value)} />
                        <input className="adm-inp" style={inp} placeholder="Descripción del ajuste" value={tokenDesc} onChange={e => setTokenDesc(e.target.value)} />
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:4 }}>
                          <button onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action:'add_tokens', amount:parseFloat(tokenAmount), description:tokenDesc })} disabled={!tokenAmount || saving}
                            style={{ ...btnPrimary('#fff','#10b981'), justifyContent:'center', padding:'10px', opacity:!tokenAmount?0.5:1 }}>
                            {saving ? <Spinner /> : '+ Añadir'}
                          </button>
                          <button onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action:'remove_tokens', amount:parseFloat(tokenAmount), description:tokenDesc })} disabled={!tokenAmount || saving}
                            style={{ ...btnPrimary('#fff','#ef4444'), justifyContent:'center', padding:'10px', opacity:!tokenAmount?0.5:1 }}>
                            {saving ? <Spinner /> : '− Quitar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={card}>
                  <div className="adm-wrap">
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr>
                          <th style={th}>Usuario</th>
                          <th style={th} className="adm-hm">Plan</th>
                          <th style={th}>Tokens</th>
                          <th style={th} className="adm-hm">Estado</th>
                          <th style={th}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={5} style={{ padding:32, color:'#94a3b8', textAlign:'center', fontFamily:F }}>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                              <div style={{ width:16, height:16, border:'2px solid #e2e8f0', borderTopColor:'#2EC4B6', borderRadius:'50%', animation:'adm-spin .7s linear infinite' }} />
                              Cargando usuarios...
                            </div>
                          </td></tr>
                        ) : (data.users?.accounts ?? []).map((acc: any) => (
                          <tr key={acc.id} className="adm-tr">
                            <td style={td}>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:34, height:34, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', flexShrink:0 }}>
                                  {acc.name?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ minWidth:0 }}>
                                  <p style={{ fontWeight:700, color:'#0f172a', margin:0, fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{acc.name}</p>
                                  <p style={{ fontSize:11, color:'#94a3b8', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{acc.email}</p>
                                </div>
                              </div>
                            </td>
                            <td style={td} className="adm-hm">
                              <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:20, background:'#f0fdf9', color:'#0f766e', border:'1px solid #99f6e4', fontFamily:F }}>{acc.plan}</span>
                            </td>
                            <td style={td}>
                              <span style={{ fontWeight:800, color:'#2EC4B6', fontSize:15, fontFamily:F }}>{Number(acc.wallets?.[0]?.balance ?? 0).toFixed(2)}</span>
                            </td>
                            <td style={td} className="adm-hm"><Badge status={acc.status} /></td>
                            <td style={td}>
                              <button onClick={() => { setSelectedUser(acc); setTokenAmount(''); setTokenDesc('') }} style={btnOutline('#3b82f6','#bfdbfe')}>
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

          {/* ══ SUPPORT ══ */}
          {section === 'support' && (
            <>
              {selectedThread ? (
                <div style={{ animation:'adm-popIn .3s ease both' }}>
                  <button onClick={() => setSelectedThread(null)} style={{ ...btnOutline('#64748b','#e2e8f0'), marginBottom:20 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                    Volver
                  </button>
                  <div style={{ ...card, padding:24 }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:20, flexWrap:'wrap' }}>
                      <div>
                        <p style={{ fontSize:17, fontWeight:800, color:'#0f172a', margin:'0 0 4px', letterSpacing:'-0.3px' }}>{selectedThread.subject}</p>
                        <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{selectedThread.accounts?.name} · {selectedThread.accounts?.email}</p>
                      </div>
                      <Badge status={selectedThread.status} />
                    </div>

                    <div style={{ display:'flex', flexDirection:'column', gap:10, maxHeight:380, overflowY:'auto', marginBottom:20, padding:'4px 0' }}>
                      {selectedThread.support_messages?.map((m: any) => (
                        <div key={m.id} style={{ display:'flex', justifyContent: m.sender==='client' ? 'flex-start' : 'flex-end' }}>
                          <div style={{ maxWidth:'72%', padding:'11px 15px', borderRadius: m.sender==='client' ? '18px 18px 18px 4px' : '18px 18px 4px 18px', background: m.sender==='admin' ? 'linear-gradient(135deg,#2EC4B6,#1A9E8F)' : '#f8fafc', border: m.sender==='client' ? '1px solid #f1f5f9' : 'none', boxShadow: m.sender==='admin' ? '0 4px 12px rgba(46,196,182,.3)' : 'none' }}>
                            <p style={{ fontSize:10, fontWeight:700, color: m.sender==='admin' ? 'rgba(255,255,255,.7)' : '#94a3b8', margin:'0 0 3px', fontFamily:F }}>{m.sender==='admin' ? 'Admin' : selectedThread.accounts?.name}</p>
                            <p style={{ fontSize:13, color: m.sender==='admin' ? '#fff' : '#0f172a', margin:0, lineHeight:1.55, fontFamily:F }}>{m.content}</p>
                            <p style={{ fontSize:10, color: m.sender==='admin' ? 'rgba(255,255,255,.55)' : '#94a3b8', margin:'5px 0 0', textAlign:'right', fontFamily:F }}>
                              {new Date(m.created_at).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <input className="adm-inp" style={{ ...inp, flex:1, minWidth:120 }} placeholder="Escribe tu respuesta..."
                        value={adminReply} onChange={e => setAdminReply(e.target.value)}
                        onKeyDown={e => { if (e.key==='Enter' && adminReply) { adminAction('/api/admin/support', { thread_id:selectedThread.id, account_id:selectedThread.account_id, content:adminReply, status:threadStatus, _method:'POST' }).then(() => setAdminReply('')) } }} />
                      <select className="adm-inp" style={{ ...inp, width:'auto', cursor:'pointer', flexShrink:0 }} value={threadStatus} onChange={e => setThreadStatus(e.target.value)}>
                        {['open','in_progress','resolved','closed'].map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>)}
                      </select>
                      <button
                        onClick={async () => { if (!adminReply) return; await adminAction('/api/admin/support', { thread_id:selectedThread.id, account_id:selectedThread.account_id, content:adminReply, status:threadStatus, _method:'POST' }); setAdminReply('') }}
                        disabled={!adminReply || saving}
                        style={{ padding:'11px 20px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:700, opacity:!adminReply?0.5:1, whiteSpace:'nowrap', fontFamily:F, flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
                        {saving ? <Spinner /> : null}
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={card}>
                  <div className="adm-wrap">
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr>
                          <th style={th}>Usuario</th>
                          <th style={th}>Asunto</th>
                          <th style={th} className="adm-hm">Mensajes</th>
                          <th style={th}>Estado</th>
                          <th style={th}>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan={5} style={{ padding:32, color:'#94a3b8', textAlign:'center', fontFamily:F }}>Cargando...</td></tr>
                        ) : (data.support?.threads ?? []).map((t: any) => (
                          <tr key={t.id} className="adm-tr">
                            <td style={td}>
                              <p style={{ fontWeight:700, color:'#0f172a', margin:0, fontSize:13 }}>{t.accounts?.name}</p>
                              <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{t.accounts?.email}</p>
                            </td>
                            <td style={td}><p style={{ margin:0, maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.subject}</p></td>
                            <td style={td} className="adm-hm">
                              <span style={{ fontWeight:700, color:'#0f172a', background:'#f8fafc', border:'1px solid #f1f5f9', padding:'2px 8px', borderRadius:8, fontSize:12, fontFamily:F }}>{t.support_messages?.length ?? 0}</span>
                            </td>
                            <td style={td}><Badge status={t.status} /></td>
                            <td style={td}>
                              <button onClick={() => { setSelectedThread(t); setThreadStatus(t.status) }} style={btnOutline('#f59e0b','#fde68a')}>
                                Responder
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

          {/* ══ INVOICES ══ */}
          {section === 'invoices' && (
            <div style={card}>
              <div className="adm-wrap">
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      <th style={th}>Usuario</th>
                      <th style={th} className="adm-hm">Período</th>
                      <th style={th} className="adm-hm">Notas</th>
                      <th style={th}>Estado</th>
                      <th style={th}>Cambiar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} style={{ padding:32, color:'#94a3b8', textAlign:'center', fontFamily:F }}>Cargando...</td></tr>
                    ) : (data.invoices?.invoices ?? []).map((inv: any) => (
                      <tr key={inv.id} className="adm-tr">
                        <td style={td}>
                          <p style={{ fontWeight:700, color:'#0f172a', margin:0 }}>{inv.accounts?.name}</p>
                          <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{inv.accounts?.email}</p>
                        </td>
                        <td style={td} className="adm-hm">{inv.period}</td>
                        <td style={td} className="adm-hm">
                          <p style={{ margin:0, maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', color:'#64748b', fontSize:12 }}>{inv.notes ?? '—'}</p>
                        </td>
                        <td style={td}><Badge status={inv.status} /></td>
                        <td style={td}>
                          <select defaultValue={inv.status} onChange={e => adminAction('/api/admin/invoices', { id:inv.id, status:e.target.value })}
                            style={{ ...inp, width:'auto', padding:'7px 10px', cursor:'pointer', fontSize:12 }}>
                            {['pending','in_review','sent','rejected'].map(s => <option key={s} value={s}>{STATUS_CONFIG[s]?.label}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ COUPONS ══ */}
          {section === 'coupons' && (
            <div className="adm-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14 }}>
              <div style={card}>
                <div className="adm-wrap">
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr>
                        <th style={th}>Código</th>
                        <th style={th}>Tokens</th>
                        <th style={th} className="adm-hm">Usos</th>
                        <th style={th}>Estado</th>
                        <th style={th}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={5} style={{ padding:32, color:'#94a3b8', textAlign:'center', fontFamily:F }}>Cargando...</td></tr>
                      ) : (data.coupons?.coupons ?? []).map((c: any) => (
                        <tr key={c.id} className="adm-tr">
                          <td style={td}>
                            <span style={{ fontFamily:'monospace', fontWeight:800, color:'#0f766e', background:'#f0fdf9', padding:'4px 10px', borderRadius:8, fontSize:12, border:'1px solid #99f6e4' }}>{c.code}</span>
                          </td>
                          <td style={td}><span style={{ fontWeight:800, color:'#2EC4B6', fontFamily:F }}>{c.tokens}</span></td>
                          <td style={td} className="adm-hm"><span style={{ color:'#64748b' }}>{c.uses}/{c.max_uses}</span></td>
                          <td style={td}><Badge status={c.active ? 'active' : 'suspended'} /></td>
                          <td style={td}>
                            <button onClick={() => adminAction('/api/admin/coupons', { id:c.id, active:!c.active })}
                              style={btnOutline(c.active?'#dc2626':'#16a34a', c.active?'#fecaca':'#a7f3d0')}>
                              {c.active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nuevo cupón */}
              <div style={{ ...card, padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:'#fdf2f8', border:'1px solid #fbcfe8', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon path="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01" color="#ec4899" size={15} />
                  </div>
                  <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:0 }}>Nuevo cupón</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    { label:'Código', key:'code', ph:'PROMO2025', upper:true },
                    { label:'Tokens', key:'tokens', ph:'10', type:'number' },
                    { label:'Usos máximos', key:'max_uses', ph:'1', type:'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, display:'block', fontFamily:F }}>{f.label}</label>
                      <input className="adm-inp" style={inp} type={f.type ?? 'text'} placeholder={f.ph}
                        value={(newCoupon as any)[f.key]}
                        onChange={e => setNewCoupon(p => ({ ...p, [f.key]: f.upper ? e.target.value.toUpperCase() : e.target.value }))} />
                    </div>
                  ))}
                  <button
                    onClick={async () => { await adminAction('/api/admin/coupons', { ...newCoupon, tokens:parseFloat(newCoupon.tokens), max_uses:parseInt(newCoupon.max_uses), _method:'POST' }); setNewCoupon({ code:'', tokens:'', max_uses:'1' }) }}
                    disabled={!newCoupon.code || !newCoupon.tokens || saving}
                    style={{ width:'100%', padding:'12px', borderRadius:13, border:'none', background:'linear-gradient(135deg,#ec4899,#db2777)', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:(!newCoupon.code||!newCoupon.tokens)?0.5:1, fontFamily:F, marginTop:4 }}>
                    {saving ? <Spinner /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                    Crear cupón
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ PACKS ══ */}
          {section === 'packs' && (
            <div className="adm-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:14 }}>
              <div style={card}>
                <div className="adm-wrap">
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr>
                        <th style={th}>Nombre</th>
                        <th style={th}>Tokens</th>
                        <th style={th}>Precio</th>
                        <th style={th} className="adm-hm">€/token</th>
                        <th style={th} className="adm-hm">Estado</th>
                        <th style={th}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan={6} style={{ padding:32, color:'#94a3b8', textAlign:'center', fontFamily:F }}>Cargando...</td></tr>
                      ) : (data.packs?.packs ?? []).map((p: any) => (
                        <tr key={p.id} className="adm-tr">
                          <td style={td}><span style={{ fontWeight:800, color:'#0f172a' }}>{p.name}</span></td>
                          <td style={td}><span style={{ fontWeight:800, color:'#2EC4B6' }}>{p.tokens}</span></td>
                          <td style={td}><span style={{ fontWeight:800, color:'#0f766e' }}>{p.price_eur}€</span></td>
                          <td style={td} className="adm-hm"><span style={{ color:'#64748b' }}>{(p.price_eur/p.tokens).toFixed(2)}€</span></td>
                          <td style={td} className="adm-hm"><Badge status={p.active ? 'active' : 'suspended'} /></td>
                          <td style={td}>
                            <button onClick={() => adminAction('/api/admin/packs', { id:p.id, active:!p.active })}
                              style={btnOutline(p.active?'#dc2626':'#16a34a', p.active?'#fecaca':'#a7f3d0')}>
                              {p.active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nuevo pack */}
              <div style={{ ...card, padding:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:'#fff7ed', border:'1px solid #fed7aa', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon path="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" color="#ea580c" size={15} />
                  </div>
                  <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:0 }}>Nuevo pack</p>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    { label:'Nombre', key:'name', ph:'Pro' },
                    { label:'Tokens', key:'tokens', ph:'25', type:'number' },
                    { label:'Precio (€)', key:'price_eur', ph:'22', type:'number' },
                    { label:'URL Lemon Squeezy', key:'lemon_url', ph:'https://...' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:5, display:'block', fontFamily:F }}>{f.label}</label>
                      <input className="adm-inp" style={inp} type={f.type ?? 'text'} placeholder={f.ph}
                        value={(newPack as any)[f.key]}
                        onChange={e => setNewPack(p => ({ ...p, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                  <button
                    onClick={async () => { await adminAction('/api/admin/packs', { ...newPack, tokens:parseFloat(newPack.tokens), price_eur:parseFloat(newPack.price_eur), _method:'POST' }); setNewPack({ name:'', tokens:'', price_eur:'', lemon_url:'' }) }}
                    disabled={!newPack.name || !newPack.tokens || !newPack.price_eur || saving}
                    style={{ width:'100%', padding:'12px', borderRadius:13, border:'none', background:'linear-gradient(135deg,#ea580c,#c2410c)', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:(!newPack.name||!newPack.tokens)?0.5:1, fontFamily:F, marginTop:4 }}>
                    {saving ? <Spinner /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                    Crear pack
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══ CONTACTS ══ */}
          {section === 'contacts' && (
            <div style={card}>
              <div style={{ padding:'18px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                <div>
                  <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:0 }}>Mensajes de contacto</p>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>
                    {newContactsCount > 0 && <span style={{ color:'#22c55e', fontWeight:700 }}>{newContactsCount} nuevos · </span>}
                    {(data.contacts?.contacts ?? []).length} total
                  </p>
                </div>
                {newContactsCount > 0 && (
                  <div style={{ display:'flex', alignItems:'center', gap:6, background:'#f0fdf4', border:'1px solid #a7f3d0', borderRadius:20, padding:'5px 12px' }}>
                    <span className="adm-live" />
                    <span style={{ fontSize:11, fontWeight:700, color:'#0f766e', fontFamily:F }}>{newContactsCount} sin leer</span>
                  </div>
                )}
              </div>
              <div className="adm-wrap">
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      <th style={th}>Contacto</th>
                      <th style={th} className="adm-hm">Empresa</th>
                      <th style={th} className="adm-hm">Pedidos/mes</th>
                      <th style={th}>Mensaje</th>
                      <th style={th}>Demo</th>
                      <th style={th}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} style={{ padding:32, color:'#94a3b8', textAlign:'center', fontFamily:F }}>Cargando...</td></tr>
                    ) : (data.contacts?.contacts ?? []).length === 0 ? (
                      <tr><td colSpan={6} style={{ padding:40, color:'#94a3b8', textAlign:'center', fontFamily:F }}>Sin mensajes todavía</td></tr>
                    ) : (data.contacts?.contacts ?? []).map((c: any) => (
                      <>
                        <tr key={c.id} className="adm-tr" onClick={() => setExpandedMsg(expandedMsg===c.id ? null : c.id)} style={{ cursor:'pointer' }}>
                          <td style={td}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ width:34, height:34, borderRadius:11, background:'linear-gradient(135deg,#22c55e,#16a34a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff', flexShrink:0 }}>
                                {c.name?.charAt(0).toUpperCase()}
                              </div>
                              <div style={{ minWidth:0 }}>
                                <p style={{ fontWeight:700, color:'#0f172a', margin:0, fontSize:13 }}>
                                  {c.status === 'new' && <span style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'#22c55e', marginRight:5, verticalAlign:'middle' }} />}
                                  {c.name}
                                </p>
                                <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{c.email}</p>
                                <p style={{ fontSize:10, color:'#cbd5e1', margin:0 }}>{new Date(c.created_at).toLocaleDateString('es-ES', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</p>
                              </div>
                            </div>
                          </td>
                          <td style={td} className="adm-hm"><span style={{ color:'#64748b' }}>{c.company ?? '—'}</span></td>
                          <td style={td} className="adm-hm"><span style={{ color:'#64748b' }}>{c.orders ?? '—'}</span></td>
                          <td style={td}>
                            <p style={{ margin:0, maxWidth:200, fontSize:12, color:'#374151', lineHeight:1.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace: expandedMsg===c.id ? 'normal' : 'nowrap' }}>
                              {c.message}
                            </p>
                          </td>
                          <td style={td}>
                            {c.wants_demo
                              ? <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20, background:'#dbeafe', color:'#1d4ed8', fontFamily:F }}>Sí</span>
                              : <span style={{ fontSize:11, color:'#94a3b8' }}>No</span>
                            }
                          </td>
                          <td style={td}>
                            <select defaultValue={c.status} onClick={e => e.stopPropagation()}
                              onChange={e => adminAction('/api/admin/contacts', { id:c.id, status:e.target.value })}
                              style={{ ...inp, width:'auto', padding:'6px 10px', cursor:'pointer', fontSize:12 }}>
                              <option value="new">Nuevo</option>
                              <option value="read">Leído</option>
                              <option value="replied">Respondido</option>
                            </select>
                          </td>
                        </tr>
                        {expandedMsg === c.id && (
                          <tr key={`${c.id}-exp`}>
                            <td colSpan={6} style={{ padding:'14px 20px', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', animation:'adm-fadeIn .2s ease' }}>
                              <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' }}>
                                <div style={{ flex:1, minWidth:200 }}>
                                  <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 7px' }}>Mensaje completo</p>
                                  <p style={{ fontSize:13, color:'#374151', lineHeight:1.75, margin:0 }}>{c.message}</p>
                                </div>
                                <a href={`mailto:${c.email}`}
                                  style={{ ...btnOutline('#22c55e','#a7f3d0'), textDecoration:'none', flexShrink:0 }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
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
    </div>
  )
}