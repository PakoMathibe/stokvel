// lib/reports/index.ts

export * from './types';
export * from './csv';
export * from './_helpers';

export { getIncomeExpenditureReport } from './income-expenditure';
export { getContributionsDueCollectedReport } from './contributions-due-collected';
export { getArrearsReport } from './arrears';
export { getCashPositionReport, cashPositionCsvRows } from './cash-position';
export { getSavingsGrowthReport } from './savings-growth';
export { getMemberStatementReport } from './member-statement';
export { getAuditTrailReport } from './audit-trail';

import type { ReportType } from './types';

export const ALL_REPORT_TYPES: ReportType[] = [
  'income-expenditure',
  'contributions-due-collected',
  'arrears',
  'payout-schedules',
  'cash-position',
  'expenses-by-category',
  'savings-growth',
  'investment-performance',
  'member-statement',
  'audit-trail',
  'loans-outstanding',
];

/** Reports that are fully implementable with Phase 5 data. */
export const AVAILABLE_REPORTS: ReportType[] = [
  'income-expenditure',
  'contributions-due-collected',
  'arrears',
  'cash-position',
  'savings-growth',
  'member-statement',
  'audit-trail',
];

/** Reports that will be unlocked in later phases. */
export const PENDING_REPORTS: ReportType[] = [
  'payout-schedules',
  'expenses-by-category',
  'investment-performance',
  'loans-outstanding',
];