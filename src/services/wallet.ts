import { createAdminClient } from '@/lib/supabase/admin'

export async function getWallet(accountId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('account_id', accountId)
    .single()

  if (error) throw new Error(`Error obteniendo wallet: ${error.message}`)
  return data
}

export async function hasBalance(accountId: string, required: number): Promise<boolean> {
  try {
    const wallet = await getWallet(accountId)
    return wallet.balance >= required
  } catch {
    return false
  }
}

export async function deductBalance(
  accountId: string,
  amount: number,
  type: string,
  description: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createAdminClient()

  const wallet = await getWallet(accountId)

  if (wallet.balance < amount) {
    throw new Error('Saldo insuficiente')
  }

  const newBalance = Number(wallet.balance) - amount

  const { error: walletError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('account_id', accountId)

  if (walletError) throw new Error(`Error actualizando wallet: ${walletError.message}`)

  const { error: movementError } = await supabase
    .from('wallet_movements')
    .insert({
      account_id: accountId,
      wallet_id: wallet.id,
      type: type as any,
      amount: -amount,
      balance_after: newBalance,
      description,
      metadata: metadata ?? null,
    })

  if (movementError) throw new Error(`Error registrando movimiento: ${movementError.message}`)

  return { balance: newBalance }
}

export async function addBalance(
  accountId: string,
  amount: number,
  type: string,
  description: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createAdminClient()

  const wallet = await getWallet(accountId)
  const newBalance = Number(wallet.balance) + amount

  const { error: walletError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('account_id', accountId)

  if (walletError) throw new Error(`Error actualizando wallet: ${walletError.message}`)

  const { error: movementError } = await supabase
    .from('wallet_movements')
    .insert({
      account_id: accountId,
      wallet_id: wallet.id,
      type: type as any,
      amount: amount,
      balance_after: newBalance,
      description,
      metadata: metadata ?? null,
    })

  if (movementError) throw new Error(`Error registrando movimiento: ${movementError.message}`)

  return { balance: newBalance }
}