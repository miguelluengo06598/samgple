'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

type Props = {
  order: any
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

const GRADIENT: Record<string, string> = {
  bajo:     'linear-gradient(135deg, #2EC4B6 0%, #1D9E75 60%, #0f6e56 100%)',
  medio:    'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #1e3a5f 100%)',
  alto:     'linear-gradient(135deg, #f97316 0%, #ea580c 60%, #9a3412 100%)',
  muy_alto: 'linear-gradient(135deg, #ef4444 0%, #dc2626 60%, #991b1b 100%)',
  default:  'linear-gradient(135deg, #2EC4B6 0%, #1D9E75 60%, #0f6e56 100%)',
}

const SCORE_COLOR: Record<string, string> = {
  bajo: '#80ED99', medio: '#7dd3fc', alto: '#fdba74', muy_alto: '#fca5a5',
}

export default function TarjetaPedido({ order, onSwipeLeft, onSwipeRight }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-160, 160], [-6, 6])
  const opacity = useTransform(x, [-160, 0, 160], [0.6, 1, 0.6])
  const leftOpacity = useTransform(x, [-80, -20, 0], [1, 0, 0])
  const rightOpacity = useTransform(x, [0, 20, 80], [0, 0, 1])

  const analysis = Array.isArray(order.order_risk_analyses)
    ? order.order_risk_analyses[0]
    : order.order_risk_analyses

  const customer = order.customers
  const firstItem = order.order_items?.[0]
  const riskLevel = analysis?.risk_level ?? 'default'
  const riskScore = analysis?.risk_score ?? null
  const tags = order.order_risk_tags ?? []
  const city = order.shipping_address?.city ?? ''
  const gradient = GRADIENT[riskLevel] ?? GRADIENT.default
  const scoreColor = SCORE_COLOR[riskLevel] ?? '#80ED99'

  function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x < -80) onSwipeLeft()
    else if (info.offset.x > 80) onSwipeRight()
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <motion.div style={{ opacity: leftOpacity }} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black bg-opacity-20 flex items-center justify-center text-white font-bold text-lg pointer-events-none">✕</motion.div>
      <motion.div style={{ opacity: rightOpacity }} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg pointer-events-none" >→</motion.div>

      <motion.div
        style={{ x, rotate, opacity, boxShadow: '0 12px 48px rgba(46,196,182,0.25)' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.02 }}
        onClick={onSwipeRight}
        className="rounded-3xl overflow-hidden select-none cursor-grab touch-none"
      >
        {/* Parte superior con gradiente */}
        <div style={{ background: gradient, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <p style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', margin: 0 }}>
                {customer?.first_name} {customer?.last_name}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '3px 0 0' }}>
                {order.order_number} · {city}
                {customer?.total_orders > 1 && ` · ${customer.total_orders} pedidos`}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 20, fontWeight: 600, color: '#ffffff', margin: 0 }}>{order.total_price}€</p>
              {riskScore !== null && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 4, padding: '3px 9px', borderRadius: 20, background: 'rgba(0,0,0,0.2)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: scoreColor, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor }}>{riskScore} · {riskLevel.replace('_', ' ')}</span>
                </div>
              )}
            </div>
          </div>

          {firstItem && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>📦</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#ffffff', margin: 0 }}>{firstItem.name}{order.order_items?.length > 1 ? ` +${order.order_items.length - 1}` : ''}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: '2px 0 0' }}>{city}</p>
              </div>
            </div>
          )}

          {analysis?.summary && (
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.18)', borderRadius: 12, padding: '8px 11px', margin: '0 0 10px', lineHeight: 1.5 }}>
              {analysis.summary}
            </p>
          )}

          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {tags.slice(0, 4).map((t: any) => (
                <span key={t.tag} style={{ fontSize: 10, padding: '4px 9px', borderRadius: 20, background: 'rgba(0,0,0,0.25)', color: '#ffffff', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)' }}>
                  {t.tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer blanco */}
        <div style={{ background: '#ffffff', padding: '12px 20px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#94a3b8' }}>← omitir · → ver detalle</span>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6' }}>
            {order.status}
          </span>
        </div>
      </motion.div>
    </div>
  )
}