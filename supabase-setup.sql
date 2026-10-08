-- BillZestPOS: Supabase setup. Run once in Supabase > SQL Editor > New query.

create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  plan text not null check (plan in ('Starter','Business','Enterprise')),
  cycle text not null check (cycle in ('Monthly','Yearly')),
  status text not null check (status in ('Active','Trial','Suspended')),
  renew date not null,
  amt numeric not null default 0 check (amt >= 0),
  created_at timestamptz not null default now()
);
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  phone text not null check (char_length(phone) between 5 and 25),
  biz text check (char_length(biz) <= 60),
  plan text not null default 'Demo' check (plan in ('Demo','Starter','Business','Enterprise')),
  status text not null default 'New' check (status in ('New','Contacted','Won','Lost')),
  created_at timestamptz not null default now()
);
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (char_length(code) between 2 and 20),
  pct int not null check (pct between 1 and 90),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.settings (key text primary key, value jsonb not null);

alter table public.admins    enable row level security;
alter table public.customers enable row level security;
alter table public.leads     enable row level security;
alter table public.offers    enable row level security;
alter table public.settings  enable row level security;

create policy "admin reads self" on public.admins for select to authenticated using (user_id = auth.uid());
create policy "admin all" on public.customers for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.leads     for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.offers    for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin all" on public.settings  for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- The website form may only ADD a new lead. It cannot read, change or delete anything.
create policy "website adds leads" on public.leads for insert to anon with check (status = 'New');

grant usage on schema public to anon, authenticated;
grant select on public.admins to authenticated;
grant select, insert, update, delete on public.customers, public.leads, public.offers, public.settings to authenticated;
grant insert on public.leads to anon;
grant execute on function public.is_admin() to authenticated;

insert into public.settings (key, value) values
  ('plans', '{"bm":251,"by":2000,"disc":10}'),
  ('set', '{"name":"BillZestPOS","phone":"+966550898978","email":"billzestai@gmail.com","vat":15}');
insert into public.offers (code, pct, active) values ('WELCOME10', 10, true);

-- AFTER you create your admin user (Authentication > Users > Add user), run this with your email:
-- insert into public.admins (user_id) select id from auth.users where email = 'YOUR_EMAIL_HERE';
