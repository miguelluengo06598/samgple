import { createClient } from '@/lib/supabase/server'
import ConectarTienda from './conectar-tienda'

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: accountUser } = await supabase
    .from('account_users')
    .select('account_id')
    .eq('user_id', user!.id)
    .single()

  const { data: stores } = await supabase
    .from('stores')
    .select('*')
    .eq('account_id', accountUser!.account_id)

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-medium text-gray-900 mb-4">Tiendas conectadas</h2>

        {stores && stores.length > 0 ? (
          <div className="space-y-3">
            {stores.map(store => (
              <div key={store.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{store.name ?? store.shopify_domain}</p>
                  <p className="text-xs text-gray-500">{store.shopify_domain}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full">
                  {store.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tienes tiendas conectadas.</p>
        )}
      </div>

      <ConectarTienda />
    </div>
  )
}