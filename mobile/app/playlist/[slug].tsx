import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { s, VendorRow } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { C } from "@/lib/theme";
import type { Playlist, VendorCard } from "@/lib/types";

export default function PlaylistScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [p, setP] = useState<Playlist | null | undefined>(undefined);
  const [vendors, setVendors] = useState<VendorCard[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("playlists")
        .select("id, slug, title, tagline, description, section, curator, playlist_items(position, vendor_id)")
        .eq("slug", slug)
        .maybeSingle();
      if (!data) return setP(null);
      const row = data as unknown as Playlist & { playlist_items: { position: number; vendor_id: string }[] };
      const ids = [...row.playlist_items].sort((a, b) => a.position - b.position).map((i) => i.vendor_id);
      const { data: cards } = await supabase.from("vendor_cards").select("*").in("id", ids);
      const byId = new Map(((cards ?? []) as VendorCard[]).map((c) => [c.id, c]));
      setVendors(ids.map((id) => byId.get(id)).filter((v): v is VendorCard => Boolean(v)));
      setP({ ...row, count: ids.length });
    })();
  }, [slug]);

  if (p === undefined) return <ActivityIndicator color={C.beige} style={{ marginTop: 40 }} />;
  if (p === null) return <Text style={[s.muted, { padding: 20 }]}>Playlist not found.</Text>;

  return (
    <View style={s.screen}>
      <Stack.Screen options={{ title: "Playlist" }} />
      <FlatList
        data={vendors}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View style={[s.card, { padding: 20, marginBottom: 4 }]}>
            <Text style={[s.small, { color: C.caramel }]}>{vendors.length} spots · by {p.curator}</Text>
            <Text style={[s.h1, { marginTop: 6 }]}>{p.title}</Text>
            {p.tagline ? <Text style={[s.muted, { fontStyle: "italic", color: C.beige }]}>{p.tagline}</Text> : null}
            {p.description ? <Text style={[s.muted, { marginTop: 10 }]}>{p.description}</Text> : null}
          </View>
        }
        renderItem={({ item, index }) => <VendorRow v={item} index={index} />}
      />
    </View>
  );
}
