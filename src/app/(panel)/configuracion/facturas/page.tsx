import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import FacturasClient from './facturas-client'

export default async function FacturasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  const accountId = accountUser!.account_id

  const { data: invoices } = await admin.from('invoice_requests').select('*').eq('account_id', accountId).order('created_at', { ascending: false })

  return <FacturasClient invoices={invoices ?? []} accountId={accountId} />
}