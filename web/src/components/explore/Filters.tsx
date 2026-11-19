"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { Area } from "@/lib/domain";
import { button, field } from "@/components/ui/styles";

const DIETS = [
  { value: "", label: "Any diet" },
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non-veg" },
  { value: "vegan", label: "Vegan" },
];

type Props = { areas: Area[]; categories: string[]; hideArea?: boolean };

export function Filters({ areas, categories, hideArea }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [pending, start] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    start(() => router.push(`${pathname}?${next}`, { scroll: false }));
  }

  const select = `${field} w-auto bg-card`;

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        update("q", q.trim());
      }}
      className={`flex flex-wrap items-center gap-2 transition ${pending ? "opacity-70" : ""}`}
    >
      <label className="sr-only" htmlFor="q">Search food spots</label>
      <input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kebab, chaat, Tunday…" className={`${field} min-w-0 flex-1 basis-56 bg-card`} />
      {hideArea ? null : (
        <>
          <label className="sr-only" htmlFor="area">Area</label>
          <select id="area" className={select} value={params.get("area") ?? ""} onChange={(e) => update("area", e.target.value)}>
            <option value="">All areas</option>
            {areas.map((a) => <option key={a.slug} value={a.slug}>{a.name} ({a.vendorCount})</option>)}
          </select>
        </>
      )}
      <label className="sr-only" htmlFor="category">Food</label>
      <select id="category" className={select} value={params.get("category") ?? ""} onChange={(e) => update("category", e.target.value)}>
        <option value="">All food</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <label className="sr-only" htmlFor="diet">Diet</label>
      <select id="diet" className={select} value={params.get("diet") ?? ""} onChange={(e) => update("diet", e.target.value)}>
        {DIETS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
      </select>
      <button type="submit" className={button("primary", "md", "h-11")}>Search</button>
    </form>
  );
}
