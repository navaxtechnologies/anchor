// Legal documents — production DRAFTS generated for ANCHOR. Each must be
// reviewed by a licensed attorney before launch (consumer app + AI + health-
// adjacent + subscriptions = real legal exposure). Placeholders in [BRACKETS].
// English-first; certified Spanish translations are an M6 launch requirement.

export type LegalDocKey = 'terms' | 'privacy' | 'guidelines' | 'aiDisclaimer';

export const legalDocs: Record<LegalDocKey, { titleKey: string; body: string }> = {
  terms: {
    titleKey: 'legal.terms',
    body: `ANCHOR — TERMS & CONDITIONS (DRAFT — ATTORNEY REVIEW REQUIRED)
Last updated: June 2026

1. WHO WE ARE
ANCHOR is operated by [COMPANY LEGAL NAME] ("ANCHOR," "we," "us"). By creating an account or using the app you agree to these Terms. Crisis Navigation does not require an account and is available to anyone.

2. WHAT ANCHOR IS — AND IS NOT
ANCHOR helps you find resources, organize documents, connect with community, and think through options. ANCHOR is NOT an emergency service, and it is NOT a provider of medical, legal, financial, or therapeutic services. In an emergency, call 911.

3. YOUR ACCOUNT & RESPONSIBILITIES
You must be at least 13 years old (or the age required in your region). You are responsible for keeping your login secure and for the accuracy of information you store. You agree not to misuse the service (see Section 8).

4. SUBSCRIPTIONS & BILLING
Free features remain free. Paid tiers (ANCHOR+, ANCHOR PRO, ANCHOR COMMUNITY) bill monthly or yearly through your app store or our payment processor. You can cancel anytime; access continues through the end of the paid period. Prices may change with at least 30 days' notice. Refunds follow the policy of the platform you purchased through.

5. AI ADVISOR DISCLAIMER
The AI Life Advisor provides general information and options only. It does not provide medical, legal, or financial advice; does not diagnose; and is not a substitute for a licensed professional. See the separate AI Disclaimer, which is part of these Terms.

6. COMMUNITY RULES
Use of Community Circles is governed by the Community Guidelines, which are part of these Terms. We may remove content or restrict accounts that violate them.

7. INTELLECTUAL PROPERTY
ANCHOR's software, design, and content belong to [COMPANY LEGAL NAME] or its licensors. Content you post remains yours; you grant us a limited license to display it inside the service. We claim no ownership of your documents.

8. PROHIBITED CONDUCT
You may not: harass or harm others; post hate speech or threats; share another person's private information; attempt to access other users' data; use the service for unlawful activity; scrape or resell the service; or interfere with its operation.

9. TERMINATION
You may delete your account at any time in Settings, which deletes your personal data as described in the Privacy Policy. We may suspend or terminate accounts that violate these Terms, with notice where practicable. Crisis Navigation remains available regardless of account status.

10. DISCLAIMERS & LIMITATION OF LIABILITY
The service is provided "as is." Resource information (hours, eligibility, availability) can change without notice; verify with the organization. To the maximum extent permitted by law, [COMPANY LEGAL NAME]'s total liability is limited to the amount you paid us in the twelve months before the claim. Nothing in these Terms limits liability that cannot be limited by law.

11. DISPUTES, ARBITRATION & GOVERNING LAW
These Terms are governed by the laws of the State of Texas. Disputes will be resolved by binding individual arbitration in Bexar County, Texas, except either party may use small-claims court. YOU AND ANCHOR WAIVE CLASS-ACTION PARTICIPATION TO THE EXTENT PERMITTED BY LAW. [ATTORNEY: confirm enforceability and consumer-protection carve-outs.]

12. CHANGES & CONTACT
We will notify you of material changes in-app at least 30 days before they take effect. Questions: [CONTACT EMAIL].`,
  },

  privacy: {
    titleKey: 'legal.privacy',
    body: `ANCHOR — PRIVACY POLICY (DRAFT — ATTORNEY REVIEW REQUIRED)
Last updated: June 2026

THE SHORT VERSION
Your information belongs to you. No ads. We never sell your data. Crisis help requires no account. You can delete everything, anytime.

1. WHAT WE COLLECT
• Account: email, language, accessibility preferences, subscription tier.
• Your content: check-ins, reflections, saved resources, circle posts, advisor conversations, document metadata.
• Documents: file contents are encrypted; our design goal is that we cannot read them (see Section 3).
• Technical: device type, app version, crash reports.
• Anonymous usage events (which features are used) — only if you leave "Share anonymous usage" on. No advertising identifiers. No location tracking; resource distance is computed on your device.

2. WHAT WE NEVER DO
We never sell or rent your data. We never show ads. We never share your information with data brokers. Crisis Navigation works without an account and without identifying you.

3. HOW YOUR DATA IS STORED
Data is encrypted in transit (TLS) and at rest. Vault documents use client-side envelope encryption: keys are derived on your device, and the unencrypted key never leaves it. Per-user database isolation (row-level security) restricts every record to its owner.

4. WHO WE SHARE WITH
Only service providers necessary to run ANCHOR (hosting, payments, AI processing), each bound by contract to use data solely to provide the service: [Supabase — database/auth], [Stripe — payments; we never see full card numbers], [Anthropic — AI advisor processing; conversations are not used to train models per our agreement], [PostHog — anonymous usage analytics, optional]. We disclose data if legally compelled, and we will notify you unless prohibited.

5. YOUR RIGHTS (GDPR / CCPA / TEXAS)
You may access, correct, export, or delete your data at any time. Deletion is available in-app (Settings → Delete my data) and completes within 30 days, including backups. We honor GDPR rights (access, portability, erasure, objection), CCPA/CPRA rights (know, delete, opt-out of sale — we sell nothing), and the Texas Data Privacy and Security Act. We do not discriminate against users who exercise privacy rights.

6. CHILDREN
ANCHOR is not directed at children under 13, and we do not knowingly collect their data.

7. COOKIES & TRACKING
The mobile app uses no advertising cookies or cross-site trackers. Local storage holds your preferences on your device.

8. BREACH NOTIFICATION
If a breach affects your personal data, we will notify you and regulators as required by law, promptly and plainly.

9. CHANGES & CONTACT
Material changes are announced in-app 30 days in advance. Privacy questions or rights requests: [PRIVACY CONTACT EMAIL]. Data protection officer: [NAME/CONTACT if required].`,
  },

  guidelines: {
    titleKey: 'legal.guidelines',
    body: `ANCHOR — COMMUNITY GUIDELINES
Last updated: June 2026

Community Circles exist for one reason: meaningful support between people who understand. No likes, no followers, no algorithms — just people helping people.

BE KIND, ALWAYS
Treat every member as someone on a hard day. Disagreement is fine; disrespect is not.

WHAT'S NEVER ALLOWED
• Harassment, bullying, or personal attacks.
• Hate speech targeting race, ethnicity, religion, gender, sexual orientation, disability, immigration status, or background.
• Sharing anyone's private information (including your own address or financial details — protect yourself, too).
• Scams, solicitation, or selling.
• Graphic content describing methods of self-harm.

CRISIS CONTENT — HOW WE HANDLE IT
If you post that you are in danger or crisis, moderators and the app will point you to Crisis Navigation (988 / 911 / local help). We do this out of care, not punishment. Posts describing crisis experiences to seek support are welcome; instructions or encouragement of harm are removed.

ANONYMITY
You may post anonymously. Anonymity protects you; it never licenses cruelty. Anonymous posts follow the same rules.

REPORTING
Every post has a Report option. Reports are reviewed by trained moderators. Reporting in good faith is always safe; retaliation against reporters is a violation itself.

MODERATORS
Expert moderators may remove content, pause threads, or restrict accounts that break these rules. Decisions can be appealed at [SUPPORT EMAIL]. Repeated or severe violations end Circle access — Crisis Navigation is never taken away.`,
  },

  aiDisclaimer: {
    titleKey: 'legal.aiDisclaimer',
    body: `ANCHOR — AI ADVISOR DISCLAIMER
Last updated: June 2026

PLEASE READ — THIS MATTERS

The ANCHOR Life Advisor is an artificial-intelligence assistant. It is designed to explain options, answer questions in plain language, and point you toward real resources and professionals.

THE ADVISOR IS NOT:
• A doctor, nurse, or therapist. It cannot diagnose, treat, or assess your health. It does not provide medical advice.
• A lawyer. It does not provide legal advice and cannot represent you.
• A financial advisor. It does not provide investment, tax, or debt advice.
• An emergency service. If you are in danger, call 911. For a mental-health crisis, call or text 988.

WHAT THAT MEANS IN PRACTICE
• Information from the Advisor may be incomplete, outdated, or wrong. Verify anything important with the organization or a licensed professional.
• The Advisor presents options — decisions are always yours.
• For medical, legal, or financial decisions, consult a licensed professional. The Advisor can help you find low-cost ones.
• If your messages suggest a crisis, the app will route you to Crisis Navigation. This is a safety feature and is intentionally cautious.

YOUR CONVERSATIONS
Advisor conversations are private, are not used to train AI models, and are never sold. The Advisor only remembers personal context if you explicitly say yes — and you can clear it anytime in Settings.`,
  },
};
