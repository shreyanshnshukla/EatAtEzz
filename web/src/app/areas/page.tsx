import type { Metadata } from "next";
import Link from "next/link";
import { AreaMap } from "@/components/explore/AreaMap";
import { PageHeader } from "@/components/ui/primitives";
import { cardLink } from "@/components/ui/styles";
import { listAreas } from "@/lib/queries/areas";

export const metadata: Metadata = {
  title: "Street food in Lucknow by area",
  description: "Best food spots in Chowk, Aminabad, Hazratganj, Gomti Nagar, Aliganj, Indira Nagar and every Lucknow neighbourhood.",
  alternates: { canonical: "/areas" },
};

export default async function Areas() {
  const areas = await listAreas();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <PageHeader title="Lucknow by area">{areas.length} neighbourhoods and counting.</PageHeader>
      <div className="mt-6"><AreaMap areas={areas} height={460} /></div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <li key={a.slug}>
            <Link href={`/area/${a.slug}`} className={`${cardLink} flex items-center justify-between px-4 py-3.5`}>
              <span className="text-cream">Street food in {a.name}</span>
              <span className="text-sm text-muted">{a.vendorCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
