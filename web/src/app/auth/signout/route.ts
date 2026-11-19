import { NextResponse } from "next/server";
import { createServerDb } from "@/lib/supabase/server";

/** POST only, and only from our own pages (blocks cross-site sign-out). */
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const supabase = await createServerDb();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
