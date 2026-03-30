import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { addBalance, deductBalance } from '@/services/wallet'

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  const { id } = await context.params
  const body = await request.json()
  const admin = createAdminClient()

  if (body.action === 'add_tokens') {
    await addBalance(id, body.amount, 'admin_grant', body.description ?? 'Ajuste admin', {})
  } else if (body.action === 'remove_tokens') {
    await deductBalance(id, body.amount, 'admin_deduction', body.description ?? 'Ajuste admin', {})
  } else if (body.action === 'toggle_status') {
    const { data: account } = await admin.from('accounts').select('status').eq('id', id).single()
    const newStatus = account?.status === 'active' ? 'suspended' : 'active'
    await admin.from('accounts').update({ status: newStatus }).eq('id', id)
  }

  return NextResponse.json({ ok: true })
}