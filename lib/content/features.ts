import type { Pillar, SectionHeader } from './types';

export type FeaturesIndexContent = {
  header: SectionHeader;
  pillars: Pillar[];
};

export const PILLARS: Pillar[] = [
  {
    slug: 'member-management',
    icon: 'users',
    title: 'Member management',
    tagline: 'Every member, every role, every record.',
    summary:
      'Register members, capture contact and beneficiary details, assign roles, and keep a complete membership history.',
    bullets: [
      'Member profiles with contact and emergency contacts',
      'Member numbers, roles and status (active, suspended, resigned)',
      'Beneficiaries and next of kin',
      'Membership application document uploads',
      'Join dates, exits and settlements per the constitution',
      'Digital acceptance of group rules',
    ],
    detail: [
      { kind: 'h2', text: 'Built for the way stokvels actually grow' },
      {
        kind: 'p',
        text: 'A stokvel rarely has a neat roster. Members join mid-cycle. Others pause. Some bring a spouse or a child in. The member register has to reflect all of that without losing the thread.',
      },
      {
        kind: 'ul',
        items: [
          'Invite members by email or WhatsApp — no spreadsheet export required.',
          'Assign a role (chairperson, treasurer, secretary, member) with the permissions that role needs.',
          'Track status changes with dates and reasons, so the group can see how the roster evolved.',
          'Store membership application forms and signed agreements against the member record.',
          'Record beneficiaries and next of kin so claims and payouts go to the right person.',
          'On exit, calculate settlement per the constitution — transparent, traceable, and signed off.',
        ],
      },
    ],
  },
  {
    slug: 'contributions',
    icon: 'wallet',
    title: 'Contributions & savings',
    tagline: 'Track every rand, chase every arrears.',
    summary:
      'Configure contributions, record payments, chase arrears, generate receipts, and send reminders automatically.',
    bullets: [
      'Monthly, weekly or custom contribution schedules',
      'Different amounts per member where the constitution allows',
      'Outstanding balances and arrears aging',
      'Once-off and additional contributions',
      'Payment receipts and contribution history',
      'Automatic reminders via WhatsApp, SMS or email',
    ],
    detail: [
      {
        kind: 'h2',
        text: 'A payment is not a contribution until it has cleared',
      },
      {
        kind: 'p',
        text: 'The single most common failure in stokvel admin is treating a proof of payment as settled. It is not. Our contribution engine separates what is due from what has been received, and from what has actually cleared.',
      },
      {
        kind: 'ul',
        items: [
          'Generate contribution obligations for the period.',
          'Record payments as they are reported, with proof attached.',
          'Verify payments against bank statement imports or payment-provider data.',
          'Apply penalties automatically if the constitution requires them.',
          'Show the treasurer exactly who is behind, by how much, and for how long.',
          'Produce receipts and statements for every member.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Arrears ageing',
        body: 'Outstanding contributions are aged by days late so the treasurer can see at a glance who is a few days behind and who has been silent for months.',
      },
    ],
  },
  {
    slug: 'financial-management',
    icon: 'chart',
    title: 'Financial management',
    tagline: 'A ledger that reflects reality, not hope.',
    summary:
      'Record income and expenses, categorise them, reconcile against the bank, and export clean reports.',
    bullets: [
      'Income and expenditure recording',
      'Bank balance and cash holdings',
      'Categories for income and expenses',
      'Bank charges, penalties and interest',
      'Bank statement reconciliation',
      'Export to PDF, Excel or CSV',
    ],
    detail: [
      { kind: 'h2', text: 'Reconciliation is not optional' },
      {
        kind: 'p',
        text: 'A ledger that has never been reconciled against the bank is a story, not a record. Our financial management module is built around the reconciliation step — you import your statement, match lines against recorded transactions, and only then do the numbers become trustworthy.',
      },
      {
        kind: 'ul',
        items: [
          'Record every rand that comes in and goes out, with a category.',
          'Import a CSV from FNB, Standard Bank, Capitec, Nedbank or Absa.',
          'Match statement lines to recorded transactions automatically where possible.',
          'Flag unreconciled items for the treasurer to investigate.',
          'Lock completed financial periods so they cannot be silently changed.',
          'Correct mistakes through traceable adjustments, never by editing history.',
        ],
      },
    ],
  },
  {
    slug: 'payouts',
    icon: 'layers',
    title: 'Payout management',
    tagline: 'Rotations, approvals, proof, history.',
    summary:
      'Configure payout rules, calculate entitlements, run approvals, and record proof of payment.',
    bullets: [
      'Payout schedules and rotation order',
      'Member payout entitlements',
      'Calculations per group rules',
      'Pending, approved and completed payouts',
      'Approval workflow before funds are released',
      'Payment references and proof of payment',
    ],
    detail: [
      { kind: 'h2', text: 'Payouts are where trust is won or lost' },
      {
        kind: 'p',
        text: 'Rotational stokvels live or die on whose turn it is. The system makes the order visible to everyone, advances automatically on payout, and preserves a full record of who proposed, who approved, and who executed each payout.',
      },
      {
        kind: 'ul',
        items: [
          'Configure the rotation order once; the system tracks it.',
          'Calculate entitlement per the group rules, including penalties and interest.',
          'Require approval — optionally dual authorisation — before releasing funds.',
          'Record proof of payment and the reference number.',
          'Notify members before and after each payout.',
          'Keep a permanent payout history for auditors.',
        ],
      },
    ],
  },
  {
    slug: 'reports',
    icon: 'file',
    title: 'Reports & analytics',
    tagline: 'Ten reports. Four money states. No ambiguity.',
    summary:
      'Reports designed for the way stokvels present numbers at meetings, at month-end, and at cycle end.',
    bullets: [
      'Monthly and annual income & expenditure',
      'Contributions due versus collected',
      'Member arrears and payment history',
      'Payout schedules and reconciliation',
      'Bank reconciliation and cash position',
      'Expenses by category, group savings growth',
      'Investment performance where applicable',
      'Member statements and transaction ledgers',
      'Audit trail and exception reports',
    ],
    detail: [
      { kind: 'h2', text: 'The four money states' },
      {
        kind: 'p',
        text: 'Every report distinguishes between money recorded, money verified, money available, and money owed. Those four figures are not the same, and collapsing them into one "balance" is how stokvels get into arguments.',
      },
      {
        kind: 'ul',
        items: [
          'Money recorded — captured in the system, not yet confirmed by the bank.',
          'Money verified — matched against bank or trusted provider data.',
          'Money available — cleared funds after pending obligations.',
          'Money owed — contributions due but not received, aged by days late.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'Never treat a proof of payment as proof of funds',
        body: 'A payment reference or an uploaded PoP is not proof that money has cleared. Payments are marked confirmed only after verification against trusted data.',
      },
    ],
  },
  {
    slug: 'governance',
    icon: 'gavel',
    title: 'Meetings & governance',
    tagline: 'Good governance, made easy.',
    summary:
      'Schedule meetings, record attendance, store minutes, run votes, and keep a digital constitution.',
    bullets: [
      'Meeting invitations and attendance records',
      'Agendas and minutes storage',
      'Resolutions and committee decisions',
      'Member polls and formal votes',
      'Quorum and voting thresholds',
      'History of changes to contribution amounts and rules',
      'Conflicts, complaints and disputes',
      'Consent and acceptance of updated terms',
    ],
    detail: [
      { kind: 'h2', text: 'Governance is not paperwork — it is protection' },
      {
        kind: 'p',
        text: 'A stokvel that governs itself well survives disagreements. One that does not, does not. The governance module gives the committee the tools to run meetings, take decisions, and preserve the record of why those decisions were taken.',
      },
      {
        kind: 'ul',
        items: [
          'Schedule meetings and send invitations by email or WhatsApp.',
          'Record attendance, apologies, and quorum.',
          'Store the agenda and the signed minutes against the meeting.',
          'Run polls and formal votes with configurable thresholds.',
          'Preserve who proposed, who approved, and who executed every financial decision.',
          'Log complaints, disputes and their resolutions.',
          'Maintain a digital constitution with version history and member acceptance.',
        ],
      },
    ],
  },
  {
    slug: 'payments',
    icon: 'bell',
    title: 'Payments & notifications',
    tagline: 'Record money accurately. Notify people reliably.',
    summary:
      'Record EFT deposits, import bank statements, reconcile manually, and notify members through the channels they already use.',
    bullets: [
      'EFT deposit recording with payment references',
      'Bank statement import and manual reconciliation',
      'Optional integration with South African payment providers',
      'WhatsApp, SMS and email notifications',
      'Automated alerts for the treasurer',
      'Due-date reminders, confirmations, and overdue notices',
    ],
    detail: [
      { kind: 'h2', text: 'Recording money without holding it' },
      {
        kind: 'p',
        text: "The platform does not hold member funds. It records payments against your group's own bank account, and helps you reconcile what was recorded against what actually cleared. This keeps your group in control and keeps us out of regulated financial-services territory we are not authorised for.",
      },
      {
        kind: 'ul',
        items: [
          'Record EFT deposits with the payment reference for traceability.',
          'Import bank statements and match lines to contributions automatically.',
          'Mark payments as verified only after trusted data confirms them.',
          'Notify the treasurer about missed contributions, unusual transactions, pending approvals and reconciliation differences.',
          'Send members due-date reminders, payment confirmations, meeting notices, payout updates and overdue notices.',
        ],
      },
      {
        kind: 'callout',
        tone: 'info',
        title: 'Payment provider integrations',
        body: 'Direct debit-order, card and instant-EFT collection is available for eligible groups through approved South African payment providers — subject to onboarding and provider requirements. Contact us to discuss what fits your group.',
      },
    ],
  },
  {
    slug: 'security',
    icon: 'shield',
    title: 'Security, privacy & compliance',
    tagline: 'Financial records deserve better than a WordPress plugin.',
    summary:
      'Role-based access, multi-factor authentication, encryption, immutable audit records, and tested backups.',
    bullets: [
      'Role-based access control and least-privilege permissions',
      'Multi-factor authentication for committee members',
      'Encryption in transit and appropriate protection at rest',
      'Secure password hashing and account recovery',
      'Automatic session expiry and login alerts',
      'Immutable or tamper-evident audit records',
      'Regular backups and tested recovery procedures',
      'Fraud and duplicate-payment detection',
      'Member consent and privacy controls',
      'Data retention and deletion policies',
      'Secure document storage',
      'Incident response and access revocation',
    ],
    detail: [
      { kind: 'h2', text: 'Security controls in detail' },
      {
        kind: 'ul',
        items: [
          'Access — role-based access control enforced on every request; least-privilege permissions by default.',
          'Identity — multi-factor authentication available to all committee members; enforced for administrators.',
          'Session — automatic session expiry and login alerts for unusual activity.',
          'Confidentiality — encryption in transit; sensitive fields protected at rest.',
          'Passwords — secure hashing and controlled account recovery.',
          'Integrity — immutable, tamper-evident audit records; corrections via reversing adjustments.',
          'Detection — fraud and duplicate-payment detection; unusual-activity alerts.',
          'Availability — regular encrypted backups; tested recovery procedures.',
          'Compliance — POPIA-aligned data handling; consent controls; retention and deletion policies.',
          'Response — incident response runbook and access revocation on exit or role change.',
        ],
      },
      {
        kind: 'callout',
        tone: 'warn',
        title: 'What the platform does not do',
        body: 'The platform records money. It does not hold, receive, or transfer member funds. It does not provide regulated financial products, and it is not an authorised financial services provider. Groups remain responsible for their own regulatory obligations, including any obligations triggered by their specific activities.',
      },
    ],
  },
];

export async function getFeaturesIndex(): Promise<FeaturesIndexContent> {
  return {
    header: {
      eyebrow: 'Features',
      headline: 'Everything a stokvel needs, in one place.',
      subheadline:
        'Nine modules covering the full lifecycle of a savings group — from onboarding to payout to audit.',
    },
    pillars: PILLARS,
  };
}

export async function getFeatureBySlug(slug: string): Promise<Pillar | null> {
  return PILLARS.find((p) => p.slug === slug) ?? null;
}
