"use client";

import { useActionState } from "react";
import { createPlaylist, type ActionResult } from "@/app/actions";

export function CreatePlaylistForm() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(createPlaylist, { ok: false });
  return (
    <form action={action} className="grid gap-3 rounded-2xl border border-line bg-card p-5 sm:grid-cols-[1fr_1fr_auto]">
      <div>
        <label htmlFor="pl-title" className="text-xs text-muted">Playlist name</label>
        <input
          id="pl-title"
          name="title"
          required
          minLength={3}
          maxLength={60}
          placeholder="Sunday Chowk breakfast"
          className="mt-1 h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm text-cream placeholder:text-muted"
        />
      </div>
      <div>
        <label htmlFor="pl-tagline" className="text-xs text-muted">One-line vibe (optional)</label>
        <input
          id="pl-tagline"
          name="tagline"
          maxLength={120}
          placeholder="Nihari, kulcha, then chai"
          className="mt-1 h-11 w-full rounded-xl border border-line bg-ink px-3 text-sm text-cream placeholder:text-muted"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-11 self-end rounded-xl border border-beige/50 bg-beige/10 px-5 text-sm text-beige hover:bg-beige/20 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create playlist"}
      </button>
      {state.error ? (
        <p role="alert" className="text-sm text-nonveg sm:col-span-3">{state.error}</p>
      ) : null}
    </form>
  );
}
