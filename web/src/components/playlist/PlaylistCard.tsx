import Link from "next/link";
import { SECTION_LABEL, type Playlist } from "@/lib/domain";
import { cardLink } from "@/components/ui/styles";

const DOT: Record<Playlist["section"], string> = {
  non_veg: "var(--color-nonveg)",
  veg: "var(--color-veg)",
  vegan: "var(--color-veg)",
  underrated: "var(--color-caramel)",
  area: "var(--color-caramel)",
  community: "var(--color-beige)",
};

export function PlaylistCard({ p }: { p: Playlist }) {
  return (
    <Link href={`/playlist/${p.slug}`} className={`${cardLink} group flex h-full flex-col p-5`}>
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: DOT[p.section] }} />
          {SECTION_LABEL[p.section]}
        </span>
        <span>{p.itemCount} spots</span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight text-cream group-hover:text-beige">{p.title}</h3>
      {p.tagline ? <p className="mt-1 text-sm italic text-caramel">{p.tagline}</p> : null}
      {p.preview.length ? (
        <ol className="mt-4 space-y-1 border-t border-line pt-3 text-sm text-muted">
          {p.preview.map((name, i) => (
            <li key={`${name}-${i}`} className="truncate">
              <span className="mr-2 text-caramel">{i + 1}</span>
              {name}
            </li>
          ))}
        </ol>
      ) : null}
    </Link>
  );
}
