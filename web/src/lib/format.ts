import type { Diet } from "./types";

export const DIET_LABEL: Record<Diet, string> = {
  veg: "Veg",
  non_veg: "Non-veg",
  both: "Veg & non-veg",
  vegan: "Vegan",
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eatatezz.netlify.app";

export function mapsUrl(placeId: string | null, name: string) {
  const q = encodeURIComponent(`${name}, Lucknow`);
  return placeId
    ? `https://www.google.com/maps/search/?api=1&query=${q}&query_place_id=${placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function directionsUrl(placeId: string | null, name: string) {
  const q = encodeURIComponent(`${name}, Lucknow`);
  return placeId
    ? `https://www.google.com/maps/dir/?api=1&destination=${q}&destination_place_id=${placeId}`
    : `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

/** Cleans Google-style names like "Shop | Area | Lucknow" down to the shop name. */
export function cleanName(name: string) {
  return name.split(/\s[|•]\s/)[0].trim();
}
