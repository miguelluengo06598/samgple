'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TarjetaPedido from './tarjeta-pedido'
import DetallePedido from './detalle-pedido'

type Order = any

export default function PedidosStack({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [search, setSearch] = useState('')

  const filtered = search
    ? orders.filter(o =>
        o.order_number?.includes(search) ||
        o.customers?.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.customers?.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.phone?.includes(search)
      )
    : orders

  const topOrder = filtered[0] ?? null
  const behindOrders = filtered.slice(1, 3)

  const highRisk = orders.filter(o => {
    const a = o.order_risk_analyses?.[0]
    return a && (a.risk_level === 'alto' || a.risk_level === 'muy_alto')
  }).length

  async function handleSwipeLeft(orderId: string, status: string) {
    const hours = status === 'confirmar' ? 1 : 3
    const next = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, next_reappear_at: next }),
    })
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  function handleSwipeRight(order: Order) {
    setSelectedOrder(order)
  }

  function handleStatusChange(orderId: string, newStatus: string) {
    setOrders(prev => prev.filter(o => o.id !== orderId))
    setSelectedOrder(null)
  }

  return (
    <div style={{ position: 'relative', height: '100vh', background: '#f0fafa', maxWidth: 480, margin: '0 auto', overflow: 'hidden' }}>

      {/* ── STACK ── */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ background: '#ffffff', padding: '44px 20px 16px', borderBottom: '1px solid #cce8e6', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', margin: 0 }}>Pedidos</h1>
            <div style={{ display: 'flex', gap: 6 }}>
              {highRisk > 0 && (
                <span style={{ fontSize: 11, fontWeight: 500, background: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: 20 }}>
                  {highRisk} alto riesgo
                </span>
              )}
              <span style={{ fontSize: 11, fontWeight: 500, background: '#f0fafa', color: '#0f766e', padding: '3px 10px', borderRadius: 20, border: '1px solid #cce8e6' }}>
                {filtered.length} pendientes
              </span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>Desliza para gestionar</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f8fa', border: '1px solid #cce8e6', borderRadius: 14, padding: '9px 14px' }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <circle cx="6.5" cy="6.5" r="4"/><path d="M11 11l2.5 2.5"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar cliente, teléfono, pedido..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', fontSize: 13, outline: 'none', flex: 1, color: '#0f172a' }}
            />
          </div>
        </div>

        {/* Stack area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 20px 100px', position: 'relative' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 48, margin: '0 0 12px' }}>🎉</p>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#0f172a', margin: 0 }}>Todo al día</p>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>No hay pedidos pendientes</p>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: 460 }}>
              {/* Tarjetas de fondo */}
              {behindOrders.map((order, i) => (
                <div
                  key={order.id}
                  style={{
                    position: 'absolute', inset: '0',
                    transform: `scale(${0.96 - i * 0.03}) translateY(${-12 - i * 10}px)`,
                    zIndex: 1 - i,
                    opacity: 0.7 - i * 0.2,
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ background: '#fff', borderRadius: 28, overflow: 'hidden', boxShadow: '0 2px 20px rgba(46,196,182,0.1)', border: '1px solid #cce8e6' }}>
                    <div style={{ height: 4, background: '#e2f0ef' }} />
                    <div style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 16, fontWeight: 500, color: '#d1d5db', margin: 0 }}>
                          {order.customers?.first_name} {order.customers?.last_name}
                        </p>
                        <p style={{ fontSize: 17, fontWeight: 500, color: '#d1d5db', margin: 0 }}>{order.total_price}€</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tarjeta principal */}
              {topOrder && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={topOrder.id}
                    style={{ position: 'absolute', inset: 0, zIndex: 10 }}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <TarjetaPedido
                      order={topOrder}
                      onSwipeLeft={() => handleSwipeLeft(topOrder.id, topOrder.status)}
                      onSwipeRight={() => handleSwipeRight(topOrder)}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}

          {/* Botones acción */}
          {filtered.length > 0 && (
            <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
              <button
                onClick={() => topOrder && handleSwipeLeft(topOrder.id, topOrder.status)}
                style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', border: '1px solid #cce8e6', cursor: 'pointer', fontSize: 18, color: '#dc2626', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >✕</button>
              <button
                onClick={() => topOrder && handleSwipeRight(topOrder)}
                style={{ width: 60, height: 60, borderRadius: '50%', background: '#2EC4B6', border: 'none', cursor: 'pointer', fontSize: 22, color: '#fff', boxShadow: '0 4px 20px rgba(46,196,182,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >→</button>
              <button
                onClick={() => topOrder && handleStatusChange(topOrder.id, 'confirmado')}
                style={{ width: 52, height: 52, borderRadius: '50%', background: '#80ED99', border: 'none', cursor: 'pointer', fontSize: 18, color: '#166534', boxShadow: '0 4px 16px rgba(128,237,153,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >✓</button>
            </div>
          )}
        </div>
      </div>

      {/* ── SHEET OVERLAY — sube desde abajo ── */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            {/* Fondo oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50, maxHeight: '92%', borderRadius: '28px 28px 0 0', overflow: 'hidden', background: '#f0fafa' }}
            >
              {/* Handle */}
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4, background: '#fff', borderRadius: '28px 28px 0 0' }}>
                <div style={{ width: 36, height: 4, background: '#cce8e6', borderRadius: 2 }} />
              </div>

              <DetallePedido
                order={selectedOrder}
                onBack={() => setSelectedOrder(null)}
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  )
}