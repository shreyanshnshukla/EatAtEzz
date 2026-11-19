import { createServerDb } from "@/lib/supabase/server";
import { getVendorsByIds } from "./vendors";

/** Everything the signed-in user has on one vendor page. */
export async function myVendorState(userId: string, vendorId: string) {
  const supabase = await createServerDb();
  const [saved, review, lists] = await Promise.all([
    supabase.from("saved_vendors").select("vendor_id").eq("user_id", userId).eq("vendor_id", vendorId).maybeSingle(),
    supabase.from("reviews").select("rating, body").eq("user_id", userId).eq("vendor_id", vendorId).maybeSingle(),
    supabase.from("playlists").select("id, title, playlist_items(vendor_id)").eq("owner_id", userId).order("created_at", { ascending: false }),
  ]);
  return {
    saved: Boolean(saved.data),
    review: review.data,
    playlists: (lists.data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      has: p.playlist_items.some((i) => i.vendor_id === vendorId),
    })),
  };
}

export async function myDashboard(userId: string) {
  const supabase = await createServerDb();
  const [saved, lists, suggestions, reviews] = await Promise.all([
    supabase.from("saved_vendors").select("vendor_id").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("playlists").select("id, slug, title, tagline, playlist_items(count)").eq("owner_id", userId).order("created_at", { ascending: false }),
    supabase.from("vendor_suggestions").select("id, name, category, status").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ]);
  return {
    saved: await getVendorsByIds((saved.data ?? []).map((r) => r.vendor_id)),
    playlists: (lists.data ?? []).map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      count: (p.playlist_items as unknown as { count: number }[])[0]?.count ?? 0,
    })),
    suggestions: suggestions.data ?? [],
    reviewCount: reviews.count ?? 0,
  };
}

/** Admin queue: pending suggestions and open reports. RLS returns nothing for non-admins. */
export async function moderationQueue() {
  const supabase = await createServerDb();
  const [suggestions, reports] = await Promise.all([
    supabase
      .from("vendor_suggestions")
      .select("id, name, category, dish, diet, landmark, note, created_at, areas(name)")
      .eq("status", "pending")
      .order("created_at"),
    supabase
      .from("vendor_reports")
      .select("id, reason, note, created_at, vendors(slug, name)")
      .eq("status", "open")
      .order("created_at"),
  ]);
  return { suggestions: suggestions.data ?? [], reports: reports.data ?? [] };
}
