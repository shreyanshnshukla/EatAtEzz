import { supabase, CITY } from "./supabase";
import type { Area, Dish, Playlist, VendorCard } from "./types";

export const PAGE_SIZE = 48;

export type VendorFilters = {
  q?: string;
  area?: string;
  category?: string;
  diet?: string;
  page?: number;
};

function escapeLike(s: string) {
  return s.replace(/[\\%_,()]/g, (c) => `\\${c}`);
}

export async function getVendors(f: VendorFilters = {}) {
  const page = Math.max(1, f.page ?? 1);
  let query = supabase
    .from("vendor_cards")
    .select("*", { count: "exact" })
    .eq("city_slug", CITY);

  if (f.area) query = query.eq("area_slug", f.area);
  if (f.category) query = query.eq("category", f.category);
  if (f.diet === "veg") query = query.in("diet", ["veg", "vegan"]);
  if (f.diet === "vegan") query = query.eq("diet", "vegan");
  if (f.diet === "non_veg") query = query.in("diet", ["non_veg", "both"]);
  if (f.q) {
    const q = escapeLike(f.q.trim().slice(0, 60));
    query = query.or(`name.ilike.%${q}%,speciality.ilike.%${q}%,category.ilike.%${q}%`);
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query
    .order("is_verified", { ascending: false })
    .order("name")
    .range(from, from + PAGE_SIZE - 1);

  if (error) throw error;
  return { vendors: (data ?? []) as VendorCard[], total: count ?? 0, page };
}

export async function getVendor(slug: string) {
  const { data, error } = await supabase
    .from("vendor_cards")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as VendorCard | null;
}

export async function getAreas(): Promise<Area[]> {
  const { data, error } = await supabase
    .from("areas")
    .select("slug, name, lat, lng, cities!inner(slug), vendors(count)")
    .eq("cities.slug", CITY);
  if (error) throw error;
  return (data ?? [])
    .map((a) => ({
      slug: a.slug as string,
      name: a.name as string,
      lat: a.lat as number | null,
      lng: a.lng as number | null,
      vendor_count: ((a.vendors as unknown as { count: number }[])?.[0]?.count ?? 0) as number,
    }))
    .filter((a) => a.vendor_count > 0)
    .sort((a, b) => b.vendor_count - a.vendor_count);
}

export async function getCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("vendor_cards").select("category").eq("city_slug", CITY);
  if (error) throw error;
  return Array.from(new Set((data ?? []).map((r) => r.category as string))).sort();
}

export async function getDishes(): Promise<Dish[]> {
  const { data, error } = await supabase
    .from("dishes")
    .select("slug, name, diet, category, description, famous_at, season, cities!inner(slug)")
    .eq("cities.slug", CITY)
    .order("id");
  if (error) throw error;
  return (data ?? []) as unknown as Dish[];
}

export async function getVendorCount() {
  const { count } = await supabase
    .from("vendors")
    .select("id", { count: "exact", head: true });
  return count ?? 0;
}

export async function getSimilar(v: VendorCard, limit = 6) {
  let query = supabase
    .from("vendor_cards")
    .select("*")
    .eq("category", v.category)
    .neq("id", v.id)
    .limit(limit);
  if (v.area_slug) query = query.eq("area_slug", v.area_slug);
  const { data } = await query;
  let list = (data ?? []) as VendorCard[];
  if (list.length < 3) {
    const { data: more } = await supabase
      .from("vendor_cards")
      .select("*")
      .eq("category", v.category)
      .neq("id", v.id)
      .limit(limit);
    list = (more ?? []) as VendorCard[];
  }
  return list;
}

type PlaylistRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  section: Playlist["section"];
  curator: string;
  playlist_items: { position: number; vendors: { name: string } | null }[];
};

function toPlaylist(r: PlaylistRow): Playlist {
  const items = [...(r.playlist_items ?? [])].sort((a, b) => a.position - b.position);
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    description: r.description,
    section: r.section,
    curator: r.curator,
    item_count: items.length,
    preview: items.slice(0, 3).map((i) => i.vendors?.name ?? "").filter(Boolean),
  };
}

export async function getPlaylists(): Promise<Playlist[]> {
  const { data, error } = await supabase
    .from("playlists")
    .select("id, slug, title, tagline, description, section, curator, position, playlist_items(position, vendors(name))")
    .eq("is_published", true)
    .order("position");
  if (error) throw error;
  return ((data ?? []) as unknown as PlaylistRow[]).map(toPlaylist);
}

export async function getPlaylist(slug: string) {
  const { data, error } = await supabase
    .from("playlists")
    .select("id, slug, title, tagline, description, section, curator, owner_id, playlist_items(position, vendor_id, vendors(name))")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as PlaylistRow & { owner_id: string | null; playlist_items: { position: number; vendor_id: string }[] };
  const order = [...row.playlist_items].sort((a, b) => a.position - b.position).map((i) => i.vendor_id);
  const { data: cards } = await supabase.from("vendor_cards").select("*").in("id", order);
  const byId = new Map(((cards ?? []) as VendorCard[]).map((c) => [c.id, c]));
  const vendors = order.map((id) => byId.get(id)).filter((v): v is VendorCard => Boolean(v));
  return { playlist: toPlaylist(row), vendors, ownerId: row.owner_id };
}

export async function getPlaylistsForVendor(vendorId: string) {
  const { data } = await supabase
    .from("playlist_items")
    .select("playlists(slug, title)")
    .eq("vendor_id", vendorId);
  return ((data ?? []) as unknown as { playlists: { slug: string; title: string } | null }[])
    .map((r) => r.playlists)
    .filter((p): p is { slug: string; title: string } => Boolean(p));
}

export type ReviewView = { id: string; rating: number; body: string | null; created_at: string; author: string };

export async function getReviews(vendorId: string): Promise<ReviewView[]> {
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, body, created_at, profiles(display_name)")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .limit(30);
  return ((data ?? []) as unknown as {
    id: string;
    rating: number;
    body: string | null;
    created_at: string;
    profiles: { display_name: string | null } | null;
  }[]).map((r) => ({
    id: r.id,
    rating: r.rating,
    body: r.body,
    created_at: r.created_at,
    author: (r.profiles?.display_name ?? "A Lucknow foodie").split(" ")[0],
  }));
}
