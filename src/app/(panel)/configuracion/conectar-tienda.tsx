'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function ConectarTiendaInner() {
  const [shop, setShop] = useState('')
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const error = searchParams.get('error')

  function handleConectar() {
    if (!shop) return
    const url = `/api/shopify/auth?shop=${encodeURIComponent(shop)}`
    window.location.href = url
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-sm font-medium text-gray-900 mb-1">Conectar tienda Shopify</h2>
      <p className="text-xs text-gray-500 mb-4">Introduce el dominio de tu tienda</p>

      {success === 'shopify_connected' && (
        <div className="mb-4 p-3 bg-teal-50 text-teal-700 text-sm rounded-lg">
          Tienda conectada correctamente
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          Error al conectar: {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={shop}
          onChange={e => setShop(e.target.value)}
          placeholder="tu-tienda.myshopify.com"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleConectar}
          disabled={!shop}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Conectar
        </button>
      </div>
    </div>
  )
}

export default function ConectarTienda() {
  return (
    <Suspense>
      <ConectarTiendaInner />
    </Suspense>
  )
}