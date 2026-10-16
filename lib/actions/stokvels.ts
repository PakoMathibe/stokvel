// lib/actions/stokvels.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type {
  Stokvel,
  StokvelWithMembership,
  StokvelDetail,
  Membership,
  MembershipWithProfile,
  StokvelType,
  ContributionFrequency,
  MemberRole,
} from '@/lib/types/stokvel'

// =====================================================================
// RESULT TYPE
// =====================================================================
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// =====================================================================
// READ: Get all stokvels for current user
// =====================================================================
export async function getStokvelsForUser(): Promise<StokvelWithMembership[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('memberships')
    .select(
      `
      *,
      stokvel:stokvels(*)
    `
    )
    .eq('user_id', user.id)
    .in('status', ['active', 'pending'])
    .order('joined_at', { ascending: false })

  if (error || !data) return []

  // Flatten: each row is a membership + its stokvel
  const stokvels: StokvelWithMembership[] = data
    .map((row: any) => {
      const stokvel = row.stokvel as Stokvel | null
      if (!stokvel) return null

      const { stokvel: _, ...membership } = row
      return {
        ...stokvel,
        membership: membership as Membership,
      } as StokvelWithMembership
    })
    .filter((s): s is StokvelWithMembership => s !== null)

  return stokvels
}

// =====================================================================
// READ: Get one stokvel with members
// =====================================================================
export async function getStokvelById(
  id: string
): Promise<StokvelDetail | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch stokvel
  const { data: stokvel, error: stokvelError } = await supabase
    .from('stokvels')
    .select('*')
    .eq('id', id)
    .single()

  if (stokvelError || !stokvel) return null

  // Fetch current user's membership
  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('*')
    .eq('stokvel_id', id)
    .eq('user_id', user.id)
    .single()

  if (membershipError || !membership) return null

  // Fetch all members with profiles
  const { data: memberRows, error: membersError } = await supabase
    .from('memberships')
    .select(
      `
      *,
      profile:profiles(id, full_name, email, phone, avatar_url)
    `
    )
    .eq('stokvel_id', id)
    .order('joined_at', { ascending: true })

  const members: MembershipWithProfile[] = (memberRows ?? []).map(
    (row: any) => ({
      ...row,
      profile: row.profile,
    })
  )

  return {
    ...(stokvel as Stokvel),
    membership: membership as Membership,
    members,
  }
}

// =====================================================================
// CREATE: New stokvel + creator becomes chairperson
// =====================================================================
export async function createStokvelAction(
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }

  // Extract and validate fields
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const stokvel_type = String(
    formData.get('stokvel_type') ?? 'rotational'
  ) as StokvelType
  const contribution_amount = Number(
    formData.get('contribution_amount') ?? 0
  )
  const contribution_frequency = String(
    formData.get('contribution_frequency') ?? 'monthly'
  ) as ContributionFrequency
  const target_members_raw = formData.get('target_members')
  const target_members = target_members_raw
    ? Number(target_members_raw)
    : null
  const nasasa_registration =
    String(formData.get('nasasa_registration') ?? '').trim() || null

  if (name.length < 3) {
    return {
      success: false,
      error: 'Stokvel name must be at least 3 characters.',
    }
  }
  if (name.length > 100) {
    return { success: false, error: 'Stokvel name is too long.' }
  }
  if (contribution_amount < 0) {
    return {
      success: false,
      error: 'Contribution amount cannot be negative.',
    }
  }

  const validTypes: StokvelType[] = [
    'rotational',
    'grocery',
    'burial',
    'investment',
    'savings',
    'social',
  ]
  if (!validTypes.includes(stokvel_type)) {
    return { success: false, error: 'Invalid stokvel type.' }
  }

  const validFrequencies: ContributionFrequency[] = [
    'weekly',
    'monthly',
    'quarterly',
    'annually',
  ]
  if (!validFrequencies.includes(contribution_frequency)) {
    return { success: false, error: 'Invalid contribution frequency.' }
  }

  // Insert stokvel
  const { data: stokvel, error: stokvelError } = await supabase
    .from('stokvels')
    .insert({
      name,
      description: description || null,
      stokvel_type,
      contribution_amount,
      contribution_frequency,
      target_members,
      nasasa_registration,
      created_by: user.id,
      status: 'active',
    })
    .select('id')
    .single()

  if (stokvelError || !stokvel) {
    console.error('Create stokvel error:', stokvelError)
    return {
      success: false,
      error: stokvelError?.message ?? 'Could not create stokvel.',
    }
  }

  // Insert membership: creator becomes chairperson
  const { error: membershipError } = await supabase
    .from('memberships')
    .insert({
      stokvel_id: stokvel.id,
      user_id: user.id,
      role: 'chairperson',
      status: 'active',
    })

  if (membershipError) {
    console.error('Create membership error:', membershipError)
    // Roll back the stokvel since we couldn't add the creator
    await supabase.from('stokvels').delete().eq('id', stokvel.id)
    return {
      success: false,
      error:
        'Stokvel was created but we could not add you as chairperson. Please try again.',
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/stokvels')

  return { success: true, data: { id: stokvel.id } }
}

// =====================================================================
// UPDATE: Edit stokvel settings
// =====================================================================
export async function updateStokvelAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }

  // Verify permission: user must be chairperson or secretary
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('stokvel_id', id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (
    !membership ||
    !['chairperson', 'secretary'].includes(membership.role)
  ) {
    return {
      success: false,
      error: 'Only the chairperson or secretary can edit this stokvel.',
    }
  }

  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const contribution_amount = Number(
    formData.get('contribution_amount') ?? 0
  )
  const contribution_frequency = String(
    formData.get('contribution_frequency') ?? 'monthly'
  ) as ContributionFrequency
  const target_members_raw = formData.get('target_members')
  const target_members = target_members_raw
    ? Number(target_members_raw)
    : null
  const nasasa_registration =
    String(formData.get('nasasa_registration') ?? '').trim() || null

  if (name.length < 3) {
    return {
      success: false,
      error: 'Stokvel name must be at least 3 characters.',
    }
  }

  const { error } = await supabase
    .from('stokvels')
    .update({
      name,
      description: description || null,
      contribution_amount,
      contribution_frequency,
      target_members,
      nasasa_registration,
    })
    .eq('id', id)

  if (error) {
    console.error('Update stokvel error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/stokvels')
  revalidatePath(`/dashboard/stokvels/${id}`)
  revalidatePath(`/dashboard/stokvels/${id}/settings`)

  return { success: true, data: undefined }
}

// =====================================================================
// ARCHIVE: Soft delete — set status to 'archived'
// =====================================================================
export async function archiveStokvelAction(
  id: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }

  // Only chairperson can archive
  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('stokvel_id', id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership || membership.role !== 'chairperson') {
    return {
      success: false,
      error: 'Only the chairperson can archive this stokvel.',
    }
  }

  const { error } = await supabase
    .from('stokvels')
    .update({ status: 'archived' })
    .eq('id', id)

  if (error) {
    console.error('Archive stokvel error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/stokvels')

  return { success: true, data: undefined }
}

// =====================================================================
// RESTORE: Un-archive (set status back to 'active')
// =====================================================================
export async function restoreStokvelAction(
  id: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'You must be logged in.' }
  }

  const { data: membership } = await supabase
    .from('memberships')
    .select('role')
    .eq('stokvel_id', id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership || membership.role !== 'chairperson') {
    return {
      success: false,
      error: 'Only the chairperson can restore this stokvel.',
    }
  }

  const { error } = await supabase
    .from('stokvels')
    .update({ status: 'active' })
    .eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/stokvels')

  return { success: true, data: undefined }
}