# ANCHOR — Product & Technical Architecture

> A free-to-start, subscription-powered **life navigation** app for people who feel
> overwhelmed, fragmented, and unsure where to turn for help.
> **Phase 1 MVP: San Antonio, Texas. English + Spanish.**

ANCHOR is **not** a budgeting app, a social network, or a chatbot. It is a personal
life navigator: understand your life, find help, organize essentials, connect safely,
and navigate financial, medical, legal, civic, and daily-life systems without judgment.

---

## 1. Product Strategy

### The problem
People in crisis or chronic overwhelm face a fragmented system. Help exists — food
banks, legal aid, clinics, shelters, benefits — but it is scattered across dozens of
phone trees, outdated websites, and word-of-mouth. The people who need it most have
the least bandwidth to navigate it. Existing tools either (a) require an account and
a credit card before they help, (b) drown users in a 211 database with no guidance, or
(c) over-promise with an AI that pretends to be a doctor/lawyer.

### The wedge
**Crisis Navigation, always free, no login.** That is the trust anchor. Once someone
has been helped in their worst moment, ANCHOR earns the right to help with everything
else. We grow from *acute help* → *ongoing navigation* → *organized life*.

### Positioning
> "One trusted place to understand your life and find real help — no judgment, no ads,
> no selling your data."

### Why it can win
- **Trust is the product.** No ads, no data sale, crisis access without account.
- **Guidance, not a database dump.** The AI explains options and routes to people.
- **Inclusive by construction.** Simple Mode, bilingual, accessible from day one.
- **Local depth first.** A genuinely good San Antonio dataset beats a shallow national one.

### Business model (freemium subscription)
- Free tier is genuinely useful (never crippled). It is the on-ramp and the safety net.
- Revenue from households who want more capacity (AI, documents, circles, family seats).
- **Never** from ads or data. Optional future B2B2C: counties/nonprofits sponsor PRO
  seats for clients (grant-funded), which is mission-aligned, not surveillance.

| Tier | Price | For |
|---|---|---|
| **Free** | $0 | Everyone. Dashboard, 10 AI Q/day, Resource Finder, 3 Circles, 5 docs, daily check-in, **Crisis (always)** |
| **ANCHOR+** | $4.99/mo · $39.99/yr | Unlimited AI, 50 docs, 10 Circles, reminders |
| **ANCHOR PRO** | $12.99/mo · $99.99/yr | Everything + family seats, document sharing w/ pros, priority resource updates |
| **ANCHOR COMMUNITY** | $24.99/mo | Orgs/advocates managing multiple people they help |

### Non-negotiables (enforced in code, not just policy)
1. Crisis Navigation is always free and never behind auth.
2. No ads, ever. No selling user data, ever.
3. The free tier is useful on its own.
4. Not built for one demographic. Simple Mode is first-class.
5. Do **not** over-AI. The AI explains and routes; it never decides for the user.
6. **No medical, legal, or financial advice.** Options + clarifying questions + citations + referral.
7. Accessibility from day one. Crisis language always escalates to Crisis Navigation.

---

## 2. MVP Scope (Phase 1 — San Antonio)

**Priority order (build + harden in this order):**
1. **Crisis Navigation** — 988, 911, 7 crisis categories, local + national routing, no login.
2. **Resource Finder** — 9 categories, seeded SA resources, call/directions/web actions.
3. **Life Dashboard** — daily check-in, saved resources, next steps, quick crisis access.
4. **AI Life Advisor** — warm, 6th-grade, bilingual, options-only, crisis escalation, daily limit.
5. **Document Vault** — encrypted-storage abstraction, 5-doc free cap, categories.
6. **Community Circles** — topic circles, 3-circle free cap, safety/moderation scaffolding.

**In scope:** the 12 screens, EN/ES localization, Simple Mode, theming/accessibility,
seeded data, freemium gating logic, mocked Supabase/Stripe/Claude/PostHog services with
clean swap-in points, type-checked codebase, run instructions.

**Explicitly mocked (Phase 1):** real Supabase project, real Stripe billing, live Claude
calls, push notifications, real moderation backend, production E2E document encryption keys.
Each has a single, clearly-marked integration seam.

**Out of scope (later phases):** provider portals, benefits auto-enrollment, offline-first
sync, native crisis hotline warm-transfer, multi-city expansion, web app.

---

## 3. User Stories

**Crisis (P1)**
- As someone in crisis, I can get help **without** creating an account.
- As a user in danger, I see 911 and 988 immediately and can call with one tap.
- As a user typing distress into the AI, I am gently routed to Crisis Navigation.

**Resource Finder (P2)**
- As a parent, I can filter help by category (food, housing, childcare…) and language.
- As a user, I can call, get directions, or open the application link from a resource.
- As a user, I can save a resource to my dashboard for later.

**Dashboard (P3)**
- As a returning user, I land on a calm home with my check-in, saved items, and next steps.
- As an overwhelmed user, I can do a 10-second daily check-in.

**AI Advisor (P4)**
- As a confused user, I can ask a plain-language question and get options, not orders.
- As a free user, I can ask 10 questions/day and clearly see my remaining count.
- As a user, I am asked permission before the app remembers personal context.

**Vault (P5)**
- As a user, I can store my ID, lease, or benefits letter and find it fast.
- As a free user, I can store 5 documents and am shown an honest upgrade path at the cap.

**Circles (P6)**
- As an isolated user, I can join up to 3 topic circles and read/post safely.
- As a user, I can report harmful content and see community guidelines.

**Cross-cutting**
- As a senior / low-literacy / overwhelmed user, I can turn on **Simple Mode**.
- As a Spanish speaker, I can use the whole app in Spanish, chosen at onboarding.

---

## 4. Data Models (app-level types)

See `src/types/index.ts` for the authoritative TypeScript. Summary:

- **Resource** — id, name, category, description, address, phone, hours, eligibility,
  languages[], estimatedWait, website, applicationUrl, lat/lng, isCrisis.
- **CrisisCategory** — id, key, title, urgencyLevel, immediateActions[] (call 911/988 etc.),
  localRoutes[] (placeholders), reassurance copy.
- **DocumentMeta** — id, ownerId, title, category, storagePath (encrypted ref), createdAt,
  sizeBytes, mimeType. *(File bytes never in app state; only metadata.)*
- **Circle** — id, name, topic, description, memberCount, isModerated, guidelinesUrl.
- **CheckIn** — id, userId, date, mood (1–5), note?, createdAt.
- **Profile** — id, language, simpleMode, tier, rememberContext (consent), createdAt.
- **AdvisorMessage** — id, role ('user'|'assistant'|'system'), content, createdAt, flagged?

---

## 5. Safety Architecture

Safety is layered and defense-in-depth:

1. **Always-on Crisis button** in the global header/tab bar on every screen, no auth gate.
2. **Crisis-language detection** (`services/claude.ts#detectCrisis`) runs on every AI input
   *before* the model call. On match → the UI hard-routes to Crisis Navigation and the
   model call is suppressed. Patterns cover self-harm, abuse, overdose, "nowhere to go".
3. **System prompt guardrails** (`services/claude.ts#ANCHOR_SYSTEM_PROMPT`): never diagnose,
   never prescribe, never say "you must", always present options, always add the
   not-a-professional disclaimer, route to humans, 6th-grade reading level, user's language.
4. **Static disclaimers** rendered in the Advisor UI and on first launch — independent of
   the model so they cannot be "argued away."
5. **No medical/legal/financial advice** is reinforced both in prompt and in UI copy; the
   advisor frames everything as "here are options / here is who to ask."
6. **988 + 911** are first-class, hard-coded, and reachable from Crisis with one tap.
7. **Consent before memory** — `rememberContext` defaults off; the AI asks before storing.

## 6. Privacy Architecture

- **Crisis with no account.** The crisis flow reads only static local data; no PII, no auth.
- **Data minimization.** We store the least that makes the feature work. Documents store
  *metadata* in Postgres and *bytes* in an encrypted storage abstraction (`services/vault.ts`)
  designed for a zero-knowledge / client-side-key pattern (envelope encryption seam noted).
- **No third-party ad/tracking SDKs.** Analytics (`services/analytics.ts`) is event-level,
  no PII, and is a no-op until a key is configured. It can be disabled in Settings.
- **No data sale** — architecturally there is no export-to-broker path; this is a product law.
- **RLS-first.** Postgres schema is designed for Supabase Row Level Security: a user can
  only read/write their own profile, documents, check-ins, and circle memberships.
- **Secrets** live in env vars (`.env`, never committed). `.env.example` documents them.

---

## 7. Screen Map

```
RootNavigator (stack)
├─ Onboarding (first run only)
│   ├─ Welcome / Mission
│   ├─ Language selection
│   └─ Simple Mode toggle
├─ Crisis (modal-capable, reachable from anywhere, NO AUTH)
│   ├─ Crisis Help (categories + 911/988)
│   └─ Crisis Detail (per-category actions + local routes)
└─ Main (bottom tabs)
    ├─ Home (Life Dashboard)
    ├─ Resources → Resource Detail (stack)
    ├─ Advisor (AI chat)
    ├─ Vault
    └─ More
        ├─ Community Circles
        ├─ Subscription / Upgrade
        └─ Settings / Privacy
```
A persistent **Crisis** affordance (header button) sits above the tabs on every screen.

## 8. Component Structure

- **Primitives:** `ScreenContainer`, `AppText`, `Button`, `Card`, `Pill`, `Divider`.
- **Domain:** `CrisisButton`, `CrisisCategoryCard`, `ResourceCard`, `CategoryChip`,
  `CheckInCard`, `MessageBubble`, `DocumentRow`, `CircleCard`, `PlanCard`, `Disclaimer`.
- **Providers:** `ThemeProvider` (palette + Simple Mode scaling), `AppProvider`
  (language, simpleMode, tier, usage counters, saved resources, auth stub), `i18n`.

All sizing/contrast flows from `theme/` so Simple Mode and accessibility are one switch.

## 9. Database Schema (Supabase Postgres — target)

See `supabase/schema.sql`. Tables: `profiles`, `resources`, `crisis_categories`,
`documents`, `circles`, `circle_members`, `check_ins`, `advisor_messages`,
`subscriptions`. RLS policies restrict every per-user table to `auth.uid()`. `resources`
and `crisis_categories` are public-read (no auth) to power the no-login crisis flow.

## 10. Implementation Plan

- **M0 — Foundation (this MVP):** Expo+TS, theming/Simple Mode, i18n EN/ES, navigation,
  providers, mocked services, seed data, all 12 screens, freemium gating, type-check.
- **M1 — Backend:** real Supabase project, run `schema.sql`, wire Auth, move resources to DB.
- **M2 — AI:** server-side Claude proxy (keep key off-device), streaming, memory w/ consent.
- **M3 — Payments:** Stripe Billing + webhooks → `subscriptions`, restore purchases.
- **M4 — Vault hardening:** client-side envelope encryption, key management, sharing to pros.
- **M5 — Circles trust & safety:** moderation queue, reporting workflow, rate limits.
- **M6 — Launch readiness:** accessibility audit, Spanish copy review by native speaker,
  resource data verified with local orgs, crisis routes confirmed with 211/local agencies.

> **Trust is the product. Build like someone's worst day depends on it — because it does.**
