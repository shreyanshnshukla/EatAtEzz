import { cache } from "react";
import { CITY } from "@/lib/env";
import type { Dish } from "@/lib/domain";
import { db } from "@/lib/supabase/public";

export const listDishes = cache(async (): Promise<Dish[]> => {
  const { data, error } = await db
    .from("dishes")
    .select("slug, name, diet, category, description, famous_at, season, cities!inner(slug)")
    .eq("cities.slug", CITY)
    .order("id");
  if (error) throw error;
  return (data ?? []).map((d) => ({
    slug: d.slug,
    name: d.name,
    diet: d.diet,
    category: d.category,
    description: d.description,
    famousAt: d.famous_at,
    season: d.season,
  }));
});
