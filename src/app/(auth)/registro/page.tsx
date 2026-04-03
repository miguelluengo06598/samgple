'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (!accepted) {
      setError('Debes aceptar los términos y condiciones')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/pedidos')
    router.refresh()
  }

  const btnDisabled = loading || !accepted

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes orb1    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(28px,-18px) scale(1.1)} }
        @keyframes orb2    { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,28px) scale(1.08)} }
        @keyframes checkIn { from{transform:scale(0) rotate(-10deg)} to{transform:scale(1) rotate(0)} }

        .reg-page {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #f8fffe;
          overflow: hidden;
        }

        /* Panel izquierdo */
        .reg-left {
          display: none;
          flex: 1;
          background: linear-gradient(150deg,#0f172a 0%,#130f2a 55%,#0d1128 100%);
          position: relative;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
        }
        @media(min-width:900px) { .reg-left { display: flex; } }

        .reg-right {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px,5vw,48px) 24px;
          background: #fff;
          position: relative;
          z-index: 1;
          overflow-y: auto;
        }
        @media(min-width:900px) {
          .reg-right {
            width: 500px;
            max-width: 500px;
            flex-shrink: 0;
            box-shadow: -20px 0 80px rgba(0,0,0,0.06);
          }
        }

        .reg-card {
          width: 100%;
          max-width: 420px;
          animation: fadeUp .55s cubic-bezier(.22,1,.36,1) both;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 16px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          transition: border-color .15s, background .15s, box-shadow .15s;
        }
        .input-wrap:focus-within {
          border-color: #2EC4B6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(46,196,182,0.12);
        }
        .input-wrap:focus-within svg { stroke: #2EC4B6 !important; }

        .reg-input {
          border: none;
          background: transparent;
          font-size: 14px;
          color: #0f172a;
          outline: none;
          flex: 1;
          min-width: 0;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-weight: 500;
        }
        .reg-input::placeholder { color: #94a3b8; font-weight: 400; }

        .reg-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          font-family: 'DM Sans', system-ui, sans-serif;
          letter-spacing: -.2px;
          transition: all .18s cubic-bezier(.34,1.56,.64,1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          will-change: transform;
          cursor: pointer;
        }
        .reg-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(46,196,182,0.45) !important;
        }
        .reg-btn:not(:disabled):active { transform: scale(.97); }
        .reg-btn:disabled { cursor: not-allowed; opacity: .65; }

        .gradient-text {
          background: linear-gradient(135deg,#2EC4B6,#6366f1,#2EC4B6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .orb-1 { animation: orb1 8s ease-in-out infinite; }
        .orb-2 { animation: orb2 10s ease-in-out infinite; }

        .step-pill {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 11px 15px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 13px;
          transition: background .2s;
        }
        .step-pill:hover { background: rgba(255,255,255,0.07); }

        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #2EC4B6;
          box-shadow: 0 0 8px rgba(46,196,182,.8);
          animation: pulse 2.5s ease-in-out infinite;
          display: inline-block;
          flex-shrink: 0;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          flex-shrink: 0;
        }

        .check-anim { animation: checkIn .2s cubic-bezier(.34,1.56,.64,1) both; }

        .pw-bar-fill {
          height: 100%;
          border-radius: 4px;
          transition: width .3s ease, background .3s ease;
        }
      `}</style>

      <div className="reg-page">

        {/* ── PANEL IZQUIERDO (solo desktop) ── */}
        <div className="reg-left">
          <div className="orb-1" style={{ position:'absolute', top:-100, left:-80, width:420, height:420, background:'radial-gradient(circle,rgba(46,196,182,0.16),transparent 65%)', pointerEvents:'none' }} />
          <div className="orb-2" style={{ position:'absolute', bottom:-120, right:-60, width:500, height:500, background:'radial-gradient(circle,rgba(99,102,241,0.14),transparent 65%)', pointerEvents:'none' }} />

          <div style={{ position:'relative', zIndex:1, maxWidth:400 }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:48 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(46,196,182,.45)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.6px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
              </span>
            </div>

            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.1)', border:'1px solid rgba(46,196,182,0.22)', borderRadius:20, padding:'5px 13px', marginBottom:22 }}>
              <span className="live-dot" />
              <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:'0.06em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>GRATIS PARA EMPEZAR</span>
            </div>

            <h2 style={{ fontSize:'clamp(26px,3.5vw,38px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, margin:'0 0 14px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Empieza a confirmar<br />
              <span className="gradient-text">pedidos COD hoy.</span>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.42)', lineHeight:1.75, margin:'0 0 36px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Conecta Shopify en 10 minutos y empieza a confirmar pedidos automáticamente con voz IA.
            </p>

            {/* Steps de onboarding */}
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:36 }}>
              {[
                { n:'01', label:'Crea tu cuenta gratis',            color:'#2EC4B6' },
                { n:'02', label:'Conecta tu tienda Shopify',        color:'#a78bfa' },
                { n:'03', label:'Configura tu asistente IA',        color:'#34d399' },
                { n:'04', label:'Los pedidos se confirman solos',   color:'#f59e0b' },
              ].map((s,i) => (
                <div key={i} className="step-pill">
                  <div style={{ width:30, height:30, borderRadius:9, background:`${s.color}18`, border:`1px solid ${s.color}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:s.color, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.n}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.65)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.label}</span>
                  {i === 0 && (
                    <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:5 }}>
                      <span className="live-dot" style={{ width:5, height:5 }} />
                      <span style={{ fontSize:10, color:'#2EC4B6', fontWeight:700, fontFamily:"'DM Sans',system-ui,sans-serif" }}>Ahora</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              {[
                { v:'10min', l:'Setup',        c:'#2EC4B6' },
                { v:'−42%', l:'Devoluciones', c:'#a78bfa' },
                { v:'0€',   l:'Para empezar', c:'#34d399' },
              ].map(s => (
                <div key={s.v} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
                  <p style={{ fontSize:19, fontWeight:800, color:s.c, margin:'0 0 3px', letterSpacing:'-0.8px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.v}</p>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO — formulario ── */}
        <div className="reg-right">
          <div className="reg-card">

            {/* Logo móvil */}
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:36 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(46,196,182,.4)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontSize:17, fontWeight:800, color:'#0f172a', letterSpacing:'-0.6px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
              </span>
            </div>

            {/* Encabezado */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(46,196,182,0.07)', border:'1px solid rgba(46,196,182,0.18)', borderRadius:20, padding:'4px 12px', marginBottom:14 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#2EC4B6', display:'inline-block' }} />
                <span style={{ fontSize:11, fontWeight:700, color:'#0f766e', letterSpacing:'0.06em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>TOKENS DE BIENVENIDA INCLUIDOS</span>
              </div>
              <h1 style={{ fontSize:'clamp(22px,4vw,28px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1px', margin:'0 0 8px', fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.15 }}>
                Crea tu cuenta gratis
              </h1>
              <p style={{ fontSize:14, color:'#64748b', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.6 }}>
                Sin tarjeta de crédito · Sin permanencia
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:14 }}>

              {/* Nombre */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:7, display:'block', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  Nombre completo
                </label>
                <div className="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, transition:'stroke .15s' }}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="reg-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:7, display:'block', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  Email
                </label>
                <div className="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, transition:'stroke .15s' }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="reg-input"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:7, display:'block', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  Contraseña
                </label>
                <div className="input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, transition:'stroke .15s' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="reg-input"
                  />
                </div>
                {/* Barra de fortaleza */}
                {password.length > 0 && (
                  <div style={{ marginTop:8 }}>
                    <div style={{ height:3, background:'#f1f5f9', borderRadius:4, overflow:'hidden' }}>
                      <div className="pw-bar-fill" style={{
                        width: password.length < 4 ? '25%' : password.length < 8 ? '55%' : '100%',
                        background: password.length < 4 ? '#ef4444' : password.length < 8 ? '#f59e0b' : '#2EC4B6',
                      }} />
                    </div>
                    <p style={{ fontSize:11, color: password.length < 4 ? '#ef4444' : password.length < 8 ? '#f59e0b' : '#0f766e', margin:'4px 0 0', fontWeight:600, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                      {password.length < 4 ? 'Contraseña débil' : password.length < 8 ? 'Casi lista...' : '✓ Contraseña segura'}
                    </p>
                  </div>
                )}
              </div>

              {/* Checkbox términos */}
              <div
                onClick={() => setAccepted(!accepted)}
                style={{
                  display:'flex', alignItems:'flex-start', gap:11,
                  padding:'13px 15px',
                  background: accepted ? 'rgba(46,196,182,0.05)' : '#f8fafc',
                  borderRadius:14,
                  border:`1.5px solid ${accepted ? 'rgba(46,196,182,0.25)' : '#e2e8f0'}`,
                  cursor:'pointer',
                  transition:'all .15s',
                }}
              >
                <div style={{
                  width:20, height:20,
                  background: accepted ? '#2EC4B6' : '#fff',
                  border:`2px solid ${accepted ? '#2EC4B6' : '#cbd5e1'}`,
                  borderRadius:6, flexShrink:0, marginTop:1,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  transition:'all .15s',
                  boxShadow: accepted ? '0 2px 8px rgba(46,196,182,.35)' : 'none',
                }}>
                  {accepted && (
                    <svg className="check-anim" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <p style={{ fontSize:12, color:'#64748b', margin:0, lineHeight:1.6, userSelect:'none', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                  Acepto los{' '}
                  <span onClick={e => e.stopPropagation()} style={{ color:'#2EC4B6', fontWeight:700, cursor:'pointer' }}>
                    términos y condiciones
                  </span>
                  {' '}y la{' '}
                  <span onClick={e => e.stopPropagation()} style={{ color:'#2EC4B6', fontWeight:700, cursor:'pointer' }}>
                    política de privacidad
                  </span>
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ padding:'11px 14px', borderRadius:12, background:'#fef2f2', border:'1px solid #fecaca', display:'flex', alignItems:'center', gap:9 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}>
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p style={{ fontSize:13, color:'#dc2626', margin:0, fontWeight:600, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{error}</p>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={btnDisabled}
                className="reg-btn"
                style={{
                  background: btnDisabled
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg,#2EC4B6,#1A9E8F)',
                  color: btnDisabled ? '#94a3b8' : '#fff',
                  boxShadow: btnDisabled ? 'none' : '0 8px 24px rgba(46,196,182,0.38)',
                  marginTop:4,
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Crear cuenta gratis
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>

              {/* Login link */}
              <p style={{ fontSize:13, color:'#64748b', textAlign:'center', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                ¿Ya tienes cuenta?{' '}
                <a href="/login" style={{ color:'#2EC4B6', fontWeight:700, textDecoration:'none' }}>
                  Inicia sesión
                </a>
              </p>

            </form>

            {/* Footer */}
            <div style={{ marginTop:32, paddingTop:22, borderTop:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <span className="live-dot" style={{ width:6, height:6 }} />
              <span style={{ fontSize:11, color:'#94a3b8', fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:500 }}>
                Sin tarjeta · Sin permanencia · Cancela cuando quieras
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}