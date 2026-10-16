import type { PermissionRow, Role, SectionHeader } from './types';

export type RolesContent = {
  header: SectionHeader;
  intro: string;
  roles: Role[];
  matrix: PermissionRow[];
  note: string;
};

const ROLES: Role[] = [
  {
    key: 'chairperson',
    name: 'Chairperson',
    short: 'Runs the group, chairs meetings, approves decisions.',
    responsibilities: [
      'Manage the group and its settings',
      'Chair meetings and record resolutions',
      'Approve new members and payout requests',
      'Sign off on rule and contribution changes',
      'Resolve disputes in line with the constitution',
    ],
  },
  {
    key: 'treasurer',
    name: 'Treasurer',
    short: 'Owns the money records and reconciliation.',
    responsibilities: [
      'Record contributions and expenses',
      'Import bank statements and reconcile',
      'Record and reconcile payouts',
      'Monitor arrears and follow up',
      'Prepare financial reports for meetings',
    ],
  },
  {
    key: 'secretary',
    name: 'Secretary',
    short: 'Owns the paperwork and communication.',
    responsibilities: [
      'Manage minutes, notices and correspondence',
      'Process membership applications',
      'Maintain the document library',
      'Schedule meetings and record attendance',
      'Preserve the digital constitution and agreements',
    ],
  },
  {
    key: 'member',
    name: 'Member',
    short: "Sees their own position and the group's decisions.",
    responsibilities: [
      'View permitted financial records',
      'Make payments and upload proof',
      'Submit requests for corrections or disputes',
      'Access statements and receipts',
      'Vote in polls and formal resolutions',
    ],
  },
  {
    key: 'auditor',
    name: 'Auditor',
    short: 'Independent, read-only access to approved records.',
    responsibilities: [
      'Read-only access to approved financial records',
      'Access reports and the audit trail',
      'Review exceptions and reconciliation differences',
      'Cannot create, edit or approve transactions',
    ],
  },
  {
    key: 'admin',
    name: 'System administrator',
    short: 'Runs the platform, not the stokvel.',
    responsibilities: [
      'Manage platform settings and subscriptions',
      'Provide support and handle incidents',
      'Manage access revocation',
      'No access to member financial data beyond support scope',
    ],
  },
];

const MATRIX: PermissionRow[] = [
  {
    capability: 'View own financial position',
    chairperson: true,
    treasurer: true,
    secretary: true,
    member: true,
    auditor: 'read',
    admin: false,
  },
  {
    capability: 'View group financial records',
    chairperson: true,
    treasurer: true,
    secretary: 'read',
    member: 'read',
    auditor: 'read',
    admin: false,
  },
  {
    capability: 'Record contributions and payments',
    chairperson: false,
    treasurer: true,
    secretary: false,
    member: 'own',
    auditor: false,
    admin: false,
  },
  {
    capability: 'Import bank statements and reconcile',
    chairperson: false,
    treasurer: true,
    secretary: false,
    member: false,
    auditor: false,
    admin: false,
  },
  {
    capability: 'Approve payouts',
    chairperson: true,
    treasurer: false,
    secretary: false,
    member: false,
    auditor: false,
    admin: false,
  },
  {
    capability: 'Execute payouts',
    chairperson: false,
    treasurer: true,
    secretary: false,
    member: false,
    auditor: false,
    admin: false,
  },
  {
    capability: 'Manage members and roles',
    chairperson: true,
    treasurer: false,
    secretary: true,
    member: false,
    auditor: false,
    admin: false,
  },
  {
    capability: 'Manage meetings, minutes and notices',
    chairperson: true,
    treasurer: false,
    secretary: true,
    member: false,
    auditor: 'read',
    admin: false,
  },
  {
    capability: 'Edit group rules and constitution',
    chairperson: true,
    treasurer: false,
    secretary: true,
    member: false,
    auditor: false,
    admin: false,
  },
  {
    capability: 'Lock completed financial periods',
    chairperson: true,
    treasurer: true,
    secretary: false,
    member: false,
    auditor: false,
    admin: false,
  },
  {
    capability: 'View audit trail and exceptions',
    chairperson: true,
    treasurer: true,
    secretary: false,
    member: false,
    auditor: true,
    admin: false,
  },
  {
    capability: 'Manage subscriptions and settings',
    chairperson: false,
    treasurer: false,
    secretary: false,
    member: false,
    auditor: false,
    admin: true,
  },
];

export async function getRolesContent(): Promise<RolesContent> {
  return {
    header: {
      eyebrow: 'Roles & permissions',
      headline: 'Every seat at the table.',
      subheadline:
        'The chairperson, treasurer and secretary do different jobs. The system gives each exactly the access they need — and nothing more.',
    },
    intro:
      'Permissions are enforced at the platform level, not by convention. Auditors cannot accidentally approve a payout. Members cannot edit the ledger. Treasurers cannot change the constitution alone.',
    roles: ROLES,
    matrix: MATRIX,
    note: 'Legend: ✓ = full access · R = read-only · O = own records only · — = no access. Permissions can be combined — a member can also be the treasurer, in which case the higher role applies.',
  };
}
