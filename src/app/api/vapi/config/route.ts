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
    vapi_phone_number_id,
    assistant_name,
    company_name,
    welcome_message,
  } = body

  const updates: any = {
    account_id:    accountUser!.account_id,
    assistant_name,
    company_name,
    welcome_message,
    updated_at:    new Date().toISOString(),
  }

  // Solo actualizar phone_number_id si se envía
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

  // Verificar que tiene phone_number_id antes de activar
  if (active) {
    const { data: config } = await admin
      .from('vapi_configs')
      .select('vapi_phone_number_id')
      .eq('account_id', accountUser!.account_id)
      .single()

    if (!config?.vapi_phone_number_id) {
      return NextResponse.json({ error: 'Añade tu número de teléfono de Twilio antes de activar' }, { status: 400 })
    }
  }

  await admin
    .from('vapi_configs')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('account_id', accountUser!.account_id)

  return NextResponse.json({ ok: true })
}