import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_ROUTES = ['/', '/precios', '/metodologia', '/contacto']
const PUBLIC_API    = ['/api/contact', '/api/shopify/auth', '/api/shopify/callback', '/api/webhooks', '/api/vapi/webhook']
const AUTH_ROUTES   = ['/login', '/registro']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const res = NextResponse.next({ request: { headers: request.headers } })

  if (PUBLIC_API.some(r => pathname.startsWith(r))) return res
  if (pathname.startsWith('/_next') || pathname.includes('.')) return res

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSecret = request.cookies.get('admin_secret')?.value
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return res
  }

  if (pathname.startsWith('/api/admin')) {
    const adminSecret =
      request.headers.get('x-admin-secret') ??
      request.cookies.get('admin_secret')?.value
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return res
  }

  if (pathname.startsWith('/api/')) {
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    return res
  }

  if (PUBLIC_ROUTES.includes(pathname)) return res

  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (user) return NextResponse.redirect(new URL('/pedidos', request.url))
    return res
  }

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}