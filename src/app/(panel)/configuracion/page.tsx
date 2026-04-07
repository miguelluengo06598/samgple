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
        @keyframes cfg-up    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cfg-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes cfg-glow  { 0%,100%{opacity:.4} 50%{opacity:1} }

        .cfg-link { transition:background .13s,transform .13s; -webkit-tap-highlight-color:transparent; }
        .cfg-link:hover { background:#f8fafc !important; }
        .cfg-link:active { transform:scale(.985); }

        .cfg-stat { transition:transform .15s,box-shadow .15s; }
        .cfg-stat:hover { transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,0,0,.08) !important; }

        .cfg-vapi { transition:transform .15s,box-shadow .15s; }
        .cfg-vapi:hover { transform:translateY(-2px); }

        /* Stats: 2 col móvil, 4 col desktop */
        .cfg-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media(min-width: 700px) {
          .cfg-stats { grid-template-columns: repeat(4, 1fr); }
        }

        /* Secciones: 1 col móvil, 2 col desktop */
        .cfg-sections {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media(min-width: 700px) {
          .cfg-sections { grid-template-columns: repeat(2, 1fr); }
        }

        /* Hero: stack en móvil, row en desktop */
        .cfg-hero-inner {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media(min-width: 600px) {
          .cfg-hero-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
      `}</style>

      <div style={{ background:'#f0f4f8', minHeight:'100vh', fontFamily:F }}>

        {/* ── Hero ── */}
        <div style={{
          background:'linear-gradient(135deg,#0a1628 0%,#0d2318 100%)',
          padding:'clamp(24px,4vw,40px) clamp(16px,4vw,32px) clamp(24px,4vw,40px)',
          position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.14) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(46,196,182,.5),transparent)', animation:'cfg-glow 3s ease-in-out infinite' }}/>

          <div style={{ maxWidth:720, margin:'0 auto', position:'relative' }}>
            <div className="cfg-hero-inner">
              {/* Avatar + nombre */}
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:52, height:52, borderRadius:18, flexShrink:0, background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff', boxShadow:'0 6px 20px rgba(46,196,182,.4)' }}>
                  {initial}
                </div>
                <div>
                  <h1 style={{ fontSize:'clamp(18px,3.5vw,24px)', fontWeight:800, color:'#fff', margin:'0 0 3px', letterSpacing:'-.5px' }}>
                    {account?.name ?? 'Mi cuenta'}
                  </h1>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,.4)', margin:0 }}>{account?.email ?? ''}</p>
                </div>
              </div>

              {/* Saldo */}
              <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', borderRadius:16, background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.1)', alignSelf:'flex-start' }}>
                <div>
                  <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.1em', margin:'0 0 2px' }}>Tokens</p>
                  <p style={{ fontSize:'clamp(24px,4vw,30px)', fontWeight:900, color:'#fff', margin:0, letterSpacing:'-1.5px', lineHeight:1 }}>{balance}</p>
                </div>
                <div style={{ width:36, height:36, borderRadius:12, background:'rgba(46,196,182,.2)', border:'1px solid rgba(46,196,182,.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div style={{ maxWidth:720, margin:'0 auto', padding:'clamp(16px,3vw,24px) clamp(16px,4vw,24px) 56px' }}>

          {/* Stats */}
          <div className="cfg-stats" style={{ marginBottom:14, animation:'cfg-up .22s ease both' }}>
            {[
              { label:'Tiendas',   value:String(storeCount),      sub: storeCount === 1 ? 'conectada' : 'conectadas', color:'#0f766e', accent:'#2EC4B6', icon:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18', href:'/configuracion/tiendas' },
              { label:'Soporte',   value:String(openTickets),     sub: openTickets === 1 ? 'abierto' : 'abiertos',   color:'#1d4ed8', accent:'#3b82f6', icon:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',   href:'/configuracion/soporte' },
              { label:'Facturas',  value:String(pendingInvoices), sub: pendingInvoices === 1 ? 'pendiente' : 'pendientes', color:'#6d28d9', accent:'#8b5cf6', icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6', href:'/configuracion/facturas' },
              { label:'Asistente', value: vapiActive ? 'ON' : 'OFF', sub: vapiActive ? assistantName : 'Inactivo', color: vapiActive ? '#0f766e' : '#92400e', accent: vapiActive ? '#2EC4B6' : '#f59e0b', icon:'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z', href:'/configuracion/asistente' },
            ].map((s, i) => (
              <Link key={s.label} href={s.href} className="cfg-stat"
                style={{ textDecoration:'none', background:'#fff', borderRadius:18, padding:'clamp(14px,3vw,18px)', border:'1.5px solid #e8edf2', boxShadow:'0 2px 10px rgba(0,0,0,.05)', display:'flex', flexDirection:'column', gap:4, animation:`cfg-up .22s ease ${i*.05}s both` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ width:34, height:34, borderRadius:11, background:`${s.accent}15`, border:`1.5px solid ${s.accent}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="2" strokeLinecap="round"><path d={s.icon}/></svg>
                  </div>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
                <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', margin:0 }}>{s.label}</p>
                <p style={{ fontSize:'clamp(20px,3.5vw,26px)', fontWeight:900, color:s.color, margin:0, letterSpacing:'-1px', lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:11, color:'#94a3b8', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.sub}</p>
              </Link>
            ))}
          </div>

          {/* Banner VAPI */}
          {!vapiActive && (
            <Link href="/configuracion/asistente" className="cfg-vapi"
              style={{ textDecoration:'none', display:'block', marginBottom:14, animation:'cfg-up .22s ease .18s both' }}>
              <div style={{ background:'linear-gradient(135deg,#0c1a2e,#0f2a1e)', borderRadius:20, padding:'clamp(16px,3vw,22px) clamp(18px,4vw,24px)', display:'flex', alignItems:'center', gap:14, flexWrap:'wrap', boxShadow:'0 6px 24px rgba(15,23,42,.18)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(46,196,182,.4),transparent)' }}/>
                <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#2EC4B6,#1D9E75)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:'0 4px 14px rgba(46,196,182,.35)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div style={{ flex:1, minWidth:160 }}>
                  <p style={{ fontSize:14, fontWeight:800, color:'#fff', margin:'0 0 3px' }}>Activa tu asistente de llamadas</p>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,.4)', margin:0 }}>Conecta Twilio y confirma pedidos automáticamente</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:12, background:'rgba(46,196,182,.15)', border:'1px solid rgba(46,196,182,.25)', flexShrink:0 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#2EC4B6' }}>Configurar</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          )}

          {/* Secciones */}
          <div className="cfg-sections" style={{ marginBottom:14 }}>

            {/* Cuenta */}
            <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 2px 10px rgba(0,0,0,.05)', animation:'cfg-up .22s ease .1s both' }}>
              <div style={{ padding:'13px 18px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Cuenta</p>
              </div>
              {[
                { href:'/configuracion/cuenta', label:'Mi cuenta', desc:'Nombre, email y contraseña', accent:'#2EC4B6', icon:'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7m-4 0a4 4 0 108 0a4 4 0 10-8 0', badge:null },
                { href:'/configuracion/tiendas', label:'Tiendas Shopify', desc:`${storeCount} tienda${storeCount !== 1 ? 's' : ''} conectada${storeCount !== 1 ? 's' : ''}`, accent:'#0f766e', icon:'M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18', badge: storeCount > 0 ? String(storeCount) : null, badgeColor:'#0f766e', badgeBg:'#f0fdf4', badgeBorder:'#bbf7d0' },
              ].map((item: any, i, arr) => (
                <Link key={item.href} href={item.href} className="cfg-link"
                  style={{ display:'flex', alignItems:'center', gap:13, padding:'clamp(13px,3vw,17px) clamp(14px,3vw,18px)', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration:'none', background:'#fff' }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:`${item.accent}12`, border:`1.5px solid ${item.accent}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.label}</p>
                    <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{item.desc}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                    {item.badge && <span style={{ fontSize:11, fontWeight:800, padding:'3px 9px', borderRadius:20, background:item.badgeBg, color:item.badgeColor, border:`1px solid ${item.badgeBorder}` }}>{item.badge}</span>}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Asistente IA */}
            <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 2px 10px rgba(0,0,0,.05)', animation:'cfg-up .22s ease .14s both' }}>
              <div style={{ padding:'13px 18px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Asistente IA</p>
              </div>
              <Link href="/configuracion/asistente" className="cfg-link"
                style={{ display:'flex', alignItems:'center', gap:13, padding:'clamp(13px,3vw,17px) clamp(14px,3vw,18px)', textDecoration:'none', background:'#fff' }}>
                <div style={{ width:38, height:38, borderRadius:12, background: vapiActive ? '#f0fdf4' : '#fffbeb', border:`1.5px solid ${vapiActive ? '#bbf7d0' : '#fde68a'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={vapiActive ? '#0f766e' : '#d97706'} strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  {!vapiActive && <span style={{ position:'absolute', top:-3, right:-3, width:8, height:8, borderRadius:'50%', background:'#f59e0b', border:'2px solid #fff', animation:'cfg-pulse 2s infinite' }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{vapiActive ? assistantName : 'Asistente de llamadas'}</p>
                  <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{vapiActive ? 'Activo · Confirmando pedidos' : 'Sin configurar'}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:20, background: vapiActive ? '#f0fdf4' : '#fef3c7', color: vapiActive ? '#15803d' : '#92400e', border:`1px solid ${vapiActive ? '#bbf7d0' : '#fde68a'}` }}>
                    {vapiActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </Link>
            </div>

            {/* Facturación */}
            <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 2px 10px rgba(0,0,0,.05)', animation:'cfg-up .22s ease .18s both' }}>
              <div style={{ padding:'13px 18px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Facturación</p>
              </div>
              {[
                { href:'/configuracion/tokens', label:'Tokens', desc:`${balance} disponibles`, accent:'#d97706', icon:'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2', badge:balance, badgeColor:'#92400e', badgeBg:'#fef3c7', badgeBorder:'#fde68a' },
                { href:'/configuracion/facturas', label:'Facturas', desc: pendingInvoices > 0 ? `${pendingInvoices} pendiente${pendingInvoices > 1 ? 's' : ''}` : 'Solicita y gestiona facturas', accent:'#8b5cf6', icon:'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6', badge: pendingInvoices > 0 ? String(pendingInvoices) : null, badgeColor:'#6d28d9', badgeBg:'#ede9fe', badgeBorder:'#ddd6fe' },
              ].map((item: any, i, arr) => (
                <Link key={item.href} href={item.href} className="cfg-link"
                  style={{ display:'flex', alignItems:'center', gap:13, padding:'clamp(13px,3vw,17px) clamp(14px,3vw,18px)', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration:'none', background:'#fff' }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:`${item.accent}12`, border:`1.5px solid ${item.accent}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{item.desc}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                    {item.badge && <span style={{ fontSize:11, fontWeight:800, padding:'3px 9px', borderRadius:20, background:item.badgeBg, color:item.badgeColor, border:`1px solid ${item.badgeBorder}` }}>{item.badge}</span>}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>

            {/* Soporte */}
            <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', border:'1.5px solid #e8edf2', boxShadow:'0 2px 10px rgba(0,0,0,.05)', animation:'cfg-up .22s ease .22s both' }}>
              <div style={{ padding:'13px 18px', borderBottom:'1px solid #f1f5f9' }}>
                <p style={{ fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.09em', margin:0 }}>Soporte</p>
              </div>
              {[
                { href:'/configuracion/soporte', label:'Soporte', desc: openTickets > 0 ? `${openTickets} ticket${openTickets > 1 ? 's' : ''} abierto${openTickets > 1 ? 's' : ''}` : 'Chat en tiempo real', accent:'#3b82f6', icon:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', badge: openTickets > 0 ? String(openTickets) : null, badgeColor:'#1d4ed8', badgeBg:'#dbeafe', badgeBorder:'#bfdbfe' },
                { href:'/configuracion/informe', label:'Informe semanal', desc:'Análisis IA a tu email', accent:'#ec4899', icon:'M18 20v-10 M12 20v-16 M6 20v-6', badge:null },
              ].map((item: any, i, arr) => (
                <Link key={item.href} href={item.href} className="cfg-link"
                  style={{ display:'flex', alignItems:'center', gap:13, padding:'clamp(13px,3vw,17px) clamp(14px,3vw,18px)', borderBottom: i < arr.length - 1 ? '1px solid #f8fafc' : 'none', textDecoration:'none', background:'#fff' }}>
                  <div style={{ width:38, height:38, borderRadius:12, background:`${item.accent}12`, border:`1.5px solid ${item.accent}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={item.accent} strokeWidth="2" strokeLinecap="round"><path d={item.icon}/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{item.label}</p>
                    <p style={{ fontSize:11, color:'#94a3b8', margin:0 }}>{item.desc}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:7, flexShrink:0 }}>
                    {item.badge && <span style={{ fontSize:11, fontWeight:800, padding:'3px 9px', borderRadius:20, background:item.badgeBg, color:item.badgeColor, border:`1px solid ${item.badgeBorder}` }}>{item.badge}</span>}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* Logout */}
          <div style={{ animation:'cfg-up .22s ease .26s both' }}>
            <LogoutButton />
          </div>

          <p style={{ fontSize:11, color:'#94a3b8', textAlign:'center', margin:'16px 0 0' }}>
            SAMGPLE · <a href="mailto:hola@samgple.com" style={{ color:'#94a3b8', textDecoration:'none' }}>hola@samgple.com</a>
          </p>

        </div>
      </div>
    </>
  )
}