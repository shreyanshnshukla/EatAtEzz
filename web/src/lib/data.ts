import { supabase, CITY } from "./supabase";
import type { Area, Dish, VendorCard } from "./types";

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
