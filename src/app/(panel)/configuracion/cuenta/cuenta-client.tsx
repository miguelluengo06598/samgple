'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

export default function CuentaClient({ account, profile }: { account: any; profile: any }) {
  const [name, setName]             = useState(account?.name ?? '')
  const [timezone, setTimezone]     = useState(profile?.timezone ?? 'Europe/Madrid')
  const [newPassword, setNewPassword] = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [msg, setMsg]               = useState('')
  const [error, setError]           = useState('')

  const initial = name?.charAt(0).toUpperCase() ?? '?'
  const passwordStrength = newPassword.length === 0 ? 0 : newPassword.length < 6 ? 1 : newPassword.length < 10 ? 2 : 3

  async function handleSave() {
    setSaving(true)
    setMsg('')
    setError('')
    try {
      await fetch('/api/account/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, timezone }),
      })
      if (newPassword.length >= 8) {
        const supabase = createClient()
        const { error: passError } = await supabase.auth.updateUser({ password: newPassword })
        if (passError) { setError(passError.message); return }
        setNewPassword('')
      }
      setMsg('Cambios guardados correctamente')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setError('Error al guardar. Inténtalo de nuevo.')
    } finally { setSaving(false) }
  }

  const timezones = [
    { value: 'Europe/Madrid',       label: '🇪🇸 Europa/Madrid' },
    { value: 'Europe/London',       label: '🇬🇧 Europa/Londres' },
    { value: 'Europe/Paris',        label: '🇫🇷 Europa/París' },
    { value: 'America/New_York',    label: '🇺🇸 América/Nueva York' },
    { value: 'America/Mexico_City', label: '🇲🇽 América/Ciudad de México' },
    { value: 'America/Bogota',      label: '🇨🇴 América/Bogotá' },
    { value: 'America/Lima',        label: '🇵🇪 América/Lima' },
    { value: 'America/Santiago',    label: '🇨🇱 América/Santiago' },
  ]

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .inp-wrap { transition:border-color 0.15s,box-shadow 0.15s; }
        .inp-wrap:focus-within { border-color:#2EC4B6!important; box-shadow:0 0 0 3px rgba(46,196,182,0.08)!important; }
        .inp-wrap-disabled { opacity:0.6; cursor:not-allowed; }
        .btn-save { transition:all 0.15s ease; }
        .btn-save:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 10px 28px rgba(46,196,182,0.3)!important; }
        .btn-save:active:not(:disabled) { transform:scale(0.98); }
        .tz-opt:checked { background:#2EC4B6; }
        @media(min-width:480px) {
          .form-grid { grid-template-columns:1fr 1fr!important; }
        }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px)', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/configuracion"
              style={{ width: 36, height: 36, borderRadius: 11, background: '#f8fafc', border: '1.5px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <h1 style={{ fontSize: 'clamp(17px,3.5vw,22px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.4px' }}>Mi cuenta</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Datos personales y seguridad</p>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Avatar hero */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(20px,4vw,28px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease both', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle,rgba(46,196,182,0.06),transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: '#fff', flexShrink: 0, boxShadow: '0 6px 20px rgba(46,196,182,0.3)' }}>
                {initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'clamp(16px,3.5vw,20px)', fontWeight: 800, color: '#0f172a', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name || 'Sin nombre'}
                </p>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {account?.email}
                </p>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#f0fdf4', color: '#0f766e', border: '1px solid #bbf7d0' }}>
                  Cuenta activa
                </span>
              </div>
            </div>
          </div>

          {/* Datos personales */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.05s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#f0fdf4', border: '1.5px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Datos personales</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Nombre y zona horaria</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Nombre */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7, display: 'block' }}>Nombre completo</label>
                <div className="inp-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo"
                    style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F, fontWeight: 500, minWidth: 0 }} />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7, display: 'block' }}>Email</label>
                <div className="inp-wrap-disabled" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: 14 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input value={account?.email} disabled
                    style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#94a3b8', outline: 'none', flex: 1, fontFamily: F, minWidth: 0 }} />
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0', flexShrink: 0 }}>No editable</span>
                </div>
              </div>

              {/* Zona horaria */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7, display: 'block' }}>Zona horaria</label>
                <div className="inp-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F, fontWeight: 500, cursor: 'pointer', minWidth: 0 }}>
                    {timezones.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', animation: 'fadeUp 0.2s ease 0.1s both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: '#faf5ff', border: '1.5px solid #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Seguridad</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Cambia tu contraseña</p>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 7, display: 'block' }}>Nueva contraseña</label>
              <div className="inp-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, marginBottom: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input type={showPass ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F, fontWeight: 500, minWidth: 0 }} />
                <button onClick={() => setShowPass(!showPass)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>

              {/* Indicador fortaleza */}
              {newPassword.length > 0 && (
                <div style={{ animation: 'popIn 0.2s ease both' }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= passwordStrength ? (passwordStrength === 1 ? '#ef4444' : passwordStrength === 2 ? '#f59e0b' : '#22c55e') : '#f1f5f9', transition: 'background 0.2s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: passwordStrength === 1 ? '#ef4444' : passwordStrength === 2 ? '#f59e0b' : '#22c55e', margin: 0, fontWeight: 600 }}>
                    {passwordStrength === 1 ? 'Contraseña débil' : passwordStrength === 2 ? 'Contraseña media' : 'Contraseña fuerte ✓'}
                  </p>
                </div>
              )}

              {newPassword.length > 0 && newPassword.length < 8 && (
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '6px 0 0' }}>Mínimo 8 caracteres ({8 - newPassword.length} restantes)</p>
              )}
            </div>
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
            style={{ width: '100%', padding: '16px', borderRadius: 18, border: 'none', background: saving ? '#f1f5f9' : 'linear-gradient(135deg,#2EC4B6,#1D9E75)', color: saving ? '#94a3b8' : '#fff', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800, fontFamily: F, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: saving ? 'none' : '0 4px 20px rgba(46,196,182,0.3)', animation: 'fadeUp 0.2s ease 0.15s both' }}>
            {saving ? (
              <>
                <div style={{ width: 16, height: 16, border: '2px solid #e2e8f0', borderTopColor: '#94a3b8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Guardando...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Guardar cambios
              </>
            )}
          </button>

        </div>
      </div>
    </>
  )
}