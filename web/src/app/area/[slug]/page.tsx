import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Filters } from "@/components/Filters";
import { VendorCard } from "@/components/VendorCard";
import { getAreas, getCategories, getVendors } from "@/lib/data";
import { SITE_URL } from "@/lib/format";


type Params = Promise<{ slug: string }>;
type SP = Promise<{ q?: string; category?: string; diet?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const area = (await getAreas()).find((a) => a.slug === slug);
  if (!area) return {};
  return {
    title: `Best street food in ${area.name}, Lucknow`,
    description: `${area.vendor_count} food spots in ${area.name}, Lucknow: what to eat, where, veg and non-veg.`,
    alternates: { canonical: `/area/${slug}` },
  };
}

export default async function AreaPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const areas = await getAreas();
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  const [{ vendors, total }, categories] = await Promise.all([
    getVendors({ area: slug, q: sp.q, category: sp.category, diet: sp.diet, page: 1 }),
    getCategories(),
  ]);

  const grouped = vendors.reduce<Record<string, typeof vendors>>((acc, v) => {
    (acc[v.category] ??= []).push(v);
    return acc;
  }, {});
  const groups = Object.entries(grouped).sort((a, b) => b[1].length - a[1].length);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Street food in ${area.name}, Lucknow`,
    itemListElement: vendors.slice(0, 30).map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/vendor/${v.slug}`,
      name: v.name,
    })),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/areas" className="hover:text-cream">Areas</Link> <span aria-hidden="true">/</span> {area.name}
      </nav>
      <h1 className="mt-3 font-display text-4xl text-cream">Street food in {area.name}</h1>
      <p className="mt-2 text-muted">{total} food spots in {area.name}, Lucknow.</p>
      <div className="mt-6">
        <Suspense>
          <Filters areas={areas} categories={categories} hideArea />
        </Suspense>
      </div>
      {groups.map(([cat, list]) => (
        <section key={cat} className="mt-10" aria-labelledby={`c-${cat}`}>
          <h2 id={`c-${cat}`} className="font-display text-2xl text-beige">
            {cat} <span className="text-base text-muted">({list.length})</span>
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((v) => (
              <VendorCard key={v.id} v={v} />
            ))}
          </div>
        </section>
      ))}
      {total > vendors.length ? (
        <p className="mt-10 text-center">
          <Link href={`/explore?area=${slug}`} className="text-beige underline underline-offset-4">
            See all {total} spots in {area.name}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
