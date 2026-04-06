import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Calcula y persiste el score de riesgo de un cliente
 * basándose en su historial completo de pedidos.
 * 
 * Se llama después de cada sync de pedido — no bloquea el webhook.
 * No rompe ninguna lógica existente — es puramente aditivo.
 */
export async function updateCustomerRiskScore(customerId: string): Promise<void> {
  if (!customerId) return

  const supabase = createAdminClient()

  // Cargar cliente con historial
  const { data: customer } = await supabase
    .from('customers')
    .select('id, account_id, total_orders, total_delivered, total_cancelled, total_returned')
    .eq('id', customerId)
    .single()

  if (!customer) return

  const {
    total_orders    = 0,
    total_delivered = 0,
    total_cancelled = 0,
    total_returned  = 0,
  } = customer

  // Sin historial suficiente → score neutro
  if (total_orders === 0) {
    await supabase.from('customers').update({
      risk_score:  50,
      risk_level:  'medio',
      risk_signals: ['cliente_nuevo'],
    }).eq('id', customerId)
    return
  }

  const signals: string[] = []
  let score = 0

  // ── Tasas de comportamiento ───────────────────────────────
  const deliveryRate = total_delivered / total_orders
  const cancelRate   = total_cancelled / total_orders
  const returnRate   = total_returned  / total_orders

  // Buen historial → reduce riesgo
  if (deliveryRate >= 0.9 && total_orders >= 3) {
    signals.push('cliente_excelente')
    score -= 20
  } else if (deliveryRate >= 0.75 && total_orders >= 2) {
    signals.push('cliente_fiable')
    score -= 10
  }

  // Mal historial → aumenta riesgo
  if (cancelRate > 0.5 && total_orders >= 2) {
    signals.push('cancelaciones_muy_altas')
    score += 35
  } else if (cancelRate > 0.3 && total_orders >= 2) {
    signals.push('cancelaciones_altas')
    score += 20
  }

  if (returnRate > 0.5 && total_orders >= 2) {
    signals.push('devoluciones_muy_altas')
    score += 25
  } else if (returnRate > 0.3 && total_orders >= 2) {
    signals.push('devoluciones_altas')
    score += 15
  }

  if (deliveryRate < 0.4 && total_orders >= 3) {
    signals.push('entregas_muy_bajas')
    score += 30
  } else if (deliveryRate < 0.6 && total_orders >= 3) {
    signals.push('entregas_bajas')
    score += 15
  }

  // ── Volumen de pedidos ────────────────────────────────────
  if (total_orders >= 10) {
    signals.push('cliente_recurrente')
    score -= 5
  }

  // ── Pedidos recientes con problemas ──────────────────────
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('call_status, status')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (recentOrders && recentOrders.length > 0) {
    const recentCancelled = recentOrders.filter(o =>
      o.call_status === 'cancelled' || o.status === 'cancelado'
    ).length
    const recentNoAnswer = recentOrders.filter(o =>
      o.call_status === 'no_answer'
    ).length

    if (recentCancelled >= 2) {
      signals.push('cancelaciones_recientes')
      score += 20
    }
    if (recentNoAnswer >= 3) {
      signals.push('no_contesta_recurrente')
      score += 15
    }

    // Si los últimos 3 pedidos fueron entregados → cliente muy fiable
    const recentDelivered = recentOrders
      .slice(0, 3)
      .filter(o => o.status === 'entregado').length
    if (recentDelivered === 3) {
      signals.push('ultimos_entregados')
      score -= 15
    }
  }

  // ── Normalizar 0-100 ──────────────────────────────────────
  const risk_score = Math.min(Math.max(score + 30, 0), 100) // base 30

  const risk_level =
    risk_score < 25 ? 'bajo'     :
    risk_score < 50 ? 'medio'    :
    risk_score < 75 ? 'alto'     : 'muy_alto'

  // ── Guardar en customers ──────────────────────────────────
  await supabase.from('customers').update({
    risk_score,
    risk_level,
    risk_signals: signals,
    risk_updated_at: new Date().toISOString(),
  }).eq('id', customerId)
}