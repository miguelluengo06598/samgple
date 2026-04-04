import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { decryptOrders } from '@/services/crypto'

/**
 * GET /api/orders/[id]
 *
 * Devuelve un pedido completo con datos desencriptados.
 * Lo usan los canales Realtime de pedidos-client.tsx para refrescar
 * un pedido cuando llega un INSERT o UPDATE — así el cliente nunca
 * toca datos encriptados directamente.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data: order } = await admin
    .from('orders')
    .select(`
      id, order_number, status, call_status, call_attempts,
      call_summary, total_price, phone, shipping_address,
      created_at, last_call_at, next_call_at,
      customers(first_name, last_name, phone, email),
      order_items(name, quantity, price)
    `)
    .eq('id', params.id)
    .eq('account_id', accountUser.account_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

  const { data: analyses } = await admin
    .from('order_risk_analyses')
    .select('order_id, risk_score, ai_score, base_score, risk_level, summary, human_explanation, recommendation')
    .eq('order_id', params.id)

  const [decrypted] = decryptOrders([{
    ...order,
    order_risk_analyses: analyses ?? [],
  }])

  return NextResponse.json({ order: decrypted })
}