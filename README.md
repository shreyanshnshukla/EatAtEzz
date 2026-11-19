# EatAtEzz

**Kya khaun? Sorted.** Hyperlocal street food discovery for Lucknow.

```
eatatezz/
├── web/      Next.js website + landing page  →  see web/README.md
└── mobile/   Expo app (simple, dark)         →  see mobile/README.md
```

Both use one Supabase project (`eatatezz`, Mumbai): 504 Lucknow food spots, 60 areas, 37 famous dishes and 24 Food Playlists. Schema and seed data live in `web/supabase/`.

## Quick start

```bash
# Website
cd web && npm install && cp .env.example .env.local && npm run dev

# App
cd mobile && npm install && npx expo install --fix && cp .env.example .env && npx expo start
```

Google sign-in setup (one-time): see `web/README.md` → "Turn on Google sign-in".
