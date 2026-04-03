'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }
    router.push('/pedidos')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.75)} }
        @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes orb1     { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-20px) scale(1.1)} }
        @keyframes orb2     { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,30px) scale(1.08)} }

        .login-page {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #f8fffe;
          position: relative;
          overflow: hidden;
        }

        /* Panel izquierdo decorativo */
        .login-left {
          display: none;
          flex: 1;
          background: linear-gradient(150deg,#0f172a 0%,#0c1e3e 60%,#0d1a2e 100%);
          position: relative;
          overflow: hidden;
          align-items: center;
          justify-content: center;
          padding: 60px 48px;
        }
        @media(min-width:900px) { .login-left { display: flex; } }

        .login-right {
          width: 100%;
          max-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px,5vw,48px) 24px;
          background: #fff;
          position: relative;
          z-index: 1;
        }
        @media(min-width:900px) {
          .login-right {
            width: 480px;
            max-width: 480px;
            flex-shrink: 0;
            box-shadow: -20px 0 80px rgba(0,0,0,0.06);
          }
        }

        .login-card {
          width: 100%;
          max-width: 400px;
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
        .input-wrap:focus-within svg { stroke: #2EC4B6; }

        .login-input {
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
        .login-input::placeholder { color: #94a3b8; font-weight: 400; }

        .login-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: none;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
          letter-spacing: -.2px;
          transition: all .18s cubic-bezier(.34,1.56,.64,1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          will-change: transform;
        }
        .login-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(46,196,182,0.45) !important;
        }
        .login-btn:not(:disabled):active { transform: scale(.97); }
        .login-btn:disabled { cursor: not-allowed; opacity: .7; }

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

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          transition: background .2s;
        }
        .feature-pill:hover { background: rgba(255,255,255,0.08); }

        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #2EC4B6;
          box-shadow: 0 0 8px rgba(46,196,182,.8);
          animation: pulse 2.5s ease-in-out infinite;
          display: inline-block;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        .forgot-link {
          font-size: 12px;
          color: #2EC4B6;
          font-weight: 600;
          text-align: right;
          margin: 0;
          cursor: pointer;
          transition: opacity .15s;
          font-family: 'DM Sans', system-ui, sans-serif;
        }
        .forgot-link:hover { opacity: .75; }
      `}</style>

      <div className="login-page">

        {/* ── PANEL IZQUIERDO (solo desktop) ── */}
        <div className="login-left">
          {/* Orbs */}
          <div className="orb-1" style={{ position:'absolute', top:-100, left:-80, width:400, height:400, background:'radial-gradient(circle,rgba(46,196,182,0.18),transparent 65%)', pointerEvents:'none' }} />
          <div className="orb-2" style={{ position:'absolute', bottom:-120, right:-60, width:480, height:480, background:'radial-gradient(circle,rgba(99,102,241,0.14),transparent 65%)', pointerEvents:'none' }} />

          <div style={{ position:'relative', zIndex:1, maxWidth:400 }}>
            {/* Logo */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:52 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 16px rgba(46,196,182,.45)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontSize:17, fontWeight:800, color:'#fff', letterSpacing:'-0.6px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
              </span>
            </div>

            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(46,196,182,0.1)', border:'1px solid rgba(46,196,182,0.22)', borderRadius:20, padding:'5px 13px', marginBottom:24 }}>
              <span className="live-dot" />
              <span style={{ fontSize:11, fontWeight:700, color:'#5eead4', letterSpacing:'0.06em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>120+ TIENDAS ACTIVAS</span>
            </div>

            <h2 style={{ fontSize:'clamp(28px,3.5vw,40px)', fontWeight:800, color:'#fff', letterSpacing:'-1.5px', lineHeight:1.1, margin:'0 0 16px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Gestiona tus pedidos<br />
              <span className="gradient-text">COD con IA.</span>
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.45)', lineHeight:1.75, margin:'0 0 40px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
              Confirma automáticamente, reduce devoluciones y controla cada pedido desde un solo panel.
            </p>

            {/* Features */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10', color:'#2EC4B6', label:'Score de riesgo por pedido' },
                { icon:'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8', color:'#a78bfa', label:'Llamadas automáticas Vapi' },
                { icon:'M13 10V3L4 14h7v7l9-11h-7z', color:'#34d399', label:'Integración Shopify en 10 min' },
              ].map((f,i) => (
                <div key={i} className="feature-pill">
                  <div style={{ width:34, height:34, borderRadius:10, background:`${f.color}18`, border:`1px solid ${f.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="2" strokeLinecap="round"><path d={f.icon}/></svg>
                  </div>
                  <span style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.7)', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{f.label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:36 }}>
              {[
                { v:'−42%', l:'Devoluciones', c:'#2EC4B6' },
                { v:'87%',  l:'Confirmación', c:'#a78bfa' },
                { v:'<5min',l:'Por pedido',   c:'#34d399' },
              ].map(s => (
                <div key={s.v} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
                  <p style={{ fontSize:20, fontWeight:800, color:s.c, margin:'0 0 3px', letterSpacing:'-1px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.v}</p>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', fontFamily:"'DM Sans',system-ui,sans-serif" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO — formulario ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Logo móvil */}
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:40 }}>
              <div style={{ width:36, height:36, borderRadius:11, background:'linear-gradient(135deg,#2EC4B6,#1A9E8F)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(46,196,182,.4)' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <span style={{ fontSize:17, fontWeight:800, color:'#0f172a', letterSpacing:'-0.6px', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                SAMG<span style={{ color:'#2EC4B6' }}>PLE</span>
              </span>
            </div>

            {/* Encabezado */}
            <div style={{ marginBottom:32 }}>
              <h1 style={{ fontSize:'clamp(24px,4vw,30px)', fontWeight:800, color:'#0f172a', letterSpacing:'-1px', margin:'0 0 8px', fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.15 }}>
                Bienvenido de nuevo
              </h1>
              <p style={{ fontSize:14, color:'#64748b', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif", lineHeight:1.6 }}>
                Accede a tu panel de gestión de pedidos COD
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>

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
                    className="login-input"
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
                    placeholder="••••••••"
                    className="login-input"
                  />
                </div>
              </div>

              {/* ¿Olvidaste? */}
              <p className="forgot-link">¿Olvidaste tu contraseña?</p>

              {/* Error */}
              {error && (
                <div style={{ padding:'11px 14px', borderRadius:12, background:'#fef2f2', border:'1px solid #fecaca', display:'flex', alignItems:'center', gap:9 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ fontSize:13, color:'#dc2626', margin:0, fontWeight:600, fontFamily:"'DM Sans',system-ui,sans-serif" }}>{error}</p>
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{
                  background: loading
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg,#2EC4B6,#1A9E8F)',
                  color: loading ? '#94a3b8' : '#fff',
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(46,196,182,0.38)',
                  marginTop:4,
                }}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Entrando...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </>
                )}
              </button>

              {/* Registro */}
              <p style={{ fontSize:13, color:'#64748b', textAlign:'center', margin:0, fontFamily:"'DM Sans',system-ui,sans-serif" }}>
                ¿No tienes cuenta?{' '}
                <a href="/registro" style={{ color:'#2EC4B6', fontWeight:700, textDecoration:'none' }}>
                  Regístrate gratis
                </a>
              </p>

            </form>

            {/* Footer */}
            <div style={{ marginTop:36, paddingTop:24, borderTop:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <span className="live-dot" style={{ width:6, height:6 }} />
              <span style={{ fontSize:11, color:'#94a3b8', fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:500 }}>
                Sistema activo · 120+ tiendas confirmando ahora
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}