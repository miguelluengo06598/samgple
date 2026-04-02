import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Rate limiting simple en memoria
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}

export async function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { pathname } = request.nextUrl

  // ── Rate limiting por ruta ──

  // API de contacto — 5 por hora por IP
  if (pathname.startsWith('/api/contact')) {
    if (!checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Demasiadas solicitudes. Inténtalo más tarde.' }, { status: 429 })
    }
  }

  // API de login/registro — 10 intentos por 15 min
  if (pathname.startsWith('/api/auth') || pathname.includes('signIn') || pathname.includes('signUp')) {
    if (!checkRateLimit(`auth:${ip}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'Demasiados intentos. Espera 15 minutos.' }, { status: 429 })
    }
  }

  // API de VAPI call — 30 por minuto por IP
  if (pathname.startsWith('/api/vapi/call')) {
    if (!checkRateLimit(`vapi:${ip}`, 30, 60 * 1000)) {
      return NextResponse.json({ error: 'Límite de llamadas alcanzado.' }, { status: 429 })
    }
  }

  // API general — 100 por minuto por IP
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(`api:${ip}`, 100, 60 * 1000)) {
      return NextResponse.json({ error: 'Demasiadas solicitudes.' }, { status: 429 })
    }
  }

  // ── Headers de seguridad ──
  const res = await updateSession(request)

  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}