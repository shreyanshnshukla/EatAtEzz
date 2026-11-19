"use client";

import { useEffect } from "react";
import { button } from "@/components/ui/styles";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-5xl italic text-caramel">Oops</p>
      <h1 className="mt-4 font-display text-3xl text-cream">Kitchen mein kuch gadbad ho gayi</h1>
      <p className="mt-2 text-muted">Something went wrong loading this page.</p>
      <button type="button" onClick={reset} className={button("primary", "lg", "mt-8")}>Try again</button>
    </div>
  );
}
