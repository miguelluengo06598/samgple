import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminSecret } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { decryptCustomer, decryptDet } from '@/services/crypto'

export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const admin = createAdminClient()
  const { data } = await admin
    .from('call_requests')
    .select(`
      *,
      orders (
        id, order_number, total_price, status, call_status, phone,
        customers ( first_name, last_name, phone ),
        order_items ( name, quantity, price ),
        stores ( name )
      ),
      accounts ( name, email )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const decrypted = (data ?? []).map(req => ({
    ...req,
    orders: req.orders ? {
      ...req.orders,
      phone:     decryptDet(req.orders.phone),
      customers: req.orders.customers ? decryptCustomer(req.orders.customers) : null,
    } : null,
  }))

  return NextResponse.json({ requests: decrypted })
}