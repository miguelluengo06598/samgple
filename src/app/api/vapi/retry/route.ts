import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasBalance } from '@/services/wallet'

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

  // Verificar que el pedido pertenece a esta cuenta
  const { data: order } = await admin
    .from('orders')
    .select('id, call_status, call_attempts')
    .eq('id', order_id)
    .eq('account_id', accountUser.account_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

  // Verificar saldo
  const hasFunds = await hasBalance(accountUser.account_id, 0.22)
  if (!hasFunds) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })

  // Resetear estado para rellamar
  await admin.from('orders').update({
    call_status: 'pending',
    next_call_at: null,
  }).eq('id', order_id)

  // Llamar directamente a la lógica de call
  const callRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/call`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'cookie': request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify({ order_id }),
  })

  const data = await callRes.json()
  return NextResponse.json(data, { status: callRes.status })
}