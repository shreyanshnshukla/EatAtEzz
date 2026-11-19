"use client";

import { useActionState, useState, useTransition } from "react";
import { addToPlaylist, createPlaylist, type ActionResult } from "@/app/actions";

export function AddToPlaylist({
  vendorId,
  slug,
  playlists,
}: {
  vendorId: string;
  slug: string;
  playlists: { id: string; title: string; has: boolean }[];
}) {
  const options = playlists.filter((p) => !p.has);
  const [selected, setSelected] = useState(options[0]?.id ?? "");
  const [msg, setMsg] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  const [createState, createAction, creating] = useActionState<ActionResult, FormData>(createPlaylist, { ok: false });
  const inLists = playlists.filter((p) => p.has);

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <p className="text-sm text-muted">Add to your playlist</p>
      {inLists.length ? (
        <p className="mt-1 text-xs text-caramel">Already in: {inLists.map((p) => p.title).join(", ")}</p>
      ) : null}
      {options.length ? (
        <div className="mt-3 flex gap-2">
          <label htmlFor="pl-select" className="sr-only">Your playlist</label>
          <select
            id="pl-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-ink px-3 text-sm text-cream"
          >
            {options.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={pending || !selected}
            onClick={() => start(async () => setMsg(await addToPlaylist(selected, vendorId, slug)))}
            className="h-11 rounded-xl border border-beige/50 bg-beige/10 px-4 text-sm text-beige hover:bg-beige/20 disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add"}
          </button>
        </div>
      ) : null}
      <form action={createAction} className="mt-3 flex gap-2">
        <input type="hidden" name="vendor_id" value={vendorId} />
        <input type="hidden" name="back" value={`/vendor/${slug}`} />
        <label htmlFor="new-pl" className="sr-only">New playlist name</label>
        <input
          id="new-pl"
          name="title"
          required
          minLength={3}
          maxLength={60}
          placeholder="New playlist, e.g. Sunday breakfast"
          className="h-11 min-w-0 flex-1 rounded-xl border border-line bg-ink px-3 text-sm text-cream placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={creating}
          className="h-11 rounded-xl border border-line px-4 text-sm text-cream hover:border-beige disabled:opacity-50"
        >
          {creating ? "…" : "Create"}
        </button>
      </form>
      <p aria-live="polite" className="mt-2 text-sm">
        {msg ? <span className={msg.ok ? "text-veg" : "text-nonveg"}>{msg.ok ? msg.message : msg.error}</span> : null}
        {createState.message || createState.error ? (
          <span className={createState.ok ? "text-veg" : "text-nonveg"}> {createState.ok ? createState.message : createState.error}</span>
        ) : null}
      </p>
    </div>
  );
}
