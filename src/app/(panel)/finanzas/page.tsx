import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export default async function FinanzasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user!.id)
    .single()

  const accountId = accountUser!.account_id

  // Wallet
  const { data: wallet } = await adminSupabase
    .from('wallets')
    .select('balance')
    .eq('account_id', accountId)
    .single()

  // Movimientos recientes
  const { data: movements } = await adminSupabase
    .from('wallet_movements')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Pedidos entregados (ingresos)
  const { data: delivered } = await adminSupabase
    .from('orders')
    .select('total_price')
    .eq('account_id', accountId)
    .eq('status', 'entregado')

  const totalIngresos = delivered?.reduce((sum, o) => sum + Number(o.total_price), 0) ?? 0

  // Gastos manuales
  const { data: expenses } = await adminSupabase
    .from('wallet_movements')
    .select('amount')
    .eq('account_id', accountId)
    .lt('amount', 0)

  const totalGastos = Math.abs(expenses?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0)
  const beneficio = totalIngresos - totalGastos

  const TYPE_LABELS: Record<string, string> = {
    order_analysis_charge: 'Análisis IA',
    call_charge: 'Llamada',
    report_charge: 'Informe',
    payment_topup: 'Recarga',
    coupon_credit: 'Cupón',
    admin_grant: 'Ajuste admin',
    refund: 'Devolución',
    manual_adjustment: 'Ajuste manual',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Finanzas</h1>
          <a href="/configuracion" className="text-sm text-teal-600 font-medium">
            🪙 {wallet?.balance?.toFixed(2) ?? '0.00'} tokens
          </a>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Ingresos</p>
            <p className="text-lg font-bold text-green-600">{totalIngresos.toFixed(2)}€</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Gastos</p>
            <p className="text-lg font-bold text-red-500">{totalGastos.toFixed(2)}€</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Beneficio</p>
            <p className={`text-lg font-bold ${beneficio >= 0 ? 'text-teal-600' : 'text-red-500'}`}>
              {beneficio.toFixed(2)}€
            </p>
          </div>
        </div>

        {/* Movimientos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Actividad reciente</p>
          <div className="space-y-3">
            {movements?.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Sin actividad aún</p>
            )}
            {movements?.map(m => (
              <div key={m.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-800">{TYPE_LABELS[m.type] ?? m.type}</p>
                  {m.description && (
                    <p className="text-xs text-gray-400">{m.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${Number(m.amount) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {Number(m.amount) >= 0 ? '+' : ''}{Number(m.amount).toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-400">{m.balance_after} tokens</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}