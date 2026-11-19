import { Link } from "expo-router";
import { useState } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { DietMark } from "@/components/DietMark";
import { s } from "@/components/styles";
import { decide } from "@/lib/api";
import { directionsUrl, type Vendor } from "@/lib/domain";
import { C } from "@/lib/theme";

const DIETS = [
  { key: "", label: "Doesn't matter" },
  { key: "veg", label: "Veg" },
  { key: "non_veg", label: "Non-veg" },
  { key: "vegan", label: "Vegan" },
];
const MOODS = ["", "Kebabs", "Biryani", "Chaat", "Kachori & breakfast", "Kulfi & desserts", "Chai", "Sweets", "Momos"];

type Status = "idle" | "loading" | "empty" | "error";

export default function Decide() {
  const [diet, setDiet] = useState("");
  const [mood, setMood] = useState("");
  const [pick, setPick] = useState<Vendor | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  async function run() {
    setStatus("loading");
    try {
      const v = await decide(diet, mood);
      setPick(v);
      setStatus(v ? "idle" : "empty");
    } catch {
      setStatus("error");
    }
  }

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.pad}>
      <Text style={s.h1}>Let us <Text style={s.accent}>pick.</Text></Text>
      <Text style={s.small}>Veg or non-veg?</Text>
      <View style={s.row}>{DIETS.map((d) => <Chip key={d.key} label={d.label} active={diet === d.key} onPress={() => setDiet(d.key)} />)}</View>
      <Text style={s.small}>In the mood for</Text>
      <View style={s.row}>{MOODS.map((m) => <Chip key={m || "any"} label={m || "Surprise me"} active={mood === m} onPress={() => setMood(m)} />)}</View>
      <Button label={status === "loading" ? "Picking…" : pick ? "Pick another" : "Decide for me"} onPress={run} disabled={status === "loading"} />

      {status === "empty" ? <Text style={s.muted}>Nothing matches. Try &quot;Surprise me&quot;.</Text> : null}
      {status === "error" ? <Text style={s.muted}>Couldn&apos;t reach the kitchen. Check your internet.</Text> : null}
      {pick && status !== "empty" ? (
        <View style={[s.card, { borderColor: C.caramel, backgroundColor: C.card2, padding: 20 }]}>
          <Text style={[s.small, { color: C.caramel }]}>Aaj yahan chalo</Text>
          <Text style={[s.title, { fontSize: 26 }]}>{pick.name}</Text>
          {pick.speciality ? <Text style={s.muted}>{pick.speciality}</Text> : null}
          <View style={s.metaRow}>
            <DietMark diet={pick.diet} />
            {pick.areaName ? <Text style={s.small}>{pick.areaName}</Text> : null}
          </View>
          <View style={{ gap: 10, marginTop: 18 }}>
            <Button label="Get directions" onPress={() => Linking.openURL(directionsUrl(pick))} />
            <Link href={`/vendor/${pick.slug}`} style={{ color: C.beige, textAlign: "center", paddingVertical: 8 }}>See details</Link>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
