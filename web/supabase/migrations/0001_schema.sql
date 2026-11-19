-- EatAtEzz core schema: multi-city, Lucknow first
create extension if not exists postgis with schema extensions;

create table public.cities (
  id smallint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  is_live boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.areas (
  id integer generated always as identity primary key,
  city_id smallint not null references public.cities(id) on delete cascade,
  slug text not null,
  name text not null,
  lat double precision,
  lng double precision,
  created_at timestamptz not null default now(),
  unique (city_id, slug)
);

create type public.diet_type as enum ('veg', 'non_veg', 'both', 'vegan');

create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  city_id smallint not null references public.cities(id) on delete cascade,
  area_id integer references public.areas(id) on delete set null,
  slug text not null unique,
  name text not null,
  kind text not null,              -- street stall, restaurant, cafe, sweet shop...
  category text not null,          -- kebabs, chaat, biryani...
  speciality text,
  diet public.diet_type not null default 'both',
  google_place_id text unique,
  location extensions.geography(point, 4326),  -- filled once verified on the ground
  landmark text,
  price_range smallint check (price_range between 1 and 4),
  opening_hours jsonb,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index vendors_area_idx on public.vendors(area_id);
create index vendors_category_idx on public.vendors(category);
create index vendors_location_idx on public.vendors using gist(location);

create table public.dishes (
  id integer generated always as identity primary key,
  city_id smallint not null references public.cities(id) on delete cascade,
  slug text not null,
  name text not null,
  diet public.diet_type not null,
  category text not null,
  description text,
  famous_at text,
  season text,
  unique (city_id, slug)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  rating smallint not null check (rating between 1 and 5),
  body text check (char_length(body) <= 1000),
  created_at timestamptz not null default now(),
  unique (vendor_id, user_id)
);
create index reviews_vendor_idx on public.reviews(vendor_id);
create index reviews_user_idx on public.reviews(user_id);

create table public.saved_vendors (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, vendor_id)
);
create index saved_vendors_vendor_idx on public.saved_vendors(vendor_id);

-- Row-level security
alter table public.cities enable row level security;
alter table public.areas enable row level security;
alter table public.vendors enable row level security;
alter table public.dishes enable row level security;
alter table public.profiles enable row level security;
alter table public.reviews enable row level security;
alter table public.saved_vendors enable row level security;

create policy "Public read cities" on public.cities for select using (true);
create policy "Public read areas" on public.areas for select using (true);
create policy "Public read vendors" on public.vendors for select using (true);
create policy "Public read dishes" on public.dishes for select using (true);
create policy "Public read reviews" on public.reviews for select using (true);

create policy "Read own profile" on public.profiles for select using ((select auth.uid()) = id);
create policy "Insert own profile" on public.profiles for insert with check ((select auth.uid()) = id);
create policy "Update own profile" on public.profiles for update using ((select auth.uid()) = id);

create policy "Write own review" on public.reviews for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Edit own review" on public.reviews for update to authenticated using ((select auth.uid()) = user_id);
create policy "Delete own review" on public.reviews for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Read own saved" on public.saved_vendors for select to authenticated using ((select auth.uid()) = user_id);
create policy "Save vendor" on public.saved_vendors for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Unsave vendor" on public.saved_vendors for delete to authenticated using ((select auth.uid()) = user_id);

-- Vendor list with area and rating summary
create view public.vendor_cards with (security_invoker = on) as
select v.id, v.slug, v.name, v.kind, v.category, v.speciality, v.diet, v.google_place_id,
       v.is_verified, v.landmark, c.slug as city_slug, a.slug as area_slug, a.name as area_name,
       a.lat as area_lat, a.lng as area_lng,
       coalesce(r.avg_rating, 0)::numeric(2,1) as avg_rating, coalesce(r.review_count, 0) as review_count
from public.vendors v
join public.cities c on c.id = v.city_id
left join public.areas a on a.id = v.area_id
left join (select vendor_id, avg(rating) as avg_rating, count(*) as review_count
           from public.reviews group by vendor_id) r on r.vendor_id = v.id;

-- "Decide for me": one random vendor matching optional filters
create or replace function public.decide_for_me(p_city text default 'lucknow', p_area text default null,
                                                p_diet text default null, p_category text default null)
returns setof public.vendor_cards
language sql stable security invoker set search_path = '' as $$
  select * from public.vendor_cards vc
  where vc.city_slug = p_city
    and (p_area is null or vc.area_slug = p_area)
    and (p_category is null or vc.category = p_category)
    and (p_diet is null
         or (p_diet = 'veg' and vc.diet in ('veg', 'vegan'))
         or (p_diet = 'vegan' and vc.diet = 'vegan')
         or (p_diet = 'non_veg' and vc.diet in ('non_veg', 'both')))
  order by random()
  limit 1;
$$;

-- Nearby vendors (only those with a verified location)
create or replace function public.nearby_vendors(p_lat double precision, p_lng double precision,
                                                 p_radius_m integer default 2000)
returns table (id uuid, slug text, name text, category text, diet public.diet_type, distance_m double precision)
language sql stable security invoker set search_path = '' as $$
  select v.id, v.slug, v.name, v.category, v.diet,
         extensions.st_distance(v.location, extensions.st_makepoint(p_lng, p_lat)::extensions.geography) as distance_m
  from public.vendors v
  where v.location is not null
    and extensions.st_dwithin(v.location, extensions.st_makepoint(p_lng, p_lat)::extensions.geography, p_radius_m)
  order by distance_m
  limit 50;
$$;
