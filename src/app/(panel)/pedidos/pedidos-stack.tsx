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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-3">
        <h1 className="text-xl font-semibold text-gray-900">Pedidos</h1>
        <p className="text-xs text-gray-400 mt-0.5">{filtered.length} pendientes</p>
        <input
          type="text"
          placeholder="Buscar cliente, teléfono, pedido..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mt-3 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Stack */}
      <div className="flex flex-col gap-3 p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-gray-500 font-medium">Todo al día</p>
            <p className="text-gray-400 text-sm mt-1">No hay pedidos pendientes</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.03 }}
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