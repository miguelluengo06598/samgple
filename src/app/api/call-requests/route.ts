import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Helper para obtener el usuario autenticado
async function getAuthUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  )
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function POST(request: NextRequest) {
  // 1. Verificar sesión activa
  const user = await getAuthUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { order_id, notes } = await request.json()

  if (!order_id) {
    return NextResponse.json({ error: 'Falta order_id' }, { status: 400 })
  }

  // 2. Verificar que el pedido existe Y pertenece a la cuenta del usuario
    const { data: account } = await admin
    .from('accounts')
    .select('id')
    .eq('email', user.email)
    .single()

  if (!account) {
    return NextResponse.json({ error: 'Cuenta no encontrada' }, { status: 403 })
  }

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, call_status, account_id')
    .eq('id', order_id)
    .eq('account_id', account.id) // 🔒 seguridad: solo sus pedidos
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  // 3. Evitar duplicados: si ya hay solicitud pendiente, no crear otra
  const { data: existing } = await admin
    .from('call_requests')
    .select('id')
    .eq('order_id', order_id)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'Ya existe una solicitud pendiente para este pedido' },
      { status: 409 }
    )
  }

  // 4. Crear la solicitud
  const { data: callRequest, error: insertError } = await admin
    .from('call_requests')
    .insert({
      order_id,
      account_id: account.id,
      notes: notes ?? null,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (insertError) {
    console.error('Error creando call_request:', insertError)
    return NextResponse.json({ error: 'Error al crear la solicitud' }, { status: 500 })
  }

  // 5. Actualizar call_status del pedido
  await admin
    .from('orders')
    .update({ call_status: 'pending' })
    .eq('id', order_id)

  return NextResponse.json({ ok: true, call_request: callRequest }, { status: 201 })
}