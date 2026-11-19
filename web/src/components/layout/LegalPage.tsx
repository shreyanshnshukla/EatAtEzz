import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/primitives";

/** Shared shell for /privacy and /terms: readable measure, dated, sectioned. */
export function LegalPage({ title, updated, intro, children }: { title: string; updated: string; intro: ReactNode; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader eyebrow={`Last updated ${updated}`} title={title}>{intro}</PageHeader>
      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted">{children}</div>
    </article>
  );
}

export function Clause({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-2xl text-cream">{title}</h2>
      <div className="space-y-3 [&_a]:text-beige [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-cream">{children}</div>
    </section>
  );
}
