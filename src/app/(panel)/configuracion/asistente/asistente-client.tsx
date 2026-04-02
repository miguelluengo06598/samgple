'use client'

import { useState } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function AsistenteClient({ initialConfig }: { initialConfig: any }) {
  const [config, setConfig]       = useState(initialConfig)
  const [saving, setSaving]       = useState(false)
  const [toggling, setToggling]   = useState(false)
  const [msg, setMsg]             = useState('')
  const [error, setError]         = useState('')

  const [vapiPhoneNumberId, setVapiPhoneNumberId] = useState(config?.vapi_phone_number_id ?? '')
  const [assistantName, setAssistantName]         = useState(config?.assistant_name ?? '')
  const [companyName, setCompanyName]             = useState(config?.company_name ?? '')
  const [welcomeMessage, setWelcomeMessage]       = useState(config?.welcome_message ?? '')

  const isActive     = config?.active ?? false
  const isConfigured = !!config?.vapi_phone_number_id

  async function handleSave() {
    setSaving(true)
    setMsg('')
    setError('')
    try {
      const res = await fetch('/api/vapi/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vapi_phone_number_id: vapiPhoneNumberId,
          assistant_name:       assistantName,
          company_name:         companyName,
          welcome_message:      welcomeMessage,
        }),
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
    setToggling(true)
    setError('')
    try {
      const res = await fetch('/api/vapi/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !isActive }),
      })
      const data = await res.json()
      if (data.ok) {
        setConfig((prev: any) => ({ ...prev, active: !isActive }))
      } else {
        setError(data.error)
      }
    } finally { setToggling(false) }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes glow    { 0%,100%{box-shadow:0 0 0 0 rgba(46,196,182,0)} 50%{box-shadow:0 0 0 8px rgba(46,196,182,0.1)} }
        .inp-wrap { transition:border-color 0.15s,box-shadow 0.15s; }
        .inp-wrap:focus-within { border-color:#2EC4B6!important; box-shadow:0 0 0 3px rgba(46,196,182,0.08)!important; }
        .var-chip { transition:all 0.12s ease; cursor:pointer; }
        .var-chip:hover { background:#2EC4B6!important; color:#fff!important; border-color:#2EC4B6!important; transform:translateY(-1px); }
        .btn-save { transition:all 0.15s ease; }
        .btn-save:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(46,196,182,0.25)!important; }
        .btn-save:active { transform:scale(0.98); }
        .toggle-btn { transition:all 0.15s ease; }
        .toggle-btn:hover { opacity:0.85; }
        .step-item { transition:background 0.1s; }
        .step-item:hover { background:#f0fdf4; border-radius:12px; }
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
              <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Asistente IA</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Configura tu agente de llamadas automáticas</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Hero estado */}
          <div style={{ background: isActive ? 'linear-gradient(135deg,#0f172a,#1e293b)' : '#fff', borderRadius: 24, padding: 'clamp(20px,4vw,28px)', border: isActive ? 'none' : '1.5px solid #f1f5f9', boxShadow: isActive ? '0 8px 32px rgba(15,23,42,0.2)' : '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease both', position: 'relative', overflow: 'hidden' }}>

            {isActive && (
              <>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle,rgba(46,196,182,0.15),transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(29,158,117,0.1),transparent 70%)', pointerEvents: 'none' }} />
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: isActive ? 'linear-gradient(135deg,#2EC4B6,#1D9E75)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isActive ? '0 4px 16px rgba(46,196,182,0.35)' : 'none', animation: isActive ? 'glow 3s infinite' : 'none' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: isActive ? '#fff' : '#0f172a', margin: '0 0 4px' }}>
                    {assistantName || 'Tu asistente'}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? '#22c55e' : '#94a3b8', display: 'inline-block', animation: isActive ? 'pulse 2s infinite' : 'none' }} />
                    <span style={{ fontSize: 12, color: isActive ? '#86efac' : '#94a3b8', fontWeight: 600 }}>
                      {isActive ? 'Activo · Confirmando pedidos' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <button onClick={handleToggle} disabled={toggling || (!isConfigured && !isActive)} className="toggle-btn"
                style={{ padding: '10px 20px', borderRadius: 14, border: `2px solid ${isActive ? 'rgba(254,202,202,0.3)' : '#2EC4B6'}`, background: isActive ? 'rgba(220,38,38,0.1)' : '#fff', color: isActive ? '#fca5a5' : '#0f766e', cursor: (!isConfigured && !isActive) ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 800, opacity: (!isConfigured && !isActive) ? 0.4 : 1, fontFamily: F, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {toggling
                  ? <div style={{ width: 12, height: 12, border: `2px solid ${isActive ? 'rgba(252,165,165,0.3)' : 'rgba(46,196,182,0.3)'}`, borderTopColor: isActive ? '#fca5a5' : '#0f766e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  : null
                }
                {toggling ? '...' : isActive ? 'Desactivar' : 'Activar'}
              </button>
            </div>

            {isActive && companyName && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 16 }}>
                {[
                  { label: 'Empresa', value: companyName },
                  { label: 'Teléfono', value: vapiPhoneNumberId ? 'Configurado' : '—' },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 2px', fontWeight: 700 }}>{item.label}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, fontWeight: 600 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning si no configurado */}
          {!isConfigured && (
            <div style={{ background: '#fffbeb', borderRadius: 16, padding: '14px 16px', border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeUp 0.2s ease 0.05s both' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, color: '#92400e', margin: 0, fontWeight: 600 }}>Añade tu Phone Number ID de Twilio para activar las llamadas</p>
            </div>
          )}

          {/* Identidad */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.1s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Identidad del asistente</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Nombre y empresa que usa en las llamadas</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Nombre del asistente', placeholder: 'Sara, Luna, Carlos...', value: assistantName, onChange: setAssistantName, icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 3a4 4 0 100 8 4 4 0 000-8z' },
                { label: 'Nombre de tu empresa', placeholder: 'MiTienda, BeautyDrop...', value: companyName, onChange: setCompanyName, icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7, display: 'block' }}>{field.label}</label>
                  <div className="inp-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d={field.icon}/></svg>
                    <input style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0, fontFamily: F, fontWeight: 500 }}
                      placeholder={field.placeholder} value={field.value} onChange={e => field.onChange(e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje bienvenida */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.15s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#eff6ff', border: '1.5px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Mensaje de bienvenida</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Lo primero que dice al llamar. Vacío = predeterminado</p>
              </div>
            </div>

            <div className="inp-wrap" style={{ border: '1.5px solid #f1f5f9', borderRadius: 14, overflow: 'hidden', marginBottom: 10 }}>
              <textarea
                value={welcomeMessage}
                onChange={e => setWelcomeMessage(e.target.value)}
                placeholder="Hola, ¿hablo con {customer_name}?"
                style={{ width: '100%', padding: '13px 16px', background: '#f8fafc', border: 'none', fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: F, minHeight: 88, resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', fontWeight: 500 } as React.CSSProperties}
              />
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 8px' }}>Variables disponibles</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['{customer_name}', '{product_name}', '{order_total}', '{order_number}', '{company_name}'].map(v => (
                <span key={v} className="var-chip"
                  onClick={() => setWelcomeMessage(prev => prev + v)}
                  style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#f0fdf4', color: '#0f766e', border: '1px solid #bbf7d0', fontFamily: 'monospace', fontWeight: 700 }}>
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Phone Number ID */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.2s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#faf5ff', border: '1.5px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Número de teléfono</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                  Tu número Twilio en{' '}
                  <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6', fontWeight: 700, textDecoration: 'none' }}>VAPI → Phone Numbers</a>
                </p>
              </div>
            </div>

            <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7, display: 'block' }}>Phone Number ID</label>
            <div className="inp-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              <input
                style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0, fontFamily: F, fontWeight: 500 }}
                placeholder="pn_xxxxxxxxxxxxxxxx"
                value={vapiPhoneNumberId}
                onChange={e => setVapiPhoneNumberId(e.target.value)}
              />
              {vapiPhoneNumberId && (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </div>
          </div>

          {/* Guía rápida */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,20px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.25s both' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Cómo obtener tu Phone Number ID</p>
            {[
              { n: '1', title: 'Crea cuenta en Twilio',  desc: 'twilio.com → compra un número español (+34)', color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
              { n: '2', title: 'Importa a VAPI',         desc: 'VAPI → Phone Numbers → Add → Twilio',       color: '#8b5cf6', bg: '#faf5ff', border: '#e9d5ff' },
              { n: '3', title: 'Copia el ID',            desc: 'El ID empieza por pn_xxxxxxxxxx',           color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
            ].map((s, i) => (
              <div key={s.n} className="step-item" style={{ display: 'flex', gap: 12, padding: '8px', marginBottom: i < 2 ? 4 : 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: s.bg, border: `1.5px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: s.color }}>{s.n}</span>
                </div>
                <div style={{ paddingTop: 3 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{s.title}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeUp 0.2s ease both' }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {msg && (
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeUp 0.2s ease both' }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 600 }}>{msg}</p>
            </div>
          )}

          {/* Guardar */}
          <button onClick={handleSave} disabled={saving} className="btn-save"
            style={{ width: '100%', padding: '16px', borderRadius: 18, border: 'none', background: saving ? '#f1f5f9' : 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: saving ? '#94a3b8' : '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: saving ? 'none' : '0 4px 20px rgba(46,196,182,0.3)', animation: 'fadeUp 0.2s ease 0.3s both' }}>
            {saving ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid #e2e8f0', borderTopColor: '#94a3b8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Guardando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Guardar configuración
              </>
            )}
          </button>

        </div>
      </div>
    </>
  )
}