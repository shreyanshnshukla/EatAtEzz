import { CITY, db } from "./supabase";
import { toVendor, type PlaylistSection, type PlaylistSummary, type Vendor } from "./domain";

const PAGE = 30;

export async function searchVendors({ q, diet, page }: { q: string; diet: string; page: number }) {
  let query = db.from("vendor_cards").select("*").eq("city_slug", CITY);
  if (diet === "veg") query = query.in("diet", ["veg", "vegan"]);
  if (diet === "vegan") query = query.eq("diet", "vegan");
  if (diet === "non_veg") query = query.in("diet", ["non_veg", "both"]);
  if (q) query = query.or(`name.ilike.%${q}%,speciality.ilike.%${q}%,category.ilike.%${q}%`);
  const { data, error } = await query.order("name").range(page * PAGE, page * PAGE + PAGE - 1);
  if (error) throw error;
  const vendors = (data ?? []).map(toVendor);
  return { vendors, done: vendors.length < PAGE };
}

export async function getVendor(slug: string) {
  const { data } = await db.from("vendor_cards").select("*").eq("slug", slug).maybeSingle();
  return data ? toVendor(data) : null;
}

export async function getVendorsByIds(ids: string[]): Promise<Vendor[]> {
  if (!ids.length) return [];
  const { data } = await db.from("vendor_cards").select("*").in("id", ids);
  const byId = new Map((data ?? []).map((r) => [r.id, toVendor(r)]));
  return ids.flatMap((id) => byId.get(id) ?? []);
}

export async function decide(diet: string, category: string) {
  const { data, error } = await db.rpc("decide_for_me", { p_city: CITY, p_diet: diet || undefined, p_category: category || undefined });
  if (error) throw error;
  return data?.[0] ? toVendor(data[0]) : null;
}

export async function listPlaylists(): Promise<PlaylistSummary[]> {
  const { data, error } = await db
    .from("playlists")
    .select("id, slug, title, tagline, section, playlist_items(count)")
    .eq("is_published", true)
    .order("position")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    section: p.section as PlaylistSection,
    count: (p.playlist_items as unknown as { count: number }[])[0]?.count ?? 0,
  }));
}

export async function getPlaylist(slug: string) {
  const { data } = await db
    .from("playlists")
    .select("id, slug, title, tagline, description, curator, owner_id, playlist_items(position, vendor_id)")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  const ids = [...data.playlist_items].sort((a, b) => a.position - b.position).map((i) => i.vendor_id);
  return { playlist: data, vendors: await getVendorsByIds(ids) };
}

export async function playlistsForVendor(vendorId: string) {
  const { data } = await db.from("playlist_items").select("playlists(slug, title)").eq("vendor_id", vendorId);
  return (data ?? []).flatMap((r) => (r.playlists ? [r.playlists] : []));
}

export async function listReviews(vendorId: string) {
  const { data } = await db
    .from("reviews")
    .select("id, rating, body, profiles(display_name)")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .limit(30);
  return (data ?? []).map((r) => ({ id: r.id, rating: r.rating, body: r.body, author: (r.profiles?.display_name ?? "A Lucknow foodie").split(" ")[0] }));
}

export async function listAreas() {
  const { data } = await db.from("areas").select("id, name, slug, vendors(count), cities!inner(slug)").eq("cities.slug", CITY);
  return (data ?? [])
    .map((a) => ({ id: a.id, name: a.name, count: (a.vendors as unknown as { count: number }[])[0]?.count ?? 0 }))
    .filter((a) => a.name !== "Other")
    .sort((a, b) => b.count - a.count);
}
