type OrderData = {
  customer: {
    total_orders: number
    total_delivered: number
    total_cancelled: number
    total_returned: number
    is_new: boolean
    average_order_value?: number        // ticket medio histórico
    first_name?: string | null
    last_name?: string | null
    recent_orders_last_24h?: number     // pedidos en últimas 24h
    phone_negative_history?: boolean    // teléfono con historial negativo
    address_negative_history?: boolean  // dirección con historial negativo
  }
  order: {
    total_price: number
    phone: string | null
    shipping_address: any
    created_at?: string                 // hora del pedido
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

  // ── HISTORIAL DEL CLIENTE ─────────────────────────────────
  if (customer.is_new) {
    signals.push({ tag: 'cliente_nuevo', points: 15, source: 'rules' })
    score += 15
  }

  if (customer.total_orders > 0) {
    const deliveryRate = customer.total_delivered / customer.total_orders
    const cancelRate   = customer.total_cancelled / customer.total_orders
    const returnRate   = customer.total_returned  / customer.total_orders

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

    // Importe actual vs ticket medio histórico
    if (
      customer.average_order_value &&
      customer.average_order_value > 0 &&
      order.total_price > customer.average_order_value * 3
    ) {
      signals.push({ tag: 'importe_anomalo', points: 15, source: 'rules' })
      score += 15
    }
  }

  // ── VELOCIDAD DE PEDIDOS (mismo cliente, últimas 24h) ─────
  if ((customer.recent_orders_last_24h ?? 0) >= 2) {
    signals.push({ tag: 'pedidos_rapidos', points: 15, source: 'rules' })
    score += 15
  }

  // ── TELÉFONO CON HISTORIAL NEGATIVO ──────────────────────
  if (customer.phone_negative_history) {
    signals.push({ tag: 'telefono_historial_negativo', points: 20, source: 'rules' })
    score += 20
  }

  // ── DIRECCIÓN CON HISTORIAL NEGATIVO ─────────────────────
  if (customer.address_negative_history) {
    signals.push({ tag: 'direccion_historial_negativo', points: 20, source: 'rules' })
    score += 20
  }

  // ── HORA DEL PEDIDO ───────────────────────────────────────
  if (order.created_at) {
    const hour = new Date(order.created_at).getHours()
    if (hour >= 0 && hour < 6) {
      signals.push({ tag: 'pedido_madrugada', points: 10, source: 'rules' })
      score += 10
    }
  }

  // ── NOMBRE SOSPECHOSO ─────────────────────────────────────
  const fullName = `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.toLowerCase().trim()
  const suspiciousNames = ['test', 'prueba', 'asdf', 'qwerty', 'xxxxx', 'aaaaaa', 'cliente']
  const isSuspiciousName =
    fullName.length < 4 ||
    suspiciousNames.some(n => fullName.includes(n)) ||
    /^(.)\1+$/.test(fullName.replace(/\s/g, '')) // todos los chars iguales
  if (isSuspiciousName && fullName.length > 0) {
    signals.push({ tag: 'nombre_sospechoso', points: 10, source: 'rules' })
    score += 10
  }

  // ── DIRECCIÓN ─────────────────────────────────────────────
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
    ].filter(Boolean).join(' ').toLowerCase()

    if (addressStr.length < 15) {
      signals.push({ tag: 'direccion_incompleta', points: 15, source: 'rules' })
      score += 15
    }

    if (!address.zip || address.zip.length < 4) {
      signals.push({ tag: 'cp_dudoso', points: 10, source: 'rules' })
      score += 10
    }

    // Dirección sospechosa con palabras clave
    const suspiciousAddr = ['test', 'prueba', 'falsa', 'fake', 'xxx', 'aaa', 'calle mayor 1']
    if (suspiciousAddr.some(w => addressStr.includes(w))) {
      signals.push({ tag: 'direccion_sospechosa', points: 15, source: 'rules' })
      score += 15
    }

    // Validación básica CP vs provincia España
    if (address.zip && address.province) {
      const cp = String(address.zip).slice(0, 2)
      const province = address.province.toLowerCase()
      const cpProvinceMismatch = detectCPProvinceMismatch(cp, province)
      if (cpProvinceMismatch) {
        signals.push({ tag: 'cp_provincia_discrepancia', points: 10, source: 'rules' })
        score += 10
      }
    }
  }

  // ── TELÉFONO ──────────────────────────────────────────────
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

  // ── IMPORTE ───────────────────────────────────────────────
  if (order.total_price > 80) {
    signals.push({ tag: 'importe_alto', points: 10, source: 'rules' })
    score += 10
  }
  if (order.total_price > 200) {
    signals.push({ tag: 'importe_muy_alto', points: 10, source: 'rules' })
    score += 10
  }

  // ── PRODUCTO ──────────────────────────────────────────────
  const productNames = products.map(p => p.name.toLowerCase()).join(' ')
  const impulseKeywords = ['oferta', 'flash', 'limitado', 'gratis', 'regalo', 'promo', 'urgente', 'última unidad']
  if (impulseKeywords.some(k => productNames.includes(k))) {
    signals.push({ tag: 'producto_impulsivo', points: 10, source: 'rules' })
    score += 10
  }

  // ── NORMALIZAR 0-100 ──────────────────────────────────────
  const base_score = Math.min(score, 100)

  const risk_level =
    base_score < 25 ? 'bajo' :
    base_score < 50 ? 'medio' :
    base_score < 75 ? 'alto' : 'muy_alto'

  return { base_score, risk_level, signals }
}

// ── Detección básica discrepancia CP/Provincia España ─────
function detectCPProvinceMismatch(cp2: string, province: string): boolean {
  const cpMap: Record<string, string[]> = {
    '01': ['álava', 'araba'],
    '02': ['albacete'],
    '03': ['alicante', 'alacant'],
    '04': ['almería'],
    '05': ['ávila'],
    '06': ['badajoz'],
    '07': ['baleares', 'illes balears', 'mallorca'],
    '08': ['barcelona'],
    '09': ['burgos'],
    '10': ['cáceres'],
    '11': ['cádiz'],
    '12': ['castellón', 'castelló'],
    '13': ['ciudad real'],
    '14': ['córdoba'],
    '15': ['coruña', 'a coruña'],
    '16': ['cuenca'],
    '17': ['girona', 'gerona'],
    '18': ['granada'],
    '19': ['guadalajara'],
    '20': ['guipúzcoa', 'gipuzkoa'],
    '21': ['huelva'],
    '22': ['huesca'],
    '23': ['jaén'],
    '24': ['león'],
    '25': ['lleida', 'lérida'],
    '26': ['la rioja', 'rioja'],
    '27': ['lugo'],
    '28': ['madrid'],
    '29': ['málaga'],
    '30': ['murcia'],
    '31': ['navarra', 'nafarroa'],
    '32': ['ourense', 'orense'],
    '33': ['asturias'],
    '34': ['palencia'],
    '35': ['las palmas', 'palmas'],
    '36': ['pontevedra'],
    '37': ['salamanca'],
    '38': ['santa cruz de tenerife', 'tenerife'],
    '39': ['cantabria', 'santander'],
    '40': ['segovia'],
    '41': ['sevilla'],
    '42': ['soria'],
    '43': ['tarragona'],
    '44': ['teruel'],
    '45': ['toledo'],
    '46': ['valencia'],
    '47': ['valladolid'],
    '48': ['vizcaya', 'bizkaia'],
    '49': ['zamora'],
    '50': ['zaragoza'],
    '51': ['ceuta'],
    '52': ['melilla'],
  }
  const validProvinces = cpMap[cp2]
  if (!validProvinces) return false
  return !validProvinces.some(p => province.includes(p))
}