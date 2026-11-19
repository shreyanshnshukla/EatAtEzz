# EatAtEzz web: landing page and website

**Kya khaun? Sorted.** The EatAtEzz website for Lucknow: a landing page, plus explore, area, vendor, famous-dishes and "Decide for me" pages.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- Supabase (Postgres + PostGIS) for data, project `eatatezz` (Mumbai region)
- MapLibre GL for the area map (MapTiler dark style if a key is set, OpenFreeMap otherwise)
- Netlify for hosting

## Run it locally

```bash
cd web
npm install
cp .env.example .env.local   # then paste your Supabase anon/publishable key
npm run dev                  # http://localhost:3000
```

Get the key from Supabase → Project Settings → API keys. The anon/publishable key is safe in the browser because row-level security (RLS) is on for every table. **Never** put the `service_role` key in this app.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Landing: hero, cravings, area map, famous dishes, how it works, vendor sign-up |
| `/explore` | Search and filter all food spots by area, food and diet |
| `/areas` | Map and list of every Lucknow area |
| `/area/[slug]` | SEO page per area ("Street food in Aminabad"), grouped by food |
| `/vendor/[slug]` | Shop page: speciality, diet, directions, similar spots, JSON-LD |
| `/dishes` | Lucknow's famous veg, non-veg and vegan dishes |
| `/decide` | "Decide for me": picks one spot from your area, diet and craving |
| `/playlists`, `/playlist/[slug]` | 24 Food Playlists (non-veg, veg, vegan, underrated, area walks) |
| `/login`, `/account` | Google sign-in; account shows Want to try list, your playlists, your suggestions |
| `/suggest` | Suggest a missing stall (goes to a review queue) |
| `/sitemap.xml`, `/robots.txt` | Generated for SEO |

## Database

Schema: `supabase/migrations/0001_schema.sql` (cities, areas, vendors, dishes, profiles, reviews, saved_vendors, the `vendor_cards` view, and the `decide_for_me` / `nearby_vendors` functions). It is already applied to the `eatatezz` Supabase project.

Vendor locations: `vendors.location` is empty for now. Fill it from on-the-ground checks (or a licensed source) and set `is_verified = true`. Google Place IDs are stored so pages can link to Google Maps directions.

## Community features

- **Reviews:** 1–5 stars plus an optional note, one per person per spot (edit or delete anytime). Averages show on cards and shop pages.
- **Want to try:** heart a spot to save it; it appears on `/account`.
- **Your playlists:** create from `/account` or straight from a shop page; owners can remove spots or delete the playlist. Community playlists show on `/playlists` once they have 3+ spots.
- **Suggest a spot:** `/suggest` (max 10 a day per person). Review them in Supabase → `vendor_suggestions`, set `status` to `approved` or `rejected`, and add approved ones to `vendors`.

All of this is protected by row-level security: people can only change their own reviews, saves, playlists and suggestions.

## Turn on Google sign-in (one-time, about 10 minutes)

1. **Google Cloud Console** → APIs & Services → OAuth consent screen → set it up (External, app name EatAtEzz, your email).
2. **Credentials → Create credentials → OAuth client ID → Web application.**
   - Authorized JavaScript origins: `http://localhost:3000` and your live site URL.
   - Authorized redirect URI: `https://giugizffyakajeyvctla.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client secret**.
3. **Supabase dashboard → Authentication → Sign In / Providers → Google** → enable, paste the Client ID and secret, save.
4. **Supabase → Authentication → URL Configuration:**
   - Site URL: your live site URL (or `http://localhost:3000` while testing).
   - Redirect URLs: add `http://localhost:3000/auth/callback` and `https://YOUR-SITE/auth/callback`.

New users get a row in `profiles` automatically (name and photo from Google).

## Deploy on Netlify

1. New site → import this GitHub repo → **Base directory: `web`**.
2. Add the environment variables from `.env.example`.
3. Deploy. `netlify.toml` uses the official Next.js plugin.

## Next up

- Admin screen to approve suggested spots (for now: Supabase → Table editor → `vendor_suggestions`)
- Verified locations → per-vendor pins and "near me"
- Vendor claim flow
