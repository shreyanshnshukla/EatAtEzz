import type { Diet } from "@/lib/types";
import { DIET_LABEL } from "@/lib/format";

/** Indian veg / non-veg marker: square outline with a dot. */
function Mark({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-[1.5px]"
      style={{ borderColor: color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    </span>
  );
}

export function DietBadge({ diet }: { diet: Diet }) {
  const veg = "var(--color-veg)";
  const non = "var(--color-nonveg)";
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card-2 px-2.5 py-1 text-xs text-cream">
      {diet === "veg" || diet === "vegan" ? <Mark color={veg} /> : null}
      {diet === "non_veg" ? <Mark color={non} /> : null}
      {diet === "both" ? (
        <>
          <Mark color={veg} />
          <Mark color={non} />
        </>
      ) : null}
      {DIET_LABEL[diet]}
    </span>
  );
}
