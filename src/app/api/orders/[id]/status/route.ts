import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const VALID_STATUSES = ['confirmar', 'confirmado', 'preparado', 'enviado', 'entregado', 'incidencia', 'devolucion', 'cancelado']

const REAPPEAR_HOURS: Record<string, number | null> = {
  confirmar: 1,
  confirmado: 3,
  preparado: 3,
  enviado: 3,
  incidencia: 3,
  devolucion: 3,
  entregado: null,
  cancelado: null,
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { status, note } = body

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Estado no válido' }, { status: 400 })
  }

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data: order } = await adminSupabase
    .from('orders')
    .select('id, status, account_id')
    .eq('id', params.id)
    .eq('account_id', accountUser.account_id)
    .single()

  if (!order) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  // Calcular next_reappear_at
  const hours = REAPPEAR_HOURS[status]
  const next_reappear_at = hours
    ? new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
    : null

  // Actualizar pedido
  await adminSupabase
    .from('orders')
    .update({ status, next_reappear_at })
    .eq('id', params.id)

  // Guardar en historial
  await adminSupabase
    .from('order_status_history')
    .insert({
      order_id: params.id,
      account_id: accountUser.account_id,
      from_status: order.status,
      to_status: status,
      changed_by: 'user',
      note: note ?? null,
    })

  return NextResponse.json({ ok: true, status, next_reappear_at })
}