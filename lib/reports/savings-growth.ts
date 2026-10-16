// lib/reports/savings-growth.ts

import { createServerClient } from '@/lib/supabase/server';
import { loadStokvelName, round2, safeSelect } from './_helpers';
import type {
  ReportEnvelope,
  ReportPeriod,
  SavingsGrowthRow,
} from './types';

export async function getSavingsGrowthReport(
  stokvelId: string,
  period: ReportPeriod,
): Promise<ReportEnvelope<SavingsGrowthRow>> {
  const supabase = createServerClient();
  const name = await loadStokvelName(supabase, stokvelId);

  const payments = await safeSelect<{
    amount: number;
    status: string;
    payment_date: string;
  }>(supabase, 'payments', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .gte('payment_date', period.from)
      .lte('payment_date', period.to),
  );

  const map = new Map<string, SavingsGrowthRow>();
  const get = (label: string) => {
    let r = map.get(label);
    if (!r) {
      r = {
        period_label: label,
        verified_in: 0,
        recorded_in: 0,
        cumulative_verified: 0,
        cumulative_recorded: 0,
      };
      map.set(label, r);
    }
    return r;
  };

  for (const p of payments.rows) {
    const label = p.payment_date.slice(0, 7);
    const r = get(label);
    if (p.status === 'recorded') {
      r.recorded_in = round2(r.recorded_in + Number(p.amount ?? 0));
    }
    if (p.status === 'verified' || p.status === 'reconciled') {
      r.verified_in = round2(r.verified_in + Number(p.amount ?? 0));
    }
  }

  const rows = [...map.values()].sort((a, b) =>
    a.period_label.localeCompare(b.period_label),
  );

  let cumV = 0;
  let cumR = 0;
  for (const r of rows) {
    cumV = round2(cumV + r.verified_in);
    cumR = round2(cumR + r.recorded_in);
    r.cumulative_verified = cumV;
    r.cumulative_recorded = cumR;
  }

  return {
    generated_at: new Date().toISOString(),
    stokvel_id: stokvelId,
    stokvel_name: name,
    report_type: 'savings-growth',
    period,
    rows,
    totals: {
      total_verified: cumV,
      total_recorded: cumR,
      periods: rows.length,
    },
    meta: {
      partial: false,
      missing_dependencies: [],
    },
  };
}