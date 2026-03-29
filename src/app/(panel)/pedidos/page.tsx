import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import PedidosStack from './pedidos-stack'

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user!.id)
    .single()

  const now = new Date().toISOString()

  const { data: orders } = await adminSupabase
    .from('orders')
    .select(`
      id, order_number, status, total_price, phone, shipping_address,
      created_at, next_reappear_at,
      customers (first_name, last_name, total_orders),
      order_items (name, quantity),
      order_risk_analyses (risk_score, risk_level, summary),
      order_risk_tags (tag)
    `)
    .eq('account_id', accountUser!.account_id)
    .not('status', 'in', '("entregado","cancelado")')
    .or(`next_reappear_at.is.null,next_reappear_at.lte.${now}`)
    .order('created_at', { ascending: false })
    .limit(50)

  return <PedidosStack initialOrders={orders ?? []} />
}