"use client";

import { useActionState, useState, useTransition } from "react";
import { deleteReview, submitReview, type ActionResult } from "@/app/actions";

export function ReviewForm({
  vendorId,
  slug,
  existing,
}: {
  vendorId: string;
  slug: string;
  existing: { rating: number; body: string | null } | null;
}) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(submitReview, { ok: false });
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [deleting, startDelete] = useTransition();

  return (
    <form action={action} className="rounded-2xl border border-line bg-card p-5">
      <input type="hidden" name="vendor_id" value={vendorId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating || ""} />
      <fieldset>
        <legend className="text-sm text-muted">{existing ? "Your review" : "Rate this spot"}</legend>
        <div className="mt-2 flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className={`text-3xl leading-none transition ${(hover || rating) >= n ? "text-beige" : "text-line"}`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <label htmlFor="review-body" className="mt-4 block text-sm text-muted">
        What should people order? (optional)
      </label>
      <textarea
        id="review-body"
        name="body"
        defaultValue={existing?.body ?? ""}
        maxLength={1000}
        rows={3}
        placeholder="The galouti was soft, go before 8 pm…"
        className="mt-1.5 w-full rounded-xl border border-line bg-ink p-3 text-sm text-cream placeholder:text-muted focus:border-beige focus:outline-none"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || !rating}
          className="rounded-xl border border-beige/50 bg-beige/10 px-5 py-2.5 text-sm font-medium text-beige hover:bg-beige/20 disabled:opacity-50"
        >
          {pending ? "Saving…" : existing ? "Update review" : "Post review"}
        </button>
        {existing ? (
          <button
            type="button"
            disabled={deleting}
            onClick={() => startDelete(async () => void (await deleteReview(vendorId, slug)))}
            className="text-sm text-muted underline-offset-4 hover:text-cream hover:underline"
          >
            {deleting ? "Deleting…" : "Delete my review"}
          </button>
        ) : null}
        <p aria-live="polite" className={`text-sm ${state.ok ? "text-veg" : "text-nonveg"}`}>
          {state.ok ? state.message : state.error}
        </p>
      </div>
    </form>
  );
}
