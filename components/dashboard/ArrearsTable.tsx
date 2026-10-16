import Link from 'next/link'
import { ArrowRight, AlertTriangle, User } from 'lucide-react'
import type { ArrearsRow } from '@/lib/types/contribution'

export default function ArrearsTable({
  rows,
  stokvelId,
  currency = 'ZAR',
}: {
  rows: ArrearsRow[]
  stokvelId: string
  currency?: string
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center">
        <p className="text-sm text-emerald-800 font-medium">
          No arrears. Everyone is up to date.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            <th className="text-left px-5 py-3">Member</th>
            <th className="text-right px-5 py-3">Total owed</th>
            <th className="text-right px-5 py-3">Contributions</th>
            <th className="text-left px-5 py-3">Oldest due</th>
            <th className="text-right px-5 py-3">Days late</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const name = row.member_name || row.member_email || 'Unknown'
            const initials = name
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()

            const severity =
              row.days_late >= 60
                ? 'red'
                : row.days_late >= 30
                ? 'amber'
                : 'gray'

            const severityClass = {
              red: 'bg-red-50 text-red-800 border-red-200',
              amber: 'bg-amber-50 text-amber-800 border-amber-200',
              gray: 'bg-gray-100 text-gray-700 border-gray-200',
            }[severity]

            return (
              <tr key={row.membership_id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-900 shrink-0">
                      {initials || <User size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {name}
                      </p>
                      {row.member_email && row.member_name && (
                        <p className="text-xs text-gray-500 truncate">
                          {row.member_email}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-red-700 text-right tabular-nums whitespace-nowrap">
                  {currency} {row.total_owed.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-xs text-gray-600 text-right">
                  {row.contributions_count}
                </td>
                <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                  {new Date(row.oldest_due_date).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${severityClass}`}
                  >
                    {severity === 'red' && <AlertTriangle size={11} />}
                    {row.days_late} day{row.days_late === 1 ? '' : 's'}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dashboard/stokvels/${stokvelId}/contributions?member=${row.membership_id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    View
                    <ArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}