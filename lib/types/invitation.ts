// lib/types/invitation.ts

import type { MemberRole, InviteChannel } from './stokvel'

export type { InviteChannel }

export type InvitationStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'revoked'

export type Invitation = {
  id: string
  stokvel_id: string
  email: string | null
  phone: string | null
  role: MemberRole
  token: string
  invited_by: string
  invite_channel: InviteChannel
  status: InvitationStatus
  expires_at: string
  accepted_at: string | null
  accepted_by: string | null
  declined_at: string | null
  message: string | null
  created_at: string
  updated_at: string
}

export type InvitationWithMeta = Invitation & {
  stokvel: {
    id: string
    name: string
    stokvel_type: string
  } | null
  inviter: {
    id: string
    full_name: string | null
    email: string
  } | null
  is_expired: boolean
}

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
  revoked: 'Revoked',
}