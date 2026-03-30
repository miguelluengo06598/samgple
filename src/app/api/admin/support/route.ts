import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { data } = await admin
    .from('support_threads')
    .select('*, support_messages(*), accounts(name, email)')
    .order('updated_at', { ascending: false })
  return NextResponse.json({ threads: data ?? [] })
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { thread_id, account_id, content, status } = await request.json()

  await admin.from('support_messages').insert({ thread_id, account_id, sender: 'admin', content })
  if (status) await admin.from('support_threads').update({ status, updated_at: new Date().toISOString() }).eq('id', thread_id)
  else await admin.from('support_threads').update({ updated_at: new Date().toISOString() }).eq('id', thread_id)

  return NextResponse.json({ ok: true })
}