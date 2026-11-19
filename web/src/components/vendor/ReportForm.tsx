"use client";

import { useActionState } from "react";
import { reportVendor } from "@/lib/actions/community";
import { idle } from "@/lib/actions/result";
import { REPORT_REASONS } from "@/lib/domain";
import { FormMessage } from "@/components/ui/primitives";
import { button, field, textarea } from "@/components/ui/styles";

export function ReportForm({ vendorId }: { vendorId: string }) {
  const [state, action, pending] = useActionState(reportVendor, idle);
  return (
    <details className="group text-sm">
      <summary className="cursor-pointer text-muted hover:text-cream">Something wrong with this listing?</summary>
      <form action={action} className="mt-3 space-y-3">
        <input type="hidden" name="vendorId" value={vendorId} />
        <label htmlFor="report-reason" className="sr-only">What&apos;s wrong</label>
        <select id="report-reason" name="reason" required defaultValue="" className={field}>
          <option value="" disabled>What&apos;s wrong?</option>
          {Object.entries(REPORT_REASONS).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
        </select>
        <label htmlFor="report-note" className="sr-only">Details</label>
        <textarea id="report-note" name="note" rows={2} maxLength={500} placeholder="Details (optional)" className={textarea} />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={pending} className={button("secondary", "sm")}>{pending ? "Sending…" : "Send report"}</button>
          <FormMessage state={state} />
        </div>
      </form>
    </details>
  );
}
