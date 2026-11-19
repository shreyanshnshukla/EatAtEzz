import type { Metadata } from "next";
import Link from "next/link";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { Grid, PageHeader, Section } from "@/components/ui/primitives";
import type { PlaylistSection } from "@/lib/domain";
import { listPlaylists } from "@/lib/queries/playlists";

export const metadata: Metadata = {
  title: "Food Playlists: curated Lucknow food trails",
  description: "Curated Lucknow food playlists: Galouti Gang, Biryani Bhai Log, Chaat Pe Charcha, Kulfi Kingdom, vegan picks, underrated gems and area walks.",
  alternates: { canonical: "/playlists" },
};

const SECTIONS: { key: PlaylistSection; title: string; blurb: string }[] = [
  { key: "non_veg", title: "Non-veg", blurb: "Kebabs, biryani, nihari and the old-city classics." },
  { key: "veg", title: "Veg", blurb: "Chaat, kachori, kulfi, mithai, chai and full veg meals." },
  { key: "vegan", title: "Vegan", blurb: "Plant-based in the city of kebabs." },
  { key: "underrated", title: "Underrated & everyday", blurb: "Hidden gems, momos and pocket-friendly picks." },
  { key: "area", title: "Area walks", blurb: "Eat your way through one neighbourhood." },
  { key: "community", title: "From the community", blurb: "Playlists made by Lucknow foodies." },
];

/** Community playlists only show once they're useful. */
const MIN_COMMUNITY_SPOTS = 3;

export default async function Playlists() {
  const playlists = await listPlaylists();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <PageHeader eyebrow="Food Playlists" title="Lucknow, one playlist at a time">
        Trails picked by the EatAtEzz team and by Lucknow foodies.{" "}
        <Link href="/account" className="text-beige underline underline-offset-4">Make your own</Link>.
      </PageHeader>
      {SECTIONS.map((s) => {
        const list = playlists.filter((p) => p.section === s.key && (s.key !== "community" || p.itemCount >= MIN_COMMUNITY_SPOTS));
        return list.length ? (
          <Section key={s.key} id={`s-${s.key}`} title={s.title}>
            <p className="-mt-3 mb-5 text-sm text-muted">{s.blurb}</p>
            <Grid>{list.map((p) => <PlaylistCard key={p.id} p={p} />)}</Grid>
          </Section>
        ) : null;
      })}
    </div>
  );
}
