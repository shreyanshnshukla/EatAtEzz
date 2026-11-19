import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Your account", robots: { index: false } };

export default async function Account() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const name = profile?.display_name ?? user.email ?? "Foodie";
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
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

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/playlists" className="rounded-2xl border border-line bg-card p-6 transition hover:border-caramel">
          <p className="font-display text-xl text-cream">Browse Food Playlists</p>
          <p className="mt-1 text-sm text-muted">24 curated lists to start with.</p>
        </Link>
        <Link href="/decide" className="rounded-2xl border border-line bg-card p-6 transition hover:border-caramel">
          <p className="font-display text-xl text-cream">Decide for me</p>
          <p className="mt-1 text-sm text-muted">One tap, one food spot.</p>
        </Link>
      </div>
      <p className="mt-6 rounded-2xl border border-dashed border-line p-6 text-sm text-muted">
        Saved spots, reviews and your own playlists are coming next.
      </p>

      <form action="/auth/signout" method="post" className="mt-10">
        <button type="submit" className="rounded-xl border border-line px-5 py-2.5 text-sm text-cream hover:border-beige">
          Sign out
        </button>
      </form>
    </div>
  );
}
