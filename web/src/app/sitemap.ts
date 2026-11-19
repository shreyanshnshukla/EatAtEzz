import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/domain";
import { listAreas } from "@/lib/queries/areas";
import { listPlaylists } from "@/lib/queries/playlists";
import { db } from "@/lib/supabase/public";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [areas, playlists, { data: vendors }] = await Promise.all([listAreas(), listPlaylists(), db.from("vendors").select("slug, updated_at")]);
  const page = (path: string, priority: number, lastModified = new Date()) => ({ url: absoluteUrl(path), lastModified, priority });
  return [
    page("/", 1),
    ...["/explore", "/playlists", "/areas", "/dishes"].map((p) => page(p, 0.8)),
    page("/decide", 0.6),
    ...areas.map((a) => page(`/area/${a.slug}`, 0.7)),
    ...playlists.map((p) => page(`/playlist/${p.slug}`, 0.7)),
    ...(vendors ?? []).map((v) => page(`/vendor/${v.slug}`, 0.5, new Date(v.updated_at))),
  ];
}
