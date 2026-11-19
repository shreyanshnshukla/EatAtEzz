import { cache } from "react";
import { CITY } from "@/lib/env";
import type { Area } from "@/lib/domain";
import { db } from "@/lib/supabase/public";

/** Areas that have at least one vendor, busiest first. */
export const listAreas = cache(async (): Promise<Area[]> => {
  const { data, error } = await db
    .from("areas")
    .select("id, slug, name, lat, lng, cities!inner(slug), vendors(count)")
    .eq("cities.slug", CITY);
  if (error) throw error;
  return (data ?? [])
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      lat: a.lat,
      lng: a.lng,
      vendorCount: (a.vendors as unknown as { count: number }[])[0]?.count ?? 0,
    }))
    .filter((a) => a.vendorCount > 0 && a.slug !== "other")
    .sort((a, b) => b.vendorCount - a.vendorCount);
});

export const getArea = cache(async (slug: string) => (await listAreas()).find((a) => a.slug === slug) ?? null);
