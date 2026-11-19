import { db } from "./supabase";
import { getVendorsByIds } from "./api";
import type { Diet } from "./domain";

/** Signed-in user's data. RLS guarantees these only ever touch the user's own rows. */

export async function myVendorState(userId: string, vendorId: string) {
  const [saved, review, lists] = await Promise.all([
    db.from("saved_vendors").select("vendor_id").eq("user_id", userId).eq("vendor_id", vendorId).maybeSingle(),
    db.from("reviews").select("rating, body").eq("user_id", userId).eq("vendor_id", vendorId).maybeSingle(),
    db.from("playlists").select("id, title, playlist_items(vendor_id)").eq("owner_id", userId).order("created_at", { ascending: false }),
  ]);
  return {
    saved: Boolean(saved.data),
    review: review.data,
    playlists: (lists.data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      count: p.playlist_items.length,
      has: p.playlist_items.some((i) => i.vendor_id === vendorId),
    })),
  };
}

export const setSaved = async (userId: string, vendorId: string, save: boolean) =>
  !(save
    ? await db.from("saved_vendors").upsert({ vendor_id: vendorId }, { onConflict: "user_id,vendor_id", ignoreDuplicates: true })
    : await db.from("saved_vendors").delete().eq("user_id", userId).eq("vendor_id", vendorId)
  ).error;

export const saveReview = async (userId: string, vendorId: string, rating: number, body: string) =>
  !(await db.from("reviews").upsert({ vendor_id: vendorId, user_id: userId, rating, body: body.trim().slice(0, 1000) || null }, { onConflict: "vendor_id,user_id" })).error;

export const deleteReview = async (userId: string, vendorId: string) =>
  !(await db.from("reviews").delete().eq("user_id", userId).eq("vendor_id", vendorId)).error;

export async function createPlaylist(title: string) {
  const { data, error } = await db.rpc("create_playlist", { p_title: title.trim() });
  if (error || !data) throw new Error(error?.message ?? "Couldn't create the playlist");
  return data;
}

export async function addToPlaylist(playlistId: string, vendorId: string, position: number) {
  const { error } = await db.from("playlist_items").insert({ playlist_id: playlistId, vendor_id: vendorId, position });
  return !error || error.code === "23505";
}

export async function reportVendor(vendorId: string, reason: string) {
  return !(await db.from("vendor_reports").insert({ vendor_id: vendorId, reason })).error;
}

export async function suggestSpot(input: { name: string; category: string; diet: Diet; areaId: number | null; dish: string; landmark: string }) {
  const { error } = await db.from("vendor_suggestions").insert({
    name: input.name.trim().slice(0, 80),
    category: input.category,
    diet: input.diet,
    area_id: input.areaId,
    dish: input.dish.trim().slice(0, 120) || null,
    landmark: input.landmark.trim().slice(0, 160) || null,
  });
  return !error;
}

export async function myProfile(userId: string) {
  const [saved, lists] = await Promise.all([
    db.from("saved_vendors").select("vendor_id").eq("user_id", userId).order("created_at", { ascending: false }),
    db.from("playlists").select("id, slug, title, playlist_items(count)").eq("owner_id", userId).order("created_at", { ascending: false }),
  ]);
  return {
    saved: await getVendorsByIds((saved.data ?? []).map((r) => r.vendor_id)),
    playlists: (lists.data ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      count: (p.playlist_items as unknown as { count: number }[])[0]?.count ?? 0,
    })),
  };
}

/** Permanently deletes the signed-in account and everything it created, then signs out. */
export async function deleteAccount() {
  const { error } = await db.rpc("delete_my_account");
  if (error) throw error;
  await db.auth.signOut();
}
