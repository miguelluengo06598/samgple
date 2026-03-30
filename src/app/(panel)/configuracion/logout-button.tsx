'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const F = 'system-ui,-apple-system,sans-serif'

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      style={{ width: '100%', padding: '15px 18px', borderRadius: 16, border: '2px solid #fecaca', background: '#fff', color: '#dc2626', cursor: 'pointer', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(239,68,68,0.08)', fontFamily: F }}
    >
      <span>Cerrar sesión</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    </button>
  )
}