/**
 * scripts/encrypt-existing-data.ts
 *
 * Encripta todos los datos sensibles existentes en la BD.
 * Ejecutar UNA SOLA VEZ antes de desplegar el nuevo código.
 *
 * Uso:
 *   ENCRYPTION_KEY=tu_clave npx tsx scripts/encrypt-existing-data.ts
 *
 * Requisitos:
 *   npm install @supabase/supabase-js tsx dotenv
 */

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// ── Funciones de encriptación (copiadas de crypto.ts) ───────────────────────

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY!
  return Buffer.from(key, 'hex')
}

function isAlreadyEncrypted(value: string): boolean {
  // GCM: tiene 2 ":" separando iv:authTag:cipher
  if (value.includes(':') && value.split(':').length === 3) return true
  // CBC determinista
  if (value.startsWith('det:')) return true
  return false
}

function encrypt(plaintext: string | null): string | null {
  if (!plaintext) return null
  if (isAlreadyEncrypted(plaintext)) return plaintext  // ya encriptado
  const key    = getKey()
  const iv     = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const enc    = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag    = cipher.getAuthTag()
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`
}

function encryptDet(plaintext: string | null): string | null {
  if (!plaintext) return null
  if (isAlreadyEncrypted(plaintext)) return plaintext
  const key        = getKey()
  const iv         = key.slice(0, 16)
  const normalized = plaintext.toLowerCase().trim()
  const cipher     = crypto.createCipheriv('aes-256-cbc', key, iv)
  const enc        = Buffer.concat([cipher.update(normalized, 'utf8'), cipher.final()])
  return `det:${enc.toString('hex')}`
}

function encryptAddress(addr: any): any {
  if (!addr) return addr
  return {
    ...addr,
    address1: encrypt(addr.address1),
    address2: encrypt(addr.address2),
    phone:    encryptDet(addr.phone),
  }
}

// ── Cliente Supabase ─────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ── Migración ────────────────────────────────────────────────────────────────

async function migrateCustomers() {
  console.log('\n── Migrando customers ──')
  let page = 0
  const pageSize = 100

  while (true) {
    const { data, error } = await supabase
      .from('customers')
      .select('id, first_name, last_name, email, phone')
      .or('data_encrypted.is.null,data_encrypted.eq.false')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) { console.error('Error:', error); break }
    if (!data || data.length === 0) break

    for (const row of data) {
      await supabase.from('customers').update({
        first_name:     encrypt(row.first_name),
        last_name:      encrypt(row.last_name),
        email:          encryptDet(row.email),
        phone:          encryptDet(row.phone),
        data_encrypted: true,
      }).eq('id', row.id)
    }

    console.log(`  ✓ ${page * pageSize + data.length} customers migrados`)
    if (data.length < pageSize) break
    page++
  }
}

async function migrateOrders() {
  console.log('\n── Migrando orders ──')
  let page = 0
  const pageSize = 100

  while (true) {
    const { data, error } = await supabase
      .from('orders')
      .select('id, phone, shipping_address')
      .or('data_encrypted.is.null,data_encrypted.eq.false')
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) { console.error('Error:', error); break }
    if (!data || data.length === 0) break

    for (const row of data) {
      await supabase.from('orders').update({
        phone:            encryptDet(row.phone),
        shipping_address: encryptAddress(row.shipping_address),
        data_encrypted:   true,
      }).eq('id', row.id)
    }

    console.log(`  ✓ ${page * pageSize + data.length} orders migrados`)
    if (data.length < pageSize) break
    page++
  }
}

async function migrateStores() {
  console.log('\n── Migrando stores ──')
  const { data, error } = await supabase
    .from('stores')
    .select('id, access_token')
    .or('data_encrypted.is.null,data_encrypted.eq.false')

  if (error) { console.error('Error:', error); return }
  if (!data) return

  for (const row of data) {
    await supabase.from('stores').update({
      access_token:   encrypt(row.access_token),
      data_encrypted: true,
    }).eq('id', row.id)
  }
  console.log(`  ✓ ${data.length} stores migradas`)
}

async function migrateVapiConfigs() {
  console.log('\n── Migrando vapi_configs ──')
  const { data, error } = await supabase
    .from('vapi_configs')
    .select('id, vapi_phone_number_id')
    .or('data_encrypted.is.null,data_encrypted.eq.false')

  if (error) { console.error('Error:', error); return }
  if (!data) return

  for (const row of data) {
    await supabase.from('vapi_configs').update({
      vapi_phone_number_id: encrypt(row.vapi_phone_number_id),
      data_encrypted:       true,
    }).eq('id', row.id)
  }
  console.log(`  ✓ ${data.length} vapi_configs migradas`)
}

async function migrateCallLogs() {
  console.log('\n── Migrando call_logs (transcripts) ──')
  let page = 0
  const pageSize = 50

  while (true) {
    const { data, error } = await supabase
      .from('call_logs')
      .select('id, transcript')
      .or('data_encrypted.is.null,data_encrypted.eq.false')
      .not('transcript', 'is', null)
      .range(page * pageSize, (page + 1) * pageSize - 1)

    if (error) { console.error('Error:', error); break }
    if (!data || data.length === 0) break

    for (const row of data) {
      await supabase.from('call_logs').update({
        transcript:     encrypt(row.transcript),
        data_encrypted: true,
      }).eq('id', row.id)
    }

    console.log(`  ✓ ${page * pageSize + data.length} call_logs migrados`)
    if (data.length < pageSize) break
    page++
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔐 Iniciando migración de encriptación...')
  console.log(`   SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  console.log(`   ENCRYPTION_KEY: ${process.env.ENCRYPTION_KEY ? '✓ configurada' : '✗ FALTA'}`)

  if (!process.env.ENCRYPTION_KEY) {
    console.error('\n❌ ENCRYPTION_KEY no configurada. Abortando.')
    process.exit(1)
  }

  await migrateCustomers()
  await migrateOrders()
  await migrateStores()
  await migrateVapiConfigs()
  await migrateCallLogs()

  console.log('\n✅ Migración completada.')
}

main().catch(console.error)