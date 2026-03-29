'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Props = {
  accountId: string
  walletBalance: number
}

type Filter = 'today' | 'week' | 'month'

const FILTER_LABELS: Record<Filter, string> = {
  today: 'Hoy',
  week: 'Semana',
  month: 'Mes',
}

const CATEGORIES = [
  { value: 'ads',         label: 'Publicidad',   icon: '📢' },
  { value: 'envios',      label: 'Envíos',        icon: '🚚' },
  { value: 'devolucion',  label: 'Devolución',    icon: '↩️' },
  { value: 'herramientas',label: 'Herramientas',  icon: '🛠️' },
  { value: 'general',     label: 'General',       icon: '💼' },
  { value: 'otro',        label: 'Otro',          icon: '📌' },
]

const TYPE_LABELS: Record<string, { label: string; icon: string; bg: string }> = {
  order_analysis_charge: { label: 'Análisis IA',    icon: '🤖', bg: '#f0f0ff' },
  call_charge:           { label: 'Llamada',         icon: '📞', bg: '#fff7ed' },
  report_charge:         { label: 'Informe',         icon: '📄', bg: '#f0f9ff' },
  payment_topup:         { label: 'Recarga',         icon: '💳', bg: '#e1f5ee' },
  coupon_credit:         { label: 'Cupón',           icon: '🎁', bg: '#e1f5ee' },
  admin_grant:           { label: 'Ajuste admin',    icon: '⚙️', bg: '#f7f8fa' },
  refund:                { label: 'Devolución',      icon: '↩️', bg: '#e1f5ee' },
  manual_adjustment:     { label: 'Ajuste manual',   icon: '✏️', bg: '#f7f8fa' },
}

export default function FinanzasClient({ accountId, walletBalance }: Props) {
  const [filter, setFilter] = useState<Filter>('week')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ concept: '', amount: '', category: 'general', expense_date: new Date().toISOString().split('T')[0], notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [filter])

  async function loadData() {
    setLoading(true)
    try {
      const [ordersRes, expensesRes, movementsRes] = await Promise.all([
        fetch(`/api/finances/summary?filter=${filter}`),
        fetch(`/api/expenses?filter=${filter}`),
        fetch(`/api/finances/movements?filter=${filter}`),
      ])
      const orders = await ordersRes.json()
      const expenses = await expensesRes.json()
      const movements = await movementsRes.json()
      setData({ orders, expenses, movements })
    } finally {
      setLoading(false)
    }
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
        setModalOpen(false)
        setForm({ concept: '', amount: '', category: 'general', expense_date: new Date().toISOString().split('T')[0], notes: '' })
        loadData()
      }
    } finally {
      setSaving(false)
    }
  }

  const ingresos = data?.orders?.total_ingresos ?? 0
  const totalGastosIA = data?.movements?.total_ia ?? 0
  const totalGastosManuales = data?.expenses?.expenses?.reduce((s: number, e: any) => s + Number(e.amount), 0) ?? 0
  const totalAds = data?.expenses?.expenses?.filter((e: any) => e.category === 'ads').reduce((s: number, e: any) => s + Number(e.amount), 0) ?? 0
  const totalGastos = totalGastosIA + totalGastosManuales
  const beneficio = ingresos - totalGastos
  const roi = totalAds > 0 ? (ingresos / totalAds).toFixed(1) : '—'
  const margen = ingresos > 0 ? ((beneficio / ingresos) * 100).toFixed(1) : '0'

  const allMovements = [
    ...(data?.movements?.items ?? []).map((m: any) => ({
      id: m.id,
      label: TYPE_LABELS[m.type]?.label ?? m.type,
      icon: TYPE_LABELS[m.type]?.icon ?? '💰',
      bg: TYPE_LABELS[m.type]?.bg ?? '#f7f8fa',
      amount: Number(m.amount),
      date: m.created_at,
      isToken: true,
    })),
    ...(data?.expenses?.expenses ?? []).map((e: any) => ({
      id: e.id,
      label: e.concept,
      icon: CATEGORIES.find(c => c.value === e.category)?.icon ?? '💼',
      bg: '#fef2f2',
      amount: -Number(e.amount),
      date: e.created_at ?? e.expense_date,
      isToken: false,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 15)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 shrink-0" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.05)' }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Finanzas</h1>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-medium"
            style={{ background: '#2EC4B6' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-70" />
            {Number(walletBalance).toFixed(2)} tokens
          </div>
        </div>
        <div className="flex gap-2">
          {(Object.keys(FILTER_LABELS) as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: filter === f ? '#1a1a1a' : '#f1f0ea',
                color: filter === f ? '#fff' : '#5f5e5a',
                border: 'none',
              }}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-3">

        {/* Métrica principal — Ingresos */}
        <div className="bg-white rounded-3xl p-5" style={{ border: '0.5px solid rgba(0,0,0,0.05)' }}>
          <p className="text-xs text-gray-400 mb-1">Ingresos</p>
          <p className="text-4xl font-semibold text-gray-900">{ingresos.toFixed(2)}€</p>
          <div
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full mt-2"
            style={{ background: '#e1f5ee', color: '#085041' }}
          >
            ↑ {data?.orders?.delivered_count ?? 0} pedidos entregados
          </div>
        </div>

        {/* Grid métricas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-3xl p-4" style={{ border: '0.5px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs text-gray-400 mb-1">Beneficio neto</p>
            <p className="text-2xl font-semibold" style={{ color: beneficio >= 0 ? '#2EC4B6' : '#ef4444' }}>
              {beneficio.toFixed(2)}€
            </p>
            <p className="text-xs text-gray-400 mt-1">margen {margen}%</p>
          </div>
          <div className="bg-white rounded-3xl p-4" style={{ border: '0.5px solid rgba(0,0,0,0.05)' }}>
            <p className="text-xs text-gray-400 mb-1">Inversión ads</p>
            <p className="text-2xl font-semibold text-gray-900">{totalAds.toFixed(2)}€</p>
            <p className="text-xs text-gray-400 mt-1">ROI {roi}x</p>
          </div>
        </div>

        {/* Gastos totales */}
        <div className="bg-white rounded-3xl p-4" style={{ border: '0.5px solid rgba(0,0,0,0.05)' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 mb-1">Gastos totales</p>
              <p className="text-2xl font-semibold text-gray-900">{totalGastos.toFixed(2)}€</p>
            </div>
            <div className="text-right text-xs text-gray-400 space-y-1">
              <p>IA: {totalGastosIA.toFixed(4)} tokens</p>
              <p>Manual: {totalGastosManuales.toFixed(2)}€</p>
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white rounded-3xl p-5" style={{ border: '0.5px solid rgba(0,0,0,0.05)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">Actividad reciente</p>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-white"
              style={{ background: '#2EC4B6', border: 'none', cursor: 'pointer' }}
            >
              + Gasto
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-300 text-sm">Cargando...</div>
          ) : allMovements.length === 0 ? (
            <div className="text-center py-8 text-gray-300 text-sm">Sin actividad en este periodo</div>
          ) : (
            <div className="space-y-1">
              {allMovements.map(m => (
                <div key={m.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: '0.5px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0"
                      style={{ background: m.bg, fontSize: 14 }}
                    >
                      {m.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{m.label}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(m.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: m.amount >= 0 ? '#2EC4B6' : '#ef4444' }}
                  >
                    {m.amount >= 0 ? '+' : ''}{m.amount.toFixed(m.isToken ? 4 : 2)}{m.isToken ? '' : '€'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal añadir gasto */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white w-full max-w-md rounded-t-3xl p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Añadir gasto</h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-sm"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Concepto</label>
                  <input
                    type="text"
                    placeholder="Ej: Facebook Ads enero"
                    value={form.concept}
                    onChange={e => setForm(p => ({ ...p, concept: e.target.value }))}
                    className="w-full px-4 py-3 rounded-2xl text-sm text-gray-800 outline-none"
                    style={{ background: '#f7f8fa', border: '0.5px solid rgba(0,0,0,0.06)' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Importe (€)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl text-sm text-gray-800 outline-none"
                      style={{ background: '#f7f8fa', border: '0.5px solid rgba(0,0,0,0.06)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Fecha</label>
                    <input
                      type="date"
                      value={form.expense_date}
                      onChange={e => setForm(p => ({ ...p, expense_date: e.target.value }))}
                      className="w-full px-4 py-3 rounded-2xl text-sm text-gray-800 outline-none"
                      style={{ background: '#f7f8fa', border: '0.5px solid rgba(0,0,0,0.06)' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Categoría</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setForm(p => ({ ...p, category: c.value }))}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-medium transition-all"
                        style={{
                          background: form.category === c.value ? '#2EC4B6' : '#f7f8fa',
                          color: form.category === c.value ? '#fff' : '#5f5e5a',
                          border: form.category === c.value ? 'none' : '0.5px solid rgba(0,0,0,0.06)',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ fontSize: 12 }}>{c.icon}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddExpense}
                  disabled={saving || !form.concept || !form.amount}
                  className="w-full py-4 rounded-2xl text-sm font-medium text-white disabled:opacity-50"
                  style={{ background: '#2EC4B6', border: 'none', cursor: 'pointer' }}
                >
                  {saving ? 'Guardando...' : 'Guardar gasto'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}