import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasBalance } from '@/services/wallet'
import { initiateVapiCall } from '@/services/vapi-call'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { order_id } = await request.json()
  if (!order_id) return NextResponse.json({ error: 'order_id requerido' }, { status: 400 })

  const { data: order } = await admin
    .from('orders')
    .select('id, call_status, call_attempts')
    .eq('id', order_id)
    .eq('account_id', accountUser.account_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

  const hasFunds = await hasBalance(accountUser.account_id, 0.22)
  if (!hasFunds) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })

  // Resetear estado antes de reintentar
  await admin.from('orders').update({
    call_status:  'pending',
    next_call_at: null,
  }).eq('id', order_id)

  return initiateVapiCall({ accountId: accountUser.account_id, orderId: order_id, admin })
}