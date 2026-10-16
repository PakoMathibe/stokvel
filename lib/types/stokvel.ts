// lib/types/stokvel.ts

export type StokvelType =
  | 'rotational'
  | 'grocery'
  | 'burial'
  | 'investment'
  | 'savings'
  | 'social'

export type ContributionFrequency =
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'annually'

export type StokvelStatus = 'active' | 'archived' | 'closed'

export type InviteChannel = 'link' | 'email' | 'whatsapp'

export type MemberRole =
  | 'chairperson'
  | 'treasurer'
  | 'secretary'
  | 'member'
  | 'auditor'

export type MemberStatus = 'pending' | 'active' | 'suspended' | 'resigned'

export type Stokvel = {
  id: string
  name: string
  description: string | null
  constitution_url: string | null
  stokvel_type: StokvelType
  contribution_amount: number
  contribution_frequency: ContributionFrequency
  currency: string
  target_members: number | null
  nasasa_registration: string | null
  status: StokvelStatus
  created_by: string
  allow_member_invites: boolean
  default_invite_channel: InviteChannel
  created_at: string
  updated_at: string
}

export type Membership = {
  id: string
  stokvel_id: string
  user_id: string
  role: MemberRole
  member_number: string | null
  status: MemberStatus
  joined_at: string
  exited_at: string | null
  invited_by: string | null
}

export type MembershipWithProfile = Membership & {
  profile: {
    id: string
    full_name: string | null
    email: string
    phone: string | null
    avatar_url: string | null
  } | null
}

export type StokvelWithMembership = Stokvel & {
  membership: Membership
  member_count?: number
}

export type StokvelDetail = Stokvel & {
  membership: Membership
  members: MembershipWithProfile[]
}

// =====================================================================
// HUMAN-READABLE LABELS
// =====================================================================

export const STOKVEL_TYPE_LABELS: Record<StokvelType, string> = {
  rotational: 'Rotational',
  grocery: 'Grocery',
  burial: 'Burial Society',
  investment: 'Investment',
  savings: 'Savings Club',
  social: 'Family & Social',
}

export const FREQUENCY_LABELS: Record<ContributionFrequency, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  annually: 'Annually',
}

export const ROLE_LABELS: Record<MemberRole, string> = {
  chairperson: 'Chairperson',
  treasurer: 'Treasurer',
  secretary: 'Secretary',
  member: 'Member',
  auditor: 'Auditor',
}

export const STATUS_LABELS: Record<MemberStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  suspended: 'Suspended',
  resigned: 'Resigned',
}

export const INVITE_CHANNEL_LABELS: Record<InviteChannel, string> = {
  link: 'Copy link',
  email: 'Send by email',
  whatsapp: 'Send on WhatsApp',
}

export const STOKVEL_STATUS_LABELS: Record<StokvelStatus, string> = {
  active: 'Active',
  archived: 'Archived',
  closed: 'Closed',
}