# EatAtEzz 🍽️
**India's food, found by its people**

A hyperlocal food discovery app for Lucknow's street food culture.

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install expo-specific versions
npx expo install

# 3. Start Metro
npx expo start --clear

# 4. Run on Android
# - Press 'a' in Metro terminal, OR
# - Scan QR with Expo Go app
```

---

## Project Structure

```
EatAtEzz/
├── app/
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Entry redirect
│   ├── onboarding/
│   │   ├── welcome.tsx          # Splash / welcome screen
│   │   ├── choose-type.tsx      # Foodie vs Vendor picker
│   │   └── setup-profile.tsx   # Name + avatar setup
│   └── (tabs)/
│       ├── _layout.tsx          # Tab bar
│       ├── index.tsx            # Home / Explore feed
│       ├── lists.tsx            # Food lists
│       ├── add.tsx              # Add a new spot
│       ├── search.tsx           # Search screen
│       └── profile.tsx          # User profile
├── constants/
│   └── theme.ts                 # Colors, typography, spacing
├── hooks/
│   └── useStore.ts              # Zustand global state
├── babel.config.js
├── app.json
└── package.json
```

---

## Screens Built

| Screen | Status |
|--------|--------|
| Welcome splash | ✅ |
| Foodie vs Vendor picker | ✅ |
| Profile setup | ✅ |
| Home / Explore feed | ✅ |
| Food lists | ✅ |
| Add a spot | ✅ |
| Search | ✅ |
| Profile | ✅ |

---

## Next Steps

- [ ] Connect Firebase / Supabase for real data
- [ ] Google Maps integration for spot locations
- [ ] Photo upload with Firebase Storage
- [ ] Auth (phone OTP for Indian users)
- [ ] Vendor promotion / ads system
- [ ] Push notifications

---

## Tech Stack
- React Native + Expo (SDK 51)
- Expo Router (file-based navigation)
- Zustand (state management)
- expo-linear-gradient
- TypeScript
