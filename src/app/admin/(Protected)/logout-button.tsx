'use client'

export default function AdminLogoutButton() {
  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    window.location.href = '/admin/login'
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 12px', borderRadius: 14,
        border: '1.5px solid #fecaca', background: '#fff',
        color: '#dc2626', cursor: 'pointer', fontSize: 13,
        fontWeight: 700, width: '100%', marginTop: 8,
        transition: 'all .15s', fontFamily: 'inherit',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Cerrar sesión
    </button>
  )
}