"use client";

import { useActionState, useRef, useEffect } from "react";
import { suggestSpot, type ActionResult } from "@/app/actions";

const field = "mt-1.5 h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm text-cream placeholder:text-muted focus:border-beige focus:outline-none";

export function SuggestForm({ areas, categories }: { areas: { id: number; name: string }[]; categories: string[] }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(suggestSpot, { ok: false });
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="grid gap-4 rounded-3xl border border-line bg-card p-6 sm:grid-cols-2 md:p-8">
      <div className="sm:col-span-2">
        <label htmlFor="s-name" className="text-sm text-muted">Stall or shop name *</label>
        <input id="s-name" name="name" required minLength={2} maxLength={80} placeholder="Pappu ki chaat" className={field} />
      </div>
      <div>
        <label htmlFor="s-area" className="text-sm text-muted">Area</label>
        <select id="s-area" name="area_id" className={field} defaultValue="">
          <option value="">Not sure</option>
          {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="s-cat" className="text-sm text-muted">What do they sell? *</label>
        <select id="s-cat" name="category" required className={field} defaultValue="">
          <option value="" disabled>Pick one</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          <option value="Other">Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="s-dish" className="text-sm text-muted">Must-order dish</label>
        <input id="s-dish" name="dish" maxLength={120} placeholder="Matar chaat with extra nimbu" className={field} />
      </div>
      <fieldset>
        <legend className="text-sm text-muted">Veg or non-veg? *</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {[["veg", "Veg"], ["non_veg", "Non-veg"], ["both", "Both"], ["vegan", "Vegan"]].map(([v, l]) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-cream has-[:checked]:border-beige has-[:checked]:text-beige">
              <input type="radio" name="diet" value={v} required className="accent-[#DCC6A0]" defaultChecked={v === "both"} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label htmlFor="s-landmark" className="text-sm text-muted">Landmark</label>
        <input id="s-landmark" name="landmark" maxLength={160} placeholder="Opposite Akbari Gate, next to the itr shop" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="s-note" className="text-sm text-muted">Anything else (timings, price)?</label>
        <textarea id="s-note" name="note" maxLength={500} rows={3} placeholder="Opens at 5 pm, closes when the batter runs out" className="mt-1.5 w-full rounded-xl border border-line bg-ink p-3 text-sm text-cream placeholder:text-muted focus:border-beige focus:outline-none" />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="rounded-xl border border-beige/50 bg-beige/10 px-6 py-3 font-medium text-beige hover:bg-beige/20 disabled:opacity-50">
          {pending ? "Sending…" : "Send suggestion"}
        </button>
        <p aria-live="polite" className={`text-sm ${state.ok ? "text-veg" : "text-nonveg"}`}>
          {state.ok ? state.message : state.error}
        </p>
      </div>
    </form>
  );
}
