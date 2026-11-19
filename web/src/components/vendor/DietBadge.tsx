import { DIET_LABEL, type Diet } from "@/lib/domain";

const VEG = "var(--color-veg)";
const NON_VEG = "var(--color-nonveg)";

/** Indian veg / non-veg mark: a square with a dot. */
function Mark({ color }: { color: string }) {
  return (
    <span aria-hidden="true" className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-[1.5px]" style={{ borderColor: color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
    </span>
  );
}

export function DietBadge({ diet }: { diet: Diet }) {
  const colors = diet === "both" ? [VEG, NON_VEG] : [diet === "non_veg" ? NON_VEG : VEG];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-card-2 px-2.5 py-1 text-xs text-cream">
      {colors.map((c) => <Mark key={c} color={c} />)}
      {DIET_LABEL[diet]}
    </span>
  );
}
