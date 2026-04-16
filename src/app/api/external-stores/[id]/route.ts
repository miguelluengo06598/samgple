/**
 * PATCH  /api/external-stores/[id]  → activar / desactivar tienda
 * DELETE /api/external-stores/[id]  → eliminar tienda y revocar acceso
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getAccountId(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  return data?.account_id ?? null
}

// ── PATCH: activar / desactivar ───────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const accountId = await getAccountId(request)
  if (!accountId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  if (typeof body.active !== 'boolean') {
    return NextResponse.json({ error: 'Se requiere el campo "active" (boolean)' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('external_stores')
    .update({ active: body.active, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('account_id', accountId)   // previene modificar tiendas de otras cuentas

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// ── DELETE: eliminar tienda ───────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const accountId = await getAccountId(request)
  if (!accountId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { error } = await admin
    .from('external_stores')
    .delete()
    .eq('id', id)
    .eq('account_id', accountId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
