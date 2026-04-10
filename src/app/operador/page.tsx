// src/app/operador/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'

const F = "'DM Sans', system-ui, sans-serif"

interface CallRequest {
  id: string
  is_retry: boolean
  admin_note: string | null
  created_at: string
  orders: {
    order_number: string
    total_price: number
    phone: string | null
    customers: { first_name: string | null; last_name: string | null; phone: string | null } | null
    order_items: Array<{ name: string; quantity: number; price: number }>
    stores: { name: string } | null
  }
}

export default function OperadorPage() {
  const [authed, setAuthed]       = useState(false)
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [calls, setCalls]         = useState<CallRequest[]>([])
  const [loading, setLoading]     = useState(false)
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [notes, setNotes]         = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState<Record<string, boolean>>({})

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const res = await fetch('/api/operador/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) {
        setAuthed(true)
        loadCalls()
      } else {
        const data = await res.json()
        setLoginError(data.error ?? 'Credenciales incorrectas')
      }
    } finally { setLoginLoading(false) }
  }

  const loadCalls = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/operador/calls')
    const data = await res.json()
    if (res.status === 401) { setAuthed(false); return }
    setCalls(data.calls ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    // Comprobar si ya está autenticado
    fetch('/api/operador/calls').then(res => {
      if (res.ok) { setAuthed(true); res.json().then(d => setCalls(d.calls ?? [])) }
    })
  }, [])

  async function handleResolve(id: string, status: string) {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch('/api/operador/calls', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, admin_note: notes[id] ?? '' }),
      })
      setCalls(prev => prev.filter(c => c.id !== id))
      setExpanded(null)
    } finally { setSaving(prev => ({ ...prev, [id]: false })) }
  }

  async function handleLogout() {
    await fetch('/api/operador/auth', { method: 'DELETE' })
    setAuthed(false)
    setCalls([])
  }

  // ── LOGIN ──
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0a1628,#0d2318)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F, padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 24, padding: 32, width: '100%', maxWidth: 360, boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 6px 20px rgba(46,196,182,.4)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>SAMGPLE Operador</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Panel de llamadas</p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 13, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 14, outline: 'none', color: '#0f172a', boxSizing: 'border-box', fontFamily: F }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 6 }}>Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 13, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 14, outline: 'none', color: '#0f172a', boxSizing: 'border-box', fontFamily: F }} />
            </div>
            {loginError && <p style={{ fontSize: 12, color: '#dc2626', margin: 0, fontWeight: 600, textAlign: 'center' }}>{loginError}</p>}
            <button type="submit" disabled={loginLoading || !email || !password}
              style={{ padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: F, marginTop: 4, opacity: (!email || !password) ? .5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 16px rgba(46,196,182,.3)' }}>
              {loginLoading && <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />}
              {loginLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
        <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
      </div>
    )
  }

  // ── PANEL ──
  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', fontFamily: F }}>
      <style>{`
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      {/* Header */}
      <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,28px)', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Mis llamadas</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{calls.length} pendiente{calls.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadCalls} style={{ padding: '8px 14px', borderRadius: 11, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F }}>Actualizar</button>
          <button onClick={handleLogout} style={{ padding: '8px 14px', borderRadius: 11, border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: F }}>Salir</button>
        </div>
      </div>

      {/* Lista */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,24px) 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? (
          [1,2,3].map(i => <div key={i} style={{ background: '#fff', borderRadius: 18, height: 80, border: '1px solid #f1f5f9' }} />)
        ) : calls.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '56px 24px', textAlign: 'center', border: '1.5px solid #f1f5f9' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Sin llamadas pendientes</p>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No tienes solicitudes asignadas ahora mismo</p>
          </div>
        ) : calls.map((call, i) => {
          const name    = `${call.orders?.customers?.first_name ?? ''} ${call.orders?.customers?.last_name ?? ''}`.trim() || 'Cliente'
          const phone   = call.orders?.customers?.phone ?? call.orders?.phone ?? '—'
          const items   = call.orders?.order_items ?? []
          const isOpen  = expanded === call.id
          const isSaving = !!saving[call.id]

          return (
            <div key={call.id} style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${call.is_retry ? '#fde68a' : '#e8edf2'}`, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)', animation: `fadeUp .2s ease ${i * .04}s both` }}>

              <div onClick={() => setExpanded(isOpen ? null : call.id)} style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: call.is_retry ? '#fffbeb' : '#f0f9ff', border: `1.5px solid ${call.is_retry ? '#fde68a' : '#bae6fd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: call.is_retry ? '#d97706' : '#0284c7', flexShrink: 0 }}>
                  {name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                    {call.is_retry && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', flexShrink: 0 }}>RELLAMADA</span>}
                  </div>
                  <p style={{ fontSize: 14, color: '#0284c7', margin: '0 0 4px', fontWeight: 700, fontFamily: 'monospace' }}>{phone}</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700 }}>#{call.orders?.order_number}</span>
                    <span style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 700 }}>{Number(call.orders?.total_price ?? 0).toFixed(2)}€</span>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round">{isOpen ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}</svg>
              </div>

              {isOpen && (
                <div style={{ borderTop: '1px solid #f8fafc', background: '#fafbfc', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.length > 0 && (
                    <div style={{ background: '#fff', borderRadius: 13, padding: '13px 15px', border: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>Productos</p>
                      {items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: idx > 0 ? '6px 0 0' : '0', borderTop: idx > 0 ? '1px solid #f1f5f9' : 'none' }}>
                          <span style={{ fontSize: 13, color: '#374151' }}>{item.name} <span style={{ color: '#94a3b8' }}>×{item.quantity}</span></span>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{Number(item.price).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ background: '#fff', borderRadius: 13, padding: '13px 15px', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>Nota tras la llamada</p>
                    <textarea
                      value={notes[call.id] ?? ''}
                      onChange={e => setNotes(prev => ({ ...prev, [call.id]: e.target.value }))}
                      placeholder='Ej: "confirmado, quiere aviso antes de entrega"'
                      style={{ width: '100%', minHeight: 72, padding: '10px 12px', borderRadius: 11, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13, fontFamily: F, resize: 'vertical', outline: 'none', color: '#0f172a', lineHeight: 1.5, boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <button onClick={() => handleResolve(call.id, 'confirmed')} disabled={isSaving}
                      style={{ padding: '12px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: isSaving ? .6 : 1 }}>
                      {isSaving ? <Spinner /> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      Confirmado
                    </button>
                    <button onClick={() => handleResolve(call.id, 'no_answer')} disabled={isSaving}
                      style={{ padding: '12px', borderRadius: 13, border: '1.5px solid #fde68a', background: '#fff', color: '#d97706', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: isSaving ? .6 : 1 }}>
                      No contesta
                    </button>
                    <button onClick={() => handleResolve(call.id, 'cancelled')} disabled={isSaving}
                      style={{ padding: '12px', borderRadius: 13, border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: isSaving ? .6 : 1 }}>
                      Cancelado
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Spinner({ color = '#fff' }: { color?: string }) {
  return <div style={{ width: 13, height: 13, border: `2px solid ${color}30`, borderTopColor: color, borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}