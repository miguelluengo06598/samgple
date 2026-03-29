import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
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

  const { data: order } = await adminSupabase
    .from('orders')
    .select(`
      *,
      customers (*),
      order_items (*, products (*)),
      order_risk_analyses (*),
      order_risk_tags (tag, source),
      order_status_history (from_status, to_status, changed_by, note, created_at)
    `)
    .eq('id', params.id)
    .eq('account_id', accountUser.account_id)
    .single()

  if (!order) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ order })
}