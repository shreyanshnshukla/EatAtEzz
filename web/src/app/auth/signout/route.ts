import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/auth/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
