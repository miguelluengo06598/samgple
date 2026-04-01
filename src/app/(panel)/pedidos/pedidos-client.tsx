'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const F = 'system-ui,-apple-system,sans-serif'

const CALL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  confirmed:    { label: 'Confirmado',    color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', emoji: '✓' },
  no_answer:    { label: 'No contestó',   color: '#92400e', bg: '#fef3c7', border: '#fde68a', emoji: '📵' },
  cancelled:    { label: 'Cancelado',     color: '#b91c1c', bg: '#fee2e2', border: '#fecaca', emoji: '✕' },
  voicemail:    { label: 'Buzón de voz',  color: '#6d28d9', bg: '#faf5ff', border: '#e9d5ff', emoji: '📨' },
  wrong_number: { label: 'Nº incorrecto', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0', emoji: '✕' },
  calling:      { label: 'Llamando...',   color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', emoji: '📞' },
  pending:      { label: 'Pendiente',     color: '#475569', bg: '#f1f5f9', border: '#e2e8f0', emoji: '⏳' },
  rescheduled:  { label: 'Reagendado',    color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', emoji: '🕐' },
}

const ORDER_STATUS_OPTIONS = [
  { value: 'por_confirmar', label: '⏳ Por confirmar' },
  { value: 'confirmado',    label: '✓ Confirmado' },
  { value: 'enviado',       label: '🚚 Enviado' },
  { value: 'entregado',     label: '✅ Entregado' },
  { value: 'incidencia',    label: '⚠️ Incidencia' },
  { value: 'cancelado',     label: '✕ Cancelado' },
]

const FILTERS = [
  { key: 'all',       label: 'Todos' },
  { key: 'pending',   label: 'Pendientes' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'no_answer', label: 'No contestó' },
  { key: 'cancelled', label: 'Cancelados' },
]

function scoreColor(score: number) {
  if (score <= 35) return { color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', label: 'bajo' }
  if (score <= 65) return { color: '#92400e', bg: '#fef3c7', border: '#fde68a', label: 'medio' }
  return { color: '#b91c1c', bg: '#fee2e2', border: '#fecaca', label: 'alto' }
}

function avatarGradient(score: number) {
  if (score <= 35) return 'linear-gradient(135deg,#2EC4B6,#1D9E75)'
  if (score <= 65) return 'linear-gradient(135deg,#f59e0b,#d97706)'
  return 'linear-gradient(135deg,#ef4444,#dc2626)'
}

export default function PedidosClient({ initialOrders, accountId }: { initialOrders: any[]; accountId: string }) {
  const [orders, setOrders]             = useState<any[]>(initialOrders)
  const [filter, setFilter]             = useState('all')
  const [search, setSearch]             = useState('')
  const [expanded, setExpanded]         = useState<string | null>(null)
  const [waMessages, setWaMessages]     = useState<Record<string, string>>({})
  const [loadingWa, setLoadingWa]       = useState<Record<string, boolean>>({})
  const [loadingCall, setLoadingCall]   = useState<Record<string, boolean>>({})
  const [savingStatus, setSavingStatus] = useState<Record<string, boolean>>({})
  const [newOrderIds, setNewOrderIds]   = useState<Set<string>>(new Set())
  const supabase = createClient()

  // Realtime — pedidos entran solos y se actualizan sin recargar
  useEffect(() => {
    const channel = supabase.channel(`pedidos-${accountId}`)

    channel.on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'orders',
      filter: `account_id=eq.${accountId}`,
    }, async (payload) => {
      // Cargar pedido completo con relaciones
      const { data } = await supabase
        .from('orders')
        .select(`
          id, order_number, status, call_status, call_attempts,
          call_summary, total_price, phone, shipping_address,
          created_at, last_call_at, next_call_at,
          customers(first_name, last_name, phone, email),
          order_items(name, quantity, price),
          order_risk_analyses(risk_score, risk_level, summary)
        `)
        .eq('id', payload.new.id)
        .single()

      if (data) {
        setOrders(prev => [data, ...prev])
        setNewOrderIds(prev => new Set([...prev, data.id]))
        setTimeout(() => {
          setNewOrderIds(prev => { const s = new Set(prev); s.delete(data.id); return s })
        }, 4000)
      }
    })

    channel.on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `account_id=eq.${accountId}`,
    }, async (payload) => {
      // Recargar pedido completo con relaciones actualizadas
      const { data } = await supabase
        .from('orders')
        .select(`
          id, order_number, status, call_status, call_attempts,
          call_summary, total_price, phone, shipping_address,
          created_at, last_call_at, next_call_at,
          customers(first_name, last_name, phone, email),
          order_items(name, quantity, price),
          order_risk_analyses(risk_score, risk_level, summary)
        `)
        .eq('id', payload.new.id)
        .single()

      if (data) setOrders(prev => prev.map(o => o.id === data.id ? data : o))
    })

    channel.on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'call_logs',
    }, async (payload) => {
      const log = payload.new as any
      if (!log.order_id) return
      const { data } = await supabase
        .from('orders')
        .select(`
          id, order_number, status, call_status, call_attempts,
          call_summary, total_price, phone, shipping_address,
          created_at, last_call_at, next_call_at,
          customers(first_name, last_name, phone, email),
          order_items(name, quantity, price),
          order_risk_analyses(risk_score, risk_level, summary)
        `)
        .eq('id', log.order_id)
        .single()
      if (data) setOrders(prev => prev.map(o => o.id === data.id ? data : o))
    })

    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [accountId])

  const filtered = orders.filter(o => {
    const matchFilter =
      filter === 'all'       ? true :
      filter === 'pending'   ? (o.call_status === 'pending' || o.call_status === 'calling') :
      o.call_status === filter
    const matchSearch = search === '' ||
      `${o.customers?.first_name ?? ''} ${o.customers?.last_name ?? ''}`.toLowerCase().includes(search.toLowerCase()) ||
      String(o.order_number ?? '').includes(search)
    return matchFilter && matchSearch
  })

  async function generateWhatsApp(order: any) {
    setLoadingWa(prev => ({ ...prev, [order.id]: true }))
    try {
      const res = await fetch(`/api/orders/${order.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
      })
      const data = await res.json()
      if (data.message) setWaMessages(prev => ({ ...prev, [order.id]: data.message }))
    } finally {
      setLoadingWa(prev => ({ ...prev, [order.id]: false }))
    }
  }

  async function handleRetry(orderId: string) {
    setLoadingCall(prev => ({ ...prev, [orderId]: true }))
    try {
      await fetch('/api/vapi/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      })
    } finally {
      setLoadingCall(prev => ({ ...prev, [orderId]: false }))
    }
  }

  async function handleStatusChange(orderId: string, status: string) {
    setSavingStatus(prev => ({ ...prev, [orderId]: true }))
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    } finally {
      setSavingStatus(prev => ({ ...prev, [orderId]: false }))
    }
  }

  async function handleViewTranscript(orderId: string) {
    const { data } = await supabase
      .from('call_logs')
      .select('transcript, summary, duration_seconds')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (data?.transcript) {
      alert(`Duración: ${data.duration_seconds}s\n\n${data.transcript}`)
    } else {
      alert('Sin transcripción disponible todavía.')
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes slideIn { from { opacity:0;transform:translateY(-8px) } to { opacity:1;transform:translateY(0) } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 0 rgba(46,196,182,0)} 50%{box-shadow:0 0 0 6px rgba(46,196,182,0.15)} }
        .order-card { transition: box-shadow 0.15s; }
        .order-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .new-order { animation: glow 1.5s ease 3; }
        .chip-scroll::-webkit-scrollbar { display:none }
      `}</style>

      <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 520, margin: '0 auto', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: 'clamp(40px,8vw,52px) clamp(16px,4vw,24px) 14px', borderBottom: '1px solid #e8f4f3', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(20px,5vw,26px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Pedidos</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>En tiempo real · {filtered.length} pedidos</p>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6' }}>
              {orders.filter(o => o.call_status === 'pending' || !o.call_status).length} pendientes
            </div>
          </div>

          {/* Filtros */}
          <div className="chip-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 10, paddingBottom: 2 }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{ padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: `2px solid ${filter === f.key ? '#2EC4B6' : '#e8f4f3'}`, background: filter === f.key ? '#f0fafa' : '#fff', color: filter === f.key ? '#0f766e' : '#94a3b8', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: F }}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Búsqueda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 12 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o #pedido..."
              style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }} />
            {search && (
              <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>

        {/* Lista pedidos */}
        <div style={{ padding: 'clamp(12px,3vw,16px)', paddingBottom: 100, display: 'flex', flexDirection: 'column', gap: 10 }}>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f0fafa', border: '1px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Sin pedidos</p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay pedidos que coincidan con el filtro</p>
            </div>
          )}

          {filtered.map((order, i) => {
            const isExpanded  = expanded === order.id
            const isNew       = newOrderIds.has(order.id)
            const callCfg     = CALL_STATUS_CONFIG[order.call_status ?? 'pending'] ?? CALL_STATUS_CONFIG.pending
            const score       = order.order_risk_analyses?.[0]?.risk_score ?? 50
            const scoreCfg    = scoreColor(score)
            const name        = `${order.customers?.first_name ?? ''} ${order.customers?.last_name ?? ''}`.trim() || 'Cliente'
            const initial     = name.charAt(0).toUpperCase()
            const phone       = order.customers?.phone ?? order.phone ?? '—'
            const waMsg       = waMessages[order.id]
            const isCalling   = loadingCall[order.id]
            const isLoadingWa = loadingWa[order.id]
            const summary     = order.call_summary ?? order.order_risk_analyses?.[0]?.summary
            const orderStatusOpt = ORDER_STATUS_OPTIONS.find(s => s.value === order.status) ?? ORDER_STATUS_OPTIONS[0]

            return (
              <div key={order.id} className={`order-card${isNew ? ' new-order' : ''}`}
                style={{ background: '#fff', borderRadius: 20, border: `1px solid ${isNew ? '#2EC4B6' : '#e8f4f3'}`, overflow: 'hidden', animation: i < 5 ? `slideIn 0.2s ease ${i * 0.04}s both` : 'none' }}>

                {/* Cabecera — click para expandir */}
                <div onClick={() => setExpanded(isExpanded ? null : order.id)} style={{ padding: 'clamp(14px,3vw,16px)', cursor: 'pointer' }}>

                  {isNew && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8, fontSize: 10, fontWeight: 700, color: '#0f766e' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2EC4B6', animation: 'pulse 1s infinite' }} />
                      NUEVO PEDIDO
                    </div>
                  )}

                  {/* Avatar + nombre + score */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 13, background: avatarGradient(score), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {isCalling ? (
                          <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        ) : initial}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{phone}</p>
                      </div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: scoreCfg.bg, color: scoreCfg.color, border: `1px solid ${scoreCfg.border}`, flexShrink: 0, whiteSpace: 'nowrap' }}>
                      {score} {scoreCfg.label}
                    </div>
                  </div>

                  {/* Precio + intentos */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                      {Number(order.total_price ?? 0).toFixed(2)}€
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#94a3b8' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/></svg>
                      {(order.call_attempts ?? 0) > 0 ? `${order.call_attempts} intento${order.call_attempts > 1 ? 's' : ''}` : 'Sin llamadas aún'}
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: callCfg.bg, color: callCfg.color, border: `1px solid ${callCfg.border}` }}>
                      {callCfg.emoji} {callCfg.label}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#f1f5f9', color: '#475569' }}>
                      {orderStatusOpt.label}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#f1f5f9', color: '#94a3b8' }}>
                      #{order.order_number}
                    </span>
                  </div>
                </div>

                {/* Sección expandida */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f0fafa', background: '#fafcff', padding: 'clamp(14px,3vw,16px)', display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Resumen llamada */}
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Resumen de la llamada IA</p>
                      <p style={{ fontSize: 13, color: summary ? '#374151' : '#94a3b8', lineHeight: 1.6, margin: 0, fontStyle: summary ? 'normal' : 'italic' }}>
                        {summary ?? 'Sin resumen disponible. La llamada aún no se ha realizado.'}
                      </p>
                    </div>

                    {/* WhatsApp */}
                    <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '12px 14px', border: '1px solid #bbf7d0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: waMsg ? 8 : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#15803d' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#15803d"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.428a.75.75 0 00.921.908l5.687-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm.001 21.75a9.712 9.712 0 01-4.93-1.344l-.354-.21-3.668.961.976-3.564-.23-.368A9.719 9.719 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                          Mensaje WhatsApp IA
                        </div>
                        {!waMsg && (
                          <button onClick={() => generateWhatsApp(order)} disabled={isLoadingWa}
                            style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: '1.5px solid #22c55e', background: '#fff', color: '#15803d', cursor: 'pointer', fontFamily: F, opacity: isLoadingWa ? 0.6 : 1 }}>
                            {isLoadingWa ? 'Generando...' : 'Generar'}
                          </button>
                        )}
                      </div>
                      {waMsg ? (
                        <>
                          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: '0 0 10px' }}>{waMsg}</p>
                          <button onClick={() => generateWhatsApp(order)} disabled={isLoadingWa}
                            style={{ width: '100%', padding: '9px', borderRadius: 11, border: '2px solid #22c55e', background: '#fff', color: '#15803d', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: F, opacity: isLoadingWa ? 0.6 : 1 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.68"/></svg>
                            {isLoadingWa ? 'Regenerando...' : 'Regenerar mensaje'}
                          </button>
                        </>
                      ) : (
                        !isLoadingWa && <p style={{ fontSize: 12, color: '#64748b', margin: '6px 0 0', fontStyle: 'italic' }}>Genera un mensaje personalizado para este cliente</p>
                      )}
                    </div>

                    {/* Estado del pedido */}
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Estado del pedido</p>
                      <select
                        value={order.status ?? 'por_confirmar'}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        disabled={savingStatus[order.id]}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #e8f4f3', background: '#fff', fontSize: 13, fontWeight: 700, color: '#0f172a', outline: 'none', fontFamily: F, cursor: 'pointer', opacity: savingStatus[order.id] ? 0.6 : 1 }}>
                        {ORDER_STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Botones acción */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button onClick={() => handleViewTranscript(order.id)}
                        style={{ padding: '11px', borderRadius: 12, border: '2px solid #e8f4f3', background: '#fff', color: '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: F }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Transcripción
                      </button>
                      <button onClick={() => handleRetry(order.id)} disabled={isCalling}
                        style={{ padding: '11px', borderRadius: 12, border: '2px solid #bae6fd', background: '#f0f9ff', color: '#0284c7', fontSize: 12, fontWeight: 700, cursor: isCalling ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: F, opacity: isCalling ? 0.6 : 1 }}>
                        {isCalling ? (
                          <div style={{ width: 12, height: 12, border: '2px solid rgba(2,132,199,0.3)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.68"/></svg>
                        )}
                        {isCalling ? 'Llamando...' : 'Rellamar'}
                      </button>
                    </div>

                  </div>
                )}

                {/* Footer */}
                <div onClick={() => setExpanded(isExpanded ? null : order.id)}
                  style={{ background: '#f8fafc', padding: '10px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {order.next_call_at && ` · Próximo intento ${new Date(order.next_call_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {isExpanded
                      ? <polyline points="18 15 12 9 6 15"/>
                      : <polyline points="6 9 12 15 18 9"/>
                    }
                  </svg>
                </div>

              </div>
            )
          })}

        </div>
      </div>
    </>
  )
}