import { ActivityIndicator, Text } from "react-native";
import { C } from "@/lib/theme";
import { s } from "./styles";

export const Loading = () => <ActivityIndicator color={C.beige} style={s.center} />;

export const Message = ({ children }: { children: string }) => (
  <Text style={[s.muted, { textAlign: "center", marginTop: 40, paddingHorizontal: 20 }]}>{children}</Text>
);
