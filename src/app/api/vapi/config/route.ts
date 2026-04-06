export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { assistant_name, twilio_account_sid, twilio_auth_token, twilio_phone_number } = await request.json()

  if (!assistant_name?.trim())       return NextResponse.json({ error: 'El nombre del asistente es obligatorio' }, { status: 400 })
  if (!twilio_account_sid?.trim())   return NextResponse.json({ error: 'El Account SID de Twilio es obligatorio' }, { status: 400 })
  if (!twilio_auth_token?.trim())    return NextResponse.json({ error: 'El Auth Token de Twilio es obligatorio' }, { status: 400 })
  if (!twilio_phone_number?.trim())  return NextResponse.json({ error: 'El número de Twilio es obligatorio' }, { status: 400 })

  // Crear/importar número en VAPI
  const vapiRes = await fetch('https://api.vapi.ai/phone-number', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      provider:          'twilio',
      number:            twilio_phone_number.trim(),
      twilioAccountSid:  twilio_account_sid.trim(),
      twilioAuthToken:   twilio_auth_token.trim(),
    }),
  })

  if (!vapiRes.ok) {
    const err = await vapiRes.json().catch(() => ({}))
    const msg = err?.message ?? 'Error conectando con VAPI'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const vapiPhone = await vapiRes.json()
  const vapi_phone_number_id = vapiPhone.id

  if (!vapi_phone_number_id) {
    return NextResponse.json({ error: 'VAPI no devolvió Phone Number ID' }, { status: 502 })
  }

  // Guardar todo en vapi_configs
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
    .select('vapi_phone_number_id, assistant_name, active, twilio_phone_number')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, config: data })
}