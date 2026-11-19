import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/common/GoogleButton";
import { Wordmark } from "@/components/layout/Wordmark";
import { card } from "@/components/ui/styles";
import { safeNext } from "@/lib/domain";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

const PERKS = [
  ["Save spots", "you want to try, and the ones you love."],
  ["Rate and review", "so the next person eats better."],
  ["Make your own Food Playlists", "and share them."],
];

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getUser()) redirect(next);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] max-w-5xl items-center gap-10 px-4 py-14 md:grid-cols-2">
      <div className="hidden md:block">
        <p className="text-sm uppercase tracking-[0.2em] text-caramel">Welcome to</p>
        <Wordmark className="mt-2 block text-6xl" />
        <ul className="mt-8 space-y-4 text-muted">
          {PERKS.map(([strong, rest]) => (
            <li key={strong} className={`${card} p-4`}><span className="text-cream">{strong}</span> {rest}</li>
          ))}
        </ul>
      </div>
      <div className="w-full rounded-3xl border border-line bg-card p-8 md:p-10">
        <h1 className="font-display text-3xl text-cream">Sign in</h1>
        <p className="mt-2 text-muted">One tap with your Google account. No passwords.</p>
        {sp.error ? (
          <p role="alert" className="mt-5 rounded-xl border border-nonveg/50 bg-nonveg/10 p-3 text-sm text-cream">Sign-in didn&apos;t finish. Please try again.</p>
        ) : null}
        <div className="mt-8"><GoogleButton next={next} /></div>
        <p className="mt-6 text-xs leading-relaxed text-muted">We only use your name, email and photo from Google to set up your profile.</p>
        <p className="mt-6 text-sm">
          <Link href="/explore" className="text-beige underline-offset-4 hover:underline">Just browsing? Explore without signing in</Link>
        </p>
      </div>
    </div>
  );
}
