import type { Enums, Views } from "./database.types";

export type Diet = Enums<"diet_type">;

export type Vendor = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  category: string;
  speciality: string | null;
  diet: Diet;
  placeId: string | null;
  verified: boolean;
  areaName: string | null;
  rating: number;
  reviewCount: number;
};

export type PlaylistSection = "non_veg" | "veg" | "vegan" | "underrated" | "area" | "community";

export type PlaylistSummary = { id: string; slug: string; title: string; tagline: string | null; section: PlaylistSection; count: number };

export const cleanName = (name: string) => name.split(/\s[|•]\s/)[0].trim();

export function toVendor(r: Views<"vendor_cards">): Vendor {
  return {
    id: r.id ?? "",
    slug: r.slug ?? "",
    name: cleanName(r.name ?? ""),
    kind: r.kind ?? "",
    category: r.category ?? "",
    speciality: r.speciality,
    diet: r.diet ?? "both",
    placeId: r.google_place_id,
    verified: r.is_verified ?? false,
    areaName: r.area_name,
    rating: Number(r.avg_rating ?? 0),
    reviewCount: r.review_count ?? 0,
  };
}

export const DIET_LABEL: Record<Diet, string> = { veg: "Veg", non_veg: "Non-veg", both: "Veg & non-veg", vegan: "Vegan" };

export const SECTION_LABEL: Record<PlaylistSection, string> = {
  non_veg: "Non-veg",
  veg: "Veg",
  vegan: "Vegan",
  underrated: "Underrated & everyday",
  area: "Area walks",
  community: "From the community",
};

export const REPORT_REASONS = {
  closed: "Closed down",
  moved: "Moved",
  wrong_diet: "Veg / non-veg wrong",
  wrong_info: "Other info wrong",
} as const;

export const WEB_URL = "https://eatatezz.netlify.app";

export function directionsUrl(v: Pick<Vendor, "name" | "placeId">) {
  const q = encodeURIComponent(`${v.name}, Lucknow`);
  return `https://www.google.com/maps/dir/?api=1&destination=${q}${v.placeId ? `&destination_place_id=${v.placeId}` : ""}`;
}

/** Characters that break PostgREST `or()` filter syntax. */
export const searchTerm = (s: string) => s.replace(/[\\%_,().*:"]/g, " ").trim().slice(0, 60);
