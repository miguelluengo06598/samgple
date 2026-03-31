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

// Estilos base
const card: React.CSSProperties = { background: '#fff', borderRadius: 24, padding: '20px', border: '1px solid #f1f5f9', marginBottom: 12 }
const fieldWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px', background: '#f8fafc', border: '1.5px solid #f1f5f9', borderRadius: 14 }
const fieldIn: React.CSSProperties = { border: 'none', background: 'transparent', fontSize: 14, fontWeight: 600, color: '#0f172a', outline: 'none', flex: 1, minWidth: 0, fontFamily: F }
const flabel: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'block', fontFamily: F }

function PillToggle({ options, value, onChange }: { options: { label: string; val: any }[], value: any, onChange: (v: any) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
      {options.map(opt => {
        const active = value === opt.val
        return (
          <button key={String(opt.val)} onClick={() => onChange(opt.val)}
            style={{ flex: 1, padding: '12px', borderRadius: 30, fontSize: 13, fontWeight: 700, border: `2px solid ${active ? '#2EC4B6' : '#e2e8f0'}`, background: active ? '#f0fafa' : '#fff', color: active ? '#0f766e' : '#94a3b8', cursor: 'pointer', transition: 'all 0.15s', fontFamily: F }}>
            {opt.label}
          </button>
        )
      })}
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
    inv: parseFloat(inversion) || 0,
    uni: parseFloat(unidades) || 0,
    pv: parseFloat(precioVenta) || 0,
    cp: parseFloat(costeProducto) || 0,
    ce: parseFloat(costoEnvio) || 0,
    dias: parseFloat(diasCampana) || 0,
  }
  const rentOk = rentData.inv > 0 && rentData.uni > 0 && rentData.pv > 0
  const rent = rentOk ? calcularRentabilidad(rentData.inv, rentData.uni, rentData.pv, rentData.cp, rentData.ce, rentData.dias) : null

  async function pedirRecomendacionIA() {
    if (!rent) return
    setLoadingIA(true)
    setRecomendacionIA('')
    try {
      const res = await fetch('/api/tools/profitability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inversion: rentData.inv, unidades: rentData.uni, precioVenta: rentData.pv,
          costeProducto: rentData.cp, costoEnvio: rentData.ce, diasCampana: rentData.dias,
          cpaReal: rent.cpaReal.toFixed(2), roi: rent.roi.toFixed(1), beneficioNeto: rent.beneficioNeto.toFixed(2),
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
    <div style={{ background: '#f8fafc', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: F }}>

      {/* Header */}
      <div style={{ background: '#fff', padding: '44px 20px 20px', borderBottom: '1px solid #f1f5f9' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>Herramientas</h1>
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>Calcula precios y analiza rentabilidad</p>

        {/* Tab selector — estilo B pills */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ label: 'Calculadora', val: 'calc' }, { label: 'Consultor', val: 'consul' }].map(opt => {
            const active = tab === opt.val
            return (
              <button key={opt.val} onClick={() => setTab(opt.val as any)}
                style={{ flex: 1, padding: '12px', borderRadius: 30, fontSize: 13, fontWeight: 700, border: `2px solid ${active ? '#2EC4B6' : '#e2e8f0'}`, background: active ? '#f0fafa' : '#fff', color: active ? '#0f766e' : '#94a3b8', cursor: 'pointer', transition: 'all 0.15s', fontFamily: F }}>
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '16px 16px 100px' }}>

        {/* ── CALCULADORA ── */}
        {tab === 'calc' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: F }}>Calculadora de precio</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontFamily: F }}>Calcula tu precio de venta óptimo</p>
              </div>
            </div>

            {/* Input precio */}
            <span style={flabel}>Coste del artículo con IVA</span>
            <div style={{ ...fieldWrap, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              <input type="number" step="0.01" placeholder="0.00" value={precioArticulo} onChange={e => setPrecioArticulo(e.target.value)} style={fieldIn} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2EC4B6', flexShrink: 0 }}>€</span>
            </div>

            {/* Toggle tipo adquisición — estilo B */}
            <span style={flabel}>Tipo de adquisición</span>
            <PillToggle
              options={[{ label: 'Con anuncios', val: true }, { label: 'Orgánico', val: false }]}
              value={conAnuncios}
              onChange={setConAnuncios}
            />

            {/* Info estimaciones */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', borderRadius: 12, padding: '9px 13px', marginBottom: 16, border: '1px solid #bbf7d0' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
              <p style={{ fontSize: 12, color: '#15803d', margin: 0, fontFamily: F }}>
                Envío <strong>7.50€</strong>{conAnuncios && <> · CPA <strong>9.00€</strong></>} incluidos
              </p>
            </div>

            {/* Resultados */}
            {calc && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Desglose */}
                <div style={{ background: '#f8fafc', borderRadius: 16, padding: '14px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px', fontFamily: F }}>Desglose de costes</p>
                  {[
                    { label: 'Artículo sin IVA', value: calc.precioSinIVA, bold: false },
                    { label: 'Envío estimado', value: calc.envio, bold: false },
                    ...(conAnuncios ? [{ label: 'CPA estimado', value: calc.cpa, bold: false }] : []),
                    { label: 'Coste total', value: calc.costeBase, bold: true },
                  ].map((row, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: i > 0 ? '1px solid #f1f5f9' : 'none' }}>
                      <span style={{ fontSize: 13, color: row.bold ? '#0f172a' : '#64748b', fontWeight: row.bold ? 700 : 400, fontFamily: F }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: row.bold ? '#0f766e' : '#374151', fontFamily: F }}>{row.value.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                {/* Precios recomendados */}
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '2px 0 6px', fontFamily: F }}>Precio de venta recomendado</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: '25%', value: calc.p25, color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0', ideal: false },
                    { label: '30%', value: calc.p30, color: '#fff', bg: 'linear-gradient(135deg,#2EC4B6,#1D9E75)', border: 'transparent', ideal: true },
                    { label: '35%', value: calc.p35, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', ideal: false },
                  ].map(m => (
                    <div key={m.label} style={{ background: m.bg, border: `1.5px solid ${m.border}`, borderRadius: 16, padding: '13px 10px', textAlign: 'center', boxShadow: m.ideal ? '0 4px 14px rgba(46,196,182,0.3)' : 'none' }}>
                      <p style={{ fontSize: 9, fontWeight: 800, color: m.ideal ? 'rgba(255,255,255,0.8)' : m.color, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: F }}>Margen {m.label}</p>
                      <p style={{ fontSize: 17, fontWeight: 800, color: m.color, margin: 0, fontFamily: F }}>{m.value.toFixed(2)}€</p>
                      {m.ideal && <span style={{ fontSize: 8, fontWeight: 800, background: 'rgba(255,255,255,0.25)', color: '#fff', padding: '2px 7px', borderRadius: 20, marginTop: 5, display: 'inline-block', fontFamily: F }}>IDEAL</span>}
                    </div>
                  ))}
                </div>

                {/* CPA máximo */}
                {conAnuncios && (
                  <div style={{ background: calc.cpaMax > 0 ? '#fff7ed' : '#fef2f2', border: `1.5px solid ${calc.cpaMax > 0 ? '#fed7aa' : '#fecaca'}`, borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px', fontFamily: F }}>CPA máximo</p>
                      <p style={{ fontSize: 11, color: '#92400e', margin: 0, fontFamily: F }}>No superar este coste por venta</p>
                    </div>
                    <p style={{ fontSize: 24, fontWeight: 800, color: calc.cpaMax > 0 ? '#ea580c' : '#dc2626', margin: 0, fontFamily: F }}>{calc.cpaMax.toFixed(2)}€</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CONSULTOR ── */}
        {tab === 'consul' && (
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: F }}>Consultor de rentabilidad</p>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontFamily: F }}>Analiza el rendimiento de tu campaña</p>
              </div>
            </div>

            {/* Inputs grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                { label: 'Inversión ads (€)', val: inversion, set: setInversion, ph: '500' },
                { label: 'Unidades vendidas', val: unidades, set: setUnidades, ph: '45' },
                { label: 'Precio venta (€)', val: precioVenta, set: setPrecioVenta, ph: '39.99' },
                { label: 'Coste producto (€)', val: costeProducto, set: setCosteProducto, ph: '8.50' },
                { label: 'Coste envío (€)', val: costoEnvio, set: setCostoEnvio, ph: '7.50' },
                { label: 'Días campaña', val: diasCampana, set: setDiasCampana, ph: '30' },
              ].map(f => (
                <div key={f.label}>
                  <span style={flabel}>{f.label}</span>
                  <div style={fieldWrap}>
                    <input type="number" step="0.01" placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={{ ...fieldIn, fontSize: 13 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Resultados */}
            {rent && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Métricas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { label: 'Beneficio neto', value: `${rent.beneficioNeto >= 0 ? '+' : ''}${rent.beneficioNeto.toFixed(2)}€`, color: rent.beneficioNeto >= 0 ? '#0f766e' : '#dc2626', bg: rent.beneficioNeto >= 0 ? '#f0fdf4' : '#fef2f2', border: rent.beneficioNeto >= 0 ? '#bbf7d0' : '#fecaca', valColor: rent.beneficioNeto >= 0 ? '#2EC4B6' : '#dc2626' },
                    { label: 'ROI', value: `${rent.roi >= 0 ? '+' : ''}${rent.roi.toFixed(1)}%`, color: rent.roi >= 0 ? '#0284c7' : '#dc2626', bg: rent.roi >= 0 ? '#f0f9ff' : '#fef2f2', border: rent.roi >= 0 ? '#bae6fd' : '#fecaca', valColor: rent.roi >= 0 ? '#0284c7' : '#dc2626' },
                    { label: 'CPA real', value: `${rent.cpaReal.toFixed(2)}€`, color: '#9a3412', bg: '#fff7ed', border: '#fed7aa', valColor: '#ea580c' },
                    { label: 'Ventas / día', value: rent.ventasDia.toFixed(1), color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff', valColor: '#7c3aed' },
                  ].map(m => (
                    <div key={m.label} style={{ background: m.bg, border: `1.5px solid ${m.border}`, borderRadius: 18, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 5px', fontFamily: F }}>{m.label}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: m.valColor, margin: 0, fontFamily: F }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Ingresos */}
                <div style={{ background: 'linear-gradient(135deg,rgba(46,196,182,0.08),rgba(29,158,117,0.04))', borderRadius: 16, padding: '14px 16px', border: '1.5px solid rgba(46,196,182,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600, fontFamily: F }}>Ingresos brutos totales</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', fontFamily: F }}>{rent.ingresosBrutos.toFixed(2)}€</span>
                </div>

                {/* IA */}
                <div style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.06),rgba(124,58,237,0.02))', borderRadius: 18, padding: '16px', border: '1.5px solid #e9d5ff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: recomendacionIA ? 12 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#7c3aed', margin: 0, fontFamily: F }}>Recomendación IA</p>
                    </div>
                    <button onClick={pedirRecomendacionIA} disabled={loadingIA}
                      style={{ padding: '8px 16px', borderRadius: 30, fontSize: 12, fontWeight: 700, border: `2px solid ${loadingIA ? '#e2e8f0' : '#8b5cf6'}`, background: '#fff', color: loadingIA ? '#94a3b8' : '#7c3aed', cursor: loadingIA ? 'not-allowed' : 'pointer', fontFamily: F, transition: 'all 0.15s' }}>
                      {loadingIA ? 'Analizando...' : 'Analizar'}
                    </button>
                  </div>
                  {recomendacionIA && (
                    <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0, fontFamily: F }}>{recomendacionIA}</p>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}