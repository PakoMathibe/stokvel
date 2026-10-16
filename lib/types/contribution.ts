// lib/types/contribution.ts

import type { MemberRole } from './stokvel'

// =====================================================================
// CONTRIBUTIONS (obligations)
// =====================================================================

export type ContributionStatus =
  | 'pending'
  | 'partial'
  | 'paid'
  | 'overdue'
  | 'waived'

export type Contribution = {
  id: string
  stokvel_id: string
  membership_id: string
  amount_due: number
  amount_paid: number
  due_date: string
  period_label: string | null
  status: ContributionStatus
  penalty_amount: number
  notes: string | null
  created_at: string
  updated_at: string
}

export type ContributionWithMember = Contribution & {
  member: {
    id: string
    user_id: string
    member_number: string | null
    role: MemberRole
    profile: {
      id: string
      full_name: string | null
      email: string
    } | null
  } | null
}

// =====================================================================
// PAYMENTS (recorded money)
// =====================================================================

export type PaymentStatus =
  | 'recorded'
  | 'verified'
  | 'rejected'
  | 'reconciled'

export type PaymentMethod =
  | 'eft'
  | 'cash'
  | 'card'
  | 'debit_order'
  | 'other'

export type Payment = {
  id: string
  stokvel_id: string
  membership_id: string
  contribution_id: string | null
  amount: number
  payment_date: string
  payment_method: PaymentMethod
  reference: string | null
  proof_url: string | null
  status: PaymentStatus
  verified_by: string | null
  verified_at: string | null
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type PaymentWithRecorder = Payment & {
  recorder: {
    id: string
    full_name: string | null
    email: string
  } | null
  verifier: {
    id: string
    full_name: string | null
    email: string
  } | null
}

// =====================================================================
// LEDGER ENTRIES (immutable financial record)
// =====================================================================

export type LedgerEntryType =
  | 'contribution'
  | 'payout'
  | 'expense'
  | 'penalty'
  | 'interest'
  | 'adjustment'
  | 'reversal'

export type LedgerEntry = {
  id: string
  stokvel_id: string
  entry_type: LedgerEntryType
  amount: number
  description: string
  reference_id: string | null
  reference_type: string | null
  created_by: string
  created_at: string
}

// =====================================================================
// MONEY STATES
// =====================================================================

export type MoneyStates = {
  recorded: number
  verified: number
  available: number
  owed: number
}

// =====================================================================
// AGGREGATES
// =====================================================================

export type ContributionSummary = {
  total_due: number
  total_paid: number
  total_outstanding: number
  members_paid: number
  members_partial: number
  members_pending: number
  members_overdue: number
  members_waived: number
}

export type ArrearsRow = {
  membership_id: string
  member_name: string
  member_email: string
  total_owed: number
  oldest_due_date: string
  days_late: number
  contributions_count: number
}

// =====================================================================
// LABELS
// =====================================================================

export const CONTRIBUTION_STATUS_LABELS: Record<ContributionStatus, string> = {
  pending: 'Pending',
  partial: 'Partially paid',
  paid: 'Paid',
  overdue: 'Overdue',
  waived: 'Waived',
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  recorded: 'Recorded',
  verified: 'Verified',
  rejected: 'Rejected',
  reconciled: 'Reconciled',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  eft: 'EFT',
  cash: 'Cash',
  card: 'Card',
  debit_order: 'Debit order',
  other: 'Other',
}

export const LEDGER_ENTRY_TYPE_LABELS: Record<LedgerEntryType, string> = {
  contribution: 'Contribution',
  payout: 'Payout',
  expense: 'Expense',
  penalty: 'Penalty',
  interest: 'Interest',
  adjustment: 'Adjustment',
  reversal: 'Reversal',
}