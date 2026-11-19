import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { C, serif } from "@/lib/theme";
import { cleanName, DIET_LABEL, type Diet, type VendorCard } from "@/lib/types";

export function DietMark({ diet }: { diet: Diet }) {
  const marks = diet === "both" ? [C.veg, C.nonveg] : [diet === "non_veg" ? C.nonveg : C.veg];
  return (
    <View style={s.badge} accessibilityLabel={DIET_LABEL[diet]}>
      {marks.map((c) => (
        <View key={c} style={[s.square, { borderColor: c }]}>
          <View style={[s.dot, { backgroundColor: c }]} />
        </View>
      ))}
      <Text style={s.badgeText}>{DIET_LABEL[diet]}</Text>
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={[s.chip, active && s.chipActive]}
    >
      <Text style={[s.chipText, active && { color: C.beige }]}>{label}</Text>
    </Pressable>
  );
}

export function Button({ label, onPress, style, disabled }: { label: string; onPress: () => void; style?: ViewStyle; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [s.button, pressed && { backgroundColor: "rgba(220,198,160,0.22)" }, disabled && { opacity: 0.5 }, style]}
    >
      <Text style={s.buttonText}>{label}</Text>
    </Pressable>
  );
}

export function VendorRow({ v, index }: { v: VendorCard; index?: number }) {
  return (
    <Link href={`/vendor/${v.slug}`} asChild>
      <Pressable style={({ pressed }) => [s.card, pressed && { borderColor: C.caramel }]} accessibilityRole="link">
        <View style={{ flexDirection: "row", gap: 12 }}>
          {index !== undefined ? <Text style={s.num}>{index + 1}</Text> : null}
          <View style={{ flex: 1 }}>
            <Text style={s.eyebrow}>{v.category}</Text>
            <Text style={s.title} numberOfLines={2}>{cleanName(v.name)}</Text>
            {v.speciality ? <Text style={s.muted} numberOfLines={2}>{v.speciality}</Text> : null}
            <View style={s.metaRow}>
              <DietMark diet={v.diet} />
              {v.area_name ? <Text style={s.small}>{v.area_name}</Text> : null}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.ink },
  h1: { fontFamily: serif, fontSize: 30, color: C.cream, fontWeight: "600" },
  h2: { fontFamily: serif, fontSize: 22, color: C.beige, fontWeight: "600" },
  eyebrow: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.caramel },
  title: { fontFamily: serif, fontSize: 19, color: C.cream, marginTop: 4 },
  muted: { fontSize: 14, color: C.muted, marginTop: 4, lineHeight: 20 },
  small: { fontSize: 12, color: C.muted },
  num: { fontFamily: serif, fontStyle: "italic", fontSize: 26, color: C.caramel, width: 28 },
  card: { backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 16, padding: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" },
  badge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.card2, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontSize: 12, color: C.cream },
  square: { width: 13, height: 13, borderWidth: 1.5, borderRadius: 3, alignItems: "center", justifyContent: "center" },
  dot: { width: 5, height: 5, borderRadius: 3 },
  chip: { borderColor: C.line, borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: C.card },
  chipActive: { borderColor: C.beige, backgroundColor: "rgba(220,198,160,0.12)" },
  chipText: { color: C.muted, fontSize: 14 },
  button: { borderColor: "rgba(220,198,160,0.5)", borderWidth: 1, backgroundColor: "rgba(220,198,160,0.10)", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  buttonText: { color: C.beige, fontSize: 16, fontWeight: "600" },
  input: { backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: C.cream, fontSize: 15 },
});
