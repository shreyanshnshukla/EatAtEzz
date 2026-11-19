import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DietBadge } from "@/components/DietBadge";
import { VendorCard } from "@/components/VendorCard";
import { getPlaylistsForVendor, getSimilar, getVendor } from "@/lib/data";
import { cleanName, directionsUrl, mapsUrl, SITE_URL } from "@/lib/format";

export const revalidate = 3600;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVendor(slug);
  if (!v) return {};
  const name = cleanName(v.name);
  const where = v.area_name ? `${v.area_name}, Lucknow` : "Lucknow";
  return {
    title: `${name}, ${where}`,
    description: `${name} in ${where}: ${v.speciality ?? v.category}. Directions, diet and what to order.`,
    alternates: { canonical: `/vendor/${slug}` },
  };
}

export default async function VendorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const v = await getVendor(slug);
  if (!v) notFound();
  const [similar, inPlaylists] = await Promise.all([getSimilar(v), getPlaylistsForVendor(v.id)]);
  const name = cleanName(v.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name,
    url: `${SITE_URL}/vendor/${v.slug}`,
    servesCuisine: v.category,
    address: {
      "@type": "PostalAddress",
      addressLocality: v.area_name ? `${v.area_name}, Lucknow` : "Lucknow",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    ...(v.review_count > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: v.avg_rating, reviewCount: v.review_count } }
      : {}),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/explore" className="hover:text-cream">Explore</Link>
        {v.area_slug ? (
          <>
            {" "}<span aria-hidden="true">/</span>{" "}
            <Link href={`/area/${v.area_slug}`} className="hover:text-cream">{v.area_name}</Link>
          </>
        ) : null}
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-sm uppercase tracking-wider text-caramel">{v.category} · {v.kind}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-cream md:text-5xl">{name}</h1>
          {v.speciality ? <p className="mt-3 text-lg text-muted">Known for: <span className="text-cream">{v.speciality}</span></p> : null}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <DietBadge diet={v.diet} />
            {v.area_name ? (
              <Link href={`/area/${v.area_slug}`} className="rounded-full bg-card-2 px-2.5 py-1 text-xs text-cream hover:text-beige">
                {v.area_name}
              </Link>
            ) : null}
            {v.is_verified ? (
              <span className="rounded-full bg-card-2 px-2.5 py-1 text-xs text-veg">Verified by EatAtEzz</span>
            ) : (
              <span className="rounded-full bg-card-2 px-2.5 py-1 text-xs text-muted">Not yet verified on the ground</span>
            )}
          </div>
          {v.landmark ? <p className="mt-4 text-sm text-muted">Landmark: {v.landmark}</p> : null}
          {inPlaylists.length ? (
            <div className="mt-6">
              <p className="text-sm text-muted">Featured in</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {inPlaylists.map((pl) => (
                  <Link
                    key={pl.slug}
                    href={`/playlist/${pl.slug}`}
                    className="rounded-full border border-line bg-card px-3 py-1.5 text-sm text-cream hover:border-caramel"
                  >
                    {pl.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-card p-6">
          <p className="text-sm text-muted">Ratings</p>
          {v.review_count > 0 ? (
            <p className="mt-1 font-display text-3xl text-cream">
              ★ {Number(v.avg_rating).toFixed(1)}{" "}
              <span className="text-base text-muted">({v.review_count} EatAtEzz reviews)</span>
            </p>
          ) : (
            <p className="mt-1 text-cream">No EatAtEzz reviews yet. Be the first, coming soon in the app.</p>
          )}
          <div className="mt-6 grid gap-3">
            <a
              href={directionsUrl(v.google_place_id, v.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-beige/50 bg-beige/10 px-4 py-3 text-center font-medium text-beige hover:bg-beige/20"
            >
              Get directions
            </a>
            <a
              href={mapsUrl(v.google_place_id, v.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-line px-4 py-3 text-center text-cream hover:border-beige"
            >
              Open in Google Maps
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            Is this your shop?{" "}
            <a className="underline underline-offset-4" href={`mailto:hello@eatatezz.in?subject=Claim%20${encodeURIComponent(name)}`}>
              Claim this listing
            </a>
          </p>
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="mt-16" aria-labelledby="similar">
          <h2 id="similar" className="font-display text-2xl text-cream">More {v.category.toLowerCase()} nearby</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <VendorCard key={s.id} v={s} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
