import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
import { Button } from "@/components/Button";
import { Loading } from "@/components/States";
import { s } from "@/components/styles";
import { VendorRow } from "@/components/VendorRow";
import { signInWithGoogle, useSession } from "@/lib/auth";
import type { Vendor } from "@/lib/domain";
import { createPlaylist, myProfile } from "@/lib/me";
import { db } from "@/lib/supabase";
import { C } from "@/lib/theme";

type MyList = { id: string; slug: string; title: string; count: number };

export default function Profile() {
  const { session, loading } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<Vendor[]>([]);
  const [lists, setLists] = useState<MyList[]>([]);
  const [newList, setNewList] = useState("");
  const userId = session?.user.id;

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      myProfile(userId).then((p) => {
        setSaved(p.saved);
        setLists(p.playlists);
      });
    }, [userId]),
  );

  if (loading) return <Loading />;

  async function signIn() {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in didn't finish. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    if (newList.trim().length < 3) return setError("Give the playlist a name (3+ letters).");
    try {
      const p = await createPlaylist(newList);
      setLists((l) => [{ id: p.id, slug: p.slug, title: p.title, count: 0 }, ...l]);
      setNewList("");
      setError(null);
    } catch {
      setError("Couldn't create the playlist.");
    }
  }

  const user = session?.user;
  if (!user) {
    return (
      <View style={[s.screen, { padding: 20, justifyContent: "center", gap: 16 }]}>
        <Text style={s.h1}>eatat<Text style={s.accent}>ezz</Text></Text>
        <Text style={s.muted}>Sign in to save spots, rate what you eat and make your own Food Playlists.</Text>
        <Button label={busy ? "Opening Google…" : "Continue with Google"} onPress={signIn} disabled={busy} />
        {error ? <Text style={{ color: C.nonveg }}>{error}</Text> : null}
        <Link href="/suggest" style={{ color: C.beige, textAlign: "center", marginTop: 8 }}>Suggest a spot</Link>
      </View>
    );
  }

  const name = (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "";
  const avatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: C.line }} />
        ) : (
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.card2, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: C.beige, fontSize: 24 }}>{name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[s.h1, { fontSize: 24 }]}>Namaste, {name.split(" ")[0]}</Text>
          <Text style={s.small}>{user.email}</Text>
        </View>
      </View>

      <Text style={[s.h2, { marginTop: 8 }]}>Want to try ({saved.length})</Text>
      {saved.length ? saved.map((v) => <VendorRow key={v.id} v={v} />) : <Text style={s.muted}>Tap ♡ Want to try on any spot and it shows up here.</Text>}

      <Text style={[s.h2, { marginTop: 8 }]}>Your playlists</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput value={newList} onChangeText={setNewList} placeholder="New playlist name" placeholderTextColor={C.muted} maxLength={60} style={[s.input, { flex: 1 }]} />
        <Button label="Create" onPress={create} />
      </View>
      {error ? <Text style={{ color: C.nonveg }}>{error}</Text> : null}
      {lists.map((p) => (
        <Link key={p.id} href={`/playlist/${p.slug}`} style={[s.card, { color: C.cream }]}>
          {p.title} <Text style={s.small}>· {p.count} spots</Text>
        </Link>
      ))}

      <Link href="/suggest" style={[s.card, { color: C.beige, textAlign: "center", marginTop: 8 }]}>+ Suggest a spot that&apos;s missing</Link>
      <Button label="Sign out" variant="secondary" onPress={() => db.auth.signOut()} style={{ marginTop: 8 }} />
    </ScrollView>
  );
}
