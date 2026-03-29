'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

type Props = {
  order: any
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

const RISK: Record<string, { bar: string; badge: string; dot: string; label: string }> = {
  bajo:     { bar: '#2EC4B6', badge: '#e1f5ee', dot: '#2EC4B6', label: 'Bajo' },
  medio:    { bar: '#f59e0b', badge: '#fef3c7', dot: '#f59e0b', label: 'Medio' },
  alto:     { bar: '#f97316', badge: '#fff7ed', dot: '#f97316', label: 'Alto' },
  muy_alto: { bar: '#ef4444', badge: '#fef2f2', dot: '#ef4444', label: 'Crítico' },
}

export default function TarjetaPedido({ order, onSwipeLeft, onSwipeRight }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 160], [-8, 8])
  const opacity = useTransform(x, [-160, 0, 160], [0.5, 1, 0.5])
  const leftOpacity = useTransform(x, [-80, -20, 0], [1, 0, 0])
  const rightOpacity = useTransform(x, [0, 20, 80], [0, 0, 1])

  const analysis = Array.isArray(order.order_risk_analyses)
    ? order.order_risk_analyses[0]
    : order.order_risk_analyses

  const customer = order.customers
  const firstItem = order.order_items?.[0]
  const riskLevel = analysis?.risk_level ?? null
  const riskScore = analysis?.risk_score ?? null
  const risk = riskLevel ? RISK[riskLevel] : null
  const tags = order.order_risk_tags ?? []
  const city = order.shipping_address?.city ?? ''

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x < -80) onSwipeLeft()
    else if (info.offset.x > 80) onSwipeRight()
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Indicadores swipe */}
      <motion.div
        style={{ opacity: leftOpacity }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-red-500 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center pointer-events-none"
      >✕</motion.div>
      <motion.div
        style={{ opacity: rightOpacity }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-teal-500 text-white font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center pointer-events-none"
      >→</motion.div>

      <motion.div
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
        onClick={onSwipeRight}
        className="bg-white rounded-3xl overflow-hidden select-none cursor-grab touch-none"
        style={{
          x, rotate, opacity,
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
          border: '0.5px solid rgba(0,0,0,0.06)',
        }}
      >
        {/* Barra de riesgo */}
        {risk && (
          <div style={{ height: 4, background: risk.bar, width: '100%' }} />
        )}

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-lg font-semibold text-gray-900 truncate">
                {customer?.first_name} {customer?.last_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {order.order_number} · {city}
                {customer?.total_orders > 1 && (
                  <span className="ml-2 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full text-[10px]">
                    {customer.total_orders} pedidos
                  </span>
                )}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-semibold text-gray-900">{order.total_price}€</p>
              {risk && (
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mt-1"
                  style={{ background: risk.badge }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: risk.dot }}
                  />
                  <span style={{ color: risk.dot }}>{riskScore} · {risk.label}</span>
                </div>
              )}
            </div>
          </div>

          {/* Producto */}
          {firstItem && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-base shrink-0">
                📦
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-800 truncate">{firstItem.name}</p>
                {order.order_items?.length > 1 && (
                  <p className="text-xs text-gray-400">+{order.order_items.length - 1} más</p>
                )}
              </div>
            </div>
          )}

          {/* Summary IA */}
          {analysis?.summary && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-2xl px-3 py-2.5 mb-3 leading-relaxed">
              {analysis.summary}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 4).map((t: any) => (
                <span
                  key={t.tag}
                  className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-500"
                >
                  {t.tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Footer hint */}
          <div className="flex justify-between pt-3 border-t border-gray-50 text-[10px] text-gray-300">
            <span>← omitir (vuelve en 1h)</span>
            <span>ver detalle →</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}