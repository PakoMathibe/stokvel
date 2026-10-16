// lib/reports/income-expenditure.ts

import { createServerClient } from '@/lib/supabase/server';
import {
  computeMoneyStates,
  loadStokvelName,
  round2,
  safeSelect,
} from './_helpers';
import type {
  IncomeExpenditureRow,
  ReportEnvelope,
  ReportPeriod,
} from './types';

export async function getIncomeExpenditureReport(
  stokvelId: string,
  period: ReportPeriod,
): Promise<ReportEnvelope<IncomeExpenditureRow>> {
  const supabase = createServerClient();
  const name = await loadStokvelName(supabase, stokvelId);
  const missing: string[] = [];

  // --- INCOME: verified payments grouped by method (category proxy until
  //     payment_categories table ships). Use payment_method as the income
  //     category; if null, bucket as 'unspecified'.
  const payments = await safeSelect<{
    amount: number;
    status: string;
    payment_method: string | null;
  }>(supabase, 'payments', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .gte('payment_date', period.from)
      .lte('payment_date', period.to),
  );
  if (payments.missing) missing.push('payments');

  const incomeMap = new Map<string, IncomeExpenditureRow>();
  for (const p of payments.rows) {
    const cat = (p.payment_method ?? 'unspecified').toLowerCase();
    const row =
      incomeMap.get(cat) ??
      ({
        category: cat,
        kind: 'income',
        recorded: 0,
        verified: 0,
        count_recorded: 0,
        count_verified: 0,
      } as IncomeExpenditureRow);
    if (p.status === 'recorded') {
      row.recorded = round2(row.recorded + Number(p.amount ?? 0));
      row.count_recorded += 1;
    }
    if (p.status === 'verified' || p.status === 'reconciled') {
      row.verified = round2(row.verified + Number(p.amount ?? 0));
      row.count_verified += 1;
    }
    incomeMap.set(cat, row);
  }

  // --- EXPENSES: Phase 8. Return empty + flag partial.
  const expenses = await safeSelect<{
    amount: number;
    status: string;
    category: string | null;
  }>(supabase, 'expenses', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .gte('expense_date', period.from)
      .lte('expense_date', period.to),
  );
  if (expenses.missing) missing.push('expenses');

  const expenseMap = new Map<string, IncomeExpenditureRow>();
  for (const e of expenses.rows) {
    const cat = (e.category ?? 'uncategorised').toLowerCase();
    const row =
      expenseMap.get(cat) ??
      ({
        category: cat,
        kind: 'expense',
        recorded: 0,
        verified: 0,
        count_recorded: 0,
        count_verified: 0,
      } as IncomeExpenditureRow);
    if (e.status === 'recorded' || e.status === 'pending') {
      row.recorded = round2(row.recorded + Number(e.amount ?? 0));
      row.count_recorded += 1;
    }
    if (e.status === 'verified') {
      row.verified = round2(row.verified + Number(e.amount ?? 0));
      row.count_verified += 1;
    }
    expenseMap.set(cat, row);
  }

  const rows = [...incomeMap.values(), ...expenseMap.values()].sort((a, b) =>
    a.kind === b.kind
      ? a.category.localeCompare(b.category)
      : a.kind === 'income'
        ? -1
        : 1,
  );

  const incomeVerified = rows
    .filter((r) => r.kind === 'income')
    .reduce((a, r) => a + r.verified, 0);
  const expenseVerified = rows
    .filter((r) => r.kind === 'expense')
    .reduce((a, r) => a + r.verified, 0);
  const incomeRecorded = rows
    .filter((r) => r.kind === 'income')
    .reduce((a, r) => a + r.recorded, 0);
  const expenseRecorded = rows
    .filter((r) => r.kind === 'expense')
    .reduce((a, r) => a + r.recorded, 0);

  const { states, missing: moneyMissing } = await computeMoneyStates(
    supabase,
    stokvelId,
    period,
  );
  for (const m of moneyMissing) if (!missing.includes(m)) missing.push(m);

  return {
    generated_at: new Date().toISOString(),
    stokvel_id: stokvelId,
    stokvel_name: name,
    report_type: 'income-expenditure',
    period,
    rows,
    totals: {
      money_states: states,
      income_verified: round2(incomeVerified),
      expense_verified: round2(expenseVerified),
      net_verified: round2(incomeVerified - expenseVerified),
      income_recorded: round2(incomeRecorded),
      expense_recorded: round2(expenseRecorded),
      net_recorded: round2(incomeRecorded - expenseRecorded),
    },
    meta: {
      partial: missing.length > 0,
      missing_dependencies: missing,
      notes: missing.includes('expenses')
        ? ['Expense categories will populate after Phase 8 ships.']
        : [],
    },
  };
}