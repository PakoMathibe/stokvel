import type { MarketingPage } from './types';

export async function getAboutContent(): Promise<MarketingPage> {
  return {
    slug: 'about',
    header: {
      eyebrow: 'About',
      headline: 'Built in South Africa, for South African stokvels.',
      subheadline:
        'We started this because treasury work should not depend on a WhatsApp group and a bank statement PDF.',
    },
    blocks: [
      { kind: 'h2', text: 'Why we exist' },
      {
        kind: 'p',
        text: 'Roughly 11 million South Africans save through stokvels, contributing about R50 billion a year. The money is real. The governance is real. But the tools most groups use are not — a WhatsApp group, a personal bank account, a spiral notebook, and a lot of trust.',
      },
      {
        kind: 'p',
        text: "That works until it does not. Someone disputes a contribution. A treasurer has a family emergency and cannot reconcile for three months. A payout goes to the wrong person because the rotation list is in someone's head. The group survives, but it is fragile.",
      },
      { kind: 'h2', text: 'What we believe' },
      {
        kind: 'ul',
        items: [
          'Treasurers deserve tools as good as the ones corporate finance teams use.',
          'Money recorded, money verified, money available and money owed are four different things — and should be treated as such.',
          'A proof of payment is not proof that money has cleared.',
          'Governance is protection: meetings, minutes and resolutions keep groups together.',
          'A platform that records money should not hold it. The group keeps its own bank account.',
          'Data protection is not a feature. It is the price of entry.',
        ],
      },
      { kind: 'h2', text: 'How we build' },
      {
        kind: 'ul',
        items: [
          'Mobile-first, because most members use a phone.',
          'Low-data, because data costs money.',
          'Available in English, with more South African languages on the roadmap.',
          'POPIA-aligned from the start, not bolted on later.',
          'Honest about what we do and what we do not do.',
        ],
      },
      { kind: 'h2', text: 'Who we are' },
      {
        kind: 'p',
        text: 'We are a small team based in South Africa, working with treasurers, chairpersons and administrators from stokvels across the country. If you would like to be a design partner, we would love to hear from you.',
      },
    ],
    cta: { label: 'Get in touch', href: '/contact' },
  };
}
