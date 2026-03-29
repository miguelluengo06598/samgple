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

  function handleSwipeLeft(orderId: string) {
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  function handleSwipeRight(order: Order) {
    setSelectedOrder(order)
  }

  function handleStatusChange(orderId: string, newStatus: string) {
    setOrders(prev => prev.filter(o => o.id !== orderId))
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

  const sinAnalisis = filtered.filter(o => !o.order_risk_analyses?.[0]).length
  const riesgoAlto = filtered.filter(o => {
    const a = o.order_risk_analyses?.[0]
    return a && (a.risk_level === 'alto' || a.risk_level === 'muy_alto')
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <div className="flex gap-2">
            {riesgoAlto > 0 && (
              <span className="text-xs bg-red-50 text-red-600 font-medium px-2.5 py-1 rounded-full">
                🔴 {riesgoAlto} alto riesgo
              </span>
            )}
            {sinAnalisis > 0 && (
              <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-1 rounded-full">
                ⏳ {sinAnalisis} sin analizar
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-3">{filtered.length} pedidos pendientes</p>
        <input
          type="text"
          placeholder="🔍 Buscar cliente, teléfono, pedido..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Stack */}
      <div className="flex flex-col gap-3 p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎉</p>
            <p className="text-gray-700 font-semibold text-lg">Todo al día</p>
            <p className="text-gray-400 text-sm mt-1">No hay pedidos pendientes</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -120, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
              >
                <TarjetaPedido
                  order={order}
                  onSwipeLeft={() => handleSwipeLeft(order.id)}
                  onSwipeRight={() => handleSwipeRight(order)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}