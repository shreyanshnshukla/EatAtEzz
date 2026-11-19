import type { Metadata } from "next";
import Link from "next/link";
import { AreaMap } from "@/components/AreaMap";
import { getAreas } from "@/lib/data";


export const metadata: Metadata = {
  title: "Street food in Lucknow by area",
  description:
    "Best food spots in Chowk, Aminabad, Hazratganj, Gomti Nagar, Aliganj, Indira Nagar and every Lucknow neighbourhood.",
  alternates: { canonical: "/areas" },
};

export default async function Areas() {
  const areas = await getAreas();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-4xl text-cream">Lucknow by area</h1>
      <p className="mt-2 text-muted">{areas.length} neighbourhoods and counting.</p>
      <div className="mt-6">
        <AreaMap areas={areas} height={460} />
      </div>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/area/${a.slug}`}
              className="flex items-center justify-between rounded-xl border border-line bg-card px-4 py-3.5 transition hover:border-caramel"
            >
              <span className="text-cream">Street food in {a.name}</span>
              <span className="text-sm text-muted">{a.vendor_count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
