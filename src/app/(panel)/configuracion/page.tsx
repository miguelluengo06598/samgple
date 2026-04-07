import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './logout-button'

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const [
    { data: account },
    { data: wallet },
    { data: stores },
    { data: threads },
    { data: invoices },
    { data: vapiConfig },
  ] = await Promise.all([
    admin.from('accounts').select('name,email').eq('id', accountId).single(),
    admin.from('wallets').select('balance').eq('account_id', accountId).single(),
    admin.from('stores').select('id').eq('account_id', accountId),
    admin.from('support_threads').select('id').eq('account_id', accountId).eq('status', 'open'),
    admin.from('invoice_requests').select('id').eq('account_id', accountId).eq('status', 'pending'),
    admin.from('vapi_configs').select('active,assistant_name').eq('account_id', accountId).single(),
  ])

  const F               = 'system-ui,-apple-system,sans-serif'
  const initial         = account?.name?.charAt(0).toUpperCase() ?? '?'
  const balance         = Number(wallet?.balance ?? 0).toFixed(2)
  const openTickets     = threads?.length ?? 0
  const pendingInvoices = invoices?.length ?? 0
  const storeCount      = stores?.length ?? 0
  const vapiActive      = vapiConfig?.active ?? false
  const assistantName   = vapiConfig?.assistant_name ?? 'Asistente IA'

  return (
    <>
      <style>{`
        @keyframes cfg-up    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cfg-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes cfg-glow  { 0%,100%{opacity:.5} 50%{opacity:1} }

        .cfg-link {
          transition: background .13s, transform .13s;
          -webkit-tap-highlight-color: transparent;
        }
        .cfg-link:hover  { background: #f8fafc !important; }
        .cfg-link:active { transform: scale(.985); }

        .cfg-stat {
          transition: transform .15s, box-shadow .15s;
        }
        .cfg-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.07) !important; }

        .cfg-vapi {
          transition: transform .15s, box-shadow .15s;
        }
        .cfg-vapi:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(46,196,182,.2) !important; }

        .cfg-logout { transition: all .15s; }
        .cfg-logout:hover { background: #fef2f2 !important; border-color: #fecaca !important; }

        @media (min-width: 640px) {
          .cfg-stats { grid-template-columns: repeat(4, 1fr) !important; }
          .cfg-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 1024px) {
          .cfg-grid  { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ background: '#f0f4f8', minHeight: '100vh', fontFamily: F }}>

        {/* ── Hero header ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0d2318 100%)',
          padding: 'clamp(28px,5vw,48px) clamp(16px,5vw,48px) clamp(80px,10vw,100px)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorations */}
          <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.14) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-40, left:60, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(46,196,182,.5),transparent)', animation:'cfg-glow 3s ease-in-out infinite' }}/>

          <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                {/* Avatar */}
                <div style={{
                  width:'clamp(52px,8vw,64px)', height:'clamp(52px,8vw,64px)',
                  borderRadius:20, flexShrink:0,
                  background:'linear-gradient(135deg,#2EC4B6,#1D9E75)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'clamp(22px,4vw,28px)', fontWeight:900, color:'#fff',
                  boxShadow:'0 8px 24px rgba(46,196,182,.4)',
                }}>
                  {initial}
                </div>
                <div>
                  <h1 style={{ fontSize:'clamp(20px,4vw,28px)', fontWeight:800, color:'#fff', margin:'0 0 4px', letterSpacing:'-.6px' }}>
                    {account?.name ?? 'Mi cuenta'}
                  </h1>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.4)', margin:0, fontWeight:500 }}>
                    {account?.email ?? ''}
                  </p>
                </div>
              </div>

              {/* Saldo badge */}
              <div style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'12px 20px', borderRadius:18,
                background:'rgba(255,255,255,.06)',
                border:'1px solid rgba(255,255,255,.1)',
                backdropFilter:'blur(8px)',
              }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                  <span style={{ fontSize:'clamp(22px,4vw,28px)', fontWeight:900, color:'#fff', letterSpacing:'-1.5px', lineHeight:1 }}>{balance}</span>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,.35)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em' }}>tokens</span>
                </div>
                <div style={{ width:36, height:36, borderRadius:12, background:'rgba(46,196,182,.2)', border:'1px solid rgba(46,196,182,.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content pulled up ── */}
        <div style={{ maxWidth:1100, margin:'-clamp(40px,6vw,56px) auto 0', padding:'0 clamp(16px,4vw,40px) 56px', position:'relative', zIndex:2 }}>

          {/* ── Stats cards ── */}
          <div className="cfg-stats" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:16, animation:'cfg-up .25s ease both' }}>
            {[
              { label:'Tiendas',  value:String(storeCount),      suffix: storeCount === 1 ? 'conectada' : 'conectadas', color:'#0f766e', bg:'#fff', border:'#e2e8f0', accent:'#2EC4B6',
                icon:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18', href:'/configuracion/tiendas' },
              { label:'Soporte',  value:String(openTickets),     suffix: openTickets === 1 ? 'ticket abierto' : 'tickets abiertos', color:'#1d4ed8', bg:'#fff', border:'#e2e8f0', accent:'#3b82f6',
                icon:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', href:'/configuracion/soporte' },
              { label:'Facturas', value:String(pendingInvoices), suffix: pendingInvoices === 1 ? 'pendiente' : 'pendientes', color:'#6d28d9', bg:'#fff', border:'#e2e8f0', accent:'#8b5cf6',
                icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6', href:'/configuracion/facturas' },
              { label:'Asistente', value: vapiActive ? 'ON' : 'OFF', suffix: vapiActive ? assistantName : 'Inactivo', color: vapiActive ? '#0f766e' : '#92400e', bg:'#fff', border:'#e2e8f0', accent: vapiActive ? '#2EC4B6' : '#f59e0b',
                icon:'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', href:'/configuracion/asistente' },
            ].map((s, i) => (
              <Link key={s.label} href={s.href} className="cfg-stat"
                style={{ textDecoration:'none', background:s.bg, borderRadius:20, padding:'clamp(16px,3vw,22px)', border:`1.5px solid ${s.border}`, boxShadow:'0 4px 16px rgba(0,0,0,.05)', display:'flex', alignItems:'center', gap:14, animation:`cfg-up .25s ease ${i * .05}s both` }}>
                <div style={{ width:44, height:44, borderRadius:14, background:`${s.accent}15`, border:`1.5px solid ${s.accent}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="2" strokeLinecap="round">
                    <path d={s.icon}/>
                  </svg>
                </div>
                <div style={{ minWidth:0, flex:1 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 3px' }}>{s.label}</p>
                  <p style={{ fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, color:s.color, margin:0, letterSpacing:'-1px', lineHeight:1 }}>{s.value}</p>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:'3px 0 0', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.suffix}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>

          {/* ── Banner VAPI inactivo ── */}
          {!vapiActive && (
            <Link href="/configuracion/asistente" className="cfg-vapi"
              style={{ textDecoration:'none', display:'block', marginBottom:16, animation:'cfg-up .25s ease .18s both' }}>
              <div style={{
                background:'linear-gradient(135deg,#0c1a2e 0%,#0f2a1e 100%)',
                borderRadius:22, padding:'clamp(18px,4vw,24px) clamp(20px,4vw,28px)',
                display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
                boxShadow:'0 8px 32px rgba(15,23,42,.2)', position:'relative', overflow:'hidden',
              }}>
                <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.15) 0%,transparent 70%)', pointerEvents:'none' }}/>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(46,196,182,.5),transparent)' }}/>
                <div style={{ width:48, height:48, borderRadius:15, background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 16px rgba(46,196,182,.4)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div style={{ flex:1, minWidth:180, position:'relative' }}>
                  <p style={{ fontSize:'clamp(14px,2.5vw,16px)', fontWeight:800, color:'#fff', margin:'0 0 4px', letterSpacing:'-.3px' }}>
                    Activa tu asistente de llamadas
                  </p>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,.45)', margin:0, lineHeight:1.5 }}>
                    Conecta tu número Twilio y confirma pedidos automáticamente
                  </p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:14, background:'rgba(46,196,182,.15)', border:'1px solid rgba(46,196,182,.25)', flexShrink:0 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'#2EC4B6' }}>Configurar</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          )}

          {/* ── Grid de secciones ── */}
          <div className="cfg-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:10 }}>

            {/* Cuenta */}
            <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 4px 16px rgba(0,0,0,.05)', animation:'cfg-up .25s ease .1s both' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Cuenta</p>
              </div>
              {[
                { href:'/configuracion/cuenta', label:'Mi cuenta', desc:'Nombre, email y contraseña', color:'#2EC4B6', icon:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7m-4 0a4 4 0 108 0a4 4 0 10-8 0' },
                { href:'/configuracion/tiendas', label:'Tiendas Shopify', desc:`${storeCount} tienda${storeCount !== 1 ? 's' : ''} conectada${storeCount !== 1 ? 's' : ''}`, color:'#0f766e', icon:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18',
                  badge: storeCount > 0 ? `${storeCount}` : null, badgeColor:'#0f766e', badgeBg:'#f0fdf4', badgeBorder:'#bbf7d0' },
              ].map((item, i, arr) => (
                <Link key={item.href} href={item.href} className="cfg-link"
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'clamp(14px,3vw,18px) clamp(16px,3vw,20px)', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration:'none', background:'#fff' }}>
                  <div style={{ width:40, height:40, borderRadius:13, background:`${item.color}12`, border:`1.5px solid ${item.color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.label}</p>
                    <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{item.desc}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {item.badge && <span style={{ fontSize:12, fontWeight:800, padding:'3px 10px', borderRadius:20, background:item.badgeBg, color:item.badgeColor, border:`1px solid ${item.badgeBorder}` }}>{item.badge}</span>}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Asistente IA */}
            <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 4px 16px rgba(0,0,0,.05)', animation:'cfg-up .25s ease .14s both' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Asistente IA</p>
              </div>
              <Link href="/configuracion/asistente" className="cfg-link"
                style={{ display:'flex', alignItems:'center', gap:14, padding:'clamp(14px,3vw,20px) clamp(16px,3vw,20px)', textDecoration:'none', background:'#fff' }}>
                <div style={{ width:40, height:40, borderRadius:13, background: vapiActive ? '#f0fdf4' : '#fffbeb', border:`1.5px solid ${vapiActive ? '#bbf7d0' : '#fde68a'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={vapiActive ? '#0f766e' : '#d97706'} strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {!vapiActive && <span style={{ position:'absolute', top:-3, right:-3, width:9, height:9, borderRadius:'50%', background:'#f59e0b', border:'2px solid #fff', animation:'cfg-pulse 2s infinite' }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{vapiActive ? assistantName : 'Asistente de llamadas'}</p>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{vapiActive ? 'Activo · Confirmando pedidos' : 'Sin configurar · Toca para activar'}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:'4px 11px', borderRadius:20, background: vapiActive ? '#f0fdf4' : '#fef3c7', color: vapiActive ? '#15803d' : '#92400e', border:`1px solid ${vapiActive ? '#bbf7d0' : '#fde68a'}` }}>
                    {vapiActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            </div>

            {/* Facturación */}
            <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 4px 16px rgba(0,0,0,.05)', animation:'cfg-up .25s ease .18s both' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Facturación</p>
              </div>
              {[
                { href:'/configuracion/tokens', label:'Tokens', desc:`${balance} disponibles`, color:'#d97706', icon:'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2',
                  badge: balance, badgeColor:'#92400e', badgeBg:'#fef3c7', badgeBorder:'#fde68a' },
                { href:'/configuracion/facturas', label:'Facturas', desc: pendingInvoices > 0 ? `${pendingInvoices} pendiente${pendingInvoices > 1 ? 's' : ''}` : 'Solicita y gestiona facturas', color:'#8b5cf6', icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6',
                  badge: pendingInvoices > 0 ? String(pendingInvoices) : null, badgeColor:'#6d28d9', badgeBg:'#ede9fe', badgeBorder:'#ddd6fe' },
              ].map((item, i, arr) => (
                <Link key={item.href} href={item.href} className="cfg-link"
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'clamp(14px,3vw,18px) clamp(16px,3vw,20px)', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration:'none', background:'#fff' }}>
                  <div style={{ width:40, height:40, borderRadius:13, background:`${item.color}12`, border:`1.5px solid ${item.color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{item.desc}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {item.badge && <span style={{ fontSize:12, fontWeight:800, padding:'3px 10px', borderRadius:20, background:item.badgeBg, color:item.badgeColor, border:`1px solid ${item.badgeBorder}` }}>{item.badge}</span>}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Soporte */}
            <div style={{ background:'#fff', borderRadius:22, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 4px 16px rgba(0,0,0,.05)', animation:'cfg-up .25s ease .22s both' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Soporte</p>
              </div>
              {[
                { href:'/configuracion/soporte', label:'Soporte', desc: openTickets > 0 ? `${openTickets} ticket${openTickets > 1 ? 's' : ''} abierto${openTickets > 1 ? 's' : ''}` : 'Chat en tiempo real con el equipo', color:'#3b82f6', icon:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
                  badge: openTickets > 0 ? String(openTickets) : null, badgeColor:'#1d4ed8', badgeBg:'#dbeafe', badgeBorder:'#bfdbfe' },
                { href:'/configuracion/informe', label:'Informe semanal', desc:'Análisis IA a tu email cada semana', color:'#ec4899', icon:'M18 20v-10 M12 20v-16 M6 20v-6',
                  badge: null, badgeColor:'', badgeBg:'', badgeBorder:'' },
              ].map((item, i, arr) => (
                <Link key={item.href} href={item.href} className="cfg-link"
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'clamp(14px,3vw,18px) clamp(16px,3vw,20px)', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration:'none', background:'#fff' }}>
                  <div style={{ width:40, height:40, borderRadius:13, background:`${item.color}12`, border:`1.5px solid ${item.color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{item.desc}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    {item.badge && <span style={{ fontSize:12, fontWeight:800, padding:'3px 10px', borderRadius:20, background:item.badgeBg, color:item.badgeColor, border:`1px solid ${item.badgeBorder}` }}>{item.badge}</span>}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* ── Logout ── */}
          <div style={{ marginTop:16, animation:'cfg-up .25s ease .26s both' }}>
            <LogoutButton />
          </div>

          {/* ── Footer ── */}
          <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center', margin:'20px 0 0' }}>
            SAMGPLE · <a href="mailto:hola@samgple.com" style={{ color:'#94a3b8', textDecoration:'none' }}>hola@samgple.com</a>
          </p>

        </div>
      </div>
    </>
  )
}