import "server-only";
import { createServerDb } from "@/lib/supabase/server";

/** Supabase client plus the signed-in user, for Server Actions. */
export async function session() {
  const supabase = await createServerDb();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}
