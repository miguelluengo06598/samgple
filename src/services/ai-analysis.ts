type AIAnalysisInput = {
  order: {
    id: string
    order_number: string | null
    total_price: number
    status: string
    phone: string | null
    shipping_address: any
    notes: string | null
  }
  customer: {
    first_name: string | null
    last_name: string | null
    total_orders: number
    total_delivered: number
    total_cancelled: number
    total_returned: number
  } | null
  products: Array<{ name: string; quantity: number; price: number }>
  base_score: number
  risk_signals: string[]
}

export type AIAnalysisResult = {
  ai_score: number
  final_score: number
  risk_level: 'bajo' | 'medio' | 'alto' | 'muy_alto'
  summary: string
  human_explanation: string
  recommendation: string
  customer_message: string
  tags: string[]
}

export async function analyzeOrderWithAI(input: AIAnalysisInput): Promise<AIAnalysisResult> {
  const prompt = buildPrompt(input)

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        {
          role: 'system',
          content: `Eres un sistema experto en análisis de pedidos contra reembolso (COD) para eCommerce. 
Tu trabajo es evaluar el riesgo de un pedido y ayudar al operador a tomar decisiones.
NUNCA inventes datos. NUNCA afirmes cosas que no estén en los datos.
Responde SIEMPRE en JSON válido, sin texto adicional, sin markdown.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  let parsed: any
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error('Error parseando respuesta de IA')
  }

  const final_score = Math.min(
    Math.round(input.base_score * 0.6 + (parsed.ai_score ?? 0) * 0.4),
    100
  )

  const risk_level: AIAnalysisResult['risk_level'] =
    final_score < 25 ? 'bajo' :
    final_score < 50 ? 'medio' :
    final_score < 75 ? 'alto' : 'muy_alto'

  return {
    ai_score: parsed.ai_score ?? 0,
    final_score,
    risk_level,
    summary: parsed.summary ?? '',
    human_explanation: parsed.human_explanation ?? '',
    recommendation: parsed.recommendation ?? '',
    customer_message: parsed.customer_message ?? '',
    tags: parsed.tags ?? [],
  }
}

function buildPrompt(input: AIAnalysisInput): string {
  const { order, customer, products, base_score, risk_signals } = input

  const productList = products
    .map(p => `  · ${p.name} x${p.quantity} — ${p.price}€`)
    .join('\n')

  const address = order.shipping_address
    ? `${order.shipping_address.address1 ?? ''}, ${order.shipping_address.city ?? ''}, ${order.shipping_address.zip ?? ''}, ${order.shipping_address.country ?? ''}`
    : 'No disponible'

  // Análisis profundo del historial
  let customerAnalysis = ''
  if (!customer || customer.total_orders === 0) {
    customerAnalysis = `CLIENTE NUEVO — sin historial previo. Mayor incertidumbre.`
  } else {
    const deliveryRate = customer.total_orders > 0
      ? Math.round((customer.total_delivered / customer.total_orders) * 100)
      : 0
    const cancelRate = customer.total_orders > 0
      ? Math.round((customer.total_cancelled / customer.total_orders) * 100)
      : 0
    const returnRate = customer.total_orders > 0
      ? Math.round((customer.total_returned / customer.total_orders) * 100)
      : 0

    const trend = deliveryRate >= 80
      ? '✅ Cliente fiable con buen historial de entregas'
      : deliveryRate >= 50
      ? '⚠️ Cliente con historial mixto'
      : '🔴 Cliente con historial problemático — muchas no entregas'

    customerAnalysis = `
- Total pedidos: ${customer.total_orders}
- Entregados: ${customer.total_delivered} (${deliveryRate}%)
- Cancelados: ${customer.total_cancelled} (${cancelRate}%)
- Devueltos: ${customer.total_returned} (${returnRate}%)
- Valoración: ${trend}
${cancelRate > 30 ? '⚠️ ALERTA: Tasa de cancelación alta — cliente problemático' : ''}
${returnRate > 30 ? '⚠️ ALERTA: Tasa de devolución alta' : ''}
${deliveryRate < 40 && customer.total_orders >= 3 ? '🔴 ALERTA CRÍTICA: Menos del 40% de entregas exitosas' : ''}`
  }

  return `Eres un experto en análisis de riesgo de pedidos COD (contra reembolso) para eCommerce español.
Analiza este pedido y devuelve ÚNICAMENTE un JSON válido con esta estructura exacta, sin texto adicional:

{
  "ai_score": número 0-100 (tu evaluación del riesgo — 0=sin riesgo, 100=riesgo máximo),
  "summary": "1 frase resumiendo el pedido y su riesgo principal",
  "human_explanation": "explicación clara para el operador en 2-3 frases. Menciona los factores más relevantes del historial y la dirección",
  "recommendation": "acción concreta: CONFIRMAR / LLAMAR PARA VERIFICAR / CANCELAR + motivo breve",
  "customer_message": "mensaje natural en español para enviar por WhatsApp al cliente. Debe sonar humano, no robótico. Adaptado al contexto del pedido.",
  "tags": ["array de tags relevantes, máximo 6, en español, formato snake_case"]
}

═══ DATOS DEL PEDIDO ═══
Número: ${order.order_number ?? order.id}
Importe: ${order.total_price}€
Teléfono: ${order.phone ?? 'No disponible'}
Dirección de entrega: ${address}
Notas del cliente: ${order.notes ?? 'Ninguna'}
Estado actual: ${order.status}

═══ PRODUCTOS ═══
${productList}

═══ HISTORIAL DEL CLIENTE ═══
Nombre: ${customer?.first_name ?? 'Desconocido'} ${customer?.last_name ?? ''}
${customerAnalysis}

═══ ANÁLISIS PREVIO (motor de reglas) ═══
Score base: ${base_score}/100
Señales detectadas: ${risk_signals.length > 0 ? risk_signals.join(', ') : 'ninguna señal de riesgo'}

═══ INSTRUCCIONES ═══
- Basa tu análisis en los datos reales. No inventes información.
- El historial del cliente es el factor más importante.
- Si el cliente tiene buen historial, reduce el riesgo aunque otros factores sean negativos.
- Si el cliente tiene mal historial, aumenta el riesgo aunque el pedido parezca normal.
- El mensaje de WhatsApp debe ser cálido y profesional, adaptado al nivel de riesgo:
  * Riesgo bajo: mensaje de confirmación amigable
  * Riesgo medio: mensaje pidiendo confirmación con tono neutro
  * Riesgo alto: mensaje cauteloso pidiendo verificación
- Los tags deben ser descriptivos: cliente_nuevo, historial_excelente, direccion_incompleta, importe_alto, producto_impulsivo, etc.`
}