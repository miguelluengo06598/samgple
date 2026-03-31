import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()

  // Primero traemos las cuentas
  const { data: accounts } = await admin
    .from('accounts')
    .select('id, name, email, plan, status, created_at')
    .order('created_at', { ascending: false })

  if (!accounts) return NextResponse.json({ accounts: [] })

  // Luego traemos los wallets por separado para asegurar el balance correcto
  const { data: wallets } = await admin
    .from('wallets')
    .select('account_id, balance')
    .in('account_id', accounts.map(a => a.id))

  // Unimos manualmente
  const accountsWithWallets = accounts.map(acc => ({
    ...acc,
    wallets: wallets?.filter(w => w.account_id === acc.id) ?? [],
  }))

  return NextResponse.json({ accounts: accountsWithWallets })
}