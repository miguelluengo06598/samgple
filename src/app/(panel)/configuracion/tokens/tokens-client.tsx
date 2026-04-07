'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRealtime } from '@/hooks/useRealtime'

const F = 'system-ui,-apple-system,sans-serif'

const LEMON_URLS: Record<string, string> = {
  '1499065': 'https://samgple.lemonsqueezy.com/buy/1499065',
  '1499070': 'https://samgple.lemonsqueezy.com/buy/1499070',
  '1499072': 'https://samgple.lemonsqueezy.com/buy/1499072',
}

const costs = [
  { label: 'Análisis IA',         cost: '0.17',  icon: '🧠', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
  { label: 'Llamada exitosa/min', cost: '0.22',  icon: '📞', color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
  { label: 'Llamada fallida',     cost: '0.05',  icon: '📵', color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { label: 'WhatsApp IA',         cost: '0.004', icon: '💬', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
  { label: 'Informe semanal',     cost: '0.50',  icon: '📊', color: '#be185d', bg: '#fdf2f8', border: '#fbcfe8' },
  { label: 'Reanálisis manual',   cost: '0.02',  icon: '🔄', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
]

export default function TokensClient({ wallet, packs, accountId }: { wallet: any; packs: any[]; accountId: string }) {
  const [balance, setBalance]             = useState(Number(wallet?.balance ?? 0))
  const [couponCode, setCouponCode]       = useState('')
  const [couponMsg, setCouponMsg]         = useState('')
  const [couponError, setCouponError]     = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)
  const [localPacks, setLocalPacks]       = useState(packs)

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
    setCouponLoading(true); setCouponMsg(''); setCouponError(false)
    try {
      const res = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      })
      const data = await res.json()
      if (data.ok) {
        setCouponMsg(`+${data.tokens} tokens añadidos a tu saldo`)
        setCouponError(false); setCouponCode('')
      } else {
        setCouponMsg(data.error); setCouponError(true)
      }
    } finally { setCouponLoading(false) }
  }

  const popularIdx   = Math.floor(localPacks.length / 2)
  const analysisLeft = Math.floor(balance / 0.17)
  const callMinsLeft = Math.floor(balance / 0.22)
  const whatsappLeft = Math.floor(balance / 0.004)

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes glow    { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes countUp { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }

        .pack-card { transition:transform .18s ease,box-shadow .18s ease; }
        .pack-card:hover { transform:translateY(-6px) scale(1.015)!important; }
        .pack-card:active { transform:scale(.97)!important; }

        .cost-pill { transition:transform .12s,background .12s; }
        .cost-pill:hover { transform:translateX(4px); background:#f1f5f9!important; }

        .coupon-wrap:focus-within { border-color:#2EC4B6!important; box-shadow:0 0 0 3px rgba(46,196,182,.12)!important; }

        .redeem-btn { transition:all .15s ease; }
        .redeem-btn:not(:disabled):hover { opacity:.88; transform:translateY(-1px); }

        @media(min-width:640px) { .packs-grid { grid-template-columns:repeat(3,1fr)!important; } }
        @media(min-width:640px) { .costs-grid  { grid-template-columns:repeat(2,1fr)!important; } }
        @media(min-width:900px) { .bottom-grid { grid-template-columns:1fr 1fr!important; } }

        @media(max-width:520px) {
          .stats-row { flex-direction:column!important; }
          .stat-box  { width:100%!important; }
        }
      `}</style>

      <div style={{ background:'#f0f4f8', minHeight:'100vh', fontFamily:F }}>

        {/* ── Header ── */}
        <div style={{
          background:'rgba(255,255,255,.9)',
          backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
          borderBottom:'1px solid rgba(0,0,0,.06)',
          padding:'14px clamp(16px,4vw,40px)',
          position:'sticky', top:0, zIndex:50,
        }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
            <Link href="/configuracion" style={{ width:36, height:36, borderRadius:11, background:'#f1f5f9', border:'1.5px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, textDecoration:'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:'clamp(15px,2.5vw,19px)', fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-.4px' }}>Tokens</h1>
              <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>Saldo, packs y cupones</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:14, background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', boxShadow:'0 4px 14px rgba(46,196,182,.3)' }}>
              <span style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:'-1px' }}>{balance.toFixed(1)}</span>
              <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.65)', textTransform:'uppercase', letterSpacing:'.06em' }}>tkn</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'clamp(20px,4vw,40px) clamp(16px,4vw,40px) 72px' }}>

          {/* ── Hero saldo ── */}
          <div style={{ marginBottom:24, animation:'fadeUp .25s ease both' }}>
            <div style={{
              background:'linear-gradient(135deg,#0a1628 0%,#0d2318 65%,#0a1e28 100%)',
              borderRadius:28, overflow:'hidden', position:'relative',
              boxShadow:'0 24px 64px rgba(10,22,40,.45)',
              padding:'clamp(28px,5vw,52px) clamp(24px,5vw,52px)',
            }}>
              <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.16) 0%,transparent 65%)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', bottom:-60, left:80, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,.1) 0%,transparent 65%)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(46,196,182,.6),transparent)', animation:'glow 3s ease-in-out infinite' }}/>

              <div style={{ position:'relative', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:24 }}>
                {/* Balance */}
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:'#2EC4B6', display:'inline-block', animation:'pulse 2s infinite', boxShadow:'0 0 8px rgba(46,196,182,.7)' }}/>
                    <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.12em' }}>Saldo disponible</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:14, marginBottom:10 }}>
                    <span style={{ fontSize:'clamp(60px,11vw,96px)', fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:'-5px', animation:'countUp .4s ease both', fontVariantNumeric:'tabular-nums' }}>
                      {balance.toFixed(2)}
                    </span>
                    <span style={{ fontSize:'clamp(18px,3vw,26px)', fontWeight:700, color:'rgba(255,255,255,.25)', marginBottom:'clamp(10px,2vw,18px)' }}>tokens</span>
                  </div>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,.2)', margin:0, fontWeight:500, letterSpacing:'.03em' }}>
                    Sin caducidad · Se acumulan con cada recarga
                  </p>
                </div>

                {/* Stats */}
                <div className="stats-row" style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                  {[
                    { label:'Análisis IA',  value:`~${analysisLeft}`,  unit:'disponibles', icon:'🧠', color:'#a78bfa' },
                    { label:'Min. llamada', value:`~${callMinsLeft}`,  unit:'disponibles', icon:'📞', color:'#34d399' },
                    { label:'WhatsApp',     value:`~${whatsappLeft}`,  unit:'mensajes',    icon:'💬', color:'#38bdf8' },
                  ].map(s => (
                    <div key={s.label} className="stat-box" style={{ padding:'16px 20px', borderRadius:18, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.07)', backdropFilter:'blur(8px)', minWidth:130 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                        <span style={{ fontSize:14 }}>{s.icon}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:'.07em' }}>{s.label}</span>
                      </div>
                      <p style={{ fontSize:'clamp(22px,4vw,30px)', fontWeight:900, color:s.color, margin:'0 0 3px', letterSpacing:'-1px', lineHeight:1 }}>{s.value}</p>
                      <p style={{ fontSize:10, color:'rgba(255,255,255,.2)', margin:0, fontWeight:500 }}>{s.unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Packs ── */}
          <div style={{ marginBottom:24, animation:'fadeUp .25s ease .08s both' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <h2 style={{ fontSize:'clamp(15px,2.5vw,18px)', fontWeight:800, color:'#0f172a', margin:'0 0 3px', letterSpacing:'-.3px' }}>Packs de tokens</h2>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Un solo pago · Sin caducidad · Pago seguro con Lemon Squeezy</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:20, background:'#f0fdf4', border:'1px solid #bbf7d0' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#22c55e', display:'inline-block', animation:'pulse 2.4s infinite' }}/>
                <span style={{ fontSize:11, fontWeight:600, color:'#15803d' }}>Tiempo real</span>
              </div>
            </div>

            <div className="packs-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:14 }}>
              {localPacks.map((pack, i) => {
                const isPopular   = i === popularIdx
                const variantId   = String(pack.variant_id ?? '')
                const checkoutUrl = pack.lemon_url ?? LEMON_URLS[variantId] ?? '#'
                const perToken    = pack.price_eur && pack.tokens
                  ? (pack.price_eur / pack.tokens).toFixed(3) : '—'

                return (
                  <a key={pack.id} href={checkoutUrl} target="_blank" rel="noopener noreferrer"
                    className="pack-card"
                    style={{
                      textDecoration:'none', display:'block',
                      background: isPopular
                        ? 'linear-gradient(145deg,#2EC4B6 0%,#1aab7a 100%)'
                        : '#fff',
                      borderRadius:22,
                      border: isPopular ? 'none' : '1.5px solid #e8edf2',
                      padding:'clamp(22px,4vw,36px)',
                      boxShadow: isPopular
                        ? '0 20px 56px rgba(46,196,182,.38)'
                        : '0 4px 20px rgba(0,0,0,.055)',
                      position:'relative', overflow:'hidden',
                    }}
                  >
                    {isPopular && <>
                      <div style={{ position:'absolute', top:-60, right:-60, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,.08)', pointerEvents:'none' }}/>
                      <div style={{ position:'absolute', bottom:-50, left:-30, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }}/>
                      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize:'20px 20px', pointerEvents:'none' }}/>
                    </>}

                    {isPopular && (
                      <div style={{ position:'absolute', top:18, right:18, fontSize:10, fontWeight:800, padding:'5px 13px', borderRadius:20, background:'rgba(255,255,255,.18)', color:'#fff', letterSpacing:'.07em', border:'1px solid rgba(255,255,255,.25)' }}>
                        MÁS POPULAR
                      </div>
                    )}

                    <p style={{ fontSize:'clamp(15px,2vw,17px)', fontWeight:800, color: isPopular ? 'rgba(255,255,255,.8)' : '#64748b', margin:'0 0 12px', letterSpacing:'-.2px' }}>
                      {pack.name}
                    </p>

                    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 18px', borderRadius:22, background: isPopular ? 'rgba(255,255,255,.15)' : '#f0fdf4', border: isPopular ? '1px solid rgba(255,255,255,.2)' : '1.5px solid #bbf7d0', marginBottom:20 }}>
                      <span style={{ fontSize:'clamp(24px,4vw,32px)', fontWeight:900, color: isPopular ? '#fff' : '#0f766e', letterSpacing:'-1.5px' }}>{pack.tokens}</span>
                      <span style={{ fontSize:14, fontWeight:700, color: isPopular ? 'rgba(255,255,255,.65)' : '#0f766e' }}>tokens</span>
                    </div>

                    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12 }}>
                      <div>
                        <p style={{ fontSize:'clamp(40px,7vw,58px)', fontWeight:900, color: isPopular ? '#fff' : '#0f172a', margin:0, lineHeight:1, letterSpacing:'-2.5px' }}>
                          {pack.price_eur}€
                        </p>
                        <p style={{ fontSize:12, color: isPopular ? 'rgba(255,255,255,.45)' : '#94a3b8', margin:'8px 0 0', fontWeight:500 }}>
                          {perToken}€ / token
                        </p>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 22px', borderRadius:16, background: isPopular ? 'rgba(255,255,255,.18)' : '#0f172a', border: isPopular ? '1.5px solid rgba(255,255,255,.25)' : 'none', flexShrink:0, boxShadow: isPopular ? 'none' : '0 4px 14px rgba(15,23,42,.2)' }}>
                        <span style={{ fontSize:14, fontWeight:800, color:'#fff' }}>Comprar</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>

          {/* ── Bottom: cupón + costes ── */}
          <div className="bottom-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:14, animation:'fadeUp .25s ease .16s both' }}>

            {/* Cupón */}
            <div style={{ background:'#fff', borderRadius:22, padding:'clamp(20px,4vw,32px)', border:'1.5px solid #e8edf2', boxShadow:'0 4px 20px rgba(0,0,0,.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <div style={{ width:42, height:42, borderRadius:14, background:'#fefce8', border:'1.5px solid #fde68a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>🎫</div>
                <div>
                  <p style={{ fontSize:15, fontWeight:800, color:'#0f172a', margin:0 }}>Canjear cupón</p>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Introduce tu código promocional</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <div className="coupon-wrap" style={{ flex:1, display:'flex', alignItems:'center', gap:10, padding:'14px 16px', background:'#f8fafc', border:'1.5px solid #e8edf2', borderRadius:14, transition:'all .15s' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  <input
                    style={{ border:'none', background:'transparent', fontSize:14, fontWeight:700, color:'#0f172a', outline:'none', flex:1, fontFamily:'monospace', letterSpacing:'.1em', minWidth:0 }}
                    placeholder="CODIGO123"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && handleRedeem()}
                  />
                </div>
                <button onClick={handleRedeem} disabled={couponLoading || !couponCode} className="redeem-btn"
                  style={{ padding:'14px 22px', borderRadius:14, border:'none', background: !couponCode ? '#f1f5f9' : 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: !couponCode ? '#94a3b8' : '#fff', cursor: !couponCode ? 'not-allowed' : 'pointer', fontSize:14, fontWeight:800, fontFamily:F, boxShadow: couponCode ? '0 4px 16px rgba(46,196,182,.3)' : 'none', display:'flex', alignItems:'center', gap:8, whiteSpace:'nowrap' }}>
                  {couponLoading
                    ? <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
                    : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Canjear</>
                  }
                </button>
              </div>
              {couponMsg && (
                <div style={{ marginTop:12, padding:'12px 16px', borderRadius:12, background: couponError ? '#fef2f2' : '#f0fdf4', border:`1px solid ${couponError ? '#fecaca' : '#bbf7d0'}`, display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:24, height:24, borderRadius:8, background: couponError ? '#fee2e2' : '#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={couponError ? '#dc2626' : '#16a34a'} strokeWidth="2.5" strokeLinecap="round">
                      {couponError ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <polyline points="20 6 9 17 4 12"/>}
                    </svg>
                  </div>
                  <p style={{ fontSize:13, color: couponError ? '#dc2626' : '#15803d', margin:0, fontWeight:600 }}>{couponMsg}</p>
                </div>
              )}
            </div>

            {/* Costes */}
            <div style={{ background:'#fff', borderRadius:22, padding:'clamp(20px,4vw,32px)', border:'1.5px solid #e8edf2', boxShadow:'0 4px 20px rgba(0,0,0,.05)' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.1em', margin:'0 0 18px' }}>Coste por acción</p>
              <div className="costs-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:6 }}>
                {costs.map((c, i) => (
                  <div key={i} className="cost-pill" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', borderRadius:14, background:'#f8fafc', border:'1.5px solid #f1f5f9' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:11, background:c.bg, border:`1.5px solid ${c.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{c.icon}</div>
                      <span style={{ fontSize:13, color:'#374151', fontWeight:600 }}>{c.label}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 14px', borderRadius:20, background:c.bg, border:`1.5px solid ${c.border}` }}>
                      <span style={{ fontSize:14, fontWeight:900, color:c.color }}>{c.cost}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:c.color, opacity:.6 }}>tkn</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}