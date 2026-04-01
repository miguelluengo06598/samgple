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

  const { data } = await admin
    .from('vapi_configs')
    .select('*')
    .eq('account_id', accountUser!.account_id)
    .single()

  // Ocultar keys completas por seguridad — mostrar solo últimos 4 chars
  if (data?.vapi_api_key) {
    data.vapi_api_key_masked = `••••••••${data.vapi_api_key.slice(-4)}`
    delete data.vapi_api_key
  }

  return NextResponse.json({ config: data ?? null })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users').select('account_id').eq('user_id', user.id).single()

  const body = await request.json()
  const {
    vapi_api_key, vapi_assistant_id, vapi_phone_number_id,
    assistant_name, assistant_gender, company_name, welcome_message
  } = body

  const updates: any = {
    account_id: accountUser!.account_id,
    assistant_name, assistant_gender, company_name, welcome_message,
    updated_at: new Date().toISOString(),
  }

  // Solo actualizar keys si se envían (no vacías)
  if (vapi_api_key && !vapi_api_key.includes('••')) updates.vapi_api_key = vapi_api_key
  if (vapi_assistant_id) updates.vapi_assistant_id = vapi_assistant_id
  if (vapi_phone_number_id) updates.vapi_phone_number_id = vapi_phone_number_id

  const { data, error } = await admin
    .from('vapi_configs')
    .upsert(updates, { onConflict: 'account_id' })
    .select()
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

  const { active } = await request.json()

  // Verificar que tiene config completa antes de activar
  if (active) {
    const { data: config } = await admin
      .from('vapi_configs')
      .select('vapi_api_key, vapi_assistant_id, vapi_phone_number_id')
      .eq('account_id', accountUser!.account_id)
      .single()

    if (!config?.vapi_api_key || !config?.vapi_assistant_id || !config?.vapi_phone_number_id) {
      return NextResponse.json({ error: 'Completa la configuración antes de activar' }, { status: 400 })
    }
  }

  await admin.from('vapi_configs').update({ active, updated_at: new Date().toISOString() }).eq('account_id', accountUser!.account_id)
  return NextResponse.json({ ok: true })
}