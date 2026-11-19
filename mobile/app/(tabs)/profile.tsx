import { useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { Button, s } from "@/components/ui";
import { signInWithGoogle, useSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { C } from "@/lib/theme";

export default function Profile() {
  const { session, loading } = useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <ActivityIndicator color={C.beige} style={{ marginTop: 40 }} />;

  const user = session?.user;
  const name = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "";
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  async function onSignIn() {
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

  if (!user) {
    return (
      <View style={[s.screen, { padding: 20, justifyContent: "center", gap: 16 }]}>
        <Text style={s.h1}>
          eatat<Text style={{ color: C.beige, fontStyle: "italic" }}>ezz</Text>
        </Text>
        <Text style={s.muted}>Sign in to save spots, rate what you eat and make your own Food Playlists.</Text>
        <Button label={busy ? "Opening Google…" : "Continue with Google"} onPress={onSignIn} disabled={busy} />
        {error ? <Text style={{ color: C.nonveg }}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[s.screen, { padding: 20, gap: 20 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 1, borderColor: C.line }} accessibilityIgnoresInvertColors />
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
      <View style={s.card}>
        <Text style={s.muted}>Saved spots, reviews and your own playlists are coming next.</Text>
      </View>
      <Button label="Sign out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}
