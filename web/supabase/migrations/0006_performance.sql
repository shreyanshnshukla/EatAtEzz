-- Advisor fixes: index the city foreign key; drop a policy that "Public read profiles" already covers.
create index if not exists vendors_city_idx on public.vendors (city_id);
drop policy if exists "Read own profile" on public.profiles;
