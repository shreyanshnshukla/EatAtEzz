import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/areas", label: "Areas" },
  { href: "/dishes", label: "Famous dishes" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="EatAtEzz home">
          <LogoMark size={36} />
          <Wordmark className="hidden sm:inline" />
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className={`${i === 0 ? "inline-block" : "hidden md:inline-block"} rounded-lg px-3 py-2 text-muted transition hover:bg-card hover:text-cream`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/decide"
            className="ml-1 rounded-lg bg-beige px-3.5 py-2 font-medium text-ink transition hover:bg-cream"
          >
            Decide for me
          </Link>
        </nav>
      </div>
    </header>
  );
}
