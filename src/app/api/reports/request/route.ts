import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deductBalance, hasBalance } from '@/services/wallet'

const REPORT_COST = 0.5

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data: account } = await admin.from('accounts').select('email, name').eq('id', accountUser.account_id).single()

  const hasFunds = await hasBalance(accountUser.account_id, REPORT_COST)
  if (!hasFunds) return NextResponse.json({ error: 'Saldo insuficiente (0.5 tokens)' }, { status: 402 })

  // Recoger datos de la semana
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: orders }, { data: delivered }, { data: cancelled }, { data: returned }] = await Promise.all([
    admin.from('orders').select('id, order_number, total_price, status').eq('account_id', accountUser.account_id).gte('created_at', weekAgo),
    admin.from('orders').select('total_price').eq('account_id', accountUser.account_id).eq('status', 'entregado').gte('updated_at', weekAgo),
    admin.from('orders').select('id').eq('account_id', accountUser.account_id).eq('status', 'cancelado').gte('updated_at', weekAgo),
    admin.from('orders').select('id').eq('account_id', accountUser.account_id).eq('status', 'devolucion').gte('updated_at', weekAgo),
  ])

  const totalIngresos = delivered?.reduce((s, o) => s + Number(o.total_price), 0) ?? 0
  const totalPedidos = orders?.length ?? 0
  const totalEntregados = delivered?.length ?? 0
  const totalCancelados = cancelled?.length ?? 0
  const totalDevoluciones = returned?.length ?? 0
  const tasaEntrega = totalPedidos > 0 ? ((totalEntregados / totalPedidos) * 100).toFixed(1) : '0'

  // Generar análisis con IA
  const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 500,
      messages: [{
        role: 'system',
        content: 'Eres un consultor experto en eCommerce COD español. Genera informes semanales claros y accionables. Responde en español.',
      }, {
        role: 'user',
        content: `Genera un informe semanal para este negocio eCommerce COD:
- Pedidos totales: ${totalPedidos}
- Pedidos entregados: ${totalEntregados} (${tasaEntrega}%)
- Pedidos cancelados: ${totalCancelados}
- Devoluciones: ${totalDevoluciones}
- Ingresos semana: ${totalIngresos.toFixed(2)}€

Incluye: resumen ejecutivo, puntos positivos, áreas de mejora y 3 recomendaciones concretas para la próxima semana. Sé directo y práctico.`,
      }],
    }),
  })

  const aiData = await aiResponse.json()
  const reportContent = aiData.choices?.[0]?.message?.content ?? 'Error generando análisis'

  // Enviar por email con Resend
  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f0fafa;margin:0;padding:20px">
  <div style="max-width:600px;margin:0 auto">
    <div style="background:#2EC4B6;border-radius:16px 16px 0 0;padding:32px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:600">Informe Semanal SAMGPLE</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    <div style="background:#fff;padding:32px;border-radius:0 0 16px 16px;border:1px solid #cce8e6;border-top:none">
      
      <h2 style="color:#0f172a;font-size:16px;margin:0 0 20px">Resumen de la semana</h2>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
        <div style="background:#f0fafa;border-radius:12px;padding:16px;border:1px solid #cce8e6;text-align:center">
          <p style="font-size:11px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em">Pedidos totales</p>
          <p style="font-size:28px;font-weight:700;color:#0f172a;margin:0">${totalPedidos}</p>
        </div>
        <div style="background:#f0fdf4;border-radius:12px;padding:16px;border:1px solid #bbf7d0;text-align:center">
          <p style="font-size:11px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em">Entregados</p>
          <p style="font-size:28px;font-weight:700;color:#2EC4B6;margin:0">${totalEntregados}</p>
        </div>
        <div style="background:#fef2f2;border-radius:12px;padding:16px;border:1px solid #fecaca;text-align:center">
          <p style="font-size:11px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em">Cancelados</p>
          <p style="font-size:28px;font-weight:700;color:#dc2626;margin:0">${totalCancelados}</p>
        </div>
        <div style="background:#f0fdf4;border-radius:12px;padding:16px;border:1px solid #bbf7d0;text-align:center">
          <p style="font-size:11px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em">Ingresos</p>
          <p style="font-size:28px;font-weight:700;color:#0f766e;margin:0">${totalIngresos.toFixed(2)}€</p>
        </div>
      </div>

      <div style="background:#f0fafa;border-radius:12px;padding:20px;border:1px solid #cce8e6;margin-bottom:24px">
        <p style="font-size:12px;font-weight:700;color:#0f766e;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.05em">✦ Análisis IA</p>
        <div style="font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap">${reportContent}</div>
      </div>

      <p style="font-size:12px;color:#94a3b8;text-align:center;margin:0">SAMGPLE · Sistema operativo de pedidos COD</p>
    </div>
  </div>
</body>
</html>`

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: account!.email,
      subject: `📊 Tu informe semanal SAMGPLE — ${new Date().toLocaleDateString('es-ES')}`,
      html: emailHtml,
    }),
  })

  if (!resendResponse.ok) {
    console.error('Resend error:', await resendResponse.text())
    return NextResponse.json({ error: 'Error enviando email' }, { status: 500 })
  }

  // Cobrar y guardar
  await deductBalance(accountUser.account_id, REPORT_COST, 'report_charge', 'Informe semanal IA', {})
  await admin.from('reports').insert({
    account_id: accountUser.account_id,
    period: 'weekly',
    content: reportContent,
    sent_to: account!.email,
    status: 'sent',
  })

  return NextResponse.json({ ok: true })
}