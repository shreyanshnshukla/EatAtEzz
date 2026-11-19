"use client";

import { useActionState } from "react";
import { createPlaylist } from "@/lib/actions/playlists";
import { idle } from "@/lib/actions/result";
import { FormMessage } from "@/components/ui/primitives";
import { button, card, field } from "@/components/ui/styles";

export function CreatePlaylistForm() {
  const [state, action, pending] = useActionState(createPlaylist, idle);
  return (
    <form action={action} className={`${card} grid gap-3 p-5 sm:grid-cols-[1fr_1fr_auto]`}>
      <div>
        <label htmlFor="pl-title" className="text-xs text-muted">Playlist name</label>
        <input id="pl-title" name="title" required minLength={3} maxLength={60} placeholder="Sunday Chowk breakfast" className={`mt-1 ${field}`} />
      </div>
      <div>
        <label htmlFor="pl-tagline" className="text-xs text-muted">One-line vibe (optional)</label>
        <input id="pl-tagline" name="tagline" maxLength={120} placeholder="Nihari, kulcha, then chai" className={`mt-1 ${field}`} />
      </div>
      <button type="submit" disabled={pending} className={button("primary", "md", "h-11 self-end")}>
        {pending ? "Creating…" : "Create playlist"}
      </button>
      <div className="sm:col-span-3"><FormMessage state={state} /></div>
    </form>
  );
}
