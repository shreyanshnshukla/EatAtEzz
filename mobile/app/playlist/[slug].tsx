import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Share, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Loading, Message } from "@/components/States";
import { s } from "@/components/styles";
import { VendorRow } from "@/components/VendorRow";
import { getPlaylist } from "@/lib/api";
import { WEB_URL } from "@/lib/domain";
import { C } from "@/lib/theme";

type Data = Awaited<ReturnType<typeof getPlaylist>>;

export default function PlaylistScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [data, setData] = useState<Data | undefined>(undefined);

  useEffect(() => {
    getPlaylist(slug).then(setData);
  }, [slug]);

  if (data === undefined) return <Loading />;
  if (data === null) return <Message>Playlist not found.</Message>;
  const { playlist: p, vendors } = data;

  return (
    <View style={s.screen}>
      <Stack.Screen options={{ title: "Playlist" }} />
      <FlatList
        data={vendors}
        keyExtractor={(v) => v.id}
        contentContainerStyle={s.list}
        ListHeaderComponent={
          <View style={[s.card, { padding: 20, marginBottom: 4, gap: 4 }]}>
            <Text style={[s.small, { color: C.caramel }]}>{vendors.length} spots · by {p.curator}</Text>
            <Text style={s.h1}>{p.title}</Text>
            {p.tagline ? <Text style={[s.muted, { fontStyle: "italic", color: C.beige }]}>{p.tagline}</Text> : null}
            {p.description ? <Text style={s.muted}>{p.description}</Text> : null}
            <Button
              label="Share playlist"
              variant="secondary"
              style={{ marginTop: 12 }}
              onPress={() => Share.share({ message: `${p.title} on EatAtEzz: ${WEB_URL}/playlist/${p.slug}` })}
            />
          </View>
        }
        ListEmptyComponent={<Message>No spots yet. Add some from any shop.</Message>}
        renderItem={({ item, index }) => <VendorRow v={item} index={index} />}
      />
    </View>
  );
}
