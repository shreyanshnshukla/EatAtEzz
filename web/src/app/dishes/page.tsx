import type { Metadata } from "next";
import Link from "next/link";
import { Grid, PageHeader, Section } from "@/components/ui/primitives";
import { card } from "@/components/ui/styles";
import { DietBadge } from "@/components/vendor/DietBadge";
import type { Diet } from "@/lib/domain";
import { listDishes } from "@/lib/queries/dishes";

export const metadata: Metadata = {
  title: "Famous food of Lucknow: veg, non-veg and vegan",
  description: "Galouti kebab, Awadhi biryani, nihari-kulcha, basket chaat, makhan malai, kulfi falooda and more: Lucknow's famous dishes and where to eat them.",
  alternates: { canonical: "/dishes" },
};

const SECTIONS: { diet: Diet; title: string }[] = [
  { diet: "non_veg", title: "Non-veg" },
  { diet: "veg", title: "Veg" },
  { diet: "vegan", title: "Vegan" },
];

export default async function Dishes() {
  const dishes = await listDishes();
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <PageHeader title="Lucknow's famous dishes">
        What Lucknow is famous for, and where people go for it. Makhan malai is a winter-only treat.
      </PageHeader>
      {SECTIONS.map(({ diet, title }) => {
        const list = dishes.filter((d) => d.diet === diet);
        return list.length ? (
          <Section key={diet} id={`d-${diet}`} title={<>{title} <span className="text-base text-muted">({list.length})</span></>}>
            <Grid>
              {list.map((d) => (
                <article key={d.slug} className={`${card} flex flex-col p-5`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-wider text-caramel">{d.category}</p>
                    <DietBadge diet={d.diet} />
                  </div>
                  <h3 className="mt-2 font-display text-xl text-cream">{d.name}</h3>
                  <p className="mt-2 text-sm text-muted">{d.description}</p>
                  {d.famousAt ? <p className="mt-3 text-sm text-beige">Famous at: {d.famousAt}</p> : null}
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs">
                    <span className="text-muted">{d.season ? `Season: ${d.season}` : ""}</span>
                    <Link href={`/explore?q=${encodeURIComponent(d.name.split(" ")[0])}`} className="text-beige underline-offset-4 hover:underline">Find spots</Link>
                  </div>
                </article>
              ))}
            </Grid>
          </Section>
        ) : null;
      })}
    </div>
  );
}
