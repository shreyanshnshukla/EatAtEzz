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
| `/sitemap.xml`, `/robots.txt` | Generated for SEO |

## Database

Schema: `supabase/migrations/0001_schema.sql` (cities, areas, vendors, dishes, profiles, reviews, saved_vendors, the `vendor_cards` view, and the `decide_for_me` / `nearby_vendors` functions). It is already applied to the `eatatezz` Supabase project.

Vendor locations: `vendors.location` is empty for now. Fill it from on-the-ground checks (or a licensed source) and set `is_verified = true`. Google Place IDs are stored so pages can link to Google Maps directions.

## Deploy on Netlify

1. New site → import this GitHub repo → **Base directory: `web`**.
2. Add the environment variables from `.env.example`.
3. Deploy. `netlify.toml` uses the official Next.js plugin.

## Next up

- Sign-in (Google) and reviews/saved spots (tables and RLS are ready)
- Verified locations → per-vendor pins and "near me"
- Vendor claim flow
