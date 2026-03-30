import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data: accounts } = await admin
    .from('accounts')
    .select(`*, wallets(balance), account_users(user_id), stores(count)`)
    .order('created_at', { ascending: false })

  return NextResponse.json({ accounts: accounts ?? [] })
}