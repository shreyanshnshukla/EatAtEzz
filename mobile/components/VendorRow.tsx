import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import type { Vendor } from "@/lib/domain";
import { C, serif } from "@/lib/theme";
import { DietMark } from "./DietMark";
import { s } from "./styles";

export function VendorRow({ v, index }: { v: Vendor; index?: number }) {
  return (
    <Link href={`/vendor/${v.slug}`} asChild>
      <Pressable style={({ pressed }) => [s.card, pressed && { borderColor: C.caramel }]} accessibilityRole="link">
        <View style={{ flexDirection: "row", gap: 12 }}>
          {index !== undefined ? <Text style={{ fontFamily: serif, fontStyle: "italic", fontSize: 26, color: C.caramel, width: 28 }}>{index + 1}</Text> : null}
          <View style={{ flex: 1 }}>
            <Text style={s.eyebrow}>{v.category}</Text>
            <Text style={s.title} numberOfLines={2}>{v.name}</Text>
            {v.speciality ? <Text style={s.muted} numberOfLines={2}>{v.speciality}</Text> : null}
            <View style={s.metaRow}>
              <DietMark diet={v.diet} />
              {v.reviewCount > 0 ? <Text style={[s.small, { color: C.beige }]}>★ {v.rating.toFixed(1)}</Text> : null}
              {v.areaName ? <Text style={s.small}>{v.areaName}</Text> : null}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
