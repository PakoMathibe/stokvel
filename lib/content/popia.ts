import type { MarketingPage } from './types';

export async function getPopiaContent(): Promise<MarketingPage> {
  return {
    slug: 'popia',
    header: {
      eyebrow: 'Compliance',
      headline: 'POPIA & data protection statement',
      subheadline:
        'What the platform does, what your group must still do, and where the boundary sits.',
    },
    blocks: [
      { kind: 'h2', text: 'Our commitment' },
      {
        kind: 'p',
        text: 'The platform is designed for POPIA-aligned data handling. We process personal information lawfully, for a specific and limited purpose, and we do not sell or share it with third parties for marketing.',
      },
      {
        kind: 'ul',
        items: [
          'Lawful basis: we process personal information to deliver the service your group has asked us to provide.',
          'Purpose limitation: personal information is used only for the purposes for which it was collected.',
          'Minimality: we collect only what the service needs.',
          'Access controls: role-based access and least privilege on every request.',
          'Security: encryption in transit, secure password hashing, and appropriate protections at rest.',
          'Retention: data retained only as long as needed, then deleted or de-identified.',
          'Consent: members accept the group rules and privacy terms electronically.',
          'Rights: members can request access, correction or deletion of their personal information.',
        ],
      },
      { kind: 'h2', text: 'What the platform does not do' },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'We record money. We do not hold it.',
        body: 'The platform does not hold, receive, or transfer member funds. It does not provide regulated financial products, and it is not an authorised financial services provider. Your group keeps its own bank account.',
      },
      {
        kind: 'p',
        text: "Managing records does not grant permission to hold members' money or to provide regulated financial products. Our design keeps that boundary explicit.",
      },
      { kind: 'h2', text: 'What your group must do' },
      {
        kind: 'p',
        text: 'POPIA compliance is a shared responsibility. The platform gives you the tooling; the group is the responsible party for its own data.',
      },
      {
        kind: 'ul',
        items: [
          'Have a lawful basis for processing member personal information.',
          'Inform members how their information is used and for how long it is kept.',
          'Register with NASASA if your group operates as a stokvel and you wish to formalise its standing.',
          'Assess whether your specific activities trigger obligations under legislation governing financial services, deposits, credit, payment processing or insurance benefits — for example, if you take deposits, extend credit, or offer funeral benefits at scale.',
          "Appoint an information officer if your group's processing meets the threshold.",
          'Keep the constitution and member agreements up to date.',
        ],
      },
      { kind: 'h2', text: 'Regulatory boundary' },
      {
        kind: 'p',
        text: "Different stokvels do very different things. A rotational savings group, a burial society offering funeral benefits, a grocery stokvel, and an investment club do not all fall under the same regulatory regime. The platform is designed to record and govern — it is not a substitute for legal advice on your group's specific obligations.",
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Need guidance?',
        body: "If you are unsure whether your group's activities trigger specific regulatory obligations, we recommend seeking advice from a qualified professional or from the relevant regulator.",
      },
    ],
    cta: { label: 'Read our security controls', href: '/features/security' },
  };
}
