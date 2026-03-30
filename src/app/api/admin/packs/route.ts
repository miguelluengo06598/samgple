import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { data } = await admin.from('token_packs').select('*').order('price_eur')
  return NextResponse.json({ packs: data ?? [] })
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const body = await request.json()
  const { data } = await admin.from('token_packs').insert(body).select().single()
  return NextResponse.json({ pack: data })
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { id, ...updates } = await request.json()
  await admin.from('token_packs').update(updates).eq('id', id)
  return NextResponse.json({ ok: true })
}