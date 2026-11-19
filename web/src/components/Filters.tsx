"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import type { Area } from "@/lib/types";

type Props = {
  areas: Area[];
  categories: string[];
  hideArea?: boolean;
};

const DIETS = [
  { value: "", label: "Any diet" },
  { value: "veg", label: "Veg" },
  { value: "non_veg", label: "Non-veg" },
  { value: "vegan", label: "Vegan" },
];

const selectCls =
  "h-11 rounded-xl border border-line bg-card px-3 text-sm text-cream focus:border-beige focus:outline-none";

export function Filters({ areas, categories, hideArea }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [pending, start] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    start(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        update("q", q);
      }}
      className={`flex flex-wrap items-center gap-2 ${pending ? "opacity-70" : ""}`}
    >
      <label className="sr-only" htmlFor="q">Search food spots</label>
      <input
        id="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Kebab, chaat, Tunday…"
        className="h-11 min-w-0 flex-1 basis-56 rounded-xl border border-line bg-card px-4 text-sm text-cream placeholder:text-muted focus:border-beige focus:outline-none"
      />
      {!hideArea ? (
        <>
          <label className="sr-only" htmlFor="area">Area</label>
          <select
            id="area"
            className={selectCls}
            value={params.get("area") ?? ""}
            onChange={(e) => update("area", e.target.value)}
          >
            <option value="">All areas</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name} ({a.vendor_count})
              </option>
            ))}
          </select>
        </>
      ) : null}
      <label className="sr-only" htmlFor="category">Category</label>
      <select
        id="category"
        className={selectCls}
        value={params.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
      >
        <option value="">All food</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="diet">Diet</label>
      <select
        id="diet"
        className={selectCls}
        value={params.get("diet") ?? ""}
        onChange={(e) => update("diet", e.target.value)}
      >
        {DIETS.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="h-11 rounded-xl bg-beige px-5 text-sm font-medium text-ink transition hover:bg-cream"
      >
        Search
      </button>
    </form>
  );
}
