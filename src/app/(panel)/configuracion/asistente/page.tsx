import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import AsistenteClient from './asistente-client'

export default async function AsistentePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()

  const { data: config } = await admin
    .from('vapi_configs')
    .select('*')
    .eq('account_id', accountUser!.account_id)
    .single()

  return <AsistenteClient initialConfig={config} />
}