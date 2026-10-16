import type { MarketingPage } from './types';

export async function getTermsContent(): Promise<MarketingPage> {
  return {
    slug: 'terms',
    header: {
      eyebrow: 'Legal',
      headline: 'Terms of Service',
      subheadline: 'The rules for using the Stokvel Manager platform.',
    },
    blocks: [
      {
        kind: 'p',
        text: 'These terms govern your use of the Stokvel Manager platform. By creating an account or using the platform, you agree to them. If you do not agree, please do not use the platform.',
      },
      { kind: 'h2', text: '1. What the platform is' },
      {
        kind: 'p',
        text: 'Stokvel Manager is a records, governance and reporting tool for savings groups. It helps you track members, contributions, payouts, meetings and financial reports.',
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'We do not hold your money',
        body: 'The platform does not hold, receive, or transfer member funds. It does not provide regulated financial products, and it is not an authorised financial services provider. Your group keeps its own bank account.',
      },
      { kind: 'h2', text: '2. Your responsibilities' },
      {
        kind: 'ul',
        items: [
          'Keep your login credentials secure, and use multi-factor authentication where available.',
          'Ensure that information you enter is accurate, and that you have a lawful basis to process member personal information.',
          'Comply with the law as it applies to your group, including NASASA registration, POPIA obligations, and any regulation triggered by your specific activities.',
          'Do not use the platform for fraud, money laundering, or any unlawful purpose.',
        ],
      },
      { kind: 'h2', text: '3. Our responsibilities' },
      {
        kind: 'ul',
        items: [
          'Provide the platform with reasonable skill and care.',
          'Protect the security and confidentiality of your data in line with our Privacy Policy and POPIA.',
          'Give you reasonable notice of material changes to the platform or these terms.',
          'Provide support through the channels listed on our Contact page.',
        ],
      },
      { kind: 'h2', text: '4. Subscriptions and payment' },
      {
        kind: 'ul',
        items: [
          'Paid plans are billed monthly or annually in advance.',
          'You can cancel at any time; cancellation takes effect at the end of the current billing period.',
          'Fees are in South African Rand. VAT may apply.',
          'We may change pricing with reasonable notice.',
        ],
      },
      { kind: 'h2', text: '5. Data ownership' },
      {
        kind: 'p',
        text: 'Your data belongs to you and to your group. We hold it on your behalf. You can export your data at any time, and we will return or delete it on request in line with our retention policy.',
      },
      { kind: 'h2', text: '6. Availability' },
      {
        kind: 'p',
        text: 'We aim for high availability but do not guarantee uninterrupted service. Scheduled maintenance and unforeseen incidents may cause temporary disruption. Enterprise plans may include a service-level agreement.',
      },
      { kind: 'h2', text: '7. Limitation of liability' },
      {
        kind: 'p',
        text: 'To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential losses arising from your use of the platform. Nothing in these terms excludes liability that cannot be excluded under South African law.',
      },
      { kind: 'h2', text: '8. Termination' },
      {
        kind: 'p',
        text: 'You may close your account at any time. We may suspend or terminate accounts that violate these terms, misuse the platform, or pose a security risk. On termination, your data is handled in line with our retention policy.',
      },
      { kind: 'h2', text: '9. Governing law' },
      {
        kind: 'p',
        text: 'These terms are governed by the laws of the Republic of South Africa. Disputes are subject to the jurisdiction of the South African courts.',
      },
      { kind: 'h2', text: '10. Contact' },
      {
        kind: 'p',
        text: 'Questions about these terms can be sent to legal@stokvelmanager.co.za.',
      },
    ],
    cta: { label: 'Contact us', href: '/contact' },
  };
}
