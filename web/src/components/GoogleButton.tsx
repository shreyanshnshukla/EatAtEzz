"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/auth/browser";

export function GoogleButton({ next = "/account" }: { next?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError("Couldn't start Google sign-in. Try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={loading}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-card-2 font-medium text-cream transition hover:border-beige disabled:opacity-60"
      >
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-line font-display text-sm italic text-beige"
        >
          G
        </span>
        {loading ? "Opening Google…" : "Continue with Google"}
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-nonveg">
          {error}
        </p>
      ) : null}
    </div>
  );
}
