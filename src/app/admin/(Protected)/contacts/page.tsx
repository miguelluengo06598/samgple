'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const F = "'DM Sans', system-ui, sans-serif"

const STATUS_OPTIONS = [
  { value: 'new',     label: 'Nuevo',      color: '#1d4ed8', bg: '#dbeafe', border: '#bfdbfe' },
  { value: 'read',    label: 'Leído',      color: '#475569', bg: '#f1f5f9', border: '#e2e8f0' },
  { value: 'replied', label: 'Respondido', color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
]

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_OPTIONS.find(o => o.value === status) ?? STATUS_OPTIONS[1]
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function Spinner({ color = '#64748b' }: { color?: string }) {
  return <div style={{ width: 12, height: 12, border: `2px solid ${color}30`, borderTopColor: color, borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0 }} />
}

export default function AdminContactsPage() {
  const [contacts, setContacts]   = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [saving, setSaving]       = useState<Record<string, boolean>>({})
  const [notes, setNotes]         = useState<Record<string, string>>({})
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/admin/contacts')
    const data = await res.json()
    setContacts(data.contacts ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const channel = supabase.channel('admin-contacts')
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_messages' }, () => load())
    channel.subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [load])

  async function handleStatus(id: string, status: string) {
    setSaving(prev => ({ ...prev, [id]: true }))
    try {
      await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c))
    } finally { setSaving(prev => ({ ...prev, [id]: false })) }
  }

  const filtered = contacts.filter(c => filter === 'all' ? true : c.status === filter)
  const newCount = contacts.filter(c => c.status === 'new').length

  return (
    <>
      <style>{`
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeIn{ from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .cnt-card { transition: box-shadow .15s, transform .15s; }
        .cnt-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,.08) !important; }
        .cnt-filter { transition: all .15s; border: none; cursor: pointer; }
        .cnt-filter:hover { opacity: .8; }
        .cnt-status-btn { transition: all .12s; }
        .cnt-status-btn:hover { opacity: .8; transform: translateY(-1px); }
        .cnt-expand { transition: all .15s; cursor: pointer; }
        .cnt-expand:hover { background: #f8fafc !important; }
      `}</style>

      <div style={{ fontFamily: F }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(20px,2.5vw,26px)', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Leads</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
              {newCount > 0 && <>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{newCount} nuevo{newCount > 1 ? 's' : ''} ·</span>
              </>}
              {contacts.length} total
            </p>
          </div>
          <button onClick={load} style={{ padding: '9px 16px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#64748b', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
            Actualizar
          </button>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { key: 'all',     label: `Todos (${contacts.length})` },
            { key: 'new',     label: `Nuevos (${contacts.filter(c => c.status === 'new').length})` },
            { key: 'read',    label: `Leídos (${contacts.filter(c => c.status === 'read').length})` },
            { key: 'replied', label: `Respondidos (${contacts.filter(c => c.status === 'replied').length})` },
          ].map(f => (
            <button key={f.key} className="cnt-filter"
              onClick={() => setFilter(f.key as any)}
              style={{ padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, fontFamily: F, background: filter === f.key ? '#0f172a' : '#fff', color: filter === f.key ? '#fff' : '#64748b', border: filter === f.key ? 'none' : '1.5px solid #e2e8f0', boxShadow: filter === f.key ? '0 2px 8px rgba(15,23,42,.2)' : 'none' }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} style={{ background: '#fff', borderRadius: 18, height: 100, border: '1px solid #f1f5f9' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: '48px 24px', textAlign: 'center', border: '1.5px solid #f1f5f9' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>Sin contactos</p>
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>No hay leads en esta categoría</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map((c, i) => (
              <div key={c.id} className="cnt-card"
                style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${c.status === 'new' ? '#bfdbfe' : '#e8edf2'}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.04)', animation: `fadeIn .2s ease ${i * .03}s both` }}>

                {/* Cabecera siempre visible */}
                <div className="cnt-expand"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap', background: '#fff' }}>

                  {/* Avatar */}
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: c.status === 'new' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' : 'linear-gradient(135deg,#64748b,#475569)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                    {c.name?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info principal */}
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>{c.name}</p>
                      {c.status === 'new' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />}
                      {c.wants_demo && <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 20, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>DEMO</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#64748b' }}>{c.email}</span>
                      {c.company && <span style={{ fontSize: 12, color: '#94a3b8' }}>· {c.company}</span>}
                      {c.orders && <span style={{ fontSize: 12, color: '#94a3b8' }}>· {c.orders} ped/mes</span>}
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: expanded === c.id ? 'normal' : 'nowrap', maxWidth: 400, lineHeight: 1.5 }}>
                      {c.message}
                    </p>
                  </div>

                  {/* Derecha */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <StatusBadge status={c.status} />
                    <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>
                      {new Date(c.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round">
                      {expanded === c.id ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
                    </svg>
                  </div>
                </div>

                {/* Expandido */}
                {expanded === c.id && (
                  <div style={{ borderTop: '1px solid #f8fafc', background: '#fafbfc', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Mensaje completo */}
                    <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', border: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 8px' }}>Mensaje</p>
                      <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, margin: 0 }}>{c.message}</p>
                    </div>

                    {/* Datos de contacto */}
                    <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', border: '1px solid #f1f5f9', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 140 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 6px' }}>Contacto</p>
                        <p style={{ fontSize: 13, color: '#0f172a', margin: '0 0 2px', fontWeight: 600 }}>{c.name}</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 2px' }}>{c.email}</p>
                        {c.whatsapp && <p style={{ fontSize: 12, color: '#25d366', margin: 0, fontWeight: 600 }}>WhatsApp: {c.whatsapp}</p>}
                        {c.company && <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>{c.company}</p>}
                      </div>
                      {c.orders && (
                        <div style={{ minWidth: 100 }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.08em', margin: '0 0 6px' }}>Volumen</p>
                          <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>{c.orders}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>pedidos/mes</p>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      {/* Email */}
                      <a href={`mailto:${c.email}?subject=SAMGPLE — Tu consulta`}
                        onClick={e => e.stopPropagation()}
                        style={{ padding: '9px 16px', borderRadius: 11, border: '1.5px solid #e2e8f0', background: '#fff', color: '#374151', textDecoration: 'none', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, transition: 'all .15s' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Responder email
                      </a>

                      {/* WhatsApp */}
                      {c.whatsapp && (
                        <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${c.name}, soy del equipo de SAMGPLE. He recibido tu mensaje y quería hablar contigo sobre tu consulta.`)}`}
                          target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ padding: '9px 16px', borderRadius: 11, border: '1.5px solid #a7f3d0', background: '#f0fdf4', color: '#15803d', textDecoration: 'none', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="#25d366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.428a.75.75 0 00.921.908l5.687-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.712 9.712 0 01-4.93-1.344l-.354-.21-3.668.961.976-3.564-.23-.368A9.719 9.719 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
                          WhatsApp
                        </a>
                      )}

                      {/* Separador */}
                      <div style={{ flex: 1 }} />

                      {/* Cambiar estado */}
                      <div style={{ display: 'flex', gap: 6 }}>
                        {STATUS_OPTIONS.map(s => (
                          <button key={s.value} className="cnt-status-btn"
                            onClick={e => { e.stopPropagation(); handleStatus(c.id, s.value) }}
                            disabled={c.status === s.value || !!saving[c.id]}
                            style={{ padding: '7px 13px', borderRadius: 10, border: `1.5px solid ${c.status === s.value ? s.border : '#e2e8f0'}`, background: c.status === s.value ? s.bg : '#fff', color: c.status === s.value ? s.color : '#94a3b8', fontSize: 11, fontWeight: 700, cursor: c.status === s.value ? 'default' : 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', gap: 5, opacity: saving[c.id] ? .5 : 1 }}>
                            {saving[c.id] && c.status !== s.value ? <Spinner color={s.color} /> : null}
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}