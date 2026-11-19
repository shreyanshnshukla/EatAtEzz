import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DietBadge } from "@/components/DietBadge";
import { SECTION_LABEL } from "@/components/PlaylistCard";
import { getPlaylist } from "@/lib/data";
import { cleanName, directionsUrl, SITE_URL } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getPlaylist(slug);
  if (!res) return {};
  return {
    title: `${res.playlist.title}: ${res.playlist.tagline ?? "a Lucknow food playlist"}`,
    description: res.playlist.description ?? undefined,
    alternates: { canonical: `/playlist/${slug}` },
  };
}

export default async function PlaylistPage({ params }: { params: Params }) {
  const { slug } = await params;
  const res = await getPlaylist(slug);
  if (!res) notFound();
  const { playlist: p, vendors } = res;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: p.title,
    description: p.description,
    itemListElement: vendors.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/vendor/${v.slug}`,
      name: cleanName(v.name),
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/playlists" className="hover:text-cream">Food Playlists</Link> <span aria-hidden="true">/</span>{" "}
        {SECTION_LABEL[p.section]}
      </nav>

      <header className="mt-4 rounded-3xl border border-line bg-card p-8">
        <p className="text-sm text-caramel">
          {SECTION_LABEL[p.section]} · {vendors.length} spots · by {p.curator}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-cream md:text-5xl">{p.title}</h1>
        {p.tagline ? <p className="mt-2 text-lg italic text-beige">{p.tagline}</p> : null}
        {p.description ? <p className="mt-4 max-w-2xl text-muted">{p.description}</p> : null}
      </header>

      <ol className="mt-8 space-y-3">
        {vendors.map((v, i) => (
          <li key={v.id} className="flex gap-4 rounded-2xl border border-line bg-card p-4 sm:p-5">
            <span className="w-8 shrink-0 font-display text-3xl italic text-caramel" aria-hidden="true">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link href={`/vendor/${v.slug}`} className="font-display text-xl text-cream hover:text-beige">
                {cleanName(v.name)}
              </Link>
              {v.speciality ? <p className="mt-1 text-sm text-muted">{v.speciality}</p> : null}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <DietBadge diet={v.diet} />
                {v.area_name ? <span className="text-xs text-muted">{v.area_name}</span> : null}
              </div>
            </div>
            <a
              href={directionsUrl(v.google_place_id, v.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-fit shrink-0 rounded-xl border border-line px-3 py-2 text-xs text-cream hover:border-beige sm:block"
            >
              Directions
            </a>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-center text-sm text-muted">
        Missing a spot?{" "}
        <a className="text-beige underline underline-offset-4" href={`mailto:hello@eatatezz.in?subject=${encodeURIComponent("Suggestion for " + p.title)}`}>
          Suggest one
        </a>
      </p>
    </div>
  );
}
