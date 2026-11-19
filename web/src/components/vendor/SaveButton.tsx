"use client";

import { useOptimistic, useTransition } from "react";
import { setSaved } from "@/lib/actions/saves";
import { button } from "@/components/ui/styles";

export function SaveButton({ vendorId, slug, saved }: { vendorId: string; slug: string; saved: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={optimistic}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setOptimistic(!optimistic);
          await setSaved({ vendorId, slug, save: !optimistic });
        })
      }
      className={button(optimistic ? "primary" : "secondary", "md", "py-3")}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.3 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 18.7 5 21 8.3 19.5 11.8 17.5 16.4 12 21 12 21z"
          fill={optimistic ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
      {optimistic ? "Saved to Want to try" : "Want to try"}
    </button>
  );
}
