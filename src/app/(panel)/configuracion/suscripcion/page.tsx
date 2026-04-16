import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect }          from 'next/navigation'
import Link                  from 'next/link'
import { PLANS, PLAN_IDS, type PlanId } from '@/lib/plans'

export default async function SuscripcionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const { data: sub } = await admin
    .from('subscriptions')
    .select('plan, pedidos_usados, whatsapp_usado, periodo_inicio, periodo_fin, activo')
    .eq('account_id', accountId)
    .eq('activo', true)
    .single()

  const F          = 'system-ui,-apple-system,sans-serif'
  const currentPlan = sub ? PLANS[sub.plan as PlanId] : null

  const periodoFin = sub ? new Date(sub.periodo_fin) : null
  const periodoStr = periodoFin
    ? periodoFin.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const diasRestantes = periodoFin
    ? Math.max(0, Math.ceil((periodoFin.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  function usagePct(used: number, limit: number | null) {
    if (limit === null) return 0
    return Math.min(100, Math.round((used / limit) * 100))
  }

  function usageColor(pct: number) {
    if (pct >= 90) return '#ef4444'
    if (pct >= 70) return '#f59e0b'
    return '#2EC4B6'
  }

  function fmtLimit(n: number | null) {
    return n === null ? '∞' : n.toLocaleString('es-ES')
  }

  const ordersPct   = sub && currentPlan ? usagePct(sub.pedidos_usados, currentPlan.orders_limit) : 0
  const waPct       = sub && currentPlan ? usagePct(sub.whatsapp_usado, currentPlan.whatsapp_limit) : 0
  const ordersColor = usageColor(ordersPct)
  const waColor     = usageColor(waPct)

  return (
    <>
      <style>{`
        @keyframes sub-up    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sub-glow  { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes sub-fill  { from{width:0} to{width:var(--w)} }

        .sub-plan { transition:transform .15s,box-shadow .15s; cursor:default; }
        .sub-plan:hover { transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.12) !important; }

        .sub-back { transition:opacity .15s; -webkit-tap-highlight-color:transparent; }
        .sub-back:hover { opacity:.7; }

        .sub-contact { transition:opacity .15s,transform .12s; -webkit-tap-highlight-color:transparent; }
        .sub-contact:hover { opacity:.85; transform:scale(1.02); }
        .sub-contact:active { transform:scale(.97); }

        /* Progress bar animation */
        .sub-bar { animation: sub-fill .8s ease both; }

        /* Grid: 1 col mobile → 3 col desktop */
        .sub-plans-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media(min-width: 700px) {
          .sub-plans-grid { grid-template-columns: repeat(3,1fr); }
        }
      `}</style>

      <div style={{ background:'#f0f4f8', minHeight:'100vh', fontFamily:F }}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div style={{
          background:'linear-gradient(135deg,#0a1628 0%,#0d2318 100%)',
          padding:'clamp(20px,4vw,36px) clamp(16px,4vw,32px)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.02) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(46,196,182,.4),transparent)', animation:'sub-glow 3s ease-in-out infinite' }}/>

          <div style={{ maxWidth:900, margin:'0 auto', position:'relative' }}>
            {/* Back */}
            <Link href="/configuracion" className="sub-back"
              style={{ display:'inline-flex', alignItems:'center', gap:6, marginBottom:18, color:'rgba(255,255,255,.5)', textDecoration:'none', fontSize:13, fontWeight:600 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Configuración
            </Link>

            <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
              <div>
                <h1 style={{ fontSize:'clamp(20px,3.5vw,28px)', fontWeight:900, color:'#fff', margin:'0 0 5px', letterSpacing:'-.5px' }}>
                  Suscripción
                </h1>
                {currentPlan ? (
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <span style={{ fontSize:13, color:'rgba(255,255,255,.5)' }}>Plan activo:</span>
                    <span style={{ fontSize:13, fontWeight:800, padding:'3px 12px', borderRadius:20, background:`${currentPlan.accent}20`, border:`1px solid ${currentPlan.accent}40`, color:currentPlan.accent }}>
                      {currentPlan.name}
                    </span>
                    {periodoStr && (
                      <span style={{ fontSize:12, color:'rgba(255,255,255,.35)' }}>· Renueva el {periodoStr}</span>
                    )}
                  </div>
                ) : (
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.45)', margin:0 }}>Sin suscripción activa</p>
                )}
              </div>

              {/* Días restantes */}
              {sub && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderRadius:14, background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)' }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:'rgba(46,196,182,.15)', border:'1px solid rgba(46,196,182,.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 1px' }}>Días restantes</p>
                    <p style={{ fontSize:22, fontWeight:900, color: diasRestantes <= 5 ? '#f87171' : '#fff', margin:0, lineHeight:1, letterSpacing:'-1px' }}>{diasRestantes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Contenido ─────────────────────────────────────────────────────── */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'clamp(16px,3vw,24px) clamp(16px,4vw,24px) 64px' }}>

          {/* ── Uso del mes ────────────────────────────────────────────────── */}
          {sub && currentPlan && (
            <div style={{ background:'#fff', borderRadius:20, padding:'clamp(18px,3vw,24px)', border:'1.5px solid #e8edf2', boxShadow:'0 2px 12px rgba(0,0,0,.06)', marginBottom:16, animation:'sub-up .2s ease both' }}>
              <p style={{ fontSize:12, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 16px' }}>Uso este período</p>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {/* Pedidos */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>Pedidos</span>
                    <span style={{ fontSize:13, fontWeight:800, color: ordersColor }}>
                      {sub.pedidos_usados.toLocaleString('es-ES')}
                      <span style={{ fontSize:11, fontWeight:500, color:'#94a3b8' }}> / {fmtLimit(currentPlan.orders_limit)}</span>
                    </span>
                  </div>
                  <div style={{ height:8, borderRadius:99, background:'#f1f5f9', overflow:'hidden' }}>
                    {currentPlan.orders_limit !== null && (
                      <div className="sub-bar"
                        style={{ height:'100%', borderRadius:99, background:`linear-gradient(90deg,${ordersColor},${ordersColor}cc)`, ['--w' as any]:`${ordersPct}%`, width:`${ordersPct}%` }}/>
                    )}
                    {currentPlan.orders_limit === null && (
                      <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#2EC4B6,#1D9E75)', width:'100%', opacity:.4 }}/>
                    )}
                  </div>
                  {currentPlan.orders_limit !== null && (
                    <p style={{ fontSize:10, color:'#94a3b8', margin:'4px 0 0' }}>{ordersPct}% usado</p>
                  )}
                  {currentPlan.orders_limit === null && (
                    <p style={{ fontSize:10, color:'#2EC4B6', margin:'4px 0 0', fontWeight:700 }}>Ilimitado</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>WhatsApp IA</span>
                    <span style={{ fontSize:13, fontWeight:800, color: waColor }}>
                      {sub.whatsapp_usado.toLocaleString('es-ES')}
                      <span style={{ fontSize:11, fontWeight:500, color:'#94a3b8' }}> / {fmtLimit(currentPlan.whatsapp_limit)}</span>
                    </span>
                  </div>
                  <div style={{ height:8, borderRadius:99, background:'#f1f5f9', overflow:'hidden' }}>
                    {currentPlan.whatsapp_limit !== null && (
                      <div className="sub-bar"
                        style={{ height:'100%', borderRadius:99, background:`linear-gradient(90deg,${waColor},${waColor}cc)`, ['--w' as any]:`${waPct}%`, width:`${waPct}%` }}/>
                    )}
                    {currentPlan.whatsapp_limit === null && (
                      <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,#2EC4B6,#1D9E75)', width:'100%', opacity:.4 }}/>
                    )}
                  </div>
                  {currentPlan.whatsapp_limit !== null && (
                    <p style={{ fontSize:10, color:'#94a3b8', margin:'4px 0 0' }}>{waPct}% usado</p>
                  )}
                  {currentPlan.whatsapp_limit === null && (
                    <p style={{ fontSize:10, color:'#2EC4B6', margin:'4px 0 0', fontWeight:700 }}>Ilimitado</p>
                  )}
                </div>
              </div>

              {/* Aviso si está al límite */}
              {(ordersPct >= 90 || waPct >= 90) && (
                <div style={{ marginTop:14, padding:'10px 14px', borderRadius:12, background:'#fef2f2', border:'1px solid #fecaca', display:'flex', alignItems:'center', gap:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ fontSize:12, color:'#dc2626', margin:0, fontWeight:600 }}>
                    Estás cerca del límite mensual. Considera actualizar tu plan.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sin suscripción */}
          {!sub && (
            <div style={{ background:'#fffbeb', border:'1.5px solid #fde68a', borderRadius:20, padding:'18px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:12, animation:'sub-up .2s ease both' }}>
              <div style={{ width:38, height:38, borderRadius:12, background:'#fef3c7', border:'1px solid #fde68a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'#92400e', margin:'0 0 2px' }}>Sin suscripción activa</p>
                <p style={{ fontSize:12, color:'#a16207', margin:0 }}>Elige un plan para empezar a recibir pedidos y generar mensajes WhatsApp.</p>
              </div>
            </div>
          )}

          {/* ── Planes ─────────────────────────────────────────────────────── */}
          <p style={{ fontSize:12, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 12px', animation:'sub-up .2s ease .05s both' }}>
            {sub ? 'Planes disponibles' : 'Elige tu plan'}
          </p>

          <div className="sub-plans-grid" style={{ animation:'sub-up .2s ease .08s both' }}>
            {PLAN_IDS.map((planId, i) => {
              const plan      = PLANS[planId]
              const isCurrent = sub?.plan === planId
              const features  = [
                plan.orders_limit === null
                  ? 'Pedidos ilimitados'
                  : `${plan.orders_limit.toLocaleString('es-ES')} pedidos/mes`,
                plan.whatsapp_limit === null
                  ? 'WhatsApp ilimitado'
                  : `${plan.whatsapp_limit.toLocaleString('es-ES')} mensajes WhatsApp/mes`,
                plan.stores_limit === null
                  ? 'Tiendas ilimitadas'
                  : `Hasta ${plan.stores_limit} tienda${plan.stores_limit > 1 ? 's' : ''} conectada${plan.stores_limit > 1 ? 's' : ''}`,
                `Soporte ${plan.support.toLowerCase()}`,
              ]

              return (
                <div key={planId} className="sub-plan"
                  style={{
                    background:'#fff',
                    borderRadius:20,
                    padding:'clamp(18px,3vw,24px)',
                    border: isCurrent
                      ? `2px solid ${plan.accent}`
                      : plan.popular
                        ? `2px solid ${plan.accent}50`
                        : '1.5px solid #e8edf2',
                    boxShadow: isCurrent
                      ? `0 4px 24px ${plan.accent}25`
                      : plan.popular
                        ? `0 4px 16px ${plan.accent}15`
                        : '0 2px 10px rgba(0,0,0,.05)',
                    position:'relative',
                    overflow:'hidden',
                    animationDelay:`${i * 0.06}s`,
                  }}>

                  {/* Badge */}
                  {isCurrent && (
                    <div style={{ position:'absolute', top:12, right:12, padding:'4px 10px', borderRadius:99, background:`${plan.accent}18`, border:`1px solid ${plan.accent}35`, fontSize:10, fontWeight:800, color:plan.color, letterSpacing:'.05em', textTransform:'uppercase' }}>
                      Plan actual
                    </div>
                  )}
                  {!isCurrent && plan.popular && (
                    <div style={{ position:'absolute', top:12, right:12, padding:'4px 10px', borderRadius:99, background:plan.gradient, fontSize:10, fontWeight:800, color:'#fff', letterSpacing:'.05em', textTransform:'uppercase' }}>
                      Popular
                    </div>
                  )}

                  {/* Plan name + price */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ width:40, height:40, borderRadius:13, background:`${plan.accent}15`, border:`1.5px solid ${plan.accent}25`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12, flexShrink:0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={plan.accent} strokeWidth="2" strokeLinecap="round">
                        {planId === 'basico'      && <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>}
                        {planId === 'profesional' && <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>}
                        {planId === 'enterprise'  && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>}
                      </svg>
                    </div>
                    <p style={{ fontSize:18, fontWeight:900, color:'#0f172a', margin:'0 0 2px', letterSpacing:'-.3px' }}>{plan.name}</p>
                    <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
                      <span style={{ fontSize:32, fontWeight:900, color:plan.color, letterSpacing:'-1.5px', lineHeight:1 }}>{plan.price.toFixed(2)}€</span>
                      <span style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>/mes</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
                    {features.map((f, fi) => (
                      <div key={fi} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ width:18, height:18, borderRadius:'50%', background:`${plan.accent}15`, border:`1px solid ${plan.accent}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={plan.accent} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <span style={{ fontSize:12, color:'#374151', lineHeight:1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {isCurrent ? (
                    <div style={{ width:'100%', padding:'11px 0', borderRadius:14, fontSize:13, fontWeight:700, textAlign:'center', background:`${plan.accent}12`, border:`1.5px solid ${plan.accent}25`, color:plan.color }}>
                      Plan activo
                    </div>
                  ) : (
                    <a href={`mailto:hola@samgple.com?subject=Cambiar a plan ${plan.name}&body=Hola, me gustaría activar el plan ${plan.name} (${plan.price.toFixed(2)}€/mes).`}
                      className="sub-contact"
                      style={{ display:'block', width:'100%', padding:'11px 0', borderRadius:14, fontSize:13, fontWeight:700, textAlign:'center', background: plan.gradient, color:'#fff', textDecoration:'none', boxShadow:`0 4px 14px ${plan.accent}30` }}>
                      {sub ? 'Cambiar a este plan' : 'Activar plan'}
                    </a>
                  )}
                </div>
              )
            })}
          </div>

          {/* Nota footer */}
          <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center', marginTop:20, lineHeight:1.6, animation:'sub-up .2s ease .2s both' }}>
            Los contadores se reinician automáticamente cada mes.{' '}
            Para cambiar de plan o cancelar, escribe a{' '}
            <a href="mailto:hola@samgple.com" style={{ color:'#2EC4B6', textDecoration:'none' }}>hola@samgple.com</a>
          </p>

        </div>
      </div>
    </>
  )
}
