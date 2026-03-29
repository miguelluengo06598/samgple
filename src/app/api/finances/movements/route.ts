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

  const { data: movements } = await adminSupabase
    .from('wallet_movements')
    .select('*')
    .eq('account_id', accountUser.account_id)
    .gte('created_at', fromDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(30)

  const total_ia = movements
    ?.filter(m => m.amount < 0)
    .reduce((s, m) => s + Math.abs(Number(m.amount)), 0) ?? 0

  return NextResponse.json({ items: movements ?? [], total_ia })
}