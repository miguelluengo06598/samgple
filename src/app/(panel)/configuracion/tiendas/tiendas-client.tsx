'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function TiendasClient({ stores }: { stores: any[] }) {
  const router = useRouter()

  async function handleDisconnect(storeId: string) {
    if (!confirm('¿Desconectar esta tienda?')) return
    await fetch(`/api/stores/${storeId}`, { method: 'DELETE' })
    router.refresh()
  }

  async function handleConnect() {
    window.location.href = '/api/shopify/auth'
  }

  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #e8f4f3', marginBottom: 10 }
  const btnOutline = (color: string, border: string, shadow: string): React.CSSProperties => ({
    width: '100%', padding: '15px 18px', borderRadius: 16, border: `2px solid ${border}`,
    background: '#fff', color, cursor: 'pointer', fontSize: 14, fontWeight: 800,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    boxShadow: shadow, fontFamily: F, marginBottom: 10,
  })

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/configuracion" style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Tiendas</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Conecta y gestiona tus tiendas Shopify</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        {stores.length === 0 ? (
          <div style={{ ...card, textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ width: 52, height: 52, background: '#f0fdf4', borderRadius: 16, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bbf7d0' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: F }}>Sin tiendas conectadas</p>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontFamily: F }}>Conecta tu primera tienda Shopify</p>
          </div>
        ) : (
          <div style={card}>
            {stores.map((store, i) => (
              <div key={store.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < stores.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, background: '#f0fdf4', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bbf7d0', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: F }}>{store.name ?? store.shopify_domain}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: F }}>{store.shopify_domain}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDisconnect(store.id)} style={{ fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 20, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontFamily: F }}>
                  Desconectar
                </button>
              </div>
            ))}
          </div>
        )}

        <button onClick={handleConnect} style={{ ...btnOutline('#0f766e', '#2EC4B6', '0 2px 8px rgba(46,196,182,0.12)') }}>
          <span>Conectar nueva tienda</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
    </div>
  )
}