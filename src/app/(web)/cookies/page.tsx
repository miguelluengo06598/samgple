import React from 'react'

export const metadata = {
  title: 'Política de Cookies | SAMGPLE',
  description: 'Información sobre el uso de cookies en la plataforma SAMGPLE.',
}

const F = 'system-ui,-apple-system,sans-serif'

export default function CookiesPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .cookie-section { animation: fadeUp 0.4s ease both; }
        .cookie-section:nth-child(1) { animation-delay: 0.05s }
        .cookie-section:nth-child(2) { animation-delay: 0.10s }
        .cookie-section:nth-child(3) { animation-delay: 0.15s }
        .cookie-section:nth-child(4) { animation-delay: 0.20s }
        .cookie-section:nth-child(5) { animation-delay: 0.25s }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* ── Hero ── */}
        <div style={{
          background: 'linear-gradient(135deg, #0c1a2e 0%, #0f2a1e 100%)',
          padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,48px)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Blobs decorativos */}
          <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.15) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(29,158,117,.10) 0%,transparent 70%)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>

          <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(46,196,182,.12)', border: '1px solid rgba(46,196,182,.25)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 24,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6' }}/>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                Última revisión: 6 de abril de 2026
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900,
              color: '#fff', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1,
            }}>
              Política de<br/>
              <span style={{ color: '#2EC4B6' }}>Cookies</span>
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,.6)', margin: '0 0 32px', maxWidth: 520, lineHeight: 1.6 }}>
              Transparencia total sobre cómo usamos las cookies para que SAMGPLE funcione correctamente.
            </p>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Solo cookies técnicas', icon: '🍪' },
                { label: 'Sin tracking', icon: '🚫' },
                { label: 'Cumple RGPD', icon: '🇪🇺' },
                { label: 'Sin publicidad', icon: '📵' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: 12, padding: '8px 14px',
                }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.7)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,5vw,48px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Sección 1 — ¿Qué son las cookies? */}
            <div className="cookie-section" style={cardStyle()}>
              <SectionHeader number="01" icon={<IconCookie/>} title="¿Qué son las cookies?" />
              <p style={pStyle}>
                Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas nuestra web. Nos ayudan a recordarte, mantener tu sesión iniciada y procesar tus análisis de riesgo de forma segura.
              </p>
            </div>

            {/* Sección 2 — Cookies técnicas */}
            <div className="cookie-section" style={cardStyle(true)}>
              <SectionHeader number="02" icon={<IconLock/>} title="Cookies Técnicas (Obligatorias)" highlight />
              <p style={pStyle}>
                Estas cookies son esenciales para que puedas navegar por SAMGPLE y usar sus funciones:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {[
                  { label: 'Supabase', desc: 'Para mantener tu sesión de usuario activa de forma segura.' },
                  { label: 'Seguridad (CSRF)', desc: 'Para prevenir ataques malintencionados en los formularios de envío.' },
                  { label: 'Preferencias', desc: 'Para recordar si has aceptado o no este aviso de cookies.' },
                ].map((item, i) => (
                  <div key={i} style={listItemStyle}>
                    <div style={dotStyle}/>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.label} — </span>
                      <span style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección 3 — Cookies de terceros */}
            <div className="cookie-section" style={cardStyle()}>
              <SectionHeader number="03" icon={<IconThirdParty/>} title="Cookies de Terceros" />
              <p style={pStyle}>
                Usamos servicios externos que pueden instalar sus propias cookies:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10, marginTop: 8 }}>
                {[
                  { name: 'Lemon Squeezy', role: 'Pagos', desc: 'Necesarias para procesar tus pagos y prevenir el fraude en las transacciones.' },
                  { name: 'Analítica (Opcional)', role: 'Métricas', desc: 'Herramientas como Plausible para entender el uso de la web de forma anónima.' },
                ].map((p, i) => (
                  <div key={i} style={{
                    padding: '14px 16px', borderRadius: 14,
                    background: '#fff', border: '1.5px solid #f1f5f9',
                    boxShadow: '0 2px 8px rgba(0,0,0,.04)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{p.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: '#0f766e',
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        borderRadius: 20, padding: '2px 8px',
                      }}>{p.role}</span>
                    </div>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección 4 — Gestionar cookies */}
            <div className="cookie-section" style={cardStyle()}>
              <SectionHeader number="04" icon={<IconSettings/>} title="Cómo gestionar tus cookies" />
              <p style={pStyle}>
                Puedes configurar tu navegador para bloquear todas las cookies o para que te avise cuando se envíe una.
              </p>
              {/* Aviso importante */}
              <div style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 14,
                background: 'rgba(239,68,68,.04)', border: '1.5px solid rgba(239,68,68,.15)',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <p style={{ fontSize: 13, color: '#b91c1c', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>
                  Si desactivas las cookies de sesión (Supabase), <strong>no podrás acceder a tu panel de control</strong> ni realizar análisis de pedidos.
                </p>
              </div>
            </div>

            {/* Sección 5 — Contacto */}
            <div className="cookie-section" style={cardStyle()}>
              <SectionHeader number="05" icon={<IconMail/>} title="Contacto" />
              <p style={pStyle}>
                Para cualquier duda sobre nuestra política de cookies, estamos a tu disposición.
              </p>
              <div style={{
                marginTop: 8, padding: '12px 16px', borderRadius: 12,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                fontSize: 13, color: '#15803d', fontWeight: 500, lineHeight: 1.6,
              }}>
                📧 Escríbenos a <strong>soporte@samgple.com</strong>. Responderemos en un máximo de 30 días.
              </div>
            </div>

          </div>

          {/* ── Footer CTA ── */}
          <div style={{
            marginTop: 32, padding: 'clamp(24px,4vw,36px)',
            background: 'linear-gradient(135deg,#0c1a2e 0%,#0f2a1e 100%)',
            borderRadius: 24, textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.15) 0%,transparent 70%)', pointerEvents:'none' }}/>
            <p style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-.3px', position: 'relative' }}>
              ¿Tienes alguna duda?
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', margin: '0 0 20px', position: 'relative' }}>
              Estamos disponibles para resolver cualquier consulta sobre cookies y privacidad.
            </p>
            <a
              href="mailto:soporte@samgple.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)',
                color: '#fff', padding: '12px 24px', borderRadius: 14,
                fontSize: 14, fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(46,196,182,.3)',
                position: 'relative',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              soporte@samgple.com
            </a>
          </div>

        </div>
      </div>
    </>
  )
}

/* ── Estilos reutilizables ── */
const pStyle: React.CSSProperties = {
  fontSize: 'clamp(13px,1.8vw,15px)', color: '#374151', lineHeight: 1.75, margin: '0 0 4px',
}

const listItemStyle: React.CSSProperties = {
  display: 'flex', gap: 12, padding: '12px 14px',
  background: 'rgba(46,196,182,.04)', borderRadius: 12,
  border: '1px solid rgba(46,196,182,.1)',
}

const dotStyle: React.CSSProperties = {
  width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6',
  flexShrink: 0, marginTop: 7,
}

function cardStyle(highlight = false): React.CSSProperties {
  return {
    background: highlight ? 'linear-gradient(135deg,#f0fdf4,#f0f9ff)' : '#fff',
    borderRadius: 20,
    border: highlight ? '1.5px solid #bbf7d0' : '1.5px solid #f1f5f9',
    padding: 'clamp(20px,4vw,32px)',
    boxShadow: '0 2px 12px rgba(0,0,0,.04)',
  }
}

/* ── Componente cabecera de sección ── */
function SectionHeader({ number, icon, title, highlight = false }: {
  number: string
  icon: React.ReactNode
  title: string
  highlight?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: highlight ? '#dcfce7' : '#f0fdf4',
        border: `1.5px solid ${highlight ? '#86efac' : '#bbf7d0'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0f766e',
      }}>
        {icon}
      </div>
      <div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', letterSpacing: '.08em', textTransform: 'uppercase' as const }}>
          Sección {number}
        </span>
        <h2 style={{ fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-.3px' }}>
          {title}
        </h2>
      </div>
    </div>
  )
}

/* ── Iconos ── */
function IconCookie() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="8" cy="9" r="1" fill="currentColor"/>
      <circle cx="15" cy="9" r="1" fill="currentColor"/>
      <path d="M9 14s1.5 2 3 2 3-2 3-2"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  )
}

function IconThirdParty() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="2"/>
      <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/>
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}