import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { addBalance } from '@/services/wallet'
import crypto from 'crypto'

export const runtime = 'nodejs'

// Variant ID → tokens que se añaden
const PACK_TOKENS: Record<string, number> = {
  '1499184': 20,   // Pack Starter — 19.99€
  '1499070': 44,   // Pack Pro    — 39.99€
  '1499072': 100,  // Pack Business — 89.99€
}

const PACK_NAMES: Record<string, string> = {
  '1499184': 'Pack Starter (20 tokens)',
  '1499070': 'Pack Pro (44 tokens)',
  '1499072': 'Pack Business (100 tokens)',
}

function verifySignature(body: string, signature: string): boolean {
  if (!process.env.LEMONSQUEEZY_WEBHOOK_SECRET) return false
  try {
    const hmac   = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET)
    const digest = hmac.update(body).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('x-signature') ?? ''
  const eventName = request.headers.get('x-event-name') ?? ''

  if (!verifySignature(body, signature)) {
    console.error('[LemonSqueezy] Firma inválida')
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  let payload: any
  try { payload = JSON.parse(body) }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  // Solo procesamos order_created
  if (eventName !== 'order_created') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const order = payload.data
  if (!order) return NextResponse.json({ ok: true })

  // Verificar que el pedido está pagado
  const status = order.attributes?.status
  if (status !== 'paid') {
    console.log(`[LemonSqueezy] Pedido no pagado: ${status}`)
    return NextResponse.json({ ok: true, skipped: true })
  }

  // Obtener el variant_id del primer item
  const firstItem    = order.attributes?.first_order_item
  const variantId    = String(firstItem?.variant_id ?? '')
  const tokens       = PACK_TOKENS[variantId]
  const packName     = PACK_NAMES[variantId]

  if (!tokens) {
    console.error(`[LemonSqueezy] Variant ID desconocido: ${variantId}`)
    return NextResponse.json({ ok: true, skipped: true })
  }

  // Obtener email del comprador
  const email = order.attributes?.user_email ?? ''
  if (!email) {
    console.error('[LemonSqueezy] Sin email en el pedido')
    return NextResponse.json({ error: 'Sin email' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Buscar usuario por email
  const { data: authUser } = await admin.auth.admin.listUsers()
  const user = authUser?.users?.find(u => u.email === email)

  if (!user) {
    console.error(`[LemonSqueezy] Usuario no encontrado: ${email}`)
    // Guardar en tabla de compras pendientes para asignar cuando se registre
    await admin.from('pending_token_purchases').insert({
      email,
      variant_id:       variantId,
      tokens,
      lemon_order_id:   String(order.id),
      lemon_order_data: order,
    }).catch(() => null) // no crítico si falla
    return NextResponse.json({ ok: true, pending: true })
  }

  // Buscar account del usuario
  const { data: accountUser } = await admin
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) {
    console.error(`[LemonSqueezy] Sin cuenta para usuario: ${user.id}`)
    return NextResponse.json({ error: 'Sin cuenta' }, { status: 400 })
  }

  // Verificar que no se ha procesado ya este pedido (idempotencia)
  const lemonOrderId = String(order.id)
  const { data: existing } = await admin
    .from('wallet_movements')
    .select('id')
    .eq('account_id', accountUser.account_id)
    .contains('metadata', { lemon_order_id: lemonOrderId })
    .single()

  if (existing) {
    console.log(`[LemonSqueezy] Pedido ya procesado: ${lemonOrderId}`)
    return NextResponse.json({ ok: true, duplicate: true })
  }

  // Añadir tokens al wallet
  await addBalance(
    accountUser.account_id,
    tokens,
    'token_purchase',
    `Compra ${packName}`,
    {
      lemon_order_id: lemonOrderId,
      variant_id:     variantId,
      email,
    }
  )

  // Guardar registro en token_packs (historial de compras)
  await admin.from('token_packs').insert({
    account_id:     accountUser.account_id,
    variant_id:     variantId,
    tokens,
    amount_paid:    order.attributes?.total ?? 0,
    currency:       order.attributes?.currency ?? 'EUR',
    lemon_order_id: lemonOrderId,
    status:         'completed',
  }).catch(() => null) // no crítico si la tabla no existe aún

  console.log(`[LemonSqueezy] ✅ ${tokens} tokens añadidos a cuenta ${accountUser.account_id} (${email})`)
  return NextResponse.json({ ok: true, tokens_added: tokens })
}