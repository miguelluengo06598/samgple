import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { analyzeOrder } from '@/services/order-analysis'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const orderId = params.id

  // Verificar que el pedido pertenece al account del usuario
  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) {
    return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })
  }

  const { data: order } = await adminSupabase
    .from('orders')
    .select('account_id')
    .eq('id', orderId)
    .single()

  if (!order || order.account_id !== accountUser.account_id) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  try {
    await analyzeOrder(orderId)
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Error en reanálisis:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}