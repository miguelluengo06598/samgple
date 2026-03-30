import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data: threads } = await admin
    .from('support_threads')
    .select('*, support_messages(*)')
    .eq('account_id', accountUser.account_id)
    .order('updated_at', { ascending: false })

  return NextResponse.json({ threads: threads ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { subject, message } = await request.json()

  const { data: thread } = await admin
    .from('support_threads')
    .insert({ account_id: accountUser.account_id, subject })
    .select().single()

  await admin.from('support_messages').insert({
    thread_id: thread!.id,
    account_id: accountUser.account_id,
    sender: 'client',
    content: message,
  })

  return NextResponse.json({ thread })
}