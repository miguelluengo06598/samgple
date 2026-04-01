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
    .from('account_users').select('account_id').eq('user_id', user.id).single()

  const { data: orders } = await admin
    .from('orders')
    .select(`
      *,
      customers(first_name, last_name, phone, email),
      order_items(name, quantity, price),
      order_risk_analyses(score, recommendation)
    `)
    .eq('account_id', accountUser!.account_id)
    .order('created_at', { ascending: false })
    .limit(50)

  return <PedidosClient initialOrders={orders ?? []} accountId={accountUser!.account_id} />
}