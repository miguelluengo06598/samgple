import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import FinanzasClient from './finanzas-client'

export default async function FinanzasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users').select('account_id').eq('user_id', user!.id).single()

  const accountId = accountUser!.account_id

  const { data: wallet } = await adminSupabase
    .from('wallets').select('balance').eq('account_id', accountId).single()

  return <FinanzasClient accountId={accountId} walletBalance={wallet?.balance ?? 0} />
}