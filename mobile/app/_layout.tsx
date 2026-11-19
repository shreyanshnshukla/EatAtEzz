import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { C } from "@/lib/theme";

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: C.ink, card: C.ink, text: C.cream, border: C.line, primary: C.beige },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: C.ink },
          headerTintColor: C.beige,
          headerTitleStyle: { color: C.cream },
          contentStyle: { backgroundColor: C.ink },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="vendor/[slug]" options={{ title: "" }} />
        <Stack.Screen name="playlist/[slug]" options={{ title: "" }} />
      </Stack>
    </ThemeProvider>
  );
}
