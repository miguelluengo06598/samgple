-- ============================================================
-- Migración: external_stores
-- Tabla para tiendas externas (no Shopify) que envían pedidos
-- vía webhook autenticado con token + firma HMAC-SHA256.
--
-- Ejecutar en Supabase SQL Editor o con supabase db push.
-- ============================================================

CREATE TABLE IF NOT EXISTS external_stores (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id  uuid        NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

  -- Nombre descriptivo de la tienda (ej: "Mi tienda WooCommerce")
  name        text        NOT NULL,

  -- Token de identificación (texto plano, 64 chars hex aleatorio).
  -- La tienda lo envía en la cabecera "x-store-token" de cada webhook.
  -- No es un secreto por sí solo — la seguridad real viene del HMAC.
  token       text        NOT NULL UNIQUE,

  -- Secreto para verificar la firma HMAC-SHA256.
  -- NOTA: se almacena CIFRADO con AES-256-GCM (no hasheado con bcrypt)
  -- porque necesitamos recuperar el valor original para verificar el HMAC.
  -- Un hash unidireccional (bcrypt) haría imposible la verificación.
  secret      text        NOT NULL,

  -- Si está desactivada, el webhook rechaza peticiones aunque el HMAC sea válido.
  active      boolean     NOT NULL DEFAULT true,

  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Índice para lookup rápido por token (ruta crítica del webhook)
CREATE INDEX IF NOT EXISTS external_stores_token_idx
  ON external_stores (token);

-- Índice para listar las tiendas de una cuenta
CREATE INDEX IF NOT EXISTS external_stores_account_idx
  ON external_stores (account_id);

-- RLS: cada cuenta solo ve sus propias tiendas externas
ALTER TABLE external_stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cuenta solo ve sus tiendas externas"
  ON external_stores FOR ALL
  USING (
    account_id IN (
      SELECT account_id FROM account_users WHERE user_id = auth.uid()
    )
  );
