# EatAtEzz mobile app (simple, dark)

Expo (React Native) + Expo Router, on the same Supabase database as the website.

**Screens:** Explore (search + veg/non-veg/vegan), Food Playlists, Decide for me, Profile (Google sign-in), plus vendor and playlist pages.

## Run it

```bash
cd mobile
npm install
npx expo install --fix     # lines up native package versions with your Expo SDK
cp .env.example .env
npx expo start             # press "a" for Android, or scan the QR with Expo Go
```

## Google sign-in in the app

In Supabase → Authentication → URL Configuration → Redirect URLs, add:

- `eatatezz://auth/callback` (installed app builds)
- `exp://**` (Expo Go while developing)

Google itself is set up once for both web and app (see `web/README.md`).

## Build an APK

```bash
npm install -g eas-cli
eas build -p android --profile preview
```

App icon and splash image are not added yet (dark background only). Drop a 1024×1024 `assets/icon.png` and point `app.json` → `icon` at it.
