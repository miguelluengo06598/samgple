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

  const { data } = await admin.from('invoice_requests').select('*').eq('account_id', accountUser.account_id).order('created_at', { ascending: false })
  return NextResponse.json({ invoices: data ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { period, notes } = await request.json()

  const { data } = await admin.from('invoice_requests').insert({
    account_id: accountUser.account_id,
    period: period ?? new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    notes: notes ?? null,
  }).select().single()

  return NextResponse.json({ invoice: data })
}