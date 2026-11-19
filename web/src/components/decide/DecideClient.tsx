"use client";

import Link from "next/link";
import { useState } from "react";
import { CITY } from "@/lib/env";
import { directionsUrl, toVendor, type Area, type Vendor } from "@/lib/domain";
import { db } from "@/lib/supabase/public";
import { EmptyState } from "@/components/ui/primitives";
import { button, card, field, label } from "@/components/ui/styles";
import { DietBadge } from "@/components/vendor/DietBadge";

type Status = "idle" | "loading" | "empty" | "error";

export function DecideClient({ areas, categories }: { areas: Area[]; categories: string[] }) {
  const [area, setArea] = useState("");
  const [diet, setDiet] = useState("");
  const [category, setCategory] = useState("");
  const [pick, setPick] = useState<Vendor | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function decide() {
    setStatus("loading");
    const { data, error } = await db.rpc("decide_for_me", {
      p_city: CITY,
      p_area: area || undefined,
      p_diet: diet || undefined,
      p_category: category || undefined,
    });
    if (error) return setStatus("error");
    const row = data?.[0];
    setPick(row ? toVendor(row) : null);
    setStatus(row ? "idle" : "empty");
  }

  const select = `${field} h-12 bg-card`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className={`${card} space-y-4 p-6`}>
        <div>
          <label htmlFor="d-area" className={`mb-1.5 block ${label}`}>Where are you?</label>
          <select id="d-area" className={select} value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Anywhere in Lucknow</option>
            {areas.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="d-diet" className={`mb-1.5 block ${label}`}>Veg or non-veg?</label>
          <select id="d-diet" className={select} value={diet} onChange={(e) => setDiet(e.target.value)}>
            <option value="">Doesn&apos;t matter</option>
            <option value="veg">Veg</option>
            <option value="non_veg">Non-veg</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
        <div>
          <label htmlFor="d-cat" className={`mb-1.5 block ${label}`}>In the mood for</label>
          <select id="d-cat" className={select} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Surprise me</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button type="button" onClick={decide} disabled={status === "loading"} className={button("primary", "lg", "w-full")}>
          {status === "loading" ? "Picking…" : pick ? "Pick another" : "Decide for me"}
        </button>
      </div>

      <div aria-live="polite" className="min-h-64">
        {status === "empty" ? <EmptyState>Nothing matches yet. Try another area or &ldquo;Surprise me&rdquo;.</EmptyState> : null}
        {status === "error" ? <EmptyState>Couldn&apos;t reach the kitchen. Check your connection and try again.</EmptyState> : null}
        {pick && status !== "empty" ? (
          <article className="rounded-2xl border border-caramel bg-card-2 p-7">
            <p className="text-sm text-caramel">Aaj yahan chalo</p>
            <h2 className="mt-2 font-display text-3xl text-cream">{pick.name}</h2>
            {pick.speciality ? <p className="mt-2 text-muted">{pick.speciality}</p> : null}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <DietBadge diet={pick.diet} />
              <span className="rounded-full bg-card px-2.5 py-1 text-xs text-cream">{pick.category}</span>
              {pick.areaName ? <span className="text-xs text-muted">{pick.areaName}</span> : null}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={directionsUrl(pick)} target="_blank" rel="noopener noreferrer" className={button()}>Get directions</a>
              <Link href={`/vendor/${pick.slug}`} className={button("secondary")}>See details</Link>
            </div>
          </article>
        ) : null}
        {!pick && status === "idle" ? (
          <EmptyState>
            Set what you like, then press <span className="text-beige">Decide for me</span>.
          </EmptyState>
        ) : null}
      </div>
    </div>
  );
}
