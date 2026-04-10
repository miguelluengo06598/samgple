'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const F = "'DM Sans', system-ui, sans-serif"

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#fef3c7', color: '#92400e', label: 'Pendiente' },
  in_review: { bg: '#ede9fe', color: '#6d28d9', label: 'En revisión' },
  sent:      { bg: '#dcfce7', color: '#15803d', label: 'Enviada' },
  rejected:  { bg: '#fee2e2', color: '#b91c1c', label: 'Rechazada' },
}

function Badge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? { bg: '#f1f5f9', color: '#475569', label: status }
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>{c.label}</span>
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState<Record<string, boolean>>({})
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/invoices')
    const data = await res.json()
    setInvoices(data.invoices ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const channel = supabase.channel('admin-invoices')
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'invoice_requests' }, () => load())
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [load])

  async function handleStatus(id: string, status: string) {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch('/api/admin/invoices', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
      setInvoices(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    } finally { setSaving(prev => ({ ...prev, [id]: false })) }
  }

  const th: React.CSSProperties = { textAlign: 'left', padding: '11px 16px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' }
  const inp: React.CSSProperties = { padding: '7px 10px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 12, outline: 'none', color: '#0f172a', cursor: 'pointer', fontFamily: F }

  return (
    <>
      <style>{`
        .adm-tr { transition: background .12s; }
        .adm-tr:hover { background: #fafafa !important; }
        .adm-wrap { overflow-x: auto; border-radius: 16px; }
        .adm-wrap table { min-width: 520px; }
        @media(min-width:768px) { .adm-hm { display: table-cell !important; } }
        @media(max-width:767px) { .adm-hm { display: none !important; } }
      `}</style>

      <div style={{ fontFamily: F }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Facturas</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{invoices.filter(i => i.status === 'pending').length} pendientes de gestionar</p>
          </div>
          <button onClick={load} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Actualizar
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
          <div className="adm-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Usuario</th>
                  <th style={th} className="adm-hm">Período</th>
                  <th style={th} className="adm-hm">Notas</th>
                  <th style={th}>Estado</th>
                  <th style={th}>Cambiar</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: 32, color: '#94a3b8', textAlign: 'center' }}>Cargando...</td></tr>
                ) : invoices.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 40, color: '#94a3b8', textAlign: 'center' }}>Sin solicitudes de factura</td></tr>
                ) : invoices.map(inv => (
                  <tr key={inv.id} className="adm-tr">
                    <td style={td}>
                      <p style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{inv.accounts?.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{inv.accounts?.email}</p>
                    </td>
                    <td style={td} className="adm-hm">{inv.period ?? '—'}</td>
                    <td style={td} className="adm-hm">
                      <p style={{ margin: 0, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#64748b', fontSize: 12 }}>{inv.notes ?? '—'}</p>
                    </td>
                    <td style={td}><Badge status={inv.status} /></td>
                    <td style={td}>
                      <select value={inv.status} onChange={e => handleStatus(inv.id, e.target.value)} disabled={!!saving[inv.id]} style={{ ...inp, opacity: saving[inv.id] ? .5 : 1 }}>
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}