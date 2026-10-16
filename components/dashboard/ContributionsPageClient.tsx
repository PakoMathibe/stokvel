'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type {
  ContributionWithMember,
  ContributionSummary,
  ContributionStatus,
} from '@/lib/types/contribution'
import { CONTRIBUTION_STATUS_LABELS } from '@/lib/types/contribution'
import ContributionList from './ContributionList'
import ContributionSummaryCards from './ContributionSummaryCards'
import GenerateContributionsDialog from './GenerateContributionsDialog'

const STATUS_FILTERS: { key: ContributionStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: CONTRIBUTION_STATUS_LABELS.pending },
  { key: 'partial', label: CONTRIBUTION_STATUS_LABELS.partial },
  { key: 'overdue', label: CONTRIBUTION_STATUS_LABELS.overdue },
  { key: 'paid', label: CONTRIBUTION_STATUS_LABELS.paid },
  { key: 'waived', label: CONTRIBUTION_STATUS_LABELS.waived },
]

export default function ContributionsPageClient({
  stokvelId,
  currency,
  defaultAmount,
  contributions,
  summary,
  canManage,
}: {
  stokvelId: string
  currency: string
  defaultAmount: number
  contributions: ContributionWithMember[]
  summary: ContributionSummary
  canManage: boolean
}) {
  const [generating, setGenerating] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ContributionStatus | 'all'>(
    'all'
  )
  const [periodFilter, setPeriodFilter] = useState<string>('all')

  const periods = Array.from(
    new Set(
      contributions
        .map((c) => c.period_label)
        .filter((p): p is string => !!p)
    )
  ).sort()

  const filtered = contributions.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (periodFilter !== 'all' && c.period_label !== periodFilter) return false
    return true
  })

  return (
    <div className="space-y-8">
      <ContributionSummaryCards summary={summary} currency={currency} />

      <section>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Contributions</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {filtered.length} of {contributions.length} shown
            </p>
          </div>
          {canManage && (
            <button
              onClick={() => setGenerating(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px text-sm"
            >
              <Plus size={15} />
              Generate contributions
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((f) => {
              const active = statusFilter === f.key
              return (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {periods.length > 1 && (
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-md w-auto min-w-[140px]"
            >
              <option value="all">All periods</option>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          )}
        </div>

        <ContributionList
          contributions={filtered}
          stokvelId={stokvelId}
          currency={currency}
        />
      </section>

      {generating && (
        <GenerateContributionsDialog
          stokvelId={stokvelId}
          defaultAmount={defaultAmount}
          currency={currency}
          onClose={() => setGenerating(false)}
        />
      )}
    </div>
  )
}