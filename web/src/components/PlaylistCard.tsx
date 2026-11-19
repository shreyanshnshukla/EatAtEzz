import Link from "next/link";
import type { Playlist } from "@/lib/types";
import { cleanName } from "@/lib/format";

export const SECTION_LABEL: Record<Playlist["section"], string> = {
  non_veg: "Non-veg",
  veg: "Veg",
  vegan: "Vegan",
  underrated: "Underrated",
  area: "Area walk",
  community: "Community",
};

function Dot({ section }: { section: Playlist["section"] }) {
  const color =
    section === "non_veg"
      ? "var(--color-nonveg)"
      : section === "veg" || section === "vegan"
        ? "var(--color-veg)"
        : "var(--color-caramel)";
  return <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: color }} />;
}

export function PlaylistCard({ p }: { p: Playlist }) {
  return (
    <Link
      href={`/playlist/${p.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-0.5 hover:border-caramel"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted">
          <Dot section={p.section} />
          {SECTION_LABEL[p.section]}
        </span>
        <span className="text-muted">{p.item_count} spots</span>
      </div>
      <h3 className="mt-3 font-display text-2xl leading-tight text-cream group-hover:text-beige">{p.title}</h3>
      {p.tagline ? <p className="mt-1 text-sm italic text-caramel">{p.tagline}</p> : null}
      {p.preview.length ? (
        <ol className="mt-4 space-y-1 border-t border-line pt-3 text-sm text-muted">
          {p.preview.map((n, i) => (
            <li key={n + i} className="truncate">
              <span className="mr-2 text-caramel">{i + 1}</span>
              {cleanName(n)}
            </li>
          ))}
        </ol>
      ) : null}
    </Link>
  );
}
