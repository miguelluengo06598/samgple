import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { data } = await admin
    .from('vapi_configs')
    .select('vapi_phone_number_id, assistant_name, active, twilio_phone_number, twilio_account_sid')
    .eq('account_id', accountUser.account_id)
    .single()

  return NextResponse.json({ config: data ?? null })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { assistant_name, twilio_account_sid, twilio_auth_token, twilio_phone_number } = await request.json()

  if (!assistant_name?.trim())
    return NextResponse.json({ error: 'El nombre del asistente es obligatorio' }, { status: 400 })
  if (!twilio_account_sid?.trim())
    return NextResponse.json({ error: 'El Account SID de Twilio es obligatorio' }, { status: 400 })
  if (!twilio_auth_token?.trim())
    return NextResponse.json({ error: 'El Auth Token de Twilio es obligatorio' }, { status: 400 })
  if (!twilio_phone_number?.trim())
    return NextResponse.json({ error: 'El número de Twilio es obligatorio' }, { status: 400 })

  // Comprobar si ya existe un phone number en VAPI para esta cuenta
  // Si existe, lo eliminamos primero para evitar duplicados
  const { data: existingConfig } = await admin
    .from('vapi_configs')
    .select('vapi_phone_number_id')
    .eq('account_id', accountUser.account_id)
    .single()

  if (existingConfig?.vapi_phone_number_id) {
    // Intentar eliminar el número anterior de VAPI (no crítico si falla)
    await fetch(`https://api.vapi.ai/phone-number/${existingConfig.vapi_phone_number_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${process.env.VAPI_API_KEY}` },
    }).catch(() => null)
  }

  // Importar número en VAPI
  const vapiRes = await fetch('https://api.vapi.ai/phone-number', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      provider:         'twilio',
      number:           twilio_phone_number.trim(),
      twilioAccountSid: twilio_account_sid.trim(),
      twilioAuthToken:  twilio_auth_token.trim(),
    }),
  })

  if (!vapiRes.ok) {
    const err = await vapiRes.json().catch(() => ({}))
    const msg = (err as any)?.message ?? 'Error conectando con Twilio en VAPI'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const vapiPhone = await vapiRes.json()
  const vapi_phone_number_id = vapiPhone.id

  if (!vapi_phone_number_id) {
    return NextResponse.json({ error: 'VAPI no devolvió Phone Number ID' }, { status: 502 })
  }

  // Guardar en vapi_configs
  const { data, error } = await admin
    .from('vapi_configs')
    .upsert({
      account_id:           accountUser.account_id,
      vapi_phone_number_id,
      assistant_name:       assistant_name.trim(),
      twilio_account_sid:   twilio_account_sid.trim(),
      twilio_auth_token:    twilio_auth_token.trim(),
      twilio_phone_number:  twilio_phone_number.trim(),
      updated_at:           new Date().toISOString(),
    }, { onConflict: 'account_id' })
    .select('vapi_phone_number_id, assistant_name, active, twilio_phone_number, twilio_account_sid')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, config: data })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { active } = await request.json()
  if (typeof active !== 'boolean') {
    return NextResponse.json({ error: 'Campo active inválido' }, { status: 400 })
  }

  if (active) {
    const { data: config } = await admin
      .from('vapi_configs')
      .select('vapi_phone_number_id, assistant_name')
      .eq('account_id', accountUser.account_id)
      .single()

    if (!config?.vapi_phone_number_id?.trim()) {
      return NextResponse.json(
        { error: 'Conecta tu número de Twilio antes de activar' },
        { status: 400 }
      )
    }
    if (!config?.assistant_name?.trim()) {
      return NextResponse.json(
        { error: 'Añade el nombre del asistente antes de activar' },
        { status: 400 }
      )
    }
  }

  await admin
    .from('vapi_configs')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('account_id', accountUser.account_id)

  return NextResponse.json({ ok: true })
}