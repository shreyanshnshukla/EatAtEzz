import type { Metadata } from "next";
import { Suspense } from "react";
import { Filters } from "@/components/explore/Filters";
import { Pagination } from "@/components/explore/Pagination";
import { EmptyState, Grid, PageHeader } from "@/components/ui/primitives";
import { VendorCard } from "@/components/vendor/VendorCard";
import { listAreas } from "@/lib/queries/areas";
import { getCategories, listVendors, PAGE_SIZE } from "@/lib/queries/vendors";

export const metadata: Metadata = {
  title: "Explore street food in Lucknow",
  description: "Search 500+ Lucknow food spots by area, dish and diet: kebabs, biryani, chaat, kachori, kulfi, chai and more.",
  alternates: { canonical: "/explore" },
};

type SearchParams = Promise<{ q?: string; area?: string; category?: string; diet?: string; page?: string }>;

export default async function Explore({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const [{ vendors, total }, areas, categories] = await Promise.all([listVendors({ ...sp, page }), listAreas(), getCategories()]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <PageHeader title="Explore Lucknow">{total} food spots match.</PageHeader>
      <div className="mt-6">
        <Suspense>
          <Filters areas={areas} categories={categories} />
        </Suspense>
      </div>
      <div className="mt-8">
        {vendors.length ? (
          <Grid cols={4}>{vendors.map((v) => <VendorCard key={v.id} v={v} />)}</Grid>
        ) : (
          <EmptyState>Nothing here yet. Try a different dish or area.</EmptyState>
        )}
      </div>
      <Pagination page={page} total={total} pageSize={PAGE_SIZE} basePath="/explore" params={sp} />
    </div>
  );
}
