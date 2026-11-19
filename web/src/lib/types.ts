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
  landmark: string | null;
  city_slug: string;
  area_slug: string | null;
  area_name: string | null;
  area_lat: number | null;
  area_lng: number | null;
  avg_rating: number;
  review_count: number;
};

export type Area = {
  slug: string;
  name: string;
  lat: number | null;
  lng: number | null;
  vendor_count: number;
};

export type Dish = {
  slug: string;
  name: string;
  diet: Diet;
  category: string;
  description: string | null;
  famous_at: string | null;
  season: string | null;
};
