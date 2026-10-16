// lib/reports/types.ts

export type ReportType =
  | 'income-expenditure'
  | 'contributions-due-collected'
  | 'arrears'
  | 'payout-schedules'
  | 'cash-position'
  | 'expenses-by-category'
  | 'savings-growth'
  | 'investment-performance'
  | 'member-statement'
  | 'audit-trail'
  | 'loans-outstanding';

export interface ReportPeriod {
  /** ISO date, inclusive */
  from: string;
  /** ISO date, inclusive */
  to: string;
}

/** The four money states — never collapse these. */
export interface MoneyStates {
  /** Sum of payment rows with status='recorded' (not yet verified). */
  recorded: number;
  /** Sum of payment rows with status='verified' or 'reconciled'. */
  verified: number;
  /** verified − (executed payouts + disbursed loans outstanding + verified expenses). */
  available: number;
  /** Contributions owing (obligations not covered by verified payments). */
  owed: number;
}

export interface ReportMeta {
  /** True if the report depends on tables that don't exist yet. */
  partial: boolean;
  /** Names of tables/features that are not yet present. */
  missing_dependencies: string[];
  /** Optional notes for UI. */
  notes?: string[];
}

export interface ReportTotals {
  money_states?: MoneyStates;
  /** Report-specific numeric aggregates. */
  [key: string]: number | MoneyStates | undefined;
}

export interface ReportEnvelope<TRow> {
  generated_at: string;
  stokvel_id: string;
  stokvel_name: string;
  report_type: ReportType;
  period: ReportPeriod;
  rows: TRow[];
  totals: ReportTotals;
  meta: ReportMeta;
}

/** Row shapes — each report defines its own. */

export interface IncomeExpenditureRow {
  category: string;
  kind: 'income' | 'expense';
  recorded: number;
  verified: number;
  count_recorded: number;
  count_verified: number;
}

export interface ContributionsDueCollectedRow {
  period_label: string;      // e.g. '2025-01'
  due_amount: number;
  due_count: number;
  collected_verified: number;
  collected_recorded: number;
  outstanding: number;
  collection_rate: number;   // 0..1
}

export interface ArrearsRow {
  membership_id: string;
  member_name: string;
  member_number: string | null;
  total_due: number;
  total_paid_verified: number;
  outstanding: number;
  oldest_due_date: string | null;
  days_overdue: number;
}

export interface CashPositionRow {
  state: keyof MoneyStates;
  amount: number;
  description: string;
}

export interface SavingsGrowthRow {
  period_label: string;   // 'YYYY-MM'
  verified_in: number;
  recorded_in: number;
  cumulative_verified: number;
  cumulative_recorded: number;
}

export interface MemberStatementRow {
  entry_date: string;
  entry_type: 'contribution_due' | 'payment_recorded' | 'payment_verified'
    | 'payment_rejected' | 'payout' | 'expense' | 'adjustment';
  reference: string | null;
  description: string;
  debit: number;   // increases what member owes
  credit: number;  // reduces what member owes
  balance: number;
}

export interface AuditTrailRow {
  occurred_at: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  summary: string;
}