'use client'

import { useState, useEffect, useCallback } from 'react'

const F = "'DM Sans', system-ui, sans-serif"

const PACK_COLORS = [
  { label: 'Teal',    value: '#2EC4B6' },
  { label: 'Azul',    value: '#3b82f6' },
  { label: 'Verde',   value: '#0f766e' },
  { label: 'Violeta', value: '#7c3aed' },
  { label: 'Rosa',    value: '#ec4899' },
  { label: 'Naranja', value: '#ea580c' },
  { label: 'Índigo',  value: '#4f46e5' },
]

const EMPTY_PACK = {
  name: '', tokens: '', price_eur: '', description: '',
  features: '', badge: '', color: '#2EC4B6',
  variant_id: '', lemon_url: '', is_featured: false, sort_order: '0',
}

function parseFeaturesStr(str: string): string[] {
  return str.split('\n').map(s => s.trim()).filter(Boolean)
}

function Spinner({ color = '#fff' }: { color?: string }) {
  return <div style={{ width: 13, height: 13, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: '50%', animation: 'adm-spin .7s linear infinite', flexShrink: 0 }} />
}

// ── PackForm FUERA del componente principal para evitar pérdida de foco ──
function PackForm({ pack, onChange, onSave, onCancel, saving, isEdit }: {
  pack: any
  onChange: (p: any) => void
  onSave: () => void
  onCancel: () => void
  saving: boolean
  isEdit?: boolean
}) {
  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 11,
    border: '1.5px solid #e2e8f0', background: '#f8fafc',
    fontSize: 13, outline: 'none', color: '#0f172a',
    boxSizing: 'border-box', fontFamily: F,
    transition: 'border-color .15s, box-shadow .15s',
  }

  const featuresStr = Array.isArray(pack.features) ? pack.features.join('\n') : (pack.features ?? '')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>

      {/* Columna 1: Info básica + Lemon Squeezy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#f8fafc', borderRadius: 18, padding: 20, border: '1.5px solid #f1f5f9' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 14px' }}>Info básica</p>
          {([
            { label: 'Nombre del pack',   key: 'name',       ph: 'Pack Pro',   type: 'text'   },
            { label: 'Tokens incluidos',  key: 'tokens',     ph: '50',         type: 'number' },
            { label: 'Precio (€)',        key: 'price_eur',  ph: '45',         type: 'number' },
            { label: 'Orden aparición',   key: 'sort_order', ph: '0',          type: 'number' },
          ] as const).map(f => (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5, display: 'block' }}>{f.label}</label>
              <input style={inp} type={f.type} placeholder={f.ph}
                value={pack[f.key] ?? ''}
                onChange={e => onChange({ ...pack, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        <div style={{ background: '#f8fafc', borderRadius: 18, padding: 20, border: '1.5px solid #f1f5f9' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 14px' }}>🍋 Lemon Squeezy</p>
          {([
            { label: 'Variant ID',      key: 'variant_id', ph: '1499065' },
            { label: 'URL de checkout', key: 'lemon_url',  ph: 'https://samgple.lemonsqueezy.com/buy/...' },
          ] as const).map(f => (
            <div key={f.key} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5, display: 'block' }}>{f.label}</label>
              <input style={inp} placeholder={f.ph}
                value={pack[f.key] ?? ''}
                onChange={e => onChange({ ...pack, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Columna 2: Web pública */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#f8fafc', borderRadius: 18, padding: 20, border: '1.5px solid #f1f5f9' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 14px' }}>🌐 Página de precios</p>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5, display: 'block' }}>Descripción corta</label>
            <textarea style={{ ...inp, minHeight: 70, resize: 'vertical' }}
              placeholder="El preferido por tiendas con volumen medio-alto..."
              value={pack.description ?? ''}
              onChange={e => onChange({ ...pack, description: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5, display: 'block' }}>Features (una por línea)</label>
            <textarea style={{ ...inp, minHeight: 110, resize: 'vertical', fontFamily: 'monospace' }}
              placeholder={'Análisis IA por pedido\nLlamadas automáticas\nInformes semanales'}
              value={featuresStr}
              onChange={e => onChange({ ...pack, features: e.target.value })}
            />
            <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>Cada línea = una feature en la tarjeta</p>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5, display: 'block' }}>Badge (opcional)</label>
            <input style={inp} placeholder="Más popular · Mejor precio"
              value={pack.badge ?? ''}
              onChange={e => onChange({ ...pack, badge: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8, display: 'block' }}>Color del pack</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {PACK_COLORS.map(c => (
                <button key={c.value} onClick={() => onChange({ ...pack, color: c.value })} title={c.label}
                  style={{ width: 28, height: 28, borderRadius: '50%', border: pack.color === c.value ? `3px solid ${c.value}` : '2px solid #e2e8f0', background: c.value, cursor: 'pointer', outline: pack.color === c.value ? `2px solid ${c.value}40` : 'none', outlineOffset: 2, transition: 'all .15s' }}
                />
              ))}
              <input type="color" value={pack.color ?? '#2EC4B6'} onChange={e => onChange({ ...pack, color: e.target.value })}
                style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #e2e8f0', cursor: 'pointer', padding: 0 }} />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 12px', borderRadius: 12, background: pack.is_featured ? '#f0fdf4' : '#f8fafc', border: `1.5px solid ${pack.is_featured ? '#bbf7d0' : '#f1f5f9'}`, transition: 'all .15s' }}>
            <input type="checkbox" checked={!!pack.is_featured} onChange={e => onChange({ ...pack, is_featured: e.target.checked })}
              style={{ width: 16, height: 16, accentColor: '#2EC4B6', cursor: 'pointer' }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Pack destacado</p>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Efecto "beam" en la web</p>
            </div>
          </label>
        </div>
      </div>

      {/* Columna 3: Preview */}
      <div>
        <div style={{ background: '#f8fafc', borderRadius: 18, padding: 20, border: '1.5px solid #f1f5f9' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 14px' }}>👁 Preview tarjeta web</p>
          <div style={{ borderRadius: 18, padding: 20, background: pack.is_featured ? '#0f172a' : '#fff', border: pack.is_featured ? 'none' : `1.5px solid ${pack.color ?? '#e2e8f0'}22`, boxShadow: pack.is_featured ? '0 12px 32px rgba(15,23,42,.25)' : '0 4px 16px rgba(0,0,0,.06)', position: 'relative', overflow: 'hidden' }}>
            {pack.badge && (
              <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 9, fontWeight: 800, padding: '3px 9px', borderRadius: 20, background: pack.color ?? '#2EC4B6', color: '#fff' }}>{pack.badge}</div>
            )}
            <p style={{ fontSize: 11, fontWeight: 700, color: pack.is_featured ? 'rgba(255,255,255,.35)' : '#94a3b8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '.08em' }}>{pack.name || 'Nombre'}</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: pack.is_featured ? '#fff' : '#0f172a', letterSpacing: '-2px', lineHeight: 1 }}>{pack.price_eur || '0'}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: pack.is_featured ? 'rgba(255,255,255,.4)' : '#64748b', marginBottom: 4 }}>€</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, background: `${pack.color ?? '#2EC4B6'}20`, border: `1px solid ${pack.color ?? '#2EC4B6'}35`, marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: pack.color ?? '#2EC4B6' }}>{pack.tokens || '0'} tokens</span>
            </div>
            {pack.description && <p style={{ fontSize: 11, color: pack.is_featured ? 'rgba(255,255,255,.4)' : '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>{pack.description}</p>}
            {parseFeaturesStr(featuresStr).slice(0, 4).map((f, fi) => (
              <div key={fi} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: `${pack.color ?? '#2EC4B6'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={pack.color ?? '#2EC4B6'} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{ fontSize: 11, color: pack.is_featured ? 'rgba(255,255,255,.6)' : '#475569' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
        <button onClick={onCancel}
          style={{ padding: '10px 20px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: F }}>
          Cancelar
        </button>
        <button onClick={onSave} disabled={saving || !pack.name || !pack.tokens || !pack.price_eur}
          style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: `linear-gradient(135deg,${pack.color ?? '#2EC4B6'},${pack.color ?? '#2EC4B6'}bb)`, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: F, display: 'flex', alignItems: 'center', gap: 7, opacity: (!pack.name || !pack.tokens || !pack.price_eur) ? .5 : 1 }}>
          {saving ? <Spinner /> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
          {isEdit ? 'Guardar cambios' : 'Crear pack'}
        </button>
      </div>
    </div>
  )
}

// ── Componente principal ──
export default function AdminPacksPage() {
  const [packs, setPacks]         = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [tab, setTab]             = useState<'list' | 'create' | 'edit'>('list')
  const [newPack, setNewPack]     = useState(EMPTY_PACK)
  const [editingPack, setEditingPack] = useState<any>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/packs')
    const data = await res.json()
    setPacks(data.packs ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate() {
    if (!newPack.name || !newPack.tokens || !newPack.price_eur) return
    setSaving(true)
    try {
      await fetch('/api/admin/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        newPack.name,
          tokens:      parseFloat(newPack.tokens),
          price_eur:   parseFloat(newPack.price_eur),
          description: newPack.description || null,
          features:    parseFeaturesStr(newPack.features),
          badge:       newPack.badge || null,
          color:       newPack.color,
          variant_id:  newPack.variant_id || null,
          lemon_url:   newPack.lemon_url || null,
          is_featured: newPack.is_featured,
          sort_order:  parseInt(newPack.sort_order) || 0,
          active:      true,
        }),
      })
      setNewPack(EMPTY_PACK)
      setTab('list')
      await load()
    } finally { setSaving(false) }
  }

  async function handleUpdate() {
    if (!editingPack) return
    setSaving(true)
    try {
      await fetch('/api/admin/packs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:          editingPack.id,
          name:        editingPack.name,
          tokens:      parseFloat(editingPack.tokens),
          price_eur:   parseFloat(editingPack.price_eur),
          description: editingPack.description || null,
          features:    Array.isArray(editingPack.features) ? editingPack.features : parseFeaturesStr(editingPack.features ?? ''),
          badge:       editingPack.badge || null,
          color:       editingPack.color,
          variant_id:  editingPack.variant_id || null,
          lemon_url:   editingPack.lemon_url || null,
          is_featured: editingPack.is_featured,
          sort_order:  parseInt(editingPack.sort_order) || 0,
        }),
      })
      setTab('list')
      setEditingPack(null)
      await load()
    } finally { setSaving(false) }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch('/api/admin/packs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    })
    setPacks(prev => prev.map(p => p.id === id ? { ...p, active: !active } : p))
  }

  return (
    <>
      <style>{`
        @keyframes adm-spin  { to{transform:rotate(360deg)} }
        @keyframes adm-fadeIn{ from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .adm-pack-tab { transition: all .15s; border: none; cursor: pointer; }
        .adm-pack-tab:hover { opacity: .8; }
      `}</style>

      <div style={{ fontFamily: F }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Packs de tokens</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Los cambios se reflejan en la página de precios automáticamente</p>
          </div>
          <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Actualizar
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { key: 'list',   label: `Packs (${packs.length})` },
            { key: 'create', label: '+ Crear pack' },
            ...(editingPack ? [{ key: 'edit', label: `Editando: ${editingPack.name}` }] : []),
          ].map(t => (
            <button key={t.key} className="adm-pack-tab"
              onClick={() => setTab(t.key as any)}
              style={{ padding: '9px 18px', borderRadius: 12, fontSize: 13, fontWeight: 700, fontFamily: F, background: tab === t.key ? '#0f172a' : '#fff', color: tab === t.key ? '#fff' : '#64748b', border: tab === t.key ? 'none' : '1.5px solid #e2e8f0', boxShadow: tab === t.key ? '0 4px 14px rgba(15,23,42,.2)' : 'none' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {tab === 'list' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'adm-fadeIn .2s ease both' }}>
            {loading ? (
              <div style={{ background: '#fff', borderRadius: 18, padding: 32, textAlign: 'center', color: '#94a3b8', border: '1px solid #f1f5f9' }}>Cargando packs...</div>
            ) : packs.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '48px 24px', textAlign: 'center', border: '1.5px dashed #e2e8f0' }}>
                <p style={{ fontSize: 14, color: '#94a3b8', margin: '0 0 16px' }}>No hay packs todavía</p>
                <button onClick={() => setTab('create')} style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F }}>
                  Crear el primer pack
                </button>
              </div>
            ) : packs.map(p => (
              <div key={p.id} style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #f1f5f9', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${p.color ?? '#2EC4B6'}18`, border: `2px solid ${p.color ?? '#2EC4B6'}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: p.color ?? '#2EC4B6' }} />
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>{p.name}</p>
                    {p.badge && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: p.color ?? '#2EC4B6', color: '#fff' }}>{p.badge}</span>}
                    {p.is_featured && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#f0fdf4', color: '#0f766e', border: '1px solid #bbf7d0' }}>⭐ Destacado</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px' }}>{p.description ?? 'Sin descripción'}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: '#f0fdf9', color: '#0f766e', border: '1px solid #99f6e4' }}>{p.tokens} tokens</span>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>{p.price_eur}€</span>
                    <span style={{ fontSize: 11, color: '#94a3b8', padding: '2px 4px' }}>{p.price_eur && p.tokens ? (p.price_eur / p.tokens).toFixed(3) : '—'}€/tkn</span>
                    {p.variant_id && <span style={{ fontSize: 11, fontFamily: 'monospace', padding: '2px 9px', borderRadius: 20, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>ID: {p.variant_id}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'center', minWidth: 52, flexShrink: 0 }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>{(p.features ?? []).length}</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>features</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => toggleActive(p.id, p.active)}
                    style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${p.active ? '#fecaca' : '#a7f3d0'}`, background: '#fff', color: p.active ? '#dc2626' : '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: F }}>
                    {p.active ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => { setEditingPack({ ...p, features: (p.features ?? []).join('\n'), sort_order: String(p.sort_order ?? 0) }); setTab('edit') }}
                    style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #bfdbfe', background: '#fff', color: '#3b82f6', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: F }}>
                    Editar
                  </button>
                </div>
              </div>
            ))}

            {packs.length > 0 && (
              <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '12px 16px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style={{ fontSize: 12, color: '#0f766e', margin: 0, fontWeight: 600 }}>Los cambios se reflejan automáticamente en la página de precios de la web pública.</p>
              </div>
            )}
          </div>
        )}

        {/* Crear */}
        {tab === 'create' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid #f1f5f9', animation: 'adm-fadeIn .2s ease both' }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>Crear nuevo pack</p>
            <PackForm
              pack={newPack}
              onChange={setNewPack}
              onSave={handleCreate}
              onCancel={() => setTab('list')}
              saving={saving}
            />
          </div>
        )}

        {/* Editar */}
        {tab === 'edit' && editingPack && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid #f1f5f9', animation: 'adm-fadeIn .2s ease both' }}>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>Editando: {editingPack.name}</p>
            <PackForm
              pack={editingPack}
              onChange={setEditingPack}
              onSave={handleUpdate}
              onCancel={() => { setTab('list'); setEditingPack(null) }}
              saving={saving}
              isEdit
            />
          </div>
        )}
      </div>
    </>
  )
}