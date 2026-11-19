export type Diet = "veg" | "non_veg" | "both" | "vegan";

export type VendorCard = {
  id: string;
  slug: string;
  name: string;
  kind: string;
  category: string;
  speciality: string | null;
  diet: Diet;
  google_place_id: string | null;
  is_verified: boolean;
  area_slug: string | null;
  area_name: string | null;
  avg_rating: number;
  review_count: number;
};

export type Playlist = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  section: "non_veg" | "veg" | "vegan" | "underrated" | "area";
  curator: string;
  count: number;
};

export const DIET_LABEL: Record<Diet, string> = {
  veg: "Veg",
  non_veg: "Non-veg",
  both: "Veg & non-veg",
  vegan: "Vegan",
};

export const SECTION_LABEL: Record<Playlist["section"], string> = {
  non_veg: "Non-veg",
  veg: "Veg",
  vegan: "Vegan",
  underrated: "Underrated & everyday",
  area: "Area walks",
};

export function cleanName(name: string) {
  return name.split(/\s[|•]\s/)[0].trim();
}

export function directionsUrl(v: Pick<VendorCard, "name" | "google_place_id">) {
  const q = encodeURIComponent(`${v.name}, Lucknow`);
  return v.google_place_id
    ? `https://www.google.com/maps/dir/?api=1&destination=${q}&destination_place_id=${v.google_place_id}`
    : `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}
