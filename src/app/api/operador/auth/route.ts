// src/app/api/operador/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  if (!email || !password) return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 })

  const admin = createAdminClient()
  const { data: op } = await admin
    .from('operator_users')
    .select('id, password, active, name')
    .eq('email', email)
    .single()

  if (!op || !op.active) return NextResponse.json({ error: 'Usuario no encontrado o inactivo' }, { status: 401 })

  const valid = await bcrypt.compare(password, op.password)
  if (!valid) return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })

  const response = NextResponse.json({ ok: true, name: op.name })
  response.cookies.set('operator_id', op.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 12, // 12 horas
    sameSite: 'lax',
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete('operator_id')
  return response
}