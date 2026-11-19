import type { Review } from "@/lib/domain";
import { db } from "@/lib/supabase/public";

export async function listReviews(vendorId: string): Promise<Review[]> {
  const { data, error } = await db
    .from("reviews")
    .select("id, rating, body, created_at, profiles(display_name)")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    body: r.body,
    createdAt: r.created_at,
    author: (r.profiles?.display_name ?? "A Lucknow foodie").split(" ")[0],
  }));
}
