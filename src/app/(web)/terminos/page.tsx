import React from 'react'

export const metadata = {
  title: 'Términos de Uso | SAMGPLE',
  description: 'Condiciones legales para el uso de la plataforma SAMGPLE.',
}

const F = 'system-ui,-apple-system,sans-serif'

export default function TerminosPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .terminos-section { animation: fadeUp 0.4s ease both; }
        .terminos-section:nth-child(1) { animation-delay: 0.05s }
        .terminos-section:nth-child(2) { animation-delay: 0.10s }
        .terminos-section:nth-child(3) { animation-delay: 0.15s }
        .terminos-section:nth-child(4) { animation-delay: 0.20s }
        .terminos-section:nth-child(5) { animation-delay: 0.25s }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0c1a2e 0%, #0f2a1e 100%)',
          padding: 'clamp(48px,8vw,96px) clamp(20px,5vw,48px)',
          position: 'relative', overflow: 'hidden',
        }}>
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
                Vigente desde: 6 de abril de 2026
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900,
              color: '#fff', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1,
            }}>
              Términos<br/>
              <span style={{ color: '#2EC4B6' }}>de Uso</span>
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,.6)', margin: '0 0 32px', maxWidth: 520, lineHeight: 1.6 }}>
              Al usar SAMGPLE, aceptas estas condiciones. Por favor, léelas con calma.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Sin permanencia', icon: '🔓' },
                { label: 'Pago por uso', icon: '🪙' },
                { label: 'IA orientativa', icon: '🤖' },
                { label: 'Datos encriptados', icon: '🔒' },
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

        {/* Contenido */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,5vw,48px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Sección 1 */}
            <div className="terminos-section" style={cardStyle()}>
              <SectionHeader number="01" icon={<IconCheck />} title="Aceptación del Servicio" />
              <p style={pStyle}>
                SAMGPLE ofrece un software de análisis de riesgo basado en IA para pedidos eCommerce. Al registrarte y utilizar nuestra plataforma, confirmas que eres mayor de edad y que tienes autoridad para vincular a tu empresa a estos términos.
              </p>
            </div>

            {/* Sección 2 */}
            <div className="terminos-section" style={cardStyle()}>
              <SectionHeader number="02" icon={<IconRobot />} title="Uso Responsable de la IA" />
              <p style={pStyle}>
                SAMGPLE utiliza modelos de Inteligencia Artificial para generar recomendaciones de riesgo.
              </p>
              <div style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 14,
                background: 'rgba(239,68,68,.04)', border: '1.5px solid rgba(239,68,68,.12)',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <p style={{ fontSize: 13, color: '#b91c1c', margin: 0, lineHeight: 1.7, fontWeight: 500 }}>
                  Estas recomendaciones son <strong>herramientas de apoyo</strong>. El usuario es el único responsable final de decidir si envía o cancela un pedido. SAMGPLE no se hace responsable de pérdidas económicas derivadas de las decisiones tomadas basándose en nuestros análisis.
                </p>
              </div>
            </div>

            {/* Sección 3 */}
            <div className="terminos-section" style={cardStyle()}>
              <SectionHeader number="03" icon={<IconDatabase />} title="Propiedad de los Datos" />
              <p style={pStyle}>
                Tú mantienes la propiedad de todos los datos de pedidos que subas a la plataforma.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {[
                  { icon: '✅', text: 'Los datos son tuyos en todo momento.' },
                  { icon: '🔒', text: 'Los procesamos de forma encriptada (AES-256).' },
                  { icon: '🎯', text: 'Solo los usamos para generar el análisis de riesgo y mejorar la precisión de nuestros algoritmos de prevención de fraude.' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '10px 14px',
                    background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9',
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sección 4 */}
            <div className="terminos-section" style={cardStyle()}>
              <SectionHeader number="04" icon={<IconCancel />} title="Cancelación de Cuenta" />
              <p style={pStyle}>
                Puedes dejar de usar SAMGPLE en cualquier momento. Al no existir permanencia, simplemente dejarás de consumir créditos.
              </p>
              <div style={{
                marginTop: 12, padding: '12px 16px', borderRadius: 12,
                background: 'rgba(234,179,8,.05)', border: '1px solid rgba(234,179,8,.2)',
                fontSize: 13, color: '#92400e', fontWeight: 500, lineHeight: 1.6,
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <span style={{ flexShrink: 0 }}>💡</span>
                El saldo de créditos no consumidos <strong>no es reembolsable</strong>, salvo que la ley local indique lo contrario.
              </div>
            </div>

          </div>

          {/* Footer CTA */}
          <div style={{
            marginTop: 32, padding: 'clamp(24px,4vw,36px)',
            background: 'linear-gradient(135deg,#0c1a2e 0%,#0f2a1e 100%)',
            borderRadius: 24, textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(46,196,182,.15) 0%,transparent 70%)', pointerEvents:'none' }}/>
            <p style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-.3px', position: 'relative' }}>
              ¿Tienes dudas sobre los términos?
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', margin: '0 0 20px', position: 'relative' }}>
              Estamos disponibles para resolver cualquier consulta sobre las condiciones de uso.
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

const pStyle: React.CSSProperties = {
  fontSize: 'clamp(13px,1.8vw,15px)', color: '#374151', lineHeight: 1.75, margin: '0 0 4px',
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

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}

function IconCoin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v2m0 8v2M9.5 9.5c0-1.1.9-2 2.5-2s2.5.9 2.5 2-1 1.8-2.5 2.5S9.5 13.4 9.5 14.5c0 1.1.9 2 2.5 2s2.5-.9 2.5-2"/>
    </svg>
  )
}

function IconRobot() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <path d="M12 11V7"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M8 15h.01M16 15h.01M8 19h8"/>
    </svg>
  )
}

function IconDatabase() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  )
}

function IconCancel() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M15 9l-6 6M9 9l6 6"/>
    </svg>
  )
}