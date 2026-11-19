import Link from "next/link";
import { AreaMap } from "@/components/AreaMap";
import { DietBadge } from "@/components/DietBadge";
import { LogoMark } from "@/components/Logo";
import { getAreas, getDishes, getVendorCount } from "@/lib/data";

export const revalidate = 3600;

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

export default async function Home() {
  const [areas, dishes, vendorCount] = await Promise.all([getAreas(), getDishes(), getVendorCount()]);
  const topAreas = areas.slice(0, 8);
  const featured = dishes.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 md:grid-cols-[1.2fr_1fr] md:pt-20">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-caramel">Lucknow street food, sorted</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-cream md:text-7xl">
            Kya khaun?
            <br />
            <span className="italic text-beige">Sorted.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Tunday&apos;s galouti, Chowk&apos;s nihari, Hazratganj&apos;s basket chaat, and the thela down
            your gali. {vendorCount}+ food spots across Lucknow, found by its people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/decide"
              className="rounded-xl bg-beige px-6 py-3.5 font-medium text-ink transition hover:bg-cream"
            >
              Decide for me
            </Link>
            <Link
              href="/explore"
              className="rounded-xl border border-line px-6 py-3.5 text-cream transition hover:border-beige"
            >
              Explore all spots
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-muted">Food spots</dt>
              <dd className="font-display text-3xl text-cream">{vendorCount}+</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Areas</dt>
              <dd className="font-display text-3xl text-cream">{areas.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Famous dishes</dt>
              <dd className="font-display text-3xl text-cream">{dishes.length}</dd>
            </div>
          </dl>
        </div>
        <div className="relative mx-auto hidden aspect-square w-full max-w-sm items-center justify-center rounded-[40px] border border-line bg-card md:flex">
          <LogoMark size={220} />
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-line bg-ink px-4 py-1.5 text-sm text-beige">
            Muskuraiye, aap Lucknow mein hain
          </span>
        </div>
      </section>

      {/* Cravings */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="cravings">
        <h2 id="cravings" className="font-display text-3xl text-cream">What are you craving?</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CRAVINGS.map((c) => (
            <Link
              key={c.label}
              href={`/explore?category=${encodeURIComponent(c.category)}`}
              className="rounded-2xl border border-line bg-card p-5 transition hover:border-caramel"
            >
              <p className="font-display text-xl text-cream">{c.label}</p>
              <p className="mt-1 text-sm text-muted">{c.note}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Areas */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="areas">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="areas" className="font-display text-3xl text-cream">Lucknow, gali by gali</h2>
            <p className="mt-2 text-muted">Tap a bubble to see what&apos;s cooking in that area.</p>
          </div>
          <Link href="/areas" className="hidden text-sm text-beige underline-offset-4 hover:underline sm:block">
            All areas
          </Link>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <AreaMap areas={areas} />
          <ul className="grid content-start gap-2">
            {topAreas.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/area/${a.slug}`}
                  className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3 transition hover:border-caramel"
                >
                  <span className="text-cream">{a.name}</span>
                  <span className="text-sm text-muted">{a.vendor_count} spots</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Famous dishes */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="dishes">
        <div className="flex items-end justify-between gap-4">
          <h2 id="dishes" className="font-display text-3xl text-cream">Lucknow ke mashoor dishes</h2>
          <Link href="/dishes" className="text-sm text-beige underline-offset-4 hover:underline">
            See all {dishes.length}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((d) => (
            <article key={d.slug} className="rounded-2xl border border-line bg-card p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wider text-caramel">{d.category}</p>
                <DietBadge diet={d.diet} />
              </div>
              <h3 className="mt-2 font-display text-xl text-cream">{d.name}</h3>
              <p className="mt-2 text-sm text-muted">{d.description}</p>
              {d.famous_at ? <p className="mt-3 text-sm text-beige">Try it at: {d.famous_at}</p> : null}
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="how">
        <h2 id="how" className="font-display text-3xl text-cream">Ezz, in three steps</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Tell us the mood", "Veg or non-veg, your area, and what you're craving. Or skip it all."],
            ["We pick the spot", "One good, nearby stall instead of an endless scroll."],
            ["Go eat", "Directions in one tap. Rate it after, so the next person eats better."],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-2xl border border-line bg-card p-6">
              <span className="font-display text-4xl italic text-caramel">{i + 1}</span>
              <p className="mt-3 text-lg text-cream">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Vendor CTA */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-caramel bg-card-2 p-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl text-cream">Apni dukaan hai?</h2>
            <p className="mt-2 max-w-xl text-muted">
              Run a stall, thela or shop in Lucknow? Soon you can claim your listing, add your menu and
              timings, and reply to reviews. Free for street vendors.
            </p>
          </div>
          <a
            href="mailto:hello@eatatezz.in?subject=Claim%20my%20listing"
            className="rounded-xl bg-beige px-6 py-3.5 font-medium text-ink transition hover:bg-cream"
          >
            Get early access
          </a>
        </div>
      </section>
    </>
  );
}
