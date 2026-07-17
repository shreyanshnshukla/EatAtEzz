# EatAtEzz v2 — How to Apply These Changes

## Step 1: Copy these files into your project

Replace/create files in your EatAtEzz folder:

```
hooks/useStore.ts          ← replaces old one (adds persistence)
types/index.ts             ← NEW file
data/mockData.ts           ← NEW file
babel.config.js            ← replaces old one (adds reanimated plugin)
package.json               ← replaces old one (adds new deps)
app/_layout.tsx            ← replaces old one
app/(tabs)/_layout.tsx     ← replaces old one (safe area fix)
app/(tabs)/index.tsx       ← replaces old one (animations + filter)
app/(tabs)/add.tsx         ← replaces old one (submit works)
app/(tabs)/search.tsx      ← replaces old one (empty state)
app/(tabs)/lists.tsx       ← replaces old one (animations, no fake names)
app/(tabs)/profile.tsx     ← replaces old one (India, sign out dialog)
app/onboarding/welcome.tsx ← replaces old one (logo image, India tagline)
app/onboarding/setup-profile.tsx ← replaces old one (chips fixed, no personal name)
```

## Step 2: Add your logo

1. Convert EATATEZZ_LOGO.jpeg → logo.png (use cloudconvert.com)
2. Place it at: `assets/images/logo.png`

## Step 3: Install new dependencies

```bash
# In your EatAtEzz project folder:
npm install

# Then install Expo-compatible versions:
npx expo install react-native-reanimated react-native-gesture-handler @react-native-async-storage/async-storage
```

## Step 4: Clear cache and run

```bash
npx expo start --clear
```

## What changed

| File | What was fixed |
|------|---------------|
| useStore.ts | Onboarding now persists across app restarts |
| (tabs)/_layout.tsx | Tab bar no longer overlaps home indicator |
| (tabs)/index.tsx | Category filter actually works + reanimated entrance |
| (tabs)/add.tsx | Submit button shows confirmation alert + City field added |
| (tabs)/search.tsx | Search actually filters spots + empty state shown |
| (tabs)/lists.tsx | No fake names, "India" copy, animated entrance |
| (tabs)/profile.tsx | "India" location, "Start Over" dialog instead of silent reset |
| onboarding/welcome.tsx | Uses real logo image, India-wide tagline |
| onboarding/setup-profile.tsx | Vendor chips wired, placeholder name removed |
| data/mockData.ts | All mock data centralised, no fake reviewer names |
| types/index.ts | TypeScript interfaces for Spot and FoodList |
| babel.config.js | Reanimated plugin added |
| package.json | AsyncStorage + Reanimated + GestureHandler added |
