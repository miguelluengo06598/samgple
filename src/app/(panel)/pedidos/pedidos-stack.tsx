'use client'

import { useState, useEffect } from 'react'
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
    // Calcular reaparición según estado
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
    if (newStatus === 'entregado' || newStatus === 'cancelado') {
      setOrders(prev => prev.filter(o => o.id !== orderId))
    } else {
      setOrders(prev => prev.filter(o => o.id !== orderId))
    }
    setSelectedOrder(null)
  }

  if (selectedOrder) {
    return (
      <DetallePedido
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 shrink-0" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-semibold text-gray-900">Pedidos</h1>
          <div className="flex gap-2">
            {highRisk > 0 && (
              <span className="text-[11px] font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                {highRisk} alto riesgo
              </span>
            )}
            <span className="text-[11px] font-medium bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              {filtered.length} pendientes
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-3">Desliza para gestionar</p>
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-2xl"
          style={{ background: '#f7f8fa', border: '0.5px solid rgba(0,0,0,0.06)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="4"/><path d="M11 11l2.5 2.5"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar cliente, teléfono, pedido..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Stack area */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-24 pt-4 relative">
        {filtered.length === 0 ? (
          <div className="text-center">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-lg font-semibold text-gray-800">Todo al día</p>
            <p className="text-sm text-gray-400 mt-1">No hay pedidos pendientes</p>
          </div>
        ) : (
          <div className="relative w-full" style={{ height: 420 }}>
            {/* Tarjetas de fondo */}
            {behindOrders.map((order, i) => (
              <div
                key={order.id}
                className="absolute inset-x-0"
                style={{
                  transform: `scale(${0.96 - i * 0.03}) translateY(${-12 - i * 10}px)`,
                  zIndex: 1 - i,
                  opacity: 0.7 - i * 0.2,
                  pointerEvents: 'none',
                }}
              >
                <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.06)', border: '0.5px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ height: 4, background: '#e5e7eb' }} />
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-lg font-semibold text-gray-300">
                          {order.customers?.first_name} {order.customers?.last_name}
                        </p>
                        <p className="text-xs text-gray-200">{order.order_number}</p>
                      </div>
                      <p className="text-xl font-semibold text-gray-200">{order.total_price}€</p>
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
                  className="absolute inset-x-0"
                  style={{ zIndex: 10 }}
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

        {/* Botones de acción */}
        {filtered.length > 0 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6">
            <button
              onClick={() => topOrder && handleSwipeLeft(topOrder.id, topOrder.status)}
              className="w-14 h-14 bg-white rounded-full flex items-center justify-c