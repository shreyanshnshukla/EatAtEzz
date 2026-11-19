import { Pressable, StyleSheet, Text } from "react-native";
import { C } from "@/lib/theme";

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }} style={[st.chip, active && st.active]}>
      <Text style={[st.text, active && { color: C.beige }]}>{label}</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  chip: { borderColor: C.line, borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: C.card },
  active: { borderColor: C.beige, backgroundColor: "rgba(220,198,160,0.12)" },
  text: { color: C.muted, fontSize: 14 },
});
