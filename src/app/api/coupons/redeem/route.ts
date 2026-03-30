import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { addBalance } from '@/services/wallet'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin.from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { code } = await request.json()
  if (!code) return NextResponse.json({ error: 'Código requerido' }, { status: 400 })

  const { data: coupon } = await admin
    .from('token_coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('active', true)
    .single()

  if (!coupon) return NextResponse.json({ error: 'Cupón no válido o expirado' }, { status: 404 })

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Cupón expirado' }, { status: 400 })
  }

  if (coupon.uses >= coupon.max_uses) {
    return NextResponse.json({ error: 'Cupón agotado' }, { status: 400 })
  }

  const { data: existing } = await admin
    .from('coupon_redemptions')
    .select('id')
    .eq('account_id', accountUser.account_id)
    .eq('coupon_id', coupon.id)
    .single()

  if (existing) return NextResponse.json({ error: 'Ya canjeaste este cupón' }, { status: 400 })

  await admin.from('coupon_redemptions').insert({ account_id: accountUser.account_id, coupon_id: coupon.id })
  await admin.from('token_coupons').update({ uses: coupon.uses + 1 }).eq('id', coupon.id)
  await addBalance(accountUser.account_id, coupon.tokens, 'coupon_credit', `Cupón ${code}`, { coupon_id: coupon.id })

  return NextResponse.json({ ok: true, tokens: coupon.tokens })
}