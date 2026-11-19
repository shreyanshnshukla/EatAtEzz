"use client";

import { useTransition } from "react";
import { deletePlaylist, removeFromPlaylist } from "@/app/actions";

export function RemoveFromPlaylist({ playlistId, vendorId, playlistSlug }: { playlistId: string; vendorId: string; playlistSlug: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => void (await removeFromPlaylist(playlistId, vendorId, playlistSlug)))}
      className="h-fit shrink-0 rounded-xl border border-line px-3 py-2 text-xs text-muted hover:border-nonveg hover:text-cream disabled:opacity-50"
    >
      {pending ? "…" : "Remove"}
    </button>
  );
}

export function DeletePlaylist({ playlistId }: { playlistId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm("Delete this playlist? This can't be undone.")) start(() => deletePlaylist(playlistId));
      }}
      className="rounded-xl border border-line px-4 py-2 text-sm text-muted hover:border-nonveg hover:text-cream disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete playlist"}
    </button>
  );
}
