import type { Metadata } from "next";
import Link from "next/link";
import { DietBadge } from "@/components/DietBadge";
import { getDishes } from "@/lib/data";
import type { Diet } from "@/lib/types";


export const metadata: Metadata = {
  title: "Famous food of Lucknow: veg, non-veg and vegan",
  description:
    "Galouti kebab, Awadhi biryani, nihari-kulcha, basket chaat, makhan malai, kulfi falooda and more: Lucknow's famous dishes and where to eat them.",
  alternates: { canonical: "/dishes" },
};

const SECTIONS: { diet: Diet; title: string }[] = [
  { diet: "non_veg", title: "Non-veg" },
  { diet: "veg", title: "Veg" },
  { diet: "vegan", title: "Vegan" },
];

export default async function Dishes() {
  const dishes = await getDishes();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="font-display text-4xl text-cream">Lucknow&apos;s famous dishes</h1>
      <p className="mt-2 max-w-2xl text-muted">
        What Lucknow is famous for, and where people go for it. Seasonal ones are marked: makhan malai
        is a winter-only treat.
      </p>
      {SECTIONS.map((s) => {
        const list = dishes.filter((d) => d.diet === s.diet);
        if (!list.length) return null;
        return (
          <section key={s.diet} className="mt-12" aria-labelledby={`d-${s.diet}`}>
            <h2 id={`d-${s.diet}`} className="font-display text-2xl text-beige">
              {s.title} <span className="text-base text-muted">({list.length})</span>
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((d) => (
                <article key={d.slug} className="flex flex-col rounded-2xl border border-line bg-card p-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-wider text-caramel">{d.category}</p>
                    <DietBadge diet={d.diet} />
                  </div>
                  <h3 className="mt-2 font-display text-xl text-cream">{d.name}</h3>
                  <p className="mt-2 text-sm text-muted">{d.description}</p>
                  {d.famous_at ? <p className="mt-3 text-sm text-beige">Famous at: {d.famous_at}</p> : null}
                  <div className="mt-auto flex items-center justify-between pt-4">
                    {d.season ? <span className="text-xs text-muted">Season: {d.season}</span> : <span />}
                    <Link
                      href={`/explore?q=${encodeURIComponent(d.name.split(" ")[0])}`}
                      className="text-xs text-beige underline-offset-4 hover:underline"
                    >
                      Find spots
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
