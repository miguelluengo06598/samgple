import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Rutas del panel que requieren sesión
  const protectedPaths = ['/finanzas', '/pedidos', '/tienda', '/herramientas', '/configuracion']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  // Sin sesión intentando acceder al panel → redirigir a login
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Con sesión en login o registro → redirigir al panel
  // SOLO si no viene de un redirect para evitar bucles
  if (user && (pathname === '/login' || pathname === '/registro')) {
    const redirectTo = request.nextUrl.searchParams.get('redirect') ?? '/pedidos'
    // Verificar que el redirect es seguro (no externo)
    const safeRedirect = redirectTo.startsWith('/') ? redirectTo : '/pedidos'
    const url = request.nextUrl.clone()
    url.pathname = safeRedirect
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}