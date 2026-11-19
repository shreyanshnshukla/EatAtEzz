"use client";

import { useActionState } from "react";
import { FormMessage } from "@/components/ui/primitives";
import { button, field, label } from "@/components/ui/styles";
import { deleteAccount } from "@/lib/actions/account";
import { idle } from "@/lib/actions/result";

export function DeleteAccount() {
  const [state, action, pending] = useActionState(deleteAccount, idle);
  return (
    <details className="mt-6 rounded-2xl border border-nonveg/40 p-5">
      <summary className="cursor-pointer text-sm text-nonveg">Delete my account</summary>
      <form action={action} className="mt-4 max-w-sm space-y-3">
        <p className="text-sm text-muted">
          This removes your profile, reviews, saved spots, playlists, suggestions and reports. It can&apos;t be undone.
        </p>
        <label className={label} htmlFor="confirm">Type DELETE to confirm</label>
        <input id="confirm" name="confirm" autoComplete="off" className={field} required />
        <button type="submit" disabled={pending} className={button("danger")}>
          {pending ? "Deleting…" : "Delete forever"}
        </button>
        <FormMessage state={state} />
      </form>
    </details>
  );
}
