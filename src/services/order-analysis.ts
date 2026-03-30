import { createAdminClient } from '@/lib/supabase/admin'
import { calculateBaseRisk } from './risk-engine'
import { analyzeOrderWithAI } from './ai-analysis'
import { deductBalance, hasBalance } from './wallet'

const AI_ANALYSIS_COST_INITIAL = 0.17    // primer análisis
const AI_ANALYSIS_COST_REANALYSIS = 0.01 // reanálisis manual

export async function analyzeOrder(orderId: string): Promise<void> {
  const supabase = createAdminClient()

  // 1. Cargar pedido completo
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      customers (*),
      order_items (
        *,
        products (*)
      )
    `)
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    throw new Error(`Pedido no encontrado: ${orderId}`)
  }

  // 2. Determinar coste según si es primer análisis o reanálisis
  const isFirstAnalysis = !order.ai_charged
  const cost = isFirstAnalysis ? AI_ANALYSIS_COST_INITIAL : AI_ANALYSIS_COST_REANALYSIS

  // 3. Preparar datos para el motor de riesgo
  const customer = order.customers
  const products = order.order_items.map((item: any) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    cost_price: item.products?.cost_price ?? 0,
  }))

  const riskInput = {
    customer: {
      total_orders: customer?.total_orders ?? 0,
      total_delivered: customer?.total_delivered ?? 0,
      total_cancelled: customer?.total_cancelled ?? 0,
      total_returned: customer?.total_returned ?? 0,
      is_new: !customer || customer.total_orders === 0,
    },
    order: {
      total_price: order.total_price,
      phone: order.phone,
      shipping_address: order.shipping_address,
    },
    products,
  }

  // 4. Calcular score base
  const baseResult = calculateBaseRisk(riskInput)

  // 5. Verificar saldo
  const hasFunds = await hasBalance(order.account_id, cost)

  if (!hasFunds) {
    await saveAnalysis(orderId, order.account_id, {
      base_score: baseResult.base_score,
      ai_score: 0,
      final_score: baseResult.base_score,
      risk_level: baseResult.risk_level,
      summary: 'Análisis básico — saldo insuficiente',
      human_explanation: null,
      recommendation: null,
      customer_message: null,
      tags: baseResult.signals.map(s => s.tag),
      tagSource: 'rules',
    })
    return
  }

  // 6. Cobrar
  await deductBalance(
    order.account_id,
    cost,
    'order_analysis_charge',
    `${isFirstAnalysis ? 'Análisis IA' : 'Reanálisis IA'} pedido ${order.order_number ?? order.id}`,
    { order_id: orderId }
  )

  // 7. Marcar ai_charged solo en el primer análisis
  if (isFirstAnalysis) {
    await supabase
      .from('orders')
      .update({ ai_charged: true })
      .eq('id', orderId)
  }

  // 8. Llamar a la IA
  const aiInput = {
    order: {
      id: order.id,
      order_number: order.order_number,
      total_price: order.total_price,
      status: order.status,
      phone: order.phone,
      shipping_address: order.shipping_address,
      notes: order.notes,
    },
    customer: customer ? {
      first_name: customer.first_name,
      last_name: customer.last_name,
      total_orders: customer.total_orders,
      total_delivered: customer.total_delivered,
      total_cancelled: customer.total_cancelled,
      total_returned: customer.total_returned,
    } : null,
    products,
    base_score: baseResult.base_score,
    risk_signals: baseResult.signals.map(s => s.tag),
  }

  const aiResult = await analyzeOrderWithAI(aiInput)

  // 9. Guardar análisis completo
  await saveAnalysis(orderId, order.account_id, {
    base_score: baseResult.base_score,
    ai_score: aiResult.ai_score,
    final_score: aiResult.final_score,
    risk_level: aiResult.risk_level,
    summary: aiResult.summary,
    human_explanation: aiResult.human_explanation,
    recommendation: aiResult.recommendation,
    customer_message: aiResult.customer_message,
    tags: [
      ...baseResult.signals.map(s => s.tag),
      ...aiResult.tags,
    ],
    tagSource: 'ai',
  })
}

async function saveAnalysis(
  orderId: string,
  accountId: string,
  data: {
    base_score: number
    ai_score: number
    final_score: number
    risk_level: string
    summary: string | null
    human_explanation: string | null
    recommendation: string | null
    customer_message: string | null
    tags: string[]
    tagSource: 'ai' | 'rules'
  }
) {
  const supabase = createAdminClient()

  await supabase
    .from('order_risk_analyses')
    .upsert({
      order_id: orderId,
      account_id: accountId,
      risk_score: data.final_score,
      risk_level: data.risk_level as any,
      base_score: data.base_score,
      ai_score: data.ai_score,
      summary: data.summary,
      human_explanation: data.human_explanation,
      recommendation: data.recommendation,
      customer_message: data.customer_message,
      analysed_at: new Date().toISOString(),
    }, {
      onConflict: 'order_id',
    })

  await supabase
    .from('order_risk_tags')
    .delete()
    .eq('order_id', orderId)

  if (data.tags.length > 0) {
    const uniqueTags = [...new Set(data.tags)]
    await supabase
      .from('order_risk_tags')
      .insert(
        uniqueTags.map(tag => ({
          order_id: orderId,
          account_id: accountId,
          tag,
          source: data.tagSource,
        }))
      )
  }
}