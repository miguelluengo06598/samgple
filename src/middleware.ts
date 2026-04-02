import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Rutas públicas — accesibles sin sesión
const PUBLIC_ROUTES  = ['/', '/precios', '/metodologia', '/contacto']
const PUBLIC_API     = ['/api/contact', '/api/shopify/auth', '/api/shopify/callback', '/api/webhooks', '/api/vapi/webhook']
const AUTH_ROUTES    = ['/login', '/registro']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const res = NextResponse.next({
    request: { headers: request.headers },
  })

  // ── 1. Webhooks y API públicas → siempre pasan
  if (PUBLIC_API.some(r => pathname.startsWith(r))) return res

  // ── 2. Assets estáticos → pasan
  if (pathname.startsWith('/_next') || pathname.includes('.')) return res

  // ── 3. Crear cliente Supabase desde cookies
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

  // Refrescar sesión si existe
  const { data: { user } } = await supabase.auth.getUser()

  // ── 4. Rutas /admin → verificar cookie admin_secret
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSecret = request.cookies.get('admin_secret')?.value
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return res
  }

  // ── 5. API de admin → verificar admin_secret
  if (pathname.startsWith('/api/admin')) {
    const adminSecret =
      request.headers.get('x-admin-secret') ??
      request.cookies.get('admin_secret')?.value
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return res
  }

  // ── 6. Rutas de API del panel → requieren sesión
  if (pathname.startsWith('/api/')) {
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    return res
  }

  // ── 7. Web pública → siempre accesible
  if (PUBLIC_ROUTES.includes(pathname)) return res

  // ── 8. Rutas de auth → si ya está logueado, ir al panel
  if (AUTH_ROUTES.some(r => pathname.startsWith(r))) {
    if (user) return NextResponse.redirect(new URL('/pedidos', request.url))
    return res
  }

  // ── 9. Panel → requiere sesión activa
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