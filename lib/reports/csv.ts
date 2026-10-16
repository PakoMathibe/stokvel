// lib/reports/csv.ts

/**
 * RFC 4180-compliant CSV serialiser with UTF-8 BOM.
 * The BOM ensures Excel on Windows renders non-ASCII (isiZulu, isiXhosa, Afrikaans) correctly.
 */

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = typeof value === 'string' ? value : String(value);
  // Quote if the cell contains a comma, quote, CR, or LF.
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export interface CsvColumn<TRow> {
  /** Header label shown in row 1. */
  header: string;
  /** Extract the cell value from a row. */
  value: (row: TRow) => unknown;
}

export function toCsv<TRow>(
  rows: TRow[],
  columns: CsvColumn<TRow>[],
): string {
  const header = columns.map((c) => escapeCell(c.header)).join(',');
  const lines = rows.map((row) =>
    columns.map((c) => escapeCell(c.value(row))).join(','),
  );
  return [header, ...lines].join('\r\n');
}

/** Full payload: BOM + CSV body. Ready to write to a Response. */
export function toCsvResponse<TRow>(
  rows: TRow[],
  columns: CsvColumn<TRow>[],
): string {
  return '\uFEFF' + toCsv(rows, columns);
}

/** Build a filename-safe slug. */
export function csvFilename(prefix: string, from: string, to: string): string {
  const safe = (s: string) => s.replace(/[^a-zA-Z0-9-]/g, '_');
  return `${safe(prefix)}_${safe(from)}_${safe(to)}.csv`;
}

/** Format a numeric amount as a plain decimal string with 2dp (no currency symbol). */
export function money(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '0.00';
  return n.toFixed(2);
}

/** Format an ISO date string as YYYY-MM-DD. */
export function isoDate(d: string | Date | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

/** Format an ISO timestamp as YYYY-MM-DD HH:MM:SS (UTC). */
export function isoDateTime(d: string | Date | null | undefined): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().replace('T', ' ').slice(0, 19);
}