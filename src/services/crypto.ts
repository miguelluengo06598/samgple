/**
 * src/services/crypto.ts
 *
 * Encriptación AES-256-GCM para datos sensibles en BD.
 *
 * - encrypt/decrypt       → AES-256-GCM con IV aleatorio (más seguro, para datos que no se buscan)
 * - encryptDet/decryptDet → AES-256-CBC con IV fijo derivado de la clave (determinista,
 *                           mismo input → mismo output, permite buscar en BD por valor exacto)
 *
 * ENCRYPTION_KEY debe ser una cadena hex de 64 chars (32 bytes).
 * Genera una con: openssl rand -hex 32
 */

import crypto from 'crypto'

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) throw new Error('ENCRYPTION_KEY no configurada')
  if (key.length !== 64) throw new Error('ENCRYPTION_KEY debe tener 64 caracteres hex (32 bytes)')
  return Buffer.from(key, 'hex')
}

// ── AES-256-GCM (no determinista) ──────────────────────────────────────────
// Formato guardado en BD: <iv_hex>:<authTag_hex>:<ciphertext_hex>

export function encrypt(plaintext: string | null | undefined): string | null {
  if (plaintext == null || plaintext === '') return null
  const key = getKey()
  const iv  = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag   = cipher.getAuthTag()
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(ciphertext: string | null | undefined): string | null {
  if (ciphertext == null || ciphertext === '') return null
  // Si no tiene el formato encriptado, devolver tal cual (datos legacy)
  if (!ciphertext.includes(':')) return ciphertext
  try {
    const [ivHex, authTagHex, encryptedHex] = ciphertext.split(':')
    const key        = getKey()
    const iv         = Buffer.from(ivHex, 'hex')
    const authTag    = Buffer.from(authTagHex, 'hex')
    const encrypted  = Buffer.from(encryptedHex, 'hex')
    const decipher   = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
  } catch {
    // Si falla (dato legacy sin encriptar), devolver tal cual
    return ciphertext
  }
}

// ── AES-256-CBC determinista (para búsqueda por valor exacto) ──────────────
// IV derivado de la clave — mismo input siempre produce mismo output
// Formato guardado en BD: det:<ciphertext_hex>

export function encryptDet(plaintext: string | null | undefined): string | null {
  if (plaintext == null || plaintext === '') return null
  const key        = getKey()
  const iv         = key.slice(0, 16)   // IV fijo derivado de la clave
  const normalized = plaintext.toLowerCase().trim()
  const cipher     = crypto.createCipheriv('aes-256-cbc', key, iv)
  const encrypted  = Buffer.concat([cipher.update(normalized, 'utf8'), cipher.final()])
  return `det:${encrypted.toString('hex')}`
}

export function decryptDet(ciphertext: string | null | undefined): string | null {
  if (ciphertext == null || ciphertext === '') return null
  if (!ciphertext.startsWith('det:')) return ciphertext  // legacy
  try {
    const key       = getKey()
    const iv        = key.slice(0, 16)
    const encrypted = Buffer.from(ciphertext.slice(4), 'hex')
    const decipher  = crypto.createDecipheriv('aes-256-cbc', key, iv)
    return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
  } catch {
    return ciphertext
  }
}

// ── Helpers para objetos completos ─────────────────────────────────────────

/** Encripta un customer antes de guardarlo en BD */
export function encryptCustomer(c: {
  first_name?: string | null
  last_name?:  string | null
  email?:      string | null
  phone?:      string | null
}) {
  return {
    first_name: encrypt(c.first_name),
    last_name:  encrypt(c.last_name),
    email:      encryptDet(c.email),   // determinista → permite buscar por email exacto
    phone:      encryptDet(c.phone),   // determinista → permite buscar por teléfono exacto
  }
}

/** Desencripta un customer recibido de BD */
export function decryptCustomer(c: any): any {
  if (!c) return c
  return {
    ...c,
    first_name: decrypt(c.first_name),
    last_name:  decrypt(c.last_name),
    email:      decryptDet(c.email),
    phone:      decryptDet(c.phone),
  }
}

/** Desencripta una lista de pedidos con sus relaciones */
export function decryptOrders(orders: any[]): any[] {
  return orders.map(o => ({
    ...o,
    phone:            decryptDet(o.phone),
    shipping_address: decryptShippingAddress(o.shipping_address),
    customers:        o.customers ? decryptCustomer(o.customers) : null,
  }))
}

/** Desencripta shipping_address (jsonb) */
export function decryptShippingAddress(addr: any): any {
  if (!addr) return addr
  if (typeof addr === 'string') {
    try { addr = JSON.parse(addr) } catch { return addr }
  }
  return {
    ...addr,
    address1: decrypt(addr.address1),
    address2: decrypt(addr.address2),
    phone:    decryptDet(addr.phone),
    // city, province, country, zip no son sensibles → texto plano
  }
}