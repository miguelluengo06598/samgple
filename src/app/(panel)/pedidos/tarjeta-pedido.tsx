'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

type Props = {
  order: any
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

const RISK_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  bajo:     { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400', label: 'Bajo' },
  medio:    { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400',   label: 'Medio' },
  alto:     { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400',  label: 'Alto' },
  muy_alto: { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Muy alto' },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  confirmar:  { label: 'Por confirmar', color: 'bg-blue-100 text-blue-700' },
  confirmado: { label: 'Confirmado',    color: 'bg-teal-100 text-teal-700' },
  preparado:  { label: 'Preparado',     color: 'bg-purple-100 text-purple-700' },
  enviado:    { label: 'Enviado',       color: 'bg-indigo-100 text-indigo-700' },
  incidencia: { label: 'Incidencia',    color: 'bg-orange-100 text-orange-700' },
  devolucion: { label: 'Devolución',    color: 'bg-red-100 text-red-700' },
}

export default function TarjetaPedido({ order, onSwipeLeft, onSwipeRight }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-150, 150], [-5, 5])
  const opacity = useTransform(x, [-150, 0, 150], [0.6, 1, 0.6])

  const analysis = Array.isArray(order.order_risk_analyses)
    ? order.order_risk_analyses[0]
    : order.order_risk_analyses

  const customer = order.customers
  const firstItem = order.order_items?.[0]
  const riskLevel = analysis?.risk_level ?? null
  const riskScore = analysis?.risk_score ?? null
  const risk = riskLevel ? RISK_CONFIG[riskLevel] : null
  const status = STATUS_CONFIG[order.status]
  const city = order.shipping_address?.city ?? ''
  const tags = order.order_risk_tags ?? []

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x < -80) onSwipeLeft()
    else if (info.offset.x > 80) onSwipeRight()
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      onClick={onSwipeRight}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer select-none active:scale-[0.99] transition-transform"
    >
      {/* Barra superior de color según riesgo */}
      {risk && (
        <div className={`h-1 w-full ${
          riskLevel === 'bajo' ? 'bg-emerald-400' :
          riskLevel === 'medio' ? 'bg-amber-400' :
          riskLevel === 'alto' ? 'bg-orange-400' : 'bg-red-500'
        }`} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-semibold text-gray-900 truncate">
                {customer?.first_name} {customer?.last_name}
              </p>
              {customer?.total_orders > 1 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full shrink-0">
                  {customer.total_orders} pedidos
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">#{order.order_number} · {city}</p>
          </div>
          <div className="text-right ml-3 shrink-0">
            <p className="font-bold text-gray-900 text-lg leading-none">{order.total_price}€</p>
            {risk && (
              <div className={`flex items-center gap-1 justify-end mt-1 px-2 py-0.5 rounded-full ${risk.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
                <span className={`text-xs font-medium ${risk.text}`}>{riskScore} · {risk.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Producto */}
        {firstItem && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm shrink-0">
              📦
            </div>
            <div className="min-w-0">
              <p className="text-sm text-gray-700 truncate">{firstItem.name}</p>
              {order.order_items?.length > 1 && (
                <p className="text-xs text-gray-400">+{order.order_items.length - 1} producto más</p>
              )}
            </div>
          </div>
        )}

        {/* Summary IA */}
        {analysis?.summary && (
          <p className="text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2 mb-3 line-clamp-2">
            {analysis.summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
            {tags.slice(0, 3).map((t: any) => (
              <span key={t.tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                {t.tag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
          {status && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${status.color}`}>
              {status.label}
            </span>
          )}
        </div>

        {/* Hint */}
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-50 text-[10px] text-gray-300">
          <span>← omitir</span>
          <span>ver detalle →</span>
        </div>
      </div>
    </motion.div>
  )
}