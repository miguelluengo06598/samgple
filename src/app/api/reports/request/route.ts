import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deductBalance, hasBalance } from '@/services/wallet'

const REPORT_COST = 0.5

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const admin = createAdminClient()
    const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
    if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

    const { data: account } = await admin.from('accounts').select('email, name').eq('id', accountUser.account_id).single()

    const hasFunds = await hasBalance(accountUser.account_id, REPORT_COST)
    if (!hasFunds) return NextResponse.json({ error: 'Saldo insuficiente (0.5 tokens)' }, { status: 402 })

    // Cooldown 48h
    const { data: lastReport } = await admin
      .from('reports')
      .select('created_at')
      .eq('account_id', accountUser.account_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastReport) {
      const hours = (Date.now() - new Date(lastReport.created_at).getTime()) / (1000 * 60 * 60)
      if (hours < 48) {
        return NextResponse.json({ error: `Disponible en ${Math.ceil(48 - hours)} horas` }, { status: 429 })
      }
    }

    // Datos de la semana
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [{ data: orders }, { data: delivered }, { data: cancelled }, { data: returned }] = await Promise.all([
      admin.from('orders').select('id, order_number, total_price, status').eq('account_id', accountUser.account_id).gte('created_at', weekAgo),
      admin.from('orders').select('total_price').eq('account_id', accountUser.account_id).eq('status', 'entregado').gte('updated_at', weekAgo),
      admin.from('orders').select('id').eq('account_id', accountUser.account_id).eq('status', 'cancelado').gte('updated_at', weekAgo),
      admin.from('orders').select('id').eq('account_id', accountUser.account_id).eq('status', 'devolucion').gte('updated_at', weekAgo),
    ])

    const totalIngresos    = delivered?.reduce((s, o) => s + Number(o.total_price), 0) ?? 0
    const totalPedidos     = orders?.length ?? 0
    const totalEntregados  = delivered?.length ?? 0
    const totalCancelados  = cancelled?.length ?? 0
    const totalDevoluciones = returned?.length ?? 0
    const tasaEntrega      = totalPedidos > 0 ? ((totalEntregados / totalPedidos) * 100).toFixed(1) : '0'

    // IA
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 600,
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

Incluye: resumen ejecutivo (2 frases), puntos positivos, áreas de mejora y exactamente 3 recomendaciones numeradas para la próxima semana. Sé directo y práctico.`,
        }],
      }),
    })

    if (!aiResponse.ok) {
      const aiError = await aiResponse.text()
      console.error('OpenAI error:', aiError)
      return NextResponse.json({ error: 'Error generando análisis IA' }, { status: 500 })
    }

    const aiData = await aiResponse.json()
    const reportContent = aiData.choices?.[0]?.message?.content ?? 'Error generando análisis'

    // Email HTML
    const emailHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Informe Semanal SAMGPLE</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f0fafa;margin:0;padding:24px 16px">
  <div style="max-width:580px;margin:0 auto">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);border-radius:20px 20px 0 0;padding:36px 32px;text-align:center">
      <div style="width:52px;height:52px;background:linear-gradient(135deg,#2EC4B6,#1D9E75);border-radius:16px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center">
        <span style="font-size:24px">📊</span>
      </div>
      <h1 style="color:#fff;margin:0 0 6px;font-size:22px;font-weight:800;letter-spacing:-0.5px">Informe Semanal</h1>
      <p style="color:rgba(255,255,255,0.6);margin:0;font-size:13px">${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div style="margin-top:12px;display:inline-block;background:rgba(46,196,182,0.15);border:1px solid rgba(46,196,182,0.3);border-radius:20px;padding:4px 14px">
        <span style="font-size:11px;font-weight:700;color:#2EC4B6;letter-spacing:0.05em">SAMGPLE · Sistema COD</span>
      </div>
    </div>

    <!-- Body -->
    <div style="background:#fff;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 20px 20px">

      <p style="font-size:15px;color:#0f172a;margin:0 0 24px">Hola <strong>${account?.name ?? 'equipo'}</strong>, aquí tienes el resumen de esta semana 👇</p>

      <!-- Métricas -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
        <tr>
          <td width="48%" style="padding-right:6px">
            <div style="background:#f0fdf4;border-radius:14px;padding:16px;border:1px solid #bbf7d0;text-align:center">
              <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em;font-weight:700">Pedidos semana</p>
              <p style="font-size:32px;font-weight:800;color:#0f172a;margin:0;letter-spacing:-1px">${totalPedidos}</p>
            </div>
          </td>
          <td width="48%" style="padding-left:6px">
            <div style="background:#f0fdf4;border-radius:14px;padding:16px;border:1px solid #bbf7d0;text-align:center">
              <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em;font-weight:700">Entregados</p>
              <p style="font-size:32px;font-weight:800;color:#2EC4B6;margin:0;letter-spacing:-1px">${totalEntregados}</p>
            </div>
          </td>
        </tr>
        <tr><td colspan="2" height="12"></td></tr>
        <tr>
          <td width="48%" style="padding-right:6px">
            <div style="background:#fef2f2;border-radius:14px;padding:16px;border:1px solid #fecaca;text-align:center">
              <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em;font-weight:700">Cancelados</p>
              <p style="font-size:32px;font-weight:800;color:#dc2626;margin:0;letter-spacing:-1px">${totalCancelados}</p>
            </div>
          </td>
          <td width="48%" style="padding-left:6px">
            <div style="background:#f0fdf4;border-radius:14px;padding:16px;border:1px solid #bbf7d0;text-align:center">
              <p style="font-size:10px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.06em;font-weight:700">Ingresos</p>
              <p style="font-size:32px;font-weight:800;color:#0f766e;margin:0;letter-spacing:-1px">${totalIngresos.toFixed(2)}€</p>
            </div>
          </td>
        </tr>
      </table>

      <!-- Tasa entrega -->
      <div style="background:#f8fafc;border-radius:14px;padding:14px 18px;margin-bottom:24px;border:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;color:#64748b;font-weight:500">Tasa de entrega</span>
        <span style="font-size:20px;font-weight:800;color:${parseFloat(tasaEntrega) >= 70 ? '#0f766e' : '#dc2626'}">${tasaEntrega}%</span>
      </div>

      <!-- Análisis IA -->
      <div style="background:linear-gradient(135deg,rgba(46,196,182,0.06),rgba(29,158,117,0.03));border-radius:16px;padding:20px;border:1px solid rgba(46,196,182,0.2);margin-bottom:24px">
        <p style="font-size:11px;font-weight:800;color:#0f766e;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.07em">✦ Análisis IA</p>
        <div style="font-size:14px;color:#374151;line-height:1.75;white-space:pre-wrap">${reportContent}</div>
      </div>

      <!-- Footer -->
      <div style="border-top:1px solid #f1f5f9;padding-top:20px;text-align:center">
        <p style="font-size:12px;color:#94a3b8;margin:0 0 4px">Generado automáticamente por SAMGPLE</p>
        <p style="font-size:11px;color:#cbd5e1;margin:0">
          <a href="https://www.samgple.com" style="color:#2EC4B6;text-decoration:none">www.samgple.com</a>
          · Sistema de confirmación COD con IA
        </p>
      </div>

    </div>
  </div>
</body>
</html>`

    // Enviar email
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@samgple.com',
        to: account!.email,
        subject: `📊 Informe semanal SAMGPLE — ${new Date().toLocaleDateString('es-ES')}`,
        html: emailHtml,
      }),
    })

    if (!resendRes.ok) {
      const resendError = await resendRes.text()
      console.error('Resend error:', resendError)
      return NextResponse.json({ error: `Error enviando email: ${resendError}` }, { status: 500 })
    }

    // Cobrar y guardar
    await deductBalance(accountUser.account_id, REPORT_COST, 'report_charge', 'Informe semanal IA', {})
    await admin.from('reports').insert({
      account_id: accountUser.account_id,
      period:     `Semana del ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')} al ${new Date().toLocaleDateString('es-ES')}`,
      content:    reportContent,
      sent_to:    account!.email,
      status:     'sent',
    })

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('Report error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}