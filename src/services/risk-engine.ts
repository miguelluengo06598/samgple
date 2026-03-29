type OrderData = {
  customer: {
    total_orders: number
    total_delivered: number
    total_cancelled: number
    total_returned: number
    is_new: boolean
  }
  order: {
    total_price: number
    phone: string | null
    shipping_address: any
  }
  products: Array<{
    name: string
    cost_price: number
  }>
}

type RiskSignal = {
  tag: string
  points: number
  source: 'rules'
}

export type RiskEngineResult = {
  base_score: number
  risk_level: 'bajo' | 'medio' | 'alto' | 'muy_alto'
  signals: RiskSignal[]
}

export function calculateBaseRisk(data: OrderData): RiskEngineResult {
  const signals: RiskSignal[] = []
  let score = 0

  const { customer, order, products } = data

  // ── HISTORIAL DEL CLIENTE (peso 35%) ──────────────────────
  if (customer.is_new) {
    signals.push({ tag: 'cliente_nuevo', points: 15, source: 'rules' })
    score += 15
  }

  if (customer.total_orders > 0) {
    const deliveryRate = customer.total_delivered / customer.total_orders
    const cancelRate = customer.total_cancelled / customer.total_orders
    const returnRate = customer.total_returned / customer.total_orders

    if (deliveryRate < 0.5 && customer.total_orders >= 3) {
      signals.push({ tag: 'entregas_bajas', points: 20, source: 'rules' })
      score += 20
    }
    if (cancelRate > 0.3 && customer.total_orders >= 2) {
      signals.push({ tag: 'cancelaciones_altas', points: 15, source: 'rules' })
      score += 15
    }
    if (returnRate > 0.3 && customer.total_orders >= 2) {
      signals.push({ tag: 'devoluciones_altas', points: 15, source: 'rules' })
      score += 15
    }
  }

  // ── DIRECCIÓN (peso 20%) ──────────────────────────────────
  const address = order.shipping_address
  if (!address) {
    signals.push({ tag: 'sin_direccion', points: 20, source: 'rules' })
    score += 20
  } else {
    const addressStr = [
      address.address1,
      address.address2,
      address.city,
      address.zip,
    ].filter(Boolean).join(' ')

    if (addressStr.length < 15) {
      signals.push({ tag: 'direccion_incompleta', points: 15, source: 'rules' })
      score += 15
    }
    if (!address.zip || address.zip.length < 4) {
      signals.push({ tag: 'cp_dudoso', points: 10, source: 'rules' })
      score += 10
    }
  }

  // ── TELÉFONO (peso 15%) ───────────────────────────────────
  if (!order.phone) {
    signals.push({ tag: 'sin_telefono', points: 15, source: 'rules' })
    score += 15
  } else {
    const phone = order.phone.replace(/\D/g, '')
    if (phone.length < 9) {
      signals.push({ tag: 'telefono_sospechoso', points: 10, source: 'rules' })
      score += 10
    }
  }

  // ── IMPORTE (peso 15%) ────────────────────────────────────
  if (order.total_price > 150) {
    signals.push({ tag: 'importe_alto', points: 10, source: 'rules' })
    score += 10
  }
  if (order.total_price > 300) {
    signals.push({ tag: 'importe_muy_alto', points: 10, source: 'rules' })
    score += 10
  }

  // ── PRODUCTO (peso 15%) ───────────────────────────────────
  const productNames = products.map(p => p.name.toLowerCase()).join(' ')
  const impulseKeywords = ['oferta', 'flash', 'limitado', 'gratis', 'regalo', 'promo']
  const hasImpulseProduct = impulseKeywords.some(k => productNames.includes(k))
  if (hasImpulseProduct) {
    signals.push({ tag: 'producto_impulsivo', points: 10, source: 'rules' })
    score += 10
  }

  // ── NORMALIZAR 0-100 ─────────────────────────────────────
  const base_score = Math.min(score, 100)

  const risk_level =
    base_score < 25 ? 'bajo' :
    base_score < 50 ? 'medio' :
    base_score < 75 ? 'alto' : 'muy_alto'

  return { base_score, risk_level, signals }
}