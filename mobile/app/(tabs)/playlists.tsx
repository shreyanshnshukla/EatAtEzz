import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, SectionList, Text, View } from "react-native";
import { Loading, Message } from "@/components/States";
import { s } from "@/components/styles";
import { listPlaylists } from "@/lib/api";
import { SECTION_LABEL, type PlaylistSection, type PlaylistSummary } from "@/lib/domain";
import { C } from "@/lib/theme";

const ORDER: PlaylistSection[] = ["non_veg", "veg", "vegan", "underrated", "area", "community"];
const MIN_COMMUNITY_SPOTS = 3;

export default function Playlists() {
  const [lists, setLists] = useState<PlaylistSummary[] | null>(null);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setLists(await listPlaylists());
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (error && !lists) return <Message>Couldn&apos;t load playlists. Check your internet.</Message>;
  if (!lists) return <Loading />;

  const sections = ORDER.map((k) => ({
    title: SECTION_LABEL[k],
    data: lists.filter((l) => l.section === k && (k !== "community" || l.count >= MIN_COMMUNITY_SPOTS)),
  })).filter((x) => x.data.length);

  return (
    <View style={s.screen}>
      <SectionList
        sections={sections}
        keyExtractor={(p) => p.id}
        contentContainerStyle={s.list}
        stickySectionHeadersEnabled={false}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await load();
          setRefreshing(false);
        }}
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
