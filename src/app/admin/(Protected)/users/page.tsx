'use client'

import { useState, useEffect, useCallback } from 'react'

const F = "'DM Sans', system-ui, sans-serif"

const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: '#dcfce7', color: '#15803d', label: 'Activo' },
  suspended: { bg: '#fee2e2', color: '#b91c1c', label: 'Suspendido' },
}

function Badge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? { bg: '#f1f5f9', color: '#475569', label: status }
  return <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>{c.label}</span>
}

function Spinner({ color = '#fff' }: { color?: string }) {
  return <div style={{ width: 13, height: 13, border: `2px solid ${color}40`, borderTopColor: color, borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}

export default function AdminUsersPage() {
  const [accounts, setAccounts]       = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState<any>(null)
  const [tokenAmount, setTokenAmount] = useState('')
  const [tokenDesc, setTokenDesc]     = useState('')
  const [saving, setSaving]           = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/users')
    const data = await res.json()
    setAccounts(data.accounts ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function action(endpoint: string, body: any) {
    setSaving(true)
    try {
      await fetch(endpoint, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      await load()
      if (body.action === 'toggle_status') {
        setSelected((prev: any) => prev ? { ...prev, status: prev.status === 'active' ? 'suspended' : 'active' } : null)
      }
    } finally { setSaving(false) }
  }

  const th: React.CSSProperties = { textAlign: 'left', padding: '11px 16px', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', whiteSpace: 'nowrap' }
  const td: React.CSSProperties = { padding: '13px 16px', fontSize: 13, color: '#374151', borderBottom: '1px solid #f8fafc', verticalAlign: 'middle' }
  const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 11, border: '1.5px solid #e2e8f0', background: '#f8fafc', fontSize: 13, outline: 'none', color: '#0f172a', boxSizing: 'border-box', fontFamily: F }

  return (
    <>
      <style>{`
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .adm-tr { transition: background .12s; }
        .adm-tr:hover { background: #fafafa !important; }
        .adm-inp:focus { border-color: #2EC4B6 !important; box-shadow: 0 0 0 3px rgba(46,196,182,.12) !important; background: #fff !important; }
        .adm-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 16px; }
        .adm-wrap table { min-width: 520px; }
        @media(min-width:768px) { .adm-hm { display: table-cell !important; } }
        @media(max-width:767px) { .adm-hm { display: none !important; } }
      `}</style>

      <div style={{ fontFamily: F }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Usuarios</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>{accounts.length} cuenta{accounts.length !== 1 ? 's' : ''} registrada{accounts.length !== 1 ? 's' : ''}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {selected && (
              <button onClick={() => setSelected(null)} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Volver
              </button>
            )}
            <button onClick={load} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
              Actualizar
            </button>
          </div>
        </div>

        {selected ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, animation: 'fadeIn .2s ease both' }}>
            {/* Info */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid #e8edf2', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 6px 16px rgba(46,196,182,.35)' }}>
                  {selected.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 3px' }}>{selected.name}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{selected.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                <Badge status={selected.status} />
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#f0fdf9', color: '#0f766e', border: '1px solid #99f6e4' }}>{selected.plan}</span>
              </div>
              <button onClick={() => action(`/api/admin/users/${selected.id}`, { action: 'toggle_status' })} disabled={saving}
                style={{ width: '100%', padding: '11px', borderRadius: 13, border: `1.5px solid ${selected.status === 'active' ? '#fecaca' : '#a7f3d0'}`, background: '#fff', color: selected.status === 'active' ? '#dc2626' : '#16a34a', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: saving ? .6 : 1 }}>
                {saving ? <Spinner color={selected.status === 'active' ? '#dc2626' : '#16a34a'} /> : null}
                {selected.status === 'active' ? 'Suspender cuenta' : 'Activar cuenta'}
              </button>
            </div>

            {/* Tokens */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid #e8edf2', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Saldo tokens</p>
              <p style={{ fontSize: 38, fontWeight: 800, color: '#2EC4B6', margin: '0 0 20px', letterSpacing: '-1.5px' }}>
                {Number(selected.wallets?.[0]?.balance ?? 0).toFixed(2)}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="adm-inp" style={inp} type="number" placeholder="Cantidad de tokens" value={tokenAmount} onChange={e => setTokenAmount(e.target.value)} />
                <input className="adm-inp" style={inp} placeholder="Descripción del ajuste" value={tokenDesc} onChange={e => setTokenDesc(e.target.value)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={() => action(`/api/admin/users/${selected.id}`, { action: 'add_tokens', amount: parseFloat(tokenAmount), description: tokenDesc })} disabled={!tokenAmount || saving}
                    style={{ padding: '11px', borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: !tokenAmount ? .5 : 1 }}>
                    {saving ? <Spinner /> : null}+ Añadir
                  </button>
                  <button onClick={() => action(`/api/admin/users/${selected.id}`, { action: 'remove_tokens', amount: parseFloat(tokenAmount), description: tokenDesc })} disabled={!tokenAmount || saving}
                    style={{ padding: '11px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: !tokenAmount ? .5 : 1 }}>
                    {saving ? <Spinner /> : null}− Quitar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, border: '1.5px solid #e8edf2', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.05)' }}>
            <div className="adm-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Usuario</th>
                    <th style={th} className="adm-hm">Plan</th>
                    <th style={th}>Tokens</th>
                    <th style={th} className="adm-hm">Estado</th>
                    <th style={th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={5} style={{ padding: 32, color: '#94a3b8', textAlign: 'center' }}>Cargando...</td></tr>
                  ) : accounts.map(acc => (
                    <tr key={acc.id} className="adm-tr">
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                            {acc.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: '#0f172a', margin: 0, fontSize: 13 }}>{acc.name}</p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{acc.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={td} className="adm-hm">
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: '#f0fdf9', color: '#0f766e', border: '1px solid #99f6e4' }}>{acc.plan}</span>
                      </td>
                      <td style={td}>
                        <span style={{ fontWeight: 800, color: '#2EC4B6', fontSize: 15 }}>{Number(acc.wallets?.[0]?.balance ?? 0).toFixed(2)}</span>
                      </td>
                      <td style={td} className="adm-hm"><Badge status={acc.status} /></td>
                      <td style={td}>
                        <button onClick={() => { setSelected(acc); setTokenAmount(''); setTokenDesc('') }}
                          style={{ padding: '8px 14px', borderRadius: 10, border: '1.5px solid #bfdbfe', background: '#fff', color: '#3b82f6', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: F }}>
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}