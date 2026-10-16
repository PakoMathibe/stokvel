// lib/reports/_helpers.ts

import { createServerClient } from '@/lib/supabase/server';
import type { MoneyStates, ReportPeriod } from './types';

/**
 * Safely sum a query that may fail because the table doesn't exist yet
 * (e.g. expenses, payouts, loans before their phases ship).
 * Returns 0 if the relation is missing OR if the query returns no rows.
 */
export async function safeSum(
  supabase: ReturnType<typeof createServerClient>,
  table: string,
  column: string,
  apply: (q: any) => any,
): Promise<{ value: number; missing: boolean }> {
  try {
    const base = (supabase as any).from(table).select(column);
    const q = apply(base);
    const { data, error } = await q;
    if (error) {
      // 42P01 = undefined_table; PGRST205 = table not found in schema cache
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return { value: 0, missing: true };
      }
      throw error;
    }
    if (!data || data.length === 0) return { value: 0, missing: false };
    const sum = (data as Array<Record<string, unknown>>).reduce(
      (acc, r) => acc + Number(r[column] ?? 0),
      0,
    );
    return { value: sum, missing: false };
  } catch (e: any) {
    if (e?.code === '42P01' || e?.code === 'PGRST205') {
      return { value: 0, missing: true };
    }
    throw e;
  }
}

/** Same as safeSum but returns the rows and flags missing tables. */
export async function safeSelect<T = any>(
  supabase: ReturnType<typeof createServerClient>,
  table: string,
  apply: (q: any) => any,
): Promise<{ rows: T[]; missing: boolean }> {
  try {
    const base = (supabase as any).from(table).select('*');
    const q = apply(base);
    const { data, error } = await q;
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return { rows: [], missing: true };
      }
      throw error;
    }
    return { rows: (data ?? []) as T[], missing: false };
  } catch (e: any) {
    if (e?.code === '42P01' || e?.code === 'PGRST205') {
      return { rows: [], missing: true };
    }
    throw e;
  }
}

/**
 * Compute the four money states for a stokvel in a period.
 * All four figures are returned — never collapse them.
 */
export async function computeMoneyStates(
  supabase: ReturnType<typeof createServerClient>,
  stokvelId: string,
  period: ReportPeriod,
): Promise<{ states: MoneyStates; missing: string[] }> {
  const missing: string[] = [];

  // Recorded payments in period
  const recorded = await safeSum(
    supabase,
    'payments',
    'amount',
    (q) =>
      q
        .eq('stokvel_id', stokvelId)
        .eq('status', 'recorded')
        .gte('payment_date', period.from)
        .lte('payment_date', period.to),
  );
  if (recorded.missing) missing.push('payments');

  // Verified / reconciled payments in period
  const verifiedRec = await safeSum(
    supabase,
    'payments',
    'amount',
    (q) =>
      q
        .eq('stokvel_id', stokvelId)
        .in('status', ['verified', 'reconciled'])
        .gte('payment_date', period.from)
        .lte('payment_date', period.to),
  );
  if (verifiedRec.missing) missing.push('payments');

  // Executed payouts (Phase 7)
  const payouts = await safeSum(
    supabase,
    'payouts',
    'amount',
    (q) =>
      q
        .eq('stokvel_id', stokvelId)
        .eq('status', 'executed')
        .gte('executed_at', period.from)
        .lte('executed_at', period.to),
  );
  if (payouts.missing) missing.push('payouts');

  // Verified expenses (Phase 8)
  const expenses = await safeSum(
    supabase,
    'expenses',
    'amount',
    (q) =>
      q
        .eq('stokvel_id', stokvelId)
        .eq('status', 'verified')
        .gte('expense_date', period.from)
        .lte('expense_date', period.to),
  );
  if (expenses.missing) missing.push('expenses');

  // Disbursed loans still outstanding (Phase 10)
  // principal − total_repaid, only for loans in 'disbursed' or 'repaying'
  let loansOutstanding = 0;
  {
    const res = await safeSelect<{
      principal: number;
      total_repaid: number | null;
    }>(supabase, 'loans', (q) =>
      q
        .eq('stokvel_id', stokvelId)
        .in('status', ['disbursed', 'repaying']),
    );
    if (res.missing) {
      missing.push('loans');
    } else {
      loansOutstanding = res.rows.reduce(
        (acc, r) => acc + Number(r.principal ?? 0) - Number(r.total_repaid ?? 0),
        0,
      );
    }
  }

  // Verified expenses must be subtracted from available
  const available =
    verifiedRec.value - payouts.value - expenses.value - loansOutstanding;

  // Owed = unpaid contributions (handled by arrears report, but computed here
  // so every report that surfaces money states can show it consistently).
  const owed = await computeOwed(supabase, stokvelId, period);

  return {
    states: {
      recorded: round2(recorded.value),
      verified: round2(verifiedRec.value),
      available: round2(available),
      owed: round2(owed),
    },
    missing,
  };
}

/**
 * Outstanding contribution obligations not yet covered by verified payments.
 * Uses the contribution_balances view if it exists (Phase 5), otherwise falls back.
 */
async function computeOwed(
  supabase: ReturnType<typeof createServerClient>,
  stokvelId: string,
  period: ReportPeriod,
): Promise<number> {
  // Prefer the view created in Phase 5.
  const view = await safeSelect<{ outstanding: number }>(
    supabase,
    'contribution_balances',
    (q) => q.eq('stokvel_id', stokvelId),
  );
  if (!view.missing) {
    return view.rows.reduce((acc, r) => acc + Number(r.outstanding ?? 0), 0);
  }

  // Fallback: sum contribution amounts due and subtract verified payments.
  const contributions = await safeSelect<{ amount: number }>(
    supabase,
    'contributions',
    (q) =>
      q
        .eq('stokvel_id', stokvelId)
        .gte('due_date', period.from)
        .lte('due_date', period.to),
  );
  if (contributions.missing) return 0;

  const payments = await safeSelect<{ amount: number }>(
    supabase,
    'payments',
    (q) =>
      q
        .eq('stokvel_id', stokvelId)
        .in('status', ['verified', 'reconciled'])
        .gte('payment_date', period.from)
        .lte('payment_date', period.to),
  );

  const due = contributions.rows.reduce(
    (a, r) => a + Number(r.amount ?? 0),
    0,
  );
  const paid = payments.missing
    ? 0
    : payments.rows.reduce((a, r) => a + Number(r.amount ?? 0), 0);
  return Math.max(0, due - paid);
}

/** Round to 2dp using banker-free standard rounding. */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** Get the stokvel row (name) for the report envelope. */
export async function loadStokvelName(
  supabase: ReturnType<typeof createServerClient>,
  stokvelId: string,
): Promise<string> {
  const { data } = await (supabase as any)
    .from('stokvels')
    .select('name')
    .eq('id', stokvelId)
    .maybeSingle();
  return data?.name ?? 'Unknown Stokvel';
}

/** Default period = current calendar month. */
export function defaultPeriod(): ReportPeriod {
  const now = new Date();
  const from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

/** Validate and normalise a period from query params. */
export function normalisePeriod(
  from?: string | null,
  to?: string | null,
): ReportPeriod {
  const def = defaultPeriod();
  const isoRe = /^\d{4}-\d{2}-\d{2}$/;
  const f = from && isoRe.test(from) ? from : def.from;
  const t = to && isoRe.test(to) ? to : def.to;
  return { from: f, to: t };
}