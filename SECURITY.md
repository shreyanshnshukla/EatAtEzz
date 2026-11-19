# Security

Report a vulnerability privately to **shreyanshnandanshukla18@gmail.com**. Please don't open a public issue. We reply within 72 hours.

## Audit — November 2026

Scope: Supabase database (grants, RLS, functions, triggers), the Next.js web app, the Expo app, CI, and the repository history.

### Findings and fixes

| # | Severity | Finding | Fix |
|---|----------|---------|-----|
| 1 | Critical | `anon` and `authenticated` held every table privilege, including `TRUNCATE`, which RLS does not cover. Anyone with the public key could wipe a table. | `0005_hardening.sql` revokes everything and re-grants least privilege per table, with column-level `UPDATE` grants. Default privileges are revoked for future tables and functions. |
| 2 | High | A user could set `profiles.is_admin = true` on their own row. | Column grants limit profile updates to `display_name` and `avatar_url` (`0004`). |
| 3 | High | Daily limits on suggestions, reports and reviews lived only in app code; a direct API call skipped them. | `enforce_rate_limit()` triggers in the database: 10 suggestions, 10 reports and 30 reviews per user per day. |
| 4 | Medium | A playlist could grow without limit through the API. | `enforce_playlist_size()` trigger caps playlists at 50 spots. |
| 5 | Medium | Profile names, avatar URLs and playlist text had no length or scheme limits (`javascript:` avatars were possible). | Check constraints: name ≤ 60, avatar must be `https://`, title 3–60, tagline ≤ 120, description ≤ 500, note ≤ 280. |
| 6 | Medium | No Content-Security-Policy. | CSP in `next.config.ts`: only our own origin, Supabase and the map tile hosts; `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`. |
| 7 | Low | `/auth/signout` accepted cross-site POSTs. | Origin check; only same-origin requests sign out. |
| 8 | Low | Server actions accepted any string as an id. | UUID validation before any query; trigger errors become friendly messages. |
| 9 | Low | A redundant "insert own profile" policy and an executable `touch_updated_at()`. | Policy dropped; execute revoked. |
| 10 | Low | No automated dependency updates. | `.github/dependabot.yml` for web, mobile and GitHub Actions. |

### Verified

Run inside a rolled-back transaction with simulated users (anon, user A, user B, admin):

- **Still works:** anon reads all 504 vendors and calls `decide_for_me`; a user saves, reviews, edits a review, creates/renames a playlist, adds spots, suggests and reports; an admin approves suggestions, resolves reports and verifies vendors.
- **Blocked:** anon `TRUNCATE`, anon review insert, anon reading suggestions; moving a playlist into a curated section; self-promotion to admin; `javascript:` avatar; the 11th suggestion in a day; user A editing a vendor and user B deleting A's playlist items (RLS — 0 rows changed).

### Already in place

- RLS on every table; `vendor_cards` runs as the caller (`security_invoker`).
- `SECURITY DEFINER` functions (`create_playlist`, `approve_suggestion`, `is_admin`) pin `search_path` and check the caller inside. Supabase's advisor flags them; that is expected.
- Only the publishable key is used in clients and CI. No secret key exists in the repo.
- Google OAuth with PKCE on web and mobile; `next` redirects only to same-site paths (`safeNext`).
- Search input is stripped of PostgREST filter characters; JSON-LD escapes `<`.
- HSTS, `nosniff`, `X-Frame-Options: DENY`, strict referrer and permissions policies.

### To do by hand

1. **Rotate the old Firebase keys.** A `google-services.json` from the earlier project is still in git history. Restrict or delete that API key in Google Cloud, or rewrite history with `git filter-repo`.
2. **Supabase → Authentication → Providers:** disable Email sign-up so Google is the only way in. Enable leaked-password protection if email is ever turned on.
3. **Supabase → Authentication → URL configuration:** allow only `https://eatatezz.netlify.app/**` (plus the custom domain later) and `eatatezz://auth/callback`.
4. Turn on GitHub secret scanning and push protection for the repo.
5. Back up the database before each migration (Supabase daily backups start on the Pro plan).

### Accepted risks

- The mobile session sits in AsyncStorage. Moving it to `expo-secure-store` is planned.
- `profiles.is_admin` is readable through the public profile view. It reveals who moderates, nothing more.
