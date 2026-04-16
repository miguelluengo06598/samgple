/**
 * src/services/external-sync.ts
 *
 * Servicio de sincronización para pedidos de tiendas externas (no Shopify).
 * Paralelo a shopify-sync.ts: normaliza el payload externo al mismo esquema
 * interno para que los pedidos se gestionen igual que los de Shopify.
 *
 * ─── Formato esperado del payload externo ───────────────────────────────────
 *
 *  POST /api/webhooks/external/orders
 *  Headers:
 *    x-store-token:  <token de 64 chars hex>
 *    x-hmac-sha256:  <base64(HMAC-SHA256(secret, body))>
 *  Body (JSON):
 *  {
 *    "id":           "string  — ID único del pedido en el sistema externo (requerido)",
 *    "order_number": "string  — Número legible, ej: '#1001' (opcional)",
 *    "total_price":  "number  — Importe total, ej: 49.99",
 *    "currency":     "string  — Código ISO, ej: 'EUR' (por defecto 'EUR')",
 *    "customer": {
 *      "id":         "string  — ID del cliente en el sistema externo (opcional)",
 *      "first_name": "string",
 *      "last_name":  "string",
 *      "email":      "string",
 *      "phone":      "string  — Con prefijo internacional, ej: '+34666123456'"
 *    },
 *    "shipping_address": {
 *      "address1":   "string",
 *      "address2":   "string  (opcional)",
 *      "city":       "string",
 *      "province":   "string  (opcional)",
 *      "country":    "string  — Código ISO, ej: 'ES'",
 *      "zip":        "string",
 *      "phone":      "string  (opcional)"
 *    },
 *    "line_items": [
 *      {
 *        "product_id": "string  (opcional)",
 *        "variant_id": "string  (opcional)",
 *        "name":       "string  — Nombre del producto (requerido)",
 *        "quantity":   "number",
 *        "price":      "number",
 *        "sku":        "string  (opcional)"
 *      }
 *    ],
 *    "notes": "string  — Notas del pedido (opcional)"
 *  }
 *
 * ─── Cómo firmar las peticiones (para la tienda externa) ────────────────────
 *
 *  import crypto from 'crypto'
 *
 *  const body    = JSON.stringify(orderPayload)
 *  const hmac    = crypto.createHmac('sha256', SECRET).update(body, 'utf8').digest('base64')
 *
 *  fetch('https://tu-app.com/api/webhooks/external/orders', {
 *    method:  'POST',
 *    headers: {
 *      'Content-Type':  'application/json',
 *      'x-store-token': TOKEN,
 *      'x-hmac-sha256': hmac,
 *    },
 *    body,
 *  })
 *
 * ─── Mapeo de campos externo → interno ──────────────────────────────────────
 *
 *  payload.id               → orders.external_order_id
 *  payload.order_number     → orders.order_number
 *  payload.total_price      → orders.total_price
 *  payload.currency         → orders.currency
 *  payload.customer.*       → customers.* (cifrado)
 *  payload.shipping_address → orders.shipping_address (cifrado parcialmente)
 *  payload.line_items.*     → order_items.* + products.*
 *  payload.notes            → orders.notes
 *  payload (completo)       → orders.raw_payload
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { analyzeOrder }        from './order-analysis'
import { updateCustomerRiskScore } from './customer-risk'
import { checkOrderLimit, incrementOrderUsage } from './subscription'
import { encryptCustomer, encryptDet, encrypt } from './crypto'

export async function syncExternalOrder(
  payload:    any,
  storeId:    string,
  accountId:  string
): Promise<{ orderId: string; accountId: string }> {
  const supabase = createAdminClient()

  // ── 0. Verificar límite de pedidos (solo para pedidos nuevos) ─────────────
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('account_id', accountId)
    .eq('external_order_id', String(payload.id))
    .single()

  const isNewOrder = !existingOrder

  if (isNewOrder) {
    const limitCheck = await checkOrderLimit(accountId)
    if (!limitCheck.allowed) {
      throw new Error(`Límite de pedidos: ${limitCheck.reason}`)
    }
  }

  // ── 1. Crear o actualizar cliente ──────────────────────────────────────────
  let customerId: string | null = null

  const c     = payload.customer ?? {}
  const phone = c.phone ?? payload.phone ?? payload.shipping_address?.phone ?? null
  const email = c.email ?? null
  const externalCustomerId = c.id ? String(c.id) : null

  if (c.first_name || c.last_name || phone || email) {
    let existingCustomer = null

    // Buscar cliente por ID externo (si la tienda lo provee)
    if (externalCustomerId) {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('account_id', accountId)
        .eq('shopify_customer_id', externalCustomerId)   // reutilizamos la columna genérica
        .single()
      existingCustomer = data
    }

    // Fallback: buscar por teléfono (mismo cliente, otra tienda externa)
    if (!existingCustomer && phone) {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('account_id', accountId)
        .eq('phone', encryptDet(phone))
        .single()
      existingCustomer = data
    }

    // Fallback: buscar por email
    if (!existingCustomer && email) {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('account_id', accountId)
        .eq('email', encryptDet(email))
        .single()
      existingCustomer = data
    }

    const encryptedFields = encryptCustomer({
      first_name: c.first_name ?? null,
      last_name:  c.last_name  ?? null,
      email,
      phone,
    })

    if (existingCustomer) {
      await supabase
        .from('customers')
        .update({
          shopify_customer_id: externalCustomerId ?? undefined,
          ...encryptedFields,
        })
        .eq('id', existingCustomer.id)
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          account_id:          accountId,
          store_id:            storeId,
          shopify_customer_id: externalCustomerId,
          ...encryptedFields,
          total_orders: 1,
        })
        .select('id')
        .single()
      customerId = newCustomer?.id ?? null
    }
  }

  // ── 2. Crear o actualizar productos ───────────────────────────────────────
  const itemsWithProductId: Array<{
    name:               string
    quantity:           number
    price:              number
    sku:                string | null
    shopify_variant_id: string | null   // columna reutilizada para variant_id externo
    product_id:         string | null
  }> = []

  for (const item of payload.line_items ?? []) {
    let productId: string | null = null

    // Si la tienda provee IDs de producto/variante, hacemos upsert
    if (item.variant_id || item.product_id) {
      const variantKey = item.variant_id
        ? String(item.variant_id)
        : `ext-${String(item.product_id)}`

      const { data: product } = await supabase
        .from('products')
        .upsert({
          account_id:         accountId,
          store_id:           storeId,
          shopify_product_id: item.product_id ? String(item.product_id) : null,
          shopify_variant_id: variantKey,
          name:               item.name ?? 'Producto sin nombre',
          sku:                item.sku ?? null,
        }, { onConflict: 'account_id,shopify_variant_id' })
        .select('id')
        .single()
      productId = product?.id ?? null
    }

    itemsWithProductId.push({
      name:               item.name ?? 'Producto sin nombre',
      quantity:           Number(item.quantity ?? 1),
      price:              parseFloat(String(item.price ?? '0')),
      sku:                item.sku ?? null,
      shopify_variant_id: item.variant_id ? String(item.variant_id) : null,
      product_id:         productId,
    })
  }

  // ── 3. Crear o actualizar pedido ──────────────────────────────────────────
  const rawAddress = payload.shipping_address ?? null

  const shippingAddress = rawAddress ? {
    ...rawAddress,
    address1: encrypt(rawAddress.address1),
    address2: encrypt(rawAddress.address2 ?? null),
    phone:    encryptDet(rawAddress.phone ?? null),
  } : null

  const orderPhone = phone
    ?? payload.phone
    ?? rawAddress?.phone
    ?? null

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .upsert({
      account_id:        accountId,
      store_id:          storeId,
      customer_id:       customerId,
      external_order_id: String(payload.id),
      order_number:      payload.order_number ?? String(payload.id),
      total_price:       parseFloat(String(payload.total_price ?? '0')),
      currency:          payload.currency ?? 'EUR',
      shipping_address:  shippingAddress,
      phone:             encryptDet(orderPhone),
      notes:             payload.notes ?? null,
      raw_payload:       payload,
    }, { onConflict: 'account_id,external_order_id' })
    .select('id')
    .single()

  if (orderError || !order) {
    throw new Error(`Error guardando pedido externo: ${orderError?.message}`)
  }

  // ── 4. Guardar order_items (solo si el pedido es nuevo) ───────────────────
  const { count } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('order_id', order.id)

  if (count === 0 && itemsWithProductId.length > 0) {
    await supabase.from('order_items').insert(
      itemsWithProductId.map(item => ({
        order_id:   order.id,
        account_id: accountId,
        ...item,
      }))
    )
  }

  // ── 5. Incrementar contador de pedidos del período ────────────────────────
  if (isNewOrder) {
    incrementOrderUsage(accountId).catch(err =>
      console.error('Error incrementando uso de pedidos:', err)
    )
  }

  // ── 5. Registrar estado inicial en historial ──────────────────────────────
  await supabase.from('order_status_history').insert({
    order_id:    order.id,
    account_id:  accountId,
    from_status: null,
    to_status:   'confirmar',
    changed_by:  'external_webhook',
  })

  // ── 6. Disparar análisis de riesgo asíncrono (no bloquea el webhook) ──────
  analyzeOrder(order.id).catch(err => {
    console.error(`Error analizando pedido externo ${order.id}:`, err)
  })

  if (customerId) {
    updateCustomerRiskScore(customerId).catch(err => {
      console.error(`Error actualizando risk score cliente ${customerId}:`, err)
    })
  }

  return { orderId: order.id, accountId }
}
