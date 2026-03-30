'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'
const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: 'Pendiente',   color: '#92400e', bg: '#fef3c7' },
  in_review: { label: 'En revisión', color: '#6d28d9', bg: '#ede9fe' },
  sent:      { label: 'Enviada',     color: '#15803d', bg: '#dcfce7' },
  rejected:  { label: 'Rechazada',   color: '#b91c1c', bg: '#fee2e2' },
}

export default function FacturasClient({ invoices, accountId }: { invoices: any[], accountId: string }) {
  const [local, setLocal] = useState(invoices)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useRealtime([{
    table: 'invoice_requests',
    filter: `account_id=eq.${accountId}`,
    onInsert: (i) => setLocal(prev => [i, ...prev]),
    onUpdate: (i) => setLocal(prev => prev.map(x => x.id === i.id ? { ...x, ...i } : x)),
  }])

  async function handleRequest() {
    setLoading(true); setMsg('')
    try {
      const res = await fetch('/api/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes }) })
      const data = await res.json()
      if (data.invoice) { setMsg('✓ Solicitud enviada correctamente'); setNotes('') }
    } finally { setLoading(false) }
  }

  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #e8f4f3', marginBottom: 10 }
  const fieldWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9, padding: '12px 13px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 13 }
  const fieldLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, display: 'block', fontFamily: F }

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/configuracion" style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Facturas</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Solicita y gestiona facturas</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        <div style={card}>
          <span style={fieldLabel}>Notas adicionales (opcional)</span>
          <textarea style={{ ...fieldWrap, minHeight: 80, resize: 'vertical', display: 'block', width: '100%', boxSizing: 'border-box', fontFamily: F, fontSize: 13, color: '#0f172a' } as React.CSSProperties} placeholder="Ej: factura enero 2025..." value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button onClick={handleRequest} disabled={loading} style={{ width: '100%', padding: '15px 18px', borderRadius: 16, border: '2px solid #8b5cf6', background: '#fff', color: '#7c3aed', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(139,92,246,0.1)', fontFamily: F, marginBottom: 10, opacity: loading ? 0.6 : 1 }}>
          <span>{loading ? 'Enviando...' : 'Solicitar factura'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </button>

        {msg && <div style={{ padding: '10px 14px', borderRadius: 14, background: '#dcfce7', border: '1px solid #bbf7d0', marginBottom: 10 }}><p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 600, fontFamily: F }}>{msg}</p></div>}

        {local.length > 0 && (
          <div style={card}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', fontFamily: F }}>Historial</p>
            {local.map((inv, i) => {
              const st = STATUS[inv.status] ?? STATUS.pending
              return (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < local.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, fontFamily: F }}>{inv.period}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>{new Date(inv.created_at).toLocaleDateString('es-ES')}</p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: st.bg, color: st.color, fontFamily: F }}>{st.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}