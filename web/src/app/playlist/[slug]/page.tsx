import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButton } from "@/components/common/ShareButton";
import { DeletePlaylist, RemoveFromPlaylist } from "@/components/playlist/OwnerControls";
import { EmptyState, JsonLd } from "@/components/ui/primitives";
import { button, card } from "@/components/ui/styles";
import { DietBadge } from "@/components/vendor/DietBadge";
import { absoluteUrl, directionsUrl, SECTION_LABEL } from "@/lib/domain";
import { getPlaylist } from "@/lib/queries/playlists";
import { getUser } from "@/lib/supabase/server";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const res = await getPlaylist((await params).slug);
  if (!res) return {};
  const { playlist: p } = res;
  return {
    title: `${p.title}: ${p.tagline ?? "a Lucknow food playlist"}`,
    description: p.description ?? `${p.itemCount} Lucknow food spots, curated by ${p.curator}.`,
    alternates: { canonical: `/playlist/${p.slug}` },
  };
}

export default async function PlaylistPage({ params }: { params: Params }) {
  const res = await getPlaylist((await params).slug);
  if (!res) notFound();
  const { playlist: p, vendors } = res;
  const user = await getUser();
  const isOwner = Boolean(user && user.id === p.ownerId);

  return (
    <div className="mx-auto max-w-4xl px-4 pt-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: p.title,
          description: p.description,
          itemListElement: vendors.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/vendor/${v.slug}`), name: v.name })),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/playlists" className="hover:text-cream">Food Playlists</Link> / {SECTION_LABEL[p.section]}
      </nav>

      <header className="mt-4 rounded-3xl border border-line bg-card p-8">
        <p className="text-sm text-caramel">{SECTION_LABEL[p.section]} · {vendors.length} spots · by {p.curator}</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-cream md:text-5xl">{p.title}</h1>
        {p.tagline ? <p className="mt-2 text-lg italic text-beige">{p.tagline}</p> : null}
        {p.description ? <p className="mt-4 max-w-2xl text-muted">{p.description}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <ShareButton title={p.title} text={p.tagline ?? undefined} path={`/playlist/${p.slug}`} />
          {isOwner ? (
            <>
              <DeletePlaylist playlistId={p.id} />
              <p className="text-sm text-muted">Your playlist. Add spots from any shop page.</p>
            </>
          ) : null}
        </div>
      </header>

      {vendors.length ? (
        <ol className="mt-8 space-y-3">
          {vendors.map((v, i) => (
            <li key={v.id} className={`${card} flex gap-4 p-4 sm:p-5`}>
              <span aria-hidden="true" className="w-8 shrink-0 font-display text-3xl italic text-caramel">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <Link href={`/vendor/${v.slug}`} className="font-display text-xl text-cream hover:text-beige">{v.name}</Link>
                {v.speciality ? <p className="mt-1 text-sm text-muted">{v.speciality}</p> : null}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <DietBadge diet={v.diet} />
                  {v.areaName ? <span className="text-xs text-muted">{v.areaName}</span> : null}
                </div>
              </div>
              {isOwner ? <RemoveFromPlaylist playlistId={p.id} vendorId={v.id} playlistSlug={p.slug} /> : null}
              <a href={directionsUrl(v)} target="_blank" rel="noopener noreferrer" className={button("secondary", "sm", "hidden h-fit shrink-0 sm:inline-flex")}>
                Directions
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-8"><EmptyState>No spots yet. Open any shop and use &ldquo;Add to your playlist&rdquo;.</EmptyState></div>
      )}
    </div>
  );
}
