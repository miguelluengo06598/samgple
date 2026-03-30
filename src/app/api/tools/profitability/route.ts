import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { inversion, unidades, precioVenta, costeProducto, costoEnvio, diasCampana, cpaReal, roi, beneficioNeto } = body

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: 'Eres un consultor experto en eCommerce COD español. Responde siempre en español. Sé directo, práctico y breve. Máximo 4 frases.',
        },
        {
          role: 'user',
          content: `Analiza estos datos de campaña y dame una recomendación concreta:
- Inversión en ads: ${inversion}€
- Unidades vendidas: ${unidades}
- Precio de venta: ${precioVenta}€
- Coste producto: ${costeProducto}€
- Coste envío: ${costoEnvio}€
- Días de campaña: ${diasCampana}
- CPA real: ${cpaReal}€
- ROI: ${roi}%
- Beneficio neto: ${beneficioNeto}€

Dame solo la recomendación sin introducción. Directo al grano.`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('OpenAI error:', err)
    return NextResponse.json({ error: 'Error al conectar con IA' }, { status: 500 })
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content ?? 'No se pudo obtener respuesta'

  return NextResponse.json({ recomendacion: text })
}