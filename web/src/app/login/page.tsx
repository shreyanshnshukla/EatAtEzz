import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleButton } from "@/components/GoogleButton";
import { Wordmark } from "@/components/Logo";
import { getUser } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

type SP = Promise<{ next?: string; error?: string }>;

export default async function Login({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const next = sp.next && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/account";
  const user = await getUser();
  if (user) redirect(next);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-180px)] max-w-5xl items-center gap-10 px-4 py-14 md:grid-cols-2">
      <div className="hidden md:block">
        <p className="text-sm uppercase tracking-[0.2em] text-caramel">Welcome to</p>
        <Wordmark className="mt-2 block text-6xl" />
        <ul className="mt-8 space-y-4 text-muted">
          <li className="rounded-xl border border-line bg-card p-4">
            <span className="text-cream">Save spots</span> you want to try, and the ones you love.
          </li>
          <li className="rounded-xl border border-line bg-card p-4">
            <span className="text-cream">Rate and review</span> so the next person eats better.
          </li>
          <li className="rounded-xl border border-line bg-card p-4">
            <span className="text-cream">Make your own Food Playlists</span> and share them.
          </li>
        </ul>
      </div>

      <div className="w-full rounded-3xl border border-line bg-card p-8 md:p-10">
        <h1 className="font-display text-3xl text-cream">Sign in</h1>
        <p className="mt-2 text-muted">One tap with your Google account. No passwords.</p>
        {sp.error ? (
          <p role="alert" className="mt-5 rounded-xl border border-nonveg/50 bg-nonveg/10 p-3 text-sm text-cream">
            Sign-in didn&apos;t finish. Please try again.
          </p>
        ) : null}
        <div className="mt-8">
          <GoogleButton next={next} />
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          By continuing you agree to use EatAtEzz fairly. We only use your name, email and photo from Google
          to set up your profile.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/explore" className="text-beige underline-offset-4 hover:underline">
            Just browsing? Explore without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}
