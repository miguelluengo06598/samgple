'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const F = 'system-ui,-apple-system,sans-serif'

const btn = (color: string, border: string, textColor: string, shadow: string): React.CSSProperties => ({
  width: '100%', padding: '15px 18px', borderRadius: 16, border: `2px solid ${border}`,
  background: color, color: textColor, cursor: 'pointer', fontSize: 14, fontWeight: 800,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  boxShadow: shadow, fontFamily: F, marginBottom: 10,
})

export default function CuentaClient({ account, profile }: { account: any, profile: any }) {
  const [name, setName] = useState(account?.name ?? '')
  const [timezone, setTimezone] = useState(profile?.timezone ?? 'Europe/Madrid')
  const [newPassword, setNewPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const initial = name?.charAt(0).toUpperCase() ?? '?'

  async function handleSave() {
    setSaving(true)
    setMsg('')
    try {
      await fetch('/api/account/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, timezone }),
      })
      if (newPassword.length >= 8) {
        const supabase = createClient()
        await supabase.auth.updateUser({ password: newPassword })
        setNewPassword('')
      }
      setMsg('Guardado correctamente')
      setTimeout(() => setMsg(''), 3000)
    } finally { setSaving(false) }
  }

  const fieldWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 9, padding: '12px 13px', background: '#f8fafc', border: '1.5px solid #e8f4f3', borderRadius: 13, marginBottom: 8 }
  const fieldInput: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: 13, color: '#0f172a', outline: 'none', flex: 1, fontFamily: F }
  const fieldLabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5, display: 'block', fontFamily: F }
  const card: React.CSSProperties = { background: '#fff', borderRadius: 20, padding: '16px 18px', border: '1px solid #e8f4f3', marginBottom: 10 }

  return (
    <div style={{ background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>
      <div style={{ background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #e8f4f3' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/configuracion" style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fafa', border: '1.5px solid #e8f4f3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          </Link>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Cuenta</h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Datos personales y seguridad</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(135deg,rgba(46,196,182,0.08),rgba(29,158,117,0.04))', borderColor: 'rgba(46,196,182,0.2)', marginBottom: 10 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{initial}</div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0 }}>{name || 'Sin nombre'}</p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{account?.email}</p>
          </div>
        </div>

        <div style={card}>
          <span style={fieldLabel}>Nombre</span>
          <div style={fieldWrap}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input style={fieldInput} value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <span style={fieldLabel}>Email</span>
          <div style={{ ...fieldWrap, background: '#f1f5f9' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input style={{ ...fieldInput, color: '#94a3b8' }} value={account?.email} disabled />
          </div>
          <span style={fieldLabel}>Zona horaria</span>
          <div style={{ ...fieldWrap, marginBottom: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <select style={{ ...fieldInput, cursor: 'pointer' }} value={timezone} onChange={e => setTimezone(e.target.value)}>
              <option value="Europe/Madrid">Europa/Madrid</option>
              <option value="Europe/London">Europa/Londres</option>
              <option value="America/New_York">América/Nueva York</option>
              <option value="America/Mexico_City">América/Ciudad de México</option>
              <option value="America/Bogota">América/Bogotá</option>
            </select>
          </div>
        </div>

        <div style={card}>
          <span style={fieldLabel}>Nueva contraseña</span>
          <div style={{ ...fieldWrap, marginBottom: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <input type="password" style={fieldInput} placeholder="Mínimo 8 caracteres" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
        </div>

        {msg && (
          <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 14, padding: '10px 14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <p style={{ fontSize: 13, color: '#15803d', margin: 0, fontWeight: 600, fontFamily: F }}>{msg}</p>
          </div>
        )}

        <button onClick={handleSave} disabled={saving} style={{ ...btn('#fff', '#2EC4B6', '#0f766e', '0 2px 8px rgba(46,196,182,0.15)'), opacity: saving ? 0.6 : 1 }}>
          <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>
    </div>
  )
}