import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SectionList, Text, View } from "react-native";
import { s } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { C } from "@/lib/theme";
import { SECTION_LABEL, type Playlist } from "@/lib/types";

const ORDER: Playlist["section"][] = ["non_veg", "veg", "vegan", "underrated", "area"];

export default function Playlists() {
  const [lists, setLists] = useState<Playlist[] | null>(null);

  useEffect(() => {
    supabase
      .from("playlists")
      .select("id, slug, title, tagline, description, section, curator, playlist_items(count)")
      .eq("is_published", true)
      .order("position")
      .then(({ data }) => {
        setLists(
          (data ?? []).map((r) => ({
            ...(r as unknown as Playlist),
            count: ((r as unknown as { playlist_items: { count: number }[] }).playlist_items?.[0]?.count ?? 0),
          })),
        );
      });
  }, []);

  if (!lists) return <ActivityIndicator color={C.beige} style={{ marginTop: 40 }} />;

  const sections = ORDER.map((k) => ({ title: SECTION_LABEL[k], data: lists.filter((l) => l.section === k) })).filter(
    (x) => x.data.length,
  );

  return (
    <View style={s.screen}>
      <SectionList
        sections={sections}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => <Text style={[s.h2, { marginTop: 16, marginBottom: 4 }]}>{section.title}</Text>}
        renderItem={({ item }) => (
          <Link href={`/playlist/${item.slug}`} asChild>
            <Pressable style={({ pressed }) => [s.card, pressed && { borderColor: C.caramel }]} accessibilityRole="link">
              <Text style={s.small}>{item.count} spots</Text>
              <Text style={[s.title, { fontSize: 22 }]}>{item.title}</Text>
              {item.tagline ? <Text style={[s.muted, { fontStyle: "italic", color: C.caramel }]}>{item.tagline}</Text> : null}
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
