import type { Metadata } from "next";
import { PlaylistCard } from "@/components/PlaylistCard";
import { getPlaylists } from "@/lib/data";
import type { Playlist } from "@/lib/types";

export const metadata: Metadata = {
  title: "Food Playlists: curated Lucknow food trails",
  description:
    "24 curated Lucknow food playlists: Galouti Gang, Biryani Bhai Log, Chaat Pe Charcha, Kulfi Kingdom, vegan picks, underrated gems and area walks.",
  alternates: { canonical: "/playlists" },
};

const SECTIONS: { key: Playlist["section"]; title: string; blurb: string }[] = [
  { key: "non_veg", title: "Non-veg", blurb: "Kebabs, biryani, nihari and the old-city classics." },
  { key: "veg", title: "Veg", blurb: "Chaat, kachori, kulfi, mithai, chai and full veg meals." },
  { key: "vegan", title: "Vegan", blurb: "Plant-based in the city of kebabs." },
  { key: "underrated", title: "Underrated & everyday", blurb: "Hidden gems, momos and pocket-friendly picks." },
  { key: "area", title: "Area walks", blurb: "Eat your way through one neighbourhood." },
];

export default async function Playlists() {
  const playlists = await getPlaylists();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <p className="text-sm uppercase tracking-[0.2em] text-caramel">Food Playlists</p>
      <h1 className="mt-2 font-display text-4xl text-cream md:text-5xl">Lucknow, one playlist at a time</h1>
      <p className="mt-3 max-w-2xl text-muted">
        {playlists.length} trails picked by the EatAtEzz team. Food bloggers&apos; playlists are coming soon.
      </p>
      {SECTIONS.map((s) => {
        const list = playlists.filter((p) => p.section === s.key);
        if (!list.length) return null;
        return (
          <section key={s.key} className="mt-12" aria-labelledby={`s-${s.key}`}>
            <h2 id={`s-${s.key}`} className="font-display text-2xl text-beige">{s.title}</h2>
            <p className="mt-1 text-sm text-muted">{s.blurb}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <PlaylistCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
