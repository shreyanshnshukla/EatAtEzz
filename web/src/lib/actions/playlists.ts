"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fail, ok, SIGN_IN_REQUIRED, type ActionResult } from "./result";
import { session } from "./session";

const MAX_ITEMS = 50;

const CreateInput = z.object({
  title: z.string().trim().min(3, "Give it a name of 3 to 60 characters.").max(60, "Give it a name of 3 to 60 characters."),
  tagline: z.string().trim().max(120).optional(),
  vendorId: z.string().uuid().optional().or(z.literal("")),
  back: z.string().optional(),
});

/** Creates a playlist. From a vendor page it also adds that vendor; from /account it opens the new playlist. */
export async function createPlaylist(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const parsed = CreateInput.safeParse(Object.fromEntries(form));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check the name.");
  const { title, tagline, vendorId, back } = parsed.data;
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);

  const { data: created, error } = await supabase.rpc("create_playlist", { p_title: title, p_tagline: tagline || undefined });
  if (error || !created) return fail(error?.message.includes("limit") ? "You've reached 50 playlists." : "Couldn't create it. Try again.");
  revalidatePath("/account");

  if (!vendorId) redirect(`/playlist/${created.slug}`);

  await supabase.from("playlist_items").insert({ playlist_id: created.id, vendor_id: vendorId, position: 1 });
  if (back?.startsWith("/vendor/")) revalidatePath(back);
  return ok(`Created "${title}" and added this spot.`);
}

export async function addToPlaylist(playlistId: string, vendorId: string, slug: string): Promise<ActionResult> {
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);

  const { count } = await supabase.from("playlist_items").select("vendor_id", { count: "exact", head: true }).eq("playlist_id", playlistId);
  if ((count ?? 0) >= MAX_ITEMS) return fail(`A playlist can hold ${MAX_ITEMS} spots.`);

  const { error } = await supabase.from("playlist_items").insert({ playlist_id: playlistId, vendor_id: vendorId, position: (count ?? 0) + 1 });
  if (error) return fail(error.code === "23505" ? "Already in that playlist." : "Couldn't add it. Try again.");

  revalidatePath(`/vendor/${slug}`);
  return ok("Added to your playlist.");
}

export async function removeFromPlaylist(playlistId: string, vendorId: string, playlistSlug: string): Promise<ActionResult> {
  const { supabase, user } = await session();
  if (!user) return fail(SIGN_IN_REQUIRED);
  const { error } = await supabase.from("playlist_items").delete().eq("playlist_id", playlistId).eq("vendor_id", vendorId);
  if (error) return fail("Couldn't remove it.");
  revalidatePath(`/playlist/${playlistSlug}`);
  return ok();
}

export async function deletePlaylist(playlistId: string): Promise<void> {
  const { supabase, user } = await session();
  if (!user) redirect("/login");
  await supabase.from("playlists").delete().eq("id", playlistId).eq("owner_id", user.id);
  revalidatePath("/account");
  revalidatePath("/playlists");
  redirect("/account");
}
