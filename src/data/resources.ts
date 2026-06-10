// Seed resources for San Antonio, TX (Phase 1).
//
// IMPORTANT: This is SAMPLE seed data for the MVP. Before launch (ARCHITECTURE M6),
// every entry must be verified with the organization and/or 211 Texas, and moved into
// the Supabase `resources` table. Hours, wait times, and eligibility change often.

import type { Resource } from '@/types';

export const resources: Resource[] = [
  // ---------------- FOOD ----------------
  {
    id: 'food-sa-foodbank',
    name: 'San Antonio Food Bank',
    category: 'food',
    description: 'Groceries, hot meals, and help applying for SNAP food benefits.',
    address: '5200 Enrique M Barrera Pkwy, San Antonio, TX 78227',
    phone: '210-337-3663',
    hours: 'Mon–Fri 8:00am–5:00pm',
    eligibility: 'Open to anyone in need. Bring ID if you have it (not required for emergencies).',
    languages: ['English', 'Spanish'],
    estimatedWait: 'Same day',
    website: 'https://safoodbank.org',
    applicationUrl: 'https://safoodbank.org/get-help/',
    lat: 29.4072,
    lng: -98.6406,
  },
  {
    id: 'food-snap-211',
    name: 'SNAP Food Benefits (via 211 Texas)',
    category: 'food',
    description: 'Apply for monthly food benefits (SNAP). 211 can help you start.',
    address: 'Statewide phone service',
    phone: '211',
    hours: '24/7',
    eligibility: 'Income-based. Citizens and many lawful residents qualify.',
    languages: ['English', 'Spanish', 'Many languages by phone'],
    estimatedWait: '2–4 weeks for approval',
    website: 'https://www.yourtexasbenefits.com',
    applicationUrl: 'https://www.yourtexasbenefits.com',
  },

  // ---------------- HOUSING ----------------
  {
    id: 'housing-haven-for-hope',
    name: 'Haven for Hope',
    category: 'housing',
    description: 'Shelter, meals, and services for people experiencing homelessness.',
    address: '1 Haven for Hope Way, San Antonio, TX 78207',
    phone: '210-220-2100',
    hours: 'Intake 24/7',
    eligibility: 'Adults and families experiencing homelessness in Bexar County.',
    languages: ['English', 'Spanish'],
    estimatedWait: 'Same day intake',
    website: 'https://www.havenforhope.org',
    lat: 29.4316,
    lng: -98.5187,
  },
  {
    id: 'housing-rent-assistance-211',
    name: 'Rent & Utility Help (211 Texas)',
    category: 'housing',
    description: 'Connects you to rental and utility assistance programs in Bexar County.',
    address: 'Phone service',
    phone: '211',
    hours: '24/7',
    eligibility: 'Varies by program; usually income-based.',
    languages: ['English', 'Spanish'],
    estimatedWait: '1–2 weeks',
    website: 'https://www.211texas.org',
  },

  // ---------------- MENTAL HEALTH ----------------
  {
    id: 'mh-chcs',
    name: 'The Center for Health Care Services',
    category: 'mental_health',
    description: 'Counseling, psychiatry, and crisis support, regardless of ability to pay.',
    address: '3031 W Commerce St, San Antonio, TX 78207',
    phone: '210-261-3350',
    hours: 'Mon–Fri 8:00am–5:00pm; crisis line 24/7',
    eligibility: 'Bexar County residents. Sliding-scale and no-cost options.',
    languages: ['English', 'Spanish'],
    estimatedWait: '1–2 weeks for routine; same day for crisis',
    website: 'https://chcsbc.org',
    applicationUrl: 'https://chcsbc.org/services/',
  },
  {
    id: 'mh-988',
    name: '988 Suicide & Crisis Lifeline',
    category: 'mental_health',
    description: 'Free, confidential support 24/7 for emotional distress or thoughts of suicide.',
    address: 'Phone & text service',
    phone: '988',
    hours: '24/7',
    eligibility: 'Anyone. No cost.',
    languages: ['English', 'Spanish', 'Interpreters available'],
    estimatedWait: 'Immediate',
    website: 'https://988lifeline.org',
  },

  // ---------------- LEGAL AID ----------------
  {
    id: 'legal-trla',
    name: 'Texas RioGrande Legal Aid (TRLA)',
    category: 'legal',
    description: 'Free civil legal help: evictions, benefits, family safety, and more.',
    address: '1111 N Main Ave, San Antonio, TX 78212',
    phone: '210-212-3700',
    hours: 'Mon–Fri 8:00am–5:00pm',
    eligibility: 'Income-based. Civil (non-criminal) matters.',
    languages: ['English', 'Spanish'],
    estimatedWait: '1–2 weeks',
    website: 'https://www.trla.org',
    applicationUrl: 'https://www.trla.org/apply-for-help',
  },

  // ---------------- MEDICAL / DENTAL ----------------
  {
    id: 'medical-communicare',
    name: 'CommuniCare Health Centers',
    category: 'medical',
    description: 'Low-cost medical, dental, and behavioral care on a sliding scale.',
    address: '1635 NE Loop 410, San Antonio, TX 78209',
    phone: '210-233-7000',
    hours: 'Mon–Fri 8:00am–5:00pm',
    eligibility: 'Open to all. Sliding-scale fees; insurance not required.',
    languages: ['English', 'Spanish'],
    estimatedWait: '1–2 weeks',
    website: 'https://communicaresa.org',
    applicationUrl: 'https://communicaresa.org/become-a-patient/',
  },

  // ---------------- CHILDCARE ----------------
  {
    id: 'childcare-workforce',
    name: 'Workforce Solutions Alamo — Child Care Services',
    category: 'childcare',
    description: 'Help paying for child care while you work, train, or look for a job.',
    address: '100 N Santa Rosa Ave, San Antonio, TX 78207',
    phone: '210-272-3250',
    hours: 'Mon–Fri 8:00am–5:00pm',
    eligibility: 'Working/looking-for-work families, income-based.',
    languages: ['English', 'Spanish'],
    estimatedWait: '2–4 weeks',
    website: 'https://www.workforcesolutionsalamo.org',
  },

  // ---------------- EMPLOYMENT ----------------
  {
    id: 'employment-workforce',
    name: 'Workforce Solutions Alamo — Job Center',
    category: 'employment',
    description: 'Free job search help, training, résumés, and hiring events.',
    address: '9514 Console Dr, San Antonio, TX 78229',
    phone: '210-581-1150',
    hours: 'Mon–Fri 8:00am–5:00pm',
    eligibility: 'Open to all job seekers.',
    languages: ['English', 'Spanish'],
    estimatedWait: 'Same day (walk-in)',
    website: 'https://www.workforcesolutionsalamo.org',
  },

  // ---------------- IMMIGRATION ----------------
  {
    id: 'immigration-raices',
    name: 'RAICES',
    category: 'immigration',
    description: 'Low-cost and free legal help for immigrants and families.',
    address: '5121 Crestway Dr, Suite 105, San Antonio, TX 78239',
    phone: '210-960-3206',
    hours: 'Mon–Fri 9:00am–5:00pm',
    eligibility: 'Immigrants and families. Some services income-based.',
    languages: ['English', 'Spanish'],
    estimatedWait: '1–3 weeks',
    website: 'https://www.raicestexas.org',
  },

  // ---------------- CRISIS (also surfaced in Crisis Navigation) ----------------
  {
    id: 'crisis-family-violence',
    name: 'Family Violence Prevention Services (Battered Women & Children’s Shelter)',
    category: 'crisis',
    description: '24/7 shelter and support for people facing domestic violence.',
    address: 'Confidential location, San Antonio, TX',
    phone: '210-733-8810',
    hours: '24/7 hotline',
    eligibility: 'Anyone experiencing domestic or family violence.',
    languages: ['English', 'Spanish'],
    estimatedWait: 'Immediate',
    website: 'https://www.fvps.org',
  },
];

export function getResource(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}
