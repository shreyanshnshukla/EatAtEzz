import { Pressable, StyleSheet, Text, type ViewStyle } from "react-native";
import { C } from "@/lib/theme";

type Props = { label: string; onPress: () => void; variant?: "primary" | "secondary"; style?: ViewStyle; disabled?: boolean };

export function Button({ label, onPress, variant = "primary", style, disabled }: Props) {
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [st.base, primary ? st.primary : st.secondary, pressed && st.pressed, disabled && st.disabled, style]}
    >
      <Text style={[st.text, { color: primary ? C.beige : C.cream }]}>{label}</Text>
    </Pressable>
  );
}

const st = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, alignItems: "center" },
  primary: { borderColor: "rgba(220,198,160,0.5)", backgroundColor: "rgba(220,198,160,0.10)" },
  secondary: { borderColor: C.line, backgroundColor: C.card },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: "600" },
});
