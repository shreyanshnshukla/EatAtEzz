"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fail, ok, SIGN_IN_REQUIRED, type ActionResult } from "./result";
import { session } from "./session";

const Input = z.object({ vendorId: z.string().uuid(), slug: z.string().min(1), save: z.boolean() });

export async function setSaved(input: z.input<typeof Input>): Promise<ActionResult> {
  const parsed = Input.safeParse(input);
  if (!parsed.success) return fail("Invalid request.");
  const { vendorId, slug, save } = parsed.data;
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);

  const { error } = save
    ? await supabase.from("saved_vendors").upsert({ vendor_id: vendorId }, { onConflict: "user_id,vendor_id", ignoreDuplicates: true })
    : await supabase.from("saved_vendors").delete().eq("user_id", user.id).eq("vendor_id", vendorId);
  if (error) return fail("Couldn't update. Try again.");

  revalidatePath(`/vendor/${slug}`);
  revalidatePath("/account");
  return ok();
}
