import type { Enums, Views } from "./database.types";
import { env } from "./env";

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
  landmark: string | null;
  areaSlug: string | null;
  areaName: string | null;
  rating: number;
  reviewCount: number;
};

export type Area = { id: number; slug: string; name: string; lat: number | null; lng: number | null; vendorCount: number };

export type Dish = {
  slug: string;
  name: string;
  diet: Diet;
  category: string;
  description: string | null;
  famousAt: string | null;
  season: string | null;
};

export const PLAYLIST_SECTIONS = ["non_veg", "veg", "vegan", "underrated", "area", "community"] as const;
export type PlaylistSection = (typeof PLAYLIST_SECTIONS)[number];

export type Playlist = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  section: PlaylistSection;
  curator: string;
  ownerId: string | null;
  itemCount: number;
  preview: string[];
};

export type Review = { id: string; rating: number; body: string | null; createdAt: string; author: string };

/** The view's columns are nullable in the generated types; real rows always have them. */
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
    landmark: r.landmark,
    areaSlug: r.area_slug,
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
  underrated: "Underrated",
  area: "Area walk",
  community: "Community",
};

export const REPORT_REASONS = {
  closed: "Closed down",
  moved: "Moved somewhere else",
  wrong_diet: "Veg / non-veg is wrong",
  wrong_info: "Other details are wrong",
  other: "Something else",
} as const;
export type ReportReason = keyof typeof REPORT_REASONS;

/** "Shop | Area | Lucknow" → "Shop" */
export function cleanName(name: string) {
  return name.split(/\s[|•]\s/)[0].trim();
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const mapsQuery = (v: Pick<Vendor, "name" | "placeId">) => encodeURIComponent(`${v.name}, Lucknow`);

export const directionsUrl = (v: Pick<Vendor, "name" | "placeId">) =>
  `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery(v)}${v.placeId ? `&destination_place_id=${v.placeId}` : ""}`;

export const mapsUrl = (v: Pick<Vendor, "name" | "placeId">) =>
  `https://www.google.com/maps/search/?api=1&query=${mapsQuery(v)}${v.placeId ? `&query_place_id=${v.placeId}` : ""}`;

export const absoluteUrl = (path: string) => new URL(path, env.siteUrl).toString();

/** Only same-site paths are allowed as post-login redirects. */
export const safeNext = (next: string | null | undefined, fallback = "/account") =>
  next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
