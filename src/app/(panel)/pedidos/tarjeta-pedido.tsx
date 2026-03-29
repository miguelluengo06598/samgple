'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

type Props = {
  order: any
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

const RISK_COLORS: Record<string, string> = {
  bajo: 'bg-green-100 text-green-700',
  medio: 'bg-yellow-100 text-yellow-700',
  alto: 'bg-orange-100 text-orange-700',
  muy_alto: 'bg-red-100 text-red-700',
}

const STATUS_LABELS: Record<string, string> = {
  confirmar: 'Por confirmar',
  confirmado: 'Confirmado',
  preparado: 'Preparado',
  enviado: 'Enviado',
  incidencia: 'Incidencia',
  devolucion: 'Devolución',
  cancelado: 'Cancelado',
  entregado: 'Entregado',
}

export default function TarjetaPedido({ order, onSwipeLeft, onSwipeRight }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-150, 150], [-8, 8])
  const opacity = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5])

  const analysis = order.order_risk_analyses?.[0]
  const customer = order.customers
  const firstItem = order.order_items?.[0]
  const riskLevel = analysis?.risk_level ?? 'bajo'
  const riskScore = analysis?.risk_score ?? 0

  const city = order.shipping_address?.city ?? ''

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x < -80) {
      onSwipeLeft()
    } else if (info.offset.x > 80) {
      onSwipeRight()
    }
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      onClick={onSwipeRight}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer select-none"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900">
            {customer?.first_name} {customer?.last_name}
          </p>
          <p className="text-xs text-gray-400">#{order.order_number}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-900">{order.total_price}€</p>
          {analysis && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RISK_COLORS[riskLevel]}`}>
              {riskScore} · {riskLevel.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Producto */}
      {firstItem && (
        <p className="text-sm text-gray-700 mb-1">
          {firstItem.name}
          {order.order_items?.length > 1 && (
            <span className="text-gray-400"> +{order.order_items.length - 1} más</span>
          )}
        </p>
      )}

      {/* Ciudad */}
      {city && <p className="text-xs text-gray-400 mb-3">{city}</p>}

      {/* Summary IA */}
      {analysis?.summary && (
        <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">
          {analysis.summary}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {order.order_risk_tags?.slice(0, 3).map((t: any) => (
            <span key={t.tag} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
              {t.tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {STATUS_LABELS[order.status] ?? order.status}
        </span>
      </div>

      {/* Hint swipe */}
      <div className="flex justify-between mt-3 text-[10px] text-gray-300">
        <span>← omitir</span>
        <span>ver detalle →</span>
      </div>
    </motion.div>
  )
}