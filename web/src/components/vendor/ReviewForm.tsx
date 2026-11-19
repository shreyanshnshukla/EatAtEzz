"use client";

import { useActionState, useState, useTransition } from "react";
import { deleteReview, saveReview } from "@/lib/actions/reviews";
import { idle } from "@/lib/actions/result";
import { FormMessage } from "@/components/ui/primitives";
import { button, card, label, textarea } from "@/components/ui/styles";

type Props = { vendorId: string; slug: string; existing: { rating: number; body: string | null } | null };

export function ReviewForm({ vendorId, slug, existing }: Props) {
  const [state, action, pending] = useActionState(saveReview, idle);
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [deleting, startDelete] = useTransition();

  return (
    <form action={action} className={`${card} p-5`}>
      <input type="hidden" name="vendorId" value={vendorId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="rating" value={rating || ""} />
      <fieldset>
        <legend className={label}>{existing ? "Your review" : "Rate this spot"}</legend>
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
      <label htmlFor="review-body" className={`mt-4 block ${label}`}>What should people order? (optional)</label>
      <textarea
        id="review-body"
        name="body"
        defaultValue={existing?.body ?? ""}
        maxLength={1000}
        rows={3}
        placeholder="The galouti was soft, go before 8 pm…"
        className={`mt-1.5 ${textarea}`}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending || !rating} className={button()}>
          {pending ? "Saving…" : existing ? "Update review" : "Post review"}
        </button>
        {existing ? (
          <button
            type="button"
            disabled={deleting}
            onClick={() => startDelete(async () => void (await deleteReview(vendorId, slug)))}
            className={button("ghost", "sm")}
          >
            {deleting ? "Deleting…" : "Delete my review"}
          </button>
        ) : null}
        <FormMessage state={state} />
      </div>
    </form>
  );
}
