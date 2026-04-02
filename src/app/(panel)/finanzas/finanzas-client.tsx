'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const F = 'system-ui,-apple-system,sans-serif'

type Props = { accountId: string; walletBalance: number }
type Filter = 'today' | 'week' | 'month'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week',  label: 'Semana' },
  { key: 'month', label: 'Mes' },
]

const CALL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  confirmed:    { label: 'Confirmado',    color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  no_answer:    { label: 'No contestó',   color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  cancelled:    { label: 'Cancelado',     color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' },
  voicemail:    { label: 'Buzón de voz',  color: '#6d28d9', bg: '#faf5ff', border: '#e9d5ff' },
  wrong_number: { label: 'Nº incorrecto', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  calling:      { label: 'Llamando...',   color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  pending:      { label: 'Pendiente',     color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
}

function Skeleton({ w = '100%', h = 16, r = 8 }: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,#f1f5f9 25%,#e8f0fe 50%,#f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }} />
  )
}

export default function FinanzasClient({ accountId, walletBalance }: Props) {
  const [filter, setFilter]   = useState<Filter>('week')
  const [data, setData]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const cache                 = useRef<Record<string, any>>({})
  const abortRef              = useRef<AbortController | null>(null)

  const loadData = useCallback(async (f: Filter) => {
    // Si tenemos cache mostrarlo inmediatamente
    if (cache.current[f]) {
      setData(cache.current[f])
      setLoading(false)
      // Refrescar en background silenciosamente
      fetch(`/api/finances/summary?filter=${f}`)
        .then(r => r.json())
        .then(d => { cache.current[f] = d; setData(d) })
        .catch(() => {})
      return
    }

    // Cancelar request anterior si existe
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    try {
      const res = await fetch(`/api/finances/summary?filter=${f}`, {
        signal: abortRef.current.signal,
      })
      const d = await res.json()
      cache.current[f] = d
      setData(d)
    } catch (e: any) {
      if (e.name !== 'AbortError') console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData(filter) }, [filter, loadData])

  // Prefetch otros filtros en background cuando hay tiempo libre
  useEffect(() => {
    const prefetch = async () => {
      const others = (['today', 'week', 'month'] as Filter[]).filter(f => f !== filter && !cache.current[f])
      for (const f of others) {
        try {
          const res = await fetch(`/api/finances/summary?filter=${f}`)
          cache.current[f] = await res.json()
        } catch {}
      }
    }
    const timer = setTimeout(prefetch, 1500)
    return () => clearTimeout(timer)
  }, [filter])

  function handleFilter(f: Filter) {
    setFilter(f) // Optimistic — cambia UI instantáneamente
  }

  const ingresos          = data?.total_ingresos    ?? 0
  const ingresosPendiente = data?.total_pendiente   ?? 0
  const confirmados       = data?.confirmed_count   ?? 0
  const pendientes        = data?.pending_count     ?? 0
  const totalLlamadas     = data?.total_calls       ?? 0
  const noContesto        = data?.no_answer_count   ?? 0
  const cancelados        = data?.cancelled_count   ?? 0
  const tasaConfirmacion  = data?.confirmation_rate ?? 0
  const tasaEntrega       = data?.delivery_rate     ?? 0
  const recentOrders      = data?.recent_orders     ?? []

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .filter-btn { transition: all 0.12s ease; }
        .filter-btn:hover { opacity:0.8; }
        .order-row { transition: background 0.1s; border-radius: 12px; }
        .order-row:hover { background: #f8fafc; }
        @media(min-width:640px) {
          .fin-grid-2 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '20px clamp(16px,4vw,32px) 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Finanzas</h1>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Rendimiento de confirmaciones COD</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, background: '#f0fdf4', border: '1.5px solid #bbf7d0' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f766e' }}>{Number(walletBalance).toFixed(2)} tkn</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {FILTERS.map(f => (
                <button key={f.key} onClick={() => handleFilter(f.key)} className="filter-btn"
                  style={{ padding: '8px 20px', borderRadius: '12px 12px 0 0', fontSize: 13, fontWeight: 700, border: 'none', borderBottom: filter === f.key ? '2px solid #2EC4B6' : '2px solid transparent', background: filter === f.key ? '#f0fdf4' : 'transparent', color: filter === f.key ? '#0f766e' : '#94a3b8', cursor: 'pointer', fontFamily: F }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Hero metrics */}
          <div className="fin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>

            {/* Ingresos confirmados */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,3vw,28px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.25s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Ingresos confirmados</p>
                  {loading
                    ? <><Skeleton w="60%" h={44} r={10} /><div style={{ marginTop: 8 }}><Skeleton w="40%" h={24} r={20} /></div></>
                    : <>
                        <p style={{ fontSize: 'clamp(32px,7vw,48px)', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-2px', lineHeight: 1 }}>
                          {Number(ingresos).toFixed(2)}€
                        </p>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: '#f0fdf4', color: '#0f766e', border: '1px solid #bbf7d0' }}>
                          {confirmados} confirmados
                        </span>
                      </>
                  }
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Por confirmar */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px,3vw,28px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.25s ease 0.05s both' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Por confirmar</p>
                  {loading
                    ? <><Skeleton w="60%" h={44} r={10} /><div style={{ marginTop: 10 }}><Skeleton w="100%" h={5} r={3} /></div></>
                    : <>
                        <p style={{ fontSize: 'clamp(32px,7vw,48px)', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', letterSpacing: '-2px', lineHeight: 1 }}>
                          {Number(ingresosPendiente).toFixed(2)}€
                        </p>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>{pendientes} pendientes</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#92400e' }}>
                              {ingresos + ingresosPendiente > 0 ? `${((ingresosPendiente / (ingresos + ingresosPendiente)) * 100).toFixed(0)}%` : '0%'}
                            </span>
                          </div>
                          <div style={{ height: 5, background: '#fef3c7', borderRadius: 3, overflow: 'hidden', border: '1px solid #fde68a' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: '#f59e0b', width: `${ingresos + ingresosPendiente > 0 ? (ingresosPendiente / (ingresos + ingresosPendiente)) * 100 : 0}%`, transition: 'width 0.6s ease' }} />
                          </div>
                        </div>
                      </>
                  }
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fef3c7', border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tasas */}
          <div className="fin-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {[
              { label: 'Tasa confirmación', value: tasaConfirmacion, color: '#2EC4B6', bg: '#f0fdf4', border: '#bbf7d0', textColor: '#0f766e', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
              { label: 'Tasa de entrega',   value: tasaEntrega,      color: '#5da7ec', bg: '#eff6ff', border: '#bfdbfe', textColor: '#1d4ed8', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            ].map((m, i) => (
              <div key={m.label} style={{ background: '#fff', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: `fadeUp 0.25s ease ${0.1 + i * 0.05}s both` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: 0 }}>{m.label}</p>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: m.bg, border: `1.5px solid ${m.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={m.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={m.icon}/></svg>
                  </div>
                </div>
                {loading
                  ? <><Skeleton w="40%" h={36} r={8} /><div style={{ marginTop: 12 }}><Skeleton w="100%" h={5} r={3} /></div></>
                  : <>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 'clamp(28px,6vw,40px)', fontWeight: 800, color: m.textColor, letterSpacing: '-1px', lineHeight: 1 }}>
                          {m.value}%
                        </span>
                        <div style={{ position: 'relative', width: 48, height: 48, marginBottom: 2 }}>
                          <svg width="48" height="48" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="18" fill="none" stroke={m.border} strokeWidth="5"/>
                            <circle cx="24" cy="24" r="18" fill="none" stroke={m.color} strokeWidth="5"
                              strokeDasharray={`${m.value / 100 * 113.1} 113.1`}
                              strokeLinecap="round" transform="rotate(-90 24 24)"
                              style={{ transition: 'stroke-dasharray 0.8s ease' }}
                            />
                          </svg>
                        </div>
                      </div>
                      <div style={{ height: 5, background: m.bg, borderRadius: 3, overflow: 'hidden', border: `1px solid ${m.border}` }}>
                        <div style={{ height: '100%', borderRadius: 3, background: m.color, width: `${m.value}%`, transition: 'width 0.8s ease' }} />
                      </div>
                    </>
                }
              </div>
            ))}
          </div>

          {/* Resumen llamadas */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.25s ease 0.2s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Resumen de llamadas</p>
              {loading
                ? <Skeleton w={60} h={24} r={20} />
                : <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>{totalLlamadas} total</span>
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {loading
                ? [1,2,3].map(i => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Skeleton w="35%" h={14} r={6} />
                        <Skeleton w="15%" h={14} r={6} />
                      </div>
                      <Skeleton w="100%" h={6} r={4} />
                    </div>
                  ))
                : [
                    { label: 'Confirmados', value: confirmados, cfg: CALL_STATUS_CONFIG.confirmed },
                    { label: 'No contestó', value: noContesto,  cfg: CALL_STATUS_CONFIG.no_answer },
                    { label: 'Cancelados',  value: cancelados,  cfg: CALL_STATUS_CONFIG.cancelled },
                  ].map(row => {
                    const pct = totalLlamadas > 0 ? (row.value / totalLlamadas) * 100 : 0
                    return (
                      <div key={row.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.cfg.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{row.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>{pct.toFixed(0)}%</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: row.cfg.color, minWidth: 20, textAlign: 'right' }}>{row.value}</span>
                          </div>
                        </div>
                        <div style={{ height: 6, background: row.cfg.bg, borderRadius: 4, overflow: 'hidden', border: `1px solid ${row.cfg.border}` }}>
                          <div style={{ height: '100%', borderRadius: 4, background: row.cfg.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    )
                  })
              }
            </div>
          </div>

          {/* Pedidos recientes */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.25s ease 0.25s both' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Pedidos recientes</p>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Skeleton w={38} h={38} r={12} />
                      <div>
                        <Skeleton w={120} h={14} r={6} />
                        <div style={{ marginTop: 5 }}><Skeleton w={60} h={11} r={4} /></div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Skeleton w={60} h={14} r={6} />
                      <div style={{ marginTop: 5 }}><Skeleton w={70} h={18} r={20} /></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Sin pedidos</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No hay pedidos en este periodo</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentOrders.map((order: any, i: number) => {
                  const cfg = CALL_STATUS_CONFIG[order.call_status] ?? CALL_STATUS_CONFIG.pending
                  return (
                    <div key={order.id} className="order-row"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px', borderBottom: i < recentOrders.length - 1 ? '1px solid #f8fafc' : 'none', animation: 'fadeUp 0.2s ease both', animationDelay: `${i * 0.03}s` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: cfg.bg, border: `1.5px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' }}>{order.total_price}€</p>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
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