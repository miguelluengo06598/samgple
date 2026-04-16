/**
 * POST /api/webhooks/external/orders
 *
 * Webhook para recibir pedidos de tiendas externas (no Shopify).
 * Autentica cada petición con dos mecanismos:
 *   1. Token de tienda   → identifica qué tienda envía el pedido
 *   2. Firma HMAC-SHA256 → verifica que el cuerpo no ha sido alterado
 *
 * ─── Cómo debe firmar la tienda externa ─────────────────────────────────────
 *
 *   const body = JSON.stringify(orderPayload)
 *   const hmac = crypto
 *     .createHmac('sha256', TU_SECRET)
 *     .update(body, 'utf8')
 *     .digest('base64')
 *
 *   fetch('https://tu-app.com/api/webhooks/external/orders', {
 *     method:  'POST',
 *     headers: {
 *       'Content-Type':  'application/json',
 *       'x-store-token': TU_TOKEN,
 *       'x-hmac-sha256': hmac,
 *     },
 *     body,
 *   })
 *
 * ─── Respuestas ─────────────────────────────────────────────────────────────
 *   200 { ok: true, orderId: '...' }  — Pedido procesado correctamente
 *   401 { error: '...' }              — Token inválido o firma HMAC incorrecta
 *   500 { error: '...' }              — Error interno
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { decrypt } from '@/services/crypto'
import { syncExternalOrder } from '@/services/external-sync'

/**
 * Verifica la firma HMAC-SHA256 usando comparación en tiempo constante
 * para evitar ataques de temporización (timing attacks).
 */
function verifyHmac(body: string, secret: string, hmacHeader: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')
  try {
    // timingSafeEqual requiere buffers del mismo tamaño
    const a = Buffer.from(expected)
    const b = Buffer.from(hmacHeader)
    if (a.length !== b.length) return false
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  // Leer el cuerpo como texto crudo ANTES de parsearlo,
  // igual que Shopify: la firma se calcula sobre el JSON en bruto.
  const body  = await request.text()
  const token = request.headers.get('x-store-token') ?? ''
  const hmac  = request.headers.get('x-hmac-sha256') ?? ''

  if (!token || !hmac) {
    return NextResponse.json(
      { error: 'Cabeceras requeridas: x-store-token y x-hmac-sha256' },
      { status: 401 }
    )
  }

  const admin = createAdminClient()

  // Buscar la tienda por token (lookup directo, índice en la columna)
  const { data: store } = await admin
    .from('external_stores')
    .select('id, account_id, secret, active')
    .eq('token', token)
    .single()

  if (!store) {
    // Respuesta genérica para no revelar si el token existe o no
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  if (!store.active) {
    return NextResponse.json({ error: 'Tienda desactivada' }, { status: 401 })
  }

  // Descifrar el secreto almacenado y verificar la firma HMAC
  const secret = decrypt(store.secret)
  if (!secret || !verifyHmac(body, secret, hmac)) {
    return NextResponse.json({ error: 'Firma HMAC no válida' }, { status: 401 })
  }

  try {
    const payload = JSON.parse(body)

    if (!payload.id) {
      return NextResponse.json(
        { error: 'El payload debe incluir un campo "id" único' },
        { status: 400 }
      )
    }

    const result = await syncExternalOrder(payload, store.id, store.account_id)
    console.log(`Pedido externo sincronizado: ${result.orderId} (tienda: ${store.id})`)

    return NextResponse.json({ ok: true, orderId: result.orderId })
  } catch (error) {
    console.error('Error procesando webhook externo:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
