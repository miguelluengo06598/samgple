'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  account: any
  profile: any
  wallet: any
  stores: any[]
  packs: any[]
  threads: any[]
  invoices: any[]
  userId: string
}

const SECTIONS = ['cuenta', 'tokens', 'soporte', 'facturas', 'informe'] as const
type Section = typeof SECTIONS[number]

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  open:        { label: 'Abierto',     color: '#0284c7', bg: '#f0f9ff' },
  in_progress: { label: 'En curso',    color: '#0f766e', bg: '#f0fdf4' },
  resolved:    { label: 'Resuelto',    color: '#16a34a', bg: '#f0fdf4' },
  closed:      { label: 'Cerrado',     color: '#64748b', bg: '#f7f8fa' },
  pending:     { label: 'Pendiente',   color: '#92400e', bg: '#fffbeb' },
  in_review:   { label: 'En revisión', color: '#0284c7', bg: '#f0f9ff' },
  sent:        { label: 'Enviada',     color: '#16a34a', bg: '#f0fdf4' },
  rejected:    { label: 'Rechazada',   color: '#dc2626', bg: '#fef2f2' },
}

export default function ConfiguracionClient({ account, profile, wallet, stores, packs, threads, invoices, userId }: Props) {
  const router = useRouter()
  const [section, setSection] = useState<Section>('cuenta')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Cuenta
  const [name, setName] = useState(account?.name ?? '')
  const [email, setEmail] = useState(account?.email ?? '')
  const [timezone, setTimezone] = useState(profile?.timezone ?? 'Europe/Madrid')
  const [newPassword, setNewPassword] = useState('')

  // Tokens
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  // Soporte
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [newTicketMsg, setNewTicketMsg] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [showNewTicket, setShowNewTicket] = useState(false)

  // Facturas
  const [invoiceNotes, setInvoiceNotes] = useState('')
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceMsg, setInvoiceMsg] = useState('')

  // Informe
  const [reportLoading, setReportLoading] = useState(false)
  const [reportMsg, setReportMsg] = useState('')

  const supabase = createClient()

  async function handleSaveAccount() {
    setSaving(true)
    setMsg('')
    try {
      const admin = createClient()
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
      if (data.ok) {
        setCouponMsg(`✓ Cupón canjeado: +${data.tokens} tokens`)
        setCouponCode('')
        router.refresh()
      } else {
        setCouponMsg(`✕ ${data.error}`)
      }
    } finally {
      setCouponLoading(false)
    }
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
      router.refresh()
    } finally {
      setSendingMsg(false)
    }
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
      setNewSubject('')
      setNewTicketMsg('')
      setShowNewTicket(false)
      router.refresh()
    } finally {
      setSendingMsg(false)
    }
  }

  async function handleRequestInvoice() {
    setInvoiceLoading(true)
    setInvoiceMsg('')
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: invoiceNotes }),
      })
      const data = await res.json()
      if (data.invoice) {
        setInvoiceMsg('✓ Solicitud enviada al equipo de SAMGPLE')
        setInvoiceNotes('')
        router.refresh()
      }
    } finally {
      setInvoiceLoading(false)
    }
  }

  async function handleRequestReport() {
    setReportLoading(true)
    setReportMsg('')
    try {
      const res = await fetch('/api/reports/request', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        setReportMsg('✓ Informe generado y enviado a tu email')
      } else {
        setReportMsg(`✕ ${data.error}`)
      }
    } finally {
      setReportLoading(false)
    }
  }

  const S = {
    page: { background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' } as React.CSSProperties,
    header: { background: '#fff', padding: '44px 20px 0', borderBottom: '1px solid #cce8e6' } as React.CSSProperties,
    body: { padding: '16px 16px 100px' } as React.CSSProperties,
    card: { background: '#fff', borderRadius: 20, padding: 16, border: '1px solid #cce8e6', marginBottom: 12 } as React.CSSProperties,
    label: { fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', display: 'block' } as React.CSSProperties,
    input: { width: '100%', padding: '12px 14px', borderRadius: 14, border: '1px solid #cce8e6', background: '#f7f8fa', fontSize: 13, fontWeight: 500, color: '#0f172a', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties,
    btn: { width: '100%', padding: 14, borderRadius: 16, fontSize: 13, fontWeight: 700, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer' } as React.CSSProperties,
    sectionTitle: { fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' } as React.CSSProperties,
    sectionSub: { fontSize: 12, color: '#64748b', margin: '0 0 14px' } as React.CSSProperties,
  }

  const tabs = [
    { key: 'cuenta', label: 'Cuenta' },
    { key: 'tokens', label: 'Tokens' },
    { key: 'soporte', label: 'Soporte' },
    { key: 'facturas', label: 'Facturas' },
    { key: 'informe', label: 'Informe' },
  ]

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>Configuración</h1>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 0 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setSection(t.key as Section)}
              style={{ padding: '10px 16px', borderRadius: '12px 12px 0 0', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: section === t.key ? '#f0fafa' : 'transparent', color: section === t.key ? '#0f766e' : '#64748b', borderBottom: section === t.key ? '2px solid #2EC4B6' : '2px solid transparent' }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={S.body}>

        {/* ── CUENTA ── */}
        {section === 'cuenta' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={S.card}>
              <p style={S.sectionTitle}>Datos personales</p>
              <p style={S.sectionSub}>Actualiza tu nombre y email</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div><span style={S.label}>Nombre</span><input style={S.input} value={name} onChange={e => setName(e.target.value)} /></div>
                <div><span style={S.label}>Email</span><input style={S.input} value={email} disabled /></div>
                <div>
                  <span style={S.label}>Zona horaria</span>
                  <select style={S.input} value={timezone} onChange={e => setTimezone(e.target.value)}>
                    <option value="Europe/Madrid">Europa/Madrid</option>
                    <option value="Europe/London">Europa/Londres</option>
                    <option value="America/New_York">América/Nueva York</option>
                    <option value="America/Mexico_City">América/Ciudad de México</option>
                    <option value="America/Bogota">América/Bogotá</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={S.card}>
              <p style={S.sectionTitle}>Cambiar contraseña</p>
              <p style={S.sectionSub}>Mínimo 8 caracteres</p>
              <input type="password" style={S.input} placeholder="Nueva contraseña" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>

            {msg && <p style={{ fontSize: 13, color: '#0f766e', textAlign: 'center', margin: 0 }}>{msg}</p>}

            <button onClick={handleSaveAccount} disabled={saving} style={S.btn}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <div style={S.card}>
              <p style={S.sectionTitle}>Tiendas conectadas</p>
              <p style={S.sectionSub}>Gestiona tus tiendas Shopify</p>
              {stores.map(store => (
                <div key={store.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0fafa' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{store.name ?? store.shopify_domain}</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{store.shopify_domain}</p>
                  </div>
                  <button onClick={() => handleDisconnectStore(store.id)} style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 20, border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                    Desconectar
                  </button>
                </div>
              ))}
            </div>

            <button onClick={handleLogout} style={{ ...S.btn, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              Cerrar sesión
            </button>
          </div>
        )}

        {/* ── TOKENS ── */}
        {section === 'tokens' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#2EC4B6', borderRadius: 20, padding: '20px 20px', textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Saldo actual</p>
              <p style={{ fontSize: 48, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1 }}>{Number(wallet?.balance ?? 0).toFixed(2)}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '4px 0 0' }}>tokens disponibles</p>
            </div>

            <div style={S.card}>
              <p style={S.sectionTitle}>Canjear cupón</p>
              <p style={S.sectionSub}>Introduce el código de tu cupón</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...S.input, flex: 1 }} placeholder="CODIGO123" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
                <button onClick={handleRedeemCoupon} disabled={couponLoading || !couponCode} style={{ padding: '12px 16px', borderRadius: 14, fontSize: 13, fontWeight: 700, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer', opacity: !couponCode ? 0.5 : 1, whiteSpace: 'nowrap' }}>
                  {couponLoading ? '...' : 'Canjear'}
                </button>
              </div>
              {couponMsg && (
                <p style={{ fontSize: 12, margin: '8px 0 0', color: couponMsg.startsWith('✓') ? '#0f766e' : '#dc2626', fontWeight: 600 }}>{couponMsg}</p>
              )}
            </div>

            <div style={S.card}>
              <p style={S.sectionTitle}>Comprar tokens</p>
              <p style={S.sectionSub}>Elige el pack que mejor se adapte a ti</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {packs.map((pack, i) => (
                  <a key={pack.id} href={pack.lemon_url ?? '#'} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 16, border: i === 1 ? '2px solid #2EC4B6' : '1px solid #cce8e6', background: i === 1 ? '#f0fafa' : '#fff', textDecoration: 'none' }}>
                    <div>
                      {i === 1 && <span style={{ fontSize: 9, fontWeight: 700, background: '#2EC4B6', color: '#fff', padding: '2px 7px', borderRadius: 20, marginBottom: 4, display: 'inline-block' }}>MÁS POPULAR</span>}
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{pack.name}</p>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{pack.tokens} tokens</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 20, fontWeight: 800, color: '#0f766e', margin: 0 }}>{pack.price_eur}€</p>
                      <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>{(pack.price_eur / pack.tokens).toFixed(2)}€/token</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SOPORTE ── */}
        {section === 'soporte' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {!selectedThread ? (
              <>
                <button onClick={() => setShowNewTicket(!showNewTicket)} style={S.btn}>
                  + Nuevo ticket de soporte
                </button>

                <AnimatePresence>
                  {showNewTicket && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={S.card}>
                      <p style={S.sectionTitle}>Nuevo ticket</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div><span style={S.label}>Asunto</span><input style={S.input} placeholder="Describe el problema brevemente" value={newSubject} onChange={e => setNewSubject(e.target.value)} /></div>
                        <div>
                          <span style={S.label}>Mensaje</span>
                          <textarea style={{ ...S.input, minHeight: 80, resize: 'vertical' } as React.CSSProperties} placeholder="Explica tu consulta..." value={newTicketMsg} onChange={e => setNewTicketMsg(e.target.value)} />
                        </div>
                        <button onClick={handleNewTicket} disabled={sendingMsg || !newSubject || !newTicketMsg} style={{ ...S.btn, opacity: (!newSubject || !newTicketMsg) ? 0.5 : 1 }}>
                          {sendingMsg ? 'Enviando...' : 'Enviar ticket'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {threads.length === 0 ? (
                  <div style={{ ...S.card, textAlign: 'center', padding: 32 }}>
                    <p style={{ fontSize: 32, margin: '0 0 8px' }}>💬</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>Sin tickets todavía</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Crea un ticket para contactar con soporte</p>
                  </div>
                ) : (
                  threads.map(thread => {
                    const st = STATUS_LABELS[thread.status] ?? STATUS_LABELS.open
                    return (
                      <div key={thread.id} onClick={() => setSelectedThread(thread)} style={{ ...S.card, cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{thread.subject}</p>
                            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{thread.support_messages?.length ?? 0} mensajes · {new Date(thread.updated_at).toLocaleDateString('es-ES')}</p>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0, marginLeft: 8 }}>{st.label}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={() => setSelectedThread(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#0f766e', padding: 0 }}>
                  ← Volver a tickets
                </button>
                <div style={S.card}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{selectedThread.subject}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
                    {selectedThread.support_messages?.map((m: any) => (
                      <div key={m.id} style={{ display: 'flex', justifyContent: m.sender === 'client' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: m.sender === 'client' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: m.sender === 'client' ? '#2EC4B6' : '#f0fafa', border: m.sender === 'admin' ? '1px solid #cce8e6' : 'none' }}>
                          <p style={{ fontSize: 13, color: m.sender === 'client' ? '#fff' : '#0f172a', margin: 0, lineHeight: 1.5 }}>{m.content}</p>
                          <p style={{ fontSize: 10, color: m.sender === 'client' ? 'rgba(255,255,255,0.7)' : '#94a3b8', margin: '4px 0 0', textAlign: 'right' }}>{new Date(m.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...S.input, flex: 1 }} placeholder="Escribe tu mensaje..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={handleSendMessage} disabled={sendingMsg || !newMessage} style={{ padding: '12px 16px', borderRadius: 14, fontSize: 13, fontWeight: 700, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer', opacity: !newMessage ? 0.5 : 1 }}>
                      →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FACTURAS ── */}
        {section === 'facturas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={S.card}>
              <p style={S.sectionTitle}>Solicitar factura</p>
              <p style={S.sectionSub}>El equipo de SAMGPLE procesará tu solicitud</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <span style={S.label}>Notas adicionales (opcional)</span>
                  <textarea style={{ ...S.input, minHeight: 70, resize: 'vertical' } as React.CSSProperties} placeholder="Ej: factura del mes de enero 2025..." value={invoiceNotes} onChange={e => setInvoiceNotes(e.target.value)} />
                </div>
                <button onClick={handleRequestInvoice} disabled={invoiceLoading} style={S.btn}>
                  {invoiceLoading ? 'Enviando...' : 'Solicitar factura'}
                </button>
                {invoiceMsg && <p style={{ fontSize: 12, color: '#0f766e', fontWeight: 600, margin: 0 }}>{invoiceMsg}</p>}
              </div>
            </div>

            {invoices.length > 0 && (
              <div style={S.card}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 10px' }}>Historial de solicitudes</p>
                {invoices.map(inv => {
                  const st = STATUS_LABELS[inv.status] ?? STATUS_LABELS.pending
                  return (
                    <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0fafa' }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0 }}>{inv.period}</p>
                        <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{new Date(inv.created_at).toLocaleDateString('es-ES')}</p>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── INFORME ── */}
        {section === 'informe' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: '#2EC4B6', borderRadius: 20, padding: 20, textAlign: 'center' }}>
              <p style={{ fontSize: 32, margin: '0 0 8px' }}>📊</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Informe semanal IA</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Análisis completo de tu semana enviado a tu email</p>
            </div>

            <div style={S.card}>
              <p style={S.sectionTitle}>¿Qué incluye el informe?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {[
                  'Resumen ejecutivo de la semana',
                  'Pedidos totales, entregados, cancelados y devoluciones',
                  'Ingresos generados',
                  'Análisis IA con puntos fuertes y áreas de mejora',
                  '3 recomendaciones concretas para la próxima semana',
                  'Enviado a tu email con diseño profesional',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#374151' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...S.card, background: '#f0fafa', border: '1px solid #cce8e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>Coste del informe</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0f766e' }}>0.5 tokens</span>
            </div>

            <button onClick={handleRequestReport} disabled={reportLoading} style={S.btn}>
              {reportLoading ? 'Generando informe...' : '✦ Generar y enviar informe'}
            </button>

            {reportMsg && (
              <p style={{ fontSize: 13, fontWeight: 600, color: reportMsg.startsWith('✓') ? '#0f766e' : '#dc2626', textAlign: 'center', margin: 0 }}>
                {reportMsg}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}