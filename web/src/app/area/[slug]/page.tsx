import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Filters } from "@/components/explore/Filters";
import { Grid, JsonLd, PageHeader, Section } from "@/components/ui/primitives";
import { VendorCard } from "@/components/vendor/VendorCard";
import { absoluteUrl, slugify, type Vendor } from "@/lib/domain";
import { getArea, listAreas } from "@/lib/queries/areas";
import { getCategories, listVendors } from "@/lib/queries/vendors";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ q?: string; category?: string; diet?: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const area = await getArea((await params).slug);
  if (!area) return {};
  return {
    title: `Best street food in ${area.name}, Lucknow`,
    description: `${area.vendorCount} food spots in ${area.name}, Lucknow: what to eat, where, veg and non-veg.`,
    alternates: { canonical: `/area/${area.slug}` },
  };
}

function groupByCategory(vendors: Vendor[]) {
  const groups = new Map<string, Vendor[]>();
  for (const v of vendors) groups.set(v.category, [...(groups.get(v.category) ?? []), v]);
  return [...groups].sort((a, b) => b[1].length - a[1].length);
}

export default async function AreaPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const area = await getArea(slug);
  if (!area) notFound();

  const [{ vendors, total }, areas, categories] = await Promise.all([listVendors({ ...sp, area: slug }), listAreas(), getCategories()]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Street food in ${area.name}, Lucknow`,
          itemListElement: vendors.slice(0, 30).map((v, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/vendor/${v.slug}`), name: v.name })),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-3 text-sm text-muted">
        <Link href="/areas" className="hover:text-cream">Areas</Link> / {area.name}
      </nav>
      <PageHeader title={`Street food in ${area.name}`}>{total} food spots in {area.name}, Lucknow.</PageHeader>
      <div className="mt-6">
        <Suspense>
          <Filters areas={areas} categories={categories} hideArea />
        </Suspense>
      </div>
      {groupByCategory(vendors).map(([category, list]) => (
        <Section key={category} id={`c-${slugify(category)}`} title={<>{category} <span className="text-base text-muted">({list.length})</span></>}>
          <Grid cols={4}>{list.map((v) => <VendorCard key={v.id} v={v} />)}</Grid>
        </Section>
      ))}
      {total > vendors.length ? (
        <p className="mt-10 text-center">
          <Link href={`/explore?area=${slug}`} className="text-beige underline underline-offset-4">See all {total} spots in {area.name}</Link>
        </p>
      ) : null}
    </div>
  );
}
