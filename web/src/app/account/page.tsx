import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/common/Avatar";
import { CreatePlaylistForm } from "@/components/playlist/CreatePlaylistForm";
import { ButtonLink, EmptyState, Grid, Section } from "@/components/ui/primitives";
import { button, card, cardLink } from "@/components/ui/styles";
import { VendorCard } from "@/components/vendor/VendorCard";
import { myDashboard } from "@/lib/queries/me";
import { getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

const STATUS: Record<string, { label: string; tone: string }> = {
  pending: { label: "Checking", tone: "text-caramel" },
  approved: { label: "Added", tone: "text-veg" },
  rejected: { label: "Not added", tone: "text-nonveg" },
};

export default async function Account() {
  const me = await getProfile();
  if (!me) redirect("/login?next=/account");
  const { saved, playlists, suggestions, reviewCount } = await myDashboard(me.id);
  const stats = [
    ["Saved", saved.length],
    ["Reviews", reviewCount],
    ["Playlists", playlists.length],
  ] as const;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar name={me.name} url={me.avatarUrl} size={64} />
          <div>
            <h1 className="font-display text-3xl text-cream">Namaste, {me.name.split(" ")[0]}</h1>
            <p className="text-sm text-muted">{me.email}</p>
          </div>
        </div>
        <dl className="flex gap-6">
          {stats.map(([k, n]) => (
            <div key={k}><dt className="text-xs text-muted">{k}</dt><dd className="font-display text-2xl text-cream">{n}</dd></div>
          ))}
        </dl>
      </div>

      <Section id="saved" title="Want to try">
        {saved.length ? (
          <Grid cols={4}>{saved.map((v) => <VendorCard key={v.id} v={v} />)}</Grid>
        ) : (
          <EmptyState>
            Tap ♡ Want to try on any spot and it shows up here. <Link href="/explore" className="text-beige underline underline-offset-4">Explore spots</Link>
          </EmptyState>
        )}
      </Section>

      <Section id="mine" title="Your playlists">
        <CreatePlaylistForm />
        {playlists.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((p) => (
              <li key={p.id}>
                <Link href={`/playlist/${p.slug}`} className={`${cardLink} p-5`}>
                  <p className="text-xs text-muted">{p.count} spots</p>
                  <p className="mt-1 font-display text-xl text-cream">{p.title}</p>
                  {p.tagline ? <p className="mt-1 text-sm italic text-caramel">{p.tagline}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section id="suggested" title="Spots you suggested" aside={<ButtonLink href="/suggest" variant="secondary">Suggest a spot</ButtonLink>}>
        {suggestions.length ? (
          <ul className={`${card} divide-y divide-line`}>
            {suggestions.map((s) => {
              const status = STATUS[s.status] ?? STATUS.pending;
              return (
                <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                  <span className="text-cream">{s.name} <span className="text-muted">· {s.category}</span></span>
                  <span className={status.tone}>{status.label}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">Know a thela that isn&apos;t on EatAtEzz yet? Tell us.</p>
        )}
      </Section>

      <form action="/auth/signout" method="post" className="mt-14">
        <button type="submit" className={button("secondary")}>Sign out</button>
      </form>
    </div>
  );
}
