import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, orders, message, demo } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin.from('contact_messages').insert({
      name,
      email,
      company: company || null,
      orders: orders || null,
      message,
      wants_demo: demo ?? false,
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Error al guardar el mensaje' }, { status: 500 })
  }
}