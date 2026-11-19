import { StyleSheet, Text, View } from "react-native";
import { DIET_LABEL, type Diet } from "@/lib/domain";
import { C } from "@/lib/theme";

export function DietMark({ diet }: { diet: Diet }) {
  const colors = diet === "both" ? [C.veg, C.nonveg] : [diet === "non_veg" ? C.nonveg : C.veg];
  return (
    <View style={st.badge} accessibilityLabel={DIET_LABEL[diet]}>
      {colors.map((c) => (
        <View key={c} style={[st.square, { borderColor: c }]}>
          <View style={[st.dot, { backgroundColor: c }]} />
        </View>
      ))}
      <Text style={st.text}>{DIET_LABEL[diet]}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: C.card2, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  text: { fontSize: 12, color: C.cream },
  square: { width: 13, height: 13, borderWidth: 1.5, borderRadius: 3, alignItems: "center", justifyContent: "center" },
  dot: { width: 5, height: 5, borderRadius: 3 },
});
