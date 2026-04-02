'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function TiendasClient({ stores: initialStores }: { stores: any[] }) {
  const router = useRouter()
  const [stores, setStores]         = useState(initialStores)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [confirmId, setConfirmId]   = useState<string | null>(null)

  async function handleDisconnect(storeId: string) {
    setDisconnecting(storeId)
    try {
      await fetch(`/api/stores/${storeId}`, { method: 'DELETE' })
      setStores(prev => prev.filter(s => s.id !== storeId))
      setConfirmId(null)
    } finally {
      setDisconnecting(null)
    }
  }

  async function handleConnect() {
    setConnecting(true)
    window.location.href = '/api/shopify/auth'
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
        .store-card { transition:all 0.15s ease; }
        .store-card:hover { box-shadow:0 6px 24px rgba(0,0,0,0.08)!important; }
        .btn-connect { transition:all 0.15s ease; }
        .btn-connect:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(46,196,182,0.25)!important; }
        .btn-connect:active { transform:scale(0.98); }
        .btn-disconnect { transition:all 0.15s ease; }
        .btn-disconnect:hover { background:#fef2f2!important; }
      `}</style>

      {/* Modal confirmación */}
      {confirmId && (
        <div onClick={() => setConfirmId(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)', animation: 'fadeIn 0.15s ease', fontFamily: F }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', width: '100%', maxWidth: 480, borderRadius: '24px 24px 0 0', padding: '24px 24px 36px', animation: 'slideUp 0.2s ease' }}>
            <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 8px' }}>¿Desconectar tienda?</p>
            <p style={{ fontSize: 14, color: '#64748b', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
              Los pedidos existentes se mantendrán pero no entrarán nuevos pedidos de esta tienda.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => setConfirmId(null)}
                style={{ padding: '14px', borderRadius: 14, border: '1.5px solid #f1f5f9', background: '#f8fafc', color: '#64748b', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: F }}>
                Cancelar
              </button>
              <button onClick={() => handleDisconnect(confirmId)} disabled={!!disconnecting}
                style={{ padding: '14px', borderRadius: 14, border: 'none', background: '#dc2626', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: disconnecting ? 0.7 : 1 }}>
                {disconnecting
                  ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : null
                }
                Desconectar
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/configuracion"
              style={{ width: 36, height: 36, borderRadius: 11, background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Tiendas Shopify</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{stores.length} tienda{stores.length !== 1 ? 's' : ''} conectada{stores.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, animation: 'fadeUp 0.2s ease both' }}>
            {[
              { label: 'Conectadas', value: String(stores.length),                                                      color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
              { label: 'Activas',    value: String(stores.filter(s => s.status === 'active').length),                   color: '#22c55e', bg: '#dcfce7', border: '#bbf7d0' },
              { label: 'Inactivas',  value: String(stores.filter(s => s.status !== 'active').length),                   color: '#92400e', bg: '#fef3c7', border: '#fde68a' },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 18, padding: '14px 16px', border: `1.5px solid ${s.border}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', opacity: 0.7 }}>{s.label}</p>
                <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color: s.color, margin: 0, letterSpacing: '-0.5px' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Lista tiendas */}
          {stores.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 24, padding: '48px 24px', textAlign: 'center', border: '1.5px dashed #e2e8f0', animation: 'fadeUp 0.2s ease 0.05s both' }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Sin tiendas conectadas</p>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 24px', lineHeight: 1.6 }}>Conecta tu tienda Shopify para que los pedidos entren automáticamente en SAMGPLE</p>
              <button onClick={handleConnect} disabled={connecting} className="btn-connect"
                style={{ padding: '13px 28px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(46,196,182,0.3)' }}>
                {connecting
                  ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                }
                Conectar tienda Shopify
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stores.map((store, i) => (
                <div key={store.id} className="store-card"
                  style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,20px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: `fadeUp 0.2s ease ${i * 0.05}s both` }}>

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {store.name ?? store.shopify_domain}
                        </p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {store.shopify_domain}
                        </p>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: store.status === 'active' ? '#f0fdf4' : '#fef3c7', color: store.status === 'active' ? '#0f766e' : '#92400e', border: `1px solid ${store.status === 'active' ? '#bbf7d0' : '#fde68a'}` }}>
                          {store.status === 'active' ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setConfirmId(store.id)} className="btn-disconnect"
                      style={{ fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 12, border: '1.5px solid #f1f5f9', background: '#f8fafc', color: '#94a3b8', cursor: 'pointer', fontFamily: F, flexShrink: 0, whiteSpace: 'nowrap' }}>
                      Desconectar
                    </button>
                  </div>

                  {/* Info extra */}
                  <div style={{ marginTop: 14, padding: '12px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                      <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Webhook activo</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>Pedidos en tiempo real</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botón conectar nueva */}
          {stores.length > 0 && (
            <button onClick={handleConnect} disabled={connecting} className="btn-connect"
              style={{ width: '100%', padding: '15px 20px', borderRadius: 18, border: '2px solid #2EC4B6', background: '#fff', color: '#0f766e', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(46,196,182,0.1)', animation: 'fadeUp 0.2s ease 0.15s both' }}>
              <span>{connecting ? 'Conectando...' : 'Conectar nueva tienda'}</span>
              {connecting
                ? <div style={{ width: 16, height: 16, border: '2px solid hsla(174, 62%, 48%, 0.30)', borderTopColor: '#2EC4B6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              }
            </button>
          )}

          {/* Info Shopify */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,20px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.2s both' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Cómo funciona la integración</p>
            {[
              { n: '1', title: 'Conecta con OAuth',      desc: 'Autenticación segura directamente con Shopify' },
              { n: '2', title: 'Webhook automático',      desc: 'Los pedidos entran solos en tiempo real' },
              { n: '3', title: 'Análisis IA inmediato',   desc: 'Cada pedido se analiza al instante al llegar' },
            ].map(s => (
              <div key={s.n} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{s.n}</span>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}