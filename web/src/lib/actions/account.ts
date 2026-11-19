"use server";

import { redirect } from "next/navigation";
import { fail, SIGN_IN_REQUIRED, type ActionResult } from "./result";
import { session } from "./session";

/** Permanently deletes the signed-in user and everything they created. */
export async function deleteAccount(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  if (form.get("confirm") !== "DELETE") return fail("Type DELETE to confirm.");
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);

  const { error } = await supabase.rpc("delete_my_account");
  if (error) return fail("Couldn't delete your account. Write to privacy@eatatezz.in and we'll do it by hand.");
  await supabase.auth.signOut();
  redirect("/?account=deleted");
}
