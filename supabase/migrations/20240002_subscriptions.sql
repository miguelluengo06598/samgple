-- ─────────────────────────────────────────────────────────────────────────────
-- subscriptions
--   Gestiona el plan activo de cada cuenta y el consumo del período actual.
--   Un account solo puede tener UNA suscripción activa a la vez.
-- ─────────────────────────────────────────────────────────────────────────────

create table public.subscriptions (
  id               uuid        primary key default gen_random_uuid(),
  account_id       uuid        not null references public.accounts(id) on delete cascade,
  plan             text        not null check (plan in ('basico', 'profesional', 'enterprise')),
  pedidos_usados   integer     not null default 0,
  whatsapp_usado   integer     not null default 0,
  periodo_inicio   timestamptz not null default now(),
  periodo_fin      timestamptz not null default (now() + interval '1 month'),
  activo           boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Solo una suscripción activa por cuenta
create unique index subscriptions_one_active_per_account
  on public.subscriptions(account_id)
  where activo = true;

create index subscriptions_account_id_idx on public.subscriptions(account_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table public.subscriptions enable row level security;

create policy "account members can read own subscription"
  on public.subscriptions for select
  using (
    account_id in (
      select account_id from public.account_users where user_id = auth.uid()
    )
  );

-- ── Funciones de incremento atómico ──────────────────────────────────────────
-- Incrementos separados para evitar carrera de condición (race condition)
-- cuando múltiples pedidos llegan en paralelo.

create or replace function public.increment_order_usage(p_account_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.subscriptions
  set pedidos_usados = pedidos_usados + 1,
      updated_at     = now()
  where account_id = p_account_id
    and activo      = true
    and periodo_fin >= now();
end;
$$;

create or replace function public.increment_whatsapp_usage(p_account_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.subscriptions
  set whatsapp_usado = whatsapp_usado + 1,
      updated_at     = now()
  where account_id = p_account_id
    and activo      = true
    and periodo_fin >= now();
end;
$$;
