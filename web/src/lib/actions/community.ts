"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { REPORT_REASONS } from "@/lib/domain";
import { fail, ok, SIGN_IN_REQUIRED, type ActionResult } from "./result";
import { session } from "./session";

const DAILY_LIMIT = 10;
const optionalText = (max: number) => z.string().trim().max(max).optional().transform((v) => v || null);

const SuggestionInput = z.object({
  name: z.string().trim().min(2, "Add the stall or shop name.").max(80),
  category: z.string().trim().min(1, "Pick what they sell.").max(40),
  diet: z.enum(["veg", "non_veg", "both", "vegan"], { message: "Pick veg or non-veg." }),
  area_id: z.coerce.number().int().positive().optional().or(z.literal("").transform(() => undefined)),
  dish: optionalText(120),
  landmark: optionalText(160),
  note: optionalText(500),
});

const since24h = () => new Date(Date.now() - 24 * 3600 * 1000).toISOString();

export async function suggestSpot(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = SuggestionInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);

  const { count } = await supabase
    .from("vendor_suggestions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since24h());
  if ((count ?? 0) >= DAILY_LIMIT) return fail(`That's ${DAILY_LIMIT} suggestions today. Thank you! Try again tomorrow.`);

  const { area_id, ...rest } = parsed.data;
  const { error } = await supabase.from("vendor_suggestions").insert({ ...rest, area_id: area_id ?? null });
  if (error) return fail("Couldn't send it. Try again.");

  revalidatePath("/account");
  return ok(`Thanks! We'll check "${rest.name}" and add it soon.`);
}

const ReportInput = z.object({
  vendorId: z.string().uuid(),
  reason: z.enum(Object.keys(REPORT_REASONS) as [keyof typeof REPORT_REASONS, ...(keyof typeof REPORT_REASONS)[]], {
    message: "Pick what's wrong.",
  }),
  note: optionalText(500),
});

export async function reportVendor(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = ReportInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the form.");
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);

  const { count } = await supabase
    .from("vendor_reports")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since24h());
  if ((count ?? 0) >= DAILY_LIMIT) return fail("That's enough reports for today. Thank you!");

  const { vendorId, reason, note } = parsed.data;
  const { error } = await supabase.from("vendor_reports").insert({ vendor_id: vendorId, reason, note });
  if (error) return fail("Couldn't send it. Try again.");
  return ok("Thanks, we'll check it.");
}
