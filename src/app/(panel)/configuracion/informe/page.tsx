import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import InformeClient from './informe-client'

export default async function InformePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const { data: lastReport } = await admin
    .from('reports')
    .select('id,created_at')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return <InformeClient lastReport={lastReport ?? null} />
}