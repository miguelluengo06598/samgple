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
    .select('vapi_phone_number_id, assistant_name, active')
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

  const { vapi_phone_number_id, assistant_name } = await request.json()

  if (!vapi_phone_number_id?.trim()) {
    return NextResponse.json({ error: 'El Phone Number ID es obligatorio' }, { status: 400 })
  }
  if (!assistant_name?.trim()) {
    return NextResponse.json({ error: 'El nombre del asistente es obligatorio' }, { status: 400 })
  }

  const { data, error } = await admin
    .from('vapi_configs')
    .upsert({
      account_id:          accountUser.account_id,
      vapi_phone_number_id: vapi_phone_number_id.trim(),
      assistant_name:       assistant_name.trim(),
      updated_at:           new Date().toISOString(),
    }, { onConflict: 'account_id' })
    .select('vapi_phone_number_id, assistant_name, active')
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
        { error: 'Añade tu Phone Number ID antes de activar' },
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