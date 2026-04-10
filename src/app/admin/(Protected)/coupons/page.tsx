'use client'

import { useState, useEffect, useCallback } from 'react'

const F = "'DM Sans', system-ui, sans-serif"

function Spinner({ color = '#fff' }: { color?: string }) {
  return <div style={{ width: 13, height: 13, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [newCoupon, setNewCoupon] = useState({ code: '', tokens: '', max_uses: '1' })

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/coupons')
    const data = await res.json()
    setCoupons(data.coupons ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function handleToggle(id: string, active: boolean) {
    await fetch('/api/admin/coupons', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active: !active }) })
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c))
  }

  async function handleCreate() {
    if (!newCoupon.code || !newCoupon.tokens) return
    setSaving(true)
    try {
      await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: newCoupon.code, tokens: parseFloat(newCoupon.tokens), max_uses: parseInt(newCoupon.max_uses) }),
      })
      setNewCoupon({ code: '', tokens: '', max_uses: '1' })
      await load()
    } finally { setSaving(false) }
  }

  const th: React.CSSProperties = { textAlign: 'left', padding: '11px 16px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' }
  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 11, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13, outline: 'none', color: '#0f172a', boxSizing: 'border-box', fontFamily: F }

  return (
    <>
      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
        .adm-tr { transition: background .12s; }
        .adm-tr:hover { background: #fafafa !important; }
        .adm-inp:focus { border-color: #2EC4B6 !important; box-shadow: 0 0 0 3px rgba(46,196,182,.12) !important; background: #fff !important; }
        .adm-wrap { overflow-x: auto; border-radius: 16px; }
        .adm-wrap table { min-width: 440px; }
        @media(min-width:768px) { .adm-hm { display: table-cell !important; } .adm-layout { grid-template-columns: 1fr 320px !important; } }
        @media(max-width:767px) { .adm-hm { display: none !important; } }
      `}</style>

      <div style={{ fontFamily: F }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Cupones</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{coupons.filter(c => c.active).length} activos · {coupons.length} total</p>
          </div>
          <button onClick={load} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Actualizar
          </button>
        </div>

        <div className="adm-layout" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          {/* Tabla */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
            <div className="adm-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Código</th>
                    <th style={th}>Tokens</th>
                    <th style={th} className="adm-hm">Usos</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ padding: 32, color: '#94a3b8', textAlign: 'center' }}>Cargando...</td></tr>
                  ) : coupons.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: 40, color: '#94a3b8', textAlign: 'center' }}>Sin cupones todavía</td></tr>
                  ) : coupons.map(c => (
                    <tr key={c.id} className="adm-tr">
                      <td style={td}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#0f766e', background: '#f0fdf9', padding: '4px 10px', borderRadius: 8, fontSize: 12, border: '1px solid #99f6e4' }}>{c.code}</span>
                      </td>
                      <td style={td}><span style={{ fontWeight: 800, color: '#2EC4B6', fontSize: 15 }}>{c.tokens}</span></td>
                      <td style={td} className="adm-hm"><span style={{ color: '#64748b' }}>{c.uses ?? 0}/{c.max_uses}</span></td>
                      <td style={td}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: c.active ? '#dcfce7' : '#fee2e2', color: c.active ? '#15803d' : '#b91c1c' }}>
                          {c.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={td}>
                        <button onClick={() => handleToggle(c.id, c.active)}
                          style={{ padding: '8px 14px', borderRadius: 10, border: `1.5px solid ${c.active ? '#fecaca' : '#a7f3d0'}`, background: '#fff', color: c.active ? '#dc2626' : '#16a34a', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: F }}>
                          {c.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formulario */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid #e8edf2', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#fdf2f8', border: '1px solid #fbcfe8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="#ec4899"/></svg>
              </div>
              <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Nuevo cupón</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Código', key: 'code', ph: 'PROMO2025', upper: true, type: 'text' },
                { label: 'Tokens', key: 'tokens', ph: '10', type: 'number' },
                { label: 'Usos máximos', key: 'max_uses', ph: '1', type: 'number' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5, display: 'block' }}>{f.label}</label>
                  <input className="adm-inp" style={inp} type={f.type} placeholder={f.ph}
                    value={(newCoupon as any)[f.key]}
                    onChange={e => setNewCoupon(p => ({ ...p, [f.key]: f.upper ? e.target.value.toUpperCase() : e.target.value }))} />
                </div>
              ))}
              <button onClick={handleCreate} disabled={!newCoupon.code || !newCoupon.tokens || saving}
                style={{ width: '100%', padding: '12px', borderRadius: 13, border: 'none', background: 'linear-gradient(135deg,#ec4899,#db2777)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: (!newCoupon.code || !newCoupon.tokens) ? .5 : 1, fontFamily: F, marginTop: 4 }}>
                {saving ? <Spinner /> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>}
                Crear cupón
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}