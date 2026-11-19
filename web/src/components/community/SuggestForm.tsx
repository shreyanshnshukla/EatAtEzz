"use client";

import { useActionState, useEffect, useRef } from "react";
import { suggestSpot } from "@/lib/actions/community";
import { idle } from "@/lib/actions/result";
import { FormMessage } from "@/components/ui/primitives";
import { button, field, label, textarea } from "@/components/ui/styles";

const DIETS = [["veg", "Veg"], ["non_veg", "Non-veg"], ["both", "Both"], ["vegan", "Vegan"]] as const;

export function SuggestForm({ areas, categories }: { areas: { id: number; name: string }[]; categories: string[] }) {
  const [state, action, pending] = useActionState(suggestSpot, idle);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.message) form.current?.reset();
  }, [state]);

  return (
    <form ref={form} action={action} className="grid gap-4 rounded-3xl border border-line bg-card p-6 sm:grid-cols-2 md:p-8">
      <div className="sm:col-span-2">
        <label htmlFor="s-name" className={label}>Stall or shop name *</label>
        <input id="s-name" name="name" required minLength={2} maxLength={80} placeholder="Pappu ki chaat" className={`mt-1.5 ${field}`} />
      </div>
      <div>
        <label htmlFor="s-area" className={label}>Area</label>
        <select id="s-area" name="area_id" defaultValue="" className={`mt-1.5 ${field}`}>
          <option value="">Not sure</option>
          {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="s-cat" className={label}>What do they sell? *</label>
        <select id="s-cat" name="category" required defaultValue="" className={`mt-1.5 ${field}`}>
          <option value="" disabled>Pick one</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          <option value="Other">Something else</option>
        </select>
      </div>
      <div>
        <label htmlFor="s-dish" className={label}>Must-order dish</label>
        <input id="s-dish" name="dish" maxLength={120} placeholder="Matar chaat with extra nimbu" className={`mt-1.5 ${field}`} />
      </div>
      <fieldset>
        <legend className={label}>Veg or non-veg? *</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {DIETS.map(([value, text]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-cream has-[:checked]:border-beige has-[:checked]:text-beige">
              <input type="radio" name="diet" value={value} required defaultChecked={value === "both"} className="accent-[#DCC6A0]" />
              {text}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="sm:col-span-2">
        <label htmlFor="s-landmark" className={label}>Landmark</label>
        <input id="s-landmark" name="landmark" maxLength={160} placeholder="Opposite Akbari Gate, next to the itr shop" className={`mt-1.5 ${field}`} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="s-note" className={label}>Anything else (timings, price)?</label>
        <textarea id="s-note" name="note" maxLength={500} rows={3} placeholder="Opens at 5 pm, closes when the batter runs out" className={`mt-1.5 ${textarea}`} />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className={button("primary", "lg")}>{pending ? "Sending…" : "Send suggestion"}</button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
