-- Admin role, suggestion moderation and "wrong info" reports

-- Profiles: users may only edit their name and photo (never is_admin)
alter table public.profiles add column is_admin boolean not null default false;
revoke update on public.profiles from authenticated, anon;
grant update (display_name, avatar_url) on public.profiles to authenticated;
revoke insert on public.profiles from authenticated, anon;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce((select is_admin from public.profiles where id = auth.uid()), false) $$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Admins can see and update every suggestion
create policy "Admins read suggestions" on public.vendor_suggestions
  for select to authenticated using ((select public.is_admin()));
create policy "Admins update suggestions" on public.vendor_suggestions
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Approve: turn a suggestion into a live vendor in one step
create or replace function public.approve_suggestion(p_id uuid)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  s public.vendor_suggestions;
  base text;
  new_slug text;
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  select * into s from public.vendor_suggestions where id = p_id and status = 'pending' for update;
  if not found then raise exception 'Suggestion not found or already handled'; end if;

  base := trim(both '-' from regexp_replace(lower(s.name), '[^a-z0-9]+', '-', 'g'));
  new_slug := coalesce(nullif(base, ''), 'spot');
  if exists (select 1 from public.vendors where slug = new_slug) then
    new_slug := left(new_slug, 54) || '-' || substr(md5(p_id::text), 1, 5);
  end if;

  insert into public.vendors (city_id, area_id, slug, name, kind, category, speciality, diet, landmark)
  values ((select id from public.cities where slug = 'lucknow'), s.area_id, new_slug, s.name,
          'Street stall / small shop', s.category, s.dish, s.diet, s.landmark);
  update public.vendor_suggestions set status = 'approved' where id = p_id;
  return new_slug;
end;
$$;
revoke execute on function public.approve_suggestion(uuid) from public, anon;
grant execute on function public.approve_suggestion(uuid) to authenticated;

-- Reports: "this info is wrong / closed / moved"
create table public.vendor_reports (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reason text not null check (reason in ('closed', 'moved', 'wrong_diet', 'wrong_info', 'other')),
  note text check (char_length(note) <= 500),
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);
create index vendor_reports_vendor_idx on public.vendor_reports(vendor_id);
create index vendor_reports_user_idx on public.vendor_reports(user_id);
alter table public.vendor_reports enable row level security;

create policy "Report a vendor" on public.vendor_reports
  for insert to authenticated with check ((select auth.uid()) = user_id and status = 'open');
create policy "Read own or all if admin" on public.vendor_reports
  for select to authenticated using ((select auth.uid()) = user_id or (select public.is_admin()));
create policy "Admins resolve reports" on public.vendor_reports
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Admins can fix vendor details
create policy "Admins update vendors" on public.vendors
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Keep vendors.updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end; $$;
create trigger vendors_touch before update on public.vendors
  for each row execute function public.touch_updated_at();
create trigger reviews_touch before update on public.reviews
  for each row execute function public.touch_updated_at();
