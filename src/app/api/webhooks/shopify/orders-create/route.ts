import { NextRequest, NextResponse } from 'next/server'
import { syncOrderFromWebhook } from '@/services/shopify-sync'
import crypto from 'crypto'

function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_API_SECRET!
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64')
  return hash === hmacHeader
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const hmac = request.headers.get('x-shopify-hmac-sha256') ?? ''
  const shopDomain = request.headers.get('x-shopify-shop-domain') ?? ''

  if (!verifyShopifyWebhook(body, hmac)) {
    return NextResponse.json({ error: 'Webhook no válido' }, { status: 401 })
  }

  try {
    const payload = JSON.parse(body)
    const result = await syncOrderFromWebhook(payload, shopDomain)
    console.log(`Pedido sincronizado: ${result.orderId}`)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error procesando webhook orders/create:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}