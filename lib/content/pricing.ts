import type { EnterpriseTier, PricingTier, SectionHeader } from './types';

export type PricingContent = {
  header: SectionHeader;
  intro: string;
  tiers: PricingTier[];
  enterprise: EnterpriseTier;
  footnote: string;
  faq: { question: string; answer: string }[];
};

export async function getPricingContent(): Promise<PricingContent> {
  return {
    header: {
      eyebrow: 'Pricing',
      headline: 'Simple pricing, built for South African groups.',
      subheadline:
        'Start free. Upgrade when your group grows. Cancel any time — no lock-in, no hidden fees.',
    },
    intro:
      'All prices in South African Rand. VAT may apply. The Free tier is genuinely free — no trial, no card required.',
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
    faq: [
      {
        question: 'Is the Free tier really free?',
        answer:
          'Yes. Free forever, no card required, no trial period. You get a single stokvel for up to 10 members with member management, contribution tracking, statements and POPIA-aligned data handling.',
      },
      {
        question: 'What happens when my group grows past a tier limit?',
        answer:
          'You can upgrade at any time. Your data stays intact and nothing is lost. We do not lock you out — we prompt you to upgrade when you approach a limit.',
      },
      {
        question: 'Can I downgrade or cancel?',
        answer:
          'Yes. Cancel any time. Downgrade to a lower tier if you no longer need the higher-tier features. Your data remains accessible on the lower tier subject to its limits.',
      },
      {
        question: 'Do you offer discounts for annual payment?',
        answer:
          'Yes — annual payment carries a discount. Contact us for a quote, or select annual billing at signup.',
      },
      {
        question: 'What does white-label include?',
        answer:
          'Your logo, your domain, your colour scheme, and a login experience that looks like your own product. Available on Enterprise from R2,500/month depending on scale and support requirements.',
      },
      {
        question: 'Does the platform hold our money?',
        answer:
          'No. The platform is a records and governance tool. Your group keeps its own bank account and your treasurer records payments into the platform. We never hold, receive or transfer member funds.',
      },
    ],
  };
}
