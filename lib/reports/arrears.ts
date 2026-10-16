// lib/reports/arrears.ts

import { createServerClient } from '@/lib/supabase/server';
import { loadStokvelName, round2, safeSelect } from './_helpers';
import type { ArrearsRow, ReportEnvelope, ReportPeriod } from './types';

export async function getArrearsReport(
  stokvelId: string,
  period: ReportPeriod,
): Promise<ReportEnvelope<ArrearsRow>> {
  const supabase = createServerClient();
  const name = await loadStokvelName(supabase, stokvelId);

  // Pull all unpaid contributions (not just in-period — arrears is cumulative).
  const contributions = await safeSelect<{
    id: string;
    membership_id: string;
    amount: number;
    due_date: string;
    status: string;
  }>(supabase, 'contributions', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .lte('due_date', period.to)
      .in('status', ['due', 'overdue', 'partial']),
  );

  const payments = await safeSelect<{
    contribution_id: string | null;
    amount: number;
    status: string;
  }>(supabase, 'payments', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .in('status', ['verified', 'reconciled']),
  );

  const memberships = await safeSelect<{
    id: string;
    member_number: string | null;
    profiles: { full_name: string | null } | { full_name: string | null }[] | null;
  }>(supabase, 'memberships', (q) =>
    q.eq('stokvel_id', stokvelId).eq('status', 'active'),
  );

  const paidByContribution = new Map<string, number>();
  for (const p of payments.rows) {
    if (!p.contribution_id) continue;
    paidByContribution.set(
      p.contribution_id,
      round2((paidByContribution.get(p.contribution_id) ?? 0) + Number(p.amount ?? 0)),
    );
  }

  const memberName = (m: (typeof memberships.rows)[number]): string => {
    if (!m.profiles) return 'Unknown member';
    const p = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    return p?.full_name ?? 'Unknown member';
  };

  const membershipById = new Map(memberships.rows.map((m) => [m.id, m]));

  // Aggregate arrears per membership.
  const perMember = new Map<string, ArrearsRow>();
  for (const c of contributions.rows) {
    const paid = paidByContribution.get(c.id) ?? 0;
    const outstanding = round2(Math.max(0, Number(c.amount ?? 0) - paid));
    if (outstanding <= 0) continue;

    const m = membershipById.get(c.membership_id);
    const row =
      perMember.get(c.membership_id) ??
      ({
        membership_id: c.membership_id,
        member_name: m ? memberName(m) : 'Unknown member',
        member_number: m?.member_number ?? null,
        total_due: 0,
        total_paid_verified: 0,
        outstanding: 0,
        oldest_due_date: null,
        days_overdue: 0,
      } as ArrearsRow);

    row.total_due = round2(row.total_due + Number(c.amount ?? 0));
    row.total_paid_verified = round2(row.total_paid_verified + paid);
    row.outstanding = round2(row.outstanding + outstanding);
    if (!row.oldest_due_date || c.due_date < row.oldest_due_date) {
      row.oldest_due_date = c.due_date;
    }
    perMember.set(c.membership_id, row);
  }

  const now = new Date();
  for (const r of perMember.values()) {
    if (r.oldest_due_date) {
      const d = new Date(r.oldest_due_date);
      r.days_overdue = Math.max(
        0,
        Math.floor((now.getTime() - d.getTime()) / 86400000),
      );
    }
  }

  const rows = [...perMember.values()]
    .filter((r) => r.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding);

  const totalOutstanding = round2(rows.reduce((a, r) => a + r.outstanding, 0));

  return {
    generated_at: new Date().toISOString(),
    stokvel_id: stokvelId,
    stokvel_name: name,
    report_type: 'arrears',
    period,
    rows,
    totals: {
      total_outstanding: totalOutstanding,
      members_in_arrears: rows.length,
      total_due: round2(rows.reduce((a, r) => a + r.total_due, 0)),
      total_paid_verified: round2(
        rows.reduce((a, r) => a + r.total_paid_verified, 0),
      ),
    },
    meta: {
      partial: false,
      missing_dependencies: [],
    },
  };
}