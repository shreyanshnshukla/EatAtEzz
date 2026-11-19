"use server";

import { revalidatePath } from "next/cache";
import { fail, ok, type ActionResult } from "./result";
import { session } from "./session";

/** Every admin write is also enforced in the database (is_admin() checks and RLS). */
export async function approveSuggestion(id: string): Promise<ActionResult> {
  const { supabase } = await session();
  const { data: slug, error } = await supabase.rpc("approve_suggestion", { p_id: id });
  if (error) return fail(error.message);
  revalidatePath("/admin");
  revalidatePath("/explore");
  return ok(`Live at /vendor/${slug}`);
}

export async function rejectSuggestion(id: string): Promise<ActionResult> {
  const { supabase } = await session();
  const { error } = await supabase.from("vendor_suggestions").update({ status: "rejected" }).eq("id", id);
  if (error) return fail(error.message);
  revalidatePath("/admin");
  return ok();
}

export async function resolveReport(id: string): Promise<ActionResult> {
  const { supabase } = await session();
  const { error } = await supabase.from("vendor_reports").update({ status: "resolved" }).eq("id", id);
  if (error) return fail(error.message);
  revalidatePath("/admin");
  return ok();
}
