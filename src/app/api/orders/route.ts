import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const now = new Date().toISOString()

  const { data: orders } = await adminSupabase
    .from('orders')
    .select(`
      id, order_number, status, total_price, phone, shipping_address,
      created_at, next_reappear_at, ai_charged,
      customers (first_name, last_name, phone, total_orders, total_delivered),
      order_items (name, quantity, price),
      order_risk_analyses (risk_score, risk_level, summary, customer_message, recommendation),
      order_risk_tags (tag, source)
    `)
    .eq('account_id', accountUser.account_id)
    .not('status', 'in', '("entregado","cancelado")')
    .or(`next_reappear_at.is.null,next_reappear_at.lte.${now}`)
    .order('created_at', { ascending: false })
    .limit(50)

  return NextResponse.json({ orders: orders ?? [] })
}