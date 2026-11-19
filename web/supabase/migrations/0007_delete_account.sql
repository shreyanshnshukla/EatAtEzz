-- Right to erasure (DPDP Act, s.12): a signed-in user deletes their account and everything they made.
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not signed in';
  end if;
  delete from public.playlists where owner_id = uid;   -- owner_id is ON DELETE SET NULL, so remove them first
  delete from auth.users where id = uid;               -- cascades to profile, reviews, saves, suggestions, reports
end;
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
