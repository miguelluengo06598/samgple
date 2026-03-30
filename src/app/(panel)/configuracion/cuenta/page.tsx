import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import CuentaClient from './cuenta-client'

export default async function CuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const [{ data: account }, { data: profile }] = await Promise.all([
    admin.from('accounts').select('name,email').eq('id', accountId).single(),
    admin.from('account_profiles').select('timezone').eq('account_id', accountId).single(),
  ])

  return <CuentaClient account={account} profile={profile} />
}