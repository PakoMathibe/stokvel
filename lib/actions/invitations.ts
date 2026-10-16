// lib/actions/invitations.ts
'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import type {
  Invitation,
  InvitationWithMeta,
  InviteChannel,
} from '@/lib/types/invitation'
import type { MemberRole } from '@/lib/types/stokvel'

// =====================================================================
// RESULT TYPE
// =====================================================================
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// =====================================================================
// HELPERS
// =====================================================================

function generateToken(): string {
  // 32-char URL-safe random token
  const bytes = new Uint8Array(24)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizePhone(phone: string): string {
  // Strip spaces and non-digits, keep leading +
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (cleaned.startsWith('0')) {
    return '+27' + cleaned.slice(1)
  }
  if (!cleaned.startsWith('+')) {
    return '+' + cleaned
  }
  return cleaned
}

// =====================================================================
// STUB: Send invitation email via Supabase
// =====================================================================
// NOTE: Real delivery uses Supabase Auth's built-in email, which is
// rate-limited. This function creates the invite record in the DB and
// logs the intent. When Phase 6 lands, swap the body for a call to
// supabase.auth.admin.inviteUserByEmail() using the service role key.
// =====================================================================
async function deliverInvitationByEmail(
  email: string,
  stokvelName: string,
  inviterName: string,
  inviteUrl: string
): Promise<{ delivered: boolean; error?: string }> {
  try {
    // STUB — replace with real delivery in Phase 6
    console.log(
      `[invite:email] would send to ${email} | stokvel=${stokvelName} | from=${inviterName} | url=${inviteUrl}`
    )
    return { delivered: true }
  } catch (err) {
    console.error('[invite:email] failed', err)
    return { delivered: false, error: 'Email delivery failed.' }
  }
}

// =====================================================================
// READ: Get invitations for a stokvel
// =====================================================================
export async function getInvitationsForStokvel(
  stokvelId: string
): Promise<InvitationWithMeta[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('invitations')
    .select(
      `
      *,
      stokvel:stokvels(id, name, stokvel_type),
      inviter:profiles!invitations_invited_by_fkey(id, full_name, email)
    `
    )
    .eq('stokvel_id', stokvelId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  const now = Date.now()

  return data.map((row: any) => ({
    ...row,
    is_expired:
      row.status === 'pending' &&
      new Date(row.expires_at).getTime() < now,
  }))
}

// =====================================================================
// READ: Get invitation by token (for public accept page)
// =====================================================================
export async function getInvitationByToken(
  token: string
): Promise<InvitationWithMeta | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('invitations')
    .select(
      `
      *,
      stokvel:stokvels(id, name, stokvel_type),
      inviter:profiles!invitations_invited_by_fkey(id, full_name, email)
    `
    )
    .eq('token', token)
    .maybeSingle()

  if (error || !data) return null

  const now = Date.now()
  return {
    ...(data as any),
    is_expired:
      data.status === 'pending' &&
      new Date(data.expires_at).getTime() < now,
  }
}

// =====================================================================
// CREATE: Invite a member
// =====================================================================
export async function createInvitationAction(
  stokvelId: string,
  formData: FormData
): Promise<ActionResult<{ inviteUrl: string; channel: InviteChannel; whatsappUrl?: string }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }

  // Permission check: committee OR stokvel allows member invites
  const { data: membership } = await supabase
    .from('memberships')
    .select('role, stokvel:stokvels(allow_member_invites, name)')
    .eq('stokvel_id', stokvelId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership) {
    return { success: false, error: 'You are not a member of this stokvel.' }
  }

  const stokvel = membership.stokvel as any
  const isCommittee = ['chairperson', 'secretary'].includes(membership.role)
  const memberInvitesAllowed = stokvel?.allow_member_invites === true

  if (!isCommittee && !memberInvitesAllowed) {
    return {
      success: false,
      error:
        'Only the chairperson or secretary can invite members. Ask them to enable member invites in settings.',
    }
  }

  // Extract fields
  const channel = String(formData.get('channel') ?? 'link') as InviteChannel
  if (!['link', 'email', 'whatsapp'].includes(channel)) {
    return { success: false, error: 'Invalid invite channel.' }
  }

  const role = String(formData.get('role') ?? 'member') as MemberRole
  const validRoles: MemberRole[] = [
    'chairperson',
    'treasurer',
    'secretary',
    'member',
    'auditor',
  ]
  if (!validRoles.includes(role)) {
    return { success: false, error: 'Invalid role.' }
  }

  // Non-committee members can only invite as 'member'
  if (!isCommittee && role !== 'member') {
    return {
      success: false,
      error: 'Only committee members can assign elevated roles.',
    }
  }

  const emailRaw = String(formData.get('email') ?? '').trim()
  const phoneRaw = String(formData.get('phone') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim() || null

  let email: string | null = null
  let phone: string | null = null

  if (channel === 'email') {
    if (!emailRaw || !isValidEmail(emailRaw)) {
      return { success: false, error: 'Please enter a valid email address.' }
    }
    email = emailRaw.toLowerCase()
  } else if (channel === 'whatsapp') {
    if (!phoneRaw) {
      return { success: false, error: 'Please enter a WhatsApp number.' }
    }
    phone = normalizePhone(phoneRaw)
    if (phone.length < 11) {
      return {
        success: false,
        error: 'Please enter a valid phone number with country code.',
      }
    }
  } else {
    // link channel — optional email for record-keeping
    if (emailRaw) {
      if (!isValidEmail(emailRaw)) {
        return { success: false, error: 'Please enter a valid email.' }
      }
      email = emailRaw.toLowerCase()
    }
  }

  // Revoke any existing pending invite for same email/phone
  if (email) {
    await supabase
      .from('invitations')
      .update({ status: 'revoked' })
      .eq('stokvel_id', stokvelId)
      .eq('status', 'pending')
      .ilike('email', email)
  }
  if (phone) {
    await supabase
      .from('invitations')
      .update({ status: 'revoked' })
      .eq('stokvel_id', stokvelId)
      .eq('status', 'pending')
      .eq('phone', phone)
  }

  // Create the invitation
  const token = generateToken()
  const { data: invite, error } = await supabase
    .from('invitations')
    .insert({
      stokvel_id: stokvelId,
      email,
      phone,
      role,
      token,
      invited_by: user.id,
      invite_channel: channel,
      message,
      status: 'pending',
    })
    .select('id, token')
    .single()

  if (error || !invite) {
    console.error('Create invitation error:', error)
    return {
      success: false,
      error: error?.message ?? 'Could not create invitation.',
    }
  }

  const origin = headers().get('origin') ?? 'http://localhost:3000'
  const inviteUrl = `${origin}/invitations/${invite.token}`

  // Deliver based on channel
  let whatsappUrl: string | undefined

  if (channel === 'email' && email) {
    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    await deliverInvitationByEmail(
      email,
      stokvel?.name ?? 'a stokvel',
      inviterProfile?.full_name ?? 'A committee member',
      inviteUrl
    )
  }

  if (channel === 'whatsapp' && phone) {
    const messageText = message
      ? `${message}\n\n${inviteUrl}`
      : `You're invited to join a stokvel on Stokvel Manager.\n\n${inviteUrl}`
    whatsappUrl = `https://wa.me/${phone.replace(/^\+/, '')}?text=${encodeURIComponent(messageText)}`
  }

  revalidatePath(`/dashboard/stokvels/${stokvelId}`)
  revalidatePath(`/dashboard/stokvels/${stokvelId}/members`)

  return {
    success: true,
    data: { inviteUrl, channel, whatsappUrl },
  }
}

// =====================================================================
// REVOKE
// =====================================================================
export async function revokeInvitationAction(
  invitationId: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: invite } = await supabase
    .from('invitations')
    .select('stokvel_id')
    .eq('id', invitationId)
    .single()

  if (!invite) return { success: false, error: 'Invitation not found.' }

  const { error } = await supabase
    .from('invitations')
    .update({ status: 'revoked' })
    .eq('id', invitationId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/stokvels/${invite.stokvel_id}/members`)
  return { success: true, data: undefined }
}

// =====================================================================
// RESEND — regenerate token, extend expiry
// =====================================================================
export async function resendInvitationAction(
  invitationId: string
): Promise<ActionResult<{ inviteUrl: string }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  const token = generateToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: invite, error } = await supabase
    .from('invitations')
    .update({
      token,
      expires_at: expiresAt,
      status: 'pending',
    })
    .eq('id', invitationId)
    .select('stokvel_id, token')
    .single()

  if (error || !invite) {
    return { success: false, error: error?.message ?? 'Could not resend.' }
  }

  const origin = headers().get('origin') ?? 'http://localhost:3000'
  const inviteUrl = `${origin}/invitations/${invite.token}`

  revalidatePath(`/dashboard/stokvels/${invite.stokvel_id}/members`)

  return { success: true, data: { inviteUrl } }
}

// =====================================================================
// ACCEPT
// =====================================================================
export async function acceptInvitationAction(
  token: string
): Promise<ActionResult<{ stokvelId: string }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { success: false, error: 'You must be logged in.' }
  }

  const { data: invite, error: fetchError } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (fetchError || !invite) {
    return { success: false, error: 'Invitation not found.' }
  }

  if (invite.status !== 'pending') {
    return { success: false, error: `This invitation is ${invite.status}.` }
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    await supabase
      .from('invitations')
      .update({ status: 'expired' })
      .eq('id', invite.id)
    return { success: false, error: 'This invitation has expired.' }
  }

  // Verify email matches (if the invite specified an email)
  if (
    invite.email &&
    invite.email.toLowerCase() !== user.email.toLowerCase()
  ) {
    return {
      success: false,
      error: `This invitation is for ${invite.email}. You are logged in as ${user.email}.`,
    }
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('memberships')
    .select('id, status')
    .eq('stokvel_id', invite.stokvel_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing && existing.status === 'active') {
    return {
      success: false,
      error: 'You are already a member of this stokvel.',
    }
  }

  // Create or reactivate membership
  if (existing) {
    const { error } = await supabase
      .from('memberships')
      .update({
        role: invite.role,
        status: 'active',
        joined_at: new Date().toISOString(),
        exited_at: null,
      })
      .eq('id', existing.id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('memberships').insert({
      stokvel_id: invite.stokvel_id,
      user_id: user.id,
      role: invite.role,
      status: 'active',
      invited_by: invite.invited_by,
    })
    if (error) return { success: false, error: error.message }
  }

  // Mark invitation accepted
  await supabase
    .from('invitations')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      accepted_by: user.id,
    })
    .eq('id', invite.id)

  revalidatePath('/dashboard')
  revalidatePath(`/dashboard/stokvels/${invite.stokvel_id}`)

  return { success: true, data: { stokvelId: invite.stokvel_id } }
}

// =====================================================================
// DECLINE
// =====================================================================
export async function declineInvitationAction(
  token: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  const { error } = await supabase
    .from('invitations')
    .update({
      status: 'declined',
      declined_at: new Date().toISOString(),
    })
    .eq('token', token)
    .eq('status', 'pending')

  if (error) return { success: false, error: error.message }

  return { success: true, data: undefined }
}

// =====================================================================
// UPDATE MEMBER ROLE
// =====================================================================
export async function updateMemberRoleAction(
  membershipId: string,
  newRole: MemberRole
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  const validRoles: MemberRole[] = [
    'chairperson',
    'treasurer',
    'secretary',
    'member',
    'auditor',
  ]
  if (!validRoles.includes(newRole)) {
    return { success: false, error: 'Invalid role.' }
  }

  const { data: target } = await supabase
    .from('memberships')
    .select('stokvel_id, user_id, role')
    .eq('id', membershipId)
    .single()

  if (!target) return { success: false, error: 'Membership not found.' }

  // Caller must be chairperson
  const { data: caller } = await supabase
    .from('memberships')
    .select('role')
    .eq('stokvel_id', target.stokvel_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!caller || caller.role !== 'chairperson') {
    return {
      success: false,
      error: 'Only the chairperson can change member roles.',
    }
  }

  // Can't demote yourself if you're the only chairperson
  if (target.user_id === user.id && target.role === 'chairperson' && newRole !== 'chairperson') {
    const { count } = await supabase
      .from('memberships')
      .select('id', { count: 'exact', head: true })
      .eq('stokvel_id', target.stokvel_id)
      .eq('role', 'chairperson')
      .eq('status', 'active')

    if ((count ?? 0) <= 1) {
      return {
        success: false,
        error:
          'You are the only chairperson. Promote someone else first.',
      }
    }
  }

  const { error } = await supabase
    .from('memberships')
    .update({ role: newRole })
    .eq('id', membershipId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/stokvels/${target.stokvel_id}`)
  revalidatePath(`/dashboard/stokvels/${target.stokvel_id}/members`)

  return { success: true, data: undefined }
}

// =====================================================================
// REMOVE MEMBER (soft — set resigned)
// =====================================================================
export async function removeMemberAction(
  membershipId: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: target } = await supabase
    .from('memberships')
    .select('stokvel_id, user_id, role')
    .eq('id', membershipId)
    .single()

  if (!target) return { success: false, error: 'Membership not found.' }

  // Only chairperson can remove
  const { data: caller } = await supabase
    .from('memberships')
    .select('role')
    .eq('stokvel_id', target.stokvel_id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!caller || caller.role !== 'chairperson') {
    return {
      success: false,
      error: 'Only the chairperson can remove members.',
    }
  }

  if (target.user_id === user.id) {
    return {
      success: false,
      error: 'You cannot remove yourself. Transfer chairperson first.',
    }
  }

  const { error } = await supabase
    .from('memberships')
    .update({
      status: 'resigned',
      exited_at: new Date().toISOString(),
    })
    .eq('id', membershipId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/stokvels/${target.stokvel_id}`)
  revalidatePath(`/dashboard/stokvels/${target.stokvel_id}/members`)

  return { success: true, data: undefined }
}

// =====================================================================
// UPDATE stokvel invite settings (allow_member_invites, default channel)
// =====================================================================
export async function updateInviteSettingsAction(
  stokvelId: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: caller } = await supabase
    .from('memberships')
    .select('role')
    .eq('stokvel_id', stokvelId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!caller || caller.role !== 'chairperson') {
    return {
      success: false,
      error: 'Only the chairperson can change invite settings.',
    }
  }

  const allow = formData.get('allow_member_invites') === 'on'
  const channel = String(formData.get('default_invite_channel') ?? 'link')

  if (!['link', 'email', 'whatsapp'].includes(channel)) {
    return { success: false, error: 'Invalid default channel.' }
  }

  const { error } = await supabase
    .from('stokvels')
    .update({
      allow_member_invites: allow,
      default_invite_channel: channel,
    })
    .eq('id', stokvelId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/stokvels/${stokvelId}`)
  revalidatePath(`/dashboard/stokvels/${stokvelId}/members`)
  revalidatePath(`/dashboard/stokvels/${stokvelId}/settings`)

  return { success: true, data: undefined }
}