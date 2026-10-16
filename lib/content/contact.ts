import type { MarketingPage } from './types';

export async function getContactContent(): Promise<MarketingPage> {
  return {
    slug: 'contact',
    header: {
      eyebrow: 'Contact',
      headline: 'Talk to us.',
      subheadline:
        'Questions about pricing, security, POPIA, or the platform? We answer email within one business day.',
    },
    blocks: [],
  };
}
