import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { deductBalance } from '@/services/wallet'
import crypto from 'crypto'
export const runtime = 'nodejs'

const CALL_COST_PER_MIN = 0.22
const CALL_COST_FAILED  = 0.05
const MAX_CALL_COST     = 2.00
const MIN_DURATION_SECS = 10

function verifyWebhook(body: string, signature: string): boolean {
  if (!process.env.VAPI_WEBHOOK_SECRET) return true
  try {
    const hmac   = crypto.createHmac('sha256', process.env.VAPI_WEBHOOK_SECRET)
    const digest = hmac.update(body).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
  } catch {
    return false
  }
}

function getCallStatus(endedReason: string, transcript: string): string {
  const r = (endedReason ?? '').toLowerCase().replace(/-/g, '').replace(/_/g, '')
  const t = (transcript ?? '').toLowerCase()

  // Sin respuesta / error
  if (
    r.includes('customerdidnotanswer') ||
    r.includes('noanswer') ||
    r.includes('notanswered') ||
    r.includes('error') ||
    r.includes('failed') ||
    r.includes('busy') ||
    r.includes('timeout')
  ) return 'no_answer'

  // Buzón de voz
  if (r.includes('voicemail') || r.includes('machine')) return 'voicemail'

  // Número incorrecto
  if (
    r.includes('invalidnumber') ||
    r.includes('wrongnumber') ||
    r.includes('numbernotinservice') ||
    r.includes('unallocated')
  ) return 'wrong_number'

  // Llamada completada — analizar transcripción
  if (
    r.includes('customerendedcall') ||
    r.includes('completed') ||
    r.includes('assistantendedcall') ||
    r.includes('hangup')
  ) {
    const cancelPhrases = [
      'no lo quiero', 'no me interesa', 'quiero cancelar',
      'cancela el pedido', 'cancelar el pedido',
      'no quiero el pedido', 'quiero devolverlo', 'quiero anularlo',
      'no lo quiero', 'no quiero', 'canceladlo', 'cancelalo',
      'devuélvelo', 'devolvérselo', 'anularlo', 'anúlalo',
    ]
    const confirmPhrases = [
      'sí, confirmo', 'si, confirmo', 'lo confirmo',
      'sí quiero', 'si quiero', 'está confirmado',
      'de acuerdo', 'perfecto', 'adelante',
      'sí, es correcto', 'si, es correcto',
      'correcto', 'exacto', 'claro que sí', 'claro que si',
      'vale', 'venga', 'ok', 'bueno', 'sí', 'si',
      'confirmado', 'confirmamos', 'lo confirmamos',
      'genial', 'estupendo', 'por supuesto', 'claro',
    ]

    if (cancelPhrases.some(p => t.includes(p)))  return 'cancelled'
    if (confirmPhrases.some(p => t.includes(p))) return 'confirmed'

    return 'no_answer'
  }

  return 'no_answer'
}

export async function POST(request: NextRequest) {
  const body      = await request.text()
  const signature = request.headers.get('x-vapi-signature') ?? ''

  if (!verifyWebhook(body, signature)) {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
  }

  let payload: any
  try { payload = JSON.parse(body) }
  catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  const admin     = createAdminClient()
  const eventType = payload.message?.type ?? payload.type ?? ''
  const call      = payload.message?.call ?? payload.call ?? payload

  if (!call?.id) return NextResponse.json({ ok: true })

  const { data: callLog } = await admin
    .from('call_logs')
    .select('*, orders(order_number, call_attempts)')
    .eq('vapi_call_id', call.id)
    .single()

  if (!callLog) return NextResponse.json({ ok: true })

  // ── Llamada iniciada ──
  if (eventType === 'call.started') {
    await admin.from('call_logs').update({
      status:     'in_progress',
      started_at: call.startedAt ?? new Date().toISOString(),
    }).eq('vapi_call_id', call.id)

    await admin.from('orders').update({ call_status: 'calling' }).eq('id', callLog.order_id)
    return NextResponse.json({ ok: true })
  }

  // ── Llamada terminada ──
  if (
    eventType === 'end-of-call-report' ||
    eventType === 'call.ended' ||
    payload.message?.type === 'end-of-call-report'
  ) {
    const report       = payload.message ?? payload
    const startedAt    = call.startedAt ? new Date(call.startedAt).getTime() : Date.now()
    const endedAt      = call.endedAt   ? new Date(call.endedAt).getTime()   : Date.now()
    const durationSecs = Math.max(0, Math.round((endedAt - startedAt) / 1000))
    const durationMins = durationSecs / 60

    const transcript   = report.transcript  ?? call.transcript  ?? ''
    const summary      = report.summary     ?? ''
    const endedReason  = call.endedReason   ?? report.endedReason ?? ''
    const recordingUrl = call.recordingUrl  ?? report.recordingUrl ?? null

    const callStatus = getCallStatus(endedReason, transcript)

    let cost: number
    if (durationSecs < MIN_DURATION_SECS) {
      cost = CALL_COST_FAILED
    } else {
      cost = Math.min(CALL_COST_PER_MIN * durationMins, MAX_CALL_COST)
      cost = Math.max(cost, CALL_COST_FAILED)
      cost = Math.round(cost * 10000) / 10000
    }

    await deductBalance(
      callLog.account_id,
      cost,
      'call_charge',
      `Llamada ${callStatus} pedido ${callLog.orders?.order_number ?? ''} (${durationSecs}s)`,
      { order_id: callLog.order_id, call_id: callLog.id }
    )

    await admin.from('call_logs').update({
      status:           callStatus,
      duration_seconds: durationSecs,
      cost_tokens:      cost,
      transcript:       transcript.slice(0, 10000),
      summary:          summary.slice(0, 2000),
      ended_reason:     endedReason,
      recording_url:    recordingUrl,
      ended_at:         call.endedAt ?? new Date().toISOString(),
    }).eq('id', callLog.id)

    const orderUpdates: any = {
      call_status:  callStatus,
      call_summary: summary || transcript.slice(0, 500),
      last_call_at: call.endedAt ?? new Date().toISOString(),
    }

    if (callStatus === 'confirmed') orderUpdates.status = 'confirmado'
    if (callStatus === 'cancelled') orderUpdates.status = 'cancelado'
    if (callStatus === 'no_answer' || callStatus === 'voicemail') {
      orderUpdates.next_call_at = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    }

    await admin.from('orders').update(orderUpdates).eq('id', callLog.order_id)
  }

  return NextResponse.json({ ok: true })
}