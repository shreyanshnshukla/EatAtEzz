# EatAtEzz mobile app (simple, dark)

Expo (React Native) + Expo Router, on the same Supabase database as the website.

**Code:** `app/` screens · `components/` small UI pieces · `lib/api.ts` public data · `lib/me.ts` signed-in user's data · `lib/domain.ts` types and helpers · `lib/database.types.ts` generated schema (same as web).

**Screens:** Explore (search + veg/non-veg/vegan), Food Playlists, Decide for me, Profile (Google sign-in, Want to try list, your playlists), plus vendor pages (save, rate and review, add to playlist, share, report wrong info), playlist pages and Suggest a spot.

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
