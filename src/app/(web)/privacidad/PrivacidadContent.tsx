'use client'

const F = 'system-ui,-apple-system,sans-serif'

const sections = [
  {
    number: '01',
    title: 'Quiénes somos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
    content: [
      'SAMGPLE es una plataforma de análisis de riesgo para e-commerce basada en Inteligencia Artificial. Nuestra misión es ayudar a los comercios a reducir devoluciones y fraudes en pedidos contra reembolso (COD).',
      'El responsable del tratamiento de datos es SAMGPLE (en adelante, "nosotros" o "la plataforma"), con domicilio de contacto en soporte@samgple.com.',
    ],
  },
  {
    number: '02',
    title: 'Datos que recopilamos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    content: null,
    list: [
      { label: 'Datos de cuenta', desc: 'Nombre, email y contraseña de los operadores que usan la plataforma.' },
      { label: 'Datos de clientes finales', desc: 'Nombres, apellidos, teléfonos y direcciones de envío de los clientes de tu tienda (todos encriptados en reposo).' },
      { label: 'Historial de pedidos', desc: 'Importes, productos, estados y comportamiento de compra necesarios para el análisis de riesgo.' },
      { label: 'Datos de uso', desc: 'Logs de actividad, tokens consumidos y métricas de rendimiento de la plataforma.' },
    ],
  },
  {
    number: '03',
    title: 'Seguridad y encriptación',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    highlight: true,
    content: [
      'Utilizamos cifrado AES-256-GCM para todos los datos sensibles de clientes finales. Los datos se desencriptan únicamente en memoria durante milisegundos para que nuestra IA realice el análisis de riesgo.',
      'Los números de teléfono y emails se encriptan de forma determinista (AES-256-CBC) para permitir búsquedas eficientes sin exponer los datos en texto plano.',
      'Ningún dato sensible se almacena sin cifrar en ningún momento. Tu clave de cifrado es exclusiva de tu cuenta y nunca la compartimos.',
    ],
  },
  {
    number: '04',
    title: 'Finalidad del tratamiento',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    content: null,
    list: [
      { label: 'Análisis de riesgo COD', desc: 'Evaluar la probabilidad de fraude o rechazo en pedidos contra reembolso mediante IA.' },
      { label: 'Confirmación de pedidos', desc: 'Realizar llamadas automáticas de verificación a clientes mediante nuestro agente de voz IA.' },
      { label: 'Mejora del servicio', desc: 'Analizar patrones para mejorar la precisión de nuestros modelos de riesgo.' },
      { label: 'Facturación', desc: 'Gestionar el consumo de tokens y emitir facturas correspondientes.' },
    ],
  },
  {
    number: '05',
    title: 'Proveedores de servicios',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"/>
      </svg>
    ),
    content: ['Trabajamos con proveedores de primer nivel que cumplen con el RGPD europeo:'],
    providers: [
      { name: 'Supabase', role: 'Base de datos', desc: 'Almacenamiento seguro cifrado en reposo y en tránsito. Servidores en la Unión Europea.' },
      { name: 'OpenAI', role: 'IA de análisis', desc: 'Análisis de riesgo de pedidos. Los datos se envían anonimizados y no se usan para entrenar modelos.' },
      { name: 'VAPI', role: 'Agente de voz', desc: 'Gestión de llamadas automáticas de confirmación de pedidos COD.' },
      { name: 'Twilio', role: 'Telefonía', desc: 'Infraestructura de llamadas de voz. Cada cliente conecta su propia cuenta Twilio.' },
      { name: 'Lemon Squeezy', role: 'Pagos', desc: 'Merchant of Record para la gestión de pagos, facturación e impuestos internacionales.' },
      { name: 'Vercel', role: 'Hosting', desc: 'Infraestructura de despliegue con servidores Edge distribuidos globalmente.' },
    ],
  },
  {
    number: '06',
    title: 'Conservación de datos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    content: [
      'Los datos de pedidos y clientes se conservan durante el tiempo que mantengas tu cuenta activa en SAMGPLE, más un período adicional de 12 meses para cumplir con obligaciones legales.',
      'Al cancelar tu cuenta, todos tus datos y los de tus clientes finales son eliminados de forma permanente en un plazo máximo de 30 días.',
    ],
  },
  {
    number: '07',
    title: 'Tus derechos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    content: ['Como usuario de SAMGPLE, puedes ejercer los siguientes derechos en cualquier momento:'],
    rights: [
      { right: 'Acceso', desc: 'Solicitar una copia de todos los datos que tenemos sobre ti.' },
      { right: 'Rectificación', desc: 'Corregir datos inexactos o incompletos.' },
      { right: 'Supresión', desc: 'Eliminar tus datos ("derecho al olvido").' },
      { right: 'Portabilidad', desc: 'Recibir tus datos en formato estructurado y legible por máquina.' },
      { right: 'Oposición', desc: 'Oponerte al tratamiento de tus datos en determinadas circunstancias.' },
    ],
    footer: 'Para ejercer cualquier derecho, escríbenos a soporte@samgple.com. Responderemos en un máximo de 30 días.',
  },
  {
    number: '08',
    title: 'Cookies',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><path d="M9 14s1.5 2 3 2 3-2 3-2"/>
      </svg>
    ),
    content: [
      'Utilizamos únicamente cookies técnicas estrictamente necesarias para el funcionamiento de la sesión y la autenticación. No utilizamos cookies de seguimiento, publicidad ni analítica de terceros.',
      'No mostramos banners de cookies porque no las usamos para fines no esenciales.',
    ],
  },
]

export default function PrivacidadContent() {
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        
        .priv-section {
          animation: fadeUp 0.4s ease both;
        }
        .priv-section:nth-child(1) { animation-delay: 0.05s }
        .priv-section:nth-child(2) { animation-delay: 0.10s }
        .priv-section:nth-child(3) { animation-delay: 0.15s }
        .priv-section:nth-child(4) { animation-delay: 0.20s }
        .priv-section:nth-child(5) { animation-delay: 0.25s }
        .priv-section:nth-child(6) { animation-delay: 0.30s }
        .priv-section:nth-child(7) { animation-delay: 0.35s }
        .priv-section:nth-child(8) { animation-delay: 0.40s }

        .provider-card {
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .provider-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
        }
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
                Última actualización: 6 de abril de 2026
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(32px,5vw,56px)', fontWeight: 900,
              color: '#fff', margin: '0 0 16px', letterSpacing: '-1px', lineHeight: 1.1,
            }}>
              Política de<br/>
              <span style={{ color: '#2EC4B6' }}>Privacidad</span>
            </h1>
            <p style={{ fontSize: 'clamp(15px,2vw,18px)', color: 'rgba(255,255,255,.6)', margin: '0 0 32px', maxWidth: 520, lineHeight: 1.6 }}>
              En SAMGPLE nos tomamos muy en serio la seguridad de tus datos y la de tus clientes finales. Aquí explicamos de forma clara y transparente cómo los tratamos.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Cifrado AES-256', icon: '🔒' },
                { label: 'Sin cookies de tracking', icon: '🍪' },
                { label: 'Cumple RGPD', icon: '🇪🇺' },
                { label: 'Datos en Europa', icon: '📍' },
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

        {/* Índice rápido */}
        <div style={{ background: '#fff', borderBottom: '1px solid #f1f5f9', padding: 'clamp(16px,3vw,24px) clamp(20px,5vw,48px)', overflowX: 'auto' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sections.map(s => (
              <a
                key={s.number}
                href={`#sec-${s.number}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 20,
                  background: '#f8fafc', border: '1.5px solid #f1f5f9',
                  fontSize: 12, fontWeight: 600, color: '#64748b',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => {
                  const t = e.currentTarget
                  t.style.background = '#f0fdf4'
                  t.style.borderColor = '#bbf7d0'
                  t.style.color = '#0f766e'
                }}
                onMouseLeave={e => {
                  const t = e.currentTarget
                  t.style.background = '#f8fafc'
                  t.style.borderColor = '#f1f5f9'
                  t.style.color = '#64748b'
                }}
              >
                <span style={{ color: '#2EC4B6', fontWeight: 800 }}>{s.number}</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(20px,5vw,48px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {sections.map((section) => (
              <div
                key={section.number}
                id={`sec-${section.number}`}
                className="priv-section"
                style={{
                  background: section.highlight
                    ? 'linear-gradient(135deg,#f0fdf4,#f0f9ff)'
                    : '#fff',
                  borderRadius: 20,
                  border: section.highlight
                    ? '1.5px solid #bbf7d0'
                    : '1.5px solid #f1f5f9',
                  padding: 'clamp(20px,4vw,32px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,.04)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: section.highlight ? '#dcfce7' : '#f0fdf4',
                    border: `1.5px solid ${section.highlight ? '#86efac' : '#bbf7d0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0f766e',
                  }}>
                    {section.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#2EC4B6', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                      Sección {section.number}
                    </span>
                    <h2 style={{ fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-.3px' }}>
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Párrafos */}
                {section.content && section.content.map((p, i) => (
                  <p key={i} style={{ fontSize: 'clamp(13px,1.8vw,15px)', color: '#374151', lineHeight: 1.75, margin: '0 0 12px' }}>
                    {p}
                  </p>
                ))}

                {/* Lista simple */}
                {section.list && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                    {section.list.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 12, padding: '12px 14px',
                        background: 'rgba(46,196,182,.04)', borderRadius: 12,
                        border: '1px solid rgba(46,196,182,.1)',
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2EC4B6', flexShrink: 0, marginTop: 7 }}/>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.label} — </span>
                          <span style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Proveedores */}
                {section.providers && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 10, marginTop: 8 }}>
                    {section.providers.map((p, i) => (
                      <div key={i} className="provider-card" style={{
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
                )}

                {/* Derechos */}
                {section.rights && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {section.rights.map((r, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '10px 14px', borderRadius: 12,
                        background: '#f8fafc', border: '1px solid #f1f5f9',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Derecho de {r.right} — </span>
                          <span style={{ fontSize: 13, color: '#64748b' }}>{r.desc}</span>
                        </div>
                      </div>
                    ))}
                    {section.footer && (
                      <div style={{
                        marginTop: 8, padding: '12px 16px', borderRadius: 12,
                        background: '#f0fdf4', border: '1px solid #bbf7d0',
                        fontSize: 13, color: '#15803d', fontWeight: 500, lineHeight: 1.6,
                      }}>
                        📧 {section.footer}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

          </div>

          {/* Footer contacto */}
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
              Estamos disponibles para resolver cualquier consulta sobre privacidad y protección de datos.
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