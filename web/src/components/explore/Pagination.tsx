import Link from "next/link";
import { button } from "@/components/ui/styles";

type Props = { page: number; total: number; pageSize: number; basePath: string; params: Record<string, string | undefined> };

export function Pagination({ page, total, pageSize, basePath, params }: Props) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => Boolean(e[1]) && e[0] !== "page"));
    if (p > 1) sp.set("page", String(p));
    return sp.size ? `${basePath}?${sp}` : basePath;
  };

  return (
    <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-3">
      {page > 1 ? <Link className={button("secondary")} href={href(page - 1)}>Previous</Link> : null}
      <span className="text-sm text-muted">Page {page} of {pages}</span>
      {page < pages ? <Link className={button("secondary")} href={href(page + 1)}>Next</Link> : null}
    </nav>
  );
}
