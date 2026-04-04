'use client'

import { useState } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function AsistenteClient({ initialConfig }: { initialConfig: any }) {
  const [config,   setConfig]   = useState(initialConfig)
  const [saving,   setSaving]   = useState(false)
  const [toggling, setToggling] = useState(false)
  const [msg,      setMsg]      = useState('')
  const [error,    setError]    = useState('')

  const [vapiPhoneNumberId, setVapiPhoneNumberId] = useState(config?.vapi_phone_number_id ?? '')
  const [assistantName,     setAssistantName]     = useState(config?.assistant_name ?? '')

  const isActive     = config?.active ?? false
  const isConfigured = !!config?.vapi_phone_number_id && !!config?.assistant_name

  async function handleSave() {
    setSaving(true); setMsg(''); setError('')
    try {
      const res  = await fetch('/api/vapi/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vapi_phone_number_id: vapiPhoneNumberId, assistant_name: assistantName }),
      })
      const data = await res.json()
      if (data.ok) {
        setConfig(data.config)
        setMsg('Configuración guardada')
        setTimeout(() => setMsg(''), 3000)
      } else {
        setError(data.error)
      }
    } finally { setSaving(false) }
  }

  async function handleToggle() {
    setToggling(true); setError('')
    try {
      const res  = await fetch('/api/vapi/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !isActive }),
      })
      const data = await res.json()
      if (data.ok) setConfig((prev: any) => ({ ...prev, active: !isActive }))
      else setError(data.error)
    } finally { setToggling(false) }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes shimmer  { from{background-position:200% center} to{background-position:-200% center} }
        @keyframes breathe  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }

        .inp-wrap { transition:border-color .15s,box-shadow .15s; }
        .inp-wrap:focus-within {
          border-color:#2EC4B6!important;
          box-shadow:0 0 0 3px rgba(46,196,182,.1)!important;
        }
        .btn-save {
          transition:all .15s ease;
          background: linear-gradient(135deg,#2EC4B6,#1D9E75);
        }
        .btn-save:not(:disabled):hover {
          transform:translateY(-1px);
          box-shadow:0 10px 28px rgba(46,196,182,.35)!important;
        }
        .btn-save:not(:disabled):active { transform:scale(.98); }

        .toggle-btn { transition:all .15s ease; }
        .toggle-btn:not(:disabled):hover { opacity:.85; transform:translateY(-1px); }

        .step-card {
          transition:background .12s,transform .12s;
        }
        .step-card:hover {
          background:#f0fdf4;
          transform:translateX(3px);
        }

        .status-ring {
          animation: breathe 3s ease-in-out infinite;
        }

        .phone-id-input::placeholder { letter-spacing:.05em; }
      `}</style>

      <div style={{ background:'#f8fafc', minHeight:'100vh', fontFamily:F }}>

        {/* Sticky header */}
        <div style={{ background:'#fff', padding:'16px clamp(16px,4vw,32px)', borderBottom:'1px solid #f1f5f9', position:'sticky', top:56, zIndex:9 }}>
          <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
            <Link href="/configuracion"
              style={{ width:36, height:36, borderRadius:11, background:'#f8fafc', border:'1.5px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, textDecoration:'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize:'clamp(17px,3.5vw,21px)', fontWeight:800, color:'#0f172a', margin:0, letterSpacing:'-.4px' }}>Asistente IA</h1>
              <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Agente de llamadas automáticas COD</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:660, margin:'0 auto', padding:'clamp(16px,3vw,24px) clamp(16px,4vw,32px) 48px', display:'flex', flexDirection:'column', gap:12 }}>

          {/* ── Hero status card ── */}
          <div style={{
            borderRadius:24,
            padding:'clamp(20px,4vw,28px)',
            border: isActive ? 'none' : '1.5px solid #f1f5f9',
            background: isActive
              ? 'linear-gradient(135deg,#0c1a2e 0%,#0f2a1e 100%)'
              : '#fff',
            boxShadow: isActive
              ? '0 12px 40px rgba(15,23,42,.25)'
              : '0 2px 12px rgba(0,0,0,.04)',
            animation:'fadeUp .22s ease both',
            position:'relative',
            overflow:'hidden',
          }}>
            {/* Decorative blobs when active */}
            {isActive && <>
              <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.18) 0%,transparent 70%)', pointerEvents:'none' }}/>
              <div style={{ position:'absolute', bottom:-40, left:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
              {/* Grid pattern overlay */}
              <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.04) 1px,transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }}/>
            </>}

            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
              {/* Left: icon + info */}
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div className={isActive ? 'status-ring' : ''} style={{
                  width:52, height:52, borderRadius:16, flexShrink:0,
                  background: isActive
                    ? 'linear-gradient(135deg,#2EC4B6,#1D9E75)'
                    : '#f1f5f9',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow: isActive ? '0 4px 20px rgba(46,196,182,.4)' : 'none',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>

                <div>
                  <p style={{ fontSize:16, fontWeight:800, color: isActive ? '#fff' : '#0f172a', margin:'0 0 5px', letterSpacing:'-.3px' }}>
                    {assistantName || 'Sin nombre'}
                  </p>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background: isActive ? '#22c55e' : '#cbd5e1', display:'inline-block', animation: isActive ? 'pulse 2s infinite' : 'none' }}/>
                    <span style={{ fontSize:12, fontWeight:600, color: isActive ? '#86efac' : '#94a3b8' }}>
                      {isActive ? 'Activo · Confirmando pedidos' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Toggle button */}
              <button
                onClick={handleToggle}
                disabled={toggling || (!isConfigured && !isActive)}
                className="toggle-btn"
                style={{
                  padding:'10px 18px', borderRadius:13, fontSize:13, fontWeight:800,
                  fontFamily:F, cursor: (!isConfigured && !isActive) ? 'not-allowed' : 'pointer',
                  opacity: (!isConfigured && !isActive) ? .4 : 1,
                  flexShrink:0,
                  display:'flex', alignItems:'center', gap:6,
                  border: isActive ? '1.5px solid rgba(252,165,165,.25)' : '1.5px solid #2EC4B6',
                  background: isActive ? 'rgba(220,38,38,.08)' : 'rgba(46,196,182,.06)',
                  color: isActive ? '#fca5a5' : '#0f766e',
                }}>
                {toggling
                  ? <div style={{ width:12, height:12, border:`2px solid ${isActive ? 'rgba(252,165,165,.3)' : 'rgba(46,196,182,.3)'}`, borderTopColor: isActive ? '#fca5a5' : '#0f766e', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
                  : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      {isActive
                        ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                        : <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>
                      }
                    </svg>
                }
                {toggling ? '...' : isActive ? 'Desactivar' : 'Activar'}
              </button>
            </div>

            {/* Stats row when active */}
            {isActive && (
              <div style={{ position:'relative', marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { label:'Número', value: vapiPhoneNumberId ? '✓ Configurado' : '—', ok: !!vapiPhoneNumberId },
                  { label:'Asistente', value: assistantName || '—', ok: !!assistantName },
                ].map(item => (
                  <div key={item.label} style={{ padding:'10px 14px', background:'rgba(255,255,255,.06)', borderRadius:12, border:'1px solid rgba(255,255,255,.08)' }}>
                    <p style={{ fontSize:10, color:'rgba(255,255,255,.35)', textTransform:'uppercase', letterSpacing:'.07em', margin:'0 0 3px', fontWeight:700 }}>{item.label}</p>
                    <p style={{ fontSize:13, color: item.ok ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.35)', margin:0, fontWeight:600 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Warning si no configurado ── */}
          {!isConfigured && (
            <div style={{ background:'#fffbeb', borderRadius:16, padding:'13px 16px', border:'1.5px solid #fde68a', display:'flex', alignItems:'center', gap:10, animation:'fadeUp .2s ease .05s both' }}>
              <div style={{ width:30, height:30, borderRadius:9, background:'#fef3c7', border:'1px solid #fde68a', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p style={{ fontSize:13, color:'#92400e', margin:0, fontWeight:600 }}>
                Completa la configuración para activar las llamadas automáticas
              </p>
            </div>
          )}

          {/* ── Nombre del asistente ── */}
          <div style={{ background:'#fff', borderRadius:22, padding:'clamp(18px,3vw,24px)', border:'1.5px solid #f1f5f9', boxShadow:'0 2px 12px rgba(0,0,0,.04)', animation:'fadeUp .2s ease .08s both' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'#f0fdf4', border:'1.5px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:0 }}>Nombre del asistente</p>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Cómo se presentará al llamar al cliente</p>
              </div>
            </div>

            <label style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:7, display:'block' }}>
              Nombre (femenino)
            </label>
            <div className="inp-wrap" style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                style={{ border:'none', background:'transparent', fontSize:14, color:'#0f172a', outline:'none', flex:1, minWidth:0, fontFamily:F, fontWeight:500 }}
                placeholder="Sara, Luna, Mia, Noa..."
                value={assistantName}
                onChange={e => setAssistantName(e.target.value)}
              />
              {assistantName && (
                <div style={{ width:20, height:20, borderRadius:'50%', background:'#f0fdf4', border:'1px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>

            <p style={{ fontSize:12, color:'#94a3b8', margin:'10px 0 0', lineHeight:1.5 }}>
              El nombre que el asistente usa al presentarse. El nombre de tu empresa se toma automáticamente de cada tienda.
            </p>
          </div>

          {/* ── Phone Number ID ── */}
          <div style={{ background:'#fff', borderRadius:22, padding:'clamp(18px,3vw,24px)', border:'1.5px solid #f1f5f9', boxShadow:'0 2px 12px rgba(0,0,0,.04)', animation:'fadeUp .2s ease .13s both' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'#faf5ff', border:'1.5px solid #e9d5ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:800, color:'#0f172a', margin:0 }}>Número de teléfono</p>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Tu número Twilio importado en VAPI</p>
              </div>
            </div>

            <label style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:7, display:'block' }}>
              Phone Number ID
            </label>
            <div className="inp-wrap" style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0 }}>
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <input
                className="phone-id-input"
                style={{ border:'none', background:'transparent', fontSize:13, color:'#0f172a', outline:'none', flex:1, minWidth:0, fontFamily:'monospace', fontWeight:500 }}
                placeholder="pn_xxxxxxxxxxxxxxxx"
                value={vapiPhoneNumberId}
                onChange={e => setVapiPhoneNumberId(e.target.value)}
              />
              {vapiPhoneNumberId && (
                <div style={{ width:20, height:20, borderRadius:'50%', background:'#f0fdf4', border:'1px solid #bbf7d0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
          </div>

          {/* ── Cómo obtenerlo ── */}
          <div style={{ background:'#fff', borderRadius:22, padding:'clamp(16px,3vw,22px)', border:'1.5px solid #f1f5f9', boxShadow:'0 2px 12px rgba(0,0,0,.04)', animation:'fadeUp .2s ease .18s both' }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.08em', margin:'0 0 14px' }}>
              Cómo obtener tu Phone Number ID
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {[
                { n:'1', title:'Crea cuenta en Twilio', desc:'twilio.com → compra un número español (+34)', color:'#0284c7', bg:'#f0f9ff', border:'#bae6fd' },
                { n:'2', title:'Importa a VAPI',        desc:'dashboard.vapi.ai → Phone Numbers → Add → Twilio', color:'#8b5cf6', bg:'#faf5ff', border:'#e9d5ff' },
                { n:'3', title:'Copia el ID',           desc:'El ID empieza por pn_ — pégalo arriba', color:'#0f766e', bg:'#f0fdf4', border:'#bbf7d0' },
              ].map((s, i) => (
                <div key={s.n} className="step-card" style={{ display:'flex', gap:12, padding:'9px 10px', borderRadius:12, marginBottom: i < 2 ? 2 : 0 }}>
                  <div style={{ width:28, height:28, borderRadius:9, background:s.bg, border:`1.5px solid ${s.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:s.color }}>{s.n}</span>
                  </div>
                  <div style={{ paddingTop:3 }}>
                    <p style={{ fontSize:13, fontWeight:700, color:'#0f172a', margin:'0 0 2px' }}>{s.title}</p>
                    <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Feedback ── */}
          {error && (
            <div style={{ background:'#fef2f2', border:'1.5px solid #fecaca', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, animation:'fadeUp .18s ease both' }}>
              <div style={{ width:28, height:28, borderRadius:9, background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p style={{ fontSize:13, color:'#dc2626', margin:0, fontWeight:600 }}>{error}</p>
            </div>
          )}

          {msg && (
            <div style={{ background:'#f0fdf4', border:'1.5px solid #bbf7d0', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, animation:'fadeUp .18s ease both' }}>
              <div style={{ width:28, height:28, borderRadius:9, background:'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ fontSize:13, color:'#15803d', margin:0, fontWeight:600 }}>{msg}</p>
            </div>
          )}

          {/* ── Guardar ── */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-save"
            style={{
              width:'100%', padding:'15px', borderRadius:16, border:'none',
              color: saving ? '#94a3b8' : '#fff',
              background: saving ? '#f1f5f9' : undefined,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize:15, fontWeight:800, fontFamily:F,
              display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow: saving ? 'none' : '0 4px 20px rgba(46,196,182,.28)',
              animation:'fadeUp .2s ease .23s both',
            }}>
            {saving
              ? <>
                  <div style={{ width:16, height:16, border:'2px solid #e2e8f0', borderTopColor:'#94a3b8', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
                  Guardando...
                </>
              : <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Guardar configuración
                </>
            }
          </button>

        </div>
      </div>
    </>
  )
}