'use client';

import { Check, Minus, Eye, User } from 'lucide-react';
import type { PermissionRow, RoleKey } from '@/lib/content/types';
import Reveal from './Reveal';

const COLUMNS: { key: RoleKey; label: string }[] = [
  { key: 'chairperson', label: 'Chair' },
  { key: 'treasurer', label: 'Treasurer' },
  { key: 'secretary', label: 'Secretary' },
  { key: 'member', label: 'Member' },
  { key: 'auditor', label: 'Auditor' },
  { key: 'admin', label: 'Admin' },
];

function Cell({ value }: { value: boolean | 'own' | 'read' }) {
  if (value === true)
    return (
      <span
        className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
        title="Full access"
      >
        <Check size={13} strokeWidth={3} />
      </span>
    );
  if (value === 'read')
    return (
      <span
        className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-blue-100 text-blue-700"
        title="Read-only"
      >
        <Eye size={13} strokeWidth={2.5} />
      </span>
    );
  if (value === 'own')
    return (
      <span
        className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-amber-100 text-amber-700"
        title="Own records only"
      >
        <User size={13} strokeWidth={2.5} />
      </span>
    );
  return (
    <span
      className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-gray-100 text-gray-400"
      title="No access"
    >
      <Minus size={13} strokeWidth={2.5} />
    </span>
  );
}

export default function RoleMatrix({
  matrix,
  note,
}: {
  matrix: PermissionRow[];
  note?: string;
}) {
  return (
    <Reveal>
      <div className="table-wrap overflow-x-auto">
        <table className="min-w-[720px] w-full">
          <thead>
            <tr>
              <th className="text-left">Capability</th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="text-center">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="font-medium text-gray-800">{row.capability}</td>
                {COLUMNS.map((c) => (
                  <td key={c.key} className="text-center">
                    <Cell value={row[c.key]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && (
        <p className="mt-4 text-xs text-gray-500 leading-relaxed">{note}</p>
      )}
    </Reveal>
  );
}
