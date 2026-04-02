import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import SoporteClient from './soporte-client'

export default async function SoportePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const { data: threads } = await admin
    .from('support_threads')
    .select(`*, support_messages(*)`)
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })

  return <SoporteClient threads={threads ?? []} accountId={accountId} />
}