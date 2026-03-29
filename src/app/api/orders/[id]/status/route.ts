import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = ['confirmar','confirmado','preparado','enviado','entregado','incidencia','devolucion','cancelado']

const REAPPEAR_HOURS: Record<string, number | null> = {
  confirmar: 1, confirmado: 3, preparado: 3, enviado: 3,
  incidencia: 3, devolucion: 3, entregado: null, cancelado: null,
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { status, note, next_reappear_at } = body

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users').select('account_id').eq('user_id', user.id).single()

  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data: order } = await adminSupabase
    .from('orders').select('id, status, account_id').eq('id', id).eq('account_id', accountUser.account_id).single()

  if (!order) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const hours = REAPPEAR_HOURS[status]
  const reappear = next_reappear_at ?? (hours
    ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
    : null)

  await adminSupabase.from('orders').update({ status, next_reappear_at: reappear }).eq('id', id)
  await adminSupabase.from('order_status_history').insert({
    order_id: id, account_id: accountUser.account_id,
    from_status: order.status, to_status: status,
    changed_by: 'user', note: note ?? null,
  })

  return NextResponse.json({ ok: true, status, next_reappear_at: reappear })
}