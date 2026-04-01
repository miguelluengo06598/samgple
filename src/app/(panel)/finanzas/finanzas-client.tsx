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

const CATEGORIES = [
  { value: 'ads',          label: 'Publicidad' },
  { value: 'envios',       label: 'Envíos' },
  { value: 'devolucion',   label: 'Devolución' },
  { value: 'herramientas', label: 'Herramientas' },
  { value: 'general',      label: 'General' },
  { value: 'otro',         label: 'Otro' },
]

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  order_analysis_charge: { label: 'Análisis IA',   color: '#6d28d9', bg: '#faf5ff', border: '#e9d5ff' },
  call_charge:           { label: 'Llamada',        color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  report_charge:         { label: 'Informe',        color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  payment_topup:         { label: 'Recarga',        color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  coupon_credit:         { label: 'Cupón',          color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  admin_grant:           { label: 'Ajuste admin',   color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  refund:                { label: 'Devolución',     color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  manual_adjustment:     { label: 'Ajuste manual',  color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
}

const CAT_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  ads:           { color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' },
  envios:        { color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  devolucion:    { color: '#b91c1c', bg: '#fee2e2', border: '#fecaca' },
  herramientas:  { color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
  general:       { color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  otro:          { color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
}

export default function FinanzasClient({ accountId, walletBalance }: Props) {
  const [filter, setFilter]     = useState<Filter>('week')
  const [data, setData]         = useState<any>(null)
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({
    concept: '', amount: '', category: 'general',
    expense_date: new Date().toISOString().split('T')[0], notes: '',
  })

  useEffect(() => { loadData() }, [filter])

  async function loadData() {
    setLoading(true)
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`/api/finances/summary?filter=${filter}`),
        fetch(`/api/expenses?filter=${filter}`),
        fetch(`/api/finances/movements?filter=${filter}`),
      ])
      setData({
        orders:    await r1.json(),
        expenses:  await r2.json(),
        movements: await r3.json(),
      })
    } finally { setLoading(false) }
  }

  async function handleAddExpense() {
    if (!form.concept || !form.amount) return
    setSaving(true)
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setModal(false)
        setForm({ concept: '', amount: '', category: 'general', expense_date: new Date().toISOString().split('T')[0], notes: '' })
        loadData()
      }
    } finally { setSaving(false) }
  }

  const ingresos           = data?.orders?.total_ingresos ?? 0
  const totalGastosIA      = data?.movements?.total_ia ?? 0
  const expenses           = data?.expenses?.expenses ?? []
  const totalGastosManuales = expenses.reduce((s: number, e: any) => s + Number(e.amount), 0)
  const totalAds           = expenses.filter((e: any) => e.category === 'ads').reduce((s: number, e: any) => s + Number(e.amount), 0)
  const totalGastos        = totalGastosIA + totalGastosManuales
  const beneficio          = ingresos - totalGastos
  const roi                = totalAds > 0 ? (ingresos / totalAds).toFixed(1) : '—'
  const margen             = ingresos > 0 ? ((beneficio / ingresos) * 100).toFixed(1) : '0'
  const deliveredCount     = data?.orders?.delivered_count ?? 0
  const confirmRate        = data?.orders?.confirmation_rate ?? null

  const allMovements = [
    ...(data?.movements?.items ?? []).map((m: any) => ({
      id: m.id, date: m.created_at, isToken: true,
      label: TYPE_CONFIG[m.type]?.label ?? m.type,
      amount: Number(m.amount),
      cfg: TYPE_CONFIG[m.type] ?? { color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
    })),
    ...expenses.map((e: any) => ({
      id: e.id, date: e.created_at ?? e.expense_date, isToken: false,
      label: e.concept,
      amount: -Number(e.amount),
      cfg: CAT_CONFIG[e.category] ?? CAT_CONFIG.general,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20)

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 14,
    border: '1.5px solid #e8f4f3', background: '#f8fafc',
    fontSize: 14, color: '#0f172a', outline: 'none',
    fontFamily: F, boxSizing: 'border-box',
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity:0;transform:translateY(8px) } to { opacity:1;transform:translateY(0) } }
        .fin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .fin-metrics { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        @media (max-width: 480px) {
          .fin-metrics { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 340px) {
          .fin-grid { grid-template-columns: 1fr; }
          .fin-metrics { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 520, margin: '0 auto', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: 'clamp(40px,8vw,52px) clamp(16px,4vw,24px) 16px', borderBottom: '1px solid #e8f4f3', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(20px,5vw,26px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>Finanzas</h1>
              <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>Rendimiento de tu negocio</p>
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

          {/* Hero — Ingresos */}
          <div style={{ background: 'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius: 24, padding: 'clamp(18px,4vw,24px)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(46,196,182,0.15)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(46,196,182,0.08)', pointerEvents: 'none' }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Ingresos {FILTERS.find(f => f.key === filter)?.label}</p>
            <p style={{ fontSize: 'clamp(36px,8vw,52px)', fontWeight: 800, color: '#fff', margin: '0 0 12px', letterSpacing: '-1.5px', lineHeight: 1 }}>
              {loading ? '—' : `${ingresos.toFixed(2)}€`}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'rgba(46,196,182,0.2)', color: '#2EC4B6' }}>
                ↑ {deliveredCount} confirmados
              </span>
              {confirmRate !== null && (
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                  {confirmRate}% tasa confirm.
                </span>
              )}
            </div>
          </div>

          {/* Métricas grid */}
          <div className="fin-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              {
                label: 'Beneficio neto',
                value: loading ? '—' : `${beneficio >= 0 ? '+' : ''}${beneficio.toFixed(2)}€`,
                sub: `Margen ${margen}%`,
                color: beneficio >= 0 ? '#0f766e' : '#dc2626',
                bg: beneficio >= 0 ? '#f0fdf4' : '#fef2f2',
                border: beneficio >= 0 ? '#bbf7d0' : '#fecaca',
              },
              {
                label: 'Inversión ads',
                value: loading ? '—' : `${totalAds.toFixed(2)}€`,
                sub: `ROI ${roi}x`,
                color: '#1d4ed8',
                bg: '#f0f9ff',
                border: '#bae6fd',
              },
              {
                label: 'Gastos totales',
                value: loading ? '—' : `${totalGastos.toFixed(2)}€`,
                sub: `IA + manual`,
                color: '#92400e',
                bg: '#fffbeb',
                border: '#fde68a',
              },
            ].map(m => (
              <div key={m.label} style={{ background: m.bg, borderRadius: 20, padding: 'clamp(12px,3vw,16px)', border: `1.5px solid ${m.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px', opacity: 0.8 }}>{m.label}</p>
                <p style={{ fontSize: 'clamp(16px,4vw,22px)', fontWeight: 800, color: m.color, margin: '0 0 2px', letterSpacing: '-0.5px', lineHeight: 1 }}>{m.value}</p>
                <p style={{ fontSize: 10, color: m.color, opacity: 0.6, margin: 0, fontWeight: 500 }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Desglose gastos */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(14px,3vw,18px)', border: '1px solid #e8f4f3' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 12px' }}>Desglose de gastos</p>
            {[
              { label: 'Tokens IA (llamadas + análisis)', value: totalGastosIA, suffix: ' tkn', color: '#6d28d9', bg: '#faf5ff', border: '#e9d5ff' },
              { label: 'Publicidad (ads)', value: totalAds, suffix: '€', color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' },
              { label: 'Gastos manuales', value: totalGastosManuales - totalAds, suffix: '€', color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f0fafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#64748b' }}>{row.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.color }}>{loading ? '—' : `${row.value.toFixed(2)}${row.suffix}`}</span>
              </div>
            ))}
          </div>

          {/* Actividad reciente */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(14px,3vw,18px)', border: '1px solid #e8f4f3' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Actividad reciente</p>
              <button onClick={() => setModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 20, border: '2px solid #2EC4B6', background: '#fff', color: '#0f766e', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: F }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Añadir gasto
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 24, height: 24, border: '3px solid #e8f4f3', borderTopColor: '#2EC4B6', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : allMovements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Sin actividad</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No hay movimientos en este periodo</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {allMovements.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < allMovements.length - 1 ? '1px solid #f0fafa' : 'none', animation: 'fadeIn 0.2s ease both', animationDelay: `${i * 0.03}s` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 11, background: m.cfg.bg, border: `1px solid ${m.cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={m.cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {m.isToken
                            ? <><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>
                            : <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>
                          }
                        </svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160 }}>{m.label}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
                          {new Date(m.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 800, color: m.amount >= 0 ? '#0f766e' : '#dc2626', margin: 0 }}>
                        {m.amount >= 0 ? '+' : ''}{Math.abs(m.amount).toFixed(m.isToken ? 4 : 2)}{m.isToken ? '' : '€'}
                      </p>
                      <p style={{ fontSize: 10, color: m.cfg.color, margin: 0, fontWeight: 600 }}>{m.cfg.label ?? m.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal añadir gasto */}
      {modal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModal(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', fontFamily: F }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 520, borderRadius: '28px 28px 0 0', padding: 'clamp(20px,4vw,28px)', paddingBottom: 'clamp(28px,6vw,40px)', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Añadir gasto</h2>
              <button onClick={() => setModal(false)}
                style={{ width: 32, height: 32, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'block' }}>Concepto</label>
                <input style={inp} placeholder="Ej: Facebook Ads enero" value={form.concept} onChange={e => setForm(p => ({ ...p, concept: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'block' }}>Importe (€)</label>
                  <input style={inp} type="number" placeholder="0.00" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'block' }}>Fecha</label>
                  <input style={inp} type="date" value={form.expense_date} onChange={e => setForm(p => ({ ...p, expense_date: e.target.value }))} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>Categoría</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                  {CATEGORIES.map(c => {
                    const active = form.category === c.value
                    const cfg = CAT_CONFIG[c.value] ?? CAT_CONFIG.general
                    return (
                      <button key={c.value} onClick={() => setForm(p => ({ ...p, category: c.value }))}
                        style={{ padding: '10px 6px', borderRadius: 12, fontSize: 12, fontWeight: 700, border: `2px solid ${active ? cfg.color : '#e8f4f3'}`, background: active ? cfg.bg : '#fff', color: active ? cfg.color : '#94a3b8', cursor: 'pointer', fontFamily: F, transition: 'all 0.15s' }}>
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button onClick={handleAddExpense} disabled={saving || !form.concept || !form.amount}
                style={{ width: '100%', padding: '15px', borderRadius: 16, border: 'none', background: (!form.concept || !form.amount) ? '#e2e8f0' : 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: (!form.concept || !form.amount) ? '#94a3b8' : '#fff', cursor: (!form.concept || !form.amount) ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 800, fontFamily: F, transition: 'all 0.15s' }}>
                {saving ? 'Guardando...' : 'Guardar gasto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}