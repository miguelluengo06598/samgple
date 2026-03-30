'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ENVIO_DEFAULT = 7.5
const CPA_DEFAULT = 9

function calcularPrecios(precioConIVA: number, conAnuncios: boolean) {
  const precioSinIVA = precioConIVA / 1.21
  const envio = ENVIO_DEFAULT
  const cpa = conAnuncios ? CPA_DEFAULT : 0
  const costeBase = precioSinIVA + envio + cpa

  const p25 = costeBase / (1 - 0.25)
  const p30 = costeBase / (1 - 0.30)
  const p35 = costeBase / (1 - 0.35)
  const cpaMax = precioConIVA * 0.25 - envio

  return { precioSinIVA, envio, cpa, costeBase, p25, p30, p35, cpaMax }
}

function calcularRentabilidad(
  inversion: number,
  unidades: number,
  precioVenta: number,
  costeProducto: number,
  costoEnvio: number,
  diasCampana: number
) {
  const ingresosBrutos = unidades * precioVenta
  const costesProducto = unidades * costeProducto
  const costesEnvio = unidades * costoEnvio
  const totalCostes = costesProducto + costesEnvio + inversion
  const beneficioNeto = ingresosBrutos - totalCostes
  const margenBruto = ingresosBrutos > 0 ? ((ingresosBrutos - costesProducto - costesEnvio) / ingresosBrutos) * 100 : 0
  const cpaReal = unidades > 0 ? inversion / unidades : 0
  const roi = inversion > 0 ? ((beneficioNeto / inversion) * 100) : 0
  const ventasDia = diasCampana > 0 ? unidades / diasCampana : 0

  return { ingresosBrutos, beneficioNeto, margenBruto, cpaReal, roi, ventasDia }
}

export default function HerramientasClient() {
  // Calculadora
  const [precioArticulo, setPrecioArticulo] = useState('')
  const [conAnuncios, setConAnuncios] = useState(true)

  // Consultor
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
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `Soy un negocio de eCommerce COD. Analiza estos datos y dame una recomendación clara en 3-4 frases:
- Inversión en ads: ${rentData.inv}€
- Unidades vendidas: ${rentData.uni}
- Precio de venta: ${rentData.pv}€
- Coste producto: ${rentData.cp}€
- Coste envío: ${rentData.ce}€
- Días de campaña: ${rentData.dias}
- CPA real: ${rent.cpaReal.toFixed(2)}€
- ROI: ${rent.roi.toFixed(1)}%
- Beneficio neto: ${rent.beneficioNeto.toFixed(2)}€
Dame solo la recomendación, sin introducciones. Sé directo y práctico.`
          }]
        })
      })
      const data = await res.json()
      setRecomendacionIA(data.content?.[0]?.text ?? 'No se pudo obtener recomendación')
    } finally {
      setLoadingIA(false)
    }
  }

  const S = {
    page: { background: '#f0fafa', minHeight: '100vh', maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif' } as React.CSSProperties,
    header: { background: '#fff', padding: '44px 20px 16px', borderBottom: '1px solid #cce8e6' } as React.CSSProperties,
    body: { padding: '16px 16px 100px', display: 'flex', flexDirection: 'column', gap: 16 } as React.CSSProperties,
    card: { background: '#ffffff', borderRadius: 22, padding: 18, border: '1px solid #cce8e6' } as React.CSSProperties,
    label: { fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px', display: 'block' } as React.CSSProperties,
    input: { width: '100%', padding: '12px 14px', borderRadius: 14, border: '1px solid #cce8e6', background: '#f0fafa', fontSize: 14, fontWeight: 600, color: '#0f172a', outline: 'none' } as React.CSSProperties,
    inputGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } as React.CSSProperties,
    fieldLabel: { fontSize: 11, fontWeight: 600, color: '#64748b', margin: '0 0 4px', display: 'block' } as React.CSSProperties,
    metricCard: { borderRadius: 16, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2 } as React.CSSProperties,
    metricLabel: { fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' } as React.CSSProperties,
    metricValue: { fontSize: 22, fontWeight: 700 } as React.CSSProperties,
  }

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Herramientas</h1>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Calculadora de precios y consultor de rentabilidad</p>
      </div>

      <div style={S.body}>

        {/* ── CALCULADORA DE PRECIOS ── */}
        <div style={S.card}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Calculadora de precio</p>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Introduce el coste del artículo con IVA</p>

          {/* Input precio */}
          <div style={{ marginBottom: 14 }}>
            <span style={S.fieldLabel}>Coste del artículo (con IVA)</span>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f0fafa', border: '1px solid #cce8e6', borderRadius: 14, overflow: 'hidden' }}>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={precioArticulo}
                onChange={e => setPrecioArticulo(e.target.value)}
                style={{ ...S.input, border: 'none', background: 'transparent', flex: 1, borderRadius: 0 }}
              />
              <span style={{ padding: '0 14px', fontSize: 13, fontWeight: 700, color: '#0f766e' }}>€</span>
            </div>
          </div>

          {/* Toggle anuncios/orgánico */}
          <div style={{ marginBottom: 16 }}>
            <span style={S.fieldLabel}>Tipo de adquisición</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                onClick={() => setConAnuncios(true)}
                style={{ padding: '11px 0', borderRadius: 14, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: conAnuncios ? '#2EC4B6' : '#f0fafa', color: conAnuncios ? '#fff' : '#64748b', transition: 'all 0.2s' }}
              >
                Con anuncios
              </button>
              <button
                onClick={() => setConAnuncios(false)}
                style={{ padding: '11px 0', borderRadius: 14, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', background: !conAnuncios ? '#2EC4B6' : '#f0fafa', color: !conAnuncios ? '#fff' : '#64748b', transition: 'all 0.2s' }}
              >
                Orgánico
              </button>
            </div>
          </div>

          {/* Info estimaciones */}
          <div style={{ background: '#f0fafa', borderRadius: 14, padding: '10px 14px', marginBottom: 16, border: '1px solid #cce8e6' }}>
            <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              Estimaciones aplicadas: <strong style={{ color: '#0f766e' }}>Envío 7.50€</strong>
              {conAnuncios && <> · <strong style={{ color: '#0f766e' }}>CPA 9.00€</strong></>}
            </p>
          </div>

          {/* Resultados */}
          <AnimatePresence>
            {calc && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                {/* Desglose costes */}
                <div style={{ background: '#f0fafa', borderRadius: 14, padding: '12px 14px', border: '1px solid #cce8e6' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Desglose de costes</p>
                  {[
                    { label: 'Coste artículo (sin IVA)', value: calc.precioSinIVA },
                    { label: 'Coste envío estimado', value: calc.envio },
                    ...(conAnuncios ? [{ label: 'CPA estimado', value: calc.cpa }] : []),
                    { label: 'Coste total', value: calc.costeBase, highlight: true },
                  ].map((row, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: i > 0 ? '1px solid #e2f0ef' : 'none' }}>
                      <span style={{ fontSize: 12, color: row.highlight ? '#0f172a' : '#64748b', fontWeight: row.highlight ? 700 : 400 }}>{row.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: row.highlight ? '#0f766e' : '#0f172a' }}>{row.value.toFixed(2)}€</span>
                    </div>
                  ))}
                </div>

                {/* Precios recomendados */}
                <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 6px' }}>Precio de venta recomendado</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                  {[
                    { label: '25%', value: calc.p25, color: '#0f766e', bg: '#f0fdf4', border: '#bbf7d0' },
                    { label: '30%', value: calc.p30, color: '#0284c7', bg: '#f0f9ff', border: '#bae6fd' },
                    { label: '35%', value: calc.p35, color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
                  ].map(m => (
                    <div key={m.label} style={{ background: m.bg, border: `1px solid ${m.border}`, borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: m.color, margin: '0 0 4px', textTransform: 'uppercase' }}>Margen {m.label}</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: m.color, margin: 0 }}>{m.value.toFixed(2)}€</p>
                    </div>
                  ))}
                </div>

                {/* CPA máximo */}
                {conAnuncios && (
                  <div style={{ background: calc.cpaMax > 0 ? '#fff7ed' : '#fef2f2', border: `1px solid ${calc.cpaMax > 0 ? '#fed7aa' : '#fecaca'}`, borderRadius: 14, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>CPA máximo recomendado</p>
                      <p style={{ fontSize: 11, color: '#92400e', margin: 0 }}>No superar este coste por adquisición</p>
                    </div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: calc.cpaMax > 0 ? '#ea580c' : '#dc2626', margin: 0 }}>{calc.cpaMax.toFixed(2)}€</p>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CONSULTOR DE RENTABILIDAD ── */}
        <div style={S.card}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>Consultor de rentabilidad</p>
          <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px' }}>Analiza el rendimiento de tu campaña</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <div style={S.inputGrid}>
              {[
                { label: 'Inversión en ads (€)', val: inversion, set: setInversion, placeholder: '500' },
                { label: 'Unidades vendidas', val: unidades, set: setUnidades, placeholder: '45' },
                { label: 'Precio de venta (€)', val: precioVenta, set: setPrecioVenta, placeholder: '39.99' },
                { label: 'Coste producto (€)', val: costeProducto, set: setCosteProducto, placeholder: '8.50' },
                { label: 'Coste envío (€)', val: costoEnvio, set: setCostoEnvio, placeholder: '7.50' },
                { label: 'Días de campaña', val: diasCampana, set: setDiasCampana, placeholder: '30' },
              ].map(f => (
                <div key={f.label}>
                  <span style={S.fieldLabel}>{f.label}</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder={f.placeholder}
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    style={S.input}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Resultados consultor */}
          <AnimatePresence>
            {rent && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

                {/* Métricas principales */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ ...S.metricCard, background: rent.beneficioNeto >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${rent.beneficioNeto >= 0 ? '#bbf7d0' : '#fecaca'}` }}>
                    <span style={{ ...S.metricLabel, color: rent.beneficioNeto >= 0 ? '#0f766e' : '#991b1b' }}>Beneficio neto</span>
                    <span style={{ ...S.metricValue, color: rent.beneficioNeto >= 0 ? '#2EC4B6' : '#dc2626' }}>
                      {rent.beneficioNeto >= 0 ? '+' : ''}{rent.beneficioNeto.toFixed(2)}€
                    </span>
                  </div>
                  <div style={{ ...S.metricCard, background: rent.roi >= 0 ? '#f0f9ff' : '#fef2f2', border: `1px solid ${rent.roi >= 0 ? '#bae6fd' : '#fecaca'}` }}>
                    <span style={{ ...S.metricLabel, color: rent.roi >= 0 ? '#0284c7' : '#991b1b' }}>ROI</span>
                    <span style={{ ...S.metricValue, color: rent.roi >= 0 ? '#0284c7' : '#dc2626' }}>
                      {rent.roi >= 0 ? '+' : ''}{rent.roi.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ ...S.metricCard, background: '#fff7ed', border: '1px solid #fed7aa' }}>
                    <span style={{ ...S.metricLabel, color: '#9a3412' }}>CPA real</span>
                    <span style={{ ...S.metricValue, color: '#ea580c' }}>{rent.cpaReal.toFixed(2)}€</span>
                  </div>
                  <div style={{ ...S.metricCard, background: '#faf5ff', border: '1px solid #e9d5ff' }}>
                    <span style={{ ...S.metricLabel, color: '#7c3aed' }}>Ventas/día</span>
                    <span style={{ ...S.metricValue, color: '#7c3aed' }}>{rent.ventasDia.toFixed(1)}</span>
                  </div>
                </div>

                {/* Ingresos totales */}
                <div style={{ background: '#f0fafa', borderRadius: 14, padding: '12px 16px', border: '1px solid #cce8e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Ingresos brutos totales</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{rent.ingresosBrutos.toFixed(2)}€</span>
                </div>

                {/* Recomendación IA */}
                <div style={{ background: '#f0fafa', borderRadius: 16, padding: '14px 16px', border: '1px solid #cce8e6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: recomendacionIA ? 10 : 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#0f766e', margin: 0 }}>✦ Recomendación IA</p>
                    <button
                      onClick={pedirRecomendacionIA}
                      disabled={loadingIA}
                      style={{ padding: '7px 14px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: 'none', background: '#2EC4B6', color: '#fff', cursor: 'pointer', opacity: loadingIA ? 0.6 : 1 }}
                    >
                      {loadingIA ? 'Analizando...' : 'Analizar con IA'}
                    </button>
                  </div>
                  <AnimatePresence>
                    {recomendacionIA && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0 }}
                      >
                        {recomendacionIA}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}