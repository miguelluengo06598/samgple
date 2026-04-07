'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'

// Links de checkout de Lemon Squeezy por variant ID
const LEMON_URLS: Record<string, string> = {
  '1499065': 'https://samgple.lemonsqueezy.com/buy/1499065', // Starter 19.99€
  '1499070': 'https://samgple.lemonsqueezy.com/buy/1499070', // Pro 39.99€
  '1499072': 'https://samgple.lemonsqueezy.com/buy/1499072', // Business 89.99€
}

const costs = [
  { label: 'Análisis IA pedido',   cost: '0.17', icon: '🧠', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { label: 'Llamada exitosa/min',  cost: '0.22', icon: '📞', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  { label: 'Llamada fallida',      cost: '0.05', icon: '📵', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { label: 'WhatsApp IA',          cost: '0.004',icon: '💬', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { label: 'Informe semanal',      cost: '0.50', icon: '📊', color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
  { label: 'Reanálisis manual',    cost: '0.02', icon: '🔄', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
]

export default function TokensClient({ wallet, packs, accountId }: { wallet: any; packs: any[]; accountId: string }) {
  const [balance, setBalance]           = useState(Number(wallet?.balance ?? 0))
  const [couponCode, setCouponCode]     = useState('')
  const [couponMsg, setCouponMsg]       = useState('')
  const [couponError, setCouponError]   = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)
  const [localPacks, setLocalPacks]     = useState(packs)

  useRealtime([{
    table: 'wallet_movements',
    filter: `account_id=eq.${accountId}`,
    onInsert: async () => {
      const sc = createClient()
      const { data: w } = await sc.from('wallets').select('balance').eq('account_id', accountId).single()
      if (w) setBalance(Number(w.balance))
    },
  }])

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
    setCouponError(false)
    try {
      const res = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      })
      const data = await res.json()
      if (data.ok) {
        setCouponMsg(`+${data.tokens} tokens añadidos a tu saldo`)
        setCouponError(false)
        setCouponCode('')
      } else {
        setCouponMsg(data.error)
        setCouponError(true)
      }
    } finally { setCouponLoading(false) }
  }

  const popularIdx = Math.floor(localPacks.length / 2)

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes countUp { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }

        .pack-card { transition:transform .18s ease,box-shadow .18s ease; }
        .pack-card:hover { transform:translateY(-4px)!important; }
        .pack-card:active { transform:scale(.98)!important; }

        .cost-row { transition:background .12s; border-radius:12px; }
        .cost-row:hover { background:#f8fafc; }

        .coupon-wrap:focus-within { border-color:#2EC4B6!important; box-shadow:0 0 0 3px rgba(46,196,182,.1)!important; }

        .buy-btn { transition:all .15s ease; }
        .buy-btn:hover { opacity:.88; transform:translateY(-1px); }
        .buy-btn:active { transform:scale(.97); }

        @media(min-width:600px) {
          .packs-grid { grid-template-columns:repeat(3,1fr)!important; }
          .costs-grid  { grid-template-columns:repeat(2,1fr)!important; }
        }
      `}</style>

      <div style={{ background:'#f8fafc', minHeight:'100vh', fontFamily:F }}>

        {/* Header */}
        <div style={{ background:'#fff', padding:'16px clamp(16px,4vw,32px)', borderBottom:'1px solid #f1f5f9', position:'sticky', top:56, zIndex:9 }}>
          <div style={{ maxWidth:700, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
            <Link href="/configuracion" style={{ width:36, height:36, borderRadius:11, background:'#f8fafc', border:'1.5px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, textDecoration:'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize:'clamp(17px,3.5vw,22px)', fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-.4px' }}>Tokens</h1>
              <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Saldo, packs y cupones</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:700, margin:'0 auto', padding:'clamp(20px,4vw,36px) clamp(16px,4vw,32px) 56px', display:'flex', flexDirection:'column', gap:20 }}>

          {/* ── Saldo ── */}
          <div style={{ animation:'fadeUp .2s ease both' }}>
            <div style={{
              background:'linear-gradient(135deg,#0c1a2e 0%,#0f2a1e 100%)',
              borderRadius:24, padding:'clamp(28px,5vw,40px)',
              display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20,
              position:'relative', overflow:'hidden',
              boxShadow:'0 12px 40px rgba(15,23,42,.2)',
            }}>
              <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }}/>

              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:10 }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2s infinite' }}/>
                  <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.45)', textTransform:'uppercase', letterSpacing:'.1em' }}>Saldo disponible</span>
                </div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:10 }}>
                  <span style={{ fontSize:'clamp(52px,10vw,72px)', fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:'-3px', animation:'countUp .3s ease both' }}>
                    {balance.toFixed(2)}
                  </span>
                  <span style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,.4)', marginBottom:8 }}>tkn</span>
                </div>
                <p style={{ fontSize:12, color:'rgba(255,255,255,.35)', margin:'8px 0 0', fontWeight:500 }}>Sin caducidad · Se acumulan</p>
              </div>

              <div style={{ position:'relative', display:'flex', flexDirection:'column', gap:8, minWidth:160 }}>
                {[
                  { label:'Análisis restantes', value: Math.floor(balance / 0.17), unit:'análisis' },
                  { label:'Llamadas restantes', value: Math.floor(balance / 0.22), unit:'min de llamada' },
                ].map(item => (
                  <div key={item.label} style={{ padding:'10px 14px', background:'rgba(255,255,255,.06)', borderRadius:14, border:'1px solid rgba(255,255,255,.08)' }}>
                    <p style={{ fontSize:10, color:'rgba(255,255,255,.3)', margin:'0 0 2px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em' }}>{item.label}</p>
                    <p style={{ fontSize:18, fontWeight:800, color:'rgba(255,255,255,.8)', margin:0, letterSpacing:'-.5px' }}>
                      ~{item.value} <span style={{ fontSize:11, fontWeight:500, color:'rgba(255,255,255,.35)' }}>{item.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Packs ── */}
          <div style={{ animation:'fadeUp .2s ease .07s both' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', margin:0 }}>Packs de tokens</p>
              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2.4s infinite' }}/>
                <span style={{ fontSize:11, color:'#94a3b8', fontWeight:500 }}>Tiempo real</span>
              </div>
            </div>

            {localPacks.length === 0 ? (
              <div style={{ background:'#fff', borderRadius:20, padding:'36px 24px', textAlign:'center', border:'1.5px solid #f1f5f9' }}>
                <p style={{ fontSize:14, color:'#94a3b8', margin:0 }}>No hay packs disponibles</p>
              </div>
            ) : (
              <div className="packs-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
                {localPacks.map((pack, i) => {
                  const isPopular    = i === popularIdx
                  const variantId    = String(pack.variant_id ?? '')
                  const checkoutUrl  = pack.lemon_url ?? LEMON_URLS[variantId] ?? '#'
                  const costPerToken = pack.price_eur && pack.tokens
                    ? (pack.price_eur / pack.tokens).toFixed(3)
                    : '—'

                  return (
                    <a
                      key={pack.id}
                      href={checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pack-card"
                      style={{
                        textDecoration:'none', display:'block',
                        background: isPopular
                          ? 'linear-gradient(135deg,#2EC4B6 0%,#1D9E75 100%)'
                          : '#fff',
                        borderRadius:20,
                        border: isPopular ? 'none' : '1.5px solid #f1f5f9',
                        padding:'clamp(20px,3vw,28px)',
                        boxShadow: isPopular
                          ? '0 12px 40px rgba(46,196,182,.3)'
                          : '0 2px 12px rgba(0,0,0,.04)',
                        position:'relative', overflow:'hidden',
                      }}
                    >
                      {isPopular && (
                        <div style={{ position:'absolute', top:-50, right:-50, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }}/>
                      )}

                      {isPopular && (
                        <div style={{ position:'absolute', top:16, right:16, fontSize:9, fontWeight:800, padding:'4px 10px', borderRadius:20, background:'rgba(255,255,255,.2)', color:'#fff', letterSpacing:'.06em' }}>
                          MÁS POPULAR
                        </div>
                      )}

                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:16 }}>
                        <div>
                          <p style={{ fontSize:16, fontWeight:800, color: isPopular ? '#fff' : '#0f172a', margin:'0 0 6px', letterSpacing:'-.3px' }}>
                            {pack.name}
                          </p>
                          <div style={{
                            display:'inline-flex', alignItems:'center', gap:5,
                            padding:'4px 12px', borderRadius:20,
                            background: isPopular ? 'rgba(255,255,255,.15)' : '#f0fdf4',
                            border: isPopular ? '1px solid rgba(255,255,255,.2)' : '1px solid #bbf7d0',
                          }}>
                            <span style={{ fontSize:13, fontWeight:800, color: isPopular ? '#fff' : '#0f766e' }}>{pack.tokens} tokens</span>
                          </div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <p style={{ fontSize:'clamp(28px,5vw,36px)', fontWeight:900, color: isPopular ? '#fff' : '#0f172a', margin:'0 0 2px', letterSpacing:'-1.5px', lineHeight:1 }}>
                            {pack.price_eur}€
                          </p>
                          <p style={{ fontSize:11, color: isPopular ? 'rgba(255,255,255,.5)' : '#94a3b8', margin:0, fontWeight:500 }}>
                            {costPerToken}€/token
                          </p>
                        </div>
                      </div>

                      <div style={{
                        display:'flex', alignItems:'center', justifyContent:'space-between',
                        paddingTop:14,
                        borderTop: isPopular ? '1px solid rgba(255,255,255,.15)' : '1px solid #f1f5f9',
                      }}>
                        <span style={{ fontSize:11, color: isPopular ? 'rgba(255,255,255,.5)' : '#94a3b8', fontWeight:500 }}>
                          Un solo pago · Sin caducidad
                        </span>
                        <div className="buy-btn" style={{
                          display:'flex', alignItems:'center', gap:6,
                          padding:'8px 16px', borderRadius:12,
                          background: isPopular ? 'rgba(255,255,255,.2)' : '#f0fdf4',
                          border: isPopular ? '1px solid rgba(255,255,255,.25)' : '1px solid #bbf7d0',
                        }}>
                          <span style={{ fontSize:12, fontWeight:800, color: isPopular ? '#fff' : '#0f766e' }}>Comprar</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isPopular ? '#fff' : '#0f766e'} strokeWidth="2.5" strokeLinecap="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Cupón ── */}
          <div style={{ background:'#fff', borderRadius:20, padding:'clamp(20px,3vw,28px)', border:'1.5px solid #f1f5f9', boxShadow:'0 2px 12px rgba(0,0,0,.04)', animation:'fadeUp .2s ease .14s both' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'#fefce8', border:'1.5px solid #fde68a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:0 }}>Canjear cupón</p>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Introduce tu código promocional</p>
              </div>
            </div>

            <div style={{ display:'flex', gap:8 }}>
              <div className="coupon-wrap" style={{ flex:1, display:'flex', alignItems:'center', gap:9, padding:'13px 16px', background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:14, transition:'all .15s' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
                <input
                  style={{ border:'none', background:'transparent', fontSize:14, fontWeight:700, color:'#0f172a', outline:'none', flex:1, fontFamily:'monospace', letterSpacing:'.08em', minWidth:0 }}
                  placeholder="CODIGO123"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleRedeem()}
                />
              </div>
              <button
                onClick={handleRedeem}
                disabled={couponLoading || !couponCode}
                style={{
                  padding:'13px 20px', borderRadius:14, border:'none',
                  background: !couponCode ? '#f1f5f9' : 'linear-gradient(135deg,#2EC4B6,#1D9E75)',
                  color: !couponCode ? '#94a3b8' : '#fff',
                  cursor: !couponCode ? 'not-allowed' : 'pointer',
                  fontSize:13, fontWeight:800, fontFamily:F,
                  whiteSpace:'nowrap', transition:'all .15s',
                  boxShadow: couponCode ? '0 4px 14px rgba(46,196,182,.25)' : 'none',
                  display:'flex', alignItems:'center', gap:7,
                }}>
                {couponLoading
                  ? <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
                  : <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Canjear
                    </>
                }
              </button>
            </div>

            {couponMsg && (
              <div style={{
                marginTop:12, padding:'11px 16px', borderRadius:12,
                background: couponError ? '#fef2f2' : '#f0fdf4',
                border: `1px solid ${couponError ? '#fecaca' : '#bbf7d0'}`,
                display:'flex', alignItems:'center', gap:9,
              }}>
                <div style={{ width:22, height:22, borderRadius:7, background: couponError ? '#fee2e2' : '#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={couponError ? '#dc2626' : '#16a34a'} strokeWidth="2.5" strokeLinecap="round">
                    {couponError
                      ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                      : <polyline points="20 6 9 17 4 12"/>
                    }
                  </svg>
                </div>
                <p style={{ fontSize:13, color: couponError ? '#dc2626' : '#15803d', margin:0, fontWeight:600 }}>{couponMsg}</p>
              </div>
            )}
          </div>

          {/* ── Coste por acción ── */}
          <div style={{ background:'#fff', borderRadius:20, padding:'clamp(20px,3vw,28px)', border:'1.5px solid #f1f5f9', boxShadow:'0 2px 12px rgba(0,0,0,.04)', animation:'fadeUp .2s ease .21s both' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 16px' }}>Coste por acción</p>
            <div className="costs-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:4 }}>
              {costs.map((c, i) => (
                <div key={i} className="cost-row" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', cursor:'default' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:c.bg, border:`1.5px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:15 }}>
                      {c.icon}
                    </div>
                    <span style={{ fontSize:13, color:'#374151', fontWeight:500 }}>{c.label}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:20, background:c.bg, border:`1.5px solid ${c.border}` }}>
                    <span style={{ fontSize:13, fontWeight:800, color:c.color }}>{c.cost}</span>
                    <span style={{ fontSize:11, color:c.color, opacity:.6, fontWeight:600 }}>tkn</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}