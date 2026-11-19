import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-6xl italic text-caramel">404</p>
      <h1 className="mt-4 font-display text-3xl text-cream">Yeh gali khaali hai</h1>
      <p className="mt-2 text-muted">This page doesn&apos;t exist, but plenty of food does.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/explore" className="rounded-xl border border-beige/50 bg-beige/10 px-5 py-3 font-medium text-beige hover:bg-beige/20">
          Explore food spots
        </Link>
        <Link href="/" className="rounded-xl border border-line px-5 py-3 text-cream hover:border-beige">
          Home
        </Link>
      </div>
    </div>
  );
}
