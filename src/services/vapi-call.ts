import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasBalance, deductBalance } from '@/services/wallet'
import { decryptDet, decrypt } from '@/services/crypto'

export const CALL_COST_PER_MIN = 0.22
export const CALL_COST_FAILED  = 0.05
export const MAX_CALL_COST     = 2.00

interface InitiateCallParams {
  accountId: string
  orderId:   string
  admin:     ReturnType<typeof createAdminClient>
}

export async function initiateVapiCall({ accountId, orderId, admin }: InitiateCallParams) {
  if (!process.env.VAPI_API_KEY || !process.env.VAPI_ASSISTANT_ID) {
    return NextResponse.json({ error: 'VAPI no configurado en el servidor' }, { status: 500 })
  }

  const { data: vapiConfig } = await admin
    .from('vapi_configs')
    .select('vapi_phone_number_id, assistant_name, active')
    .eq('account_id', accountId)
    .single()

  if (!vapiConfig?.vapi_phone_number_id) {
    return NextResponse.json(
      { error: 'Número de teléfono no configurado. Ve a Configuración → Asistente IA' },
      { status: 400 }
    )
  }

  if (!vapiConfig.active) {
    return NextResponse.json(
      { error: 'El asistente está inactivo. Actívalo en Configuración → Asistente IA' },
      { status: 400 }
    )
  }

  const { data: order } = await admin
    .from('orders')
    .select(`
      *,
      customers(*),
      order_items(name, quantity, price),
      stores(name)
    `)
    .eq('id', orderId)
    .eq('account_id', accountId)
    .single()

  if (!order) return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })

  // Desencriptar teléfono
  const rawPhone = order.phone ?? order.customers?.phone
  const phone    = decryptDet(rawPhone)
  if (!phone) return NextResponse.json({ error: 'El pedido no tiene teléfono' }, { status: 400 })

  const hasFunds = await hasBalance(accountId, CALL_COST_PER_MIN)
  if (!hasFunds) {
    return NextResponse.json(
      { error: 'Saldo insuficiente. Necesitas al menos 0.22 tokens' },
      { status: 402 }
    )
  }

  // Formatear teléfono a E.164
  const cleanPhone = phone.replace(/\D/g, '')
  let phoneE164: string
  if (cleanPhone.startsWith('34') && cleanPhone.length === 11) {
    phoneE164 = `+${cleanPhone}`
  } else if (cleanPhone.length === 9) {
    phoneE164 = `+34${cleanPhone}`
  } else {
    phoneE164 = `+${cleanPhone}`
  }

  // Desencriptar datos del cliente
  const customerFirstName = decrypt(order.customers?.first_name) ?? ''
  const customerLastName  = decrypt(order.customers?.last_name)  ?? ''
  const customerName      = customerFirstName || 'Cliente'
  const storeName         = order.stores?.name ?? 'nuestra tienda'
  const orderItems        = order.order_items?.map((i: any) => i.name).join(', ') ?? 'tu pedido'
  const orderAmount       = String(order.total_price ?? 0)
  const orderNumber       = String(order.order_number ?? order.id.slice(0, 8))
  const orderAddress      = order.shipping_address?.address1
    ? `${decrypt(order.shipping_address.address1) ?? ''}${order.shipping_address.city ? ', ' + order.shipping_address.city : ''}`
    : 'tu dirección'

  const vapiRes = await fetch('https://api.vapi.ai/call', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
    },
    body: JSON.stringify({
      assistantId:   process.env.VAPI_ASSISTANT_ID,
      phoneNumberId: vapiConfig.vapi_phone_number_id,
      customer: {
        number: phoneE164,
        name:   `${customerFirstName} ${customerLastName}`.trim(),
      },
      assistantOverrides: {
        variableValues: {
          customerName,
          storeName,
          orderItems,
          orderAddress,
          orderAmount,
        },
      },
      metadata: {
        order_id:   order.id,
        account_id: accountId,
      },
    }),
  })

  if (!vapiRes.ok) {
    const err = await vapiRes.text()
    console.error('VAPI error:', err)

    await admin.from('call_logs').insert({
      account_id:   accountId,
      order_id:     order.id,
      vapi_call_id: null,
      status:       'failed',
      cost_tokens:  CALL_COST_FAILED,
      ended_reason: `vapi_error: ${err.slice(0, 200)}`,
      started_at:   new Date().toISOString(),
      ended_at:     new Date().toISOString(),
    })

    await deductBalance(
      accountId,
      CALL_COST_FAILED,
      'call_charge',
      `Llamada fallida pedido ${orderNumber}`,
      { order_id: orderId }
    )

    await admin.from('orders').update({
      call_attempts: (order.call_attempts ?? 0) + 1,
      last_call_at:  new Date().toISOString(),
      call_status:   'no_answer',
    }).eq('id', order.id)

    return NextResponse.json({ error: 'Error iniciando llamada con VAPI' }, { status: 500 })
  }

  const vapiCall = await vapiRes.json()

  await admin.from('call_logs').insert({
    account_id:   accountId,
    order_id:     order.id,
    vapi_call_id: vapiCall.id,
    status:       'initiated',
    started_at:   new Date().toISOString(),
  })

  await admin.from('orders').update({
    call_status:   'calling',
    call_attempts: (order.call_attempts ?? 0) + 1,
    last_call_at:  new Date().toISOString(),
    next_call_at:  null,
  }).eq('id', order.id)

  return NextResponse.json({ ok: true, call_id: vapiCall.id })
}