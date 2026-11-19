-- Food Playlists: curated lists of vendors (by the EatAtEzz team now, bloggers later)
create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  city_id smallint not null references public.cities(id) on delete cascade,
  slug text not null unique,
  title text not null,
  tagline text,
  description text,
  section text not null check (section in ('non_veg', 'veg', 'vegan', 'underrated', 'area')),
  curator text not null default 'EatAtEzz team',
  owner_id uuid references auth.users(id) on delete set null,
  position smallint not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index playlists_city_idx on public.playlists(city_id);
create index playlists_owner_idx on public.playlists(owner_id);

create table public.playlist_items (
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  position smallint not null default 0,
  note text,
  primary key (playlist_id, vendor_id)
);
create index playlist_items_vendor_idx on public.playlist_items(vendor_id);

alter table public.playlists enable row level security;
alter table public.playlist_items enable row level security;

create policy "Public read published playlists" on public.playlists
  for select using (is_published or (select auth.uid()) = owner_id);
create policy "Public read playlist items" on public.playlist_items
  for select using (exists (select 1 from public.playlists p where p.id = playlist_id
                            and (p.is_published or (select auth.uid()) = p.owner_id)));

-- Create a profile row automatically when someone signs in for the first time (Google gives name + avatar)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
