"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/auth/server";

export type ActionResult = { ok: boolean; error?: string; message?: string };

async function requireUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/* ---------- Save spots ---------- */

export async function toggleSave(vendorId: string, slug: string): Promise<ActionResult & { saved?: boolean }> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "signin" };
  const { data: existing } = await supabase
    .from("saved_vendors")
    .select("vendor_id")
    .eq("user_id", user.id)
    .eq("vendor_id", vendorId)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("saved_vendors").delete().eq("user_id", user.id).eq("vendor_id", vendorId)
    : await supabase.from("saved_vendors").insert({ vendor_id: vendorId });
  if (error) return { ok: false, error: "Couldn't update. Try again." };
  revalidatePath(`/vendor/${slug}`);
  revalidatePath("/account");
  return { ok: true, saved: !existing };
}

/* ---------- Reviews ---------- */

export async function submitReview(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Sign in to review." };
  const vendorId = String(form.get("vendor_id") ?? "");
  const slug = String(form.get("slug") ?? "");
  const rating = Number(form.get("rating"));
  const body = String(form.get("body") ?? "").trim().slice(0, 1000);
  if (!vendorId || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { ok: false, error: "Pick a rating from 1 to 5 stars." };
  }
  const { error } = await supabase
    .from("reviews")
    .upsert(
      { vendor_id: vendorId, user_id: user.id, rating, body: body || null, updated_at: new Date().toISOString() },
      { onConflict: "vendor_id,user_id" },
    );
  if (error) return { ok: false, error: "Couldn't save your review. Try again." };
  revalidatePath(`/vendor/${slug}`);
  return { ok: true, message: "Review saved. Shukriya!" };
}

export async function deleteReview(vendorId: string, slug: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "signin" };
  const { error } = await supabase.from("reviews").delete().eq("vendor_id", vendorId).eq("user_id", user.id);
  if (error) return { ok: false, error: "Couldn't delete. Try again." };
  revalidatePath(`/vendor/${slug}`);
  return { ok: true };
}

/* ---------- Your playlists ---------- */

export async function createPlaylist(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Sign in first." };
  const title = String(form.get("title") ?? "").trim();
  const tagline = String(form.get("tagline") ?? "").trim();
  if (title.length < 3 || title.length > 60) return { ok: false, error: "Give it a name of 3 to 60 characters." };
  const { data, error } = await supabase.rpc("create_playlist", { p_title: title, p_tagline: tagline || null });
  if (error || !data) return { ok: false, error: error?.message?.includes("limit") ? "You've reached 50 playlists." : "Couldn't create it. Try again." };
  revalidatePath("/account");
  revalidatePath("/playlists");
  const slug = (data as { slug: string }).slug;
  const vendorId = String(form.get("vendor_id") ?? "");
  if (vendorId) {
    const { data: pl } = await supabase.from("playlists").select("id").eq("slug", slug).single();
    if (pl) await supabase.from("playlist_items").insert({ playlist_id: pl.id, vendor_id: vendorId, position: 1 });
    const back = String(form.get("back") ?? "");
    if (back.startsWith("/vendor/")) revalidatePath(back);
    return { ok: true, message: `Created "${title}" and added this spot.` };
  }
  redirect(`/playlist/${slug}`);
}

export async function addToPlaylist(playlistId: string, vendorId: string, slug: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "signin" };
  const { count } = await supabase
    .from("playlist_items")
    .select("vendor_id", { count: "exact", head: true })
    .eq("playlist_id", playlistId);
  if ((count ?? 0) >= 50) return { ok: false, error: "A playlist can hold 50 spots." };
  const { error } = await supabase
    .from("playlist_items")
    .insert({ playlist_id: playlistId, vendor_id: vendorId, position: (count ?? 0) + 1 });
  if (error) {
    return { ok: false, error: error.code === "23505" ? "Already in that playlist." : "Couldn't add it. Try again." };
  }
  revalidatePath(`/vendor/${slug}`);
  return { ok: true, message: "Added to your playlist." };
}

export async function removeFromPlaylist(playlistId: string, vendorId: string, playlistSlug: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "signin" };
  const { error } = await supabase.from("playlist_items").delete().eq("playlist_id", playlistId).eq("vendor_id", vendorId);
  if (error) return { ok: false, error: "Couldn't remove it." };
  revalidatePath(`/playlist/${playlistSlug}`);
  return { ok: true };
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/login");
  await supabase.from("playlists").delete().eq("id", playlistId).eq("owner_id", user.id);
  revalidatePath("/account");
  revalidatePath("/playlists");
  redirect("/account");
}

/* ---------- Suggest a spot ---------- */

export async function suggestSpot(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { ok: false, error: "Sign in to suggest a spot." };
  const get = (k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);
  const name = get("name", 80);
  const category = get("category", 40);
  const diet = get("diet", 10);
  const areaId = Number(form.get("area_id")) || null;
  if (name.length < 2) return { ok: false, error: "Add the stall or shop name." };
  if (!category) return { ok: false, error: "Pick what they sell." };
  if (!["veg", "non_veg", "both", "vegan"].includes(diet)) return { ok: false, error: "Pick veg or non-veg." };

  const { count } = await supabase
    .from("vendor_suggestions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString());
  if ((count ?? 0) >= 10) return { ok: false, error: "That's 10 suggestions today. Thank you! Try again tomorrow." };

  const { error } = await supabase.from("vendor_suggestions").insert({
    name,
    category,
    diet,
    area_id: areaId,
    dish: get("dish", 120) || null,
    landmark: get("landmark", 160) || null,
    note: get("note", 500) || null,
  });
  if (error) return { ok: false, error: "Couldn't send it. Try again." };
  revalidatePath("/account");
  return { ok: true, message: `Thanks! We'll check "${name}" and add it soon.` };
}
