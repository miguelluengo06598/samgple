'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Product = any
type Store = any

export default function TiendaClient({ stores, initialProducts }: { stores: Store[], initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    cost_price: '',
    shipping_cost: '',
    return_cost: '',
    price: '',
    image_url: '',
  })

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      cost_price: product.cost_price ?? '',
      shipping_cost: product.shipping_cost ?? '',
      return_cost: product.return_cost ?? '',
      price: product.price ?? '',
      image_url: product.image_url ?? '',
    })
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editing) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('productId', editing.id)
      const res = await fetch('/api/products/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setForm(p => ({ ...p, image_url: data.url }))
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      await fetch(`/api/products/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cost_price: parseFloat(form.cost_price) || 0,
          shipping_cost: parseFloat(form.shipping_cost) || 0,
          return_cost: parseFloat(form.return_cost) || 0,
          price: parseFloat(form.price) || 0,
          image_url: form.image_url || null,
        }),
      })
      setProducts(prev => prev.map(p =>
        p.id === editing.id ? { ...p, ...form, cost_price: parseFloat(form.cost_price) || 0, shipping_cost: parseFloat(form.shipping_cost) || 0, return_cost: parseFloat(form.return_cost) || 0, price: parseFloat(form.price) || 0 } : p
      ))
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const margin = editing
    ? ((parseFloat(form.price) || 0) - (parseFloat(form.cost_price) || 0) - (parseFloat(form.shipping_cost) || 0))
    : 0

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#ffffff', padding: '44px 20px 16px', borderBottom: '1px solid #cce8e6' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Tienda</h1>
        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>{products.length} productos sincronizados</p>

        {/* Tiendas conectadas */}
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Tiendas conectadas</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {stores.map(store => (
              <div key={store.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0fafa', border: '1px solid #cce8e6', borderRadius: 12, padding: '6px 12px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: store.status === 'active' ? '#2EC4B6' : '#94a3b8', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f766e' }}>{store.name ?? store.shopify_domain}</span>
                <span style={{ fontSize: 10, color: '#64748b' }}>{store.shopify_domain}</span>
              </div>
            ))}
            {stores.length === 0 && (
              <p style={{ fontSize: 13, color: '#94a3b8' }}>No hay tiendas conectadas</p>
            )}
          </div>
        </div>

        {/* Buscador */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f7f8fa', border: '1px solid #cce8e6', borderRadius: 14, padding: '9px 14px' }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="6.5" cy="6.5" r="4"/><path d="M11 11l2.5 2.5"/></svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 13, outline: 'none', flex: 1, color: '#0f172a' }}
          />
        </div>
      </div>

      {/* Grid productos */}
      <div style={{ padding: '16px 16px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 32, margin: '0 0 8px' }}>📦</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: 0 }}>Sin productos</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>Conecta una tienda Shopify</p>
          </div>
        )}
        {filtered.map(product => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => openEdit(product)}
            style={{ background: '#ffffff', borderRadius: 20, overflow: 'hidden', border: '1px solid #cce8e6', cursor: 'pointer' }}
          >
            {/* Imagen */}
            <div style={{ height: 100, background: product.image_url ? 'transparent' : '#f0fafa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {product.image_url
                ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 32 }}>📦</span>
              }
            </div>
            <div style={{ padding: '10px 12px 12px' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.name}</p>
              {product.sku && <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 8px' }}>SKU: {product.sku}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>Precio venta</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f766e' }}>{product.price ? `${product.price}€` : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>Coste producto</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{product.cost_price ? `${product.cost_price}€` : '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>Pedidos</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{product.total_orders ?? 0}</span>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {product.shipping_cost > 0 && (
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6', fontWeight: 600 }}>Envío {product.shipping_cost}€</span>
                )}
                {product.return_cost > 0 && (
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: '#fff7ed', color: '#9a3412', border: '1px solid #fed7aa', fontWeight: 600 }}>Dev. {product.return_cost}€</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal edición */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            onClick={e => { if (e.target === e.currentTarget) setEditing(null) }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ background: '#ffffff', width: '100%', maxWidth: 480, borderRadius: '28px 28px 0 0', padding: '0 0 32px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ width: 36, height: 4, background: '#e5e7eb', borderRadius: 2, margin: '12px auto 0' }} />

              {/* Header modal */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 12px', borderBottom: '1px solid #f0fafa' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editing.name}</p>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{editing.stores?.name ?? ''}</p>
                </div>
                <button onClick={() => setEditing(null)} style={{ width: 28, height: 28, background: '#f7f8fa', border: '1px solid #cce8e6', borderRadius: '50%', cursor: 'pointer', fontSize: 13, color: '#64748b' }}>✕</button>
              </div>

              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Foto */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Foto del producto</p>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 14, background: '#f0fafa', border: '1px solid #cce8e6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {form.image_url
                        ? <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: 24 }}>📦</span>
                      }
                    </div>
                    <label style={{ flex: 1, padding: '12px 16px', borderRadius: 14, border: '1.5px dashed #cce8e6', background: '#f0fafa', cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#0f766e', display: 'block' }}>
                      {uploading ? 'Subiendo...' : '+ Subir foto'}
                      <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>

                {/* Campos */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Costes y precio</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { key: 'price', label: 'Precio de venta' },
                      { key: 'cost_price', label: 'Coste producto' },
                      { key: 'shipping_cost', label: 'Coste envío (ida)' },
                      { key: 'return_cost', label: 'Coste devolución' },
                    ].map(field => (
                      <div key={field.key}>
                        <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px', fontWeight: 500 }}>{field.label}</p>
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f0fafa', border: '1px solid #cce8e6', borderRadius: 12, overflow: 'hidden' }}>
                          <input
                            type="number"
                            step="0.01"
                            value={(form as any)[field.key]}
                            onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                            placeholder="0.00"
                            style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 8px 10px 12px', fontSize: 13, fontWeight: 600, color: '#0f172a', outline: 'none', width: 0 }}
                          />
                          <span style={{ padding: '0 10px', fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>€</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Margen calculado */}
                <div style={{ background: margin >= 0 ? '#f0fdf4' : '#fef2f2', borderRadius: 14, padding: '12px 16px', border: `1px solid ${margin >= 0 ? '#bbf7d0' : '#fecaca'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: margin >= 0 ? '#0f766e' : '#991b1b' }}>Margen estimado por pedido</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: margin >= 0 ? '#2EC4B6' : '#dc2626' }}>
                    {margin >= 0 ? '+' : ''}{margin.toFixed(2)}€
                  </span>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ width: '100%', padding: 16, borderRadius: 16, fontSize: 14, fontWeight: 700, border: 'none', background: '#2EC4B6', color: '#ffffff', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}