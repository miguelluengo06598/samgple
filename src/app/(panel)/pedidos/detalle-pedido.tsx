'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  order: any
  onBack: () => void
  onStatusChange: (orderId: string, newStatus: string) => void
}

const RISK_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  bajo:     { color: '#2EC4B6', bg: '#e1f5ee', label: 'Bajo riesgo' },
  medio:    { color: '#f59e0b', bg: '#fef3c7', label: 'Riesgo medio' },
  alto:     { color: '#f97316', bg: '#fff7ed', label: 'Riesgo alto' },
  muy_alto: { color: '#ef4444', bg: '#fef2f2', label: 'Riesgo crítico' },
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

  const currentStatus = STATUSES.find(s => s.value === order.status)

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div
        className="bg-white px-5 pt-10 pb-4 flex items-center gap-3 shrink-0"
        style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-sm shrink-0"
          style={{ border: '0.5px solid rgba(0,0,0,0.06)' }}
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">#{order.order_number}</p>
          <p className="text-xs text-gray-400">{customer?.first_name} {customer?.last_name}</p>
        </div>
        <button
          onClick={handleAnalyse}
          disabled={analysing}
          className="text-xs font-medium px-3 py-1.5 rounded-full disabled:opacity-50"
          style={{ background: '#e1f5ee', color: '#085041' }}
        >
          {analysing ? '...' : '🔄 Analizar'}
        </button>
      </div>

      {/* Scroll content */}
      <div className="flex-1 overflow-y-auto pb-8">

        {/* Score block */}
        {analysis ? (
          <div className="mx-4 mt-4 rounded-3xl p-5" style={{ background: '#f7f8fa' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-4xl font-semibold" style={{ color: risk?.color ?? '#2EC4B6' }}>
                  {analysis.risk_score}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">score de riesgo</p>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: risk?.bg, color: risk?.color }}
              >
                {risk?.label}
              </div>
            </div>
            {/* Barra de riesgo */}
            <div className="h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${analysis.risk_score}%`, background: risk?.color ?? '#2EC4B6' }}
              />
            </div>
            {analysis.summary && (
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{analysis.summary}</p>
            )}
            {analysis.human_explanation && (
              <p className="text-xs text-gray-400 leading-relaxed mb-3">{analysis.human_explanation}</p>
            )}
            {analysis.recommendation && (
              <div className="rounded-2xl px-3 py-2.5" style={{ background: '#e1f5ee' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: '#085041' }}>Recomendación</p>
                <p className="text-sm" style={{ color: '#0f6e56' }}>{analysis.recommendation}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mx-4 mt-4 rounded-3xl p-5 text-center" style={{ background: '#f7f8fa' }}>
            <p className="text-sm text-gray-400 mb-3">Sin análisis todavía</p>
            <button
              onClick={handleAnalyse}
              disabled={analysing}
              className="text-sm font-medium px-5 py-2.5 rounded-2xl text-white disabled:opacity-50"
              style={{ background: '#2EC4B6' }}
            >
              {analysing ? 'Analizando...' : 'Analizar con IA'}
            </button>
          </div>
        )}

        {/* Tags */}
        {order.order_risk_tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 mt-3">
            {order.order_risk_tags.map((t: any) => (
              <span key={t.tag} className="text-xs px-2.5 py-1 rounded-full bg-white text-gray-500"
                style={{ border: '0.5px solid rgba(0,0,0,0.06)' }}>
                {t.tag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Info cliente */}
        <div className="mx-4 mt-4 bg-white rounded-3xl p-5" style={{ border: '0.5px solid rgba(0,0,0,0.06)' }}>
          <p className="text-sm font-medium text-gray-900 mb-3">Cliente</p>
          <div className="space-y-2.5">
            <Row label="Nombre" value={`${customer?.first_name ?? ''} ${customer?.last_name ?? ''}`} />
            <Row label="Teléfono" value={phone ?? '—'} />
            {address && <>
              <Row label="Dirección" value={address.address1} />
              <Row label="Ciudad" value={`${address.city} ${address.zip ?? ''}`} />
              <Row label="País" value={address.country} />
            </>}
            {customer && (
              <Row label="Historial" value={`${customer.total_orders} pedidos · ${customer.total_delivered} entregados`} />
            )}
          </div>
        </div>

        {/* Productos */}
        <div className="mx-4 mt-3 bg-white rounded-3xl p-5" style={{ border: '0.5px solid rgba(0,0,0,0.06)' }}>
          <p className="text-sm font-medium text-gray-900 mb-3">Productos</p>
          <div className="space-y-2">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.name} <span className="text-gray-300">x{item.quantity}</span></span>
                <span className="font-medium text-gray-800">{item.price}€</span>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-50 flex justify-between text-sm font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{order.total_price}€</span>
            </div>
          </div>
        </div>

        {/* Mensaje WhatsApp */}
        {analysis?.customer_message && (
          <div className="mx-4 mt-3 rounded-3xl p-5" style={{ background: '#f0fdf4', border: '0.5px solid rgba(34,197,94,0.15)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium" style={{ color: '#166534' }}>Mensaje WhatsApp</p>
              <button onClick={copyMessage} className="text-xs font-medium" style={{ color: '#2EC4B6', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#15803d' }}>
              {analysis.customer_message}
            </p>
          </div>
        )}

        {/* Botones acción */}
        <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
          <button
            onClick={() => phone && window.open(`tel:${phone}`)}
            disabled={!phone}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium disabled:opacity-40"
            style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', color: '#374151' }}
          >
            📞 Llamar
          </button>
          <button
            onClick={handleWhatsApp}
            disabled={!phone || !analysis?.customer_message}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-medium text-white disabled:opacity-40"
            style={{ background: '#22c55e' }}
          >
            💬 WhatsApp
          </button>
        </div>

        {/* Cambiar estado — dropdown */}
        <div className="mx-4 mt-3 relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-2xl text-sm font-medium"
            style={{ border: '0.5px solid rgba(0,0,0,0.06)' }}
          >
            <span className="text-gray-500">Estado actual</span>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: '#e1f5ee', color: '#085041' }}
              >
                {currentStatus?.label ?? order.status}
              </span>
              <span className="text-gray-400 text-xs">{statusOpen ? '▲' : '▼'}</span>
            </div>
          </button>

          <AnimatePresence>
            {statusOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl overflow-hidden z-20"
                style={{ border: '0.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
              >
                {STATUSES.map((s, i) => (
                  <button
                    key={s.value}
                    onClick={() => handleStatus(s.value)}
                    disabled={loading || s.value === order.status}
                    className="w-full text-left px-5 py-3.5 text-sm flex items-center justify-between disabled:opacity-40 transition-colors"
                    style={{
                      borderBottom: i < STATUSES.length - 1 ? '0.5px solid rgba(0,0,0,0.04)' : 'none',
                      background: s.value === order.status ? '#f7f8fa' : 'transparent',
                      color: s.value === 'cancelado' ? '#991b1b' : '#374151',
                    }}
                  >
                    <span>{s.label}</span>
                    {s.value === order.status && (
                      <span className="text-xs font-medium" style={{ color: '#2EC4B6' }}>actual</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-700 font-medium text-right max-w-[60%] leading-snug">{value}</span>
    </div>
  )
}