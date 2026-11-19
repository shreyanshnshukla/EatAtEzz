import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, Share, Text, TextInput, View } from "react-native";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { DietMark } from "@/components/DietMark";
import { Loading, Message } from "@/components/States";
import { s } from "@/components/styles";
import { getVendor, listReviews, playlistsForVendor } from "@/lib/api";
import { useSession } from "@/lib/auth";
import { directionsUrl, REPORT_REASONS, WEB_URL, type Vendor } from "@/lib/domain";
import { addToPlaylist, createPlaylist, deleteReview, myVendorState, reportVendor, saveReview, setSaved } from "@/lib/me";
import { C } from "@/lib/theme";

type Review = Awaited<ReturnType<typeof listReviews>>[number];
type MyList = { id: string; title: string; count: number; has: boolean };

export default function VendorScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const userId = useSession().session?.user.id;

  const [v, setV] = useState<Vendor | null | undefined>(undefined);
  const [featured, setFeatured] = useState<{ slug: string; title: string }[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [saved, setSavedState] = useState(false);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [myLists, setMyLists] = useState<MyList[]>([]);
  const [newList, setNewList] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async (vendorId: string) => {
    const [r, f] = await Promise.all([listReviews(vendorId), playlistsForVendor(vendorId)]);
    setReviews(r);
    setFeatured(f);
  }, []);

  useEffect(() => {
    getVendor(slug).then((vendor) => {
      setV(vendor);
      if (vendor) refresh(vendor.id);
    });
  }, [slug, refresh]);

  useEffect(() => {
    if (!userId || !v) return;
    myVendorState(userId, v.id).then((st) => {
      setSavedState(st.saved);
      setHasReview(Boolean(st.review));
      setRating(st.review?.rating ?? 0);
      setBody(st.review?.body ?? "");
      setMyLists(st.playlists);
    });
  }, [userId, v]);

  if (v === undefined) return <Loading />;
  if (v === null) return <Message>This spot doesn&apos;t exist anymore.</Message>;
  const vendor = v;
  const signIn = () => router.push("/profile");

  async function toggleSave() {
    if (!userId) return signIn();
    const next = !saved;
    setSavedState(next);
    if (!(await setSaved(userId, vendor.id, next))) setSavedState(!next);
  }

  async function submitReview() {
    if (!userId || !rating) return;
    setBusy(true);
    const ok = await saveReview(userId, vendor.id, rating, body);
    setBusy(false);
    setMsg(ok ? "Review saved. Shukriya!" : "Couldn't save. Try again.");
    if (ok) {
      setHasReview(true);
      refresh(vendor.id);
    }
  }

  async function removeReview() {
    if (!userId || !(await deleteReview(userId, vendor.id))) return;
    setHasReview(false);
    setRating(0);
    setBody("");
    refresh(vendor.id);
  }

  async function add(list: MyList) {
    if (list.has || !(await addToPlaylist(list.id, vendor.id, list.count + 1))) return;
    setMyLists((ls) => ls.map((x) => (x.id === list.id ? { ...x, has: true, count: x.count + 1 } : x)));
    setMsg(`Added to ${list.title}`);
  }

  async function createAndAdd() {
    if (newList.trim().length < 3) return setMsg("Give the playlist a name (3+ letters).");
    try {
      const created = await createPlaylist(newList);
      await addToPlaylist(created.id, vendor.id, 1);
      setMyLists((ls) => [{ id: created.id, title: created.title, count: 1, has: true }, ...ls]);
      setNewList("");
      setMsg(`Created ${created.title} and added this spot.`);
    } catch {
      setMsg("Couldn't create the playlist.");
    }
  }

  async function report(reason: string) {
    if (!userId) return signIn();
    setMsg((await reportVendor(vendor.id, reason)) ? "Thanks, we'll check it." : "Couldn't send. Try again.");
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: v.areaName ?? "" }} />
      <Text style={s.eyebrow}>{v.category} · {v.kind}</Text>
      <Text style={[s.h1, { fontSize: 32 }]}>{v.name}</Text>
      {v.speciality ? <Text style={s.muted}>Known for: <Text style={{ color: C.cream }}>{v.speciality}</Text></Text> : null}
      <View style={s.metaRow}>
        <DietMark diet={v.diet} />
        {v.reviewCount > 0 ? <Text style={[s.small, { color: C.beige }]}>★ {v.rating.toFixed(1)} ({v.reviewCount})</Text> : null}
        {v.areaName ? <Text style={s.small}>{v.areaName}</Text> : null}
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
        <Button label={saved ? "♥ Saved" : "♡ Want to try"} onPress={toggleSave} style={{ flex: 1 }} />
        <Button label="Directions" onPress={() => Linking.openURL(directionsUrl(vendor))} style={{ flex: 1 }} />
      </View>
      <Button label="Share" variant="secondary" onPress={() => Share.share({ message: `${vendor.name} on EatAtEzz: ${WEB_URL}/vendor/${vendor.slug}` })} />

      {featured.length ? (
        <View style={{ gap: 8 }}>
          <Text style={s.small}>Featured in</Text>
          <View style={s.row}>
            {featured.map((p) => <Link key={p.slug} href={`/playlist/${p.slug}`} style={[s.card, { color: C.cream, paddingVertical: 8 }]}>{p.title}</Link>)}
          </View>
        </View>
      ) : null}

      <View style={[s.card, { gap: 10 }]}>
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
            <TextInput value={body} onChangeText={setBody} placeholder="What should people order?" placeholderTextColor={C.muted} multiline maxLength={1000} style={[s.input, { minHeight: 80, textAlignVertical: "top" }]} />
            <Button label={busy ? "Saving…" : hasReview ? "Update review" : "Post review"} onPress={submitReview} disabled={busy || !rating} />
            {hasReview ? (
              <Pressable onPress={removeReview}><Text style={[s.small, { textAlign: "center" }]}>Delete my review</Text></Pressable>
            ) : null}
          </>
        ) : (
          <Button label="Sign in to rate" onPress={signIn} />
        )}
      </View>

      {userId ? (
        <View style={[s.card, { gap: 10 }]}>
          <Text style={s.h2}>Add to your playlist</Text>
          <View style={s.row}>
            {myLists.map((p) => <Chip key={p.id} label={p.has ? `✓ ${p.title}` : p.title} active={p.has} onPress={() => add(p)} />)}
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput value={newList} onChangeText={setNewList} placeholder="New playlist name" placeholderTextColor={C.muted} maxLength={60} style={[s.input, { flex: 1 }]} />
            <Button label="Create" onPress={createAndAdd} />
          </View>
        </View>
      ) : null}

      {msg ? <Text style={[s.small, { color: C.veg, textAlign: "center" }]}>{msg}</Text> : null}

      <Text style={[s.h2, { marginTop: 10 }]}>Reviews</Text>
      {reviews.length ? (
        reviews.map((r) => (
          <View key={r.id} style={s.card}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: C.cream }}>{r.author}</Text>
              <Text style={{ color: C.beige }}>{"★".repeat(r.rating)}</Text>
            </View>
            {r.body ? <Text style={s.muted}>{r.body}</Text> : null}
          </View>
        ))
      ) : (
        <Text style={s.muted}>No reviews yet. Tell Lucknow what to order here.</Text>
      )}

      <Text style={[s.small, { marginTop: 16 }]}>Something wrong with this listing?</Text>
      <View style={s.row}>
        {Object.entries(REPORT_REASONS).map(([key, label]) => <Chip key={key} label={label} onPress={() => report(key)} />)}
      </View>
    </ScrollView>
  );
}
