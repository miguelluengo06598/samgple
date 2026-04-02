'use client'

import { useState, useRef } from 'react'

const F = 'system-ui,-apple-system,sans-serif'

type Product = any
type Store   = any

function Skeleton({ w = '100%', h = 14, r = 8 }: { w?: string | number; h?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8f0fe 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
}

function MarginBar({ price, cost, shipping }: { price: number; cost: number; shipping: number }) {
  const margin = price - cost - shipping
  const pct    = price > 0 ? Math.max(0, Math.min(100, (margin / price) * 100)) : 0
  const good   = margin >= 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: '#64748b' }}>Margen</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: good ? '#0f766e' : '#dc2626' }}>
          {good ? '+' : ''}{margin.toFixed(2)}€
        </span>
      </div>
      <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 2, background: good ? '#2EC4B6' : '#ef4444', width: `${pct}%`, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

export default function TiendaClient({ stores, initialProducts }: { stores: Store[]; initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editing, setEditing]   = useState<Product | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [search, setSearch]     = useState('')
  const [activeTab, setActiveTab] = useState<'tienda' | 'inventario'>('tienda')
  const [form, setForm]         = useState({ cost_price: '', shipping_cost: '', return_cost: '', price: '', image_url: '' })
  const storeScrollRef          = useRef<HTMLDivElement>(null)
  const prodScrollRef           = useRef<HTMLDivElement>(null)

  const filtered = products.filter(p =>
    !search ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.sku?.toLowerCase().includes(search.toLowerCase())
  )

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      cost_price:    String(product.cost_price    ?? ''),
      shipping_cost: String(product.shipping_cost ?? ''),
      return_cost:   String(product.return_cost   ?? ''),
      price:         String(product.price         ?? ''),
      image_url:     product.image_url            ?? '',
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
      const res  = await fetch('/api/products/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setForm(p => ({ ...p, image_url: data.url }))
    } finally { setUploading(false) }
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const body = {
        cost_price:    parseFloat(form.cost_price)    || 0,
        shipping_cost: parseFloat(form.shipping_cost) || 0,
        return_cost:   parseFloat(form.return_cost)   || 0,
        price:         parseFloat(form.price)         || 0,
        image_url:     form.image_url || null,
      }
      await fetch(`/api/products/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...body } : p))
      setEditing(null)
    } finally { setSaving(false) }
  }

  const margin = (parseFloat(form.price) || 0) - (parseFloat(form.cost_price) || 0) - (parseFloat(form.shipping_cost) || 0)

  // Stats inventario
  const totalProducts   = products.length
  const withCost        = products.filter(p => p.cost_price > 0).length
  const avgMargin       = products.length > 0
    ? products.reduce((acc, p) => acc + ((p.price || 0) - (p.cost_price || 0) - (p.shipping_cost || 0)), 0) / products.length
    : 0
  const totalOrders     = products.reduce((acc, p) => acc + (p.total_orders || 0), 0)

  return (
    <>
      <style>{`
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp  { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        .card-hover { transition:all 0.15s ease; cursor:pointer; }
        .card-hover:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,0.09)!important; }
        .card-hover:active { transform:scale(0.97); }
        .tab-btn { transition:all 0.15s ease; }
        .scroll-x { overflow-x:auto; scrollbar-width:none; }
        .scroll-x::-webkit-scrollbar { display:none }
        .btn-act { transition:all 0.12s ease; }
        .btn-act:hover { opacity:0.85; transform:translateY(-1px); }
        .inp-field { transition:border-color 0.15s; }
        .inp-field:focus { border-color:#2EC4B6!important; outline:none; }
        @media(min-width:640px){
          .prod-grid { grid-template-columns:repeat(3,1fr)!important; }
          .inv-grid  { grid-template-columns:repeat(2,1fr)!important; }
          .stats-grid{ grid-template-columns:repeat(4,1fr)!important; }
          .modal-inner{ border-radius:24px!important; margin:auto!important; max-height:85vh!important; }
          .modal-wrap { align-items:center!important; }
        }
        @media(min-width:900px){
          .prod-grid { grid-template-columns:repeat(4,1fr)!important; }
        }
      `}</style>

      {/* Modal edición */}
      {editing && (
        <div className="modal-wrap" onClick={e => { if (e.target === e.currentTarget) setEditing(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.15s ease' }}>
          <div className="modal-inner"
            style={{ background: '#fff', width: '100%', maxWidth: 520, borderRadius: '24px 24px 0 0', padding: '0 0 32px', maxHeight: '88vh', overflowY: 'auto', animation: 'slideUp 0.2s ease', fontFamily: F }}>

            {/* Handle */}
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '12px auto 0' }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 14px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: editing.image_url ? 'transparent' : '#f0fdf4', border: '1.5px solid #f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {editing.image_url
                  ? <img src={editing.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{editing.name}</p>
                {editing.sku && <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>SKU: {editing.sku}</p>}
              </div>
              <button onClick={() => setEditing(null)}
                style={{ width: 32, height: 32, borderRadius: 10, border: '1.5px solid #f1f5f9', background: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Foto */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Imagen del producto</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 16, background: '#f8fafc', border: '1.5px solid #f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {form.image_url
                      ? <img src={form.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    }
                  </div>
                  <label className="btn-act"
                    style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1.5px dashed #e2e8f0', background: '#f8fafc', cursor: 'pointer', textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#2EC4B6', display: 'block' }}>
                    {uploading ? 'Subiendo...' : '+ Subir imagen'}
                    <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              {/* Costes */}
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Costes y precio</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { key: 'price',         label: 'Precio de venta', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
                    { key: 'cost_price',    label: 'Coste producto',  color: '#0f172a', bg: '#f8fafc', border: '#f1f5f9' },
                    { key: 'shipping_cost', label: 'Envío (ida)',      color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
                    { key: 'return_cost',   label: 'Devolución',       color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
                  ].map(field => (
                    <div key={field.key}>
                      <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 5px', fontWeight: 600 }}>{field.label}</p>
                      <div style={{ display: 'flex', alignItems: 'center', background: field.bg, border: `1.5px solid ${field.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s' }}>
                        <input type="number" step="0.01"
                          value={(form as any)[field.key]}
                          onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                          placeholder="0.00"
                          className="inp-field"
                          style={{ flex: 1, border: 'none', background: 'transparent', padding: '10px 8px 10px 12px', fontSize: 14, fontWeight: 700, color: field.color, outline: 'none', width: 0, fontFamily: F }}
                        />
                        <span style={{ padding: '0 10px', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>€</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Margen */}
              <div style={{ background: margin >= 0 ? '#f0fdf4' : '#fef2f2', borderRadius: 16, padding: '14px 16px', border: `1.5px solid ${margin >= 0 ? '#bbf7d0' : '#fecaca'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: margin >= 0 ? '#0f766e' : '#b91c1c', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Margen estimado</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Por pedido confirmado</p>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 800, color: margin >= 0 ? '#2EC4B6' : '#ef4444', margin: 0, letterSpacing: '-1px' }}>
                    {margin >= 0 ? '+' : ''}{margin.toFixed(2)}€
                  </p>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.5)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: margin >= 0 ? '#2EC4B6' : '#ef4444', width: `${(parseFloat(form.price) || 0) > 0 ? Math.max(0, Math.min(100, (margin / (parseFloat(form.price) || 1)) * 100)) : 0}%`, transition: 'width 0.4s ease' }} />
                </div>
              </div>

              <button onClick={handleSave} disabled={saving} className="btn-act"
                style={{ width: '100%', padding: '15px', borderRadius: 16, fontSize: 14, fontWeight: 800, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {saving ? (
                  <>
                    <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px) 0', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Tienda</h1>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>{totalProducts} productos · {stores.length} tienda{stores.length !== 1 ? 's' : ''} conectada{stores.length !== 1 ? 's' : ''}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f766e' }}>Shopify</span>
              </div>
            </div>

            {/* Búsqueda */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, marginBottom: 12 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto o SKU..."
                style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }} />
              {search && (
                <button onClick={() => setSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {(['tienda', 'inventario'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className="tab-btn"
                  style={{ padding: '8px 20px', borderRadius: '12px 12px 0 0', fontSize: 13, fontWeight: 700, border: 'none', borderBottom: activeTab === tab ? '2px solid #2EC4B6' : '2px solid transparent', background: activeTab === tab ? '#f0fdf4' : 'transparent', color: activeTab === tab ? '#0f766e' : '#94a3b8', cursor: 'pointer', textTransform: 'capitalize', fontFamily: F }}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40 }}>

          {/* ── TAB TIENDA ── */}
          {activeTab === 'tienda' && (
            <div style={{ animation: 'fadeUp 0.2s ease both' }}>

              {/* Tiendas — carrusel */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Tiendas conectadas</p>
                {stores.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1.5px dashed #e2e8f0', textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 12px' }}>No hay tiendas conectadas todavía</p>
                    <a href="/configuracion/tiendas"
                      style={{ fontSize: 13, fontWeight: 700, padding: '9px 20px', borderRadius: 12, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>
                      Conectar Shopify →
                    </a>
                  </div>
                ) : (
                  <div className="scroll-x" style={{ display: 'flex', gap: 10 }}>
                    {stores.map((store, i) => (
                      <div key={store.id} className="card-hover"
                        style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', border: '1.5px solid #f1f5f9', flexShrink: 0, width: 'clamp(200px,50vw,240px)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: `fadeUp 0.2s ease ${i * 0.05}s both` }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: store.status === 'active' ? '#f0fdf4' : '#f1f5f9', color: store.status === 'active' ? '#0f766e' : '#94a3b8', border: `1px solid ${store.status === 'active' ? '#bbf7d0' : '#e2e8f0'}` }}>
                            {store.status === 'active' ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {store.name ?? store.shopify_domain}
                        </p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {store.shopify_domain}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                          <span>{products.length} productos</span>
                          <span>{totalOrders} pedidos</span>
                        </div>
                      </div>
                    ))}
                    <a href="/configuracion/tiendas" className="card-hover"
                      style={{ background: '#fff', borderRadius: 18, padding: '16px 18px', border: '1.5px dashed #e2e8f0', flexShrink: 0, width: 'clamp(160px,40vw,180px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', color: '#94a3b8' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: '#f8fafc', border: '1.5px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Añadir tienda</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Productos — grid */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Productos ({filtered.length})</p>
                </div>

                {filtered.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: 20, padding: '48px 24px', textAlign: 'center', border: '1.5px solid #f1f5f9' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Sin productos</p>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Conecta una tienda Shopify para sincronizar productos</p>
                  </div>
                ) : (
                  <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                    {filtered.map((product, i) => {
                      const margin = (product.price || 0) - (product.cost_price || 0) - (product.shipping_cost || 0)
                      const hasCosts = product.cost_price > 0
                      return (
                        <div key={product.id} className="card-hover"
                          onClick={() => openEdit(product)}
                          style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', animation: `fadeUp 0.2s ease ${Math.min(i, 8) * 0.03}s both` }}>

                          {/* Imagen */}
                          <div style={{ height: 'clamp(100px,20vw,130px)', background: product.image_url ? 'transparent' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                            {product.image_url
                              ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                            }
                            {product.total_orders > 0 && (
                              <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(15,23,42,0.7)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                                {product.total_orders} pedidos
                              </div>
                            )}
                          </div>

                          <div style={{ padding: '12px 14px 14px' }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {product.name}
                            </p>
                            {product.sku && <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 10px' }}>SKU: {product.sku}</p>}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <span style={{ fontSize: 10, color: '#94a3b8' }}>Precio</span>
                              <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
                                {product.price ? `${Number(product.price).toFixed(2)}€` : '—'}
                              </span>
                            </div>

                            {hasCosts
                              ? <MarginBar price={product.price || 0} cost={product.cost_price || 0} shipping={product.shipping_cost || 0} />
                              : <div style={{ fontSize: 10, color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '4px 0', background: '#f8fafc', borderRadius: 8 }}>Toca para añadir costes</div>
                            }
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB INVENTARIO ── */}
          {activeTab === 'inventario' && (
            <div style={{ animation: 'fadeUp 0.2s ease both' }}>

              {/* Stats */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
                {[
                  { label: 'Productos',      value: totalProducts,          color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' },
                  { label: 'Con costes',     value: withCost,               color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
                  { label: 'Margen medio',   value: `${avgMargin.toFixed(2)}€`, color: avgMargin >= 0 ? '#0f766e' : '#dc2626', bg: avgMargin >= 0 ? '#f0fdf4' : '#fef2f2', border: avgMargin >= 0 ? '#bbf7d0' : '#fecaca', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                  { label: 'Total pedidos',  value: totalOrders,            color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, borderRadius: 18, padding: 'clamp(14px,3vw,18px)', border: `1.5px solid ${s.border}`, animation: `fadeUp 0.2s ease ${i * 0.04}s both` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, opacity: 0.7 }}>{s.label}</p>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round"><path d={s.icon}/></svg>
                    </div>
                    <p style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: s.color, margin: 0, letterSpacing: '-0.5px' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Lista inventario */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.length === 0 ? (
                  <div style={{ background: '#fff', borderRadius: 20, padding: '48px 24px', textAlign: 'center', border: '1.5px solid #f1f5f9' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Sin productos</p>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Conecta una tienda para ver el inventario</p>
                  </div>
                ) : filtered.map((product, i) => {
                  const margin    = (product.price || 0) - (product.cost_price || 0) - (product.shipping_cost || 0)
                  const marginPct = (product.price || 0) > 0 ? (margin / product.price) * 100 : 0
                  const good      = margin >= 0
                  return (
                    <div key={product.id} className="card-hover"
                      onClick={() => openEdit(product)}
                      style={{ background: '#fff', borderRadius: 18, padding: 'clamp(14px,3vw,18px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14, animation: `fadeUp 0.2s ease ${Math.min(i, 8) * 0.03}s both` }}>

                      {/* Imagen */}
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: '#f8fafc', border: '1.5px solid #f1f5f9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {product.image_url
                          ? <img src={product.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                        }
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          {product.sku && <span style={{ fontSize: 10, color: '#94a3b8' }}>SKU: {product.sku}</span>}
                          {product.total_orders > 0 && <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>{product.total_orders} pedidos</span>}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <div style={{ height: 4, background: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 2, background: good ? '#2EC4B6' : '#ef4444', width: `${Math.max(0, Math.min(100, marginPct))}%`, transition: 'width 0.4s ease' }} />
                          </div>
                        </div>
                      </div>

                      {/* Precios */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.3px' }}>
                          {product.price ? `${Number(product.price).toFixed(2)}€` : '—'}
                        </p>
                        <p style={{ fontSize: 11, fontWeight: 700, color: good ? '#0f766e' : '#dc2626', margin: 0 }}>
                          {product.cost_price > 0 ? `${good ? '+' : ''}${margin.toFixed(2)}€` : 'Sin costes'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}