import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasBalance, deductBalance } from '@/services/wallet'

const CALL_COST_PER_MIN = 0.22
const CALL_COST_FAILED  = 0.05

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

  // Cargar configuración VAPI del cliente
  const { data: vapiConfig } = await admin
    .from('vapi_configs')
    .select('*')
    .eq('account_id', accountUser.account_id)
    .single()

  if (!vapiConfig?.vapi_api_key) {
    return NextResponse.json({ error: 'VAPI no configurado. Ve a Configuración → Asistente IA' }, { status: 400 })
  }

  if (!vapiConfig.active) {
    return NextResponse.json({ error: 'El asistente está inactivo. Actívalo en Configuración → Asistente IA' }, { status: 400 })
  }

  // Cargar pedido completo
  const { data: order } = await admin
    .from('orders')
    .select(`
      *,
      customers(*),
      order_items(name, quantity, price)
    `)
    .eq('id', order_id)
    .eq('account_id', accountUser.account_id)
    .single()

  if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

  const phone = order.phone ?? order.customers?.phone
  if (!phone) return NextResponse.json({ error: 'El pedido no tiene teléfono' }, { status: 400 })

  // Verificar saldo mínimo para 1 minuto
  const hasFunds = await hasBalance(accountUser.account_id, CALL_COST_PER_MIN)
  if (!hasFunds) {
    return NextResponse.json({ error: 'Saldo insuficiente. Necesitas al menos 0.22 tokens' }, { status: 402 })
  }

  // Limpiar y formatear teléfono a E.164
  const cleanPhone = phone.replace(/\D/g, '')
  let phoneE164: string
  if (cleanPhone.startsWith('34') && cleanPhone.length === 11) {
    phoneE164 = `+${cleanPhone}`
  } else if (cleanPhone.length === 9) {
    phoneE164 = `+34${cleanPhone}`
  } else {
    phoneE164 = `+${cleanPhone}`
  }

  // Personalizar mensaje de bienvenida con variables del pedido
  const customerName = order.customers?.first_name ?? 'Cliente'
  const productName = order.order_items?.[0]?.name ?? 'tu pedido'
  const orderTotal = `${order.total_price}€`
  const orderNumber = order.order_number ?? order.id.slice(0, 8)
  const companyName = vapiConfig.company_name ?? 'nuestra tienda'

  const defaultWelcome = `Hola, ¿hablo con ${customerName}?`
  const welcomeMessage = (vapiConfig.welcome_message ?? defaultWelcome)
    .replace(/\{customer_name\}/g, customerName)
    .replace(/\{product_name\}/g, productName)
    .replace(/\{order_total\}/g, orderTotal)
    .replace(/\{order_number\}/g, orderNumber)
    .replace(/\{company_name\}/g, companyName)

  // Iniciar llamada con VAPI
  const vapiRes = await fetch('https://api.vapi.ai/call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${vapiConfig.vapi_api_key}`,
    },
    body: JSON.stringify({
      assistantId: vapiConfig.vapi_assistant_id,
      phoneNumberId: vapiConfig.vapi_phone_number_id,
      customer: {
        number: phoneE164,
        name: `${order.customers?.first_name ?? ''} ${order.customers?.last_name ?? ''}`.trim(),
      },
      assistantOverrides: {
        variableValues: {
        customerName:   customerName,
        customer_name:  customerName,
        storeName:      companyName,
        company_name:   companyName,
        orderItems:     productName,
        product_name:   productName,
        orderAmount:    String(order.total_price),
        order_total:    orderTotal,
        orderAddress:   order.shipping_address?.address1
          ? `${order.shipping_address.address1}${order.shipping_address.city ? ', ' + order.shipping_address.city : ''}`
          : 'tu dirección',
        orderNumber:    String(orderNumber),
        order_number:   String(orderNumber),
        assistant_name: vapiConfig.assistant_name ?? 'Sara',
        },
      },
      metadata: {
        order_id: order.id,
        account_id: accountUser.account_id,
      },
    }),
  })

  if (!vapiRes.ok) {
    const err = await vapiRes.text()
    console.error('VAPI error:', err)

    // Cobrar llamada fallida
    await deductBalance(
      accountUser.account_id,
      CALL_COST_FAILED,
      'call_charge',
      `Llamada fallida pedido ${orderNumber}`,
      { order_id }
    )

    // Actualizar intento fallido
    await admin.from('orders').update({
      call_attempts: (order.call_attempts ?? 0) + 1,
      last_call_at: new Date().toISOString(),
      call_status: 'no_answer',
    }).eq('id', order.id)

    return NextResponse.json({ error: 'Error iniciando llamada con VAPI' }, { status: 500 })
  }

  const vapiCall = await vapiRes.json()

  // Registrar en call_logs
  await admin.from('call_logs').insert({
    account_id: accountUser.account_id,
    order_id: order.id,
    vapi_call_id: vapiCall.id,
    status: 'initiated',
    started_at: new Date().toISOString(),
  })

  // Actualizar estado del pedido
  await admin.from('orders').update({
    call_status: 'calling',
    call_attempts: (order.call_attempts ?? 0) + 1,
    last_call_at: new Date().toISOString(),
    next_call_at: null,
  }).eq('id', order.id)

  return NextResponse.json({ ok: true, call_id: vapiCall.id })
}