// lib/reports/audit-trail.ts

import { createServerClient } from '@/lib/supabase/server';
import { loadStokvelName, safeSelect } from './_helpers';
import type { AuditTrailRow, ReportEnvelope, ReportPeriod } from './types';

export async function getAuditTrailReport(
  stokvelId: string,
  period: ReportPeriod,
  limit = 5000,
): Promise<ReportEnvelope<AuditTrailRow>> {
  const supabase = createServerClient();
  const name = await loadStokvelName(supabase, stokvelId);

  const logs = await safeSelect<{
    id: string;
    occurred_at: string;
    actor_id: string | null;
    action: string;
    table_name: string;
    record_id: string | null;
    new_values: Record<string, unknown> | null;
    old_values: Record<string, unknown> | null;
  }>(supabase, 'audit_log', (q) =>
    q
      .eq('stokvel_id', stokvelId)
      .gte('occurred_at', period.from + 'T00:00:00Z')
      .lte('occurred_at', period.to + 'T23:59:59Z')
      .order('occurred_at', { ascending: false })
      .limit(limit),
  );

  // Resolve actor names
  const actorIds = Array.from(
    new Set(logs.rows.map((l) => l.actor_id).filter(Boolean) as string[]),
  );
  const actorNames = new Map<string, string>();
  if (actorIds.length > 0) {
    const profs = await safeSelect<{ id: string; full_name: string | null }>(
      supabase,
      'profiles',
      (q) => q.in('id', actorIds),
    );
    for (const p of profs.rows) {
      actorNames.set(p.id, p.full_name ?? 'Unknown');
    }
  }

  const rows: AuditTrailRow[] = logs.rows.map((l) => ({
    occurred_at: l.occurred_at,
    actor_id: l.actor_id,
    actor_name: l.actor_id ? actorNames.get(l.actor_id) ?? null : null,
    action: l.action,
    table_name: l.table_name,
    record_id: l.record_id,
    summary: summarise(l.new_values, l.old_values, l.action, l.table_name),
  }));

  return {
    generated_at: new Date().toISOString(),
    stokvel_id: stokvelId,
    stokvel_name: name,
    report_type: 'audit-trail',
    period,
    rows,
    totals: {
      entries: rows.length,
    },
    meta: {
      partial: logs.missing,
      missing_dependencies: logs.missing ? ['audit_log'] : [],
    },
  };
}

function summarise(
  newValues: Record<string, unknown> | null,
  oldValues: Record<string, unknown> | null,
  action: string,
  table: string,
): string {
  if (action === 'INSERT' && newValues) {
    const amount = newValues.amount ?? newValues.principal;
    return `Created ${table}${amount ? ` (amount ${amount})` : ''}`;
  }
  if (action === 'UPDATE' && newValues && oldValues) {
    const changed: string[] = [];
    for (const k of Object.keys(newValues)) {
      if (newValues[k] !== oldValues[k]) changed.push(k);
    }
    return `Updated ${table}${changed.length ? `: ${changed.join(', ')}` : ''}`;
  }
  if (action === 'DELETE') {
    return `Deleted ${table}`;
  }
  return `${action} ${table}`;
}