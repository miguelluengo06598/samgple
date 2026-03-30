import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { data } = await admin.from('token_coupons').select('*').order('created_at', { ascending: false })
  return NextResponse.json({ coupons: data ?? [] })
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const body = await request.json()
  const { data } = await admin.from('token_coupons').insert({
    code: body.code.toUpperCase().trim(),
    tokens: body.tokens,
    max_uses: body.max_uses ?? 1,
    expires_at: body.expires_at ?? null,
    active: true,
  }).select().single()
  return NextResponse.json({ coupon: data })
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const admin = createAdminClient()
  const { id, active } = await request.json()
  await admin.from('token_coupons').update({ active }).eq('id', id)
  return NextResponse.json({ ok: true })
}