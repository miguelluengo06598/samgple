import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { encrypt } from '@/services/crypto'

export async function GET(request: NextRequest) {
  const supabase      = await createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { searchParams } = request.nextUrl
  const code  = searchParams.get('code')
  const state = searchParams.get('state')
  const shop  = searchParams.get('shop')
  const savedState = request.cookies.get('shopify_oauth_state')?.value

  if (!code || !state || !shop) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracion?error=oauth_params`)
  }
  if (state !== savedState) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracion?error=oauth_state`)
  }

  // Intercambiar code por access_token
  const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  })

  if (!tokenResponse.ok) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracion?error=token_exchange`)
  }

  const { access_token } = await tokenResponse.json()

  // Obtener info de la tienda
  const shopInfoResponse = await fetch(`https://${shop}/admin/api/2024-01/shop.json`, {
    headers: { 'X-Shopify-Access-Token': access_token },
  })
  const { shop: shopInfo } = await shopInfoResponse.json()

  // Obtener account_id
  const { data: accountUser } = await adminSupabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracion?error=no_account`)
  }

  // Guardar tienda — onConflict por account_id + shopify_domain
  // permite que un cliente tenga múltiples tiendas distintas
  const { error: storeError } = await adminSupabase
    .from('stores')
    .upsert({
      account_id:     accountUser.account_id,
      shopify_domain: shop,
      name:           shopInfo.name,
      access_token:   encrypt(access_token),
      status:         'active',
    }, { onConflict: 'account_id,shopify_domain' })

  if (storeError) {
    console.error('Error guardando tienda:', storeError)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracion?error=store_save`)
  }

  // Registrar webhooks
  await registerWebhooks(shop, access_token)

  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/configuracion?success=shopify_connected`)
  response.cookies.delete('shopify_oauth_state')
  response.cookies.delete('shopify_shop')
  return response
}

async function registerWebhooks(shop: string, accessToken: string) {
  const appUrl   = process.env.NEXT_PUBLIC_APP_URL
  const webhooks = [
    { topic: 'orders/create',  address: `${appUrl}/api/webhooks/shopify/orders-create` },
    { topic: 'orders/updated', address: `${appUrl}/api/webhooks/shopify/orders-updated` },
  ]
  for (const webhook of webhooks) {
    await fetch(`https://${shop}/admin/api/2024-01/webhooks.json`, {
      method: 'POST',
      headers: {
        'Content-Type':           'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ webhook }),
    })
  }
}