"use client";

import { useTransition } from "react";
import { deletePlaylist, removeFromPlaylist } from "@/lib/actions/playlists";
import { button } from "@/components/ui/styles";

export function RemoveFromPlaylist({ playlistId, vendorId, playlistSlug }: { playlistId: string; vendorId: string; playlistSlug: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(async () => void (await removeFromPlaylist(playlistId, vendorId, playlistSlug)))}
      className={button("danger", "sm", "h-fit shrink-0")}
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
      onClick={() => window.confirm("Delete this playlist? This can't be undone.") && start(() => deletePlaylist(playlistId))}
      className={button("danger")}
    >
      {pending ? "Deleting…" : "Delete playlist"}
    </button>
  );
}
