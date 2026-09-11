-- SETEMBRO X — schema base de performance de captação
create extension if not exists pgcrypto;

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  role text default 'captador',
  active boolean default true,
  monthly_goal integer default 22,
  team text,
  created_at timestamptz default now()
);

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  captured_at timestamptz not null default now(),
  professional_id uuid references public.professionals(id) on delete set null,
  qualification text not null check (qualification in ('Q','NQ','MQ')),
  sold boolean default false,
  vgv numeric(14,2) default 0,
  profession text,
  gross_income numeric(12,2),
  city text,
  state text,
  age_primary integer,
  age_partner integer,
  car_brand text,
  car_model text,
  car_value numeric(12,2),
  marital_status text,
  has_children boolean,
  children_count integer default 0,
  origin text,
  capture_point text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  professional_id uuid references public.professionals(id) on delete set null,
  couple_id uuid references public.couples(id) on delete set null,
  capture_point text,
  item text not null,
  quantity integer not null default 1 check (quantity > 0),
  unit_cost numeric(12,2) not null default 0 check (unit_cost >= 0),
  created_at timestamptz default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid references public.professionals(id) on delete cascade,
  month date not null,
  target_couples integer default 22,
  target_sales integer,
  target_vgv numeric(14,2),
  created_at timestamptz default now(),
  unique(professional_id, month)
);

create index if not exists couples_captured_at_idx on public.couples(captured_at);
create index if not exists couples_professional_idx on public.couples(professional_id);
create index if not exists couples_qualification_idx on public.couples(qualification);
create index if not exists couples_capture_point_idx on public.couples(capture_point);
create index if not exists gifts_occurred_at_idx on public.gifts(occurred_at);
create index if not exists gifts_professional_idx on public.gifts(professional_id);

create or replace view public.v_professional_performance as
select
  p.id,
  p.name,
  count(c.id)::int as couples,
  count(c.id) filter (where c.qualification='Q')::int as q,
  count(c.id) filter (where c.qualification='NQ')::int as nq,
  count(c.id) filter (where c.qualification='MQ')::int as mq,
  count(c.id) filter (where c.sold)::int as sales,
  coalesce(sum(c.vgv),0)::numeric(14,2) as vgv,
  case when count(c.id)=0 then 0 else round((count(c.id) filter (where c.sold)::numeric / count(c.id))*100,2) end as conversion,
  case when count(c.id)=0 then 0 else round((count(c.id) filter (where c.qualification='Q')::numeric / count(c.id))*100,2) end as efficiency,
  case when count(c.id) filter (where c.sold)=0 then 0 else round(coalesce(sum(c.vgv),0) / count(c.id) filter (where c.sold),2) end as avg_ticket,
  coalesce((select sum(g.quantity*g.unit_cost) from public.gifts g where g.professional_id=p.id),0)::numeric(14,2) as gift_cost,
  case when count(c.id)=0 then 0 else round(coalesce((select sum(g.quantity*g.unit_cost) from public.gifts g where g.professional_id=p.id),0) / count(c.id),2) end as cost_per_couple
from public.professionals p
left join public.couples c on c.professional_id=p.id
group by p.id,p.name;

alter table public.professionals enable row level security;
alter table public.couples enable row level security;
alter table public.gifts enable row level security;
alter table public.goals enable row level security;

drop policy if exists "authenticated read professionals" on public.professionals;
drop policy if exists "authenticated read couples" on public.couples;
drop policy if exists "authenticated read gifts" on public.gifts;
drop policy if exists "authenticated read goals" on public.goals;

create policy "authenticated read professionals" on public.professionals for select to authenticated using (true);
create policy "authenticated read couples" on public.couples for select to authenticated using (true);
create policy "authenticated read gifts" on public.gifts for select to authenticated using (true);
create policy "authenticated read goals" on public.goals for select to authenticated using (true);
