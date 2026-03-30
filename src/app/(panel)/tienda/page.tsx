import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import TiendaClient from './tienda-client'

export default async function TiendaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users').select('account_id').eq('user_id', user!.id).single()

  const accountId = accountUser!.account_id

  const [{ data: stores }, { data: products }] = await Promise.all([
    adminSupabase.from('stores').select('*').eq('account_id', accountId),
    adminSupabase.from('products').select('*, stores(name)').eq('account_id', accountId).order('created_at', { ascending: false }),
  ])

  return <TiendaClient stores={stores ?? []} initialProducts={products ?? []} />
}