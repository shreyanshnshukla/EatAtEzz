import Link from "next/link";
import { Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <Wordmark className="text-xl" />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Kya khaun? Sorted. Lucknow&apos;s street food, found by its people.
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium text-beige">Explore</p>
          <ul className="space-y-2 text-muted">
            <li><Link className="hover:text-cream" href="/explore">All food spots</Link></li>
            <li><Link className="hover:text-cream" href="/playlists">Food Playlists</Link></li>
            <li><Link className="hover:text-cream" href="/areas">Lucknow by area</Link></li>
            <li><Link className="hover:text-cream" href="/dishes">Famous dishes</Link></li>
            <li><Link className="hover:text-cream" href="/decide">Decide for me</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-medium text-beige">For vendors</p>
          <p className="text-muted">
            Run a stall or shop? Claiming your listing is coming soon. Until then, write to{" "}
            <a className="text-cream underline underline-offset-4" href="mailto:hello@eatatezz.in">
              hello@eatatezz.in
            </a>
            .
          </p>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-muted">
        © {new Date().getFullYear()} EatAtEzz · Made in Lucknow
      </p>
    </footer>
  );
}
