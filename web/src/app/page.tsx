import Link from "next/link";
import { AreaMap } from "@/components/explore/AreaMap";
import { PlaylistCard } from "@/components/playlist/PlaylistCard";
import { ButtonLink, Grid, Section } from "@/components/ui/primitives";
import { card, cardLink } from "@/components/ui/styles";
import { DietBadge } from "@/components/vendor/DietBadge";
import { listAreas } from "@/lib/queries/areas";
import { listDishes } from "@/lib/queries/dishes";
import { listPlaylists } from "@/lib/queries/playlists";
import { countVendors } from "@/lib/queries/vendors";

const CRAVINGS = [
  { label: "Kebabs", category: "Kebabs", note: "Galouti, seekh, kakori" },
  { label: "Biryani", category: "Biryani", note: "Awadhi dum, slow-cooked" },
  { label: "Chaat", category: "Chaat", note: "Basket, tikki, batashe" },
  { label: "Kachori", category: "Kachori & breakfast", note: "Khasta with aloo sabzi" },
  { label: "Kulfi", category: "Kulfi & desserts", note: "Falooda, rabri, makhan malai" },
  { label: "Chai", category: "Chai", note: "Kulhad chai, bun makkhan" },
  { label: "Sweets", category: "Sweets", note: "Malai gilori, jalebi" },
  { label: "Momos", category: "Momos", note: "Steamed, fried, tandoori" },
];
const HERO_PLAYLISTS = ["galouti-gang", "chaat-pe-charcha", "kulfi-kingdom"];
const FEATURED_PLAYLISTS = ["biryani-bhai-log", "kachori-before-class", "nihari-before-noon", "plant-plate-lucknow", "underrated-gems", "hazratganj-evening-walk"];
const HERO_LAYOUT = [
  { top: 0, left: 40, rotate: -3 },
  { top: 120, left: 0, rotate: 2 },
  { top: 240, left: 70, rotate: -1 },
];

function pickBySlug<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  return slugs.flatMap((s) => items.filter((i) => i.slug === s));
}

export default async function Home() {
  const [areas, dishes, vendorCount, playlists] = await Promise.all([listAreas(), listDishes(), countVendors(), listPlaylists()]);
  const stats = [
    { label: "Food spots", value: `${vendorCount}+` },
    { label: "Areas", value: areas.length },
    { label: "Playlists", value: playlists.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-10 pb-6 pt-14 md:grid-cols-[1.2fr_1fr] md:pt-20">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-caramel">Lucknow street food, sorted</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-cream md:text-7xl">
            Kya khaun?
            <br />
            <span className="italic text-beige">Sorted.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Tunday&apos;s galouti, Chowk&apos;s nihari, Hazratganj&apos;s basket chaat, and the thela down your gali. Found by Lucknow, for Lucknow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/decide" size="lg">Decide for me</ButtonLink>
            <ButtonLink href="/explore" variant="secondary" size="lg">Explore all spots</ButtonLink>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs text-muted">{s.label}</dt>
                <dd className="font-display text-3xl text-cream">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative hidden h-[420px] md:block" aria-label="Featured food playlists">
          {pickBySlug(playlists, HERO_PLAYLISTS).map((p, i) => (
            <Link
              key={p.id}
              href={`/playlist/${p.slug}`}
              className={`${card} absolute w-72 p-5 shadow-2xl shadow-black/40 transition hover:z-10 hover:border-caramel`}
              style={{ top: HERO_LAYOUT[i].top, left: HERO_LAYOUT[i].left, transform: `rotate(${HERO_LAYOUT[i].rotate}deg)` }}
            >
              <p className="text-xs text-muted">Playlist · {p.itemCount} spots</p>
              <p className="mt-2 font-display text-2xl text-cream">{p.title}</p>
              <p className="mt-1 text-sm italic text-caramel">{p.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <Section id="cravings" title="What are you craving?">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CRAVINGS.map((c) => (
            <Link key={c.label} href={`/explore?category=${encodeURIComponent(c.category)}`} className={`${cardLink} p-5`}>
              <p className="font-display text-xl text-cream">{c.label}</p>
              <p className="mt-1 text-sm text-muted">{c.note}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="playlists" title="Food Playlists" aside={<Link href="/playlists" className="text-sm text-beige underline-offset-4 hover:underline">All {playlists.length}</Link>}>
        <Grid>
          {pickBySlug(playlists, FEATURED_PLAYLISTS).map((p) => <PlaylistCard key={p.id} p={p} />)}
        </Grid>
      </Section>

      <Section id="areas" title="Lucknow, gali by gali" aside={<Link href="/areas" className="text-sm text-beige underline-offset-4 hover:underline">All areas</Link>}>
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <AreaMap areas={areas} />
          <ul className="grid content-start gap-2">
            {areas.slice(0, 8).map((a) => (
              <li key={a.slug}>
                <Link href={`/area/${a.slug}`} className={`${cardLink} flex items-center justify-between px-4 py-3 hover:translate-y-0`}>
                  <span className="text-cream">{a.name}</span>
                  <span className="text-sm text-muted">{a.vendorCount} spots</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="dishes" title="Lucknow ke mashoor dishes" aside={<Link href="/dishes" className="text-sm text-beige underline-offset-4 hover:underline">See all {dishes.length}</Link>}>
        <Grid>
          {dishes.slice(0, 6).map((d) => (
            <article key={d.slug} className={`${card} p-5`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wider text-caramel">{d.category}</p>
                <DietBadge diet={d.diet} />
              </div>
              <h3 className="mt-2 font-display text-xl text-cream">{d.name}</h3>
              <p className="mt-2 text-sm text-muted">{d.description}</p>
              {d.famousAt ? <p className="mt-3 text-sm text-beige">Try it at: {d.famousAt}</p> : null}
            </article>
          ))}
        </Grid>
      </Section>

      <section className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-caramel bg-card-2 p-8 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl text-cream">Know a spot we&apos;re missing?</h2>
          <p className="mt-2 max-w-xl text-muted">
            Tell us about the thela in your gali. Vendors: claiming your own listing is coming soon, free for street stalls.
          </p>
        </div>
        <ButtonLink href="/suggest" size="lg">Suggest a spot</ButtonLink>
      </section>
    </div>
  );
}
