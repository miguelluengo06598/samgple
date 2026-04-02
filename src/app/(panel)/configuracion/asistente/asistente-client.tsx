'use client'

import { useState } from 'react'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function AsistenteClient({ initialConfig }: { initialConfig: any }) {
  const [config, setConfig] = useState(initialConfig)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const [vapiPhoneNumberId, setVapiPhoneNumberId] = useState(config?.vapi_phone_number_id ?? '')
  const [assistantName, setAssistantName] = useState(config?.assistant_name ?? '')
  const [companyName, setCompanyName] = useState(config?.company_name ?? '')
  const [welcomeMessage, setWelcomeMessage] = useState(config?.welcome_message ?? '')

  const isActive = config?.active ?? false
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
        setMsg('Configuración guardada correctamente')
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

  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '18px 20px', border: '1px solid #e8f4f3', marginBottom: 12 }
  const fieldWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 14, marginBottom: 8 }
  const fieldIn: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0, fontFamily: F }
  const flabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, display: 'block', fontFamily: F }

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/configuracion" style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Asistente IA</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Configura tu agente de llamadas</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>

        {/* Estado */}
        <div style={{ ...card, background: isActive ? 'linear-gradient(135deg,rgba(46,196,182,0.08),rgba(29,158,117,0.04))' : '#fff', borderColor: isActive ? 'rgba(46,196,182,0.3)' : '#e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: isActive ? 'linear-gradient(135deg,#2EC4B6,#1D9E75)' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>{assistantName || 'Tu asistente'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isActive ? '#22c55e' : '#94a3b8', display: 'inline-block' }} />
                <span style={{ fontSize: 12, color: isActive ? '#16a34a' : '#94a3b8', fontWeight: 500 }}>{isActive ? 'Activo — llamando pedidos' : 'Inactivo'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling || (!isConfigured && !isActive)}
            style={{ padding: '10px 18px', borderRadius: 14, border: `2px solid ${isActive ? '#fecaca' : '#2EC4B6'}`, background: '#fff', color: isActive ? '#dc2626' : '#0f766e', cursor: (!isConfigured && !isActive) ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 800, opacity: (!isConfigured && !isActive) ? 0.4 : 1 }}
          >
            {toggling ? '...' : isActive ? 'Desactivar' : 'Activar'}
          </button>
        </div>

        {!isConfigured && (
          <div style={{ background: '#fffbeb', borderRadius: 14, padding: '12px 16px', marginBottom: 12, border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p style={{ fontSize: 12, color: '#92400e', margin: 0, fontWeight: 500 }}>Añade tu número de Twilio para activar las llamadas automáticas</p>
          </div>
        )}

        {/* Identidad */}
        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>Identidad del asistente</p>

          <span style={flabel}>Nombre del asistente</span>
          <div style={{ ...fieldWrap, marginBottom: 12 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input style={fieldIn} placeholder="Sara, Luna, Carlos..." value={assistantName} onChange={e => setAssistantName(e.target.value)} />
          </div>

          <span style={flabel}>Nombre de tu empresa</span>
          <div style={fieldWrap}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <input style={fieldIn} placeholder="MiTienda, BeautyDrop..." value={companyName} onChange={e => setCompanyName(e.target.value)} />
          </div>
        </div>

        {/* Mensaje bienvenida */}
        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Mensaje de bienvenida</p>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>Lo primero que dice el asistente al llamar. Déjalo vacío para usar el predeterminado.</p>
          <textarea
            value={welcomeMessage}
            onChange={e => setWelcomeMessage(e.target.value)}
            placeholder="Hola, ¿hablo con {customer_name}?"
            style={{ ...fieldIn, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 14, minHeight: 90, resize: 'vertical', display: 'block', width: '100%', boxSizing: 'border-box', lineHeight: 1.6, marginBottom: 8 } as React.CSSProperties}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['{customer_name}', '{product_name}', '{order_total}', '{order_number}', '{company_name}'].map(v => (
              <span key={v} onClick={() => setWelcomeMessage(prev => prev + v)}
                style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: '#f0fafa', color: '#0f766e', border: '1px solid #cce8e6', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 600 }}>
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Número Twilio */}
        <div style={card}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Número de teléfono</p>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px' }}>
            Tu número de Twilio conectado en{' '}
            <a href="https://dashboard.vapi.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#2EC4B6', fontWeight: 600 }}>VAPI → Phone Numbers</a>
          </p>

          <span style={flabel}>Phone Number ID</span>
          <div style={fieldWrap}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.22 2.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            <input style={fieldIn} placeholder="pn_xxxxxxxxxxxxxxxx" value={vapiPhoneNumberId} onChange={e => setVapiPhoneNumberId(e.target.value)} />
          </div>
        </div>

        {/* Guía */}
        <div style={{ background: '#f0fdf4', borderRadius: 18, padding: '16px 18px', border: '1px solid #bbf7d0', marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', margin: '0 0 10px' }}>Cómo obtener tu Phone Number ID</p>
          {[
            { n: '1', t: 'Crea cuenta en Twilio', d: 'twilio.com → compra un número español' },
            { n: '2', t: 'Conéctalo a VAPI', d: 'VAPI → Phone Numbers → Add → importa tu número' },
            { n: '3', t: 'Copia el Phone Number ID', d: 'El ID empieza por pn_xxxxxxxx' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#2EC4B6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{s.n}</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{s.t}</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 600 }}>{error}</p>
          </div>
        )}

        {msg && (
          <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 14, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 600 }}>{msg}</p>
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          style={{ width: '100%', padding: '15px 18px', borderRadius: 16, border: '2px solid #2EC4B6', background: '#fff', color: '#0f766e', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(46,196,182,0.12)', fontFamily: F, opacity: saving ? 0.6 : 1 }}>
          <span>{saving ? 'Guardando...' : 'Guardar configuración'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>

      </div>
    </div>
  )
}