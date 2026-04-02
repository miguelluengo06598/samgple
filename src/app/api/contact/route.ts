import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimit.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { pathname } = request.nextUrl

  // Rate limiting solo en API
  if (pathname.startsWith('/api/contact')) {
    if (!checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Inténtalo más tarde.' }, { status: 429 })
    }
  }

  if (pathname.startsWith('/api/vapi/call')) {
    if (!checkRateLimit(`vapi:${ip}`, 30, 60 * 1000)) {
      return NextResponse.json({ error: 'Límite de llamadas alcanzado.' }, { status: 429 })
    }
  }

  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(`api:${ip}`, 200, 60 * 1000)) {
      return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 })
    }
  }

  // Delegar sesión al handler original — no tocar rutas
  const res = await updateSession(request)

  // Headers de seguridad
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}