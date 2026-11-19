# EatAtEzz

**Kya khaun? Sorted.**
Hyperlocal street-food discovery for Lucknow. "Ezz" means *easy*: deciding what to eat should take seconds.

## What it does

| Feature | What people get |
| --- | --- |
| Explore | Search 504 Lucknow food spots by dish, area and veg / non-veg / vegan |
| Decide for me | Pick a diet and a craving, get one good spot with directions |
| Food Playlists | 24 curated trails (Galouti Gang, Chaat Pe Charcha, Kulfi Kingdom…) plus community playlists |
| Areas | A page per neighbourhood (Chowk, Aminabad, Hazratganj, Gomti Nagar…) with an area map |
| Famous dishes | 37 Lucknow dishes (veg, non-veg, vegan) and where they're famous |
| Reviews | 1–5 stars and a short note, one per person per spot |
| Want to try | Save spots to a personal list |
| Your playlists | Make, fill and share your own Food Playlists |
| Suggest a spot | Add a missing thela; it goes to a review queue first |
| Sign in | Google login (web and app) |

Lucknow-only at launch; the database is multi-city.

## Repo

```
eatatezz/
├── web/            Next.js 15 website + landing page (SEO pages, sitemap, JSON-LD)
│   └── supabase/   schema migrations + Lucknow seed data
└── mobile/         Expo (React Native) app, simple dark UI
```

## Stack

- **Web:** Next.js 15 (App Router, Server Actions), TypeScript, Tailwind CSS v4, MapLibre GL
- **App:** Expo SDK 54, Expo Router, TypeScript
- **Backend:** Supabase: Postgres + PostGIS, Auth (Google), row-level security on every table
- **Hosting:** Netlify (web), EAS Build (app)

## Data

| Table | Rows | Notes |
| --- | --- | --- |
| `vendors` | 504 | Name, area, category, speciality, diet, Google Place ID |
| `areas` | 60 | Lucknow neighbourhoods |
| `dishes` | 37 | Famous foods with season and where to eat them |
| `playlists` / `playlist_items` | 24 curated | Plus user-made "community" playlists |
| `reviews`, `saved_vendors`, `vendor_suggestions`, `profiles` | – | Per-user data, locked by RLS |

Specialities and diet tags were inferred from names and categories; verify them on the ground and set `is_verified`. Locations are empty until verified (no copied Google coordinates).

## Run it

```bash
# Website → http://localhost:3000
cd web && npm install && cp .env.example .env.local && npm run dev

# App → Expo Go / Android emulator
cd mobile && npm install && npx expo install --fix && cp .env.example .env && npx expo start
```

**One-time setup:** turn on Google sign-in (steps in `web/README.md`), and add `eatatezz://auth/callback` and `exp://**` to Supabase redirect URLs for the app.

## Next up

- Admin screen to approve suggested spots
- Verified locations → per-shop map pins and "near me"
- Vendor claim flow, app icon, food photos
