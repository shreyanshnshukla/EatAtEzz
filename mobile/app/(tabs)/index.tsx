import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { Chip, s, VendorRow } from "@/components/ui";
import { supabase, CITY } from "@/lib/supabase";
import { C } from "@/lib/theme";
import type { VendorCard } from "@/lib/types";

const PAGE = 30;
const DIETS = [
  { key: "", label: "All" },
  { key: "veg", label: "Veg" },
  { key: "non_veg", label: "Non-veg" },
  { key: "vegan", label: "Vegan" },
];

export default function Explore() {
  const [q, setQ] = useState("");
  const [diet, setDiet] = useState("");
  const [items, setItems] = useState<VendorCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);
  const page = useRef(0);
  const busy = useRef(false);

  const load = useCallback(
    async (reset: boolean) => {
      if (busy.current) return;
      busy.current = true;
      setLoading(true);
      setError(false);
      const from = reset ? 0 : page.current * PAGE;
      let query = supabase.from("vendor_cards").select("*").eq("city_slug", CITY);
      if (diet === "veg") query = query.in("diet", ["veg", "vegan"]);
      if (diet === "vegan") query = query.eq("diet", "vegan");
      if (diet === "non_veg") query = query.in("diet", ["non_veg", "both"]);
      const term = q.trim().replace(/[\\%_,()]/g, "");
      if (term) query = query.or(`name.ilike.%${term}%,speciality.ilike.%${term}%,category.ilike.%${term}%`);
      const { data, error: err } = await query.order("name").range(from, from + PAGE - 1);
      busy.current = false;
      setLoading(false);
      if (err) {
        setError(true);
        return;
      }
      const rows = (data ?? []) as VendorCard[];
      page.current = (reset ? 0 : page.current) + 1;
      setItems((prev) => (reset ? rows : [...prev, ...rows]));
      setDone(rows.length < PAGE);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, diet],
  );

  useEffect(() => {
    const t = setTimeout(() => load(true), 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <View style={s.screen}>
      <FlatList
        data={items}
        keyExtractor={(v) => v.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <Text style={s.h1}>
              Kya khaun? <Text style={{ color: C.beige, fontStyle: "italic" }}>Sorted.</Text>
            </Text>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Kebab, chaat, Tunday…"
              placeholderTextColor={C.muted}
              style={s.input}
              accessibilityLabel="Search food spots"
              returnKeyType="search"
            />
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {DIETS.map((d) => (
                <Chip key={d.key} label={d.label} active={diet === d.key} onPress={() => setDiet(d.key)} />
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => <VendorRow v={item} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => !done && !loading && load(false)}
        ListEmptyComponent={
          !loading ? (
            <Text style={[s.muted, { textAlign: "center", marginTop: 40 }]}>
              {error ? "Couldn't load. Check your internet and pull to retry." : "Nothing here yet. Try another dish."}
            </Text>
          ) : null
        }
        ListFooterComponent={loading ? <ActivityIndicator color={C.beige} style={{ marginVertical: 20 }} /> : null}
        refreshing={false}
        onRefresh={() => load(true)}
      />
    </View>
  );
}
