import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect }          from 'next/navigation'
import TiendasExternasClient from './tiendas-externas-client'

export default async function TiendasExternasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  const { data: stores } = await admin
    .from('external_stores')
    .select('id, name, token, active, created_at')
    .eq('account_id', accountUser!.account_id)
    .order('created_at', { ascending: false })

  return <TiendasExternasClient stores={stores ?? []} />
}
