import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('call_requests')
    .select(`
      *,
      orders (
        id, order_number, total_price, status, call_status, phone,
        customers ( first_name, last_name, phone ),
        order_items ( name, quantity, price ),
        stores ( name )
      ),
      accounts ( name, email )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return NextResponse.json({ requests: data ?? [] })
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdminSecret(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const admin = createAdminClient()
  const { id, status, admin_note, ai_summary, assigned_to } = await request.json()

  if (!id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  // --- Solo asignación de operador ---
  if (assigned_to !== undefined && !status) {
    await admin
      .from('call_requests')
      .update({ assigned_to, updated_at: new Date().toISOString() })
      .eq('id', id)
    return NextResponse.json({ ok: true })
  }

  if (!status) return NextResponse.json({ error: 'Falta status' }, { status: 400 })

  // --- Generar resumen IA ---
  let finalSummary = ai_summary
  if (admin_note && !ai_summary) {
    try {
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens: 300,
          temperature: 0.4,
          messages: [
            {
              role: 'system',
              content: `Eres un asistente que convierte notas internas de un operador de eCommerce en mensajes claros y profesionales para el cliente. El cliente verá este texto como resumen de la llamada. Escribe en español, tono amigable y natural. Máximo 3 frases. No menciones que es una nota interna. No uses tecnicismos.`,
            },
            {
              role: 'user',
              content: `Nota del operador: "${admin_note}"\n\nConviértelo en un resumen claro para el cliente.`,
            },
          ],
        }),
      })
      const aiData = await aiRes.json()
      finalSummary = aiData.choices?.[0]?.message?.content?.trim() ?? admin_note
    } catch {
      finalSummary = admin_note
    }
  }

  // --- Actualizar call_request ---
  await admin.from('call_requests').update({
    status,
    admin_note,
    ai_summary: finalSummary,
    updated_at: new Date().toISOString(),
  }).eq('id', id)

  // --- Actualizar pedido ---
  const { data: callReq } = await admin
    .from('call_requests')
    .select('order_id')
    .eq('id', id)
    .single()

  if (callReq?.order_id) {
    const orderUpdates: any = {
      call_status:  status,
      call_summary: finalSummary,
      last_call_at: new Date().toISOString(),
    }
    if (status === 'confirmed') orderUpdates.status = 'confirmado'
    if (status === 'cancelled') orderUpdates.status = 'cancelado'

    await admin.from('orders').update(orderUpdates).eq('id', callReq.order_id)
  }

  return NextResponse.json({ ok: true, ai_summary: finalSummary })
}