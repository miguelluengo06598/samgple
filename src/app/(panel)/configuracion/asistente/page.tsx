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
    .select('vapi_phone_number_id, assistant_name, active, twilio_phone_number, twilio_account_sid, twilio_auth_token')
    .eq('account_id', accountUser!.account_id)
    .single()

  return <AsistenteClient initialConfig={config} />
}