'use client'

import { useState } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

interface ExternalStore {
  id:         string
  name:       string
  token:      string
  active:     boolean
  created_at: string
}

// Credenciales que se muestran UNA SOLA VEZ tras crear o regenerar
interface NewCredentials {
  storeId:  string
  name:     string
  token:    string
  secret:   string
  isRegen:  boolean
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function TiendasExternasClient({ stores: initialStores }: { stores: ExternalStore[] }) {
  const [stores, setStores]             = useState<ExternalStore[]>(initialStores)
  const [showCreate, setShowCreate]     = useState(false)
  const [newName, setNewName]           = useState('')
  const [creating, setCreating]         = useState(false)
  const [createError, setCreateError]   = useState('')
  const [credentials, setCredentials]   = useState<NewCredentials | null>(null)
  const [confirmId, setConfirmId]       = useState<string | null>(null)
  const [deleting, setDeleting]         = useState<string | null>(null)
  const [toggling, setToggling]         = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState<string | null>(null)
  const [copied, setCopied]             = useState<string | null>(null)

  // ── Copiar al portapapeles ───────────────────────────────────────────────
  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  // ── Crear tienda nueva ───────────────────────────────────────────────────
  async function handleCreate() {
    const name = newName.trim()
    if (!name) { setCreateError('Introduce un nombre para la tienda'); return }
    setCreateError('')
    setCreating(true)
    try {
      const res  = await fetch('/api/external-stores', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name }),
      })
      const data = await res.json()
      if (!res.ok) { setCreateError(data.error ?? 'Error al crear la tienda'); return }

      setStores(prev => [data.store, ...prev])
      setCredentials({ storeId: data.store.id, name: data.store.name, token: data.store.token, secret: data.secret, isRegen: false })
      setShowCreate(false)
      setNewName('')
    } finally {
      setCreating(false)
    }
  }

  // ── Activar / desactivar ─────────────────────────────────────────────────
  async function handleToggle(store: ExternalStore) {
    setToggling(store.id)
    try {
      await fetch(`/api/external-stores/${store.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ active: !store.active }),
      })
      setStores(prev => prev.map(s => s.id === store.id ? { ...s, active: !s.active } : s))
    } finally {
      setToggling(null)
    }
  }

  // ── Regenerar credenciales ───────────────────────────────────────────────
  async function handleRegenerate(store: ExternalStore) {
    setRegenerating(store.id)
    try {
      const res  = await fetch(`/api/external-stores/${store.id}/regenerate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { alert(data.error ?? 'Error al regenerar credenciales'); return }

      setStores(prev => prev.map(s => s.id === store.id ? { ...s, token: data.token } : s))
      setCredentials({ storeId: store.id, name: store.name, token: data.token, secret: data.secret, isRegen: true })
    } finally {
      setRegenerating(null)
    }
  }

  // ── Eliminar tienda ──────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await fetch(`/api/external-stores/${id}`, { method: 'DELETE' })
      setStores(prev => prev.filter(s => s.id !== id))
      setConfirmId(null)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
        .ext-card { transition:all 0.15s; }
        .ext-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08)!important; }
        .ext-btn { transition:all 0.12s; }
        .ext-btn:not(:disabled):hover { opacity:0.82; transform:translateY(-1px); }
        .ext-btn:not(:disabled):active { transform:scale(0.97); }
        .ext-inp:focus { border-color:#2EC4B6!important; box-shadow:0 0 0 3px rgba(46,196,182,.1)!important; outline:none; }
        .mono { font-family:ui-monospace,SFMono-Regular,monospace; }
      `}</style>

      {/* ── Modal: credenciales nuevas ─────────────────────────────────── */}
      {credentials && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', zIndex:999, display:'flex', alignItems:'flex-end', justifyContent:'center', backdropFilter:'blur(6px)', animation:'fadeIn 0.15s ease', fontFamily:F }}>
          <div style={{ background:'#fff', width:'100%', maxWidth:560, borderRadius:'24px 24px 0 0', padding:'28px 24px 44px', animation:'slideUp 0.2s ease', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ width:36, height:4, background:'#e2e8f0', borderRadius:2, margin:'0 auto 20px' }} />

            {/* Icono + título */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:'#f0fdf4', border:'1.5px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div>
                <p style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:0 }}>
                  {credentials.isRegen ? 'Nuevas credenciales generadas' : 'Tienda conectada'}
                </p>
                <p style={{ fontSize:12, color:'#94a3b8', margin:'2px 0 0' }}>{credentials.name}</p>
              </div>
            </div>

            {/* Aviso importante */}
            <div style={{ background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:12, padding:'12px 14px', marginBottom:18 }}>
              <p style={{ fontSize:12, fontWeight:700, color:'#92400e', margin:0 }}>
                ⚠ Guarda estas credenciales ahora — el secret no se puede recuperar después.
              </p>
            </div>

            {/* Credenciales */}
            {[
              { label: 'Token (x-store-token)', value: credentials.token, key: 'token' },
              { label: 'Secret (para firmar HMAC-SHA256)', value: credentials.secret, key: 'secret' },
            ].map(({ label, value, key }) => (
              <div key={key} style={{ marginBottom:14 }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 6px' }}>{label}</p>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <div style={{ flex:1, background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:10, padding:'10px 14px', overflowX:'auto' }}>
                    <span className="mono" style={{ fontSize:12, color:'#0f172a', whiteSpace:'nowrap' }}>{value}</span>
                  </div>
                  <button onClick={() => copy(value, key)} className="ext-btn"
                    style={{ flexShrink:0, padding:'10px 14px', borderRadius:10, border:'1.5px solid #f1f5f9', background: copied === key ? '#f0fdf4' : '#fff', color: copied === key ? '#16a34a' : '#64748b', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:F, whiteSpace:'nowrap' }}>
                    {copied === key ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            ))}

            {/* URL del webhook */}
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 6px' }}>URL del webhook</p>
              <div style={{ background:'#f0f9ff', border:'1.5px solid #bae6fd', borderRadius:10, padding:'10px 14px' }}>
                <span className="mono" style={{ fontSize:12, color:'#0284c7' }}>
                  {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/external/orders
                </span>
              </div>
            </div>

            <button onClick={() => setCredentials(null)} style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:F }}>
              Entendido, he guardado las credenciales
            </button>
          </div>
        </div>
      )}

      {/* ── Modal: confirmar eliminación ───────────────────────────────── */}
      {confirmId && (
        <div onClick={() => setConfirmId(null)}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.5)', zIndex:999, display:'flex', alignItems:'flex-end', justifyContent:'center', backdropFilter:'blur(4px)', animation:'fadeIn 0.15s ease', fontFamily:F }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:'#fff', width:'100%', maxWidth:480, borderRadius:'24px 24px 0 0', padding:'24px 24px 36px', animation:'slideUp 0.2s ease' }}>
            <div style={{ width:36, height:4, background:'#e2e8f0', borderRadius:2, margin:'0 auto 20px' }} />
            <div style={{ width:52, height:52, borderRadius:16, background:'#fef2f2', border:'1.5px solid #fecaca', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <p style={{ fontSize:17, fontWeight:800, color:'#0f172a', textAlign:'center', margin:'0 0 8px' }}>¿Eliminar tienda?</p>
            <p style={{ fontSize:14, color:'#64748b', textAlign:'center', margin:'0 0 24px', lineHeight:1.6 }}>
              El token quedará inválido de forma inmediata. Los pedidos ya sincronizados se conservan.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <button onClick={() => setConfirmId(null)}
                style={{ padding:'14px', borderRadius:14, border:'1.5px solid #f1f5f9', background:'#f8fafc', color:'#64748b', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:F }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(confirmId)} disabled={!!deleting}
                style={{ padding:'14px', borderRadius:14, border:'none', background:'#dc2626', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:deleting ? 0.7 : 1 }}>
                {deleting && <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Página principal ───────────────────────────────────────────── */}
      <div style={{ background:'#f8fafc', minHeight:'100vh', fontFamily:F }}>

        {/* Header */}
        <div style={{ background:'#fff', padding:'16px clamp(16px,4vw,32px)', borderBottom:'1px solid #f1f5f9', position:'sticky', top:56, zIndex:9 }}>
          <div style={{ maxWidth:680, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
            <Link href="/configuracion" style={{ width:36, height:36, borderRadius:11, background:'#f8fafc', border:'1.5px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, textDecoration:'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize:'clamp(17px,3.5vw,22px)', fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-0.4px' }}>Tiendas externas</h1>
              <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{stores.length} tienda{stores.length !== 1 ? 's' : ''} conectada{stores.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:680, margin:'0 auto', padding:'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom:40, display:'flex', flexDirection:'column', gap:14 }}>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, animation:'fadeUp 0.2s ease both' }}>
            {[
              { label:'Conectadas', value:String(stores.length),                              color:'#0f766e', bg:'#f0fdf4', border:'#bbf7d0' },
              { label:'Activas',    value:String(stores.filter(s => s.active).length),        color:'#22c55e', bg:'#dcfce7', border:'#bbf7d0' },
              { label:'Inactivas',  value:String(stores.filter(s => !s.active).length),       color:'#92400e', bg:'#fef3c7', border:'#fde68a' },
            ].map(s => (
              <div key={s.label} style={{ background:s.bg, borderRadius:18, padding:'14px 16px', border:`1.5px solid ${s.border}` }}>
                <p style={{ fontSize:10, fontWeight:700, color:s.color, textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 4px', opacity:0.7 }}>{s.label}</p>
                <p style={{ fontSize:'clamp(20px,4vw,26px)', fontWeight:800, color:s.color, margin:0, letterSpacing:'-0.5px' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Lista de tiendas */}
          {stores.length === 0 && !showCreate ? (
            <div style={{ background:'#fff', borderRadius:24, padding:'48px 24px', textAlign:'center', border:'1.5px dashed #e2e8f0', animation:'fadeUp 0.2s ease 0.05s both' }}>
              <div style={{ width:60, height:60, borderRadius:18, background:'#f0f9ff', border:'1.5px solid #bae6fd', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <p style={{ fontSize:16, fontWeight:800, color:'#0f172a', margin:'0 0 6px' }}>Sin tiendas externas</p>
              <p style={{ fontSize:13, color:'#94a3b8', margin:'0 0 24px', lineHeight:1.6 }}>
                Conecta cualquier tienda (WooCommerce, PrestaShop, personalizada…) enviando pedidos vía webhook
              </p>
              <button onClick={() => setShowCreate(true)} className="ext-btn"
                style={{ padding:'13px 28px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:F, display:'inline-flex', alignItems:'center', gap:8, boxShadow:'0 4px 16px rgba(46,196,182,0.3)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Conectar tienda externa
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {stores.map((store, i) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  index={i}
                  isToggling={toggling === store.id}
                  isRegenerating={regenerating === store.id}
                  copied={copied}
                  onToggle={() => handleToggle(store)}
                  onRegenerate={() => handleRegenerate(store)}
                  onDelete={() => setConfirmId(store.id)}
                  onCopy={copy}
                />
              ))}
            </div>
          )}

          {/* Formulario de nueva tienda */}
          {showCreate ? (
            <CreateForm
              name={newName}
              setName={setNewName}
              error={createError}
              creating={creating}
              onCreate={handleCreate}
              onCancel={() => { setShowCreate(false); setNewName(''); setCreateError('') }}
            />
          ) : stores.length > 0 && (
            <button onClick={() => setShowCreate(true)} className="ext-btn"
              style={{ width:'100%', padding:'15px 20px', borderRadius:18, border:'2px solid #2EC4B6', background:'#fff', color:'#0f766e', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 12px rgba(46,196,182,0.1)', animation:'fadeUp 0.2s ease 0.15s both' }}>
              <span>Conectar nueva tienda externa</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          )}

          {/* Guía de integración */}
          <IntegrationGuide />

        </div>
      </div>
    </>
  )
}

// ── Tarjeta de tienda ─────────────────────────────────────────────────────────
function StoreCard({ store, index, isToggling, isRegenerating, copied, onToggle, onRegenerate, onDelete, onCopy }: {
  store:          ExternalStore
  index:          number
  isToggling:     boolean
  isRegenerating: boolean
  copied:         string | null
  onToggle:       () => void
  onRegenerate:   () => void
  onDelete:       () => void
  onCopy:         (text: string, key: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const tokenKey = `token-${store.id}`

  return (
    <div className="ext-card"
      style={{ background:'#fff', borderRadius:20, border:'1.5px solid #f1f5f9', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', animation:`fadeUp 0.2s ease ${index * 0.05}s both`, overflow:'hidden' }}>

      {/* Cabecera */}
      <div style={{ padding:'clamp(14px,2vw,18px) clamp(14px,3vw,20px)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
          <div style={{ width:46, height:46, borderRadius:14, background: store.active ? 'linear-gradient(135deg,#f0f9ff,#e0f2fe)' : '#f8fafc', border:`1.5px solid ${store.active ? '#bae6fd' : '#e2e8f0'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={store.active ? '#0284c7' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:'0 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{store.name}</p>
            <p style={{ fontSize:11, color:'#94a3b8', margin:'0 0 6px' }}>Creada {fmt(store.created_at)}</p>
            <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background: store.active ? '#f0fdf4' : '#fef3c7', color: store.active ? '#0f766e' : '#92400e', border:`1px solid ${store.active ? '#bbf7d0' : '#fde68a'}` }}>
              {store.active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>

        {/* Botón expandir */}
        <button onClick={() => setExpanded(v => !v)} className="ext-btn"
          style={{ width:32, height:32, borderRadius:10, border:'1.5px solid #f1f5f9', background:'#f8fafc', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
            {expanded ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
          </svg>
        </button>
      </div>

      {/* Token visible */}
      <div style={{ padding:'0 clamp(14px,3vw,20px) clamp(14px,2vw,18px)', display:'flex', gap:8, alignItems:'center' }}>
        <div style={{ flex:1, background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:10, padding:'9px 12px', overflow:'hidden' }}>
          <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 2px' }}>Token</p>
          <span style={{ fontFamily:'ui-monospace,monospace', fontSize:11, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block' }}>
            {store.token.slice(0, 24)}…
          </span>
        </div>
        <button onClick={() => onCopy(store.token, tokenKey)} className="ext-btn"
          style={{ flexShrink:0, padding:'9px 12px', borderRadius:10, border:'1.5px solid #f1f5f9', background: copied === tokenKey ? '#f0fdf4' : '#fff', color: copied === tokenKey ? '#16a34a' : '#64748b', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:F, whiteSpace:'nowrap' }}>
          {copied === tokenKey ? '✓' : 'Copiar'}
        </button>
      </div>

      {/* Panel expandido: acciones */}
      {expanded && (
        <div style={{ borderTop:'1px solid #f8fafc', padding:'clamp(14px,2vw,16px) clamp(14px,3vw,20px)', display:'flex', flexDirection:'column', gap:10, background:'#fafbfc', animation:'fadeUp 0.15s ease' }}>

          {/* Activar / desactivar */}
          <button onClick={onToggle} disabled={isToggling} className="ext-btn"
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 16px', borderRadius:12, border:`1.5px solid ${store.active ? '#fde68a' : '#bbf7d0'}`, background: store.active ? '#fffbeb' : '#f0fdf4', color: store.active ? '#92400e' : '#0f766e', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, opacity: isToggling ? 0.6 : 1 }}>
            <span>{store.active ? 'Desactivar webhooks' : 'Activar webhooks'}</span>
            {isToggling
              ? <div style={{ width:14, height:14, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
            }
          </button>

          {/* Regenerar credenciales */}
          <button onClick={onRegenerate} disabled={isRegenerating} className="ext-btn"
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 16px', borderRadius:12, border:'1.5px solid #e9d5ff', background:'#faf5ff', color:'#7c3aed', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F, opacity: isRegenerating ? 0.6 : 1 }}>
            <span>{isRegenerating ? 'Generando…' : 'Regenerar credenciales'}</span>
            {isRegenerating
              ? <div style={{ width:14, height:14, border:'2px solid #7c3aed', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            }
          </button>

          {/* Eliminar */}
          <button onClick={onDelete} className="ext-btn"
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 16px', borderRadius:12, border:'1.5px solid #fecaca', background:'#fef2f2', color:'#dc2626', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
            <span>Eliminar tienda</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}

// ── Formulario de creación ────────────────────────────────────────────────────
function CreateForm({ name, setName, error, creating, onCreate, onCancel }: {
  name:     string
  setName:  (v: string) => void
  error:    string
  creating: boolean
  onCreate: () => void
  onCancel: () => void
}) {
  return (
    <div style={{ background:'#f0fdf4', borderRadius:18, padding:18, border:'1.5px solid #bbf7d0', animation:'fadeUp 0.15s ease both' }}>
      <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:'0 0 12px' }}>Nueva tienda externa</p>
      <input
        className="ext-inp"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onCreate()}
        placeholder="Ej: Mi tienda WooCommerce"
        style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid #bbf7d0', background:'#fff', fontSize:14, fontFamily:F, color:'#0f172a', boxSizing:'border-box', marginBottom:8, transition:'all .15s' }}
        autoFocus
      />
      {error && <p style={{ fontSize:12, color:'#dc2626', margin:'0 0 8px', fontWeight:600 }}>{error}</p>}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={onCreate} disabled={creating || !name.trim()} className="ext-btn"
          style={{ flex:1, padding:'12px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', color:'#fff', fontSize:13, fontWeight:800, cursor: creating || !name.trim() ? 'not-allowed' : 'pointer', fontFamily:F, display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity: creating || !name.trim() ? 0.6 : 1, boxShadow:'0 4px 14px rgba(46,196,182,.3)' }}>
          {creating && <div style={{ width:13, height:13, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .8s linear infinite' }} />}
          {creating ? 'Creando…' : 'Generar credenciales'}
        </button>
        <button onClick={onCancel} className="ext-btn"
          style={{ padding:'12px 18px', borderRadius:12, border:'1.5px solid #e2e8f0', background:'#fff', color:'#64748b', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:F }}>
          Cancelar
        </button>
      </div>
    </div>
  )
}

// ── Guía de integración ───────────────────────────────────────────────────────
function IntegrationGuide() {
  return (
    <div style={{ background:'#fff', borderRadius:20, padding:'clamp(16px,3vw,20px)', border:'1.5px solid #f1f5f9', boxShadow:'0 2px 12px rgba(0,0,0,0.04)', animation:'fadeUp 0.2s ease 0.2s both' }}>
      <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 14px' }}>Cómo integrar tu tienda</p>
      {[
        { n:'1', title:'Crea la tienda y obtén credenciales', desc:'Pulsa "Conectar tienda externa". Se generan un token y un secret únicos. Guárdalos.' },
        { n:'2', title:'Configura el webhook en tu tienda',   desc:'Envía un POST a /api/webhooks/external/orders con las cabeceras x-store-token y x-hmac-sha256.' },
        { n:'3', title:'Firma cada petición con HMAC-SHA256', desc:'Calcula HMAC-SHA256 del body JSON con tu secret. Adjunta el resultado en base64 en x-hmac-sha256.' },
        { n:'4', title:'Formato del pedido',                 desc:'El JSON debe incluir: id, total_price, customer (name/phone/email), shipping_address y line_items.' },
      ].map(s => (
        <div key={s.n} style={{ display:'flex', gap:12, marginBottom:12 }}>
          <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
            <span style={{ fontSize:11, fontWeight:800, color:'#fff' }}>{s.n}</span>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{s.title}</p>
            <p style={{ fontSize:12, color:'#94a3b8', margin:0, lineHeight:1.6 }}>{s.desc}</p>
          </div>
        </div>
      ))}

      {/* Snippet de código de ejemplo */}
      <div style={{ marginTop:6, background:'#0f172a', borderRadius:12, padding:'16px', overflow:'auto' }}>
        <p style={{ fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 10px' }}>Ejemplo (Node.js)</p>
        <pre style={{ margin:0, fontSize:11, color:'#e2e8f0', lineHeight:1.7, fontFamily:'ui-monospace,monospace', whiteSpace:'pre-wrap' }}>{`const crypto = require('crypto')

const TOKEN  = 'tu_token_aqui'
const SECRET = 'tu_secret_aqui'

const order = {
  id:           'ORDER-001',
  order_number: '#1001',
  total_price:  49.99,
  currency:     'EUR',
  customer: {
    first_name: 'Ana',
    last_name:  'García',
    phone:      '+34666123456',
    email:      'ana@example.com',
  },
  shipping_address: {
    address1: 'Calle Mayor 1',
    city:     'Madrid',
    zip:      '28001',
    country:  'ES',
  },
  line_items: [
    { name: 'Camiseta Azul M', quantity: 1, price: 49.99 }
  ],
}

const body = JSON.stringify(order)
const hmac = crypto
  .createHmac('sha256', SECRET)
  .update(body, 'utf8')
  .digest('base64')

fetch('https://tu-app.com/api/webhooks/external/orders', {
  method:  'POST',
  headers: {
    'Content-Type':  'application/json',
    'x-store-token': TOKEN,
    'x-hmac-sha256': hmac,
  },
  body,
})`}</pre>
      </div>
    </div>
  )
}
