import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local.",
  );
}

/** Public, read-only client. Row-level security keeps writes locked down. */
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

export const CITY = "lucknow";
