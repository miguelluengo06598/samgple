import PreciosClient from './precios-client'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function PreciosPage() {
  const admin = createAdminClient()
  const { data: packs } = await admin
    .from('token_packs')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  return <PreciosClient packs={packs ?? []} />
}