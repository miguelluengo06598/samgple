'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg,#f5f3ff,#ede9fe)', padding: '20px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(145deg,#7c3aed,#4f46e5)', borderRadius: '24px 24px 0 0', padding: 'clamp(24px,5vw,40px) clamp(20px,5vw,36px)', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 16, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </div>
          <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Crear cuenta</p>
          <p style={{ fontSize: 'clamp(12px,2.5vw,14px)', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Empieza gratis hoy</p>
        </div>

        {/* Body */}
        <div style={{ background: '#fff', borderRadius: '0 0 24px 24px', padding: 'clamp(20px,5vw,32px)', border: '1px solid #e2e8f0', borderTop: 'none' }}>
          <p style={{ fontSize: 'clamp(16px,3.5vw,20px)', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Bienvenido</p>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 22px' }}>Crea tu cuenta en segundos</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block' }}>
                Nombre completo
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tu nombre completo"
                  style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block' }}>
                Email
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block' }}>
                Contraseña
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0 }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: '#f5f3ff', borderRadius: 14, border: '1.5px solid #ede9fe' }}>
              <div style={{ width: 18, height: 18, background: '#7c3aed', borderRadius: 5, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Acepto los{' '}
                <span style={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }}>términos y condiciones</span>
                {' '}y la{' '}
                <span style={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }}>política de privacidad</span>
              </p>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', borderRadius: 14, padding: 'clamp(12px,2.5vw,15px)', fontSize: 'clamp(13px,3vw,15px)', fontWeight: 700, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>

            <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', margin: 0 }}>
              ¿Ya tienes cuenta?{' '}
              <a href="/login" style={{ color: '#7c3aed', fontWeight: 700, textDecoration: 'none' }}>
                Inicia sesión
              </a>
            </p>

          </form>
        </div>

      </div>
    </div>
  )
}