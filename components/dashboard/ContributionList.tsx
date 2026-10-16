import Link from 'next/link'
import { ArrowRight, User } from 'lucide-react'
import type { ContributionWithMember } from '@/lib/types/contribution'
import ContributionStatusBadge from './ContributionStatusBadge'

export default function ContributionList({
  contributions,
  stokvelId,
  currency = 'ZAR',
}: {
  contributions: ContributionWithMember[]
  stokvelId: string
  currency?: string
}) {
  if (contributions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
          No contributions yet. Click <strong>Generate contributions</strong>{' '}
          to create obligations for every active member.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr>
            <th className="text-left px-5 py-3">Member</th>
            <th className="text-left px-5 py-3">Period</th>
            <th className="text-right px-5 py-3">Due</th>
            <th className="text-right px-5 py-3">Paid</th>
            <th className="text-right px-5 py-3">Balance</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Due date</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((c) => {
            const name =
              c.member?.profile?.full_name ||
              c.member?.profile?.email ||
              'Unknown'
            const initials = name
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()

            const due = Number(c.amount_due) + Number(c.penalty_amount ?? 0)
            const paid = Number(c.amount_paid)
            const balance = due - paid
            const isOverdue =
              c.status === 'overdue' || c.status === 'partial'

            return (
              <tr key={c.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800 shrink-0">
                      {initials || <User size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {name}
                      </p>
                      {c.member?.profile?.email && c.member.profile.full_name && (
                        <p className="text-xs text-gray-500 truncate">
                          {c.member.profile.email}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-gray-600">
                  {c.period_label ?? '—'}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-gray-900 text-right tabular-nums">
                  {currency} {due.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 text-right tabular-nums">
                  {currency} {paid.toLocaleString()}
                </td>
                <td
                  className={`px-5 py-4 text-sm font-semibold text-right tabular-nums ${
                    balance > 0 && isOverdue
                      ? 'text-red-700'
                      : balance > 0
                      ? 'text-amber-700'
                      : 'text-emerald-700'
                  }`}
                >
                  {currency} {balance.toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <ContributionStatusBadge status={c.status} />
                </td>
                <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                  {new Date(c.due_date).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dashboard/stokvels/${stokvelId}/contributions/${c.id}`}
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