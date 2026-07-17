import { Redirect } from 'expo-router';
import { useStore } from '../hooks/useStore';

export default function Index() {
  const { isOnboarded } = useStore();

  if (isOnboarded) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding/welcome" />;
}
