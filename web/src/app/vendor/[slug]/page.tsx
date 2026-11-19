import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/common/ShareButton";
import { ButtonLink, Grid, JsonLd, Section, Stars } from "@/components/ui/primitives";
import { button, card } from "@/components/ui/styles";
import { AddToPlaylist } from "@/components/vendor/AddToPlaylist";
import { DietBadge } from "@/components/vendor/DietBadge";
import { ReportForm } from "@/components/vendor/ReportForm";
import { ReviewForm } from "@/components/vendor/ReviewForm";
import { ReviewList } from "@/components/vendor/ReviewList";
import { SaveButton } from "@/components/vendor/SaveButton";
import { VendorCard } from "@/components/vendor/VendorCard";
import { absoluteUrl, directionsUrl, mapsUrl, type Vendor } from "@/lib/domain";
import { myVendorState } from "@/lib/queries/me";
import { playlistsForVendor } from "@/lib/queries/playlists";
import { listReviews } from "@/lib/queries/reviews";
import { getSimilar, getVendor } from "@/lib/queries/vendors";
import { getUser } from "@/lib/supabase/server";

type Params = Promise<{ slug: string }>;

const where = (v: Vendor) => (v.areaName ? `${v.areaName}, Lucknow` : "Lucknow");

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const v = await getVendor((await params).slug);
  if (!v) return {};
  return {
    title: `${v.name}, ${where(v)}`,
    description: `${v.name} in ${where(v)}: ${v.speciality ?? v.category}. Directions, reviews and what to order.`,
    alternates: { canonical: `/vendor/${v.slug}` },
  };
}

function jsonLd(v: Vendor) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: v.name,
    url: absoluteUrl(`/vendor/${v.slug}`),
    servesCuisine: v.category,
    address: { "@type": "PostalAddress", addressLocality: where(v), addressRegion: "Uttar Pradesh", addressCountry: "IN" },
    ...(v.reviewCount > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: v.rating, reviewCount: v.reviewCount } } : {}),
  };
}

export default async function VendorPage({ params }: { params: Params }) {
  const v = await getVendor((await params).slug);
  if (!v) notFound();

  const user = await getUser();
  const [similar, featuredIn, reviews, mine] = await Promise.all([
    getSimilar(v),
    playlistsForVendor(v.id),
    listReviews(v.id),
    user ? myVendorState(user.id, v.id) : null,
  ]);
  const signIn = `/login?next=/vendor/${v.slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <JsonLd data={jsonLd(v)} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/explore" className="hover:text-cream">Explore</Link>
        {v.areaSlug ? <> / <Link href={`/area/${v.areaSlug}`} className="hover:text-cream">{v.areaName}</Link></> : null}
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-sm uppercase tracking-wider text-caramel">{v.category} · {v.kind}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-cream md:text-5xl">{v.name}</h1>
          {v.speciality ? <p className="mt-3 text-lg text-muted">Known for: <span className="text-cream">{v.speciality}</span></p> : null}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <DietBadge diet={v.diet} />
            {v.areaSlug ? <Link href={`/area/${v.areaSlug}`} className="rounded-full bg-card-2 px-2.5 py-1 text-xs text-cream hover:text-beige">{v.areaName}</Link> : null}
            <span className={`rounded-full bg-card-2 px-2.5 py-1 text-xs ${v.verified ? "text-veg" : "text-muted"}`}>
              {v.verified ? "Verified by EatAtEzz" : "Not yet verified on the ground"}
            </span>
          </div>
          {v.landmark ? <p className="mt-4 text-sm text-muted">Landmark: {v.landmark}</p> : null}
          {featuredIn.length ? (
            <div className="mt-6">
              <p className="text-sm text-muted">Featured in</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {featuredIn.map((p) => (
                  <Link key={p.slug} href={`/playlist/${p.slug}`} className="rounded-full border border-line bg-card px-3 py-1.5 text-sm text-cream hover:border-caramel">{p.title}</Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className={`${card} h-fit p-6`}>
          <p className="text-sm text-muted">EatAtEzz rating</p>
          {v.reviewCount > 0 ? (
            <p className="mt-1 font-display text-3xl text-cream">
              {v.rating.toFixed(1)} <Stars value={v.rating} className="text-xl" /> <span className="text-base text-muted">({v.reviewCount})</span>
            </p>
          ) : (
            <p className="mt-1 text-cream">No reviews yet. Be the first.</p>
          )}
          <div className="mt-6 grid gap-3">
            {mine ? <SaveButton vendorId={v.id} slug={v.slug} saved={mine.saved} /> : <ButtonLink href={signIn} variant="secondary">♡ Sign in to save</ButtonLink>}
            <a href={directionsUrl(v)} target="_blank" rel="noopener noreferrer" className={button("primary", "md", "py-3")}>Get directions</a>
            <a href={mapsUrl(v)} target="_blank" rel="noopener noreferrer" className={button("secondary", "md", "py-3")}>Open in Google Maps</a>
            <ShareButton title={v.name} text={v.speciality ?? undefined} path={`/vendor/${v.slug}`} />
          </div>
          <div className="mt-5 border-t border-line pt-4">
            {mine ? <ReportForm vendorId={v.id} /> : null}
            <p className="mt-3 text-xs text-muted">
              Is this your shop? <a className="underline underline-offset-4" href={`mailto:hello@eatatezz.in?subject=${encodeURIComponent(`Claim ${v.name}`)}`}>Claim this listing</a>
            </p>
          </div>
        </aside>
      </div>

      <Section id="reviews" title={<>Reviews {v.reviewCount ? <span className="text-base text-muted">({v.reviewCount})</span> : null}</>}>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ReviewList reviews={reviews} />
          <div className="space-y-4">
            {mine ? (
              <>
                <ReviewForm vendorId={v.id} slug={v.slug} existing={mine.review} />
                <AddToPlaylist vendorId={v.id} slug={v.slug} playlists={mine.playlists} />
              </>
            ) : (
              <div className={`${card} p-6`}>
                <p className="text-cream">Ate here?</p>
                <p className="mt-1 text-sm text-muted">Sign in to rate it, save it or add it to your own playlist.</p>
                <ButtonLink href={signIn} className="mt-4">Sign in with Google</ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Section>

      {similar.length ? (
        <Section id="similar" title={`More ${v.category.toLowerCase()} nearby`}>
          <Grid>{similar.map((s) => <VendorCard key={s.id} v={s} />)}</Grid>
        </Section>
      ) : null}
    </div>
  );
}
