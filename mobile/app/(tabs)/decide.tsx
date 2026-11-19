import { Link } from "expo-router";
import { useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { Button, Chip, DietMark, s } from "@/components/ui";
import { supabase, CITY } from "@/lib/supabase";
import { C } from "@/lib/theme";
import { cleanName, directionsUrl, type VendorCard } from "@/lib/types";

const DIETS = [
  { key: "", label: "Doesn't matter" },
  { key: "veg", label: "Veg" },
  { key: "non_veg", label: "Non-veg" },
  { key: "vegan", label: "Vegan" },
];
const MOODS = ["", "Kebabs", "Biryani", "Chaat", "Kachori & breakfast", "Kulfi & desserts", "Chai", "Sweets", "Momos"];

export default function Decide() {
  const [diet, setDiet] = useState("");
  const [mood, setMood] = useState("");
  const [pick, setPick] = useState<VendorCard | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "empty" | "error">("idle");

  async function decide() {
    setState("loading");
    const { data, error } = await supabase.rpc("decide_for_me", {
      p_city: CITY,
      p_area: null,
      p_diet: diet || null,
      p_category: mood || null,
    });
    if (error) return setState("error");
    const row = ((data ?? []) as VendorCard[])[0] ?? null;
    setPick(row);
    setState(row ? "idle" : "empty");
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={s.h1}>
        Let us <Text style={{ color: C.beige, fontStyle: "italic" }}>pick.</Text>
      </Text>
      <Text style={s.small}>Veg or non-veg?</Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {DIETS.map((d) => (
          <Chip key={d.key} label={d.label} active={diet === d.key} onPress={() => setDiet(d.key)} />
        ))}
      </View>
      <Text style={s.small}>In the mood for</Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {MOODS.map((m) => (
          <Chip key={m || "any"} label={m || "Surprise me"} active={mood === m} onPress={() => setMood(m)} />
        ))}
      </View>
      <Button
        label={state === "loading" ? "Picking…" : pick ? "Pick another" : "Decide for me"}
        onPress={decide}
        disabled={state === "loading"}
      />

      {state === "empty" ? <Text style={s.muted}>Nothing matches. Try &quot;Surprise me&quot;.</Text> : null}
      {state === "error" ? <Text style={s.muted}>Couldn&apos;t reach the kitchen. Check your internet.</Text> : null}
      {pick && state !== "empty" ? (
        <View style={[s.card, { borderColor: C.caramel, backgroundColor: C.card2, padding: 20 }]}>
          <Text style={[s.small, { color: C.caramel }]}>Aaj yahan chalo</Text>
          <Text style={[s.title, { fontSize: 26 }]}>{cleanName(pick.name)}</Text>
          {pick.speciality ? <Text style={s.muted}>{pick.speciality}</Text> : null}
          <View style={s.metaRow}>
            <DietMark diet={pick.diet} />
            {pick.area_name ? <Text style={s.small}>{pick.area_name}</Text> : null}
          </View>
          <View style={{ gap: 10, marginTop: 18 }}>
            <Button label="Get directions" onPress={() => Linking.openURL(directionsUrl(pick))} />
            <Link href={`/vendor/${pick.slug}`} style={{ color: C.beige, textAlign: "center", paddingVertical: 8 }}>
              See details
            </Link>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
