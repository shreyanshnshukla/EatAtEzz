import type { Review } from "@/lib/domain";
import { EmptyState, Stars } from "@/components/ui/primitives";
import { card } from "@/components/ui/styles";

const date = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return <EmptyState>No reviews yet. Tell Lucknow what to order here.</EmptyState>;
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className={`${card} p-4`}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-cream">{r.author}</p>
            <Stars value={r.rating} className="text-sm" />
          </div>
          {r.body ? <p className="mt-2 text-sm text-muted">{r.body}</p> : null}
          <p className="mt-2 text-xs text-muted">{date.format(new Date(r.createdAt))}</p>
        </li>
      ))}
    </ul>
  );
}
