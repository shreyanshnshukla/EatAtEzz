import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/welcome" />
        <Stack.Screen name="onboarding/choose-type" />
        <Stack.Screen name="onboarding/setup-profile" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
