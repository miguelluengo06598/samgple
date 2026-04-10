import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { hasBalance, deductBalance } from '@/services/wallet'

const CALL_COST_INITIAL  = 0.5
const CALL_COST_RETRY    = 0.25

async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
  } catch (e) {
    console.error('getAuthUser error:', e)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const admin = createAdminClient()
    const body = await request.json()
    const { order_id, notes } = body

    if (!order_id) return NextResponse.json({ error: 'Falta order_id' }, { status: 400 })

    // Obtener cuenta por email
    const { data: account, error: accError } = await admin
      .from('accounts')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!account) return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 403 })

    // Verificar que el pedido pertenece a la cuenta
    const { data: order, error: orderError } = await admin
      .from('orders')
      .select('id, call_status, account_id, order_number')
      .eq('id', order_id)
      .eq('account_id', account.id)
      .single()

    if (orderError || !order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

    // Evitar duplicados
    const { data: existing } = await admin
      .from('call_requests')
      .select('id')
      .eq('order_id', order_id)
      .eq('status', 'pending')
      .maybeSingle()

    if (existing) return NextResponse.json({ error: 'Ya existe una solicitud pendiente' }, { status: 409 })

    // Determinar si es rellamada o primera llamada
    const isRetry = order.call_status === 'no_answer'
    const cost    = isRetry ? CALL_COST_RETRY : CALL_COST_INITIAL

    // Verificar saldo
    const hasFunds = await hasBalance(account.id, cost)
    if (!hasFunds) {
      return NextResponse.json({
        error: `Saldo insuficiente (${cost} tokens necesarios)`,
      }, { status: 402 })
    }

    // Crear solicitud
    const { data: callRequest, error: insertError } = await admin
      .from('call_requests')
      .insert({
        order_id,
        account_id: account.id,
        notes:      notes ?? null,
        status:     'pending',
        is_retry:   isRetry,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creando call_request:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Cobrar tokens
    await deductBalance(
      account.id,
      cost,
      'call_request_charge',
      `${isRetry ? 'Rellamada' : 'Llamada'} pedido ${order.order_number ?? order_id}`,
      { order_id, call_request_id: callRequest.id, is_retry: isRetry }
    )

    // Actualizar call_status del pedido
    await admin
      .from('orders')
      .update({ call_status: 'pending' })
      .eq('id', order_id)

    return NextResponse.json({ ok: true, call_request: callRequest }, { status: 201 })

  } catch (e: any) {
    console.error('POST /api/call-requests crash:', e)
    return NextResponse.json({ error: e?.message ?? 'Error interno' }, { status: 500 })
  }
}