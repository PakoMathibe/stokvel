// lib/reports/cash-position.ts

import { createServerClient } from '@/lib/supabase/server';
import {
  computeMoneyStates,
  loadStokvelName,
  round2,
} from './_helpers';
import type {
  CashPositionRow,
  ReportEnvelope,
  ReportPeriod,
} from './types';

export async function getCashPositionReport(
  stokvelId: string,
  period: ReportPeriod,
): Promise<ReportEnvelope<CashPositionRow>> {
  const supabase = createServerClient();
  const name = await loadStokvelName(supabase, stokvelId);
  const { states, missing } = await computeMoneyStates(
    supabase,
    stokvelId,
    period,
  );

  const rows: CashPositionRow[] = [
    {
      state: 'recorded',
      amount: states.recorded,
      description:
        'Payments recorded but not yet verified. Does not count toward available money.',
    },
    {
      state: 'verified',
      amount: states.verified,
      description: 'Verified or reconciled payments in the selected period.',
    },
    {
      state: 'available',
      amount: states.available,
      description:
        'Verified income minus executed payouts, verified expenses, and outstanding loan principal.',
    },
    {
      state: 'owed',
      amount: states.owed,
      description:
        'Contribution obligations not yet covered by verified payments (arrears).',
    },
  ];

  return {
    generated_at: new Date().toISOString(),
    stokvel_id: stokvelId,
    stokvel_name: name,
    report_type: 'cash-position',
    period,
    rows,
    totals: {
      money_states: states,
    },
    meta: {
      partial: missing.length > 0,
      missing_dependencies: missing,
      notes:
        missing.length > 0
          ? [
              `Available money currently excludes: ${missing.join(', ')}. It will include them automatically once those phases ship.`,
            ]
          : [],
    },
  };
}

export function cashPositionCsvRows(
  rows: CashPositionRow[],
): Array<{ state: string; amount: number; description: string }> {
  return rows.map((r) => ({
    state: r.state,
    amount: round2(r.amount),
    description: r.description,
  }));
}