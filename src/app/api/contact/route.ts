import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, orders, message, demo } = body

    // Validar campos obligatorios
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    // Validar longitud
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Mensaje demasiado largo' }, { status: 400 })
    }
    if (name.length > 200) {
      return NextResponse.json({ error: 'Nombre demasiado largo' }, { status: 400 })
    }

    // Validar formato email
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Anti-spam — máximo 3 mensajes por email en 24h
    const { count } = await admin
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

    if ((count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Ya has enviado varios mensajes hoy. Inténtalo mañana.' }, { status: 429 })
    }

    // Guardar mensaje
    const { error } = await admin.from('contact_messages').insert({
      name:       name.trim(),
      email:      email.trim().toLowerCase(),
      company:    company?.trim() || null,
      orders:     orders || null,
      message:    message.trim(),
      wants_demo: demo ?? false,
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Error al guardar el mensaje' }, { status: 500 })
  }
}