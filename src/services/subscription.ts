/**
 * src/services/subscription.ts
 *
 * Lógica de límites de suscripción.
 * - checkOrderLimit     → verifica si el account puede recibir un pedido nuevo
 * - checkWhatsAppLimit  → verifica si puede generar un mensaje WhatsApp
 * - incrementOrderUsage / incrementWhatsAppUsage → contadores atómicos vía RPC
 * - getSubscription     → datos completos para la página de suscripción
 */

import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS, type PlanId } from '@/lib/plans'

export type LimitCheck = {
  allowed: boolean
  used: number
  limit: number | null   // null = ilimitado
  plan: PlanId | null
  reason?: string        // mensaje en español para mostrar al usuario
}

type SubRow = {
  plan: string
  pedidos_usados: number
  whatsapp_usado: number
  periodo_inicio: string
  periodo_fin: string
  activo: boolean
}

async function getActiveSub(accountId: string): Promise<SubRow | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('subscriptions')
    .select('plan, pedidos_usados, whatsapp_usado, periodo_inicio, periodo_fin, activo')
    .eq('account_id', accountId)
    .eq('activo', true)
    .single()
  return data ?? null
}

async function deactivateExpired(accountId: string) {
  const admin = createAdminClient()
  await admin
    .from('subscriptions')
    .update({ activo: false, updated_at: new Date().toISOString() })
    .eq('account_id', accountId)
    .eq('activo', true)
    .lt('periodo_fin', new Date().toISOString())
}

export async function checkOrderLimit(accountId: string): Promise<LimitCheck> {
  const sub = await getActiveSub(accountId)

  if (!sub) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      plan: null,
      reason: 'Sin suscripción activa. Activa un plan desde Configuración → Suscripción.',
    }
  }

  if (new Date(sub.periodo_fin) < new Date()) {
    await deactivateExpired(accountId)
    return {
      allowed: false,
      used: sub.pedidos_usados,
      limit: 0,
      plan: sub.plan as PlanId,
      reason: 'Tu suscripción ha expirado. Renuévala para seguir recibiendo pedidos.',
    }
  }

  const plan = PLANS[sub.plan as PlanId]
  if (!plan) {
    return { allowed: false, used: 0, limit: 0, plan: null, reason: 'Plan no reconocido.' }
  }

  if (plan.orders_limit === null) {
    return { allowed: true, used: sub.pedidos_usados, limit: null, plan: sub.plan as PlanId }
  }

  if (sub.pedidos_usados >= plan.orders_limit) {
    return {
      allowed: false,
      used: sub.pedidos_usados,
      limit: plan.orders_limit,
      plan: sub.plan as PlanId,
      reason: `Límite de pedidos alcanzado (${sub.pedidos_usados}/${plan.orders_limit}). Actualiza tu plan para continuar.`,
    }
  }

  return { allowed: true, used: sub.pedidos_usados, limit: plan.orders_limit, plan: sub.plan as PlanId }
}

export async function checkWhatsAppLimit(accountId: string): Promise<LimitCheck> {
  const sub = await getActiveSub(accountId)

  if (!sub) {
    return {
      allowed: false,
      used: 0,
      limit: 0,
      plan: null,
      reason: 'Sin suscripción activa. Activa un plan desde Configuración → Suscripción.',
    }
  }

  if (new Date(sub.periodo_fin) < new Date()) {
    await deactivateExpired(accountId)
    return {
      allowed: false,
      used: sub.whatsapp_usado,
      limit: 0,
      plan: sub.plan as PlanId,
      reason: 'Tu suscripción ha expirado. Renuévala para continuar.',
    }
  }

  const plan = PLANS[sub.plan as PlanId]
  if (!plan) {
    return { allowed: false, used: 0, limit: 0, plan: null, reason: 'Plan no reconocido.' }
  }

  if (plan.whatsapp_limit === null) {
    return { allowed: true, used: sub.whatsapp_usado, limit: null, plan: sub.plan as PlanId }
  }

  if (sub.whatsapp_usado >= plan.whatsapp_limit) {
    return {
      allowed: false,
      used: sub.whatsapp_usado,
      limit: plan.whatsapp_limit,
      plan: sub.plan as PlanId,
      reason: `Límite de mensajes WhatsApp alcanzado (${sub.whatsapp_usado}/${plan.whatsapp_limit}). Actualiza tu plan para continuar.`,
    }
  }

  return { allowed: true, used: sub.whatsapp_usado, limit: plan.whatsapp_limit, plan: sub.plan as PlanId }
}

export async function incrementOrderUsage(accountId: string): Promise<void> {
  const admin = createAdminClient()
  await admin.rpc('increment_order_usage', { p_account_id: accountId })
}

export async function incrementWhatsAppUsage(accountId: string): Promise<void> {
  const admin = createAdminClient()
  await admin.rpc('increment_whatsapp_usage', { p_account_id: accountId })
}

export async function getSubscription(accountId: string): Promise<SubRow | null> {
  return getActiveSub(accountId)
}
