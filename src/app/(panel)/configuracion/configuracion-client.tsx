'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useRealtime } from '@/hooks/useRealtime'

type Props = {
  account: any
  profile: any
  wallet: any
  stores: any[]
  packs: any[]
  threads: any[]
  invoices: any[]
  userId: string
  accountId: string
}

const SECTIONS = ['cuenta', 'tokens', 'soporte', 'facturas', 'informe'] as const
type Section = typeof SECTIONS[number]

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Abierto',     color: '#0369a1', bg: '#e0f2fe' },
  in_progress: { label: 'En curso',    color: '#0f766e', bg: '#ccfbf1' },
  resolved:    { label: 'Resuelto',    color: '#15803d', bg: '#dcfce7' },
  closed:      { label: 'Cerrado',     color: '#475569', bg: '#f1f5f9' },
  pending:     { label: 'Pendiente',   color: '#92400e', bg: '#fef3c7' },
  in_review:   { label: 'En revisión', color: '#6d28d9', bg: '#ede9fe' },
  sent:        { label: 'Enviada',     color: '#15803d', bg: '#dcfce7' },
  rejected:    { label: 'Rechazada',   color: '#b91c1c', bg: '#fee2e2' },
}

const TABS = [
  { key: 'cuenta',   label: 'Cuenta',   icon: '👤', grad: 'linear-gradient(135deg,#2EC4B6,#1D9E75)' },
  { key: 'tokens',   label: 'Tokens',   icon: '🪙', grad: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { key: 'soporte',  label: 'Soporte',  icon: '💬', grad: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
  { key: 'facturas', label: 'Facturas', icon: '🧾', grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  { key: 'informe',  label: 'Informe',  icon: '📊', grad: 'linear-gradient(135deg,#ec4899,#db2777)' },
]

const F = 'system-ui,-apple-system,sans-serif'

export default function ConfiguracionClient({ account, profile, wallet, stores, packs, threads, invoices, userId, accountId }: Props) {
  const router = useRouter()
  const [section, setSection] = useState<Section>('cuenta')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const [name, setName] = useState(account?.name ?? '')
  const [email] = useState(account?.email ?? '')
  const [timezone, setTimezone] = useState(profile?.timezone ?? 'Europe/Madrid')
  const [newPassword, setNewPassword] = useState('')

  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newTicketMsg, setNewTicketMsg] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [showNewTicket, setShowNewTicket] = useState(false)

  const [invoiceNotes, setInvoiceNotes] = useState('')
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceMsg, setInvoiceMsg] = useState('')

  const [reportLoading, setReportLoading] = useState(false)
  const [reportMsg, setReportMsg] = useState('')

  const [localThreads, setLocalThreads] = useState(threads)
  const [localInvoices, setLocalInvoices] = useState(invoices)
  const [localWalletBalance, setLocalWalletBalance] = useState(wallet?.balance ?? 0)

  const supabase = createClient()

  useRealtime([
    {
      table: 'support_messages',
      filter: `account_id=eq.${accountId}`,
      onInsert: (m) => {
        setLocalThreads(prev => prev.map(t =>
          t.id === m.thread_id ? { ...t, support_messages: [...(t.support_messages ?? []), m], updated_at: m.created_at } : t
        ))
        setSelectedThread((prev: any) => {
          if (!prev || prev.id !== m.thread_id) return prev
          return { ...prev, support_messages: [...(prev.support_messages ?? []), m] }
        })
      },
    },
    {
      table: 'support_threads',
      filter: `account_id=eq.${accountId}`,
      onInsert: (t) => setLocalThreads(prev => [{ ...t, support_messages: [] }, ...prev]),
      onUpdate: (t) => setLocalThreads(prev => prev.map(x => x.id === t.id ? { ...x, ...t } : x)),
    },
    {
      table: 'invoice_requests',
      filter: `account_id=eq.${accountId}`,
      onInsert: (i) => setLocalInvoices(prev => [i, ...prev]),
      onUpdate: (i) => setLocalInvoices(prev => prev.map(x => x.id === i.id ? { ...x, ...i } : x)),
    },
    {
      table: 'wallet_movements',
      filter: `account_id=eq.${accountId}`,
      onInsert: async () => {
        const sc = createClient()
        const { data: w } = await sc.from('wallets').select('balance').eq('account_id', accountId).single()
        if (w) setLocalWalletBalance(w.balance)
      },
    },
  ])

  async function handleSaveAccount() {
    setSaving(true)
    setMsg('')
    try {
      await fetch('/api/account/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, timezone }),
      })
      if (newPassword.length >= 8) {
        await supabase.auth.updateUser({ password: newPassword })
        setNewPassword('')
      }
      setMsg('Guardado correctamente')
    } finally {
      setSaving(false)
      setTimeout(() => setMsg(''), 3000)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function handleDisconnectStore(storeId: string) {
    if (!confirm('¿Desconectar esta tienda?')) return
    await fetch(`/api/stores/${storeId}`, { method: 'DELETE' })
    router.refresh()
  }

  async function handleRedeemCoupon() {
    if (!couponCode) return
    setCouponLoading(true)
    setCouponMsg('')
    try {
      const res = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      })
      const data = await res.json()
      if (data.ok) { setCouponMsg(`✓ Cupón canjeado: +${data.tokens} tokens`); setCouponCode('') }
      else setCouponMsg(`✕ ${data.error}`)
    } finally { setCouponLoading(false) }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedThread) return
    setSendingMsg(true)
    try {
      await fetch(`/api/support/${selectedThread.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })
      setNewMessage('')
    } finally { setSendingMsg(false) }
  }

  async function handleNewTicket() {
    if (!newSubject || !newTicketMsg) return
    setSendingMsg(true)
    try {
      await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: newSubject, message: newTicketMsg }),
      })
      setNewSubject(''); setNewTicketMsg(''); setShowNewTicket(false)
    } finally { setSendingMsg(false) }
  }

  async function handleRequestInvoice() {
    setInvoiceLoading(true); setInvoiceMsg('')
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: invoiceNotes }),
      })
      const data = await res.json()
      if (data.invoice) { setInvoiceMsg('✓ Solicitud enviada al equipo de SAMGPLE'); setInvoiceNotes('') }
    } finally { setInvoiceLoading(false) }
  }

  async function handleRequestReport() {
    setReportLoading(true); setReportMsg('')
    try {
      const res = await fetch('/api/reports/request', { method: 'POST' })
      const data = await res.json()
      setReportMsg(data.ok ? '✓ Informe generado y enviado a tu email' : `✕ ${data.error}`)
    } finally { setReportLoading(false) }
  }

  const activeTab = TABS.find(t => t.key === section)!

  // Estilos base reutilizables
  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '18px 20px', border: '1px solid #e2e8f0', marginBottom: 12 }
  const fieldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block', fontFamily: F }
  const fieldWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14 }
  const fieldInput: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0, fontFamily: F }
  const btn: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: 16, fontSize: 14, fontWeight: 700, border: 'none', background: activeTab.grad, color: '#fff', cursor: 'pointer', fontFamily: F, transition: 'opacity 0.15s' }
  const secTitle: React.CSSProperties = { fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', fontFamily: F }
  const secSub: React.CSSProperties = { fontSize: 12, color: '#64748b', margin: '0 0 16px', fontFamily: F }

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>

      {/* Header con gradiente dinámico */}
      <div style={{ background: activeTab.grad, padding: '44px 20px 0', transition: 'background 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {activeTab.icon}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>Configuración</h1>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{activeTab.label}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 0 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setSection(t.key as Section)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px 10px 0 0',
                fontSize: 12,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: F,
                background: section === t.key ? '#fff' : 'rgba(255,255,255,0.15)',
                color: section === t.key ? '#0f172a' : 'rgba(255,255,255,0.9)',
                transition: 'all 0.15s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 16px 100px' }}>

        {/* ── CUENTA ── */}
        {section === 'cuenta' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Avatar */}
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {name ? name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{name || 'Sin nombre'}</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{email}</p>
              </div>
            </div>

            {/* Datos */}
            <div style={card}>
              <p style={secTitle}>Datos personales</p>
              <p style={secSub}>Actualiza tu información</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <span style={fieldLabel}>Nombre</span>
                  <div style={fieldWrap}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input style={fieldInput} value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
                  </div>
                </div>
                <div>
                  <span style={fieldLabel}>Email</span>
                  <div style={{ ...fieldWrap, background: '#f1f5f9' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input style={{ ...fieldInput, color: '#94a3b8' }} value={email} disabled />
                  </div>
                </div>
                <div>
                  <span style={fieldLabel}>Zona horaria</span>
                  <div style={fieldWrap}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <select style={{ ...fieldInput, cursor: 'pointer' }} value={timezone} onChange={e => setTimezone(e.target.value)}>
                      <option value="Europe/Madrid">Europa/Madrid</option>
                      <option value="Europe/London">Europa/Londres</option>
                      <option value="America/New_York">América/Nueva York</option>
                      <option value="America/Mexico_City">América/Ciudad de México</option>
                      <option value="America/Bogota">América/Bogotá</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Contraseña */}
            <div style={card}>
              <p style={secTitle}>Cambiar contraseña</p>
              <p style={secSub}>Mínimo 8 caracteres</p>
              <div style={fieldWrap}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <input type="password" style={fieldInput} placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
            </div>

            {msg && (
              <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 14, padding: '10px 14px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 600 }}>{msg}</p>
              </div>
            )}

            <button onClick={handleSaveAccount} disabled={saving} style={{ ...btn, opacity: saving ? 0.6 : 1, marginBottom: 12 }}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            {/* Tiendas */}
            <div style={card}>
              <p style={secTitle}>Tiendas conectadas</p>
              <p style={secSub}>Gestiona tus tiendas Shopify</p>
              {stores.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay tiendas conectadas</p>
                </div>
              ) : stores.map(store => (
                <div key={store.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: '#f0fdf4', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bbf7d0' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{store.name ?? store.shopify_domain}</p>
                      <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{store.shopify_domain}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDisconnectStore(store.id)} style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 20, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontFamily: F }}>
                    Desconectar
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleLogout} style={{ ...btn, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              Cerrar sesión
            </button>
          </div>
        )}

        {/* ── TOKENS ── */}
        {section === 'tokens' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Saldo */}
            <div style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 20, padding: '24px 20px', textAlign: 'center', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', fontFamily: F }}>Saldo actual</p>
              <p style={{ fontSize: 52, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1, fontFamily: F }}>{Number(localWalletBalance).toFixed(2)}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: '6px 0 0', fontFamily: F }}>tokens disponibles</p>
            </div>

            {/* Canjear */}
            <div style={card}>
              <p style={secTitle}>Canjear cupón</p>
              <p style={secSub}>Introduce el código de tu cupón</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ ...fieldWrap, flex: 1 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  <input style={{ ...fieldInput, textTransform: 'uppercase', letterSpacing: '0.05em' }} placeholder="CODIGO123" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
                </div>
                <button onClick={handleRedeemCoupon} disabled={couponLoading || !couponCode} style={{ padding: '12px 18px', borderRadius: 14, fontSize: 13, fontWeight: 700, border: 'none', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', cursor: !couponCode ? 'not-allowed' : 'pointer', opacity: !couponCode ? 0.5 : 1, whiteSpace: 'nowrap', fontFamily: F }}>
                  {couponLoading ? '...' : 'Canjear'}
                </button>
              </div>
              {couponMsg && (
                <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: couponMsg.startsWith('✓') ? '#dcfce7' : '#fee2e2', border: `1px solid ${couponMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}` }}>
                  <p style={{ fontSize: 12, color: couponMsg.startsWith('✓') ? '#15803d' : '#dc2626', margin: 0, fontWeight: 600, fontFamily: F }}>{couponMsg}</p>
                </div>
              )}
            </div>

            {/* Packs */}
            <div style={card}>
              <p style={secTitle}>Comprar tokens</p>
              <p style={secSub}>Elige el pack que mejor se adapte a ti</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {packs.map((pack, i) => (
                  <a key={pack.id} href={pack.lemon_url ?? '#'} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 16, border: i === 1 ? '2px solid #f59e0b' : '1px solid #e2e8f0', background: i === 1 ? '#fffbeb' : '#fff', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                    {i === 1 && <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg,#f59e0b,#d97706)', padding: '3px 10px', borderRadius: '0 16px 0 12px' }}><span style={{ fontSize: 9, fontWeight: 700, color: '#fff', fontFamily: F }}>MÁS POPULAR</span></div>}
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: F }}>{pack.name}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0', fontFamily: F }}>{pack.tokens} tokens incluidos</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 22, fontWeight: 800, color: '#d97706', margin: 0, fontFamily: F }}>{pack.price_eur}€</p>
                      <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontFamily: F }}>{(pack.price_eur / pack.tokens).toFixed(2)}€/token</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SOPORTE ── */}
        {section === 'soporte' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {!selectedThread ? (
              <>
                <button onClick={() => setShowNewTicket(!showNewTicket)} style={{ ...btn, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Nuevo ticket de soporte
                </button>

                {showNewTicket && (
                  <div style={{ ...card, border: '2px solid #bfdbfe', background: '#eff6ff', marginBottom: 12 }}>
                    <p style={{ ...secTitle, color: '#1d4ed8' }}>Nuevo ticket</p>
                    <p style={secSub}>Descríbenos tu consulta</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <span style={fieldLabel}>Asunto</span>
                        <div style={fieldWrap}>
                          <input style={fieldInput} placeholder="Describe el problema brevemente" value={newSubject} onChange={e => setNewSubject(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <span style={fieldLabel}>Mensaje</span>
                        <textarea
                          style={{ ...fieldInput, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, minHeight: 90, resize: 'vertical' } as React.CSSProperties}
                          placeholder="Explica tu consulta con detalle..."
                          value={newTicketMsg}
                          onChange={e => setNewTicketMsg(e.target.value)}
                        />
                      </div>
                      <button onClick={handleNewTicket} disabled={sendingMsg || !newSubject || !newTicketMsg} style={{ ...btn, opacity: (!newSubject || !newTicketMsg) ? 0.5 : 1 }}>
                        {sendingMsg ? 'Enviando...' : 'Enviar ticket'}
                      </button>
                    </div>
                  </div>
                )}

                {localThreads.length === 0 ? (
                  <div style={{ ...card, textAlign: 'center', padding: '36px 20px' }}>
                    <div style={{ width: 48, height: 48, background: '#eff6ff', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: F }}>Sin tickets todavía</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontFamily: F }}>Crea un ticket para contactar con soporte</p>
                  </div>
                ) : localThreads.map(thread => {
                  const st = STATUS_LABELS[thread.status] ?? STATUS_LABELS.open
                  const lastMsg = thread.support_messages?.[thread.support_messages.length - 1]
                  return (
                    <div key={thread.id} onClick={() => setSelectedThread(thread)} style={{ ...card, cursor: 'pointer', marginBottom: 8, transition: 'transform 0.1s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: lastMsg ? 8 : 0 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F }}>{thread.subject}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>{thread.support_messages?.length ?? 0} mensajes · {new Date(thread.updated_at).toLocaleDateString('es-ES')}</p>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0, marginLeft: 10, fontFamily: F }}>{st.label}</span>
                      </div>
                      {lastMsg && (
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: F }}>
                          {lastMsg.sender === 'admin' ? '← Admin: ' : 'Tú: '}{lastMsg.content}
                        </p>
                      )}
                    </div>
                  )
                })}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <button onClick={() => setSelectedThread(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#3b82f6', padding: '0 0 12px', fontFamily: F }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
                  Volver a tickets
                </button>
                <div style={card}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 14px', fontFamily: F }}>{selectedThread.subject}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 320, overflowY: 'auto', marginBottom: 14 }}>
                    {selectedThread.support_messages?.map((m: any) => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '78%', padding: '10px 14px', borderRadius: m.sender === 'client' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.sender === 'client' ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : '#f1f5f9', border: m.sender === 'admin' ? '1px solid #e2e8f0' : 'none' }}>
                          <p style={{ fontSize: 13, color: m.sender === 'client' ? '#fff' : '#0f172a', margin: 0, lineHeight: 1.5, fontFamily: F }}>{m.content}</p>
                          <p style={{ fontSize: 10, color: m.sender === 'client' ? 'rgba(255,255,255,0.65)' : '#94a3b8', margin: '4px 0 0', textAlign: 'right', fontFamily: F }}>{new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ ...fieldWrap, flex: 1 }}>
                      <input style={fieldInput} placeholder="Escribe tu mensaje..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                    </div>
                    <button onClick={handleSendMessage} disabled={sendingMsg || !newMessage} style={{ width: 46, height: 46, borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#3b82f6,#2563eb)', color: '#fff', cursor: !newMessage ? 'not-allowed' : 'pointer', opacity: !newMessage ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FACTURAS ── */}
        {section === 'facturas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            <div style={{ background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', borderRadius: 20, padding: '20px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 2px', fontFamily: F }}>Solicitar factura</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0, fontFamily: F }}>El equipo procesará tu solicitud</p>
              </div>
            </div>

            <div style={card}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <span style={fieldLabel}>Notas adicionales (opcional)</span>
                  <textarea
                    style={{ ...fieldInput, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, minHeight: 80, resize: 'vertical' } as React.CSSProperties}
                    placeholder="Ej: factura del mes de enero 2025..."
                    value={invoiceNotes}
                    onChange={e => setInvoiceNotes(e.target.value)}
                  />
                </div>
                <button onClick={handleRequestInvoice} disabled={invoiceLoading} style={{ ...btn, opacity: invoiceLoading ? 0.6 : 1 }}>
                  {invoiceLoading ? 'Enviando...' : 'Solicitar factura'}
                </button>
                {invoiceMsg && (
                  <div style={{ padding: '8px 12px', borderRadius: 10, background: '#dcfce7', border: '1px solid #bbf7d0' }}>
                    <p style={{ fontSize: 12, color: '#15803d', margin: 0, fontWeight: 600, fontFamily: F }}>{invoiceMsg}</p>
                  </div>
                )}
              </div>
            </div>

            {localInvoices.length > 0 && (
              <div style={card}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', fontFamily: F }}>Historial de solicitudes</p>
                {localInvoices.map((inv, i) => {
                  const st = STATUS_LABELS[inv.status] ?? STATUS_LABELS.pending
                  return (
                    <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < localInvoices.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, fontFamily: F }}>{inv.period}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>{new Date(inv.created_at).toLocaleDateString('es-ES')}</p>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: st.bg, color: st.color, fontFamily: F }}>{st.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── INFORME ── */}
        {section === 'informe' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            <div style={{ background: 'linear-gradient(135deg,#ec4899,#db2777)', borderRadius: 20, padding: '28px 20px', textAlign: 'center', marginBottom: 12 }}>
              <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 16, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 4px', fontFamily: F }}>Informe semanal IA</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, fontFamily: F }}>Análisis completo enviado a tu email</p>
            </div>

            <div style={card}>
              <p style={secTitle}>¿Qué incluye?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
                {[
                  { icon: '📈', text: 'Resumen ejecutivo de la semana' },
                  { icon: '📦', text: 'Pedidos totales, entregados, cancelados y devoluciones' },
                  { icon: '💰', text: 'Ingresos generados en el periodo' },
                  { icon: '🤖', text: 'Análisis IA con puntos fuertes y áreas de mejora' },
                  { icon: '🎯', text: '3 recomendaciones concretas para la próxima semana' },
                  { icon: '✉️', text: 'Enviado con diseño profesional a tu email' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#374151', fontFamily: F, lineHeight: 1.4 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf2f8', border: '1px solid #fbcfe8' }}>
              <span style={{ fontSize: 13, color: '#9d174d', fontFamily: F, fontWeight: 500 }}>Coste del informe</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#db2777', fontFamily: F }}>0.5</span>
                <span style={{ fontSize: 13, color: '#db2777', fontFamily: F }}>tokens</span>
              </div>
            </div>

            <button onClick={handleRequestReport} disabled={reportLoading} style={{ ...btn, opacity: reportLoading ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              {reportLoading ? 'Generando informe...' : 'Generar y enviar informe'}
            </button>

            {reportMsg && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 14, background: reportMsg.startsWith('✓') ? '#dcfce7' : '#fee2e2', border: `1px solid ${reportMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}` }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: reportMsg.startsWith('✓') ? '#15803d' : '#dc2626', margin: 0, textAlign: 'center', fontFamily: F }}>
                  {reportMsg}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}