'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  order: any
  onBack: () => void
  onStatusChange: (orderId: string, newStatus: string) => void
}

const RISK_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  bajo:     { color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', label: 'Bajo riesgo' },
  medio:    { color: '#92400e', bg: '#fffbeb', border: '#fde68a', label: 'Riesgo medio' },
  alto:     { color: '#9a3412', bg: '#fff7ed', border: '#fed7aa', label: 'Riesgo alto' },
  muy_alto: { color: '#991b1b', bg: '#fef2f2', border: '#fecaca', label: 'Riesgo crítico' },
}

const STATUSES = [
  { value: 'confirmar',  label: 'Por confirmar' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'preparado',  label: 'Preparado' },
  { value: 'enviado',    label: 'Enviado' },
  { value: 'entregado',  label: 'Entregado' },
  { value: 'incidencia', label: 'Incidencia' },
  { value: 'devolucion', label: 'Devolución' },
  { value: 'cancelado',  label: 'Cancelado' },
]

export default function DetallePedido({ order: initialOrder, onBack, onStatusChange }: Props) {
  const [order, setOrder] = useState(initialOrder)
  const [analysing, setAnalysing] = useState(false)
  const [generatingMsg, setGeneratingMsg] = useState(false)
  const [copied, setCopied] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${initialOrder.id}`)
      .then(r => r.json())
      .then(d => { if (d.order) setOrder(d.order) })
      .catch(() => {})
  }, [initialOrder.id])

  const analysis = order.order_risk_analyses?.[0]
  const customer = order.customers
  const address = order.shipping_address
  const phone = order.phone ?? customer?.phone ?? null
  const risk = analysis?.risk_level ? RISK_CONFIG[analysis.risk_level] : null

  // Reanálisis completo — cobra 0.01
  async function handleAnalyse() {
    setAnalysing(true)
    try {
      await fetch(`/api/orders/${order.id}/analyze`, { method: 'POST' })
      const res = await fetch(`/api/orders/${order.id}`)
      const data = await res.json()
      if (data.order) setOrder(data.order)
    } finally {
      setAnalysing(false)
    }
  }

  // Nuevo mensaje WhatsApp — cobra 0.003
  async function handleNewMessage() {
    setGeneratingMsg(true)
    try {
      const res = await fetch(`/api/orders/${order.id}/message`, { method: 'POST' })
      const data = await res.json()
      if (data.message) {
        setOrder((prev: any) => ({
          ...prev,
          order_risk_analyses: [{
            ...prev.order_risk_analyses?.[0],
            customer_message: data.message,
          }],
        }))
      } else if (data.error === 'Saldo insuficiente') {
        alert('Saldo insuficiente para regenerar el mensaje (0.003 tokens)')
      }
    } finally {
      setGeneratingMsg(false)
    }
  }

  async function handleStatus(newStatus: string) {
    setLoading(true)
    setStatusOpen(false)
    try {
      await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      onStatusChange(order.id, newStatus)
    } finally {
      setLoading(false)
    }
  }

  function handleWhatsApp() {
    if (!phone || !analysis?.customer_message) return
    const clean = phone.replace(/\D/g, '')
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(analysis.customer_message)}`, '_blank')
  }

  function copyMessage() {
    if (!analysis?.customer_message) return
    navigator.clipboard.writeText(analysis.customer_message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0fafa', maxWidth: 480, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ background: '#ffffff', padding: '44px 20px 16px', borderBottom: '1px solid #cce8e6', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onBack}
            style={{ width: 36, height: 36, background: '#f0fafa', border: '1px solid #cce8e6', borderRadius: '50%', cursor: 'pointer', fontSize: 16, color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: 15, margin: 0 }}>#{order.order_number}</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{customer?.first_name} {customer?.last_name}</p>
          </div>
          <button
            onClick={handleAnalyse}
            disabled={analysing}
            style={{ fontSize: 12, fontWeight: 600, padding: '7px 13px', borderRadius: 20, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer', opacity: analysing ? 0.6 : 1 }}
          >
            {analysing ? '...' : '✦ Analizar'}
          </button>
        </div>
      </div>

      {/* Scroll */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Score */}
        {analysis ? (
          <div style={{ background: risk?.bg ?? '#f0fafa', borderRadius: 22, padding: 18, border: `1px solid ${risk?.border ?? '#cce8e6'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 52, fontWeight: 600, lineHeight: 1, color: risk?.color ?? '#2EC4B6', margin: 0 }}>{analysis.risk_score}</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0' }}>score de riesgo</p>
              </div>
              <span style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: '#ffffff', color: risk?.color ?? '#0f766e', border: `1px solid ${risk?.border ?? '#cce8e6'}` }}>
                {risk?.label}
              </span>
            </div>
            <div style={{ height: 6, background: 'rgba(0,0,0,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ height: '100%', borderRadius: 4, background: risk?.color ?? '#2EC4B6', width: `${analysis.risk_score}%`, transition: 'width 0.6s' }} />
            </div>
            {analysis.summary && <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}>{analysis.summary}</p>}
            {analysis.recommendation && (
              <div style={{ background: '#ffffff', borderRadius: 14, padding: '10px 14px', marginTop: 10, border: `1px solid ${risk?.border ?? '#cce8e6'}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: risk?.color ?? '#0f766e', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recomendación</p>
                <p style={{ fontSize: 13, color: risk?.color ?? '#0f766e', margin: 0, lineHeight: 1.5 }}>{analysis.recommendation}</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ background: '#ffffff', borderRadius: 22, padding: 20, border: '1px solid #cce8e6', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>Sin análisis todavía</p>
            <button onClick={handleAnalyse} disabled={analysing} style={{ fontSize: 13, fontWeight: 600, padding: '10px 20px', borderRadius: 14, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer' }}>
              {analysing ? 'Analizando...' : 'Analizar con IA'}
            </button>
          </div>
        )}

        {/* Tags */}
        {order.order_risk_tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {order.order_risk_tags.map((t: any) => (
              <span key={t.tag} style={{ fontSize: 11, padding: '4px 11px', borderRadius: 20, background: '#ffffff', color: '#0f766e', border: '1px solid #cce8e6', fontWeight: 500 }}>
                {t.tag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Cliente */}
        <div style={{ background: '#ffffff', borderRadius: 20, padding: 16, border: '1px solid #cce8e6' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Cliente</p>
          {[
            { label: 'Teléfono', value: phone ?? '—', highlight: true },
            { label: 'Dirección', value: address?.address1 ?? '—' },
            { label: 'Ciudad', value: address ? `${address.city} ${address.zip ?? ''}` : '—' },
            { label: 'País', value: address?.country ?? '—' },
            { label: 'Historial', value: customer ? `${customer.total_orders} pedidos · ${customer.total_delivered} entregados` : '—' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid #f0fafa' : 'none' }}>
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{row.label}</span>
              <span style={{ fontSize: 12, color: row.highlight ? '#2EC4B6' : '#0f172a', fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Productos */}
        <div style={{ background: '#ffffff', borderRadius: 20, padding: 16, border: '1px solid #cce8e6' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Productos</p>
          {order.order_items?.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f0fafa', fontSize: 13 }}>
              <span style={{ color: '#374151' }}>{item.name} <span style={{ color: '#94a3b8' }}>x{item.quantity}</span></span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.price}€</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontSize: 14, fontWeight: 700 }}>
            <span style={{ color: '#0f172a' }}>Total</span>
            <span style={{ color: '#0f172a' }}>{order.total_price}€</span>
          </div>
        </div>

        {/* WhatsApp — botón Nuevo usa handleNewMessage */}
        {analysis?.customer_message && (
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 16, border: '1px solid #cce8e6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0f766e' }}>Mensaje WhatsApp</span>
                <span style={{ fontSize: 10, color: '#9ca3af', marginLeft: 8 }}>0.003 tokens</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={copyMessage}
                  style={{ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1px solid #cce8e6', background: '#f0fafa', color: '#0f766e', cursor: 'pointer' }}
                >
                  {copied ? '✓ Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={handleNewMessage}
                  disabled={generatingMsg}
                  style={{ padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer', opacity: generatingMsg ? 0.6 : 1 }}
                >
                  {generatingMsg ? '...' : '✦ Nuevo'}
                </button>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#065f46', lineHeight: 1.6, background: '#f0fdf4', borderRadius: 14, padding: '12px 14px', border: '1px solid #bbf7d0' }}>
              {analysis.customer_message}
            </div>
          </div>
        )}

        {/* Botones contactar */}
        <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Contactar</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button
            onClick={() => phone && window.open(`tel:${phone}`)}
            disabled={!phone}
            style={{ padding: 15, borderRadius: 16, fontSize: 13, fontWeight: 600, border: '1px solid #cce8e6', background: '#ffffff', color: '#0f766e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: !phone ? 0.4 : 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Llamar
          </button>
          <button
            onClick={handleWhatsApp}
            disabled={!phone || !analysis?.customer_message}
            style={{ padding: 15, borderRadius: 16, fontSize: 13, fontWeight: 600, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: (!phone || !analysis?.customer_message) ? 0.4 : 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.532 5.855L.054 23.447a.5.5 0 00.499.553h.091l5.764-1.511A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
            WhatsApp
          </button>
        </div>

        {/* Botones gestionar */}
        <p style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '4px 0 0' }}>Gestionar pedido</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={() => handleStatus('confirmado')} disabled={loading} style={{ padding: 15, borderRadius: 16, fontSize: 13, fontWeight: 600, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Confirmar
          </button>
          <button onClick={() => handleStatus('incidencia')} disabled={loading} style={{ padding: 15, borderRadius: 16, fontSize: 13, fontWeight: 600, border: '1px solid #fed7aa', background: '#fff7ed', color: '#9a3412', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Incidencia
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={() => handleStatus('cancelado')} disabled={loading} style={{ padding: 15, borderRadius: 16, fontSize: 13, fontWeight: 600, border: '1px solid #fecaca', background: '#fef2f2', color: '#991b1b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Cancelar
          </button>
          <button onClick={() => setStatusOpen(!statusOpen)} style={{ padding: 15, borderRadius: 16, fontSize: 13, fontWeight: 600, border: '1px solid #cce8e6', background: '#ffffff', color: '#0f766e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            Estado
          </button>
        </div>

        {/* Dropdown estado */}
        <AnimatePresence>
          {statusOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{ background: '#ffffff', borderRadius: 16, border: '1px solid #cce8e6', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
            >
              {STATUSES.map((s, i) => (
                <button
                  key={s.value}
                  onClick={() => handleStatus(s.value)}
                  disabled={loading || s.value === order.status}
                  style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 13,
                    fontWeight: s.value === order.status ? 700 : 500,
                    color: s.value === 'cancelado' ? '#991b1b' : s.value === order.status ? '#2EC4B6' : '#374151',
                    border: 'none', background: s.value === order.status ? '#f0fafa' : 'transparent',
                    borderBottom: i < STATUSES.length - 1 ? '1px solid #f0fafa' : 'none',
                    cursor: s.value === order.status ? 'default' : 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  {s.label}
                  {s.value === order.status && <span style={{ color: '#2EC4B6', fontSize: 14 }}>✓</span>}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}