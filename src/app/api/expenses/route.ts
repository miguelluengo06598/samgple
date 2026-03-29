import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const { searchParams } = request.nextUrl
  const filter = searchParams.get('filter') ?? 'week'

  let fromDate = new Date()
  if (filter === 'today') {
    fromDate.setHours(0, 0, 0, 0)
  } else if (filter === 'week') {
    fromDate.setDate(fromDate.getDate() - 7)
  } else if (filter === 'month') {
    fromDate.setDate(1)
    fromDate.setHours(0, 0, 0, 0)
  } else {
    fromDate = new Date('2020-01-01')
  }

  const { data: expenses } = await adminSupabase
    .from('manual_expenses')
    .select('*')
    .eq('account_id', accountUser.account_id)
    .gte('expense_date', fromDate.toISOString().split('T')[0])
    .order('expense_date', { ascending: false })

  return NextResponse.json({ expenses: expenses ?? [] })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const adminSupabase = createAdminClient()
  const { data: accountUser } = await adminSupabase
    .from('account_users').select('account_id').eq('user_id', user.id).single()
  if (!accountUser) return NextResponse.json({ error: 'Sin cuenta' }, { status: 403 })

  const body = await request.json()
  const { concept, amount, category, expense_date, notes } = body

  if (!concept || !amount) {
    return NextResponse.json({ error: 'Concepto e importe son obligatorios' }, { status: 400 })
  }

  const { data, error } = await adminSupabase
    .from('manual_expenses')
    .insert({
      account_id: accountUser.account_id,
      concept,
      amount: parseFloat(amount),
      category: category ?? 'general',
      expense_date: expense_date ?? new Date().toISOString().split('T')[0],
      notes: notes ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ expense: data })
}