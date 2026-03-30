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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg,#f0fafa,#e8f8f5)', padding: '20px', fontFamily: 'system-ui,-apple-system,sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(145deg,#2EC4B6,#1D9E75)', borderRadius: '24px 24px 0 0', padding: 'clamp(24px,5vw,40px) clamp(20px,5vw,36px)', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.2)', borderRadius: 16, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>SAMGPLE</p>
          <p style={{ fontSize: 'clamp(12px,2.5vw,14px)', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Sistema de gestión COD</p>
        </div>

        {/* Body */}
        <div style={{ background: '#fff', borderRadius: '0 0 24px 24px', padding: 'clamp(20px,5vw,32px)', border: '1px solid #e2e8f0', borderTop: 'none' }}>
          <p style={{ fontSize: 'clamp(16px,3.5vw,20px)', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Bienvenido</p>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 22px' }}>Inicia sesión en tu cuenta</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5, display: 'block' }}>
                Email
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, transition: 'border-color 0.15s' }}>
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
                  placeholder="••••••••"
                  style={{ border: 'none', background: 'transparent', fontSize: 14, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0 }}
                />
              </div>
            </div>

            <p style={{ fontSize: 12, color: '#2EC4B6', fontWeight: 600, textAlign: 'right', margin: 0, cursor: 'pointer' }}>
              ¿Olvidaste tu contraseña?
            </p>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '10px 14px' }}>
                <p style={{ fontSize: 13, color: '#dc2626', margin: 0, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg,#2EC4B6,#1D9E75)', border: 'none', borderRadius: 14, padding: 'clamp(12px,2.5vw,15px)', fontSize: 'clamp(13px,3vw,15px)', fontWeight: 700, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.15s', width: '100%' }}
            >
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>

            <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', margin: 0 }}>
              ¿No tienes cuenta?{' '}
              <a href="/registro" style={{ color: '#2EC4B6', fontWeight: 700, textDecoration: 'none' }}>
                Regístrate
              </a>
            </p>
          </form>
        </div>

      </div>
    </div>
  )
}