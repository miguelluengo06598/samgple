import React from 'react'

export const metadata = {
  title: 'Aviso Legal | SAMGPLE',
  description: 'Información legal sobre el titular del sitio web SAMGPLE.',
}

const F = 'system-ui,-apple-system,sans-serif'

export default function AvisoLegalPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .legal-section { animation: fadeUp 0.4s ease both; }
        .legal-section:nth-child(1) { animation-delay: 0.05s }
        .legal-section:nth-child(2) { animation-delay: 0.10s }
        .legal-section:nth-child(3) { animation-delay: 0.15s }
        .legal-section:nth-child(4) { animation-delay: 0.20s }
        .legal-section:nth-child(5) { animation-delay: 0.25s }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* ── Hero ── */}
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
                Documento de Identidad Legal
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900,
              color: '#fff', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1,
            }}>
              Aviso<br/>
              <span style={{ color: '#2EC4B6' }}>Legal</span>
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,.6)', margin: '0 0 32px', maxWidth: 560, lineHeight: 1.6 }}>
              En cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'LSSI-CE Compliant', icon: '⚖️' },
                { label: 'Legislación española', icon: '🇪🇸' },
                { label: 'RGPD', icon: '🇪🇺' },
                { label: 'Merchant of Record', icon: '🧾' },
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

            {/* Sección 1 — Datos Identificativos */}
            <div className="legal-section" style={cardStyle(true)}>
              <SectionHeader number="01" icon={<IconId />} title="Datos Identificativos" highlight />
              <p style={pStyle}>
                En cumplimiento con el deber de información recogido en el artículo 10 de la LSSI-CE, se facilitan los siguientes datos del titular del sitio web:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 16, borderRadius: 14, overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
                {[
                  { label: 'Nombre Comercial', value: 'SAMGPLE', placeholder: false },
                  { label: 'Titular / Empresa', value: 'Miguel Luengo', placeholder: true },
                  { label: 'NIF / CIF', value: '02576732L', placeholder: true },
                  { label: 'Domicilio Social', value: 'Madrid, España', placeholder: true },
                  { label: 'Email de contacto', value: 'soporte@samgple.com', placeholder: false },
                ].map((row, i, arr) => (
                  <div key={i} style={{
                    display: 'flex', flexWrap: 'wrap', gap: 8,
                    padding: '12px 16px',
                    background: i % 2 === 0 ? '#fff' : '#f8fafc',
                    borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b', width: 160, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      {row.label}
                    </span>
                    <span style={{
                      fontSize: 14, fontWeight: row.placeholder ? 500 : 600,
                      color: row.placeholder ? '#94a3b8' : '#0f172a',
                      fontStyle: row.placeholder ? 'italic' : 'normal',
                    }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 12,
                background: 'rgba(234,179,8,.06)', border: '1px solid rgba(234,179,8,.2)',
                fontSize: 12, color: '#92400e', fontWeight: 500, lineHeight: 1.6,
                display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <span style={{ flexShrink: 0 }}>💡</span>
                Los campos en cursiva deben completarse con tus datos reales antes de publicar.
              </div>
            </div>

            {/* Sección 2 — Propiedad Intelectual */}
            <div className="legal-section" style={cardStyle()}>
              <SectionHeader number="02" icon={<IconShield />} title="Propiedad Intelectual" />
              <p style={pStyle}>
                Todos los contenidos de este sitio web (textos, gráficos, logotipos, iconos, imágenes y software) son propiedad de SAMGPLE o de sus proveedores de contenidos, protegidos por las leyes de propiedad intelectual internacionales.
              </p>
              <div style={{
                marginTop: 12, display: 'flex', gap: 12, padding: '14px 16px',
                background: 'rgba(46,196,182,.04)', borderRadius: 14,
                border: '1px solid rgba(46,196,182,.12)', alignItems: 'flex-start',
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6', flexShrink: 0, marginTop: 7 }}/>
                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                  El algoritmo de scoring y el código fuente del <strong style={{ color: '#0f172a' }}>Risk Engine</strong> son propiedad exclusiva de SAMGPLE y están protegidos como secreto industrial.
                </p>
              </div>
            </div>

            {/* Sección 3 — Exclusión de Responsabilidad */}
            <div className="legal-section" style={cardStyle()}>
              <SectionHeader number="03" icon={<IconAlert />} title="Exclusión de Responsabilidad" />
              <p style={pStyle}>
                SAMGPLE no se hace responsable de los daños y perjuicios que pudieran derivarse de la falta de veracidad, exactitud o actualidad de la información suministrada por los clientes para el análisis de riesgo.
              </p>
              <div style={{
                marginTop: 12, padding: '14px 16px', borderRadius: 14,
                background: 'rgba(239,68,68,.04)', border: '1.5px solid rgba(239,68,68,.12)',
                display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <p style={{ fontSize: 13, color: '#b91c1c', margin: 0, lineHeight: 1.7, fontWeight: 500 }}>
                  El servicio de IA es <strong>orientativo</strong> y no garantiza la eliminación total del fraude en el eCommerce del cliente.
                </p>
              </div>
            </div>

            {/* Sección 4 — Venta de Servicios */}
            <div className="legal-section" style={cardStyle()}>
              <SectionHeader number="04" icon={<IconReceipt />} title="Venta de Servicios" />
              <p style={pStyle}>
                La venta de tokens y planes de suscripción se realiza a través de <strong>Lemon Squeezy</strong>, quien actúa como el vendedor autorizado legalmente (Merchant of Record).
              </p>
              <div style={{ marginTop: 12 }}>
                <div style={{
                  padding: '14px 16px', borderRadius: 14,
                  background: '#fff', border: '1.5px solid #f1f5f9',
                  boxShadow: '0 2px 8px rgba(0,0,0,.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Lemon Squeezy</span>
                    <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0', lineHeight: 1.6 }}>
                      Las condiciones de venta específicas se rigen por los Términos de Uso de SAMGPLE y las políticas de Lemon Squeezy.
                    </p>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#0f766e', whiteSpace: 'nowrap',
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 20, padding: '3px 10px', flexShrink: 0,
                  }}>Merchant of Record</span>
                </div>
              </div>
            </div>

            {/* Sección 5 — Legislación Aplicable */}
            <div className="legal-section" style={cardStyle()}>
              <SectionHeader number="05" icon={<IconGavel />} title="Legislación Aplicable" />
              <p style={pStyle}>
                Para la resolución de todas las controversias o cuestiones relacionadas con el presente sitio web o de las actividades en él desarrolladas, será de aplicación la legislación española, a la que se someten expresamente las partes.
              </p>
              <div style={{
                marginTop: 12, padding: '12px 16px', borderRadius: 12,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                fontSize: 13, color: '#15803d', fontWeight: 500, lineHeight: 1.6,
              }}>
                🇪🇸 Jurisdicción española · Ley 34/2002 LSSI-CE · RGPD (UE) 2016/679
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
              ¿Tienes alguna duda legal?
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', margin: '0 0 20px', position: 'relative' }}>
              Puedes contactarnos para cualquier consulta relacionada con este aviso legal.
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
function IconId() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <circle cx="8" cy="12" r="2"/>
      <path d="M14 9h4M14 12h4M14 15h2"/>
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function IconAlert() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  )
}

function IconReceipt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="9" y1="13" x2="15" y2="13"/>
      <line x1="9" y1="17" x2="12" y2="17"/>
    </svg>
  )
}

function IconGavel() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
    </svg>
  )
}