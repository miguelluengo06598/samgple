'use client'

import { useState } from 'react'

type Props = {
  order: any
  onBack: () => void
  onStatusChange: (orderId: string, newStatus: string) => void
}

const RISK_COLORS: Record<string, string> = {
  bajo: 'bg-green-100 text-green-700',
  medio: 'bg-yellow-100 text-yellow-700',
  alto: 'bg-orange-100 text-orange-700',
  muy_alto: 'bg-red-100 text-red-700',
}

const STATUS_OPTIONS = [
  { value: 'confirmar', label: 'Por confirmar' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'preparado', label: 'Preparado' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'incidencia', label: 'Incidencia' },
  { value: 'devolucion', label: 'Devolución' },
  { value: 'cancelado', label: 'Cancelado' },
]

export default function DetallePedido({ order, onBack, onStatusChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const analysis = order.order_risk_analyses?.[0]
  const customer = order.customers
  const address = order.shipping_address

  const phone = order.phone ?? customer?.phone ?? null

  async function handleStatusChange(newStatus: string) {
    setLoading(true)
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
    const text = encodeURIComponent(analysis.customer_message)
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank')
  }

  function handleCall() {
    if (!phone) return
    window.open(`tel:${phone}`)
  }

  function copyMessage() {
    if (!analysis?.customer_message) return
    navigator.clipboard.writeText(analysis.customer_message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-xl">←</button>
        <div>
          <h1 className="font-semibold text-gray-900">#{order.order_number}</h1>
          <p className="text-xs text-gray-400">{customer?.first_name} {customer?.last_name}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Score */}
        {analysis && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Riesgo</p>
              <span className={`text-sm px-3 py-1 rounded-full font-semibold ${RISK_COLORS[analysis.risk_level]}`}>
                {analysis.risk_score}/100 · {analysis.risk_level.replace('_', ' ')}
              </span>
            </div>
            {analysis.summary && (
              <p className="text-sm text-gray-600">{analysis.summary}</p>
            )}
            {analysis.human_explanation && (
              <p className="text-xs text-gray-400 mt-2">{analysis.human_explanation}</p>
            )}
            {analysis.recommendation && (
              <div className="mt-3 bg-teal-50 rounded-xl px-3 py-2">
                <p className="text-xs text-teal-700 font-medium">Recomendación</p>
                <p className="text-sm text-teal-800 mt-0.5">{analysis.recommendation}</p>
              </div>
            )}
          </div>
        )}

        {/* Datos cliente */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Cliente</p>
          <Row label="Nombre" value={`${customer?.first_name ?? ''} ${customer?.last_name ?? ''}`} />
          <Row label="Teléfono" value={phone ?? '—'} />
          {address && (
            <>
              <Row label="Dirección" value={address.address1} />
              <Row label="Ciudad" value={`${address.city} ${address.zip ?? ''}`} />
              <Row label="País" value={address.country} />
            </>
          )}
          {customer && (
            <Row
              label="Historial"
              value={`${customer.total_orders} pedidos · ${customer.total_delivered} entregados`}
            />
          )}
        </div>

        {/* Productos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Productos</p>
          <div className="space-y-2">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                <span className="text-gray-900 font-medium">{item.price}€</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>{order.total_price}€</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {order.order_risk_tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {order.order_risk_tags.map((t: any) => (
              <span key={t.tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                {t.tag}
              </span>
            ))}
          </div>
        )}

        {/* Mensaje WhatsApp */}
        {analysis?.customer_message && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Mensaje WhatsApp</p>
              <button
                onClick={copyMessage}
                className="text-xs text-teal-600 hover:text-teal-700"
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap">
              {analysis.customer_message}
            </p>
          </div>
        )}

        {/* Acciones principales */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCall}
            disabled={!phone}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            📞 Llamar
          </button>
          <button
            onClick={handleWhatsApp}
            disabled={!phone || !analysis?.customer_message}
            className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 rounded-2xl text-sm font-medium text-white disabled:opacity-40"
          >
            💬 WhatsApp
          </button>
        </div>

        {/* Cambio de estado */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Cambiar estado</p>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                disabled={loading || opt.value === order.status}
                className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                  opt.value === order.status
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } disabled:opacity-50`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-800 font-medium text-right max-w-[60%]">{value}</span>
    </div>
  )
}