-- BillZestPOS part 3: POS billing. Run once in Supabase > SQL Editor > New query.
-- Every shop sees only its own products and invoices.

create table public.products (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  price numeric not null check (price >= 0 and price < 1000000),
  stock int check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  no int not null,
  customer_name text not null default '',
  customer_phone text not null default '',
  method text not null check (method in ('Cash','Card','Transfer')),
  subtotal numeric not null,
  vat numeric not null,
  total numeric not null,
  items jsonb not null,
  created_at timestamptz not null default now(),
  unique (owner, no)
);
create index on public.products (owner);
create index on public.invoices (owner, created_at desc);

alter table public.products enable row level security;
alter table public.invoices enable row level security;
create policy "own products" on public.products for all to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());
-- Invoices can be read by their shop, but only created through create_invoice() below.
create policy "own invoices read" on public.invoices for select to authenticated
  using (owner = auth.uid());

grant select, insert, update, delete on public.products to authenticated;
grant select on public.invoices to authenticated;

create or replace function public.create_invoice(
  p_items jsonb, p_method text, p_name text default '', p_phone text default '')
returns public.invoices
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  it jsonb; pr public.products; q int; n int;
  sub numeric := 0; vat numeric; lines jsonb := '[]'::jsonb; inv public.invoices;
begin
  if uid is null then raise exception 'Not signed in'; end if;
  if p_method not in ('Cash','Card','Transfer') then raise exception 'Bad payment method'; end if;
  if jsonb_typeof(p_items) is distinct from 'array' then raise exception 'Bad items'; end if;
  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 100 then raise exception 'Bad items'; end if;
  perform pg_advisory_xact_lock(hashtext(uid::text));
  for it in select * from jsonb_array_elements(p_items) loop
    q := (it->>'qty')::int;
    if q is null or q < 1 or q > 999 then raise exception 'Bad quantity'; end if;
    select * into pr from public.products
      where id = (it->>'id')::uuid and owner = uid and active for update;
    if not found then raise exception 'Product not found'; end if;
    if pr.stock is not null then
      if pr.stock < q then raise exception 'Not enough stock: %', pr.name; end if;
      update public.products set stock = stock - q where id = pr.id;
    end if;
    sub := sub + pr.price * q;
    lines := lines || jsonb_build_object('name', pr.name, 'price', pr.price, 'qty', q, 'total', pr.price * q);
  end loop;
  select coalesce(max(no), 0) + 1 into n from public.invoices where owner = uid;
  sub := round(sub, 2);
  vat := round(sub * 0.15, 2);
  insert into public.invoices (owner, no, customer_name, customer_phone, method, subtotal, vat, total, items)
  values (uid, n, left(coalesce(p_name, ''), 80), left(coalesce(p_phone, ''), 25), p_method, sub, vat, sub + vat, lines)
  returning * into inv;
  return inv;
end $$;

revoke all on function public.create_invoice(jsonb, text, text, text) from public, anon;
grant execute on function public.create_invoice(jsonb, text, text, text) to authenticated;
