import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const shop = request.nextUrl.searchParams.get('shop')
  if (!shop) {
    return NextResponse.json({ error: 'Falta el parámetro shop' }, { status: 400 })
  }

  const shopDomain = shop.includes('.myshopify.com') ? shop : `${shop}.myshopify.com`

  const state = crypto.randomUUID()
  const scopes = process.env.SHOPIFY_SCOPES!
  const apiKey = process.env.SHOPIFY_API_KEY!
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`

  const authUrl = `https://${shopDomain}/admin/oauth/authorize?` +
    `client_id=${apiKey}` +
    `&scope=${scopes}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`

  // Guardar state en cookie para verificarlo en callback
  const response = NextResponse.redirect(authUrl)
  response.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10 minutos
    sameSite: 'lax',
  })
  response.cookies.set('shopify_shop', shopDomain, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    sameSite: 'lax',
  })

  return response
}