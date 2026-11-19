"use client";

import { useState, useTransition } from "react";
import { approveSuggestion, rejectSuggestion, resolveReport } from "@/lib/actions/admin";
import { idle, type ActionResult } from "@/lib/actions/result";
import { FormMessage } from "@/components/ui/primitives";
import { button } from "@/components/ui/styles";

function useAction() {
  const [result, setResult] = useState<ActionResult>(idle);
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<ActionResult>) => start(async () => setResult(await fn()));
  return { result, pending, run };
}

export function SuggestionActions({ id }: { id: string }) {
  const { result, pending, run } = useAction();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" disabled={pending} onClick={() => run(() => approveSuggestion(id))} className={button("primary", "sm")}>Approve</button>
      <button type="button" disabled={pending} onClick={() => run(() => rejectSuggestion(id))} className={button("danger", "sm")}>Reject</button>
      <FormMessage state={result} />
    </div>
  );
}

export function ReportActions({ id }: { id: string }) {
  const { result, pending, run } = useAction();
  return (
    <div className="flex items-center gap-2">
      <button type="button" disabled={pending} onClick={() => run(() => resolveReport(id))} className={button("secondary", "sm")}>Mark resolved</button>
      <FormMessage state={result} />
    </div>
  );
}
