import type { Metadata } from "next";
import { SuggestForm } from "@/components/community/SuggestForm";
import { ButtonLink, PageHeader } from "@/components/ui/primitives";
import { listAreas } from "@/lib/queries/areas";
import { getCategories } from "@/lib/queries/vendors";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Suggest a food spot",
  description: "Know a Lucknow stall or shop that isn't on EatAtEzz yet? Suggest it.",
};

export default async function Suggest() {
  const [user, areas, categories] = await Promise.all([getUser(), listAreas(), getCategories()]);
  const areaOptions = [...areas].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <PageHeader eyebrow="Suggest a spot" title="Apni gali ka secret batao">
        Know a thela, stall or shop that should be on EatAtEzz? Tell us. We check every suggestion before it goes live.
      </PageHeader>
      <div className="mt-8">
        {user ? (
          <SuggestForm areas={areaOptions} categories={categories} />
        ) : (
          <div className="rounded-3xl border border-line bg-card p-8">
            <p className="text-cream">Sign in first so we can tell you when your spot goes live.</p>
            <ButtonLink href="/login?next=/suggest" size="lg" className="mt-5">Sign in with Google</ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}
