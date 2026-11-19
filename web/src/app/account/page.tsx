import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatePlaylistForm } from "@/components/CreatePlaylistForm";
import { VendorCard } from "@/components/VendorCard";
import { createSupabaseServer } from "@/lib/auth/server";
import type { VendorCard as V } from "@/lib/types";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

const STATUS: Record<string, string> = { pending: "Checking", approved: "Added", rejected: "Not added" };

export default async function Account() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const [{ data: profile }, { data: savedRows }, { data: lists }, { data: suggestions }, { count: reviewCount }] =
    await Promise.all([
      supabase.from("profiles").select("display_name, avatar_url").eq("id", user.id).maybeSingle(),
      supabase.from("saved_vendors").select("vendor_id, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase
        .from("playlists")
        .select("id, slug, title, tagline, playlist_items(count)")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("vendor_suggestions")
        .select("id, name, category, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase.from("reviews").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]);

  const savedIds = (savedRows ?? []).map((r) => r.vendor_id as string);
  const { data: savedCards } = savedIds.length
    ? await supabase.from("vendor_cards").select("*").in("id", savedIds)
    : { data: [] };
  const byId = new Map(((savedCards ?? []) as V[]).map((c) => [c.id, c]));
  const saved = savedIds.map((id) => byId.get(id)).filter((v): v is V => Boolean(v));

  const name = profile?.display_name ?? user.email ?? "Foodie";
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt="" className="h-16 w-16 rounded-full border border-line" referrerPolicy="no-referrer" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-card-2 font-display text-2xl text-beige">
              {initial}
            </span>
          )}
          <div>
            <h1 className="font-display text-3xl text-cream">Namaste, {name.split(" ")[0]}</h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>
        </div>
        <dl className="flex gap-6">
          <div><dt className="text-xs text-muted">Saved</dt><dd className="font-display text-2xl text-cream">{saved.length}</dd></div>
          <div><dt className="text-xs text-muted">Reviews</dt><dd className="font-display text-2xl text-cream">{reviewCount ?? 0}</dd></div>
          <div><dt className="text-xs text-muted">Playlists</dt><dd className="font-display text-2xl text-cream">{lists?.length ?? 0}</dd></div>
        </dl>
      </div>

      <section className="mt-12" aria-labelledby="saved">
        <h2 id="saved" className="font-display text-2xl text-beige">Want to try</h2>
        {saved.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line p-6 text-muted">
            Tap ♡ Want to try on any spot and it shows up here.{" "}
            <Link href="/explore" className="text-beige underline underline-offset-4">Explore spots</Link>
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {saved.map((v) => <VendorCard key={v.id} v={v} />)}
          </div>
        )}
      </section>

      <section className="mt-12" aria-labelledby="mine">
        <h2 id="mine" className="font-display text-2xl text-beige">Your playlists</h2>
        <div className="mt-4"><CreatePlaylistForm /></div>
        {lists && lists.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lists.map((p) => (
              <li key={p.id}>
                <Link href={`/playlist/${p.slug}`} className="block rounded-2xl border border-line bg-card p-5 transition hover:border-caramel">
                  <p className="text-xs text-muted">
                    {((p.playlist_items as unknown as { count: number }[])?.[0]?.count ?? 0)} spots
                  </p>
                  <p className="mt-1 font-display text-xl text-cream">{p.title}</p>
                  {p.tagline ? <p className="mt-1 text-sm italic text-caramel">{p.tagline}</p> : null}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Create one above, then add spots from any shop page.</p>
        )}
      </section>

      <section className="mt-12" aria-labelledby="sugg">
        <div className="flex items-center justify-between gap-4">
          <h2 id="sugg" className="font-display text-2xl text-beige">Spots you suggested</h2>
          <Link href="/suggest" className="rounded-xl border border-line px-4 py-2 text-sm text-cream hover:border-beige">
            Suggest a spot
          </Link>
        </div>
        {suggestions && suggestions.length ? (
          <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-card">
            {suggestions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <span className="text-cream">{s.name} <span className="text-muted">· {s.category}</span></span>
                <span className={s.status === "approved" ? "text-veg" : s.status === "rejected" ? "text-nonveg" : "text-caramel"}>
                  {STATUS[s.status] ?? s.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">Know a thela that isn&apos;t on EatAtEzz yet? Tell us.</p>
        )}
      </section>

      <form action="/auth/signout" method="post" className="mt-14">
        <button type="submit" className="rounded-xl border border-line px-5 py-2.5 text-sm text-cream hover:border-beige">
          Sign out
        </button>
      </form>
    </div>
  );
}
