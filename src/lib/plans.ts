export type PlanId = 'basico' | 'profesional' | 'enterprise'

export type Plan = {
  id: PlanId
  name: string
  price: number
  orders_limit: number | null   // null = ilimitado
  whatsapp_limit: number | null
  stores_limit: number | null
  support: string
  color: string
  accent: string
  gradient: string
  popular: boolean
}

export const PLANS: Record<PlanId, Plan> = {
  basico: {
    id: 'basico',
    name: 'Básico',
    price: 6.99,
    orders_limit: 500,
    whatsapp_limit: 3_000,
    stores_limit: 3,
    support: 'Estándar',
    color: '#0284c7',
    accent: '#38bdf8',
    gradient: 'linear-gradient(135deg,#0284c7,#0369a1)',
    popular: false,
  },
  profesional: {
    id: 'profesional',
    name: 'Profesional',
    price: 17.99,
    orders_limit: 2_000,
    whatsapp_limit: 10_000,
    stores_limit: 10,
    support: 'Premium',
    color: '#7c3aed',
    accent: '#a78bfa',
    gradient: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 84.99,
    orders_limit: null,
    whatsapp_limit: null,
    stores_limit: null,
    support: 'Prioritario',
    color: '#0f766e',
    accent: '#2EC4B6',
    gradient: 'linear-gradient(135deg,#0f766e,#0d9488)',
    popular: false,
  },
}

export const PLAN_IDS = Object.keys(PLANS) as PlanId[]
