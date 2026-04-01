'use client'

import { useState, useEffect } from 'react'

const F = 'system-ui,-apple-system,sans-serif'

type Props = { accountId: string; walletBalance: number }
type Filter = 'today' | 'week' | 'month'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week',  label: 'Semana' },
  { key: 'month', label: 'Mes' },
]

const CALL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  confirmed:    { label: 'Confirmado',       color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  no_answer:    { label: 'No contestó',      color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  cancelled:    { label: 'Cancelado',        color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' },
  voicemail:    { label: 'Buzón de voz',     color: '#6d28d9', bg: '#faf5ff', border: '#e9d5ff' },
  wrong_number: { label: 'Nº incorrecto',    color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  calling:      { label: 'Llamando...',      color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  pending:      { label: 'Pendiente',        color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
}

export default function FinanzasClient({ accountId, walletBalance }: Props) {
  const [filter, setFilter]   = useState<Filter>('week')
  const [data, setData]       = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [filter])

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch(`/api/finances/summary?filter=${filter}`)
      setData(await res.json())
    } finally { setLoading(false) }
  }

  const ingresos          = data?.total_ingresos         ?? 0
  const ingresosPendiente = data?.total_pendiente        ?? 0
  const confirmados       = data?.confirmed_count        ?? 0
  const pendientes        = data?.pending_count          ?? 0
  const totalLlamadas     = data?.total_calls            ?? 0
  const noContesto        = data?.no_answer_count        ?? 0
  const cancelados        = data?.cancelled_count        ?? 0
  const tasaConfirmacion  = data?.confirmation_rate      ?? 0
  const tasaEntrega       = data?.delivery_rate          ?? 0
  const recentOrders      = data?.recent_orders          ?? []

  const gaugeConfirm = Math.min(tasaConfirmacion, 100)
  const gaugeEntrega = Math.min(tasaEntrega, 100)

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity:0;transform:translateY(6px) } to { opacity:1;transform:translateY(0) } }
        @keyframes barFill { from { width:0 } to { width:var(--w) } }
      `}</style>

      <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 520, margin: '0 auto', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: 'clamp(40px,8vw,52px) clamp(16px,4vw,24px) 16px', borderBottom: '1px solid #e8f4f3', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(20px,5vw,26px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Finanzas</h1>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Rendimiento de confirmaciones</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', boxShadow: '0 2px 10px rgba(46,196,182,0.25)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.6)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{Number(walletBalance).toFixed(2)} tkn</span>
            </div>
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{ flex: 1, padding: '9px 0', borderRadius: 12, fontSize: 13, fontWeight: 700, border: `2px solid ${filter === f.key ? '#2EC4B6' : '#e8f4f3'}`, background: filter === f.key ? '#f0fafa' : '#fff', color: filter === f.key ? '#0f766e' : '#94a3b8', cursor: 'pointer', transition: 'all 0.15s', fontFamily: F }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 'clamp(12px,3vw,16px)', paddingBottom: 100, display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Hero — Ingresos confirmados */}
          <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 24, padding: 'clamp(18px,4vw,24px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(46,196,182,0.12)', pointerEvents: 'none' }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Ingresos confirmados</p>
            <p style={{ fontSize: 'clamp(40px,9vw,56px)', fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '-2px', lineHeight: 1 }}>
              {loading ? '—' : `${Number(ingresos).toFixed(2)}€`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'rgba(46,196,182,0.2)', color: '#2EC4B6' }}>
                {loading ? '—' : confirmados} pedidos confirmados
              </span>
            </div>

            {/* Barra pendiente */}
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Por confirmar</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.7)' }}>{loading ? '—' : `${Number(ingresosPendiente).toFixed(2)}€`}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  background: 'linear-gradient(90deg,#2EC4B6,#80ED99)',
                  width: `${ingresos + ingresosPendiente > 0 ? (ingresosPendiente / (ingresos + ingresosPendiente)) * 100 : 0}%`,
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: '5px 0 0', fontWeight: 500 }}>{loading ? '—' : pendientes} pedidos pendientes de llamada</p>
            </div>
          </div>

          {/* Tasas — gauge visual */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Tasa de confirmación', value: tasaConfirmacion, color: '#2EC4B6', bg: '#f0fdf4', border: '#bbf7d0', textColor: '#0f766e' },
              { label: 'Tasa de entrega', value: tasaEntrega, color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', textColor: '#0369a1' },
            ].map(m => (
              <div key={m.label} style={{ background: m.bg, borderRadius: 20, padding: 'clamp(14px,3vw,18px)', border: `1.5px solid ${m.border}`, textAlign: 'center' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: m.textColor, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px', opacity: 0.7 }}>{m.label}</p>

                {/* Gauge circular */}
                <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 10px' }}>
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="28" fill="none" stroke={m.border} strokeWidth="6"/>
                    <circle cx="36" cy="36" r="28" fill="none" stroke={m.color} strokeWidth="6"
                      strokeDasharray={`${(loading ? 0 : m.value) / 100 * 175.9} 175.9`}
                      strokeLinecap="round"
                      transform="rotate(-90 36 36)"
                      style={{ transition: 'stroke-dasharray 0.8s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: m.textColor }}>{loading ? '—' : `${m.value}%`}</span>
                  </div>
                </div>

                {/* Barra lineal */}
                <div style={{ height: 4, background: m.border, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: m.color, width: loading ? '0%' : `${m.value}%`, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Resumen de llamadas */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(14px,3vw,18px)', border: '1px solid #e8f4f3' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Resumen de llamadas</p>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6' }}>
                {loading ? '—' : totalLlamadas} total
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Confirmados',   value: confirmados,  total: totalLlamadas, cfg: CALL_STATUS_CONFIG.confirmed },
                { label: 'No contestó',   value: noContesto,   total: totalLlamadas, cfg: CALL_STATUS_CONFIG.no_answer },
                { label: 'Cancelados',    value: cancelados,   total: totalLlamadas, cfg: CALL_STATUS_CONFIG.cancelled },
              ].map(row => {
                const pct = row.total > 0 ? (row.value / row.total) * 100 : 0
                return (
                  <div key={row.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.cfg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{row.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{loading ? '—' : `${pct.toFixed(0)}%`}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: row.cfg.color }}>{loading ? '—' : row.value}</span>
                      </div>
                    </div>
                    <div style={{ height: 5, background: row.cfg.bg, borderRadius: 3, overflow: 'hidden', border: `1px solid ${row.cfg.border}` }}>
                      <div style={{ height: '100%', borderRadius: 3, background: row.cfg.color, width: loading ? '0%' : `${pct}%`, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pedidos recientes */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(14px,3vw,18px)', border: '1px solid #e8f4f3' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 14px' }}>Pedidos recientes</p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <div style={{ width: 22, height: 22, border: '3px solid #e8f4f3', borderTopColor: '#2EC4B6', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Sin pedidos</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No hay pedidos en este periodo</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentOrders.map((order: any, i: number) => {
                  const cfg = CALL_STATUS_CONFIG[order.call_status] ?? CALL_STATUS_CONFIG.pending
                  return (
                    <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < recentOrders.length - 1 ? '1px solid #f0fafa' : 'none', animation: 'fadeIn 0.2s ease both', animationDelay: `${i * 0.03}s` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 11, background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                          </svg>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.customers?.first_name} {order.customers?.last_name}
                          </p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>#{order.order_number}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>{order.total_price}€</p>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}