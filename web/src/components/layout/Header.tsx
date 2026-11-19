import Link from "next/link";
import { getProfile } from "@/lib/supabase/server";
import { Avatar } from "@/components/common/Avatar";
import { button } from "@/components/ui/styles";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/explore", label: "Explore", always: true },
  { href: "/playlists", label: "Playlists", always: true },
  { href: "/areas", label: "Areas" },
  { href: "/dishes", label: "Dishes" },
];

export async function Header() {
  const me = await getProfile();
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="EatAtEzz home">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-1 text-sm" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${n.always ? "inline-block" : "hidden md:inline-block"} rounded-lg px-3 py-2 text-muted transition hover:bg-card hover:text-cream`}
            >
              {n.label}
            </Link>
          ))}
          {me?.isAdmin ? (
            <Link href="/admin" className="hidden rounded-lg px-3 py-2 text-caramel hover:bg-card md:inline-block">
              Admin
            </Link>
          ) : null}
          <Link href="/decide" className={button("primary", "md", "ml-1 hidden sm:inline-flex")}>
            Decide for me
          </Link>
          {me ? (
            <Link href="/account" aria-label="Your account" className="ml-1">
              <Avatar name={me.name} url={me.avatarUrl} size={36} />
            </Link>
          ) : (
            <Link href="/login" className="ml-1 rounded-lg px-3 py-2 text-cream transition hover:bg-card">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
