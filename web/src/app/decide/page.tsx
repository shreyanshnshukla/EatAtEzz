import type { Metadata } from "next";
import { DecideClient } from "@/components/DecideClient";
import { getAreas, getCategories } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Decide for me: what to eat in Lucknow",
  description: "Can't decide what to eat? Pick your area and mood, and EatAtEzz picks a Lucknow food spot for you.",
  alternates: { canonical: "/decide" },
};

export default async function Decide() {
  const [areas, categories] = await Promise.all([getAreas(), getCategories()]);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <p className="text-sm uppercase tracking-[0.2em] text-caramel">Decide for me</p>
      <h1 className="mt-2 font-display text-4xl text-cream md:text-5xl">
        Kya khaun? <span className="italic text-beige">Let us pick.</span>
      </h1>
      <p className="mt-3 max-w-xl text-muted">Three quick choices, one food spot. Don&apos;t like it? Pick again.</p>
      <div className="mt-8">
        <DecideClient areas={areas} categories={categories} />
      </div>
    </div>
  );
}
