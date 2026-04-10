// src/app/api/operador/calls/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function getOperatorId(request: NextRequest): string | null {
  return request.cookies.get('operator_id')?.value ?? null
}

export async function GET(request: NextRequest) {
  const operatorId = getOperatorId(request)
  if (!operatorId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()

  // Verificar que el operador existe y está activo
  const { data: op } = await admin.from('operator_users').select('id, active').eq('id', operatorId).single()
  if (!op || !op.active) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Solo las llamadas asignadas a este operador y pendientes
  const { data } = await admin
    .from('call_requests')
    .select(`
      id, is_retry, admin_note, created_at,
      orders (
        order_number, total_price, phone,
        customers ( first_name, last_name, phone ),
        order_items ( name, quantity, price ),
        stores ( name )
      )
    `)
    .eq('assigned_to', operatorId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return NextResponse.json({ calls: data ?? [] })
}

export async function PATCH(request: NextRequest) {
  const operatorId = getOperatorId(request)
  if (!operatorId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { id, status, admin_note } = await request.json()

  // Verificar que la llamada está asignada a este operador
  const { data: callReq } = await admin
    .from('call_requests').select('id, order_id, assigned_to').eq('id', id).single()

  if (!callReq || callReq.assigned_to !== operatorId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Generar resumen IA si hay nota
  let aiSummary = null
  if (admin_note?.trim()) {
    try {
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 200,
          temperature: 0.4,
          messages: [
            { role: 'system', content: 'Convierte esta nota interna de un operador en un mensaje claro y amigable para el cliente. Español, máximo 2-3 frases, tono natural.' },
            { role: 'user', content: `Nota: "${admin_note}"` },
          ],
        }),
      })
      const aiData = await aiRes.json()
      aiSummary = aiData.choices?.[0]?.message?.content?.trim() ?? admin_note
    } catch { aiSummary = admin_note }
  }

  // Actualizar solicitud
  await admin.from('call_requests').update({
    status, admin_note, ai_summary: aiSummary, updated_at: new Date().toISOString(),
  }).eq('id', id)

  // Actualizar pedido
  const orderUpdates: any = { call_status: status, call_summary: aiSummary, last_call_at: new Date().toISOString() }
  if (status === 'confirmed') orderUpdates.status = 'confirmado'
  if (status === 'cancelled') orderUpdates.status = 'cancelado'
  await admin.from('orders').update(orderUpdates).eq('id', callReq.order_id)

  return NextResponse.json({ ok: true })
}