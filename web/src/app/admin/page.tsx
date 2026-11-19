import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportActions, SuggestionActions } from "@/components/admin/ModerationActions";
import { EmptyState, PageHeader, Section } from "@/components/ui/primitives";
import { card } from "@/components/ui/styles";
import { DietBadge } from "@/components/vendor/DietBadge";
import { REPORT_REASONS, type ReportReason } from "@/lib/domain";
import { moderationQueue } from "@/lib/queries/me";
import { getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

const date = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

export default async function Admin() {
  const me = await getProfile();
  if (!me?.isAdmin) notFound();
  const { suggestions, reports } = await moderationQueue();

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10">
      <PageHeader eyebrow="Admin" title="Moderation">
        {suggestions.length} suggestions waiting · {reports.length} open reports
      </PageHeader>

      <Section id="suggestions" title="Suggested spots">
        {suggestions.length ? (
          <ul className="space-y-3">
            {suggestions.map((s) => (
              <li key={s.id} className={`${card} p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-display text-xl text-cream">{s.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {s.category} · {s.areas?.name ?? "Area unknown"} · {date.format(new Date(s.created_at))}
                    </p>
                    {s.dish ? <p className="mt-2 text-sm text-cream">Must order: {s.dish}</p> : null}
                    {s.landmark ? <p className="text-sm text-muted">Landmark: {s.landmark}</p> : null}
                    {s.note ? <p className="text-sm text-muted">Note: {s.note}</p> : null}
                  </div>
                  <DietBadge diet={s.diet} />
                </div>
                <div className="mt-4"><SuggestionActions id={s.id} /></div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>No suggestions waiting.</EmptyState>
        )}
      </Section>

      <Section id="reports" title="Reports">
        {reports.length ? (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className={`${card} flex flex-wrap items-center justify-between gap-4 p-5`}>
                <div>
                  {r.vendors ? (
                    <Link href={`/vendor/${r.vendors.slug}`} className="font-display text-lg text-cream hover:text-beige">{r.vendors.name}</Link>
                  ) : null}
                  <p className="text-sm text-caramel">{REPORT_REASONS[r.reason as ReportReason] ?? r.reason}</p>
                  {r.note ? <p className="text-sm text-muted">{r.note}</p> : null}
                </div>
                <ReportActions id={r.id} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>No open reports.</EmptyState>
        )}
      </Section>
    </div>
  );
}
