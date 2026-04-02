'use client'

import { useState } from 'react'

const F = 'system-ui,-apple-system,sans-serif'
const ENVIO_DEFAULT = 7.5
const CPA_DEFAULT = 9

function calcularPrecios(precioConIVA: number, conAnuncios: boolean) {
  const precioSinIVA = precioConIVA / 1.21
  const envio = ENVIO_DEFAULT
  const cpa = conAnuncios ? CPA_DEFAULT : 0
  const costeBase = precioSinIVA + envio + cpa
  return {
    precioSinIVA, envio, cpa, costeBase,
    p25: costeBase / 0.75,
    p30: costeBase / 0.70,
    p35: costeBase / 0.65,
    cpaMax: precioConIVA * 0.25 - envio,
  }
}

function calcularRentabilidad(inv: number, uni: number, pv: number, cp: number, ce: number, dias: number) {
  const ingresosBrutos = uni * pv
  const costesProducto = uni * cp
  const costesEnvio = uni * ce
  const totalCostes = costesProducto + costesEnvio + inv
  const beneficioNeto = ingresosBrutos - totalCostes
  const cpaReal = uni > 0 ? inv / uni : 0
  const roi = inv > 0 ? (beneficioNeto / inv) * 100 : 0
  const ventasDia = dias > 0 ? uni / dias : 0
  return { ingresosBrutos, beneficioNeto, cpaReal, roi, ventasDia }
}

function NumInput({ label, value, onChange, placeholder, prefix, suffix, color = '#0f172a' }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; prefix?: string; suffix?: string; color?: string
}) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'block', fontFamily: F }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14, transition: 'border-color 0.15s' }}>
        {prefix && <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>{prefix}</span>}
        <input type="number" step="0.01" placeholder={placeholder ?? '0'} value={value}
          onChange={e => onChange(e.target.value)}
          style={{ border: 'none', background: 'transparent', fontSize: 15, fontWeight: 700, color, outline: 'none', flex: 1, minWidth: 0, fontFamily: F, width: 0 }} />
        {suffix && <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', flexShrink: 0 }}>{suffix}</span>}
      </div>
    </div>
  )
}

function MetricCard({ label, value, sub, color, bg, border }: {
  label: string; value: string; sub?: string; color: string; bg: string; border: string
}) {
  return (
    <div style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 18, padding: '16px 18px', animation: 'fadeUp 0.2s ease both' }}>
      <p style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px', opacity: 0.7, fontFamily: F }}>{label}</p>
      <p style={{ fontSize: 'clamp(22px,4vw,28px)', fontWeight: 800, color, margin: 0, letterSpacing: '-0.5px', fontFamily: F }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: '#94a3b8', margin: '3px 0 0', fontFamily: F }}>{sub}</p>}
    </div>
  )
}

export default function HerramientasClient() {
  const [tab, setTab] = useState<'calc' | 'consul'>('calc')
  const [precioArticulo, setPrecioArticulo] = useState('')
  const [conAnuncios, setConAnuncios] = useState(true)
  const [inversion, setInversion] = useState('')
  const [unidades, setUnidades] = useState('')
  const [precioVenta, setPrecioVenta] = useState('')
  const [costeProducto, setCosteProducto] = useState('')
  const [costoEnvio, setCostoEnvio] = useState('')
  const [diasCampana, setDiasCampana] = useState('')
  const [loadingIA, setLoadingIA] = useState(false)
  const [recomendacionIA, setRecomendacionIA] = useState('')

  const precio = parseFloat(precioArticulo) || 0
  const calc = precio > 0 ? calcularPrecios(precio, conAnuncios) : null

  const rentData = {
    inv:  parseFloat(inversion)    || 0,
    uni:  parseFloat(unidades)     || 0,
    pv:   parseFloat(precioVenta)  || 0,
    cp:   parseFloat(costeProducto)|| 0,
    ce:   parseFloat(costoEnvio)   || 0,
    dias: parseFloat(diasCampana)  || 0,
  }
  const rentOk = rentData.inv > 0 && rentData.uni > 0 && rentData.pv > 0
  const rent = rentOk ? calcularRentabilidad(
    rentData.inv, rentData.uni, rentData.pv,
    rentData.cp, rentData.ce, rentData.dias
  ) : null

  async function pedirRecomendacionIA() {
    if (!rent) return
    setLoadingIA(true)
    setRecomendacionIA('')
    try {
      const res = await fetch('/api/tools/profitability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inversion: rentData.inv, unidades: rentData.uni,
          precioVenta: rentData.pv, costeProducto: rentData.cp,
          costoEnvio: rentData.ce, diasCampana: rentData.dias,
          cpaReal: rent.cpaReal.toFixed(2), roi: rent.roi.toFixed(1),
          beneficioNeto: rent.beneficioNeto.toFixed(2),
        }),
      })
      const data = await res.json()
      setRecomendacionIA(data.recomendacion ?? 'Error al obtener la recomendación.')
    } catch {
      setRecomendacionIA('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setLoadingIA(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .tab-pill { transition:all 0.15s ease; }
        .tab-pill:hover { opacity:0.85; }
        .toggle-opt { transition:all 0.15s ease; }
        .toggle-opt:hover { opacity:0.85; }
        .btn-ia { transition:all 0.15s ease; }
        .btn-ia:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(139,92,246,0.25)!important; }
        .btn-ia:active { transform:scale(0.97); }
        .price-card { transition:all 0.15s ease; }
        .price-card:hover { transform:translateY(-2px); }
        .num-input:focus-within { border-color:#2EC4B6!important; box-shadow:0 0 0 3px rgba(46,196,182,0.08); }
        @media(min-width:640px) {
          .tool-grid-2 { grid-template-columns:1fr 1fr!important; }
          .tool-grid-3 { grid-template-columns:1fr 1fr 1fr!important; }
          .tool-grid-4 { grid-template-columns:repeat(4,1fr)!important; }
          .tool-max { max-width:600px!important; margin:0 auto!important; }
        }
      `}</style>

      <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: F }}>

        {/* Header */}
        <div style={{ background: '#fff', padding: '16px clamp(16px,4vw,32px) 0', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 56, zIndex: 9 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 14 }}>
              <h1 style={{ fontSize: 'clamp(18px,4vw,24px)', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>Herramientas</h1>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Calcula precios y analiza rentabilidad de tus campañas</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { val: 'calc',  label: 'Calculadora', icon: 'M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M18 3h3v3M11 10l8-7' },
                { val: 'consul',label: 'Consultor IA', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
              ].map(t => (
                <button key={t.val} onClick={() => setTab(t.val as any)} className="tab-pill"
                  style={{ padding: '8px 20px', borderRadius: '12px 12px 0 0', fontSize: 13, fontWeight: 700, border: 'none', borderBottom: tab === t.val ? '2px solid #2EC4B6' : '2px solid transparent', background: tab === t.val ? '#f0fdf4' : 'transparent', color: tab === t.val ? '#0f766e' : '#94a3b8', cursor: 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={t.icon}/></svg>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', paddingBottom: 40 }}>

          {/* ── CALCULADORA ── */}
          {tab === 'calc' && (
            <div style={{ animation: 'fadeUp 0.2s ease both' }}>
              <div className="tool-max">

                {/* Hero card */}
                <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(20px,4vw,28px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(46,196,182,0.3)', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M18 3h3v3M11 10l8-7"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Calculadora de precio</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Encuentra tu precio de venta óptimo al instante</p>
                    </div>
                  </div>

                  {/* Input principal */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>
                      Coste del artículo con IVA
                    </label>
                    <div className="num-input" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 18px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 16, transition: 'all 0.15s' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                      <input type="number" step="0.01" placeholder="0.00" value={precioArticulo}
                        onChange={e => setPrecioArticulo(e.target.value)}
                        style={{ border: 'none', background: 'transparent', fontSize: 20, fontWeight: 800, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0, fontFamily: F, width: 0 }} />
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#2EC4B6', flexShrink: 0 }}>€</span>
                    </div>
                  </div>

                  {/* Toggle tipo */}
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, display: 'block' }}>
                    Tipo de adquisición
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    {[
                      { val: true,  label: 'Con anuncios', desc: 'CPA 9€ incluido', icon: 'M15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-5' },
                      { val: false, label: 'Orgánico',     desc: 'Sin coste CPA',    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
                    ].map(opt => (
                      <button key={String(opt.val)} onClick={() => setConAnuncios(opt.val)} className="toggle-opt"
                        style={{ padding: '14px', borderRadius: 16, border: `2px solid ${conAnuncios === opt.val ? '#2EC4B6' : '#f1f5f9'}`, background: conAnuncios === opt.val ? '#f0fdf4' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: F }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={conAnuncios === opt.val ? '#0f766e' : '#94a3b8'} strokeWidth="2" strokeLinecap="round"><path d={opt.icon}/></svg>
                          <span style={{ fontSize: 13, fontWeight: 700, color: conAnuncios === opt.val ? '#0f766e' : '#64748b' }}>{opt.label}</span>
                        </div>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{opt.desc}</span>
                      </button>
                    ))}
                  </div>

                  {/* Info chips */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[
                      { label: `Envío ${ENVIO_DEFAULT}€`, color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
                      ...(conAnuncios ? [{ label: `CPA ${CPA_DEFAULT}€`, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' }] : []),
                      { label: 'IVA 21%', color: '#64748b', bg: '#f8fafc', border: '#f1f5f9' },
                    ].map(c => (
                      <span key={c.label} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                        {c.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resultados */}
                {calc && (
                  <>
                    {/* Desglose costes */}
                    <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,22px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 14, animation: 'fadeUp 0.2s ease both' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>Desglose de costes</p>
                      {[
                        { label: 'Artículo sin IVA',  value: calc.precioSinIVA, color: '#0f172a', last: false },
                        { label: 'Envío estimado',     value: calc.envio,        color: '#0284c7', last: false },
                        ...(conAnuncios ? [{ label: 'CPA estimado', value: calc.cpa, color: '#7c3aed', last: false }] : []),
                        { label: 'Coste total',        value: calc.costeBase,    color: '#0f766e', last: true  },
                      ].map((row, i, arr) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: i > 0 ? '1px solid #f8fafc' : 'none', borderBottom: row.last ? '2px solid #f1f5f9' : 'none', marginBottom: row.last ? 2 : 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: row.last ? '#0f172a' : '#64748b', fontWeight: row.last ? 700 : 400 }}>{row.label}</span>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 800, color: row.color }}>{row.value.toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>

                    {/* Precios recomendados */}
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Precio de venta recomendado</p>
                    <div className="tool-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                      {[
                        { label: '25% margen', value: calc.p25, featured: false, color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', shadow: 'none' },
                        { label: '30% margen', value: calc.p30, featured: true,  color: '#fff',    bg: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', border: 'transparent', shadow: '0 6px 20px rgba(46,196,182,0.3)' },
                        { label: '35% margen', value: calc.p35, featured: false, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', shadow: 'none' },
                      ].map(m => (
                        <div key={m.label} className="price-card"
                          style={{ background: m.bg, border: `1.5px solid ${m.border}`, borderRadius: 18, padding: '16px 12px', textAlign: 'center', boxShadow: m.shadow, position: 'relative', overflow: 'hidden' }}>
                          {m.featured && (
                            <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 8, fontWeight: 800, background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.05em' }}>
                              IDEAL
                            </div>
                          )}
                          <p style={{ fontSize: 10, fontWeight: 700, color: m.featured ? 'rgba(255,255,255,0.75)' : m.color, margin: '0 0 8px', letterSpacing: '0.04em' }}>{m.label}</p>
                          <p style={{ fontSize: 'clamp(20px,4vw,26px)', fontWeight: 800, color: m.color, margin: 0, letterSpacing: '-0.5px' }}>{m.value.toFixed(2)}€</p>
                        </div>
                      ))}
                    </div>

                    {/* CPA máximo */}
                    {conAnuncios && (
                      <div style={{ background: calc.cpaMax > 0 ? '#fff7ed' : '#fef2f2', border: `1.5px solid ${calc.cpaMax > 0 ? '#fed7aa' : '#fecaca'}`, borderRadius: 18, padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeUp 0.2s ease both' }}>
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>CPA máximo permitido</p>
                          <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No superar este coste por venta en ads</p>
                        </div>
                        <p style={{ fontSize: 'clamp(24px,5vw,32px)', fontWeight: 800, color: calc.cpaMax > 0 ? '#ea580c' : '#dc2626', margin: 0, letterSpacing: '-1px' }}>
                          {calc.cpaMax.toFixed(2)}€
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* Placeholder si no hay precio */}
                {!calc && (
                  <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', border: '1.5px dashed #e2e8f0', textAlign: 'center', animation: 'fadeUp 0.2s ease both' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Introduce el coste del artículo</p>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Calcula al instante tu precio de venta óptimo</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── CONSULTOR ── */}
          {tab === 'consul' && (
            <div style={{ animation: 'fadeUp 0.2s ease both' }}>
              <div className="tool-max">

                {/* Hero */}
                <div style={{ background: '#fff', borderRadius: 24, padding: 'clamp(20px,4vw,28px)', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 16px rgba(0,0,0,0.04)', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(139,92,246,0.3)', flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Consultor de rentabilidad</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Analiza tu campaña con inteligencia artificial</p>
                    </div>
                  </div>

                  {/* Inputs grid */}
                  <div className="tool-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
                    <NumInput label="Inversión en ads" value={inversion} onChange={setInversion} placeholder="500" suffix="€" color="#7c3aed" />
                    <NumInput label="Unidades vendidas" value={unidades} onChange={setUnidades} placeholder="45" color="#0f172a" />
                    <NumInput label="Precio de venta" value={precioVenta} onChange={setPrecioVenta} placeholder="39.99" suffix="€" color="#0f766e" />
                    <NumInput label="Coste producto" value={costeProducto} onChange={setCosteProducto} placeholder="8.50" suffix="€" color="#0284c7" />
                    <NumInput label="Coste de envío" value={costoEnvio} onChange={setCostoEnvio} placeholder="7.50" suffix="€" color="#92400e" />
                    <NumInput label="Días de campaña" value={diasCampana} onChange={setDiasCampana} placeholder="30" suffix="días" color="#475569" />
                  </div>
                </div>

                {/* Placeholder si no hay datos */}
                {!rent && (
                  <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px', border: '1.5px dashed #e2e8f0', textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Rellena los datos de tu campaña</p>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Mínimo inversión, unidades y precio de venta</p>
                  </div>
                )}

                {/* Resultados */}
                {rent && (
                  <>
                    {/* Métricas principales */}
                    <div className="tool-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <MetricCard
                        label="Beneficio neto"
                        value={`${rent.beneficioNeto >= 0 ? '+' : ''}${rent.beneficioNeto.toFixed(2)}€`}
                        sub="Después de todos los costes"
                        color={rent.beneficioNeto >= 0 ? '#0f766e' : '#dc2626'}
                        bg={rent.beneficioNeto >= 0 ? '#f0fdf4' : '#fef2f2'}
                        border={rent.beneficioNeto >= 0 ? '#bbf7d0' : '#fecaca'}
                      />
                      <MetricCard
                        label="ROI"
                        value={`${rent.roi >= 0 ? '+' : ''}${rent.roi.toFixed(1)}%`}
                        sub="Retorno sobre inversión"
                        color={rent.roi >= 0 ? '#0284c7' : '#dc2626'}
                        bg={rent.roi >= 0 ? '#f0f9ff' : '#fef2f2'}
                        border={rent.roi >= 0 ? '#bae6fd' : '#fecaca'}
                      />
                      <MetricCard
                        label="CPA real"
                        value={`${rent.cpaReal.toFixed(2)}€`}
                        sub="Coste por adquisición"
                        color="#92400e"
                        bg="#fff7ed"
                        border="#fed7aa"
                      />
                      <MetricCard
                        label="Ventas / día"
                        value={rent.ventasDia.toFixed(1)}
                        sub={rentData.dias > 0 ? `En ${rentData.dias} días` : 'Introduce los días'}
                        color="#7c3aed"
                        bg="#faf5ff"
                        border="#e9d5ff"
                      />
                    </div>

                    {/* Ingresos brutos */}
                    <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeUp 0.2s ease both' }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 3px' }}>Ingresos brutos totales</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{rentData.uni} unidades × {rentData.pv}€</p>
                      </div>
                      <p style={{ fontSize: 'clamp(22px,4vw,30px)', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
                        {rent.ingresosBrutos.toFixed(2)}€
                      </p>
                    </div>

                    {/* Barra visual rentabilidad */}
                    <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 14, animation: 'fadeUp 0.2s ease 0.05s both' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>Distribución de costes</p>
                      {[
                        { label: 'Inversión ads',   value: rentData.inv,                   color: '#7c3aed', bg: '#faf5ff' },
                        { label: 'Coste producto',  value: rentData.cp * rentData.uni,      color: '#0284c7', bg: '#f0f9ff' },
                        { label: 'Coste envío',     value: rentData.ce * rentData.uni,      color: '#92400e', bg: '#fff7ed' },
                        { label: 'Beneficio',       value: Math.max(0, rent.beneficioNeto), color: '#0f766e', bg: '#f0fdf4' },
                      ].map(row => {
                        const pct = rent.ingresosBrutos > 0 ? Math.min(100, (row.value / rent.ingresosBrutos) * 100) : 0
                        return (
                          <div key={row.label} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{row.label}</span>
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: row.color }}>{row.value.toFixed(2)}€</span>
                            </div>
                            <div style={{ height: 5, background: row.bg, borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', borderRadius: 3, background: row.color, width: `${pct}%`, transition: 'width 0.6s ease' }} />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* IA */}
                    <div style={{ background: 'linear-gradient(135deg,#faf5ff,#f5f3ff)', borderRadius: 20, padding: 'clamp(18px,3vw,24px)', border: '1.5px solid #e9d5ff', animation: 'fadeUp 0.2s ease 0.1s both' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: recomendacionIA ? 16 : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(139,92,246,0.3)', flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 800, color: '#7c3aed', margin: 0 }}>Análisis con IA</p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Recomendaciones personalizadas</p>
                          </div>
                        </div>
                        <button onClick={pedirRecomendacionIA} disabled={loadingIA} className="btn-ia"
                          style={{ padding: '10px 20px', borderRadius: 30, fontSize: 13, fontWeight: 700, border: 'none', background: loadingIA ? '#f1f5f9' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: loadingIA ? '#94a3b8' : '#fff', cursor: loadingIA ? 'not-allowed' : 'pointer', fontFamily: F, display: 'flex', alignItems: 'center', gap: 7, boxShadow: loadingIA ? 'none' : '0 4px 14px rgba(139,92,246,0.25)' }}>
                          {loadingIA ? (
                            <>
                              <div style={{ width: 13, height: 13, border: '2px solid #e2e8f0', borderTopColor: '#94a3b8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                              Analizando...
                            </>
                          ) : (
                            <>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                              Analizar
                            </>
                          )}
                        </button>
                      </div>

                      {recomendacionIA && (
                        <div style={{ background: '#fff', borderRadius: 14, padding: '16px', border: '1px solid #e9d5ff', marginTop: 14 }}>
                          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, margin: 0 }}>{recomendacionIA}</p>
                        </div>
                      )}

                      {!recomendacionIA && !loadingIA && (
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: '14px 0 0', fontStyle: 'italic' }}>
                          Pulsa "Analizar" para obtener recomendaciones personalizadas de tu campaña
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}