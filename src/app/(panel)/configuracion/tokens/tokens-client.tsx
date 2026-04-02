'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'

export default function TokensClient({ wallet, packs, accountId }: { wallet: any; packs: any[]; accountId: string }) {
  const [balance, setBalance]       = useState(Number(wallet?.balance ?? 0))
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg]   = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [localPacks, setLocalPacks] = useState(packs)

  // Realtime — saldo actualizado al instante
  useRealtime([{
    table: 'wallet_movements',
    filter: `account_id=eq.${accountId}`,
    onInsert: async () => {
      const sc = createClient()
      const { data: w } = await sc.from('wallets').select('balance').eq('account_id', accountId).single()
      if (w) setBalance(Number(w.balance))
    },
  }])

  // Realtime — packs sincronizados con el admin
  useRealtime([{
    table: 'token_packs',
    onUpdate: async () => {
      const sc = createClient()
      const { data } = await sc.from('token_packs').select('*').eq('active', true).order('price_eur')
      if (data) setLocalPacks(data)
    },
    onInsert: async () => {
      const sc = createClient()
      const { data } = await sc.from('token_packs').select('*').eq('active', true).order('price_eur')
      if (data) setLocalPacks(data)
    },
  }])

  async function handleRedeem() {
    if (!couponCode) return
    setCouponLoading(true)
    setCouponMsg('')
    try {
      const res = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      })
      const data = await res.json()
      if (data.ok) {
        setCouponMsg(`✓ +${data.tokens} tokens añadidos`)
        setCouponCode('')
      } else {
        setCouponMsg(`✕ ${data.error}`)
      }
    } finally { setCouponLoading(false) }
  }

  // Coste por acción
  const costs = [
    { label: 'Análisis IA',       cost: '0.17', color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10' },
    { label: 'Llamada exitosa/min', cost: '0.22', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8' },
    { label: 'Llamada fallida',    cost: '0.05', color: '#92400e', bg: '#fef3c7', border: '#fde68a', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636' },
    { label: 'WhatsApp IA',       cost: '0.004', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd', icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z' },
    { label: 'Informe semanal',    cost: '0.5',  color: '#ec4899', bg: '#fdf2f8', border: '#fbcfe8', icon: 'M18 20v-10 M12 20v-16 M6 20v-6' },
    { label: 'Reanálisis manual',  cost: '0.01', color: '#475569', bg: '#f1f5f9', border: '#e2e8f0', icon: 'M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 0 0 5.64 5.64L1 10' },
  ]

  // Pack más popular = el del medio
  const popularIdx = Math.floor(localPacks.length / 2)

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }
        .pack-card { transition:all 0.15s ease; }
        .pack-card:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.1)!important; }
        .pack-card:active { transform:scale(0.98); }
        .cost-row:hover { background:#f8fafc; border-radius:10px; }
        .coupon-inp:focus-within { border-color:#d97706!important; box-shadow:0 0 0 3px rgba(217,119,6,0.08); }
        .btn-redeem { transition:all 0.15s ease; }
        .btn-redeem:hover { opacity:0.85; transform:translateY(-1px); }
        @media(min-width:640px) {
          .packs-grid { grid-template-columns:repeat(3,1fr)!important; }
          .costs-grid  { grid-template-columns:repeat(2,1fr)!important; }
        }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/configuracion"
              style={{ width: 36, height: 36, borderRadius: 11, background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Tokens</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Saldo, cupones y packs</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Hero saldo */}
          <div style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 24, padding: 'clamp(24px,5vw,32px)', textAlign: 'center', boxShadow: '0 8px 32px rgba(245,158,11,0.25)', position: 'relative', overflow: 'hidden', animation: 'fadeUp 0.2s ease both' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Saldo disponible</p>
            </div>
            <p style={{ fontSize: 'clamp(52px,12vw,72px)', fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1, letterSpacing: '-3px' }}>
              {balance.toFixed(2)}
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 600 }}>tokens · Sin caducidad</p>
          </div>

          {/* Cupón */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.05s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#fffbeb', border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Canjear cupón</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Introduce tu código de descuento</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="coupon-inp"
                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, transition: 'all 0.15s' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <input
                  style={{ border: 'none', background: 'transparent', fontSize: 14, fontWeight: 700, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F, letterSpacing: '0.05em', minWidth: 0 }}
                  placeholder="CODIGO123"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleRedeem()}
                />
              </div>
              <button onClick={handleRedeem} disabled={couponLoading || !couponCode} className="btn-redeem"
                style={{ padding: '12px 20px', borderRadius: 14, border: 'none', background: !couponCode ? '#f1f5f9' : 'linear-gradient(135deg,#f59e0b,#d97706)', color: !couponCode ? '#94a3b8' : '#fff', cursor: !couponCode ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 800, fontFamily: F, whiteSpace: 'nowrap', boxShadow: couponCode ? '0 4px 14px rgba(217,119,6,0.25)' : 'none', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
                {couponLoading
                  ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : 'Canjear'
                }
              </button>
            </div>
            {couponMsg && (
              <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 12, background: couponMsg.startsWith('✓') ? '#f0fdf4' : '#fef2f2', border: `1px solid ${couponMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={couponMsg.startsWith('✓') ? '#16a34a' : '#dc2626'} strokeWidth="2.5" strokeLinecap="round">
                  {couponMsg.startsWith('✓')
                    ? <polyline points="20 6 9 17 4 12"/>
                    : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  }
                </svg>
                <p style={{ fontSize: 13, color: couponMsg.startsWith('✓') ? '#15803d' : '#dc2626', margin: 0, fontWeight: 600 }}>{couponMsg}</p>
              </div>
            )}
          </div>

          {/* Packs */}
          <div style={{ animation: 'fadeUp 0.2s ease 0.1s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Packs de tokens</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Sincronizado en tiempo real
              </div>
            </div>

            {localPacks.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', textAlign: 'center', border: '1.5px solid #f1f5f9' }}>
                <p style={{ fontSize: 14, color: '#94a3b8', margin: 0 }}>No hay packs disponibles por el momento</p>
              </div>
            ) : (
              <div className="packs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                {localPacks.map((pack, i) => {
                  const isPopular = i === popularIdx
                  const costPerToken = (pack.price_eur / pack.tokens).toFixed(3)
                  return (
                    <a key={pack.id} href={pack.lemon_url ?? '#'} target="_blank" rel="noopener noreferrer"
                      className="pack-card"
                      style={{ textDecoration: 'none', display: 'block', background: isPopular ? 'linear-gradient(135deg,#0f172a,#1e293b)' : '#fff', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: isPopular ? 'none' : '1.5px solid #f1f5f9', boxShadow: isPopular ? '0 8px 32px rgba(15,23,42,0.2)' : '0 2px 12px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden', transform: isPopular ? 'scale(1.02)' : 'scale(1)' }}>

                      {/* Glow effect para el popular */}
                      {isPopular && (
                        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.15),transparent 70%)', pointerEvents: 'none' }} />
                      )}

                      {isPopular && (
                        <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 20, background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', letterSpacing: '0.05em' }}>
                          MÁS POPULAR
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <p style={{ fontSize: 16, fontWeight: 800, color: isPopular ? '#fff' : '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{pack.name}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: isPopular ? 'rgba(245,158,11,0.2)' : '#fffbeb', color: isPopular ? '#fbbf24' : '#d97706', border: isPopular ? '1px solid rgba(245,158,11,0.3)' : '1px solid #fde68a' }}>
                              {pack.tokens} tokens
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <p style={{ fontSize: 'clamp(26px,5vw,32px)', fontWeight: 800, color: isPopular ? '#fbbf24' : '#d97706', margin: '0 0 2px', letterSpacing: '-1px', lineHeight: 1 }}>
                            {pack.price_eur}€
                          </p>
                          <p style={{ fontSize: 11, color: isPopular ? 'rgba(255,255,255,0.4)' : '#94a3b8', margin: 0 }}>
                            {costPerToken}€/token
                          </p>
                        </div>
                      </div>

                      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: isPopular ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>Sin caducidad · Un solo pago</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 12, background: isPopular ? 'rgba(245,158,11,0.15)' : '#fffbeb', border: isPopular ? '1px solid rgba(245,158,11,0.2)' : '1px solid #fde68a' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: isPopular ? '#fbbf24' : '#d97706' }}>Comprar</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isPopular ? '#fbbf24' : '#d97706'} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* Coste por acción */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.15s both' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>Coste por acción</p>
            <div className="costs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              {costs.map((c, i) => (
                <div key={i} className="cost-row"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px', borderBottom: i < costs.length - 1 ? '1px solid #f8fafc' : 'none', transition: 'background 0.1s', cursor: 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2" strokeLinecap="round"><path d={c.icon}/></svg>
                    </div>
                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{c.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: c.color, padding: '3px 10px', borderRadius: 20, background: c.bg, border: `1px solid ${c.border}` }}>
                    {c.cost} tkn
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}