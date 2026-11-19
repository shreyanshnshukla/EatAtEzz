-- Reviews, saved spots, user playlists and spot suggestions

-- 1. Display names and photos are public (shown next to reviews and playlists)
create policy "Public read profiles" on public.profiles for select using (true);

-- 2. Let reviews join to profiles (profile ids are auth user ids)
alter table public.reviews
  add constraint reviews_user_profile_fkey foreign key (user_id) references public.profiles(id) on delete cascade;
alter table public.reviews add column updated_at timestamptz not null default now();

-- 3. User-made playlists live in a "community" section
alter table public.playlists drop constraint playlists_section_check;
alter table public.playlists
  add constraint playlists_section_check check (section in ('non_veg', 'veg', 'vegan', 'underrated', 'area', 'community'));
alter table public.playlists
  add constraint playlists_owner_profile_fkey foreign key (owner_id) references public.profiles(id) on delete set null;

create policy "Owner updates playlist" on public.playlists
  for update to authenticated using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id and section = 'community');
create policy "Owner deletes playlist" on public.playlists
  for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "Owner adds playlist items" on public.playlist_items
  for insert to authenticated with check (exists (
    select 1 from public.playlists p where p.id = playlist_id and p.owner_id = (select auth.uid())));
create policy "Owner removes playlist items" on public.playlist_items
  for delete to authenticated using (exists (
    select 1 from public.playlists p where p.id = playlist_id and p.owner_id = (select auth.uid())));

-- Create a playlist safely: fixes city, section, curator and makes a unique slug.
create or replace function public.create_playlist(p_title text, p_tagline text default null)
returns public.playlists
language plpgsql
security definer set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  base text;
  new_slug text;
  curator_name text;
  created public.playlists;
begin
  if uid is null then raise exception 'Sign in first'; end if;
  if p_title is null or char_length(trim(p_title)) < 3 or char_length(p_title) > 60 then
    raise exception 'Title must be 3 to 60 characters';
  end if;
  if (select count(*) from public.playlists where owner_id = uid) >= 50 then
    raise exception 'Playlist limit reached';
  end if;
  base := trim(both '-' from regexp_replace(lower(p_title), '[^a-z0-9]+', '-', 'g'));
  if base = '' then base := 'playlist'; end if;
  new_slug := left(base, 50) || '-' || substr(md5(gen_random_uuid()::text), 1, 6);
  select coalesce(display_name, 'A Lucknow foodie') into curator_name from public.profiles where id = uid;
  insert into public.playlists (city_id, slug, title, tagline, section, curator, owner_id, position)
  values ((select id from public.cities where slug = 'lucknow'), new_slug, trim(p_title),
          nullif(left(trim(coalesce(p_tagline, '')), 120), ''), 'community', coalesce(curator_name, 'A Lucknow foodie'), uid, 1000)
  returning * into created;
  return created;
end;
$$;
revoke execute on function public.create_playlist(text, text) from public, anon;
grant execute on function public.create_playlist(text, text) to authenticated;

-- 4. Suggest a new spot (goes to a review queue)
create table public.vendor_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  area_id integer references public.areas(id) on delete set null,
  category text not null check (char_length(category) <= 40),
  dish text check (char_length(dish) <= 120),
  diet public.diet_type not null default 'both',
  landmark text check (char_length(landmark) <= 160),
  note text check (char_length(note) <= 500),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);
create index vendor_suggestions_user_idx on public.vendor_suggestions(user_id);
create index vendor_suggestions_area_idx on public.vendor_suggestions(area_id);
alter table public.vendor_suggestions enable row level security;

create policy "Suggest a spot" on public.vendor_suggestions
  for insert to authenticated with check ((select auth.uid()) = user_id and status = 'pending');
create policy "Read own suggestions" on public.vendor_suggestions
  for select to authenticated using ((select auth.uid()) = user_id);
