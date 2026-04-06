import { createAdminClient } from '@/lib/supabase/admin'
import { calculateBaseRisk } from './risk-engine'
import { analyzeOrderWithAI } from './ai-analysis'
import { deductBalance, hasBalance } from './wallet'
import { decryptDet, decrypt } from './crypto'

const AI_ANALYSIS_COST_INITIAL   = 0.17
const AI_ANALYSIS_COST_REANALYSIS = 0.02  // coste reanálisis manual

export async function analyzeOrder(
  orderId: string,
  options: { isManualReanalysis?: boolean } = {}
): Promise<void> {
  const supabase = createAdminClient()
  const { isManualReanalysis = false } = options

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

  if (orderError || !order) throw new Error(`Pedido no encontrado: ${orderId}`)

  // 2. Si ya fue analizado con IA y NO es reanálisis manual → solo reglas, sin IA
  const alreadyAnalyzed = !!order.ai_charged
  const runAI = !alreadyAnalyzed || isManualReanalysis

  const cost = alreadyAnalyzed
    ? AI_ANALYSIS_COST_REANALYSIS
    : AI_ANALYSIS_COST_INITIAL

  // 3. Desencriptar datos del cliente
  const customer = order.customers
  const decryptedPhone = decryptDet(order.phone) ?? decryptDet(customer?.phone)
  const decryptedFirstName = decrypt(customer?.first_name)
  const decryptedLastName  = decrypt(customer?.last_name)
  const decryptedAddress   = order.shipping_address
    ? {
        ...order.shipping_address,
        address1: decrypt(order.shipping_address.address1),
        address2: decrypt(order.shipping_address.address2),
        phone:    decryptDet(order.shipping_address.phone),
      }
    : null

  // 4. Datos extra para nuevas señales — pedidos recientes y historial de teléfono/dirección
  const now = new Date()
  const since24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

  // Pedidos del mismo cliente en últimas 24h
  let recentOrdersLast24h = 0
  if (customer?.id) {
    const { count } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('customer_id', customer.id)
      .gte('created_at', since24h)
    recentOrdersLast24h = count ?? 0
  }

  // Historial negativo del teléfono (mismo teléfono en pedidos cancelados/no_answer de otros clientes)
  let phoneNegativeHistory = false
  if (decryptedPhone) {
    const encryptedPhone = order.phone // ya encriptado en BD
    const { count } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('phone', encryptedPhone)
      .neq('id', orderId)
      .in('call_status', ['cancelled', 'no_answer', 'wrong_number'])
    phoneNegativeHistory = (count ?? 0) > 0
  }

  // Historial negativo de la dirección
  let addressNegativeHistory = false
  if (decryptedAddress?.address1) {
    const { data: negativeOrders } = await supabase
      .from('orders')
      .select('id, shipping_address')
      .neq('id', orderId)
      .in('call_status', ['cancelled', 'no_answer'])
      .limit(200)

    if (negativeOrders) {
      addressNegativeHistory = negativeOrders.some(o => {
        const addr = o.shipping_address
        if (!addr) return false
        const a1 = decrypt(addr.address1)?.toLowerCase().trim()
        return a1 && a1 === decryptedAddress.address1?.toLowerCase().trim()
      })
    }
  }

  // Ticket medio histórico del cliente
  let averageOrderValue = 0
  if (customer?.id && (customer.total_orders ?? 0) > 1) {
    const { data: pastOrders } = await supabase
      .from('orders')
      .select('total_price')
      .eq('customer_id', customer.id)
      .neq('id', orderId)
      .limit(20)
    if (pastOrders && pastOrders.length > 0) {
      averageOrderValue = pastOrders.reduce((sum, o) => sum + (o.total_price ?? 0), 0) / pastOrders.length
    }
  }

  // 5. Preparar productos
  const products = order.order_items.map((item: any) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    cost_price: item.products?.cost_price ?? 0,
  }))

  // 6. Calcular score base con todas las señales nuevas
  const riskInput = {
    customer: {
      total_orders:            customer?.total_orders    ?? 0,
      total_delivered:         customer?.total_delivered ?? 0,
      total_cancelled:         customer?.total_cancelled ?? 0,
      total_returned:          customer?.total_returned  ?? 0,
      is_new:                  !customer || customer.total_orders === 0,
      average_order_value:     averageOrderValue,
      first_name:              decryptedFirstName,
      last_name:               decryptedLastName,
      recent_orders_last_24h:  recentOrdersLast24h,
      phone_negative_history:  phoneNegativeHistory,
      address_negative_history: addressNegativeHistory,
    },
    order: {
      total_price:      order.total_price,
      phone:            decryptedPhone,
      shipping_address: decryptedAddress,
      created_at:       order.created_at,
    },
    products,
  }

  const baseResult = calculateBaseRisk(riskInput)

  // 7. Si no hay que correr IA → guardar solo resultado de reglas
  if (!runAI) {
    await saveAnalysis(orderId, order.account_id, {
      base_score:        baseResult.base_score,
      ai_score:          0,
      final_score:       baseResult.base_score,
      risk_level:        baseResult.risk_level,
      summary:           'Análisis de reglas actualizado',
      human_explanation: null,
      recommendation:    null,
      customer_message:  null,
      tags:              baseResult.signals.map(s => s.tag),
      tagSource:         'rules',
    })
    return
  }

  // 8. Verificar saldo
  const hasFunds = await hasBalance(order.account_id, cost)
  if (!hasFunds) {
    await saveAnalysis(orderId, order.account_id, {
      base_score:        baseResult.base_score,
      ai_score:          0,
      final_score:       baseResult.base_score,
      risk_level:        baseResult.risk_level,
      summary:           'Análisis básico — saldo insuficiente',
      human_explanation: null,
      recommendation:    null,
      customer_message:  null,
      tags:              baseResult.signals.map(s => s.tag),
      tagSource:         'rules',
    })
    return
  }

  // 9. Cobrar
  await deductBalance(
    order.account_id,
    cost,
    'order_analysis_charge',
    `${isManualReanalysis ? 'Reanálisis IA' : 'Análisis IA'} pedido ${order.order_number ?? order.id}`,
    { order_id: orderId }
  )

  // 10. Marcar ai_charged solo en el primer análisis
  if (!alreadyAnalyzed) {
    await supabase.from('orders').update({ ai_charged: true }).eq('id', orderId)
  }

  // 11. Llamar a la IA
  const aiInput = {
    order: {
      id:               order.id,
      order_number:     order.order_number,
      total_price:      order.total_price,
      status:           order.status,
      phone:            decryptedPhone,
      shipping_address: decryptedAddress,
      notes:            order.notes,
    },
    customer: customer ? {
      first_name:      decryptedFirstName,
      last_name:       decryptedLastName,
      total_orders:    customer.total_orders,
      total_delivered: customer.total_delivered,
      total_cancelled: customer.total_cancelled,
      total_returned:  customer.total_returned,
    } : null,
    products,
    base_score:   baseResult.base_score,
    risk_signals: baseResult.signals.map(s => s.tag),
  }

  const aiResult = await analyzeOrderWithAI(aiInput)

  // 12. Guardar análisis completo
  await saveAnalysis(orderId, order.account_id, {
    base_score:        baseResult.base_score,
    ai_score:          aiResult.ai_score,
    final_score:       aiResult.final_score,
    risk_level:        aiResult.risk_level,
    summary:           aiResult.summary,
    human_explanation: aiResult.human_explanation,
    recommendation:    aiResult.recommendation,
    customer_message:  aiResult.customer_message,
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

  await supabase.from('order_risk_analyses').upsert({
    order_id:          orderId,
    account_id:        accountId,
    risk_score:        data.final_score,
    risk_level:        data.risk_level as any,
    base_score:        data.base_score,
    ai_score:          data.ai_score,
    summary:           data.summary,
    human_explanation: data.human_explanation,
    recommendation:    data.recommendation,
    customer_message:  data.customer_message,
    analysed_at:       new Date().toISOString(),
  }, { onConflict: 'order_id' })

  await supabase.from('order_risk_tags').delete().eq('order_id', orderId)

  if (data.tags.length > 0) {
    const uniqueTags = [...new Set(data.tags)]
    await supabase.from('order_risk_tags').insert(
      uniqueTags.map(tag => ({
        order_id:   orderId,
        account_id: accountId,
        tag,
        source:     data.tagSource,
      }))
    )
  }
}