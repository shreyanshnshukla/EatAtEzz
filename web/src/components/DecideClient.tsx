"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase, CITY } from "@/lib/supabase";
import type { Area, VendorCard } from "@/lib/types";
import { cleanName, directionsUrl } from "@/lib/format";
import { DietBadge } from "./DietBadge";

const selectCls =
  "h-12 w-full rounded-xl border border-line bg-card px-3 text-cream focus:border-beige focus:outline-none";

export function DecideClient({ areas, categories }: { areas: Area[]; categories: string[] }) {
  const [area, setArea] = useState("");
  const [diet, setDiet] = useState("");
  const [category, setCategory] = useState("");
  const [pick, setPick] = useState<VendorCard | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "empty" | "error">("idle");

  async function decide() {
    setState("loading");
    const { data, error } = await supabase.rpc("decide_for_me", {
      p_city: CITY,
      p_area: area || null,
      p_diet: diet || null,
      p_category: category || null,
    });
    if (error) {
      setState("error");
      return;
    }
    const row = (data as VendorCard[] | null)?.[0] ?? null;
    setPick(row);
    setState(row ? "idle" : "empty");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-4 rounded-2xl border border-line bg-card p-6">
        <div>
          <label htmlFor="d-area" className="mb-1.5 block text-sm text-muted">Where are you?</label>
          <select id="d-area" className={selectCls} value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Anywhere in Lucknow</option>
            {areas.map((a) => (
              <option key={a.slug} value={a.slug}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="d-diet" className="mb-1.5 block text-sm text-muted">Veg or non-veg?</label>
          <select id="d-diet" className={selectCls} value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">Doesn&apos;t matter</option>
            <option value="veg">Veg</option>
            <option value="non_veg">Non-veg</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
        <div>
          <label htmlFor="d-cat" className="mb-1.5 block text-sm text-muted">In the mood for</label>
          <select id="d-cat" className={selectCls} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Surprise me</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={decide}
          disabled={state === "loading"}
          className="h-12 w-full rounded-xl bg-beige font-medium text-ink transition hover:bg-cream disabled:opacity-60"
        >
          {state === "loading" ? "Picking…" : pick ? "Pick another" : "Decide for me"}
        </button>
      </div>

      <div aria-live="polite" className="min-h-64">
        {state === "empty" ? (
          <p className="rounded-2xl border border-dashed border-line p-8 text-muted">
            Nothing matches yet. Try another area or &ldquo;Surprise me&rdquo;.
          </p>
        ) : null}
        {state === "error" ? (
          <p className="rounded-2xl border border-dashed border-line p-8 text-muted">
            Couldn&apos;t reach the kitchen. Check your connection and try again.
          </p>
        ) : null}
        {pick && state !== "empty" ? (
          <article className="rounded-2xl border border-caramel bg-card-2 p-7">
            <p className="text-sm text-caramel">Aaj yahan chalo</p>
            <h2 className="mt-2 font-display text-3xl text-cream">{cleanName(pick.name)}</h2>
            <p className="mt-2 text-muted">{pick.speciality}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <DietBadge diet={pick.diet} />
              <span className="rounded-full bg-card px-2.5 py-1 text-xs text-cream">{pick.category}</span>
              {pick.area_name ? <span className="text-xs text-muted">{pick.area_name}</span> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={directionsUrl(pick.google_place_id, pick.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-beige px-4 py-2.5 text-sm font-medium text-ink hover:bg-cream"
              >
                Get directions
              </a>
              <Link
                href={`/vendor/${pick.slug}`}
                className="rounded-xl border border-line px-4 py-2.5 text-sm text-cream hover:border-beige"
              >
                See details
              </Link>
            </div>
          </article>
        ) : null}
        {!pick && state === "idle" ? (
          <div className="flex h-full min-h-64 items-center justify-center rounded-2xl border border-dashed border-line p-8 text-center text-muted">
            Set what you like, then press <span className="mx-1 text-beige">Decide for me</span>.
          </div>
        ) : null}
      </div>
    </div>
  );
}
