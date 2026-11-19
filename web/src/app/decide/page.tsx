import type { Metadata } from "next";
import { DecideClient } from "@/components/decide/DecideClient";
import { PageHeader } from "@/components/ui/primitives";
import { listAreas } from "@/lib/queries/areas";
import { getCategories } from "@/lib/queries/vendors";

export const metadata: Metadata = {
  title: "Decide for me: what to eat in Lucknow",
  description: "Can't decide what to eat? Pick your area and mood, and EatAtEzz picks a Lucknow food spot for you.",
  alternates: { canonical: "/decide" },
};

export default async function Decide() {
  const [areas, categories] = await Promise.all([listAreas(), getCategories()]);
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <PageHeader eyebrow="Decide for me" title={<>Kya khaun? <span className="italic text-beige">Let us pick.</span></>}>
        Three quick choices, one food spot. Don&apos;t like it? Pick again.
      </PageHeader>
      <div className="mt-8"><DecideClient areas={areas} categories={categories} /></div>
    </div>
  );
}
