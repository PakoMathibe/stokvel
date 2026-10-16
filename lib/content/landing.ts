// lib/content/landing.ts
import type {
  CtaContent,
  CtaSection,
  FaqItem,
  SectionHeader,
  NavLink,
  PricingTier,
  EnterpriseTier,
  MoneyState,
} from './types'

export type HeroContent = {
  eyebrow: string
  headline: string
  headlineAccent: string
  subheadline: string
  primaryCta: CtaContent
  secondaryCta: CtaContent
  stats: { value: string; label: string }[]
}

export type FeaturesSectionContent = SectionHeader & {
  items: {
    icon:
      | 'users'
      | 'wallet'
      | 'chart'
      | 'layers'
      | 'shield'
      | 'bell'
      | 'file'
      | 'sparkles'
      | 'gavel'
    title: string
    description: string
    href: string
  }[]
}

export type HowItWorksContent = SectionHeader & {
  steps: { number: string; title: string; description: string }[]
}

export type TypesContent = SectionHeader & {
  types: { name: string; description: string; example: string }[]
}

export type TestimonialsContent = SectionHeader & {
  items: { quote: string; author: string; role: string; initials: string }[]
}

export type RolesTeaserContent = SectionHeader & {
  intro: string
  cta: CtaContent
}

export type MoneyStatesContent = SectionHeader & {
  intro: string
  states: MoneyState[]
}

export type ComplianceStripContent = {
  headline: string
  subheadline: string
  badges: string[]
  cta: CtaContent
}

export type ReportsPreviewContent = SectionHeader & {
  intro: string
  sampleReports: string[]
  cta: CtaContent
}

export type SaasTeaserContent = SectionHeader & {
  intro: string
  bullets: string[]
  cta: CtaContent
}

export type PricingSectionContent = SectionHeader & {
  intro: string
  tiers: PricingTier[]
  enterprise: EnterpriseTier
  footnote: string
}

export type FaqContent = SectionHeader & { items: FaqItem[] }

export type FooterContent = {
  tagline: string
  columns: { heading: string; links: NavLink[] }[]
  copyright: string
  legal: NavLink[]
}

export type LandingContent = {
  nav: NavLink[]
  hero: HeroContent
  features: FeaturesSectionContent
  moneyStates: MoneyStatesContent
  howItWorks: HowItWorksContent
  types: TypesContent
  rolesTeaser: RolesTeaserContent
  reportsPreview: ReportsPreviewContent
  compliance: ComplianceStripContent
  saasTeaser: SaasTeaserContent
  testimonials: TestimonialsContent
  pricing: PricingSectionContent
  faq: FaqContent
  cta: CtaSection
  footer: FooterContent
}

const CONTENT: LandingContent = {
  nav: [
    { label: 'Features', href: '/features' },
    { label: 'Roles', href: '/roles' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'POPIA', href: '/popia' },
    { label: 'FAQ', href: '/#faq' },
  ],

  hero: {
    eyebrow: 'Built for South African stokvels',
    headline: 'The modern home for your',
    headlineAccent: 'stokvel',
    subheadline:
      'Track contributions, run payouts, manage members, and keep every rand transparent — from a single dashboard built for South African savings groups.',
    primaryCta: { label: 'Start free', href: '/signup' },
    secondaryCta: { label: 'See how it works', href: '/#how-it-works' },
    stats: [
      { value: '11M+', label: 'South Africans save in stokvels' },
      { value: 'R50B+', label: 'Saved collectively each year' },
      { value: '100%', label: 'Transparent ledgers' },
    ],
  },

  features: {
    eyebrow: 'Everything you need',
    headline: 'Nine modules. One platform.',
    subheadline:
      'Every part of running a stokvel — from member onboarding to payout reconciliation — designed the way South African groups actually operate.',
    items: [
      {
        icon: 'users',
        title: 'Member management',
        description:
          'Register members, capture contacts and beneficiaries, assign roles, track status and membership history.',
        href: '/features/member-management',
      },
      {
        icon: 'wallet',
        title: 'Contributions & savings',
        description:
          'Monthly, weekly or custom contributions. Record payments, chase arrears, generate receipts, send reminders.',
        href: '/features/contributions',
      },
      {
        icon: 'chart',
        title: 'Financial management',
        description:
          'Income and expenditure, bank reconciliation, categories, ledger, and exports to PDF, Excel or CSV.',
        href: '/features/financial-management',
      },
      {
        icon: 'layers',
        title: 'Payout management',
        description:
          'Rotation schedules, entitlement calculations, approval workflows, proof of payment, and payout history.',
        href: '/features/payouts',
      },
      {
        icon: 'file',
        title: 'Reports & analytics',
        description:
          'Ten report types designed for treasurers — income, arrears, reconciliation, cash position, audit trail.',
        href: '/features/reports',
      },
      {
        icon: 'gavel',
        title: 'Meetings & governance',
        description:
          'Schedule meetings, record attendance, store minutes, run polls, and preserve a digital constitution.',
        href: '/features/governance',
      },
      {
        icon: 'bell',
        title: 'Payments & notifications',
        description:
          'Bank EFT recording, statement imports, WhatsApp and SMS reminders, and automated alerts for treasurers.',
        href: '/features/payments',
      },
      {
        icon: 'shield',
        title: 'Security & POPIA',
        description:
          'Role-based access, multi-factor authentication, encryption, immutable audit records, and tested backups.',
        href: '/features/security',
      },
      {
        icon: 'sparkles',
        title: 'SaaS & multi-group',
        description:
          'One account, many stokvels. Subscriptions, digital onboarding, QR check-in, insights, and an integration API.',
        href: '/saas',
      },
    ],
  },

  moneyStates: {
    eyebrow: 'How we think about money',
    headline: 'Recorded, verified, available, owed.',
    subheadline:
      'These four figures are not the same. Most systems collapse them into one "balance" and quietly get it wrong. Ours keeps them apart.',
    intro:
      'A payment reference or uploaded proof of payment is not proof that money has cleared. Our ledger tracks each state explicitly, so the treasurer always knows what is safe to spend and what is still pending.',
    states: [
      {
        key: 'recorded',
        label: 'Money recorded',
        description:
          'A member or treasurer captured a payment. A receipt or proof of payment may exist, but the bank has not confirmed anything yet.',
        example: 'Thabo uploads a proof of payment for R500 on the 3rd.',
      },
      {
        key: 'verified',
        label: 'Money verified',
        description:
          'The payment has been matched against bank statement data or a trusted payment provider. It is real, but not yet allocated.',
        example: 'The R500 line appears on the imported Capitec statement.',
      },
      {
        key: 'available',
        label: 'Money available',
        description:
          'Cleared funds sitting in the group account, after pending payouts and known obligations. This is what can safely be paid out.',
        example: 'After R1,200 of upcoming payouts, R6,800 is available.',
      },
      {
        key: 'owed',
        label: 'Money owed',
        description:
          'Contributions due but not yet received, plus any penalties. Aged by days late so the treasurer can act.',
        example: 'Aisha owes R500 for March and R500 for April, 21 days late.',
      },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    headline: 'From signup to payout in three steps',
    subheadline:
      'No training required. If you can use WhatsApp, you can run a stokvel here.',
    steps: [
      {
        number: '01',
        title: 'Create your stokvel',
        description:
          'Name it, set the contribution amount and frequency, pick the type, and you are done. Takes under a minute.',
      },
      {
        number: '02',
        title: 'Invite your members',
        description:
          'Send a link by email or WhatsApp. Members sign up, accept the invite, and appear on your roster.',
      },
      {
        number: '03',
        title: 'Track, payout, repeat',
        description:
          'Generate contributions, import bank statements, run the rotation, and export statements. The system keeps the ledger.',
      },
    ],
  },

  types: {
    eyebrow: 'All stokvel types',
    headline: 'One platform, every kind of group',
    subheadline:
      'Whether you save for groceries, cover funerals, or rotate the pool — the system adapts to your rules.',
    types: [
      {
        name: 'Rotational',
        description:
          'Members take turns receiving the full pool. The system tracks whose turn is next and auto-advances on payout.',
        example: 'R2,000 × 12 members = R24,000 payout per turn',
      },
      {
        name: 'Grocery',
        description:
          'Save throughout the year for bulk food purchases. Track contributions and produce a purchase order at cycle end.',
        example: 'R500/month × 10 members, buy in November',
      },
      {
        name: 'Burial Society',
        description:
          'Immediate cover when a member experiences a bereavement. Fast-track payouts with a full audit trail.',
        example: 'R100/month, R10,000 claim per event',
      },
      {
        name: 'Investment',
        description:
          'Pool funds into interest-bearing accounts, property, or a business. Track interest and returns per member.',
        example: 'R1,000/month pooled into a fixed deposit',
      },
      {
        name: 'Savings Club',
        description:
          'Save together over a cycle, then distribute the total plus interest back to each member.',
        example: '12-month cycle, distribute in December',
      },
      {
        name: 'Family & Social',
        description:
          'Save for shared household upgrades, education, weddings, or social events — with the same transparency.',
        example: 'R300/month for a family reunion',
      },
    ],
  },

  rolesTeaser: {
    eyebrow: 'Roles & permissions',
    headline: 'Built for every seat at the table',
    subheadline:
      'The chairperson, treasurer and secretary do different jobs. The system gives each of them exactly the access they need — and nothing more.',
    intro:
      'Every action is attributed to a person. Financial decisions preserve who proposed, who approved, and who executed. Auditors get read-only access to approved records and audit trails.',
    cta: { label: 'See the full role matrix', href: '/roles' },
  },

  reportsPreview: {
    eyebrow: 'Reports & analytics',
    headline: 'The numbers your treasurer needs, ready in seconds',
    subheadline:
      'Ten report types designed around how stokvels actually report — at meetings, at month-end, and at the end of a cycle.',
    intro:
      'Every report distinguishes between money recorded, money verified, money available, and money owed. Export to PDF, Excel or CSV, or print directly.',
    sampleReports: [
      'Monthly and annual income & expenditure',
      'Contributions due versus collected',
      'Member arrears and payment history',
      'Payout schedules and reconciliation',
      'Bank reconciliation and cash position',
      'Expenses by category',
      'Group savings growth',
      'Investment performance (where applicable)',
      'Member statements and transaction ledgers',
      'Audit trail and exception reports',
    ],
    cta: { label: 'Explore reports', href: '/features/reports' },
  },

  compliance: {
    headline: 'Designed for POPIA from day one.',
    subheadline:
      'Financial records need stronger protection than an ordinary membership website. We build for that standard.',
    badges: [
      'POPIA-aligned data handling',
      'Role-based access & least privilege',
      'Multi-factor authentication',
      'Encryption in transit',
      'Immutable audit records',
      'Tested backup recovery',
    ],
    cta: { label: 'Read our compliance statement', href: '/popia' },
  },

  saasTeaser: {
    eyebrow: 'For growing groups',
    headline: 'One account. Many stokvels.',
    subheadline:
      'If you help run more than one group, the platform is built for that. Separate members, ledgers, rules and reports — under one login.',
    intro:
      'Digital onboarding, QR check-in at meetings, smart insights that flag missed-payment patterns, and an API for approved payment providers and accounting tools.',
    bullets: [
      'Multi-stokvel management with separate ledgers',
      'Subscription billing with feature limits',
      'Digital onboarding and electronic rule acceptance',
      'QR codes for member ID and meeting attendance',
      'Smart insights: missed payments, shortfalls, anomalies',
      'Integration API for payment and messaging providers',
    ],
    cta: { label: 'See the SaaS features', href: '/saas' },
  },

  testimonials: {
    eyebrow: 'Trusted by treasurers',
    headline: 'What stokvel treasurers say',
    items: [
      {
        quote:
          'Before this, I was reconciling a bank statement against a WhatsApp group every month. Now it takes ten minutes.',
        author: 'Nomsa M.',
        role: 'Treasurer, Soweto',
        initials: 'NM',
      },
      {
        quote:
          'The rotation tab alone saved us. No more arguments about whose turn it is — everyone can see it live.',
        author: 'Thabo K.',
        role: 'Chairperson, Tembisa',
        initials: 'TK',
      },
      {
        quote:
          'We run three stokvels and my members span two provinces. Everything lives in one place now.',
        author: 'Aisha P.',
        role: 'Admin, Durban',
        initials: 'AP',
      },
    ],
  },

  pricing: {
    eyebrow: 'Pricing',
    headline: 'Simple pricing, built for South African groups',
    subheadline:
      'Start free. Upgrade when your group grows. Cancel any time — no lock-in, no hidden fees.',
    intro:
      'All prices in South African Rand. VAT may apply. Free tier is genuinely free — no trial, no card required.',
    tiers: [
      {
        key: 'free',
        name: 'Free',
        price: 'R0',
        priceNote: 'forever',
        tagline: 'For a single small stokvel finding its feet.',
        audience: '1 stokvel · up to 10 members',
        features: [
          'Member register and profiles',
          'Contribution tracking and reminders',
          'Basic transaction ledger',
          'Member statements',
          'Digital acceptance of group rules',
          'POPIA-aligned data handling',
        ],
        cta: { label: 'Start free', href: '/signup' },
      },
      {
        key: 'basic',
        name: 'Basic',
        price: 'R199',
        priceNote: '/month',
        tagline: 'For a single active stokvel with unlimited members.',
        audience: '1 stokvel · unlimited members',
        features: [
          'Everything in Free',
          'Payout rotation and approval workflow',
          'Full reports (income, arrears, reconciliation)',
          'Bank statement import (CSV)',
          'WhatsApp and email reminders',
          'Audit trail and exception reports',
          'Export to PDF, Excel, CSV',
        ],
        highlighted: true,
        cta: { label: 'Choose Basic', href: '/signup?plan=basic' },
      },
      {
        key: 'medium',
        name: 'Medium',
        price: 'R449',
        priceNote: '/month',
        tagline: 'For treasurers or administrators running several groups.',
        audience: 'Up to 5 stokvels',
        features: [
          'Everything in Basic',
          'Multi-stokvel dashboard',
          'Role-based access (chair, treasurer, secretary, member, auditor)',
          'Meeting scheduling, minutes and voting',
          'Document storage for constitution and records',
          'QR check-in for meetings',
          'Digital onboarding and invitations',
        ],
        cta: { label: 'Choose Medium', href: '/signup?plan=medium' },
      },
      {
        key: 'large',
        name: 'Large',
        price: 'R899',
        priceNote: '/month',
        tagline: 'For professionals managing a portfolio of stokvels.',
        audience: 'Up to 20 stokvels',
        features: [
          'Everything in Medium',
          'Smart financial insights and forecasting',
          'Fraud and duplicate-payment detection',
          'Dual authorisation and transaction limits',
          'Integration API access',
          'Priority email and WhatsApp support',
          'Dedicated onboarding session',
        ],
        cta: { label: 'Choose Large', href: '/signup?plan=large' },
      },
    ],
    enterprise: {
      name: 'Enterprise',
      priceFrom: 'From R2,500',
      priceNote: '/month · custom quote',
      tagline: 'White-label the platform for your organisation or clients.',
      features: [
        'Everything in Large',
        'White-label branding (your logo, domain, colours)',
        'Unlimited stokvels and members',
        'Single sign-on (SSO)',
        'Custom roles and permission sets',
        'Data residency options',
        'Service level agreement (SLA)',
        'Dedicated support and quarterly reviews',
      ],
      cta: { label: 'Contact us', href: '/contact?plan=enterprise' },
    },
    footnote:
      'Prices are indicative and in South African Rand. VAT may apply. Enterprise pricing depends on scale and support requirements.',
  },

  faq: {
    eyebrow: 'FAQ',
    headline: 'Common questions',
    items: [
      {
        question: 'Is my stokvel data safe?',
        answer:
          'Yes. Data is stored in a Supabase Postgres database with row-level security. Only members of your stokvel can see your stokvel. We never share your data with third parties, and access is protected by role-based permissions and multi-factor authentication for committee members.',
      },
      {
        question: 'Is this POPIA compliant?',
        answer:
          'The platform is built for POPIA-aligned data handling: lawful basis, purpose limitation, access controls, encryption in transit, retention limits, and consent controls. POPIA compliance is a shared responsibility — your group also needs a lawful basis to process member data and must follow the platform\'s guidance on retention and consent. See our compliance statement for the full picture.',
      },
      {
        question: 'Does the system hold our money?',
        answer:
          'No. The platform is a records and governance tool. It does not hold, receive, or transfer member funds. Your group keeps its own bank account and your treasurer records payments into the platform, ideally by importing bank statements. This is deliberate — it keeps your group in control and avoids triggering financial-services licensing obligations we are not authorised for.',
      },
      {
        question: 'What is the difference between a recorded and a verified payment?',
        answer:
          'A recorded payment is one that has been captured — for example, a member uploads a proof of payment. A verified payment has been matched against trusted bank or payment provider data. We never treat a proof of payment as proof that money has cleared. Only verified payments count towards the group\'s available balance.',
      },
      {
        question: 'Can the auditor see everything?',
        answer:
          'Auditors get read-only access to approved records, reports, and the audit trail. They cannot create, edit or approve transactions. This keeps the audit function independent while giving them everything they need to do their job.',
      },
      {
        question: 'How do I invite members?',
        answer:
          'Generate an invite in the stokvel detail page. Share the link by email or WhatsApp. Your invitee signs up, accepts the invite and the group rules electronically, and appears on your member list.',
      },
      {
        question: 'Which banks can I import statements from?',
        answer:
          'FNB, Standard Bank, Capitec, Nedbank and Absa. If your bank exports a standard CSV with date, description and amount columns, it will work too.',
      },
      {
        question: 'Can I run more than one stokvel?',
        answer:
          'Yes, on Medium and above. A single account can belong to multiple stokvels with separate members, ledgers, rules and reports — and you can hold a different role in each one. Use the stokvel selector at the top of every page to switch context.',
      },
      {
        question: 'What happens if a member stops paying?',
        answer:
          'Configure penalty rules in the Constitution tab. Late fees, missed thresholds and auto-suspension apply automatically and are logged for transparency. The treasurer sees outstanding contributions across the group, aged by days late.',
      },
      {
        question: 'Do you integrate with payment providers?',
        answer:
          'We support bank EFT recording and bank statement import today. Direct debit-order, card and instant-EFT collection is available for eligible groups through approved South African payment providers — subject to onboarding and provider requirements. Contact us to discuss what fits your group.',
      },
    ],
  },

  cta: {
    headline: 'Ready to modernise your stokvel?',
    subheadline:
      'Free to start. No card required. Bring your whole group onto the same page today.',
    primaryCta: { label: 'Create your stokvel', href: '/signup' },
    secondaryCta: { label: 'View pricing', href: '/pricing' },
  },

  footer: {
    tagline:
      'The modern home for South African stokvels. Track contributions, run payouts, and keep every rand transparent.',
    columns: [
      {
        heading: 'Product',
        links: [
          { label: 'Features', href: '/features' },
          { label: 'Reports', href: '/features/reports' },
          { label: 'Roles', href: '/roles' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'SaaS', href: '/saas' },
        ],
      },
      {
        heading: 'Trust',
        links: [
          { label: 'Security', href: '/features/security' },
          { label: 'POPIA', href: '/popia' },
          { label: 'About', href: '/about' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
          { label: 'POPIA', href: '/popia' },
        ],
      },
    ],
    copyright: `© ${new Date().getFullYear()} Stokvel Manager. All rights reserved.`,
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
}

export async function getLandingContent(): Promise<LandingContent> {
  return CONTENT
}