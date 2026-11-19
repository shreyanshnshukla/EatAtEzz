import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/** Anonymous, read-only client for public data. RLS blocks every write. */
export const db = createClient<Database>(env.supabaseUrl, env.supabaseKey, {
  auth: { persistSession: false },
});
