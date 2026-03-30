import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import TokensClient from './tokens-client'

export default async function TokensPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const [{ data: wallet }, { data: packs }] = await Promise.all([
    admin.from('wallets').select('balance').eq('account_id', accountId).single(),
    admin.from('token_packs').select('*').eq('active', true).order('price_eur'),
  ])

  return <TokensClient wallet={wallet} packs={packs ?? []} accountId={accountId} />
}