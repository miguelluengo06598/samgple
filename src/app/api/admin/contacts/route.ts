import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { data } = await admin
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json({ contacts: data ?? [] })
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id, status } = await request.json()
  const admin = createAdminClient()
  await admin.from('contact_messages').update({ status }).eq('id', id)
  return NextResponse.json({ ok: true })
}