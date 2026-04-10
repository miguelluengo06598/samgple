'use client'

import { useState, useEffect, useCallback } from 'react'

const F = "'DM Sans', system-ui, sans-serif"

interface Operator {
  id: string
  name: string
  email: string
  active: boolean
  created_at: string
  pending_calls?: number
}

export default function AdminOperadoresPage() {
  const [operators, setOperators] = useState<Operator[]>([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [newOp, setNewOp]         = useState({ name: '', email: '', password: '' })
  const [showForm, setShowForm]   = useState(false)
  const [error, setError]         = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/operators')
    const data = await res.json()
    setOperators(data.operators ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleCreate() {
    if (!newOp.name || !newOp.email || !newOp.password) { setError('Todos los campos son obligatorios'); return }
    setSaving(true)
    setError('')
    try {
      const res  = await fetch('/api/admin/operators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOp),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Error al crear operador'); return }
      setNewOp({ name: '', email: '', password: '' })
      setShowForm(false)
      await load()
    } finally { setSaving(false) }
  }

  async function handleToggle(id: string, active: boolean) {
    await fetch('/api/admin/operators', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active }),
    })
    setOperators(prev => prev.map(o => o.id === id ? { ...o, active: !active } : o))
  }

  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 11, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13, outline: 'none', color: '#0f172a', boxSizing: 'border-box', fontFamily: F }

  return (
    <div style={{ fontFamily: F, maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Operadores</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>{operators.length} operador{operators.length !== 1 ? 'es' : ''} registrado{operators.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F, boxShadow: '0 4px 14px rgba(46,196,182,.3)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo operador
        </button>
      </div>

      {/* Formulario nuevo operador */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid #e8edf2', boxShadow: '0 4px 16px rgba(0,0,0,.06)', marginBottom: 16, animation: 'fadeUp .2s ease both' }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Crear operador</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 12 }}>
            {[
              { label: 'Nombre', key: 'name', ph: 'María García', type: 'text' },
              { label: 'Email', key: 'email', ph: 'maria@empresa.com', type: 'email' },
              { label: 'Contraseña', key: 'password', ph: '••••••••', type: 'password' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5, display: 'block' }}>{f.label}</label>
                <input style={inp} type={f.type} placeholder={f.ph}
                  value={(newOp as any)[f.key]}
                  onChange={e => setNewOp(p => ({ ...p, [f.key]: e.target.value }))} />
              </div>
            ))}
          </div>
          {error && <p style={{ fontSize: 12, color: '#dc2626', margin: '0 0 12px', fontWeight: 600 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => { setShowForm(false); setError('') }}
              style={{ padding: '9px 18px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F }}>
              Cancelar
            </button>
            <button onClick={handleCreate} disabled={saving}
              style={{ padding: '9px 18px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: F, opacity: saving ? .7 : 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              {saving && <div style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />}
              Crear operador
            </button>
          </div>
        </div>
      )}

      {/* Lista operadores */}
      {loading ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', color: '#94a3b8', border: '1px solid #f1f5f9' }}>Cargando...</div>
      ) : operators.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 24px', textAlign: 'center', border: '1.5px dashed #e2e8f0' }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Sin operadores</p>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Crea el primer operador para asignarle llamadas</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {operators.map(op => (
            <div key={op.id} style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1.5px solid #e8edf2', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
              {/* Avatar */}
              <div style={{ width: 44, height: 44, borderRadius: 14, background: op.active ? 'linear-gradient(135deg,#2EC4B6,#1D9E75)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: op.active ? '#fff' : '#94a3b8', flexShrink: 0 }}>
                {op.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 140 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{op.name}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px' }}>{op.email}</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: op.active ? '#f0fdf4' : '#f1f5f9', color: op.active ? '#15803d' : '#94a3b8', border: `1px solid ${op.active ? '#bbf7d0' : '#e2e8f0'}` }}>
                    {op.active ? 'Activo' : 'Inactivo'}
                  </span>
                  {op.pending_calls !== undefined && op.pending_calls > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>
                      {op.pending_calls} pendiente{op.pending_calls > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button onClick={() => handleToggle(op.id, op.active)}
                  style={{ padding: '8px 14px', borderRadius: 11, border: `1.5px solid ${op.active ? '#fecaca' : '#bbf7d0'}`, background: '#fff', color: op.active ? '#dc2626' : '#16a34a', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: F, transition: 'all .15s' }}>
                  {op.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}