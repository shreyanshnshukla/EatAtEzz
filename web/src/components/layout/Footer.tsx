import Link from "next/link";
import { Wordmark } from "./Wordmark";

const LINKS = [
  { href: "/explore", label: "All food spots" },
  { href: "/playlists", label: "Food Playlists" },
  { href: "/areas", label: "Lucknow by area" },
  { href: "/dishes", label: "Famous dishes" },
  { href: "/decide", label: "Decide for me" },
  { href: "/suggest", label: "Suggest a spot" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <Wordmark className="text-xl" />
          <p className="mt-3 max-w-xs text-sm text-muted">Kya khaun? Sorted. Lucknow&apos;s street food, found by its people.</p>
        </div>
        <nav aria-label="Footer" className="text-sm">
          <p className="mb-3 font-medium text-beige">Explore</p>
          <ul className="space-y-2 text-muted">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-cream" href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-sm">
          <p className="mb-3 font-medium text-beige">For vendors</p>
          <p className="text-muted">
            Run a stall or shop? Claiming your listing is coming soon. Until then, write to{" "}
            <a className="text-cream underline underline-offset-4" href="mailto:hello@eatatezz.in">hello@eatatezz.in</a>.
          </p>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} EatAtEzz · Made in Lucknow ·{" "}
        <Link className="hover:text-cream" href="/privacy">Privacy</Link> ·{" "}
        <Link className="hover:text-cream" href="/terms">Terms</Link> ·{" "}
        <a className="hover:text-cream" href="https://github.com/shreyanshnshukla/EatAtEzz/blob/main/SECURITY.md">Security</a>
      </p>
    </footer>
  );
}
