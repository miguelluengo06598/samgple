import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import ConfiguracionClient from './configuracion-client'

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user!.id).single()
  const accountId = accountUser!.account_id

  const [{ data: account }, { data: profile }, { data: wallet }, { data: stores }, { data: packs }, { data: threads }, { data: invoices }] = await Promise.all([
    admin.from('accounts').select('*').eq('id', accountId).single(),
    admin.from('account_profiles').select('*').eq('account_id', accountId).single(),
    admin.from('wallets').select('balance').eq('account_id', accountId).single(),
    admin.from('stores').select('*').eq('account_id', accountId),
    admin.from('token_packs').select('*').eq('active', true).order('price_eur'),
    admin.from('support_threads').select('*, support_messages(*)').eq('account_id', accountId).order('updated_at', { ascending: false }),
    admin.from('invoice_requests').select('*').eq('account_id', accountId).order('created_at', { ascending: false }),
  ])

  return (
    <ConfiguracionClient
      account={account}
      profile={profile}
      wallet={wallet}
      stores={stores ?? []}
      packs={packs ?? []}
      threads={threads ?? []}
      invoices={invoices ?? []}
      userId={user!.id}
    />
  )
}