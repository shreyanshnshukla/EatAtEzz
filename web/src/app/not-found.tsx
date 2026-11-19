import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-6xl italic text-caramel">404</p>
      <h1 className="mt-4 font-display text-3xl text-cream">Yeh gali khaali hai</h1>
      <p className="mt-2 text-muted">This page doesn&apos;t exist, but plenty of food does.</p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/explore" size="lg">Explore food spots</ButtonLink>
        <ButtonLink href="/" variant="secondary" size="lg">Home</ButtonLink>
      </div>
    </div>
  );
}
