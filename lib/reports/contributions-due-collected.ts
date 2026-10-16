// lib/reports/contributions-due-collected.ts

import { createServerClient } from '@/lib/supabase/server';
import {
  computeMoneyStates,
  loadStokvelName,
  round2,
  safeSelect,
} from './_helpers';
import type {
  ContributionsDueCollectedRow,
  ReportEnvelope,
  ReportPeriod,
} from './types';

export async function getContributionsDueCollectedReport(
  stokvelId: string,
  period: ReportPeriod,
): Promise<ReportEnvelope<ContributionsDueCollectedRow>> {
  const supabase = createServerClient();
  const name = await loadStokvelName(supabase, stokvelId);

  const contributions = await safeSelect<{
    amount: number;
    due_date: string;
  }>(supabase, 'contributions', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .gte('due_date', period.from)
      .lte('due_date', period.to),
  );

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

  // Bucket by YYYY-MM of due_date / payment_date.
  const bucket = (iso: string) => iso.slice(0, 7);

  const map = new Map<string, ContributionsDueCollectedRow>();
  const getRow = (label: string) => {
    let r = map.get(label);
    if (!r) {
      r = {
        period_label: label,
        due_amount: 0,
        due_count: 0,
        collected_verified: 0,
        collected_recorded: 0,
        outstanding: 0,
        collection_rate: 0,
      };
      map.set(label, r);
    }
    return r;
  };

  for (const c of contributions.rows) {
    const r = getRow(bucket(c.due_date));
    r.due_amount = round2(r.due_amount + Number(c.amount ?? 0));
    r.due_count += 1;
  }

  for (const p of payments.rows) {
    const r = getRow(bucket(p.payment_date));
    if (p.status === 'recorded') {
      r.collected_recorded = round2(r.collected_recorded + Number(p.amount ?? 0));
    }
    if (p.status === 'verified' || p.status === 'reconciled') {
      r.collected_verified = round2(r.collected_verified + Number(p.amount ?? 0));
    }
  }

  for (const r of map.values()) {
    r.outstanding = round2(Math.max(0, r.due_amount - r.collected_verified));
    r.collection_rate =
      r.due_amount > 0
        ? Math.min(1, r.collected_verified / r.due_amount)
        : 0;
  }

  const rows = [...map.values()].sort((a, b) =>
    a.period_label.localeCompare(b.period_label),
  );

  const { states, missing } = await computeMoneyStates(
    supabase,
    stokvelId,
    period,
  );

  const totalDue = round2(rows.reduce((a, r) => a + r.due_amount, 0));
  const totalVerified = round2(
    rows.reduce((a, r) => a + r.collected_verified, 0),
  );
  const totalRecorded = round2(
    rows.reduce((a, r) => a + r.collected_recorded, 0),
  );
  const totalOutstanding = round2(rows.reduce((a, r) => a + r.outstanding, 0));

  return {
    generated_at: new Date().toISOString(),
    stokvel_id: stokvelId,
    stokvel_name: name,
    report_type: 'contributions-due-collected',
    period,
    rows,
    totals: {
      money_states: states,
      total_due: totalDue,
      total_collected_verified: totalVerified,
      total_collected_recorded: totalRecorded,
      total_outstanding: totalOutstanding,
      overall_collection_rate:
        totalDue > 0 ? Math.min(1, totalVerified / totalDue) : 0,
    },
    meta: {
      partial: missing.length > 0,
      missing_dependencies: missing,
    },
  };
}