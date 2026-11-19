import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { Chip } from "@/components/Chip";
import { Loading, Message } from "@/components/States";
import { s } from "@/components/styles";
import { VendorRow } from "@/components/VendorRow";
import { searchVendors } from "@/lib/api";
import { searchTerm, type Vendor } from "@/lib/domain";
import { C } from "@/lib/theme";

const DIETS = [
  { key: "", label: "All" },
  { key: "veg", label: "Veg" },
  { key: "non_veg", label: "Non-veg" },
  { key: "vegan", label: "Vegan" },
];

export default function Explore() {
  const [q, setQ] = useState("");
  const [diet, setDiet] = useState("");
  const [items, setItems] = useState<Vendor[]>([]);
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
      try {
        const next = reset ? 0 : page.current;
        const res = await searchVendors({ q: searchTerm(q), diet, page: next });
        page.current = next + 1;
        setItems((prev) => (reset ? res.vendors : [...prev, ...res.vendors]));
        setDone(res.done);
      } catch {
        setError(true);
      } finally {
        busy.current = false;
        setLoading(false);
      }
    },
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
        contentContainerStyle={s.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 4 }}>
            <Text style={s.h1}>Kya khaun? <Text style={s.accent}>Sorted.</Text></Text>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Kebab, chaat, Tunday…"
              placeholderTextColor={C.muted}
              style={s.input}
              accessibilityLabel="Search food spots"
              returnKeyType="search"
            />
            <View style={s.row}>
              {DIETS.map((d) => <Chip key={d.key} label={d.label} active={diet === d.key} onPress={() => setDiet(d.key)} />)}
            </View>
          </View>
        }
        renderItem={({ item }) => <VendorRow v={item} />}
        onEndReachedThreshold={0.4}
        onEndReached={() => !done && load(false)}
        ListEmptyComponent={loading ? null : <Message>{error ? "Couldn't load. Pull down to retry." : "Nothing here yet. Try another dish."}</Message>}
        ListFooterComponent={loading ? <Loading /> : null}
        refreshing={false}
        onRefresh={() => load(true)}
      />
    </View>
  );
}
