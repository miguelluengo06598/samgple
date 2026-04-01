import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deductBalance } from '@/services/wallet'
import crypto from 'crypto'

const CALL_COST_PER_MIN = 0.22
const CALL_COST_FAILED  = 0.05
const MIN_DURATION_SECS = 10

function verifyWebhook(body: string, signature: string): boolean {
  if (!process.env.VAPI_WEBHOOK_SECRET) return true
  try {
    const hmac = crypto.createHmac('sha256', process.env.VAPI_WEBHOOK_SECRET)
    const digest = hmac.update(body).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

function getCallStatus(endedReason: string, transcript: string): string {
  const r = (endedReason ?? '').toLowerCase()
  const t = (transcript ?? '').toLowerCase()

  if (
    r.includes('customer-did-not-answer') ||
    r.includes('no-answer') ||
    r.includes('not-answered')
  ) return 'no_answer'

  if (r.includes('voicemail') || r.includes('machine')) return 'voicemail'

  if (
    r.includes('invalid-number') ||
    r.includes('wrong-number') ||
    r.includes('number-not-in-service') ||
    r.includes('unallocated')
  ) return 'wrong_number'

  if (r.includes('customer-ended-call') || r.includes('completed')) {
    const confirmWords = ['sí', 'si', 'confirmo', 'confirmado', 'perfecto', 'de acuerdo', 'claro', 'vale', 'correcto', 'exacto', 'adelante']
    const cancelWords  = ['no quiero', 'cancela', 'cancelar', 'no me interesa', 'no lo quiero', 'devolver', 'anular']

    const hasConfirm = confirmWords.some(w => t.includes(w))
    const hasCancel  = cancelWords.some(w => t.includes(w))

    if (hasConfirm && !hasCancel) return 'confirmed'
    if (hasCancel) return 'cancelled'
  }

  if (r.includes('error') || r.includes('failed') || r.includes('busy')) return 'no_answer'

  return 'no_answer'
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('x-vapi-signature') ?? ''

  if (!verifyWebhook(body, signature)) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const admin = createAdminClient()
  const eventType = payload.message?.type ?? payload.type ?? ''
  const call = payload.message?.call ?? payload.call ?? payload

  if (!call?.id) return NextResponse.json({ ok: true })

  // Buscar el call_log correspondiente
  const { data: callLog } = await admin
    .from('call_logs')
    .select('*, orders(order_number, call_attempts)')
    .eq('vapi_call_id', call.id)
    .single()

  if (!callLog) return NextResponse.json({ ok: true })

  // ── Llamada terminada ──
  if (
    eventType === 'end-of-call-report' ||
    eventType === 'call.ended' ||
    payload.message?.type === 'end-of-call-report'
  ) {
    const report    = payload.message ?? payload
    const startedAt = call.startedAt ? new Date(call.startedAt).getTime() : Date.now()
    const endedAt   = call.endedAt   ? new Date(call.endedAt).getTime()   : Date.now()
    const durationSecs = Math.max(0, Math.round((endedAt - startedAt) / 1000))
    const durationMins = durationSecs / 60

    const transcript  = report.transcript ?? call.transcript ?? ''
    const summary     = report.summary ?? ''
    const endedReason = call.endedReason ?? report.endedReason ?? ''

    const callStatus = getCallStatus(endedReason, transcript)

    // Calcular coste proporcional
    let cost: number
    if (durationSecs < MIN_DURATION_SECS) {
      cost = CALL_COST_FAILED
    } else {
      cost = Math.max(CALL_COST_PER_MIN * durationMins, CALL_COST_FAILED)
      cost = Math.round(cost * 10000) / 10000
    }

    // Cobrar tokens
    await deductBalance(
      callLog.account_id,
      cost,
      'call_charge',
      `Llamada ${callStatus} pedido ${callLog.orders?.order_number ?? ''} (${durationSecs}s)`,
      { order_id: callLog.order_id, call_id: callLog.id }
    )

    // Actualizar call_log
    await admin.from('call_logs').update({
      status: callStatus,
      duration_seconds: durationSecs,
      cost_tokens: cost,
      transcript: transcript.slice(0, 10000),
      summary: summary.slice(0, 2000),
      ended_reason: endedReason,
      ended_at: call.endedAt ?? new Date().toISOString(),
    }).eq('id', callLog.id)

    // Actualizar orden
    const orderUpdates: any = {
      call_status: callStatus,
      call_summary: summary || transcript.slice(0, 500),
      last_call_at: call.endedAt ?? new Date().toISOString(),
    }

    if (callStatus === 'confirmed') {
      orderUpdates.status = 'confirmado'
    } else if (callStatus === 'cancelled') {
      orderUpdates.status = 'cancelado'
    } else if (callStatus === 'no_answer' || callStatus === 'voicemail') {
      // Reagendar en 2 horas
      orderUpdates.next_call_at = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    }

    await admin.from('orders').update(orderUpdates).eq('id', callLog.order_id)
  }

  // ── Llamada iniciada ──
  if (eventType === 'call.started') {
    await admin.from('call_logs').update({
      status: 'in_progress',
      started_at: call.startedAt ?? new Date().toISOString(),
    }).eq('vapi_call_id', call.id)

    await admin.from('orders').update({
      call_status: 'calling',
    }).eq('id', callLog.order_id)
  }

  return NextResponse.json({ ok: true })
}