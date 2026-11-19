import type { Metadata } from "next";
import Link from "next/link";
import { SuggestForm } from "@/components/SuggestForm";
import { getUser } from "@/lib/auth/server";
import { getCategories } from "@/lib/data";
import { supabase, CITY } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Suggest a food spot",
  description: "Know a Lucknow stall or shop that isn't on EatAtEzz yet? Suggest it.",
};

export default async function Suggest() {
  const user = await getUser();
  const [categories, { data: areas }] = await Promise.all([
    getCategories(),
    supabase.from("areas").select("id, name, cities!inner(slug)").eq("cities.slug", CITY).order("name"),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <p className="text-sm uppercase tracking-[0.2em] text-caramel">Suggest a spot</p>
      <h1 className="mt-2 font-display text-4xl text-cream">Apni gali ka secret batao</h1>
      <p className="mt-3 text-muted">
        Know a thela, stall or shop that should be on EatAtEzz? Tell us. We check every suggestion before it goes live.
      </p>
      <div className="mt-8">
        {user ? (
          <SuggestForm
            areas={((areas ?? []) as { id: number; name: string }[]).filter((a) => a.name !== "Other")}
            categories={categories}
          />
        ) : (
          <div className="rounded-3xl border border-line bg-card p-8">
            <p className="text-cream">Sign in first so we can tell you when your spot goes live.</p>
            <Link
              href="/login?next=/suggest"
              className="mt-5 inline-block rounded-xl border border-beige/50 bg-beige/10 px-5 py-3 text-beige hover:bg-beige/20"
            >
              Sign in with Google
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
