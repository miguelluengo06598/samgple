import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { data } = await admin
    .from('invoice_requests')
    .select('*, accounts(name, email)')
    .order('created_at', { ascending: false })
  return NextResponse.json({ invoices: data ?? [] })
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { id, status } = await request.json()
  await admin.from('invoice_requests').update({ status }).eq('id', id)
  return NextResponse.json({ ok: true })
}