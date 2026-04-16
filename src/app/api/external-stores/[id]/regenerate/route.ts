/**
 * POST /api/external-stores/[id]/regenerate
 *
 * Regenera las credenciales de una tienda externa.
 * - Genera nuevo token y nuevo secret aleatorios.
 * - Invalida los anteriores de forma inmediata.
 * - Devuelve las nuevas credenciales en texto plano UNA SOLA VEZ.
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { encrypt } from '@/services/crypto'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accountUser } = await admin
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const newToken  = crypto.randomBytes(32).toString('hex')
  const newSecret = crypto.randomBytes(32).toString('hex')

  const { error } = await admin
    .from('external_stores')
    .update({
      token:      newToken,
      secret:     encrypt(newSecret)!,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('account_id', accountUser.account_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    token:   newToken,
    secret:  newSecret,
    warning: 'Actualiza tu tienda con las nuevas credenciales. Las anteriores quedan invalidadas.',
  })
}
