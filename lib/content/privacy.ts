import type { MarketingPage } from './types';

export async function getPrivacyContent(): Promise<MarketingPage> {
  return {
    slug: 'privacy',
    header: {
      eyebrow: 'Legal',
      headline: 'Privacy Policy',
      subheadline:
        'How we handle personal information on the Stokvel Manager platform.',
    },
    blocks: [
      {
        kind: 'p',
        text: 'This policy describes how Stokvel Manager ("we", "us") collects, uses and protects personal information when you use the platform. It is written to align with the Protection of Personal Information Act, 2013 (POPIA).',
      },
      { kind: 'h2', text: '1. Who we are' },
      {
        kind: 'p',
        text: 'Stokvel Manager is the responsible party for personal information processed on the platform. Questions about this policy or about your personal information can be sent to privacy@stokvelmanager.co.za.',
      },
      { kind: 'h2', text: '2. What we collect' },
      {
        kind: 'ul',
        items: [
          'Identity and contact information: name, email, phone number, member number.',
          'Group information: which stokvels you belong to, your role, your join date.',
          'Financial records: contributions, payouts, penalties, and related transaction metadata recorded by your group.',
          'Documents you upload: proof of payment, application forms, signed agreements.',
          'Technical information: IP address, browser, device, session metadata, audit logs.',
        ],
      },
      { kind: 'h2', text: '3. Why we collect it' },
      {
        kind: 'ul',
        items: [
          'To deliver the service: track contributions, run payouts, produce reports, keep audit trails.',
          'To secure the platform: detect fraud, prevent unauthorised access, investigate incidents.',
          'To comply with legal obligations: retention of financial records, response to lawful requests.',
          'To improve the platform: aggregated, de-identified analytics.',
        ],
      },
      { kind: 'h2', text: '4. Sharing' },
      {
        kind: 'p',
        text: 'We do not sell personal information. We do not share it with third parties for marketing. We share it only with:',
      },
      {
        kind: 'ul',
        items: [
          'Members of your own stokvel, to the extent their role permits.',
          'Service providers (hosting, email, SMS) that process information on our behalf, under written agreements.',
          'Regulators or law enforcement, where legally required.',
        ],
      },
      { kind: 'h2', text: '5. Security' },
      {
        kind: 'ul',
        items: [
          'Encryption in transit (TLS) and appropriate protections at rest.',
          'Role-based access control and least-privilege permissions.',
          'Multi-factor authentication available to all committee members.',
          'Immutable audit records.',
          'Regular encrypted backups and tested recovery procedures.',
          'Incident response with defined notification procedures.',
        ],
      },
      { kind: 'h2', text: '6. Retention' },
      {
        kind: 'p',
        text: 'We retain personal information only for as long as needed to provide the service, to keep records your group needs, or to comply with legal requirements. When retention ends, information is deleted or de-identified.',
      },
      { kind: 'h2', text: '7. Your rights' },
      {
        kind: 'p',
        text: 'Under POPIA you have the right to:',
      },
      {
        kind: 'ul',
        items: [
          'Request access to the personal information we hold about you.',
          'Request correction of information that is inaccurate, irrelevant, excessive, or out of date.',
          'Request deletion of information we no longer have a lawful basis to keep.',
          'Object to processing in certain circumstances.',
          'Lodge a complaint with the Information Regulator.',
        ],
      },
      { kind: 'h2', text: '8. Changes' },
      {
        kind: 'p',
        text: 'We may update this policy from time to time. Material changes will be communicated to the email address on your account or through the platform.',
      },
      { kind: 'h2', text: '9. Information Regulator' },
      {
        kind: 'p',
        text: 'If you are not satisfied with how we have handled your personal information, you may lodge a complaint with the Information Regulator of South Africa.',
      },
    ],
    cta: { label: 'Contact us', href: '/contact' },
  };
}
