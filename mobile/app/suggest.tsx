import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { s } from "@/components/styles";
import { listAreas } from "@/lib/api";
import { useSession } from "@/lib/auth";
import type { Diet } from "@/lib/domain";
import { suggestSpot } from "@/lib/me";
import { C } from "@/lib/theme";

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
  const [form, setForm] = useState({ name: "", category: "", diet: "both" as Diet, areaId: null as number | null, dish: "", landmark: "" });
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    listAreas().then((a) => setAreas(a.slice(0, 16)));
  }, []);

  async function submit() {
    if (!session) return router.push("/profile");
    if (form.name.trim().length < 2) return setMsg({ ok: false, text: "Add the stall or shop name." });
    if (!form.category) return setMsg({ ok: false, text: "Pick what they sell." });
    setBusy(true);
    const ok = await suggestSpot(form);
    setBusy(false);
    setMsg(ok ? { ok, text: `Thanks! We'll check "${form.name.trim()}" and add it soon.` } : { ok, text: "Couldn't send it. Try again." });
    if (ok) setForm((f) => ({ ...f, name: "", dish: "", landmark: "" }));
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: "Suggest a spot" }} />
      <Text style={s.h1}>Apni gali ka secret batao</Text>
      <Text style={s.muted}>Know a thela or shop that isn&apos;t on EatAtEzz? We check every suggestion before it goes live.</Text>

      <TextInput value={form.name} onChangeText={(t) => set("name", t)} placeholder="Stall or shop name *" placeholderTextColor={C.muted} maxLength={80} style={s.input} />

      <Text style={s.small}>Area</Text>
      <View style={s.row}>{areas.map((a) => <Chip key={a.id} label={a.name} active={form.areaId === a.id} onPress={() => set("areaId", form.areaId === a.id ? null : a.id)} />)}</View>

      <Text style={s.small}>What do they sell? *</Text>
      <View style={s.row}>{CATEGORIES.map((c) => <Chip key={c} label={c} active={form.category === c} onPress={() => set("category", c)} />)}</View>

      <Text style={s.small}>Veg or non-veg?</Text>
      <View style={s.row}>{DIETS.map((d) => <Chip key={d.key} label={d.label} active={form.diet === d.key} onPress={() => set("diet", d.key)} />)}</View>

      <TextInput value={form.dish} onChangeText={(t) => set("dish", t)} placeholder="Must-order dish" placeholderTextColor={C.muted} maxLength={120} style={s.input} />
      <TextInput value={form.landmark} onChangeText={(t) => set("landmark", t)} placeholder="Landmark (near…)" placeholderTextColor={C.muted} maxLength={160} style={s.input} />

      <Button label={busy ? "Sending…" : session ? "Send suggestion" : "Sign in to suggest"} onPress={submit} disabled={busy} />
      {msg ? <Text style={{ color: msg.ok ? C.veg : C.nonveg, textAlign: "center" }}>{msg.text}</Text> : null}
    </ScrollView>
  );
}
