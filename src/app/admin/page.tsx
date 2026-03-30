'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SECTIONS = ['stats', 'users', 'support', 'invoices', 'coupons', 'packs'] as const
type Section = typeof SECTIONS[number]

const NAV = [
  { key: 'stats',    label: 'Resumen',   icon: '📊' },
  { key: 'users',    label: 'Usuarios',  icon: '👥' },
  { key: 'support',  label: 'Soporte',   icon: '💬' },
  { key: 'invoices', label: 'Facturas',  icon: '🧾' },
  { key: 'coupons',  label: 'Cupones',   icon: '🎁' },
  { key: 'packs',    label: 'Packs',     icon: '🪙' },
]

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:      { bg: '#f0fdf4', color: '#16a34a' },
  suspended:   { bg: '#fef2f2', color: '#dc2626' },
  open:        { bg: '#f0f9ff', color: '#0284c7' },
  in_progress: { bg: '#f0fafa', color: '#0f766e' },
  resolved:    { bg: '#f0fdf4', color: '#16a34a' },
  closed:      { bg: '#f7f8fa', color: '#64748b' },
  pending:     { bg: '#fffbeb', color: '#92400e' },
  in_review:   { bg: '#f0f9ff', color: '#0284c7' },
  sent:        { bg: '#f0fdf4', color: '#16a34a' },
  rejected:    { bg: '#fef2f2', color: '#dc2626' },
}

const S_LABELS: Record<string, string> = {
  active: 'Activo', suspended: 'Suspendido', open: 'Abierto',
  in_progress: 'En curso', resolved: 'Resuelto', closed: 'Cerrado',
  pending: 'Pendiente', in_review: 'En revisión', sent: 'Enviada', rejected: 'Rechazada',
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
  const [newCoupon, setNewCoupon] = useState({ code: '', tokens: '', max_uses: '1' })
  const [newPack, setNewPack] = useState({ name: '', tokens: '', price_eur: '', lemon_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadSection(section) }, [section])

  async function loadSection(s: Section) {
    setLoading(true)
    try {
      const endpoints: Record<Section, string> = {
        stats: '/api/admin/stats',
        users: '/api/admin/users',
        support: '/api/admin/support',
        invoices: '/api/admin/invoices',
        coupons: '/api/admin/coupons',
        packs: '/api/admin/packs',
      }
      const res = await fetch(endpoints[s])
      if (res.status === 401) { router.push('/admin/login'); return }
      const json = await res.json()
      setData((prev: any) => ({ ...prev, [s]: json }))
    } finally {
      setLoading(false)
    }
  }

  async function adminAction(endpoint: string, body: any) {
    setSaving(true)
    try {
      await fetch(endpoint, {
        method: body._method ?? 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      await loadSection(section)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const S = {
    page: { background: '#f0fafa', minHeight: '100vh', fontFamily: 'sans-serif' } as React.CSSProperties,
    sidebar: { position: 'fixed' as const, top: 0, left: 0, bottom: 0, width: 220, background: '#fff', borderRight: '1px solid #cce8e6', display: 'flex', flexDirection: 'column' as const, padding: '20px 12px', zIndex: 10 },
    main: { marginLeft: 220, padding: '24px 28px', minHeight: '100vh' },
    card: { background: '#fff', borderRadius: 20, padding: '16px 20px', border: '1px solid #cce8e6', marginBottom: 12 },
    input: { padding: '10px 14px', borderRadius: 12, border: '1px solid #cce8e6', background: '#f7f8fa', fontSize: 13, outline: 'none', color: '#0f172a', width: '100%', boxSizing: 'border-box' as const },
    btn: { padding: '10px 18px', borderRadius: 12, border: 'none', background: '#2EC4B6', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
    btnSm: { padding: '6px 12px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { textAlign: 'left' as const, padding: '10px 14px', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.05em', borderBottom: '1px solid #e2f0ef' },
    td: { padding: '12px 14px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f0fafa', verticalAlign: 'middle' as const },
  }

  function StatusBadge({ status }: { status: string }) {
    const c = STATUS_COLORS[status] ?? { bg: '#f7f8fa', color: '#64748b' }
    return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: c.bg, color: c.color }}>{S_LABELS[status] ?? status}</span>
  }

  return (
    <div style={S.page}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 16px', borderBottom: '1px solid #cce8e6' }}>
            <div style={{ width: 36, height: 36, background: '#2EC4B6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>SAMGPLE</p>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Admin</p>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => setSection(n.key as Section)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: section === n.key ? '#f0fafa' : 'transparent', color: section === n.key ? '#0f766e' : '#64748b', fontWeight: section === n.key ? 700 : 500, fontSize: 13, textAlign: 'left' }}
            >
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </div>
        <button onClick={handleLogout} style={{ ...S.btnSm, background: '#fef2f2', color: '#dc2626', width: '100%', padding: '10px 12px' }}>
          Cerrar sesión
        </button>
      </div>

      {/* Main */}
      <div style={S.main}>

        {/* ── STATS ── */}
        {section === 'stats' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Resumen global</h2>
            {loading ? <p style={{ color: '#64748b' }}>Cargando...</p> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { label: 'Cuentas', value: data.stats?.stats?.total_accounts ?? 0, color: '#2EC4B6' },
                  { label: 'Pedidos totales', value: data.stats?.stats?.total_orders ?? 0, color: '#0284c7' },
                  { label: 'Entregados', value: data.stats?.stats?.total_delivered ?? 0, color: '#16a34a' },
                  { label: 'Ingresos totales', value: `${Number(data.stats?.stats?.total_revenue ?? 0).toFixed(0)}€`, color: '#0f766e' },
                  { label: 'Tokens en circulación', value: Number(data.stats?.stats?.total_tokens_balance ?? 0).toFixed(2), color: '#7c3aed' },
                  { label: 'Tickets abiertos', value: data.stats?.stats?.open_tickets ?? 0, color: '#ea580c' },
                  { label: 'Facturas pendientes', value: data.stats?.stats?.pending_invoices ?? 0, color: '#dc2626' },
                ].map((stat, i) => (
                  <div key={i} style={{ ...S.card, marginBottom: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 6px' }}>{stat.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: stat.color, margin: 0 }}>{stat.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS ── */}
        {section === 'users' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Usuarios</h2>
            {selectedUser ? (
              <div>
                <button onClick={() => setSelectedUser(null)} style={{ ...S.btnSm, background: '#f0fafa', color: '#0f766e', marginBottom: 16 }}>← Volver</button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div style={S.card}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>{selectedUser.name}</p>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 4px' }}>{selectedUser.email}</p>
                    <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>Plan: {selectedUser.plan}</p>
                    <StatusBadge status={selectedUser.status} />
                    <div style={{ marginTop: 14 }}>
                      <button
                        onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action: 'toggle_status' })}
                        style={{ ...S.btnSm, background: selectedUser.status === 'active' ? '#fef2f2' : '#f0fdf4', color: selectedUser.status === 'active' ? '#dc2626' : '#16a34a' }}
                      >
                        {selectedUser.status === 'active' ? 'Suspender cuenta' : 'Activar cuenta'}
                      </button>
                    </div>
                  </div>
                  <div style={S.card}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Tokens</p>
                    <p style={{ fontSize: 32, fontWeight: 800, color: '#2EC4B6', margin: '0 0 16px' }}>{Number(selectedUser.wallets?.[0]?.balance ?? 0).toFixed(4)}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input style={S.input} type="number" placeholder="Cantidad de tokens" value={tokenAmount} onChange={e => setTokenAmount(e.target.value)} />
                      <input style={S.input} placeholder="Descripción" value={tokenDesc} onChange={e => setTokenDesc(e.target.value)} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <button
                          onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action: 'add_tokens', amount: parseFloat(tokenAmount), description: tokenDesc })}
                          disabled={!tokenAmount || saving}
                          style={{ ...S.btn, background: '#16a34a', opacity: !tokenAmount ? 0.5 : 1 }}
                        >
                          + Añadir
                        </button>
                        <button
                          onClick={() => adminAction(`/api/admin/users/${selectedUser.id}`, { action: 'remove_tokens', amount: parseFloat(tokenAmount), description: tokenDesc })}
                          disabled={!tokenAmount || saving}
                          style={{ ...S.btn, background: '#dc2626', opacity: !tokenAmount ? 0.5 : 1 }}
                        >
                          − Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                {loading ? <p style={{ color: '#64748b' }}>Cargando...</p> : (
                  <table style={S.table}>
                    <thead>
                      <tr>
                        <th style={S.th}>Usuario</th>
                        <th style={S.th}>Plan</th>
                        <th style={S.th}>Tokens</th>
                        <th style={S.th}>Estado</th>
                        <th style={S.th}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.users?.accounts ?? []).map((acc: any) => (
                        <tr key={acc.id}>
                          <td style={S.td}>
                            <p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{acc.name}</p>
                            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{acc.email}</p>
                          </td>
                          <td style={S.td}><span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6' }}>{acc.plan}</span></td>
                          <td style={S.td}><span style={{ fontWeight: 700, color: '#2EC4B6' }}>{Number(acc.wallets?.[0]?.balance ?? 0).toFixed(2)}</span></td>
                          <td style={S.td}><StatusBadge status={acc.status} /></td>
                          <td style={S.td}>
                            <button onClick={() => setSelectedUser(acc)} style={{ ...S.btnSm, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6' }}>
                              Gestionar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SUPPORT ── */}
        {section === 'support' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Soporte</h2>
            {selectedThread ? (
              <div>
                <button onClick={() => setSelectedThread(null)} style={{ ...S.btnSm, background: '#f0fafa', color: '#0f766e', marginBottom: 16 }}>← Volver</button>
                <div style={S.card}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{selectedThread.subject}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{selectedThread.accounts?.name} · {selectedThread.accounts?.email}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto', marginBottom: 16 }}>
                    {selectedThread.support_messages?.map((m: any) => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'client' ? 'flex-start' : 'flex-end' }}>
                        <div style={{ maxWidth: '70%', padding: '10px 14px', borderRadius: m.sender === 'client' ? '18px 18px 18px 4px' : '18px 18px 4px 18px', background: m.sender === 'admin' ? '#2EC4B6' : '#f0fafa', border: m.sender === 'client' ? '1px solid #cce8e6' : 'none' }}>
                          <p style={{ fontSize: 11, fontWeight: 700, color: m.sender === 'admin' ? 'rgba(255,255,255,0.7)' : '#9ca3af', margin: '0 0 3px' }}>{m.sender === 'admin' ? 'Admin' : selectedThread.accounts?.name}</p>
                          <p style={{ fontSize: 13, color: m.sender === 'admin' ? '#fff' : '#0f172a', margin: 0, lineHeight: 1.5 }}>{m.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...S.input, flex: 1 }} placeholder="Responder..." value={adminReply} onChange={e => setAdminReply(e.target.value)} />
                    <select style={{ ...S.input, width: 'auto' }} onChange={e => {}}>
                      <option value="open">Abierto</option>
                      <option value="in_progress">En curso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                    <button
                      onClick={async () => {
                        if (!adminReply) return
                        await adminAction('/api/admin/support', { thread_id: selectedThread.id, account_id: selectedThread.account_id, content: adminReply, _method: 'POST' })
                        setAdminReply('')
                        setSelectedThread(null)
                      }}
                      disabled={!adminReply || saving}
                      style={{ ...S.btn, whiteSpace: 'nowrap', opacity: !adminReply ? 0.5 : 1 }}
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={S.card}>
                {loading ? <p style={{ color: '#64748b' }}>Cargando...</p> : (
                  <table style={S.table}>
                    <thead><tr>
                      <th style={S.th}>Usuario</th>
                      <th style={S.th}>Asunto</th>
                      <th style={S.th}>Mensajes</th>
                      <th style={S.th}>Estado</th>
                      <th style={S.th}>Acciones</th>
                    </tr></thead>
                    <tbody>
                      {(data.support?.threads ?? []).map((t: any) => (
                        <tr key={t.id}>
                          <td style={S.td}><p style={{ fontWeight: 600, color: '#0f172a', margin: 0 }}>{t.accounts?.name}</p><p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{t.accounts?.email}</p></td>
                          <td style={S.td}>{t.subject}</td>
                          <td style={S.td}>{t.support_messages?.length ?? 0}</td>
                          <td style={S.td}><StatusBadge status={t.status} /></td>
                          <td style={S.td}><button onClick={() => setSelectedThread(t)} style={{ ...S.btnSm, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6' }}>Responder</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── INVOICES ── */}
        {section === 'invoices' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Facturas</h2>
            <div style={S.card}>
              {loading ? <p style={{ color: '#64748b' }}>Cargando...</p> : (
                <table style={S.table}>
                  <thead><tr>
                    <th style={S.th}>Usuario</th>
                    <th style={S.th}>Período</th>
                    <th style={S.th}>Notas</th>
                    <th style={S.th}>Estado</th>
                    <th style={S.th}>Cambiar estado</th>
                  </tr></thead>
                  <tbody>
                    {(data.invoices?.invoices ?? []).map((inv: any) => (
                      <tr key={inv.id}>
                        <td style={S.td}><p style={{ fontWeight: 600, margin: 0 }}>{inv.accounts?.name}</p><p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{inv.accounts?.email}</p></td>
                        <td style={S.td}>{inv.period}</td>
                        <td style={S.td}>{inv.notes ?? '—'}</td>
                        <td style={S.td}><StatusBadge status={inv.status} /></td>
                        <td style={S.td}>
                          <select
                            defaultValue={inv.status}
                            onChange={e => adminAction('/api/admin/invoices', { id: inv.id, status: e.target.value })}
                            style={{ ...S.input, width: 'auto', padding: '6px 10px' }}
                          >
                            {['pending', 'in_review', 'sent', 'rejected'].map(s => <option key={s} value={s}>{S_LABELS[s]}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── COUPONS ── */}
        {section === 'coupons' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Cupones</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
              <div style={S.card}>
                {loading ? <p style={{ color: '#64748b' }}>Cargando...</p> : (
                  <table style={S.table}>
                    <thead><tr>
                      <th style={S.th}>Código</th>
                      <th style={S.th}>Tokens</th>
                      <th style={S.th}>Usos</th>
                      <th style={S.th}>Estado</th>
                      <th style={S.th}>Acción</th>
                    </tr></thead>
                    <tbody>
                      {(data.coupons?.coupons ?? []).map((c: any) => (
                        <tr key={c.id}>
                          <td style={S.td}><span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f766e', background: '#f0fafa', padding: '3px 8px', borderRadius: 8 }}>{c.code}</span></td>
                          <td style={S.td}><span style={{ fontWeight: 700, color: '#2EC4B6' }}>{c.tokens}</span></td>
                          <td style={S.td}>{c.uses}/{c.max_uses}</td>
                          <td style={S.td}><StatusBadge status={c.active ? 'active' : 'suspended'} /></td>
                          <td style={S.td}>
                            <button
                              onClick={() => adminAction('/api/admin/coupons', { id: c.id, active: !c.active })}
                              style={{ ...S.btnSm, background: c.active ? '#fef2f2' : '#f0fdf4', color: c.active ? '#dc2626' : '#16a34a' }}
                            >
                              {c.active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div style={S.card}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 14px' }}>Nuevo cupón</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Código</label><input style={S.input} placeholder="PROMO2025" value={newCoupon.code} onChange={e => setNewCoupon(p => ({ ...p, code: e.target.value.toUpperCase() }))} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Tokens</label><input style={S.input} type="number" placeholder="10" value={newCoupon.tokens} onChange={e => setNewCoupon(p => ({ ...p, tokens: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Usos máximos</label><input style={S.input} type="number" placeholder="1" value={newCoupon.max_uses} onChange={e => setNewCoupon(p => ({ ...p, max_uses: e.target.value }))} /></div>
                  <button
                    onClick={async () => {
                      await adminAction('/api/admin/coupons', { ...newCoupon, tokens: parseFloat(newCoupon.tokens), max_uses: parseInt(newCoupon.max_uses), _method: 'POST' })
                      setNewCoupon({ code: '', tokens: '', max_uses: '1' })
                    }}
                    disabled={!newCoupon.code || !newCoupon.tokens || saving}
                    style={{ ...S.btn, opacity: (!newCoupon.code || !newCoupon.tokens) ? 0.5 : 1 }}
                  >
                    Crear cupón
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PACKS ── */}
        {section === 'packs' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Packs de tokens</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
              <div style={S.card}>
                {loading ? <p style={{ color: '#64748b' }}>Cargando...</p> : (
                  <table style={S.table}>
                    <thead><tr>
                      <th style={S.th}>Nombre</th>
                      <th style={S.th}>Tokens</th>
                      <th style={S.th}>Precio</th>
                      <th style={S.th}>€/token</th>
                      <th style={S.th}>Estado</th>
                      <th style={S.th}>Acción</th>
                    </tr></thead>
                    <tbody>
                      {(data.packs?.packs ?? []).map((p: any) => (
                        <tr key={p.id}>
                          <td style={S.td}><span style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</span></td>
                          <td style={S.td}><span style={{ fontWeight: 700, color: '#2EC4B6' }}>{p.tokens}</span></td>
                          <td style={S.td}><span style={{ fontWeight: 700, color: '#0f766e' }}>{p.price_eur}€</span></td>
                          <td style={S.td}>{(p.price_eur / p.tokens).toFixed(2)}€</td>
                          <td style={S.td}><StatusBadge status={p.active ? 'active' : 'suspended'} /></td>
                          <td style={S.td}>
                            <button
                              onClick={() => adminAction('/api/admin/packs', { id: p.id, active: !p.active })}
                              style={{ ...S.btnSm, background: p.active ? '#fef2f2' : '#f0fdf4', color: p.active ? '#dc2626' : '#16a34a' }}
                            >
                              {p.active ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div style={S.card}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 14px' }}>Nuevo pack</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Nombre</label><input style={S.input} placeholder="Pro" value={newPack.name} onChange={e => setNewPack(p => ({ ...p, name: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Tokens</label><input style={S.input} type="number" placeholder="25" value={newPack.tokens} onChange={e => setNewPack(p => ({ ...p, tokens: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>Precio (€)</label><input style={S.input} type="number" placeholder="22" value={newPack.price_eur} onChange={e => setNewPack(p => ({ ...p, price_eur: e.target.value }))} /></div>
                  <div><label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>URL Lemon Squeezy</label><input style={S.input} placeholder="https://..." value={newPack.lemon_url} onChange={e => setNewPack(p => ({ ...p, lemon_url: e.target.value }))} /></div>
                  <button
                    onClick={async () => {
                      await adminAction('/api/admin/packs', { ...newPack, tokens: parseFloat(newPack.tokens), price_eur: parseFloat(newPack.price_eur), _method: 'POST' })
                      setNewPack({ name: '', tokens: '', price_eur: '', lemon_url: '' })
                    }}
                    disabled={!newPack.name || !newPack.tokens || !newPack.price_eur || saving}
                    style={{ ...S.btn, opacity: (!newPack.name || !newPack.tokens) ? 0.5 : 1 }}
                  >
                    Crear pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}