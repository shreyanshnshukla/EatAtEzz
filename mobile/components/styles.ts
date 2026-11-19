import { StyleSheet } from "react-native";
import { C, serif } from "@/lib/theme";

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.ink },
  pad: { padding: 20, gap: 14, paddingBottom: 60 },
  list: { padding: 16, gap: 12 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  h1: { fontFamily: serif, fontSize: 30, color: C.cream, fontWeight: "600" },
  h2: { fontFamily: serif, fontSize: 22, color: C.beige, fontWeight: "600" },
  eyebrow: { fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: C.caramel },
  title: { fontFamily: serif, fontSize: 19, color: C.cream, marginTop: 4 },
  muted: { fontSize: 14, color: C.muted, marginTop: 4, lineHeight: 20 },
  small: { fontSize: 12, color: C.muted },
  accent: { color: C.beige, fontStyle: "italic" },
  card: { backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 16, padding: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" },
  input: { backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: C.cream, fontSize: 15 },
  center: { marginTop: 40 },
});
