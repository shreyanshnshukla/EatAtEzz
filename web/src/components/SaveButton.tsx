"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleSave } from "@/app/actions";

export function SaveButton({ vendorId, slug, initial }: { vendorId: string; slug: string; initial: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [pending, start] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      aria-pressed={saved}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setSaved((s) => !s);
          const res = await toggleSave(vendorId, slug);
          if (!res.ok) {
            setSaved((s) => !s);
            if (res.error === "signin") router.push(`/login?next=/vendor/${slug}`);
          }
        })
      }
      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition ${
        saved ? "border-beige bg-beige/15 text-beige" : "border-line text-cream hover:border-beige"
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.3 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.7 5 21 8.3 19.5 11.8 17.5 16.4 12 21 12 21z"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
      {saved ? "Saved to Want to try" : "Want to try"}
    </button>
  );
}
