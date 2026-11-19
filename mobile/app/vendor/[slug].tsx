import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, Text, View } from "react-native";
import { Button, DietMark, s } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { C } from "@/lib/theme";
import { cleanName, directionsUrl, type VendorCard } from "@/lib/types";

export default function Vendor() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [v, setV] = useState<VendorCard | null | undefined>(undefined);
  const [lists, setLists] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("vendor_cards").select("*").eq("slug", slug).maybeSingle();
      const vendor = (data as VendorCard | null) ?? null;
      setV(vendor);
      if (vendor) {
        const { data: pl } = await supabase.from("playlist_items").select("playlists(slug, title)").eq("vendor_id", vendor.id);
        setLists(
          ((pl ?? []) as unknown as { playlists: { slug: string; title: string } | null }[])
            .map((r) => r.playlists)
            .filter((p): p is { slug: string; title: string } => Boolean(p)),
        );
      }
    })();
  }, [slug]);

  if (v === undefined) return <ActivityIndicator color={C.beige} style={{ marginTop: 40 }} />;
  if (v === null) return <Text style={[s.muted, { padding: 20 }]}>This spot doesn&apos;t exist anymore.</Text>;

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 20, gap: 14 }}>
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
        {v.area_name ? <Text style={s.small}>{v.area_name}</Text> : null}
        <Text style={[s.small, { color: v.is_verified ? C.veg : C.muted }]}>
          {v.is_verified ? "Verified" : "Not yet verified"}
        </Text>
      </View>
      <Button label="Get directions" onPress={() => Linking.openURL(directionsUrl(v))} style={{ marginTop: 10 }} />
      {lists.length ? (
        <View style={{ marginTop: 16, gap: 8 }}>
          <Text style={s.small}>Featured in</Text>
          {lists.map((p) => (
            <Link key={p.slug} href={`/playlist/${p.slug}`} style={[s.card, { color: C.cream, paddingVertical: 12 }]}>
              {p.title}
            </Link>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}
