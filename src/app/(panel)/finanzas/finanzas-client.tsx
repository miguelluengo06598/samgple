'use client'

import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────
type Props   = { accountId: string; walletBalance: number }
type Filter  = 'today' | 'week' | 'month'

// ─── Static config (hoisted) ───────────────────────────────────────────────────
const F = 'system-ui,-apple-system,sans-serif'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week',  label: 'Semana' },
  { key: 'month', label: 'Mes' },
]

const CALL_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  confirmed:    { label: 'Confirmado',    color: '#0f766e', bg: '#f0fdf4', dot: '#22c55e' },
  no_answer:    { label: 'No contestó',   color: '#92400e', bg: '#fef3c7', dot: '#f59e0b' },
  cancelled:    { label: 'Cancelado',     color: '#b91c1c', bg: '#fef2f2', dot: '#ef4444' },
  voicemail:    { label: 'Buzón de voz',  color: '#6d28d9', bg: '#faf5ff', dot: '#a78bfa' },
  wrong_number: { label: 'Nº incorrecto', color: '#475569', bg: '#f8fafc', dot: '#94a3b8' },
  calling:      { label: 'Llamando…',     color: '#0284c7', bg: '#f0f9ff', dot: '#38bdf8' },
  pending:      { label: 'Pendiente',     color: '#475569', bg: '#f8fafc', dot: '#94a3b8' },
}

// ─── Shimmer skeleton ──────────────────────────────────────────────────────────
const Skeleton = memo(function Skeleton({
  w = '100%', h = 16, r = 8,
}: { w?: string | number; h?: number; r?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: 'linear-gradient(90deg,#f1f5f9 25%,#e8edf2 50%,#f1f5f9 75%)',
      backgroundSize: '300% 100%',
      animation: 'fin-shimmer 1.5s ease-in-out infinite',
    }} />
  )
})

// ─── Mini sparkline (pure SVG, zero deps) ──────────────────────────────────────
const Sparkline = memo(function Sparkline({
  points, color, height = 40,
}: { points: number[]; color: string; height?: number }) {
  const w = 100
  const max = Math.max(...points, 1)
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w
    const y = height - (v / max) * height
    return `${x},${y}`
  })
  const pathD = `M${coords.join('L')}`
  const areaD = `M${coords[0]}L${coords.join('L')}L${w},${height}L0,${height}Z`

  return (
    <svg viewBox={`0 0 ${w} ${height}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`}/>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
})

// ─── Area chart (token usage over time) ───────────────────────────────────────
const AreaChart = memo(function AreaChart({
  data, loading,
}: { data: { label: string; value: number }[]; loading: boolean }) {
  const h = 100
  const w = 400
  const max = Math.max(...data.map(d => d.value), 1)
  const step = w / Math.max(data.length - 1, 1)

  const coords = data.map((d, i) => ({
    x: i * step,
    y: h - (d.value / max) * (h - 12),
  }))

  const pathD = coords.length > 1
    ? `M${coords.map(c => `${c.x},${c.y}`).join('L')}`
    : ''
  const areaD = coords.length > 1
    ? `M${coords[0].x},${h}L${coords.map(c => `${c.x},${c.y}`).join('L')}L${coords[coords.length - 1].x},${h}Z`
    : ''

  if (loading) {
    return (
      <div style={{ padding: '0 4px' }}>
        <Skeleton h={100} r={8} />
      </div>
    )
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2EC4B6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#2EC4B6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.5, 1].map(f => (
        <line key={f} x1="0" y1={h * f} x2={w} y2={h * f}
          stroke="#f1f5f9" strokeWidth="1"/>
      ))}
      {data.length > 1 && (
        <>
          <path d={areaD} fill="url(#chart-area)"/>
          <path d={pathD} fill="none" stroke="#2EC4B6" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
          {/* Dots */}
          {coords.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="3"
              fill="#fff" stroke="#2EC4B6" strokeWidth="2"/>
          ))}
        </>
      )}
      {data.length === 0 && (
        <text x={w / 2} y={h / 2} textAnchor="middle" fill="#94a3b8" fontSize="13">
          Sin datos
        </text>
      )}
    </svg>
  )
})

// ─── Metric card ───────────────────────────────────────────────────────────────
const MetricCard = memo(function MetricCard({
  label, value, sub, color, bg, icon, loading, delay = 0, spark,
}: {
  label: string; value: string; sub?: string;
  color: string; bg: string; icon: React.ReactNode;
  loading: boolean; delay?: number; spark?: number[]
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 20,
      padding: '20px 22px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column', gap: 12,
      animation: `fin-up 0.25s ease ${delay}s both`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color,
        }}>
          {icon}
        </div>
      </div>

      {loading
        ? <><Skeleton h={36} w="55%" r={8}/><Skeleton h={12} w="40%" r={6}/></>
        : <>
            <div>
              <p style={{ fontSize: 30, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </p>
              {sub && <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontWeight: 500 }}>{sub}</p>}
            </div>
            {spark && spark.length > 1 && (
              <Sparkline points={spark} color={color} height={32} />
            )}
          </>
      }
    </div>
  )
})

// ─── Transaction row ───────────────────────────────────────────────────────────
const OrderRow = memo(function OrderRow({
  order, index,
}: { order: any; index: number }) {
  const cfg = CALL_STATUS_CONFIG[order.call_status] ?? CALL_STATUS_CONFIG.pending
  const name = `${order.customers?.first_name ?? ''} ${order.customers?.last_name ?? ''}`.trim() || 'Cliente'
  const init = name.charAt(0).toUpperCase()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '11px 4px',
      borderBottom: '1px solid #f8fafc',
      animation: `fin-up 0.18s ease ${index * 0.025}s both`,
    }}
      className="fin-order-row"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {/* Avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: cfg.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: cfg.color,
          letterSpacing: '-0.5px',
        }}>
          {init}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {name}
          </p>
          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
            #{order.order_number}
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px' }}>
          {Number(order.total_price ?? 0).toFixed(2)}€
        </span>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
          background: cfg.bg, color: cfg.color,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
          {cfg.label}
        </span>
      </div>
    </div>
  )
})

// ─── Global CSS (static) ───────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes fin-shimmer { 0%{background-position:300% 0} 100%{background-position:-300% 0} }
  @keyframes fin-up      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fin-pulse   { 0%,100%{opacity:1} 50%{opacity:0.45} }
  @keyframes fin-beam    {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }

  .fin-order-row { transition: background 0.1s; border-radius: 12px; }
  .fin-order-row:hover { background: #f8fafc; }

  .fin-filter-tab { transition: all 0.12s; }
  .fin-filter-tab:hover { color: #475569 !important; }

  @media(min-width:640px) {
    .fin-metrics-3 { grid-template-columns: repeat(3,1fr) !important; }
    .fin-hero-2    { grid-template-columns: 1fr 1fr !important; }
  }
`

// ─── Main component ────────────────────────────────────────────────────────────
export default function FinanzasClient({ accountId, walletBalance }: Props) {
  // ══════════════════════════════════════════════════════════════════════════
  // MOTOR SAGRADO — lógica original 100% intacta
  // ══════════════════════════════════════════════════════════════════════════
  const [filter, setFilter]   = useState<Filter>('week')
  const [data, setData]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const cache                 = useRef<Record<string, any>>({})
  const abortRef              = useRef<AbortController | null>(null)

  const loadData = useCallback(async (f: Filter) => {
    if (cache.current[f]) {
      setData(cache.current[f])
      setLoading(false)
      fetch(`/api/finances/summary?filter=${f}`)
        .then(r => r.json())
        .then(d => { cache.current[f] = d; setData(d) })
        .catch(() => {})
      return
    }
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
    setFilter(f)
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
  const entregados        = data?.delivered_count   ?? 0
  const recentOrders      = data?.recent_orders     ?? []
  // ══════════════════════════════════════════════════════════════════════════
  // FIN MOTOR SAGRADO
  // ══════════════════════════════════════════════════════════════════════════

  // Sparkline data derivado de métricas (decorativo)
  const spark = useMemo(() => ({
    ingresos:  [ingresos * 0.4, ingresos * 0.6, ingresos * 0.5, ingresos * 0.8, ingresos * 0.7, ingresos],
    pendiente: [ingresosPendiente * 0.3, ingresosPendiente * 0.5, ingresosPendiente * 0.45, ingresosPendiente * 0.7, ingresosPendiente * 0.85, ingresosPendiente],
    tasa:      [tasaConfirmacion * 0.7, tasaConfirmacion * 0.8, tasaConfirmacion * 0.75, tasaConfirmacion * 0.9, tasaConfirmacion * 0.95, tasaConfirmacion],
  }), [ingresos, ingresosPendiente, tasaConfirmacion])

  // Chart data
  const chartData = useMemo(() => {
    if (!data?.daily_breakdown) return []
    return data.daily_breakdown as { label: string; value: number }[]
  }, [data])

  const totalPct = ingresos + ingresosPendiente > 0
    ? ((ingresosPendiente / (ingresos + ingresosPendiente)) * 100).toFixed(0)
    : '0'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* ── Sticky header ── */}
        <div style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          padding: '16px clamp(16px,4vw,28px) 0',
          borderBottom: '1px solid #f1f5f9',
          position: 'sticky', top: 'var(--header-height, 0px)', zIndex: 10,
        }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: '0 0 3px', letterSpacing: '-0.5px' }}>
                  Finanzas
                </h1>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 500 }}>
                  Rendimiento de confirmaciones COD
                </p>
              </div>

              {/* Wallet badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '6px 12px', borderRadius: 20,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', animation: 'fin-pulse 2.4s infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f766e', letterSpacing: '-0.3px', fontVariantNumeric: 'tabular-nums' }}>
                  {Number(walletBalance).toFixed(2)} tkn
                </span>
              </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 2 }}>
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => handleFilter(f.key)}
                  className="fin-filter-tab"
                  style={{
                    padding: '7px 18px',
                    borderRadius: '10px 10px 0 0',
                    fontSize: 12, fontWeight: 700,
                    border: 'none',
                    borderBottom: filter === f.key ? '2px solid #2EC4B6' : '2px solid transparent',
                    background: filter === f.key ? 'rgba(46,196,182,0.06)' : 'transparent',
                    color: filter === f.key ? '#0f766e' : '#94a3b8',
                    cursor: 'pointer', fontFamily: F,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{
          maxWidth: 900, margin: '0 auto',
          padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,28px) 48px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>

          {/* ── HERO: wallet glassmorphism card ── */}
          <div style={{
            borderRadius: 24,
            padding: 'clamp(24px,4vw,32px)',
            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #2EC4B6 100%)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(46,196,182,0.25), 0 2px 8px rgba(15,118,110,0.2)',
            animation: 'fin-up 0.2s ease both',
          }}>
            {/* Glassmorphism decorative circles */}
            <div aria-hidden style={{
              position: 'absolute', top: -60, right: -60, width: 220, height: 220,
              borderRadius: '50%', background: 'rgba(255,255,255,0.07)',
              pointerEvents: 'none',
            }} />
            <div aria-hidden style={{
              position: 'absolute', bottom: -40, left: '30%', width: 160, height: 160,
              borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Balance disponible
                  </p>
                  {loading
                    ? <div style={{ height: 56, width: 180, borderRadius: 10, background: 'rgba(255,255,255,0.15)', animation: 'fin-shimmer 1.5s infinite' }} />
                    : <p style={{ fontSize: 'clamp(40px,8vw,56px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-3px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                        {Number(ingresos).toFixed(2)}€
                      </p>
                  }
                </div>

                {/* Pedidos entregados counter */}
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '12px 18px', borderRadius: 16,
                  background: 'rgba(255,255,255,0.13)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
                  minWidth: 90, textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Entregados
                    </span>
                  </div>
                  {loading
                    ? <div style={{ height: 34, width: 50, borderRadius: 8, background: 'rgba(255,255,255,0.15)', animation: 'fin-shimmer 1.5s infinite' }} />
                    : <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                        {entregados}
                      </span>
                  }
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 4, fontWeight: 600 }}>pedidos</span>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { label: `${confirmados} confirmados`, bg: 'rgba(255,255,255,0.15)' },
                  { label: `${pendientes} pendientes`, bg: 'rgba(0,0,0,0.12)' },
                  { label: `${totalLlamadas} llamadas`, bg: 'rgba(0,0,0,0.1)' },
                ].map(s => (
                  <span key={s.label} style={{
                    fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                    background: s.bg, color: '#fff',
                    backdropFilter: 'blur(4px)',
                  }}>
                    {loading ? '— —' : s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── 3 metric cards ── */}
          <div className="fin-metrics-3" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            <MetricCard
              label="Por confirmar"
              value={`${Number(ingresosPendiente).toFixed(2)}€`}
              sub={`${totalPct}% del total pendiente`}
              color="#d97706" bg="#fffbeb"
              loading={loading} delay={0.05}
              spark={spark.pendiente}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              }
            />
            <MetricCard
              label="Tasa confirmación"
              value={`${tasaConfirmacion}%`}
              sub={loading ? undefined : tasaConfirmacion >= 80 ? 'Por encima del objetivo' : 'Por debajo del objetivo'}
              color="#2EC4B6" bg="rgba(46,196,182,0.08)"
              loading={loading} delay={0.1}
              spark={spark.tasa}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                </svg>
              }
            />
            <MetricCard
              label="Tasa de entrega"
              value={`${tasaEntrega}%`}
              sub="Pedidos entregados"
              color="#6366f1" bg="#eef2ff"
              loading={loading} delay={0.15}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              }
            />
          </div>

          {/* ── Calls breakdown ── */}
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: 'clamp(18px,3vw,24px)',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            animation: 'fin-up 0.25s ease 0.2s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
                Resumen de llamadas
              </p>
              {loading
                ? <Skeleton w={64} h={22} r={20} />
                : <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 11px', borderRadius: 20, background: '#f8fafc', color: '#64748b', border: '1px solid #f1f5f9' }}>
                    {totalLlamadas} total
                  </span>
              }
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {loading
                ? [1, 2, 3].map(i => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                        <Skeleton w="38%" h={13} r={6}/>
                        <Skeleton w="12%" h={13} r={6}/>
                      </div>
                      <Skeleton h={6} r={4}/>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 7, height: 7, borderRadius: '50%', background: row.cfg.dot, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{row.label}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{pct.toFixed(0)}%</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: row.cfg.color, minWidth: 22, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                              {row.value}
                            </span>
                          </div>
                        </div>
                        <div style={{ height: 6, background: row.cfg.bg, borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 4,
                            background: row.cfg.dot,
                            width: `${pct}%`,
                            transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)',
                          }} />
                        </div>
                      </div>
                    )
                  })
              }
            </div>
          </div>

          {/* ── Area chart (token/revenue over time) ── */}
          {(chartData.length > 0 || loading) && (
            <div style={{
              background: '#fff', borderRadius: 20,
              padding: 'clamp(18px,3vw,24px)',
              border: '1px solid #f1f5f9',
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              animation: 'fin-up 0.25s ease 0.25s both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
                  Tendencia
                </p>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                  {filter === 'today' ? 'Por horas' : filter === 'week' ? 'Por días' : 'Por semanas'}
                </span>
              </div>
              <AreaChart data={chartData} loading={loading} />

              {/* X labels */}
              {!loading && chartData.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f8fafc' }}>
                  {chartData.map((d, i) => (
                    <span key={i} style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{d.label}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Transactions table ── */}
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: 'clamp(18px,3vw,24px)',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            animation: 'fin-up 0.25s ease 0.3s both',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>
                Pedidos recientes
              </p>
              {!loading && recentOrders.length > 0 && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8' }}>
                  {recentOrders.length} pedido{recentOrders.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Skeleton w={38} h={38} r={12}/>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <Skeleton w={110} h={13} r={6}/>
                        <Skeleton w={60} h={10} r={4}/>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                      <Skeleton w={60} h={14} r={6}/>
                      <Skeleton w={72} h={18} r={20}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: '#f8fafc', border: '1px solid #f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.2px' }}>
                  Sin pedidos
                </p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                  No hay pedidos en este periodo
                </p>
              </div>
            ) : (
              <div>
                {recentOrders.map((order: any, i: number) => (
                  <OrderRow key={order.id} order={order} index={i} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}