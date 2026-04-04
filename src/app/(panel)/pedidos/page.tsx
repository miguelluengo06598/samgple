import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import PedidosClient from './pedidos-client'

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()

  const { data: accountUser } = await admin
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) redirect('/login')

  const { data: orders } = await admin
    .from('orders')
    .select(`
      id, order_number, status, call_status, call_attempts,
      call_summary, total_price, phone, shipping_address,
      created_at, last_call_at, next_call_at,
      customers(first_name, last_name, phone, email),
      order_items(name, quantity, price),
      order_risk_analyses(risk_score, ai_score, base_score, risk_level, summary, human_explanation, recommendation)
    `)
    .eq('account_id', accountUser.account_id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <PedidosClient
      initialOrders={orders ?? []}
      accountId={accountUser.account_id}
    />
  )
}