import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { getAreas } from "@/lib/data";
import { SITE_URL } from "@/lib/format";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, { data: vendors }] = await Promise.all([
    getAreas(),
    supabase.from("vendors").select("slug, updated_at"),
  ]);
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/explore`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/areas`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/dishes`, lastModified: now, priority: 0.8 },
    { url: `${SITE_URL}/decide`, lastModified: now, priority: 0.6 },
    ...areas.map((a) => ({ url: `${SITE_URL}/area/${a.slug}`, lastModified: now, priority: 0.7 })),
    ...(vendors ?? []).map((v) => ({
      url: `${SITE_URL}/vendor/${v.slug}`,
      lastModified: new Date(v.updated_at as string),
      priority: 0.5,
    })),
  ];
}
