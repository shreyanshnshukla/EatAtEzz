import Link from "next/link";
import type { Vendor } from "@/lib/domain";
import { cardLink } from "@/components/ui/styles";
import { DietBadge } from "./DietBadge";

export function VendorCard({ v }: { v: Vendor }) {
  return (
    <Link href={`/vendor/${v.slug}`} className={`${cardLink} group flex flex-col p-4`}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-wider text-caramel">{v.category}</p>
        {v.reviewCount > 0 ? <span className="text-xs text-beige">★ {v.rating.toFixed(1)}</span> : null}
      </div>
      <h3 className="mt-1.5 font-display text-lg leading-snug text-cream group-hover:text-beige">{v.name}</h3>
      {v.speciality ? <p className="mt-1 line-clamp-2 text-sm text-muted">{v.speciality}</p> : null}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        <DietBadge diet={v.diet} />
        {v.areaName ? <span className="text-xs text-muted">{v.areaName}</span> : null}
        {v.verified ? <span className="text-xs text-veg">Verified</span> : null}
      </div>
    </Link>
  );
}
