import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import TiendasClient from './tiendas-client'

export default async function TiendasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  const { data: stores } = await admin.from('stores').select('*').eq('account_id', accountUser!.account_id)

  return <TiendasClient stores={stores ?? []} />
}