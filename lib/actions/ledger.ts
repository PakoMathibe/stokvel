// lib/actions/ledger.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import type { MoneyStates } from '@/lib/types/contribution'

// =====================================================================
// Compute the four money states for a stokvel
// =====================================================================
export async function getMoneyStatesAction(
  stokvelId: string
): Promise<MoneyStates> {
  const supabase = createClient()

  // Recorded: payments with status = 'recorded'
  const { data: recorded } = await supabase
    .from('payments')
    .select('amount')
    .eq('stokvel_id', stokvelId)
    .eq('status', 'recorded')

  const recordedSum = (recorded ?? []).reduce(
    (s, p) => s + Number(p.amount),
    0
  )

  // Verified: payments with status IN ('verified','reconciled')
  const { data: verified } = await supabase
    .from('payments')
    .select('amount')
    .eq('stokvel_id', stokvelId)
    .in('status', ['verified', 'reconciled'])

  const verifiedSum = (verified ?? []).reduce(
    (s, p) => s + Number(p.amount),
    0
  )

  // Owed: outstanding on pending/partial/overdue contributions
  const { data: owedRows } = await supabase
    .from('contributions')
    .select('amount_due, amount_paid, penalty_amount')
    .eq('stokvel_id', stokvelId)
    .in('status', ['pending', 'partial', 'overdue'])

  const owedSum = (owedRows ?? []).reduce((s, r) => {
    const due = Number(r.amount_due) + Number(r.penalty_amount ?? 0)
    const paid = Number(r.amount_paid)
    return s + Math.max(0, due - paid)
  }, 0)

  // Available: verified − pending payouts (Phase 5: payouts not built yet,
  // so available === verified for now; will change when payouts ship)
  const { data: pendingPayouts } = await supabase
    .from('payouts')
    .select('amount')
    .eq('stokvel_id', stokvelId)
    .in('status', ['pending', 'approved'])

  const reservedForPayouts = (pendingPayouts ?? []).reduce(
    (s, p) => s + Number(p.amount),
    0
  )

  const availableSum = Math.max(0, verifiedSum - reservedForPayouts)

  return {
    recorded: recordedSum,
    verified: verifiedSum,
    available: availableSum,
    owed: owedSum,
  }
}