// lib/actions/contributions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { MemberRole } from '@/lib/types/stokvel'
import type {
  ContributionWithMember,
  ContributionSummary,
  ArrearsRow,
  ContributionStatus,
} from '@/lib/types/contribution'

// =====================================================================
// RESULT TYPE
// =====================================================================
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// =====================================================================
// HELPER — get caller role in a stokvel
// =====================================================================
async function getCallerRole(
  supabase: ReturnType<typeof createClient>,
  stokvelId: string,
  userId: string
): Promise<MemberRole | null> {
  const { data } = await supabase
    .from('memberships')
    .select('role')
    .eq('stokvel_id', stokvelId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  return (data?.role as MemberRole) ?? null
}

// =====================================================================
// LIST contributions for a stokvel
// =====================================================================
export async function listContributionsAction(
  stokvelId: string,
  filters?: {
    membershipId?: string
    status?: ContributionStatus
    periodLabel?: string
  }
): Promise<ContributionWithMember[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from('contributions')
    .select(
      `
      *,
      member:memberships!contributions_membership_id_fkey(
        id,
        user_id,
        member_number,
        role,
        profile:profiles(id, full_name, email)
      )
    `
    )
    .eq('stokvel_id', stokvelId)
    .order('due_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters?.membershipId) {
    query = query.eq('membership_id', filters.membershipId)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.periodLabel) {
    query = query.eq('period_label', filters.periodLabel)
  }

  const { data, error } = await query
  if (error || !data) return []

  return data.map((row: any) => ({
    ...row,
    member: row.member
      ? {
          ...row.member,
          profile: row.member.profile,
        }
      : null,
  }))
}

// =====================================================================
// GET one contribution with member
// =====================================================================
export async function getContributionById(
  contributionId: string
): Promise<ContributionWithMember | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('contributions')
    .select(
      `
      *,
      member:memberships!contributions_membership_id_fkey(
        id,
        user_id,
        member_number,
        role,
        profile:profiles(id, full_name, email)
      )
    `
    )
    .eq('id', contributionId)
    .maybeSingle()

  if (error || !data) return null
  return data as ContributionWithMember
}

// =====================================================================
// SUMMARY — status counts and totals for a stokvel
// =====================================================================
export async function getContributionSummaryAction(
  stokvelId: string
): Promise<ContributionSummary> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('contributions')
    .select('amount_due, amount_paid, penalty_amount, status')
    .eq('stokvel_id', stokvelId)

  const empty: ContributionSummary = {
    total_due: 0,
    total_paid: 0,
    total_outstanding: 0,
    members_paid: 0,
    members_partial: 0,
    members_pending: 0,
    members_overdue: 0,
    members_waived: 0,
  }

  if (error || !data) return empty

  const summary = { ...empty }

  for (const row of data) {
    const due = Number(row.amount_due) + Number(row.penalty_amount ?? 0)
    const paid = Number(row.amount_paid)

    summary.total_due += due
    summary.total_paid += paid

    if (row.status !== 'waived') {
      summary.total_outstanding += Math.max(0, due - paid)
    }

    switch (row.status) {
      case 'paid':
        summary.members_paid += 1
        break
      case 'partial':
        summary.members_partial += 1
        break
      case 'pending':
        summary.members_pending += 1
        break
      case 'overdue':
        summary.members_overdue += 1
        break
      case 'waived':
        summary.members_waived += 1
        break
    }
  }

  return summary
}

// =====================================================================
// GENERATE contributions for a period
// =====================================================================
export async function generateContributionsAction(
  stokvelId: string,
  formData: FormData
): Promise<ActionResult<{ created: number; skipped: number }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated.' }
  }

  const role = await getCallerRole(supabase, stokvelId, user.id)
  if (!role || !['chairperson', 'treasurer'].includes(role)) {
    return {
      success: false,
      error: 'Only the chairperson or treasurer can generate contributions.',
    }
  }

  const periodLabel = String(formData.get('period_label') ?? '').trim()
  const dueDate = String(formData.get('due_date') ?? '').trim()
  const amountOverride = formData.get('amount_override')

  if (!periodLabel || periodLabel.length > 50) {
    return {
      success: false,
      error: 'Please provide a short period label (e.g. "March 2026").',
    }
  }
  if (!dueDate) {
    return { success: false, error: 'Please provide a due date.' }
  }

  // Load stokvel for default amount
  const { data: stokvel, error: stokvelError } = await supabase
    .from('stokvels')
    .select('contribution_amount')
    .eq('id', stokvelId)
    .single()

  if (stokvelError || !stokvel) {
    return { success: false, error: 'Stokvel not found.' }
  }

  const amount =
    amountOverride && Number(amountOverride) > 0
      ? Number(amountOverride)
      : Number(stokvel.contribution_amount)

  if (amount <= 0) {
    return {
      success: false,
      error:
        'Contribution amount must be greater than zero. Set it on the stokvel or provide an override.',
    }
  }

  // Load active memberships
  const { data: memberships } = await supabase
    .from('memberships')
    .select('id')
    .eq('stokvel_id', stokvelId)
    .eq('status', 'active')

  if (!memberships || memberships.length === 0) {
    return { success: false, error: 'No active members to generate for.' }
  }

  // Skip members who already have a contribution for this period
  const { data: existing } = await supabase
    .from('contributions')
    .select('membership_id')
    .eq('stokvel_id', stokvelId)
    .eq('period_label', periodLabel)

  const existingSet = new Set(
    (existing ?? []).map((row: { membership_id: string }) => row.membership_id)
  )

  const toInsert = memberships
    .filter((m) => !existingSet.has(m.id))
    .map((m) => ({
      stokvel_id: stokvelId,
      membership_id: m.id,
      amount_due: amount,
      amount_paid: 0,
      due_date: dueDate,
      period_label: periodLabel,
      status: 'pending' as const,
      penalty_amount: 0,
    }))

  if (toInsert.length === 0) {
    return {
      success: true,
      data: { created: 0, skipped: memberships.length },
    }
  }

  const { error: insertError } = await supabase
    .from('contributions')
    .insert(toInsert)

  if (insertError) {
    console.error('Generate contributions error:', insertError)
    return { success: false, error: insertError.message }
  }

  revalidatePath(`/dashboard/stokvels/${stokvelId}`)
  revalidatePath(`/dashboard/stokvels/${stokvelId}/contributions`)

  return {
    success: true,
    data: {
      created: toInsert.length,
      skipped: memberships.length - toInsert.length,
    },
  }
}

// =====================================================================
// WAIVE a contribution
// =====================================================================
export async function waiveContributionAction(
  contributionId: string,
  reason: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  if (!reason || reason.trim().length < 3) {
    return { success: false, error: 'Please provide a reason.' }
  }

  const { data: contribution } = await supabase
    .from('contributions')
    .select('stokvel_id')
    .eq('id', contributionId)
    .single()

  if (!contribution) {
    return { success: false, error: 'Contribution not found.' }
  }

  const role = await getCallerRole(supabase, contribution.stokvel_id, user.id)
  if (!role || !['chairperson', 'treasurer'].includes(role)) {
    return {
      success: false,
      error: 'Only the chairperson or treasurer can waive contributions.',
    }
  }

  const { error } = await supabase
    .from('contributions')
    .update({
      status: 'waived',
      notes: reason.trim(),
    })
    .eq('id', contributionId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/stokvels/${contribution.stokvel_id}`)
  revalidatePath(`/dashboard/stokvels/${contribution.stokvel_id}/contributions`)

  return { success: true, data: undefined }
}

// =====================================================================
// DELETE a contribution (only if no payments attached)
// =====================================================================
export async function deleteContributionAction(
  contributionId: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: contribution } = await supabase
    .from('contributions')
    .select('stokvel_id')
    .eq('id', contributionId)
    .single()

  if (!contribution) {
    return { success: false, error: 'Contribution not found.' }
  }

  const role = await getCallerRole(supabase, contribution.stokvel_id, user.id)
  if (!role || !['chairperson', 'treasurer'].includes(role)) {
    return {
      success: false,
      error: 'Only the chairperson or treasurer can delete contributions.',
    }
  }

  // Check for payments
  const { count } = await supabase
    .from('payments')
    .select('id', { count: 'exact', head: true })
    .eq('contribution_id', contributionId)

  if ((count ?? 0) > 0) {
    return {
      success: false,
      error:
        'Cannot delete: payments are attached. Reverse the payments first.',
    }
  }

  const { error } = await supabase
    .from('contributions')
    .delete()
    .eq('id', contributionId)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/stokvels/${contribution.stokvel_id}`)
  revalidatePath(`/dashboard/stokvels/${contribution.stokvel_id}/contributions`)

  return { success: true, data: undefined }
}

// =====================================================================
// ARREARS — outstanding contributions aged by days late
// =====================================================================
export async function getArrearsAction(
  stokvelId: string
): Promise<ArrearsRow[]> {
  const supabase = createClient()
  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('contributions')
    .select(
      `
      amount_due,
      amount_paid,
      penalty_amount,
      due_date,
      membership_id,
      member:memberships!contributions_membership_id_fkey(
        user_id,
        profile:profiles(full_name, email)
      )
    `
    )
    .eq('stokvel_id', stokvelId)
    .in('status', ['pending', 'partial', 'overdue'])
    .lt('due_date', today)

  if (error || !data) return []

  // Group by membership
  const map = new Map<string, ArrearsRow>()

  for (const row of data as any[]) {
    const membershipId = row.membership_id
    const owed =
      Number(row.amount_due) +
      Number(row.penalty_amount ?? 0) -
      Number(row.amount_paid)

    if (owed <= 0) continue

    const existing = map.get(membershipId)
    const dueDate = row.due_date as string
    const daysLate = Math.floor(
      (Date.now() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (existing) {
      existing.total_owed += owed
      existing.contributions_count += 1
      if (dueDate < existing.oldest_due_date) {
        existing.oldest_due_date = dueDate
        existing.days_late = daysLate
      }
    } else {
      map.set(membershipId, {
        membership_id: membershipId,
        member_name: row.member?.profile?.full_name ?? 'Unknown',
        member_email: row.member?.profile?.email ?? '',
        total_owed: owed,
        oldest_due_date: dueDate,
        days_late: daysLate,
        contributions_count: 1,
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.days_late - a.days_late)
}