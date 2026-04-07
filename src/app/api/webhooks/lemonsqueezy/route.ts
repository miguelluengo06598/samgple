import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { addBalance } from '@/services/wallet'
import crypto from 'crypto'

export const runtime = 'nodejs'

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

  if (eventName !== 'order_created') {
    return NextResponse.json({ ok: true, skipped: true })
  }

  const order = payload.data
  if (!order) return NextResponse.json({ ok: true })

  const status = order.attributes?.status
  if (status !== 'paid') {
    console.log(`[LemonSqueezy] Pedido no pagado: ${status}`)
    return NextResponse.json({ ok: true, skipped: true })
  }

  const lemonOrderId = String(order.id)
  const firstItem    = order.attributes?.first_order_item
  const variantId    = String(firstItem?.variant_id ?? '')

  const admin = createAdminClient()

  // ── Idempotencia con tabla dedicada ──────────────────────
  const { data: existing } = await admin
    .from('lemon_orders_processed')
    .select('lemon_order_id')
    .eq('lemon_order_id', lemonOrderId)
    .single()

  if (existing) {
    console.log(`[LemonSqueezy] Pedido ya procesado: ${lemonOrderId}`)
    return NextResponse.json({ ok: true, duplicate: true })
  }

  // ── Buscar pack en BD por variant_id ─────────────────────
  const { data: pack } = await admin
    .from('token_packs')
    .select('tokens, name')
    .eq('variant_id', variantId)
    .eq('active', true)
    .single()

  if (!pack) {
    console.error(`[LemonSqueezy] Variant ID desconocido: ${variantId}`)
    return NextResponse.json({ ok: true, skipped: true })
  }

  const tokens   = pack.tokens
  const packName = pack.name

  // ── Email del comprador ───────────────────────────────────
  const email = order.attributes?.user_email ?? ''
  if (!email) {
    console.error('[LemonSqueezy] Sin email en el pedido')
    return NextResponse.json({ error: 'Sin email' }, { status: 400 })
  }

  // ── Buscar usuario ────────────────────────────────────────
  const { data: authUser } = await admin.auth.admin.listUsers()
  const user = authUser?.users?.find(u => u.email === email)

  if (!user) {
    console.error(`[LemonSqueezy] Usuario no encontrado: ${email}`)
    await admin.from('pending_token_purchases').insert({
      email, variant_id: variantId, tokens,
      lemon_order_id: lemonOrderId, lemon_order_data: order,
    }).catch(() => null)
    return NextResponse.json({ ok: true, pending: true })
  }

  // ── Buscar account ────────────────────────────────────────
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()

  if (!accountUser) {
    console.error(`[LemonSqueezy] Sin cuenta para usuario: ${user.id}`)
    return NextResponse.json({ error: 'Sin cuenta' }, { status: 400 })
  }

  // ── Registrar pedido como procesado ANTES de añadir tokens
  // para evitar doble procesamiento en caso de error parcial
  const { error: insertError } = await admin
    .from('lemon_orders_processed')
    .insert({
      lemon_order_id: lemonOrderId,
      account_id:     accountUser.account_id,
      tokens,
    })

  if (insertError) {
    // Si falla el insert (ej: duplicate key) → ya fue procesado
    console.log(`[LemonSqueezy] Pedido ya procesado (race condition): ${lemonOrderId}`)
    return NextResponse.json({ ok: true, duplicate: true })
  }

  // ── Añadir tokens al wallet ───────────────────────────────
  await addBalance(
    accountUser.account_id, tokens, 'token_purchase',
    `Compra ${packName}`,
    { lemon_order_id: lemonOrderId, variant_id: variantId, email }
  )

  console.log(`[LemonSqueezy] ✅ ${tokens} tokens añadidos a cuenta ${accountUser.account_id} (${email})`)
  return NextResponse.json({ ok: true, tokens_added: tokens })
}