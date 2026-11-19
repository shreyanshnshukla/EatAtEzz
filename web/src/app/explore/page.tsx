import type { Metadata } from "next";
import { Suspense } from "react";
import { Filters } from "@/components/Filters";
import { Pagination } from "@/components/Pagination";
import { VendorCard } from "@/components/VendorCard";
import { getAreas, getCategories, getVendors, PAGE_SIZE } from "@/lib/data";

export const metadata: Metadata = {
  title: "Explore street food in Lucknow",
  description:
    "Search 500+ Lucknow food spots by area, dish and diet: kebabs, biryani, chaat, kachori, kulfi, chai and more.",
  alternates: { canonical: "/explore" },
};

type SP = Promise<{ q?: string; area?: string; category?: string; diet?: string; page?: string }>;

export default async function Explore({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const [{ vendors, total }, areas, categories] = await Promise.all([
    getVendors({ q: sp.q, area: sp.area, category: sp.category, diet: sp.diet, page }),
    getAreas(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-4xl text-cream">Explore Lucknow</h1>
      <p className="mt-2 text-muted">{total} food spots match.</p>
      <div className="mt-6">
        <Suspense>
          <Filters areas={areas} categories={categories} />
        </Suspense>
      </div>
      {vendors.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-line p-10 text-center text-muted">
          Nothing here yet. Try a different dish or area.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vendors.map((v) => (
            <VendorCard key={v.id} v={v} />
          ))}
        </div>
      )}
      <Pagination page={page} total={total} pageSize={PAGE_SIZE} basePath="/explore" params={sp} />
    </div>
  );
}
