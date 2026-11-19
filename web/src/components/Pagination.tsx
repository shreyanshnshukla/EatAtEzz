import Link from "next/link";

export function Pagination({
  page,
  total,
  pageSize,
  basePath,
  params,
}: {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && k !== "page" && sp.set(k, v));
    if (p > 1) sp.set("page", String(p));
    const s = sp.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const btn = "rounded-xl border border-line px-4 py-2.5 text-sm transition hover:border-beige";
  return (
    <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-3">
      {page > 1 ? <Link className={btn} href={href(page - 1)}>Previous</Link> : null}
      <span className="text-sm text-muted">
        Page {page} of {pages}
      </span>
      {page < pages ? <Link className={btn} href={href(page + 1)}>Next</Link> : null}
    </nav>
  );
}
