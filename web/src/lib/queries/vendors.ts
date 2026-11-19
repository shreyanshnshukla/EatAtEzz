import { cache } from "react";
import { CITY } from "@/lib/env";
import { toVendor, type Vendor } from "@/lib/domain";
import { db } from "@/lib/supabase/public";

export const PAGE_SIZE = 48;

export type VendorFilters = { q?: string; area?: string; category?: string; diet?: string; page?: number };

/** Characters that break PostgREST `or()` filter syntax. */
const searchTerm = (s: string) => s.replace(/[\\%_,().*:"]/g, " ").trim().slice(0, 60);

export async function listVendors(f: VendorFilters = {}) {
  const page = Math.max(1, f.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  let query = db.from("vendor_cards").select("*", { count: "exact" }).eq("city_slug", CITY);

  if (f.area) query = query.eq("area_slug", f.area);
  if (f.category) query = query.eq("category", f.category);
  if (f.diet === "veg") query = query.in("diet", ["veg", "vegan"]);
  if (f.diet === "vegan") query = query.eq("diet", "vegan");
  if (f.diet === "non_veg") query = query.in("diet", ["non_veg", "both"]);
  const q = f.q ? searchTerm(f.q) : "";
  if (q) query = query.or(`name.ilike.%${q}%,speciality.ilike.%${q}%,category.ilike.%${q}%`);

  const { data, count, error } = await query
    .order("is_verified", { ascending: false })
    .order("name")
    .range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { vendors: (data ?? []).map(toVendor), total: count ?? 0, page };
}

export const getVendor = cache(async (slug: string) => {
  const { data, error } = await db.from("vendor_cards").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data ? toVendor(data) : null;
});

export async function getVendorsByIds(ids: string[]): Promise<Vendor[]> {
  if (!ids.length) return [];
  const { data, error } = await db.from("vendor_cards").select("*").in("id", ids);
  if (error) throw error;
  const byId = new Map((data ?? []).map((r) => [r.id, toVendor(r)]));
  return ids.map((id) => byId.get(id)).filter((v): v is Vendor => Boolean(v));
}

export async function getSimilar(v: Vendor, limit = 6) {
  const base = () => db.from("vendor_cards").select("*").eq("category", v.category).neq("id", v.id).limit(limit);
  const { data: nearby } = v.areaSlug ? await base().eq("area_slug", v.areaSlug) : { data: [] };
  if ((nearby ?? []).length >= 3) return (nearby ?? []).map(toVendor);
  const { data } = await base();
  return (data ?? []).map(toVendor);
}

export const getCategories = cache(async () => {
  const { data, error } = await db.from("vendors").select("category");
  if (error) throw error;
  return [...new Set((data ?? []).map((r) => r.category))].sort();
});

export async function countVendors() {
  const { count } = await db.from("vendors").select("id", { count: "exact", head: true });
  return count ?? 0;
}
