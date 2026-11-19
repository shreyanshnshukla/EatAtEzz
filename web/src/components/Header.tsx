import Link from "next/link";
import { Wordmark } from "./Logo";
import { getUser } from "@/lib/auth/server";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/playlists", label: "Playlists" },
  { href: "/areas", label: "Areas" },
  { href: "/dishes", label: "Dishes" },
];

export async function Header() {
  const user = await getUser();
  const name = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="EatAtEzz home">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${i < 2 ? "inline-block" : "hidden md:inline-block"} rounded-lg px-3 py-2 text-muted transition hover:bg-card hover:text-cream`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/decide"
            className="ml-1 hidden rounded-lg border border-beige/50 bg-beige/10 px-3.5 py-2 font-medium text-beige transition hover:bg-beige/20 sm:inline-block"
          >
            Decide for me
          </Link>
          {user ? (
            <Link href="/account" aria-label="Your account" className="ml-1">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="" referrerPolicy="no-referrer" className="h-9 w-9 rounded-full border border-line" />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-card-2 text-beige">
                  {name.charAt(0).toUpperCase() || "E"}
                </span>
              )}
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-1 rounded-lg px-3 py-2 text-cream transition hover:bg-card"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
