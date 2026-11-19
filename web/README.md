# EatAtEzz web

Next.js 15 (App Router, Server Actions) + TypeScript + Tailwind v4 + Supabase.

## Run

```bash
npm install
cp .env.example .env.local      # paste the Supabase publishable key
npm run dev                     # http://localhost:3000
```

| Script | Does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (`next/core-web-vitals` + TypeScript) |
| `npm run format` | Prettier + Tailwind class sorting |
| `npm run db:types` | Regenerate `src/lib/database.types.ts` after a schema change |

CI (`.github/workflows/ci.yml`) runs typecheck, lint and build on every push and PR.

## Code map

```
src/
├── app/                     Routes only: fetch data, compose components
│   ├── vendor/[slug]        Shop page: save, review, add to playlist, report, share
│   ├── playlist/[slug]      Playlist page (owner can remove spots / delete)
│   ├── explore, areas, area/[slug], dishes, decide, playlists
│   ├── account, suggest, login, auth/*   Signed-in flows
│   ├── admin                Moderation queue (admins only)
│   └── loading.tsx, error.tsx, not-found.tsx, sitemap.ts, robots.ts
├── components/
│   ├── ui/                  styles.ts (button/card/field recipes) + primitives.tsx
│   └── layout/ vendor/ playlist/ explore/ decide/ community/ admin/ common/
├── lib/
│   ├── env.ts               Validated environment variables
│   ├── database.types.ts    Generated Supabase types
│   ├── domain.ts            App types (Vendor, Playlist…), mappers, labels, URL helpers
│   ├── supabase/            public (anon), server (session + getUser/getProfile), browser
│   ├── queries/             Read-only data access, cached per request
│   └── actions/             Server Actions, validated with zod, one file per feature
└── middleware.ts            Refreshes the auth session cookie
```

Rules of thumb: pages never call Supabase directly (they go through `queries/`); every write is a Server Action in `actions/` that validates its input; every security rule is also enforced by RLS in the database, so the UI is never the only guard.

## Database

Migrations live in `supabase/migrations/` (0001 schema → 0004 moderation) and seed data in `supabase/seed/`. All of it is applied to the `eatatezz` Supabase project.

**Make yourself admin** (once, after your first sign-in), in Supabase → SQL editor:

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'shreyanshnandanshukla18@gmail.com');
```

Then `/admin` shows suggested spots (Approve creates the vendor) and "wrong info" reports.

## Google sign-in (one-time)

1. Google Cloud Console → OAuth consent screen (External, app name EatAtEzz).
2. Credentials → OAuth client ID → Web application.
   - Authorized JavaScript origins: `http://localhost:3000` and your live URL.
   - Authorized redirect URI: `https://giugizffyakajeyvctla.supabase.co/auth/v1/callback`
3. Supabase → Authentication → Providers → Google: enable, paste the client ID and secret.
4. Supabase → Authentication → URL Configuration: set the Site URL; add `http://localhost:3000/auth/callback`, `https://YOUR-SITE/auth/callback`, `eatatezz://auth/callback` and `exp://**` to Redirect URLs.

## Deploy (Netlify)

Import the repo, set **Base directory** to `web`, add the variables from `.env.example`, deploy.
