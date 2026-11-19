-- Security hardening (audit 2026-11-19)

-- 1. Least privilege. Supabase grants every table privilege to anon/authenticated by default and relies on RLS.
--    TRUNCATE ignores RLS, and anon never needs to write, so take those away and grant back only what's used.
revoke all on all tables in schema public from anon, authenticated;
grant select on public.cities, public.areas, public.vendors, public.vendor_cards, public.dishes,
                public.playlists, public.playlist_items, public.reviews, public.profiles
  to anon, authenticated;

grant select, insert, update, delete on public.reviews to authenticated;
grant select, insert, delete on public.saved_vendors to authenticated;
grant insert, delete on public.playlist_items to authenticated;
grant update (title, tagline, description, is_published), delete on public.playlists to authenticated;
grant update (display_name, avatar_url) on public.profiles to authenticated;
grant select, insert on public.vendor_suggestions, public.vendor_reports to authenticated;
grant update (status) on public.vendor_suggestions, public.vendor_reports to authenticated;   -- RLS: admins only
grant update (name, kind, category, speciality, diet, landmark, area_id, price_range, opening_hours, is_verified, location)
  on public.vendors to authenticated;                                                           -- RLS: admins only

-- New tables must not inherit the broad defaults either.
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from anon, authenticated, public;

-- 2. Remove a policy made redundant by the trigger that creates profiles.
drop policy if exists "Insert own profile" on public.profiles;

revoke execute on function public.touch_updated_at() from public, anon, authenticated;

-- 3. Bound user-supplied text.
alter table public.profiles
  add constraint profiles_name_len check (char_length(display_name) <= 60),
  add constraint profiles_avatar_https check (avatar_url is null or avatar_url ~ '^https://');
alter table public.playlist_items add constraint playlist_items_note_len check (char_length(note) <= 280);
alter table public.playlists
  add constraint playlists_title_len check (char_length(title) between 3 and 60),
  add constraint playlists_tagline_len check (char_length(tagline) <= 120),
  add constraint playlists_description_len check (char_length(description) <= 500);

-- 4. Rate limits enforced in the database, so calling the API directly can't bypass them.
create or replace function public.enforce_rate_limit()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  recent int;
  max_per_day int := tg_argv[0]::int;
begin
  execute format('select count(*) from %I.%I where user_id = $1 and created_at > now() - interval ''1 day''',
                 tg_table_schema, tg_table_name)
    into recent using new.user_id;
  if recent >= max_per_day then
    raise exception 'Daily limit reached' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke execute on function public.enforce_rate_limit() from public, anon, authenticated;

create trigger suggestions_rate_limit before insert on public.vendor_suggestions
  for each row execute function public.enforce_rate_limit('10');
create trigger reports_rate_limit before insert on public.vendor_reports
  for each row execute function public.enforce_rate_limit('10');
create trigger reviews_rate_limit before insert on public.reviews
  for each row execute function public.enforce_rate_limit('30');

-- A playlist holds at most 50 spots.
create or replace function public.enforce_playlist_size()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from public.playlist_items where playlist_id = new.playlist_id) >= 50 then
    raise exception 'Playlist is full' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke execute on function public.enforce_playlist_size() from public, anon, authenticated;
create trigger playlist_items_size before insert on public.playlist_items
  for each row execute function public.enforce_playlist_size();
