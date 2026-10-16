import type { MarketingPage } from './types';

export async function getSaasContent(): Promise<MarketingPage> {
  return {
    slug: 'saas',
    header: {
      eyebrow: 'For growing groups',
      headline: 'One account. Many stokvels.',
      subheadline:
        'If you help run more than one group — as a treasurer, an administrator, or an organisation — the platform is built for that.',
    },
    blocks: [
      { kind: 'h2', text: 'Multi-stokvel management' },
      {
        kind: 'p',
        text: 'One account, many groups. Each stokvel has its own members, ledger, rules and reports — but you see them all from a single dashboard and switch context without logging out.',
      },
      {
        kind: 'ul',
        items: [
          'Separate member rosters per stokvel',
          'Separate ledgers and financial reports',
          'Separate rules, contribution amounts and payout structures',
          'Different roles in different stokvels',
          'A combined view for administrators',
        ],
      },
      { kind: 'h2', text: 'Subscription billing' },
      {
        kind: 'ul',
        items: [
          'Free, Basic, Medium and Large plans',
          'Monthly or annual billing',
          'Invoices and receipts for the group',
          'Feature limits that scale with your plan',
          'Account renewal and upgrade prompts',
        ],
      },
      { kind: 'h2', text: 'Digital onboarding' },
      {
        kind: 'ul',
        items: [
          'Online registration and invitation links',
          'Member verification steps',
          'Electronic acceptance of group rules',
          'Digital membership application forms',
          'Consent capture for privacy terms',
        ],
      },
      { kind: 'h2', text: 'QR codes' },
      {
        kind: 'ul',
        items: [
          'Member identification at meetings',
          'Meeting attendance check-in',
          'Payment-reference assistance',
          'Quick access to group documents',
        ],
      },
      { kind: 'h2', text: 'Smart financial insights' },
      {
        kind: 'ul',
        items: [
          'Missed-payment patterns across members',
          'Forecasting of contribution shortfalls',
          'Flagging of unusual transactions',
          'Reconciliation difference detection',
        ],
      },
      { kind: 'h2', text: 'Localisation' },
      {
        kind: 'ul',
        items: [
          'Mobile-first interface',
          'Low-data usage',
          'Accessible design',
          'Support for English and relevant South African languages',
        ],
      },
      { kind: 'h2', text: 'Fraud prevention' },
      {
        kind: 'ul',
        items: [
          'Dual authorisation for sensitive actions',
          'Transaction limits by role',
          'Unusual activity alerts',
          'Separation of duties between approval and execution',
        ],
      },
      { kind: 'h2', text: 'Integration API' },
      {
        kind: 'ul',
        items: [
          'Connect approved South African payment providers',
          'Messaging services (WhatsApp, SMS)',
          'Accounting tools',
          'Custom integrations on request',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Payment provider integrations',
        body: 'Direct debit-order, card and instant-EFT collection is available for eligible groups through approved South African payment providers — subject to onboarding and provider requirements. Contact us to discuss.',
      },
    ],
    cta: { label: 'See pricing', href: '/pricing' },
  };
}
