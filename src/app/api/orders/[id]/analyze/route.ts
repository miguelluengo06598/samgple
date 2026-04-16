import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { analyzeOrder } from '@/services/order-analysis'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data: order } = await admin
    .from('orders')
    .select('account_id, ai_charged')
    .eq('id', id)
    .single()
  if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  if (order.account_id !== accountUser.account_id) {
    return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
  }

  // Determinar si es reanálisis manual
  const body = await request.json().catch(() => ({}))
  const isManualReanalysis = body.manual === true

  try {
    await analyzeOrder(id, { isManualReanalysis })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}