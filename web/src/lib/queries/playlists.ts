import { cache } from "react";
import { cleanName, PLAYLIST_SECTIONS, type Playlist, type PlaylistSection } from "@/lib/domain";
import { db } from "@/lib/supabase/public";
import { getVendorsByIds } from "./vendors";

const COLUMNS = "id, slug, title, tagline, description, section, curator, owner_id";

type Row = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  section: string;
  curator: string;
  owner_id: string | null;
  playlist_items: { position: number; vendor_id: string; vendors: { name: string } | null }[];
};

const asSection = (s: string): PlaylistSection =>
  (PLAYLIST_SECTIONS as readonly string[]).includes(s) ? (s as PlaylistSection) : "community";

function toPlaylist(r: Row): Playlist {
  const items = [...r.playlist_items].sort((a, b) => a.position - b.position);
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    description: r.description,
    section: asSection(r.section),
    curator: r.curator,
    ownerId: r.owner_id,
    itemCount: items.length,
    preview: items.slice(0, 3).flatMap((i) => (i.vendors ? [cleanName(i.vendors.name)] : [])),
  };
}

const itemsWithNames = "playlist_items(position, vendor_id, vendors(name))";

export const listPlaylists = cache(async (): Promise<Playlist[]> => {
  const { data, error } = await db
    .from("playlists")
    .select(`${COLUMNS}, ${itemsWithNames}`)
    .eq("is_published", true)
    .order("position")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as Row[]).map(toPlaylist);
});

export const getPlaylist = cache(async (slug: string) => {
  const { data, error } = await db.from("playlists").select(`${COLUMNS}, ${itemsWithNames}`).eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as unknown as Row;
  const ids = [...row.playlist_items].sort((a, b) => a.position - b.position).map((i) => i.vendor_id);
  return { playlist: toPlaylist(row), vendors: await getVendorsByIds(ids) };
});

export async function playlistsForVendor(vendorId: string) {
  const { data } = await db.from("playlist_items").select("playlists(slug, title)").eq("vendor_id", vendorId);
  return (data ?? []).flatMap((r) => (r.playlists ? [r.playlists] : []));
}
