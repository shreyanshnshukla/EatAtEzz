import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { Button, Chip, s } from "@/components/ui";
import { useSession } from "@/lib/auth";
import { supabase, CITY } from "@/lib/supabase";
import { C } from "@/lib/theme";
import type { Diet } from "@/lib/types";

const CATEGORIES = ["Chaat", "Kebabs", "Biryani", "Kachori & breakfast", "Sweets", "Kulfi & desserts", "Chai", "Momos", "Rolls & shawarma", "Paan", "Other"];
const DIETS: { key: Diet; label: string }[] = [
  { key: "veg", label: "Veg" },
  { key: "non_veg", label: "Non-veg" },
  { key: "both", label: "Both" },
  { key: "vegan", label: "Vegan" },
];

export default function Suggest() {
  const router = useRouter();
  const { session } = useSession();
  const [areas, setAreas] = useState<{ id: number; name: string }[]>([]);
  const [name, setName] = useState("");
  const [areaId, setAreaId] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [diet, setDiet] = useState<Diet>("both");
  const [dish, setDish] = useState("");
  const [landmark, setLandmark] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from("areas")
      .select("id, name, vendors(count), cities!inner(slug)")
      .eq("cities.slug", CITY)
      .then(({ data }) => {
        const list = ((data ?? []) as unknown as { id: number; name: string; vendors: { count: number }[] }[])
          .filter((a) => a.name !== "Other")
          .sort((a, b) => (b.vendors?.[0]?.count ?? 0) - (a.vendors?.[0]?.count ?? 0))
          .slice(0, 16);
        setAreas(list);
      });
  }, []);

  async function submit() {
    if (!session) return router.push("/profile");
    if (name.trim().length < 2) return setMsg({ ok: false, text: "Add the stall or shop name." });
    if (!category) return setMsg({ ok: false, text: "Pick what they sell." });
    setBusy(true);
    const { error } = await supabase.from("vendor_suggestions").insert({
      name: name.trim().slice(0, 80),
      area_id: areaId,
      category,
      diet,
      dish: dish.trim().slice(0, 120) || null,
      landmark: landmark.trim().slice(0, 160) || null,
    });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: "Couldn't send it. Try again." });
    setMsg({ ok: true, text: `Thanks! We'll check "${name.trim()}" and add it soon.` });
    setName("");
    setDish("");
    setLandmark("");
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: "Suggest a spot" }} />
      <Text style={s.h1}>Apni gali ka secret batao</Text>
      <Text style={s.muted}>Know a thela or shop that isn&apos;t on EatAtEzz? We check every suggestion before it goes live.</Text>

      <TextInput value={name} onChangeText={setName} placeholder="Stall or shop name *" placeholderTextColor={C.muted} maxLength={80} style={s.input} />

      <Text style={s.small}>Area</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {areas.map((a) => (
          <Chip key={a.id} label={a.name} active={areaId === a.id} onPress={() => setAreaId(areaId === a.id ? null : a.id)} />
        ))}
      </View>

      <Text style={s.small}>What do they sell? *</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
        ))}
      </View>

      <Text style={s.small}>Veg or non-veg?</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {DIETS.map((d) => (
          <Chip key={d.key} label={d.label} active={diet === d.key} onPress={() => setDiet(d.key)} />
        ))}
      </View>

      <TextInput value={dish} onChangeText={setDish} placeholder="Must-order dish" placeholderTextColor={C.muted} maxLength={120} style={s.input} />
      <TextInput value={landmark} onChangeText={setLandmark} placeholder="Landmark (near…)" placeholderTextColor={C.muted} maxLength={160} style={s.input} />

      <Button label={busy ? "Sending…" : session ? "Send suggestion" : "Sign in to suggest"} onPress={submit} disabled={busy} />
      {msg ? <Text style={{ color: msg.ok ? C.veg : C.nonveg, textAlign: "center" }}>{msg.text}</Text> : null}
    </ScrollView>
  );
}
