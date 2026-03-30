import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const adminSupabase = createAdminClient()
  const formData = await request.formData()
  const file = formData.get('file') as File
  const productId = formData.get('productId') as string

  if (!file) return NextResponse.json({ error: 'No hay archivo' }, { status: 400 })

  const ext = file.name.split('.').pop()
  const filename = `${productId}-${Date.now()}.${ext}`
  const buffer = await file.arrayBuffer()

  const { data, error } = await adminSupabase.storage
    .from('product-images')
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: urlData } = adminSupabase.storage
    .from('product-images')
    .getPublicUrl(filename)

  return NextResponse.json({ url: urlData.publicUrl })
}