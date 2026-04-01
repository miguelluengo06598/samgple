import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const filter = request.nextUrl.searchParams.get('filter') ?? 'week'

  const now = new Date()
  let from: Date
  if (filter === 'today') {
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  } else if (filter === 'week') {
    from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  } else {
    from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }

  const { data: orders } = await admin
    .from('orders')
    .select('id, order_number, total_price, call_status, status, created_at, customers(first_name, last_name)')
    .eq('account_id', accountUser.account_id)
    .gte('created_at', from.toISOString())
    .order('created_at', { ascending: false })

  const all            = orders ?? []
  const confirmed      = all.filter(o => o.call_status === 'confirmed')
  const pending        = all.filter(o => o.call_status === 'pending' || o.call_status === 'calling')
  const no_answer      = all.filter(o => o.call_status === 'no_answer')
  const cancelled      = all.filter(o => o.call_status === 'cancelled')
  const called         = all.filter(o => o.call_status !== 'pending')

  const total_ingresos    = confirmed.reduce((s, o) => s + Number(o.total_price), 0)
  const total_pendiente   = pending.reduce((s, o) => s + Number(o.total_price), 0)
  const confirmation_rate = called.length > 0 ? Math.round((confirmed.length / called.length) * 100) : 0
  const delivered         = all.filter(o => o.status === 'entregado')
  const delivery_rate     = confirmed.length > 0 ? Math.round((delivered.length / confirmed.length) * 100) : 0

  return NextResponse.json({
    total_ingresos,
    total_pendiente,
    confirmed_count:    confirmed.length,
    pending_count:      pending.length,
    no_answer_count:    no_answer.length,
    cancelled_count:    cancelled.length,
    total_calls:        called.length,
    confirmation_rate,
    delivery_rate,
    recent_orders:      all.slice(0, 15),
  })
}