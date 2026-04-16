/**
 * GET  /api/external-stores  → listar tiendas externas de la cuenta
 * POST /api/external-stores  → crear nueva tienda y generar credenciales
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { encrypt } from '@/services/crypto'

/** Obtiene el account_id del usuario autenticado o devuelve null */
async function getAccountId(request: NextRequest): Promise<{ userId: string; accountId: string } | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data } = await admin
    .from('account_users')
    .select('account_id')
    .eq('user_id', user.id)
    .single()

  if (!data) return null
  return { userId: user.id, accountId: data.account_id }
}

// ── GET: listar tiendas externas ──────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const auth = await getAccountId(request)
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: stores, error } = await admin
    .from('external_stores')
    .select('id, name, token, active, created_at')
    .eq('account_id', auth.accountId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // NOTA: nunca devolvemos el 'secret' — el cliente solo ve el token.
  // El secret solo se muestra UNA VEZ al crear o regenerar credenciales.
  return NextResponse.json({ stores: stores ?? [] })
}

// ── POST: crear nueva tienda externa ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  const auth = await getAccountId(request)
  if (!auth) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const name = body?.name?.trim()
  if (!name) {
    return NextResponse.json({ error: 'El campo "name" es requerido' }, { status: 400 })
  }

  // Generar credenciales: token (identificador) + secret (para firmar HMAC)
  const token  = crypto.randomBytes(32).toString('hex')   // 64 chars hex
  const secret = crypto.randomBytes(32).toString('hex')   // 64 chars hex

  const admin = createAdminClient()
  const { data: store, error } = await admin
    .from('external_stores')
    .insert({
      account_id: auth.accountId,
      name,
      token,
      secret: encrypt(secret)!,   // cifrado AES-256-GCM — se descifra en el webhook
      active: true,
    })
    .select('id, name, active, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Devolvemos el token y el secret en texto plano UNA SOLA VEZ.
  // El secret no se puede recuperar después — solo regenerar.
  return NextResponse.json({
    store:  { ...store, token },
    secret,
    warning: 'Guarda el secret ahora — no se puede recuperar después.',
  }, { status: 201 })
}
