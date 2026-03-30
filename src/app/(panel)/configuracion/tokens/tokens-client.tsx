'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'

export default function TokensClient({ wallet, packs, accountId }: { wallet: any, packs: any[], accountId: string }) {
  const [balance, setBalance] = useState(Number(wallet?.balance ?? 0))
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  useRealtime([{
    table: 'wallet_movements',
    filter: `account_id=eq.${accountId}`,
    onInsert: async () => {
      const sc = createClient()
      const { data: w } = await sc.from('wallets').select('balance').eq('account_id', accountId).single()
      if (w) setBalance(Number(w.balance))
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
      if (data.ok) { setCouponMsg(`✓ +${data.tokens} tokens añadidos`); setCouponCode('') }
      else setCouponMsg(`✕ ${data.error}`)
    } finally { setCouponLoading(false) }
  }

  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #e8f4f3', marginBottom: 10 }
  const fieldWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9, padding: '12px 13px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 13 }
  const fieldInput: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/configuracion" style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Tokens</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Saldo, cupones y packs</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        <div style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 20, padding: '24px 20px', textAlign: 'center', marginBottom: 10, boxShadow: '0 4px 20px rgba(245,158,11,0.25)' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px', fontFamily: F }}>Saldo actual</p>
          <p style={{ fontSize: 54, fontWeight: 800, color: '#fff', margin: 0, lineHeight: 1, letterSpacing: '-2px', fontFamily: F }}>{balance.toFixed(2)}</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '6px 0 0', fontFamily: F }}>tokens disponibles</p>
        </div>

        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', fontFamily: F }}>Canjear cupón</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ ...fieldWrap, flex: 1 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              <input style={{ ...fieldInput, textTransform: 'uppercase', letterSpacing: '0.04em' }} placeholder="CODIGO123" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} />
            </div>
            <button onClick={handleRedeem} disabled={couponLoading || !couponCode} style={{ padding: '12px 18px', borderRadius: 14, border: '2px solid #d97706', background: '#fff', color: '#d97706', cursor: !couponCode ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 800, opacity: !couponCode ? 0.5 : 1, fontFamily: F, boxShadow: '0 2px 6px rgba(217,119,6,0.1)', whiteSpace: 'nowrap' }}>
              {couponLoading ? '...' : 'Canjear'}
            </button>
          </div>
          {couponMsg && (
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: couponMsg.startsWith('✓') ? '#dcfce7' : '#fee2e2', border: `1px solid ${couponMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}` }}>
              <p style={{ fontSize: 12, color: couponMsg.startsWith('✓') ? '#15803d' : '#dc2626', margin: 0, fontWeight: 600, fontFamily: F }}>{couponMsg}</p>
            </div>
          )}
        </div>

        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 12px', fontFamily: F }}>Comprar tokens</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {packs.map((pack, i) => (
              <a key={pack.id} href={pack.lemon_url ?? '#'} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 16, border: i === 1 ? '2px solid #f59e0b' : '1.5px solid #e8f4f3', background: i === 1 ? '#fffbeb' : '#fff', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
                {i === 1 && <div style={{ position: 'absolute', top: 0, right: 0, background: 'linear-gradient(135deg,#f59e0b,#d97706)', padding: '3px 10px', borderRadius: '0 16px 0 12px' }}><span style={{ fontSize: 9, fontWeight: 800, color: '#fff', fontFamily: F }}>MÁS POPULAR</span></div>}
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: F }}>{pack.name}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0', fontFamily: F }}>{pack.tokens} tokens</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: '#d97706', margin: 0, fontFamily: F }}>{pack.price_eur}€</p>
                  <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontFamily: F }}>{(pack.price_eur / pack.tokens).toFixed(2)}€/token</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}