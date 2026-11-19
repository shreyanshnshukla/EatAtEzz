import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { C } from "@/lib/theme";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function icon(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => <Ionicons name={name} color={color} size={size} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: C.ink },
        headerTitleStyle: { color: C.cream },
        headerShadowVisible: false,
        tabBarStyle: { backgroundColor: C.ink, borderTopColor: C.line },
        tabBarActiveTintColor: C.beige,
        tabBarInactiveTintColor: C.muted,
        sceneStyle: { backgroundColor: C.ink },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Explore", tabBarIcon: icon("search-outline") }} />
      <Tabs.Screen name="playlists" options={{ title: "Playlists", tabBarIcon: icon("list-outline") }} />
      <Tabs.Screen name="decide" options={{ title: "Decide", tabBarIcon: icon("shuffle-outline") }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: icon("person-outline") }} />
    </Tabs>
  );
}
