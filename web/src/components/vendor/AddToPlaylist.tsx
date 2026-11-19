"use client";

import { useActionState, useState, useTransition } from "react";
import { addToPlaylist, createPlaylist } from "@/lib/actions/playlists";
import { idle, type ActionResult } from "@/lib/actions/result";
import { FormMessage } from "@/components/ui/primitives";
import { button, card, field, label } from "@/components/ui/styles";

type Props = { vendorId: string; slug: string; playlists: { id: string; title: string; has: boolean }[] };

export function AddToPlaylist({ vendorId, slug, playlists }: Props) {
  const available = playlists.filter((p) => !p.has);
  const already = playlists.filter((p) => p.has);
  const [selected, setSelected] = useState(available[0]?.id ?? "");
  const [added, setAdded] = useState<ActionResult>(idle);
  const [pending, start] = useTransition();
  const [created, createAction, creating] = useActionState(createPlaylist, idle);

  return (
    <div className={`${card} p-5`}>
      <p className={label}>Add to your playlist</p>
      {already.length ? <p className="mt-1 text-xs text-caramel">Already in: {already.map((p) => p.title).join(", ")}</p> : null}

      {available.length ? (
        <div className="mt-3 flex gap-2">
          <label htmlFor="pl-select" className="sr-only">Your playlist</label>
          <select id="pl-select" value={selected} onChange={(e) => setSelected(e.target.value)} className={`${field} min-w-0 flex-1`}>
            {available.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button
            type="button"
            disabled={pending || !selected}
            onClick={() => start(async () => setAdded(await addToPlaylist(selected, vendorId, slug)))}
            className={button()}
          >
            {pending ? "Adding…" : "Add"}
          </button>
        </div>
      ) : null}

      <form action={createAction} className="mt-3 flex gap-2">
        <input type="hidden" name="vendorId" value={vendorId} />
        <input type="hidden" name="back" value={`/vendor/${slug}`} />
        <label htmlFor="new-pl" className="sr-only">New playlist name</label>
        <input id="new-pl" name="title" required minLength={3} maxLength={60} placeholder="New playlist, e.g. Sunday breakfast" className={`${field} min-w-0 flex-1`} />
        <button type="submit" disabled={creating} className={button("secondary")}>{creating ? "…" : "Create"}</button>
      </form>

      <div className="mt-2 space-y-1">
        <FormMessage state={added} />
        <FormMessage state={created} />
      </div>
    </div>
  );
}
