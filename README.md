# ANCHOR

A free-to-start, subscription-powered **life navigation** app for people who feel
overwhelmed, fragmented, and unsure where to turn for help.

> **Not** a budgeting app, a social network, or a chatbot. One trusted place to
> understand your life, find real help, organize essentials, and connect safely —
> without judgment. **Crisis help is always free and never requires an account.**

**Phase 1 MVP:** San Antonio, Texas · English + Spanish.

Full strategy, data models, safety/privacy architecture, screen map, and roadmap live in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Features in this MVP

| # | Feature | Status |
|---|---------|--------|
| 1 | **Crisis Navigation** (988/911, 7 categories, no login) | ✅ Built |
| 2 | **Resource Finder** (9 categories, seeded SA data, call/directions/apply) | ✅ Built |
| 3 | **Life Dashboard** (daily check-in, saved help, quick actions) | ✅ Built |
| 4 | **AI Life Advisor** (warm, bilingual, options-only, crisis escalation, daily limit) | ✅ Built (mocked model) |
| 5 | **Document Vault** (encrypted-storage abstraction, 5-doc free cap) | ✅ Built (mocked storage) |
| 6 | **Community Circles** (3-circle free cap, guidelines + report) | ✅ Built |
| — | Onboarding, Simple Mode, Subscription, Settings/Privacy | ✅ Built |

## Tech stack

- **React Native + Expo** (expo-router) · **TypeScript** (strict)
- **i18next** EN/ES · **expo-localization**
- **AsyncStorage** for local persistence (stands in for Supabase in Phase 1)
- Mocked seams for **Supabase**, **Stripe**, **Anthropic Claude**, **PostHog** —
  each isolated in `src/services/` with integration notes.

## Run it

```bash
cd anchor
npm install          # or: npx expo install (resolves RN-compatible versions)
cp .env.example .env # optional in Phase 1; the app runs fully mocked without keys
npm run typecheck    # tsc --noEmit
npm start            # Expo dev server — press i / a / w, or scan the QR in Expo Go
```

> `npm run web` runs it in a browser; `i`/`a` need an iOS simulator / Android emulator or
> the **Expo Go** app on a physical device.

## What's real vs. mocked (Phase 1)

**Real:** all 12 screens, navigation, EN/ES localization, Simple Mode, accessibility-first
theming, freemium gating (AI/day, docs, circles), daily check-in, saved resources,
crisis-language detection + escalation, local persistence.

**Mocked (clear integration seams):**
- `src/services/claude.ts` — deterministic on-tone replies + **real crisis detection**.
  Swap `generateReply` for a server proxy that holds the Anthropic key (never on device).
- `src/services/supabase.ts` — AsyncStorage stub. Replace with `@supabase/supabase-js` + `supabase/schema.sql`.
- `src/services/stripe.ts` — fake checkout. Replace with Stripe Billing + webhooks.
- `src/services/vault.ts` — metadata-only stub designed for client-side envelope encryption.
- `src/services/analytics.ts` — no-PII PostHog placeholder, no-op until keyed, disablable.

## Safety & privacy (non-negotiable)

- Crisis Navigation is **always free** and reachable **without an account**, from any header.
- AI shares **options and information — not medical, legal, or financial advice**; it
  asks clarifying questions, cites resources, routes to professionals, and **escalates
  crisis language** to Crisis Navigation before any model call.
- **No ads. No selling data.** Analytics carry no PII and can be turned off.
- Documents store **metadata** in app state; bytes go through an encryption abstraction.
- The free tier is genuinely useful — never crippled.

## What to build next

See the roadmap (M1–M6) in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): wire Supabase +
RLS, server-side Claude proxy, Stripe Billing, client-side vault encryption, Circles
moderation backend, then a pre-launch accessibility + Spanish-copy + resource-verification pass.

> Seed resource data is **sample data** and must be verified with each organization /
> 211 Texas before launch.
