'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const F = "'DM Sans', system-ui, sans-serif"

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pendiente',   color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  confirmed: { label: 'Confirmado',  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  no_answer: { label: 'No contestó', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  cancelled: { label: 'Cancelado',   color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
}

interface CallRequest {
  id: string
  status: string
  is_retry: boolean
  cost_tokens: number
  admin_note: string | null
  ai_summary: string | null
  assigned_to: string | null
  created_at: string
  orders: {
    id: string
    order_number: string
    total_price: number
    status: string
    phone: string | null
    customers: { first_name: string | null; last_name: string | null; phone: string | null } | null
    order_items: Array<{ name: string; quantity: number; price: number }>
    stores: { name: string } | null
  }
  accounts: { name: string; email: string } | null
}

interface Operator {
  id: string
  name: string
  email: string
  active: boolean
}

export default function AdminLlamadasPage() {
  const [requests, setRequests]   = useState<CallRequest[]>([])
  const [operators, setOperators] = useState<Operator[]>([])
  const [loading, setLoading]     = useState(true)
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [notes, setNotes]         = useState<Record<string, string>>({})
  const [saving, setSaving]       = useState<Record<string, boolean>>({})
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const [reqRes, opRes] = await Promise.all([
      fetch('/api/admin/call-requests'),
      fetch('/api/admin/operators'),
    ])
    const reqData = await reqRes.json()
    const opData  = await opRes.json()
    setRequests(reqData.requests ?? [])
    setOperators(opData.operators ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // Realtime — nuevas solicitudes
  useEffect(() => {
    const channel = supabase.channel('admin-llamadas')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'call_requests' }, () => load())
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [load])

  async function handleResolve(id: string, status: string) {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch('/api/admin/call-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, admin_note: notes[id] ?? '' }),
      })
      setRequests(prev => prev.filter(r => r.id !== id))
      setExpanded(null)
    } finally { setSaving(prev => ({ ...prev, [id]: false })) }
  }

  async function handleAssign(id: string, operatorId: string) {
    await fetch('/api/admin/call-requests', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, assigned_to: operatorId, status: 'pending' }),
    })
    setRequests(prev => prev.map(r => r.id === id ? { ...r, assigned_to: operatorId } : r))
  }

  const pending = requests.length

  return (
    <div style={{ fontFamily: F }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(18px,2.5vw,24px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Solicitudes de llamada</h1>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '4px 0 0' }}>
            {pending > 0
              ? <span style={{ color: '#0284c7', fontWeight: 600 }}>{pending} pendiente{pending > 1 ? 's' : ''} de llamar</span>
              : 'Sin solicitudes pendientes'}
          </p>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
          Actualizar
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: '#fff', borderRadius: 18, padding: 20, border: '1px solid #f1f5f9', height: 80, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: '64px 24px', textAlign: 'center', border: '1.5px solid #f1f5f9' }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Todo al día</p>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay solicitudes de llamada pendientes</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {requests.map(req => {
            const name    = `${req.orders?.customers?.first_name ?? ''} ${req.orders?.customers?.last_name ?? ''}`.trim() || 'Cliente'
            const phone   = req.orders?.customers?.phone ?? req.orders?.phone ?? '—'
            const items   = req.orders?.order_items ?? []
            const isOpen  = expanded === req.id
            const isSaving = !!saving[req.id]
            const assignedOp = operators.find(o => o.id === req.assigned_to)

            return (
              <div key={req.id} style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${req.is_retry ? '#fde68a' : '#e8edf2'}`, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>

                {/* Cabecera */}
                <div onClick={() => setExpanded(isOpen ? null : req.id)}
                  style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>

                  {/* Avatar */}
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: req.is_retry ? '#fffbeb' : '#f0f9ff', border: `1.5px solid ${req.is_retry ? '#fde68a' : '#bae6fd'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: req.is_retry ? '#d97706' : '#0284c7', flexShrink: 0 }}>
                    {name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>{name}</p>
                      {req.is_retry && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>RELLAMADA</span>}
                    </div>
                    <p style={{ fontSize: 13, color: '#0284c7', margin: '0 0 4px', fontWeight: 700, fontFamily: 'monospace' }}>{phone}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>#{req.orders?.order_number}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 20, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>{Number(req.orders?.total_price ?? 0).toFixed(2)}€</span>
                      {req.orders?.stores?.name && <span style={{ fontSize: 11, color: '#94a3b8', padding: '2px 4px' }}>{req.orders.stores.name}</span>}
                    </div>
                  </div>

                  {/* Derecha */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                      {new Date(req.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {assignedOp ? (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#f0fdf4', color: '#0f766e', border: '1px solid #bbf7d0' }}>→ {assignedOp.name}</span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>Sin asignar</span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round">{isOpen ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}</svg>
                  </div>
                </div>

                {/* Expandido */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid #f8fafc', background: '#fafbfc', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Productos */}
                    {items.length > 0 && (
                      <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Productos</p>
                        {items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: i > 0 ? '6px 0 0' : '0', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none' }}>
                            <span style={{ fontSize: 13, color: '#374151' }}>{item.name} <span style={{ color: '#94a3b8' }}>×{item.quantity}</span></span>
                            <span style={{ fontSize: 13, fontWeight: 700 }}>{Number(item.price).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Asignar operador */}
                    {operators.length > 0 && (
                      <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Asignar a operador</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {operators.filter(o => o.active).map(op => (
                            <button key={op.id} onClick={() => handleAssign(req.id, op.id)}
                              style={{ padding: '8px 16px', borderRadius: 12, border: `1.5px solid ${req.assigned_to === op.id ? '#bbf7d0' : '#e2e8f0'}`, background: req.assigned_to === op.id ? '#f0fdf4' : '#fff', color: req.assigned_to === op.id ? '#0f766e' : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: F, transition: 'all .15s' }}>
                              {op.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nota del operador */}
                    <div style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 10px' }}>Nota tras la llamada → GPT la pule para el cliente</p>
                      <textarea
                        value={notes[req.id] ?? ''}
                        onChange={e => setNotes(prev => ({ ...prev, [req.id]: e.target.value }))}
                        placeholder='Ej: "confirmado, quiere que el repartidor llame antes de llegar"'
                        style={{ width: '100%', minHeight: 80, padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13, fontFamily: F, resize: 'vertical', outline: 'none', color: '#0f172a', lineHeight: 1.5, boxSizing: 'border-box' }}
                      />
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: '6px 0 0' }}>La IA convertirá tu nota en un mensaje claro para el cliente</p>
                    </div>

                    {/* Botones de resolución */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      <button onClick={() => handleResolve(req.id, 'confirmed')} disabled={isSaving}
                        style={{ padding: '12px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: isSaving ? .6 : 1, transition: 'all .15s' }}>
                        {isSaving ? <Spinner /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        Confirmado
                      </button>
                      <button onClick={() => handleResolve(req.id, 'no_answer')} disabled={isSaving}
                        style={{ padding: '12px', borderRadius: 14, border: '1.5px solid #fde68a', background: '#fff', color: '#d97706', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: isSaving ? .6 : 1 }}>
                        {isSaving ? <Spinner color="#d97706" /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
                        No contesta
                      </button>
                      <button onClick={() => handleResolve(req.id, 'cancelled')} disabled={isSaving}
                        style={{ padding: '12px', borderRadius: 14, border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: isSaving ? .6 : 1 }}>
                        {isSaving ? <Spinner color="#dc2626" /> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                        Cancelado
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Spinner({ color = '#fff' }: { color?: string }) {
  return <div style={{ width: 13, height: 13, border: `2px solid ${color}30`, borderTopColor: color, borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}