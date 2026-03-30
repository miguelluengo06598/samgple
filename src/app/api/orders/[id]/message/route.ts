import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deductBalance, hasBalance } from '@/services/wallet'

const MESSAGE_COST = 0.003

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data: order } = await adminSupabase
    .from('orders')
    .select(`
      *, customers(*), order_items(*),
      order_risk_analyses(risk_score, risk_level, base_score)
    `)
    .eq('id', id)
    .eq('account_id', accountUser.account_id)
    .single()

  if (!order) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const hasFunds = await hasBalance(accountUser.account_id, MESSAGE_COST)
  if (!hasFunds) return NextResponse.json({ error: 'Saldo insuficiente' }, { status: 402 })

  // Generar nuevo mensaje con OpenAI
  const analysis = order.order_risk_analyses?.[0]
  const customer = order.customers
  const products = order.order_items?.map((i: any) => `${i.name} x${i.quantity}`).join(', ')
  const address = order.shipping_address

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: 'Eres un asistente de eCommerce. Genera mensajes de WhatsApp naturales, cálidos y profesionales en español. Máximo 3 frases. Sin emojis excesivos.',
        },
        {
          role: 'user',
          content: `Genera un mensaje de WhatsApp para este pedido COD:
- Cliente: ${customer?.first_name ?? ''} ${customer?.last_name ?? ''}
- Pedido: ${order.order_number} por ${order.total_price}€
- Productos: ${products}
- Dirección: ${address?.address1 ?? ''}, ${address?.city ?? ''}
- Estado del pedido: ${order.status}
- Nivel de riesgo: ${analysis?.risk_level ?? 'desconocido'}

Adapta el tono al estado y riesgo. Si es confirmar o riesgo alto, pide confirmación. Si es enviado, informa del envío.`,
        },
      ],
    }),
  })

  if (!response.ok) return NextResponse.json({ error: 'Error generando mensaje' }, { status: 500 })

  const data = await response.json()
  const newMessage = data.choices?.[0]?.message?.content ?? ''

  // Cobrar
  await deductBalance(
    accountUser.account_id,
    MESSAGE_COST,
    'order_analysis_charge',
    `Nuevo mensaje WhatsApp pedido ${order.order_number}`,
    { order_id: id }
  )

  // Guardar nuevo mensaje en el análisis
  await adminSupabase
    .from('order_risk_analyses')
    .update({ customer_message: newMessage })
    .eq('order_id', id)

  return NextResponse.json({ message: newMessage })
}