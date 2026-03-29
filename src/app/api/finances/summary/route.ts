import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { searchParams } = request.nextUrl
  const filter = searchParams.get('filter') ?? 'week'

  let fromDate = new Date()
  if (filter === 'today') fromDate.setHours(0, 0, 0, 0)
  else if (filter === 'week') fromDate.setDate(fromDate.getDate() - 7)
  else if (filter === 'month') { fromDate.setDate(1); fromDate.setHours(0, 0, 0, 0) }
  else fromDate = new Date('2020-01-01')

  const { data: delivered } = await adminSupabase
    .from('orders')
    .select('total_price')
    .eq('account_id', accountUser.account_id)
    .eq('status', 'entregado')
    .gte('updated_at', fromDate.toISOString())

  const total_ingresos = delivered?.reduce((s, o) => s + Number(o.total_price), 0) ?? 0

  return NextResponse.json({
    total_ingresos,
    delivered_count: delivered?.length ?? 0,
  })
}