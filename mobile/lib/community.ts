import { supabase } from "./supabase";
import type { VendorCard } from "./types";

export type Review = { id: string; rating: number; body: string | null; created_at: string; author: string };
export type MyPlaylist = { id: string; slug: string; title: string; count: number; has?: boolean };

export async function getReviews(vendorId: string): Promise<Review[]> {
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, body, created_at, profiles(display_name)")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .limit(30);
  return ((data ?? []) as unknown as (Omit<Review, "author"> & { profiles: { display_name: string | null } | null })[]).map(
    (r) => ({ ...r, author: (r.profiles?.display_name ?? "A Lucknow foodie").split(" ")[0] }),
  );
}

export async function getMyState(userId: string, vendorId: string) {
  const [saved, review, lists] = await Promise.all([
    supabase.from("saved_vendors").select("vendor_id").eq("user_id", userId).eq("vendor_id", vendorId).maybeSingle(),
    supabase.from("reviews").select("rating, body").eq("user_id", userId).eq("vendor_id", vendorId).maybeSingle(),
    supabase.from("playlists").select("id, slug, title, playlist_items(vendor_id)").eq("owner_id", userId).order("created_at", { ascending: false }),
  ]);
  return {
    saved: Boolean(saved.data),
    review: (review.data as { rating: number; body: string | null } | null) ?? null,
    playlists: ((lists.data ?? []) as { id: string; slug: string; title: string; playlist_items: { vendor_id: string }[] }[]).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      count: p.playlist_items.length,
      has: p.playlist_items.some((i) => i.vendor_id === vendorId),
    })),
  };
}

export async function setSaved(userId: string, vendorId: string, save: boolean) {
  const { error } = save
    ? await supabase.from("saved_vendors").insert({ vendor_id: vendorId })
    : await supabase.from("saved_vendors").delete().eq("user_id", userId).eq("vendor_id", vendorId);
  return !error;
}

export async function saveReview(userId: string, vendorId: string, rating: number, body: string) {
  const { error } = await supabase.from("reviews").upsert(
    { vendor_id: vendorId, user_id: userId, rating, body: body.trim().slice(0, 1000) || null, updated_at: new Date().toISOString() },
    { onConflict: "vendor_id,user_id" },
  );
  return !error;
}

export async function deleteReview(userId: string, vendorId: string) {
  const { error } = await supabase.from("reviews").delete().eq("user_id", userId).eq("vendor_id", vendorId);
  return !error;
}

export async function createPlaylist(title: string, tagline?: string) {
  const { data, error } = await supabase.rpc("create_playlist", { p_title: title.trim(), p_tagline: tagline?.trim() || null });
  if (error || !data) throw new Error(error?.message ?? "Couldn't create");
  return data as { id: string; slug: string; title: string };
}

export async function addToPlaylist(playlistId: string, vendorId: string, position: number) {
  const { error } = await supabase.from("playlist_items").insert({ playlist_id: playlistId, vendor_id: vendorId, position });
  return !error || error.code === "23505";
}

export async function getSaved(userId: string): Promise<VendorCard[]> {
  const { data: rows } = await supabase
    .from("saved_vendors")
    .select("vendor_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  const ids = (rows ?? []).map((r) => r.vendor_id as string);
  if (!ids.length) return [];
  const { data } = await supabase.from("vendor_cards").select("*").in("id", ids);
  const byId = new Map(((data ?? []) as VendorCard[]).map((v) => [v.id, v]));
  return ids.map((id) => byId.get(id)).filter((v): v is VendorCard => Boolean(v));
}

export async function getMyPlaylists(userId: string): Promise<MyPlaylist[]> {
  const { data } = await supabase
    .from("playlists")
    .select("id, slug, title, playlist_items(count)")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
  return ((data ?? []) as unknown as { id: string; slug: string; title: string; playlist_items: { count: number }[] }[]).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    count: p.playlist_items?.[0]?.count ?? 0,
  }));
}
