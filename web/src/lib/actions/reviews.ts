"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fail, ok, SIGN_IN_REQUIRED, type ActionResult } from "./result";
import { session } from "./session";

const ReviewInput = z.object({
  vendorId: z.string().uuid(),
  slug: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Pick a rating from 1 to 5 stars.").max(5),
  body: z.string().trim().max(1000).optional().transform((v) => v || null),
});

export async function saveReview(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = ReviewInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check your review.");
  const { vendorId, slug, rating, body } = parsed.data;
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);

  const { error } = await supabase
    .from("reviews")
    .upsert({ vendor_id: vendorId, user_id: user.id, rating, body }, { onConflict: "vendor_id,user_id" });
  if (error) return fail("Couldn't save your review. Try again.");

  revalidatePath(`/vendor/${slug}`);
  return ok("Review saved. Shukriya!");
}

export async function deleteReview(vendorId: string, slug: string): Promise<ActionResult> {
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);
  const { error } = await supabase.from("reviews").delete().eq("vendor_id", vendorId).eq("user_id", user.id);
  if (error) return fail("Couldn't delete. Try again.");
  revalidatePath(`/vendor/${slug}`);
  return ok();
}
