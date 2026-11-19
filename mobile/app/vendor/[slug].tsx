import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Button, Chip, DietMark, s } from "@/components/ui";
import { useSession } from "@/lib/auth";
import {
  addToPlaylist,
  createPlaylist,
  deleteReview,
  getMyState,
  getReviews,
  saveReview,
  setSaved,
  type MyPlaylist,
  type Review,
} from "@/lib/community";
import { supabase } from "@/lib/supabase";
import { C } from "@/lib/theme";
import { cleanName, directionsUrl, type VendorCard } from "@/lib/types";

export default function Vendor() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { session } = useSession();
  const userId = session?.user.id;

  const [v, setV] = useState<VendorCard | null | undefined>(undefined);
  const [lists, setLists] = useState<{ slug: string; title: string }[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [saved, setSavedState] = useState(false);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [myLists, setMyLists] = useState<MyPlaylist[]>([]);
  const [newList, setNewList] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async (vendor: VendorCard) => {
    const [r, pl] = await Promise.all([
      getReviews(vendor.id),
      supabase.from("playlist_items").select("playlists(slug, title, section)").eq("vendor_id", vendor.id),
    ]);
    setReviews(r);
    setLists(
      ((pl.data ?? []) as unknown as { playlists: { slug: string; title: string } | null }[])
        .map((x) => x.playlists)
        .filter((p): p is { slug: string; title: string } => Boolean(p)),
    );
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("vendor_cards").select("*").eq("slug", slug).maybeSingle();
      const vendor = (data as VendorCard | null) ?? null;
      setV(vendor);
      if (vendor) refresh(vendor);
    })();
  }, [slug, refresh]);

  useEffect(() => {
    if (!userId || !v) return;
    getMyState(userId, v.id).then((st) => {
      setSavedState(st.saved);
      setHasReview(Boolean(st.review));
      setRating(st.review?.rating ?? 0);
      setBody(st.review?.body ?? "");
      setMyLists(st.playlists);
    });
  }, [userId, v]);

  if (v === undefined) return <ActivityIndicator color={C.beige} style={{ marginTop: 40 }} />;
  if (v === null) return <Text style={[s.muted, { padding: 20 }]}>This spot doesn&apos;t exist anymore.</Text>;

  const needLogin = () => router.push("/profile");

  async function toggleSave() {
    if (!userId || !v) return needLogin();
    const next = !saved;
    setSavedState(next);
    if (!(await setSaved(userId, v.id, next))) setSavedState(!next);
  }

  async function submitReview() {
    if (!userId || !v || !rating) return;
    setBusy(true);
    const ok = await saveReview(userId, v.id, rating, body);
    setBusy(false);
    setMsg(ok ? "Review saved. Shukriya!" : "Couldn't save. Try again.");
    if (ok) {
      setHasReview(true);
      refresh(v);
    }
  }

  async function removeReview() {
    if (!userId || !v) return;
    if (await deleteReview(userId, v.id)) {
      setHasReview(false);
      setRating(0);
      setBody("");
      refresh(v);
    }
  }

  async function add(p: MyPlaylist) {
    if (!v) return;
    if (await addToPlaylist(p.id, v.id, p.count + 1)) {
      setMyLists((ls) => ls.map((x) => (x.id === p.id ? { ...x, has: true, count: x.count + 1 } : x)));
      setMsg(`Added to ${p.title}`);
    }
  }

  async function createAndAdd() {
    if (!v || newList.trim().length < 3) return setMsg("Give the playlist a name (3+ letters).");
    try {
      const created = await createPlaylist(newList);
      await addToPlaylist(created.id, v.id, 1);
      setMyLists((ls) => [{ id: created.id, slug: created.slug, title: created.title, count: 1, has: true }, ...ls]);
      setNewList("");
      setMsg(`Created ${created.title} and added this spot.`);
    } catch {
      setMsg("Couldn't create the playlist.");
    }
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: v.area_name ?? "" }} />
      <Text style={s.eyebrow}>{v.category} · {v.kind}</Text>
      <Text style={[s.h1, { fontSize: 32 }]}>{cleanName(v.name)}</Text>
      {v.speciality ? (
        <Text style={s.muted}>
          Known for: <Text style={{ color: C.cream }}>{v.speciality}</Text>
        </Text>
      ) : null}
      <View style={s.metaRow}>
        <DietMark diet={v.diet} />
        {v.review_count > 0 ? <Text style={[s.small, { color: C.beige }]}>★ {Number(v.avg_rating).toFixed(1)} ({v.review_count})</Text> : null}
        {v.area_name ? <Text style={s.small}>{v.area_name}</Text> : null}
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <Button label={saved ? "♥ Saved" : "♡ Want to try"} onPress={toggleSave} style={{ flex: 1 }} />
        <Button label="Directions" onPress={() => Linking.openURL(directionsUrl(v))} style={{ flex: 1 }} />
      </View>

      {lists.length ? (
        <View style={{ marginTop: 10, gap: 8 }}>
          <Text style={s.small}>Featured in</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {lists.map((p) => (
              <Link key={p.slug} href={`/playlist/${p.slug}`} style={[s.chip, { color: C.cream }]}>
                {p.title}
              </Link>
            ))}
          </View>
        </View>
      ) : null}

      {/* Your review */}
      <View style={[s.card, { marginTop: 10, gap: 10 }]}>
        <Text style={s.h2}>{hasReview ? "Your review" : "Rate this spot"}</Text>
        {userId ? (
          <>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRating(n)} accessibilityLabel={`${n} stars`} hitSlop={6}>
                  <Text style={{ fontSize: 32, color: rating >= n ? C.beige : C.line }}>★</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="What should people order?"
              placeholderTextColor={C.muted}
              multiline
              maxLength={1000}
              style={[s.input, { minHeight: 80, textAlignVertical: "top" }]}
            />
            <Button label={busy ? "Saving…" : hasReview ? "Update review" : "Post review"} onPress={submitReview} disabled={busy || !rating} />
            {hasReview ? (
              <Pressable onPress={removeReview}>
                <Text style={[s.small, { textAlign: "center" }]}>Delete my review</Text>
              </Pressable>
            ) : null}
          </>
        ) : (
          <Button label="Sign in to rate" onPress={needLogin} />
        )}
      </View>

      {/* Add to playlist */}
      {userId ? (
        <View style={[s.card, { gap: 10 }]}>
          <Text style={s.h2}>Add to your playlist</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {myLists.map((p) => (
              <Chip key={p.id} label={p.has ? `✓ ${p.title}` : p.title} active={p.has} onPress={() => !p.has && add(p)} />
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={newList}
              onChangeText={setNewList}
              placeholder="New playlist name"
              placeholderTextColor={C.muted}
              maxLength={60}
              style={[s.input, { flex: 1 }]}
            />
            <Button label="Create" onPress={createAndAdd} style={{ paddingHorizontal: 18 }} />
          </View>
        </View>
      ) : null}

      {msg ? <Text style={[s.small, { color: C.veg, textAlign: "center" }]}>{msg}</Text> : null}

      {/* Reviews */}
      <Text style={[s.h2, { marginTop: 10 }]}>Reviews</Text>
      {reviews.length === 0 ? (
        <Text style={s.muted}>No reviews yet. Tell Lucknow what to order here.</Text>
      ) : (
        reviews.map((r) => (
          <View key={r.id} style={s.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: C.cream }}>{r.author}</Text>
              <Text style={{ color: C.beige }}>{"★".repeat(r.rating)}</Text>
            </View>
            {r.body ? <Text style={s.muted}>{r.body}</Text> : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}
