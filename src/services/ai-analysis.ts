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

  const customerInfo = customer
    ? `- Nombre: ${customer.first_name ?? ''} ${customer.last_name ?? ''}
- Pedidos totales: ${customer.total_orders}
- Entregados: ${customer.total_delivered}
- Cancelados: ${customer.total_cancelled}
- Devueltos: ${customer.total_returned}`
    : '- Cliente nuevo sin historial'

  const productList = products
    .map(p => `  · ${p.name} x${p.quantity} — ${p.price}€`)
    .join('\n')

  const address = order.shipping_address
    ? `${order.shipping_address.address1 ?? ''}, ${order.shipping_address.city ?? ''}, ${order.shipping_address.zip ?? ''}`
    : 'No disponible'

  return `Analiza este pedido COD y devuelve un JSON con esta estructura exacta:
{
  "ai_score": número entre 0 y 100 (tu evaluación del riesgo),
  "summary": "resumen breve del pedido en 1 frase",
  "human_explanation": "explicación clara del riesgo para el operador, máximo 3 frases",
  "recommendation": "qué debería hacer el operador: confirmar, llamar, cancelar, etc.",
  "customer_message": "mensaje natural para enviar al cliente por WhatsApp confirmando o pidiendo datos",
  "tags": ["array", "de", "tags", "relevantes"]
}

DATOS DEL PEDIDO:
- Número: ${order.order_number ?? order.id}
- Importe: ${order.total_price}€
- Teléfono: ${order.phone ?? 'No disponible'}
- Dirección: ${address}
- Notas: ${order.notes ?? 'Ninguna'}

PRODUCTOS:
${productList}

CLIENTE:
${customerInfo}

SCORE BASE (motor de reglas): ${base_score}/100
SEÑALES DETECTADAS: ${risk_signals.length > 0 ? risk_signals.join(', ') : 'ninguna'}

Recuerda: no inventes datos, basa tu análisis solo en lo que ves arriba.`
}