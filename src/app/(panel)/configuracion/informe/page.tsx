import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InformeClient from './informe-client'

export default async function InformePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <InformeClient />
}