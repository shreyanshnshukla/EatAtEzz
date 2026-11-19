import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Database } from "@/lib/database.types";
import { env } from "@/lib/env";

/** Session-aware client for Server Components, Route Handlers and Server Actions. */
export async function createServerDb() {
  const store = await cookies();
  return createServerClient<Database>(env.supabaseUrl, env.supabaseKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Server Components can't set cookies; the middleware refreshes the session instead.
        }
      },
    },
  });
}

/** The signed-in user, fetched once per request. */
export const getUser = cache(async () => {
  const supabase = await createServerDb();
  const { data } = await supabase.auth.getUser();
  return data.user;
});

/** The signed-in user's profile (name, photo, admin flag), once per request. */
export const getProfile = cache(async () => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createServerDb();
  const { data } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  return {
    id: user.id,
    email: user.email ?? "",
    name: data?.display_name ?? user.email ?? "Foodie",
    avatarUrl: data?.avatar_url ?? null,
    isAdmin: data?.is_admin ?? false,
  };
});
