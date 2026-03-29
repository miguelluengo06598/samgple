import { createAdminClient } from '@/lib/supabase/admin'
import { analyzeOrder } from './order-analysis'

export async function syncOrderFromWebhook(payload: any, shopDomain: string) {
  const supabase = createAdminClient()

  // 1. Encontrar la tienda
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, account_id')
    .eq('shopify_domain', shopDomain)
    .single()

  if (storeError || !store) {
    throw new Error(`Tienda no encontrada: ${shopDomain}`)
  }

  const { id: storeId, account_id: accountId } = store

  // 2. Crear o actualizar customer
  let customerId: string | null = null

  if (payload.customer || payload.phone || payload.billing_address?.phone) {
    const c = payload.customer ?? {}
    const phone = c.phone ?? payload.phone ?? payload.billing_address?.phone ?? null
    const email = c.email ?? null
    const shopifyCustomerId = c.id ? String(c.id) : null

    // Buscar cliente existente por shopify_customer_id, email o teléfono
    let existingCustomer = null

    if (shopifyCustomerId) {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('account_id', accountId)
        .eq('shopify_customer_id', shopifyCustomerId)
        .single()
      existingCustomer = data
    }

    if (!existingCustomer && phone) {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('account_id', accountId)
        .eq('phone', phone)
        .single()
      existingCustomer = data
    }

    if (!existingCustomer && email) {
      const { data } = await supabase
        .from('customers')
        .select('id')
        .eq('account_id', accountId)
        .eq('email', email)
        .single()
      existingCustomer = data
    }

    if (existingCustomer) {
      // Actualizar cliente existente
      const { data: updated } = await supabase
        .from('customers')
        .update({
          shopify_customer_id: shopifyCustomerId ?? undefined,
          first_name: c.first_name ?? undefined,
          last_name: c.last_name ?? undefined,
          phone: phone ?? undefined,
          email: email ?? undefined,
          total_orders: supabase.rpc('increment', { row_id: existingCustomer.id }) as any,
        })
        .eq('id', existingCustomer.id)
        .select('id')
        .single()
      customerId = existingCustomer.id
    } else {
      // Crear cliente nuevo
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          account_id: accountId,
          store_id: storeId,
          shopify_customer_id: shopifyCustomerId,
          first_name: c.first_name ?? null,
          last_name: c.last_name ?? null,
          email: email,
          phone: phone,
          total_orders: 1,
        })
        .select('id')
        .single()
      customerId = newCustomer?.id ?? null
    }
  }
  // 3. Crear o actualizar productos y recoger sus IDs
  const itemsWithProductId: Array<{
    name: string
    quantity: number
    price: number
    sku: string | null
    shopify_variant_id: string | null
    product_id: string | null
  }> = []

  for (const item of payload.line_items ?? []) {
    let productId: string | null = null

    if (item.variant_id) {
      const { data: product } = await supabase
        .from('products')
        .upsert({
          account_id: accountId,
          store_id: storeId,
          shopify_product_id: String(item.product_id),
          shopify_variant_id: String(item.variant_id),
          name: item.title ?? item.name ?? 'Producto sin nombre',
          sku: item.sku ?? null,
        }, {
          onConflict: 'account_id,shopify_variant_id',
        })
        .select('id')
        .single()

      productId = product?.id ?? null
    }

    itemsWithProductId.push({
      name: item.title ?? item.name ?? 'Producto sin nombre',
      quantity: item.quantity ?? 1,
      price: parseFloat(item.price ?? '0'),
      sku: item.sku ?? null,
      shopify_variant_id: item.variant_id ? String(item.variant_id) : null,
      product_id: productId,
    })
  }

  // 4. Crear o actualizar el pedido
  const shippingAddress = payload.shipping_address ?? payload.billing_address ?? null
  const phone = payload.phone
    ?? payload.customer?.phone
    ?? shippingAddress?.phone
    ?? null

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .upsert({
      account_id: accountId,
      store_id: storeId,
      customer_id: customerId,
      external_order_id: String(payload.id),
      order_number: payload.name ?? String(payload.order_number),
      total_price: parseFloat(payload.total_price ?? '0'),
      currency: payload.currency ?? 'EUR',
      shipping_address: shippingAddress,
      phone,
      notes: payload.note ?? null,
      raw_payload: payload,
    }, {
      onConflict: 'account_id,external_order_id',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    throw new Error(`Error guardando pedido: ${orderError?.message}`)
  }

  // 5. Guardar order items (solo en pedidos nuevos)
  const { count } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('order_id', order.id)

  if (count === 0) {
    const orderItems = itemsWithProductId.map(item => ({
      order_id: order.id,
      account_id: accountId,
      ...item,
    }))

    await supabase.from('order_items').insert(orderItems)
  }

  // 6. Registrar estado inicial en historial
  await supabase.from('order_status_history').insert({
    order_id: order.id,
    account_id: accountId,
    from_status: null,
    to_status: 'confirmar',
    changed_by: 'shopify_webhook',
  })


  // 7. Lanzar análisis automático (sin await para no bloquear el webhook)
  analyzeOrder(order.id).catch(err => {
    console.error(`Error analizando pedido ${order.id}:`, err)
  })

  return { orderId: order.id, accountId }
  
}

