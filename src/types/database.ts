export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
        order_risk_analyses: {
        Row: {
          id: string
          order_id: string
          account_id: string
          risk_score: number
          risk_level: 'bajo' | 'medio' | 'alto' | 'muy_alto'
          base_score: number
          ai_score: number
          summary: string | null
          human_explanation: string | null
          recommendation: string | null
          customer_message: string | null
          ai_model: string | null
          analysed_at: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_risk_analyses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['order_risk_analyses']['Insert']>
      }
      order_risk_tags: {
        Row: {
          id: string
          order_id: string
          account_id: string
          tag: string
          source: 'ai' | 'rules' | 'manual'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_risk_tags']['Row'], 'id' | 'created_at'>
        Update: never
      }
      ai_jobs: {
        Row: {
          id: string
          account_id: string
          order_id: string | null
          status: 'pending' | 'running' | 'done' | 'failed'
          type: string
          error: string | null
          started_at: string | null
          finished_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_jobs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ai_jobs']['Insert']>
      }
        stores: {
        Row: {
          id: string
          account_id: string
          shopify_domain: string
          name: string | null
          access_token: string
          status: 'active' | 'inactive' | 'error'
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stores']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['stores']['Insert']>
      }
      customers: {
        Row: {
          id: string
          account_id: string
          store_id: string
          shopify_customer_id: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          total_orders: number
          total_delivered: number
          total_cancelled: number
          total_returned: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      products: {
        Row: {
          id: string
          account_id: string
          store_id: string
          shopify_product_id: string | null
          shopify_variant_id: string | null
          name: string
          sku: string | null
          cost_price: number
          shipping_cost: number
          return_cost: number
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          account_id: string
          store_id: string
          customer_id: string | null
          external_order_id: string
          order_number: string | null
          status: 'confirmar' | 'confirmado' | 'preparado' | 'enviado' | 'entregado' | 'incidencia' | 'devolucion' | 'cancelado'
          total_price: number
          currency: string
          shipping_address: Json | null
          phone: string | null
          tracking_number: string | null
          notes: string | null
          ai_charged: boolean
          next_reappear_at: string | null
          raw_payload: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          account_id: string
          product_id: string | null
          name: string
          quantity: number
          price: number
          sku: string | null
          shopify_variant_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: never
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          account_id: string
          from_status: string | null
          to_status: string
          changed_by: string
          note: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_status_history']['Row'], 'id' | 'created_at'>
        Update: never
      }
      accounts: {
        Row: {
          id: string
          name: string
          email: string
          status: 'active' | 'suspended' | 'cancelled'
          plan: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['accounts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['accounts']['Insert']>
      }
      account_profiles: {
        Row: {
          id: string
          account_id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          timezone: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['account_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['account_profiles']['Insert']>
      }
      account_users: {
        Row: {
          id: string
          account_id: string
          user_id: string
          role: 'owner' | 'admin' | 'member'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['account_users']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['account_users']['Insert']>
      }
      wallets: {
        Row: {
          id: string
          account_id: string
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['wallets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['wallets']['Insert']>
      }
      wallet_movements: {
        Row: {
          id: string
          account_id: string
          wallet_id: string
          type: 'payment_topup' | 'coupon_credit' | 'manual_adjustment' | 'order_analysis_charge' | 'call_charge' | 'report_charge' | 'profitability_charge' | 'refund' | 'admin_grant' | 'admin_deduction'
          amount: number
          balance_after: number
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['wallet_movements']['Row'], 'id' | 'created_at'>
        Update: never
      }
    }
    Functions: {
      get_account_id: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
}


