// lib/actions/payments.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type {
  Payment,
  PaymentWithRecorder,
  PaymentMethod,
} from '@/lib/types/contribution'
import type { MemberRole } from '@/lib/types/stokvel'

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

// =====================================================================
// HELPER
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
// LIST payments for a contribution
// =====================================================================
export async function listPaymentsForContribution(
  contributionId: string
): Promise<PaymentWithRecorder[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('payments')
    .select(
      `
      *,
      recorder:profiles!payments_created_by_fkey(id, full_name, email),
      verifier:profiles!payments_verified_by_fkey(id, full_name, email)
    `
    )
    .eq('contribution_id', contributionId)
    .order('payment_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as PaymentWithRecorder[]
}

// =====================================================================
// LIST payments for a stokvel
// =====================================================================
export async function listPaymentsForStokvel(
  stokvelId: string,
  filters?: {
    membershipId?: string
    status?: Payment['status']
  }
): Promise<PaymentWithRecorder[]> {
  const supabase = createClient()
  let query = supabase
    .from('payments')
    .select(
      `
      *,
      recorder:profiles!payments_created_by_fkey(id, full_name, email),
      verifier:profiles!payments_verified_by_fkey(id, full_name, email)
    `
    )
    .eq('stokvel_id', stokvelId)
    .order('payment_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(200)

  if (filters?.membershipId) {
    query = query.eq('membership_id', filters.membershipId)
  }
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query
  if (error || !data) return []
  return data as PaymentWithRecorder[]
}

// =====================================================================
// RECORD a payment
// =====================================================================
export async function recordPaymentAction(
  stokvelId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated.' }

  const role = await getCallerRole(supabase, stokvelId, user.id)
  if (!role) {
    return { success: false, error: 'You are not a member of this stokvel.' }
  }

  const contributionId = String(formData.get('contribution_id') ?? '').trim()
  const amountRaw = formData.get('amount')
  const paymentDate = String(formData.get('payment_date') ?? '').trim()
  const method = String(formData.get('payment_method') ?? 'eft') as PaymentMethod
  const reference = String(formData.get('reference') ?? '').trim() || null
  const notes = String(formData.get('notes') ?? '').trim() || null
  const proofUrl = String(formData.get('proof_url') ?? '').trim() || null

  const amount = Number(amountRaw)
  if (!contributionId) {
    return { success: false, error: 'Missing contribution.' }
  }
  if (!paymentDate) {
    return { success: false, error: 'Please provide a payment date.' }
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: 'Amount must be greater than zero.' }
  }
  if (
    !['eft', 'cash', 'card', 'debit_order', 'other'].includes(method)
  ) {
    return { success: false, error: 'Invalid payment method.' }
  }

  // Load contribution to get membership and confirm ownership scope
  const { data: contribution } = await supabase
    .from('contributions')
    .select('id, stokvel_id, membership_id')
    .eq('id', contributionId)
    .single()

  if (!contribution || contribution.stokvel_id !== stokvelId) {
    return { success: false, error: 'Contribution not found.' }
  }

  // Only committee OR the owner of the contribution can record
  const { data: callerMembership } = await supabase
    .from('memberships')
    .select('id')
    .eq('stokvel_id', stokvelId)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  const isCommittee = ['chairperson', 'treasurer'].includes(role)
  const isOwner = callerMembership?.id === contribution.membership_id

  if (!isCommittee && !isOwner) {
    return {
      success: false,
      error: 'You can only record payments for your own contributions.',
    }
  }

  // Insert payment as 'recorded' (not verified)
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      stokvel_id: stokvelId,
      membership_id: contribution.membership_id,
      contribution_id: contributionId,
      amount,
      payment_date: paymentDate,
      payment_method: method,
      reference,
      proof_url: proofUrl,
      notes,
      status: 'recorded',
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error || !payment) {
    console.error('Record payment error:', error)
    return { success: false, error: error?.message ?? 'Could not record.' }
  }

  // Update contribution amount_paid + status
  await recomputeContribution(supabase, contributionId)

  revalidatePath(`/dashboard/stokvels/${stokvelId}`)
  revalidatePath(`/dashboard/stokvels/${stokvelId}/contributions`)
  revalidatePath(`/dashboard/stokvels/${stokvelId}/contributions/${contributionId}`)

  return { success: true, data: { id: payment.id } }
}

// =====================================================================
// VERIFY a payment
// =====================================================================
export async function verifyPaymentAction(
  paymentId: string,
  options?: { reconciled?: boolean; notes?: string }
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated.' }

  const { data: payment } = await supabase
    .from('payments')
    .select('stokvel_id, contribution_id')
    .eq('id', paymentId)
    .single()

  if (!payment) return { success: false, error: 'Payment not found.' }

  const role = await getCallerRole(supabase, payment.stokvel_id, user.id)
  if (!role || !['chairperson', 'treasurer'].includes(role)) {
    return {
      success: false,
      error: 'Only the chairperson or treasurer can verify payments.',
    }
  }

  const newStatus = options?.reconciled ? 'reconciled' : 'verified'

  const { error } = await supabase
    .from('payments')
    .update({
      status: newStatus,
      verified_by: user.id,
      verified_at: new Date().toISOString(),
      notes: options?.notes ?? undefined,
    })
    .eq('id', paymentId)

  if (error) return { success: false, error: error.message }

  // Post to ledger
  const { data: fullPayment } = await supabase
    .from('payments')
    .select('amount, payment_date, reference, stokvel_id')
    .eq('id', paymentId)
    .single()

  if (fullPayment) {
    await supabase.from('ledger_entries').insert({
      stokvel_id: fullPayment.stokvel_id,
      entry_type: 'contribution',
      amount: Number(fullPayment.amount),
      description: `Contribution payment${
        fullPayment.reference ? ` (${fullPayment.reference})` : ''
      }`,
      reference_id: paymentId,
      reference_type: 'payment',
      created_by: user.id,
    })
  }

  // Recompute contribution
  if (payment.contribution_id) {
    await recomputeContribution(supabase, payment.contribution_id)
  }

  revalidatePath(`/dashboard/stokvels/${payment.stokvel_id}`)
  revalidatePath(`/dashboard/stokvels/${payment.stokvel_id}/contributions`)
  if (payment.contribution_id) {
    revalidatePath(
      `/dashboard/stokvels/${payment.stokvel_id}/contributions/${payment.contribution_id}`
    )
  }

  return { success: true, data: undefined }
}

// =====================================================================
// REJECT a payment
// =====================================================================
export async function rejectPaymentAction(
  paymentId: string,
  reason: string
): Promise<ActionResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated.' }

  if (!reason || reason.trim().length < 3) {
    return { success: false, error: 'Please provide a reason for rejection.' }
  }

  const { data: payment } = await supabase
    .from('payments')
    .select('stokvel_id, contribution_id')
    .eq('id', paymentId)
    .single()

  if (!payment) return { success: false, error: 'Payment not found.' }

  const role = await getCallerRole(supabase, payment.stokvel_id, user.id)
  if (!role || !['chairperson', 'treasurer'].includes(role)) {
    return {
      success: false,
      error: 'Only the chairperson or treasurer can reject payments.',
    }
  }

  const { error } = await supabase
    .from('payments')
    .update({
      status: 'rejected',
      verified_by: user.id,
      verified_at: new Date().toISOString(),
      notes: reason.trim(),
    })
    .eq('id', paymentId)

  if (error) return { success: false, error: error.message }

  // Recompute contribution — rejected payments no longer count
  if (payment.contribution_id) {
    await recomputeContribution(supabase, payment.contribution_id)
  }

  revalidatePath(`/dashboard/stokvels/${payment.stokvel_id}`)
  revalidatePath(`/dashboard/stokvels/${payment.stokvel_id}/contributions`)

  return { success: true, data: undefined }
}

// =====================================================================
// RECOMPUTE contribution — amount_paid + status
// =====================================================================
// Only verified + reconciled payments count toward amount_paid.
// 'recorded' and 'rejected' do NOT.
async function recomputeContribution(
  supabase: ReturnType<typeof createClient>,
  contributionId: string
): Promise<void> {
  const { data: contribution } = await supabase
    .from('contributions')
    .select('amount_due, penalty_amount, due_date')
    .eq('id', contributionId)
    .single()

  if (!contribution) return

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status')
    .eq('contribution_id', contributionId)

  const paid = (payments ?? [])
    .filter((p) => p.status === 'verified' || p.status === 'reconciled')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const totalDue =
    Number(contribution.amount_due) + Number(contribution.penalty_amount ?? 0)

  let status: string
  if (paid <= 0) {
    const overdue =
      new Date(contribution.due_date).getTime() < Date.now()
    status = overdue ? 'overdue' : 'pending'
  } else if (paid >= totalDue) {
    status = 'paid'
  } else {
    status = 'partial'
  }

  await supabase
    .from('contributions')
    .update({
      amount_paid: paid,
      status,
    })
    .eq('id', contributionId)
}