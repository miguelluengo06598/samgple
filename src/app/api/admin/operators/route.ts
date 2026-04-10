import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import bcrypt from 'bcryptjs'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('operator_users')
    .select('id, name, email, active, created_at')
    .order('created_at', { ascending: true })

  // Contar llamadas pendientes por operador
  const { data: calls } = await admin
    .from('call_requests')
    .select('assigned_to')
    .eq('status', 'pending')
    .not('assigned_to', 'is', null)

  const pendingByOp: Record<string, number> = {}
  for (const c of calls ?? []) {
    if (c.assigned_to) pendingByOp[c.assigned_to] = (pendingByOp[c.assigned_to] ?? 0) + 1
  }

  const operators = (data ?? []).map(op => ({
    ...op,
    pending_calls: pendingByOp[op.id] ?? 0,
  }))

  return NextResponse.json({ operators })
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { name, email, password } = await request.json()

  if (!name || !email || !password) return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })

  // Verificar email único
  const { data: existing } = await admin.from('operator_users').select('id').eq('email', email).single()
  if (existing) return NextResponse.json({ error: 'Ya existe un operador con ese email' }, { status: 400 })

  const hashedPassword = await bcrypt.hash(password, 10)

  const { data, error } = await admin.from('operator_users').insert({
    name, email, password: hashedPassword, active: true,
  }).select('id, name, email, active').single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ operator: data })
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { id, active, password } = await request.json()

  const updates: any = {}
  if (active !== undefined) updates.active = active
  if (password) updates.password = await bcrypt.hash(password, 10)

  await admin.from('operator_users').update(updates).eq('id', id)

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { id } = await request.json()

  await admin.from('operator_users').delete().eq('id', id)

  return NextResponse.json({ ok: true })
}