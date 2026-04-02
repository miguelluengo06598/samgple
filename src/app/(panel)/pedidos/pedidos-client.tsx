'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const F = 'system-ui,-apple-system,sans-serif'

const CALL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  confirmed:    { label: 'Confirmado',    color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  no_answer:    { label: 'No contestó',   color: '#92400e', bg: '#fef3c7', border: '#fde68a', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
  cancelled:    { label: 'Cancelado',     color: '#b91c1c', bg: '#fee2e2', border: '#fecaca', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  voicemail:    { label: 'Buzón de voz',  color: '#6d28d9', bg: '#faf5ff', border: '#e9d5ff', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  wrong_number: { label: 'Nº incorrecto', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0', icon: 'M6 18L18 6M6 6l12 12' },
  calling:      { label: 'Llamando...',   color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z' },
  pending:      { label: 'Pendiente',     color: '#475569', bg: '#f1f5f9', border: '#e2e8f0', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  rescheduled:  { label: 'Reagendado',    color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
}

const ORDER_STATUS_OPTIONS = [
  { value: 'por_confirmar', label: 'Por confirmar', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  { value: 'confirmado',    label: 'Confirmado',    color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  { value: 'enviado',       label: 'Enviado',       color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { value: 'entregado',     label: 'Entregado',     color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  { value: 'incidencia',    label: 'Incidencia',    color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  { value: 'cancelado',     label: 'Cancelado',     color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' },
]

const FILTERS = [
  { key: 'all',       label: 'Todos' },
  { key: 'pending',   label: 'Pendientes' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'no_answer', label: 'No contestó' },
  { key: 'cancelled', label: 'Cancelados' },
]

function scoreColor(score: number) {
  if (score <= 35) return { color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', label: 'Bajo riesgo' }
  if (score <= 65) return { color: '#92400e', bg: '#fef3c7', border: '#fde68a', label: 'Riesgo medio' }
  return { color: '#b91c1c', bg: '#fee2e2', border: '#fecaca', label: 'Alto riesgo' }
}

function Skeleton({ w = '100%', h = 14, r = 8 }: { w?: string | number; h?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8f0fe 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
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
  const [transcript, setTranscript]     = useState<Record<string, any>>({})
  const [showTranscript, setShowTranscript] = useState<string | null>(null)
  const supabase = createClient()

  const SELECT_QUERY = `
    id, order_number, status, call_status, call_attempts,
    call_summary, total_price, phone, shipping_address,
    created_at, last_call_at, next_call_at,
    customers(first_name, last_name, phone, email),
    order_items(name, quantity, price),
    order_risk_analyses(risk_score, risk_level, summary)
  `

  useEffect(() => {
    const channel = supabase.channel(`pedidos-${accountId}`)

    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `account_id=eq.${accountId}` },
      async (payload) => {
        const { data } = await supabase.from('orders').select(SELECT_QUERY).eq('id', payload.new.id).single()
        if (data) {
          setOrders(prev => [data, ...prev])
          setNewOrderIds(prev => new Set([...prev, data.id]))
          setTimeout(() => setNewOrderIds(prev => { const s = new Set(prev); s.delete(data.id); return s }), 4000)
        }
      }
    )

    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `account_id=eq.${accountId}` },
      async (payload) => {
        const { data } = await supabase.from('orders').select(SELECT_QUERY).eq('id', payload.new.id).single()
        if (data) setOrders(prev => prev.map(o => o.id === data.id ? data : o))
      }
    )

    channel.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'call_logs' },
      async (payload) => {
        const log = payload.new as any
        if (!log.order_id) return
        const { data } = await supabase.from('orders').select(SELECT_QUERY).eq('id', log.order_id).single()
        if (data) setOrders(prev => prev.map(o => o.id === data.id ? data : o))
      }
    )

    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [accountId])

  const filtered = orders.filter(o => {
    const matchFilter =
      filter === 'all'     ? true :
      filter === 'pending' ? (o.call_status === 'pending' || o.call_status === 'calling') :
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

  async function sendWhatsApp(order: any) {
    const msg = waMessages[order.id]
    if (!msg) return
    const phone = (order.customers?.phone ?? order.phone ?? '').replace(/\D/g, '')
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
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
    if (transcript[orderId]) { setShowTranscript(orderId); return }
    const { data } = await supabase
      .from('call_logs')
      .select('transcript, summary, duration_seconds')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    setTranscript(prev => ({ ...prev, [orderId]: data ?? null }))
    setShowTranscript(orderId)
  }

  const pendingCount = orders.filter(o => o.call_status === 'pending' || !o.call_status).length

  return (
    <>
      <style>{`
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(46,196,182,0)} 50%{box-shadow:0 0 0 6px rgba(46,196,182,0.15)} }
        .ped-card  { transition:box-shadow 0.15s,transform 0.15s; }
        .ped-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.07); }
        .chip-scroll::-webkit-scrollbar { display:none }
        .btn-action { transition:all 0.12s ease; }
        .btn-action:hover { opacity:0.85; transform:translateY(-1px); }
        .btn-action:active { transform:scale(0.96); }
        @media(min-width:640px) {
          .ped-expanded-grid { grid-template-columns:1fr 1fr !important; }
          .ped-actions { grid-template-columns:1fr 1fr 1fr !important; }
        }
      `}</style>

      {/* Modal transcripción */}
      {showTranscript && (
        <div onClick={() => setShowTranscript(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: 24, width: '100%', maxWidth: 600, maxHeight: '70vh', overflow: 'auto', animation: 'fadeUp 0.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>Transcripción</p>
              <button onClick={() => setShowTranscript(null)}
                style={{ width: 32, height: 32, borderRadius: 10, border: '1.5px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {transcript[showTranscript] ? (
              <>
                {transcript[showTranscript].duration_seconds && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 12 }}>
                    Duración: {transcript[showTranscript].duration_seconds}s
                  </div>
                )}
                {transcript[showTranscript].summary && (
                  <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '12px 14px', marginBottom: 12, border: '1px solid #bbf7d0' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#0f766e', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resumen</p>
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{transcript[showTranscript].summary}</p>
                  </div>
                )}
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                  {transcript[showTranscript].transcript ?? 'Sin transcripción disponible.'}
                </p>
              </>
            ) : (
              <p style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center', padding: '24px 0' }}>Sin transcripción disponible todavía.</p>
            )}
          </div>
        </div>
      )}

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px) 0', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Pedidos</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>En tiempo real · {filtered.length} pedidos</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: '#fef3c7', border: '1.5px solid #fde68a' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>{pendingCount} pendientes</span>
              </div>
            </div>

            {/* Búsqueda */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o número de pedido..."
                style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }} />
              {search && (
                <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {/* Filtros */}
            <div className="chip-scroll" style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 0 }}>
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  style={{ padding: '7px 16px', borderRadius: '12px 12px 0 0', fontSize: 12, fontWeight: 700, border: 'none', borderBottom: filter === f.key ? '2px solid #2EC4B6' : '2px solid transparent', background: filter === f.key ? '#f0fdf4' : 'transparent', color: filter === f.key ? '#0f766e' : '#94a3b8', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: F, transition: 'all 0.12s' }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: 20, border: '1.5px solid #f1f5f9' }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Sin pedidos</p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay pedidos que coincidan</p>
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
            const phone       = order.customers?.phone ?? order.phone ?? ''
            const waMsg       = waMessages[order.id]
            const isCalling   = loadingCall[order.id]
            const isLoadingWa = loadingWa[order.id]
            const summary     = order.call_summary ?? order.order_risk_analyses?.[0]?.summary
            const statusOpt   = ORDER_STATUS_OPTIONS.find(s => s.value === order.status) ?? ORDER_STATUS_OPTIONS[0]
            const items       = order.order_items ?? []

            return (
              <div key={order.id} className={`ped-card${isNew ? ' new-order' : ''}`}
                style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${isNew ? '#2EC4B6' : '#f1f5f9'}`, overflow: 'hidden', animation: i < 8 ? `fadeUp 0.2s ease ${i * 0.03}s both` : 'none' }}>

                {/* Cabecera */}
                <div onClick={() => setExpanded(isExpanded ? null : order.id)}
                  style={{ padding: 'clamp(14px,3vw,20px)', cursor: 'pointer' }}>

                  {isNew && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 10, fontSize: 10, fontWeight: 700, color: '#0f766e', background: '#f0fdf4', padding: '3px 10px', borderRadius: 20, border: '1px solid #bbf7d0' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', animation: 'pulse 1s infinite' }} />
                      NUEVO PEDIDO
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>

                    {/* Info cliente */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: score <= 35 ? 'linear-gradient(135deg,#2EC4B6,#1D9E75)' : score <= 65 ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {isCalling
                          ? <div style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          : initial
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px' }}>{phone || '—'}</p>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: callCfg.bg, color: callCfg.color, border: `1px solid ${callCfg.border}` }}>
                            {callCfg.label}
                          </span>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: statusOpt.bg, color: statusOpt.color, border: `1px solid ${statusOpt.border}` }}>
                            {statusOpt.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Precio + score */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 'clamp(18px,4vw,22px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
                        {Number(order.total_price ?? 0).toFixed(2)}€
                      </p>
                      <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: scoreCfg.bg, color: scoreCfg.color, border: `1px solid ${scoreCfg.border}`, display: 'inline-block', marginBottom: 4 }}>
                        {score} · {scoreCfg.label}
                      </div>
                      <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>#{order.order_number}</p>
                    </div>
                  </div>
                </div>

                {/* Expandido */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f8fafc', background: '#fafbff', padding: 'clamp(14px,3vw,20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Productos */}
                    {items.length > 0 && (
                      <div style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1.5px solid #f1f5f9' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Productos</p>
                        {items.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: idx > 0 ? '6px 0 0' : '0', borderTop: idx > 0 ? '1px solid #f8fafc' : 'none' }}>
                            <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.name} <span style={{ color: '#94a3b8' }}>×{item.quantity}</span></span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{Number(item.price).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resumen + WhatsApp grid */}
                    <div className="ped-expanded-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>

                      {/* Resumen llamada */}
                      <div style={{ background: '#fff', borderRadius: 14, padding: '14px', border: '1.5px solid #f1f5f9' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Resumen IA</p>
                        <p style={{ fontSize: 13, color: summary ? '#374151' : '#94a3b8', lineHeight: 1.6, margin: 0, fontStyle: summary ? 'normal' : 'italic' }}>
                          {summary ?? 'Sin resumen. La llamada aún no se ha realizado.'}
                        </p>
                        {(order.call_attempts ?? 0) > 0 && (
                          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/></svg>
                            {order.call_attempts} intento{order.call_attempts > 1 ? 's' : ''}
                            {order.last_call_at && ` · ${new Date(order.last_call_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`}
                          </div>
                        )}
                      </div>

                      {/* WhatsApp */}
                      <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '14px', border: '1.5px solid #bbf7d0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#15803d"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.428a.75.75 0 00.921.908l5.687-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm.001 21.75a9.712 9.712 0 01-4.93-1.344l-.354-.21-3.668.961.976-3.564-.23-.368A9.719 9.719 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#15803d', margin: 0 }}>WhatsApp IA</p>
                          </div>
                          {!waMsg && (
                            <button onClick={() => generateWhatsApp(order)} disabled={isLoadingWa} className="btn-action"
                              style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: '1.5px solid #22c55e', background: '#fff', color: '#15803d', cursor: 'pointer', fontFamily: F, opacity: isLoadingWa ? 0.6 : 1 }}>
                              {isLoadingWa ? 'Generando...' : 'Generar'}
                            </button>
                          )}
                        </div>
                        {waMsg ? (
                          <>
                            <p style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, margin: '0 0 10px' }}>{waMsg}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                              <button onClick={() => sendWhatsApp(order)} className="btn-action"
                                style={{ padding: '9px', borderRadius: 10, border: 'none', background: '#22c55e', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: F }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.428a.75.75 0 00.921.908l5.687-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 11.999 0zm.001 21.75a9.712 9.712 0 01-4.93-1.344l-.354-.21-3.668.961.976-3.564-.23-.368A9.719 9.719 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                                Enviar
                              </button>
                              <button onClick={() => generateWhatsApp(order)} disabled={isLoadingWa} className="btn-action"
                                style={{ padding: '9px', borderRadius: 10, border: '1.5px solid #bbf7d0', background: '#fff', color: '#15803d', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: F, opacity: isLoadingWa ? 0.6 : 1 }}>
                                {isLoadingWa ? '...' : 'Regenerar'}
                              </button>
                            </div>
                          </>
                        ) : (
                          !isLoadingWa && <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontStyle: 'italic' }}>Genera un mensaje personalizado para WhatsApp</p>
                        )}
                      </div>
                    </div>

                    {/* Estado del pedido */}
                    <div style={{ background: '#fff', borderRadius: 14, padding: '14px', border: '1.5px solid #f1f5f9' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Estado del pedido</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {ORDER_STATUS_OPTIONS.map(s => (
                          <button key={s.value} onClick={() => handleStatusChange(order.id, s.value)} className="btn-action"
                            style={{ padding: '7px 12px', borderRadius: 20, border: `1.5px solid ${order.status === s.value ? s.border : '#f1f5f9'}`, background: order.status === s.value ? s.bg : '#fff', color: order.status === s.value ? s.color : '#94a3b8', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: F, opacity: savingStatus[order.id] ? 0.6 : 1 }}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="ped-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button onClick={() => handleViewTranscript(order.id)} className="btn-action"
                        style={{ padding: '12px', borderRadius: 14, border: '1.5px solid #f1f5f9', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: F }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        Transcripción
                      </button>
                      <button onClick={() => handleRetry(order.id)} disabled={isCalling} className="btn-action"
                        style={{ padding: '12px', borderRadius: 14, border: '1.5px solid #bae6fd', background: '#f0f9ff', color: '#0284c7', fontSize: 13, fontWeight: 700, cursor: isCalling ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: F, opacity: isCalling ? 0.6 : 1 }}>
                        {isCalling
                          ? <div style={{ width: 14, height: 14, border: '2px solid rgba(2,132,199,0.3)', borderTopColor: '#0284c7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.68"/></svg>
                        }
                        {isCalling ? 'Llamando...' : 'Rellamar ahora'}
                      </button>
                    </div>

                  </div>
                )}

                {/* Footer */}
                <div onClick={() => setExpanded(isExpanded ? null : order.id)}
                  style={{ padding: '10px clamp(14px,3vw,20px)', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isExpanded ? '#fafbff' : '#fff' }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {new Date(order.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    {order.next_call_at && ` · Próximo: ${new Date(order.next_call_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                    {isExpanded ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
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