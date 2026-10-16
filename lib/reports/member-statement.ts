// lib/reports/member-statement.ts

import { createServerClient } from '@/lib/supabase/server';
import { loadStokvelName, round2, safeSelect } from './_helpers';
import type {
  MemberStatementRow,
  ReportEnvelope,
  ReportPeriod,
} from './types';

export async function getMemberStatementReport(
  stokvelId: string,
  membershipId: string,
  period: ReportPeriod,
): Promise<ReportEnvelope<MemberStatementRow>> {
  const supabase = createServerClient();
  const name = await loadStokvelName(supabase, stokvelId);

  // Contributions due for this member
  const contributions = await safeSelect<{
    id: string;
    amount: number;
    due_date: string;
    status: string;
    reference: string | null;
  }>(supabase, 'contributions', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .eq('membership_id', membershipId)
      .gte('due_date', period.from)
      .lte('due_date', period.to),
  );

  // Payments for this member
  const payments = await safeSelect<{
    id: string;
    amount: number;
    status: string;
    payment_date: string;
    reference: string | null;
    payment_method: string | null;
  }>(supabase, 'payments', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .eq('membership_id', membershipId)
      .gte('payment_date', period.from)
      .lte('payment_date', period.to),
  );

  const entries: MemberStatementRow[] = [];

  for (const c of contributions.rows) {
    entries.push({
      entry_date: c.due_date,
      entry_type: 'contribution_due',
      reference: c.reference,
      description: `Contribution due (status: ${c.status})`,
      debit: round2(Number(c.amount ?? 0)),
      credit: 0,
      balance: 0,
    });
  }

  for (const p of payments.rows) {
    const kind: MemberStatementRow['entry_type'] =
      p.status === 'recorded'
        ? 'payment_recorded'
        : p.status === 'verified' || p.status === 'reconciled'
          ? 'payment_verified'
          : 'adjustment';
    entries.push({
      entry_date: p.payment_date,
      entry_type: kind,
      reference: p.reference,
      description: `Payment ${p.status}${p.payment_method ? ` via ${p.payment_method}` : ''}`,
      debit: 0,
      credit: round2(Number(p.amount ?? 0)),
      balance: 0,
    });
  }

  entries.sort((a, b) =>
    a.entry_date === b.entry_date
      ? a.entry_type.localeCompare(b.entry_type)
      : a.entry_date.localeCompare(b.entry_date),
  );

  let running = 0;
  for (const e of entries) {
    running = round2(running + e.debit - e.credit);
    e.balance = running;
  }

  const totalDue = round2(
    entries.reduce((a, e) => a + e.debit, 0),
  );
  const totalPaid = round2(
    entries
      .filter((e) => e.entry_type === 'payment_verified')
      .reduce((a, e) => a + e.credit, 0),
  );

  return {
    generated_at: new Date().toISOString(),
    stokvel_id: stokvelId,
    stokvel_name: name,
    report_type: 'member-statement',
    period,
    rows: entries,
    totals: {
      total_due: totalDue,
      total_paid_verified: totalPaid,
      closing_balance: running,
    },
    meta: {
      partial: false,
      missing_dependencies: [],
    },
  };
}