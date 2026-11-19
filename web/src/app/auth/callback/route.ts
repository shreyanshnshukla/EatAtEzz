import { NextResponse } from "next/server";
import { safeNext } from "@/lib/domain";
import { createServerDb } from "@/lib/supabase/server";

/** Google returns here with a one-time code; swap it for a session cookie. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createServerDb();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext(searchParams.get("next"))}`);
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
