import {
  CONTRIBUTION_STATUS_LABELS,
  type ContributionStatus,
} from '@/lib/types/contribution'

const STYLES: Record<ContributionStatus, string> = {
  pending: 'bg-gray-100 text-gray-700',
  partial: 'bg-blue-100 text-blue-800',
  paid: 'bg-emerald-100 text-emerald-800',
  overdue: 'bg-red-100 text-red-800',
  waived: 'bg-amber-100 text-amber-800',
}

export default function ContributionStatusBadge({
  status,
}: {
  status: ContributionStatus
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        STYLES[status] ?? STYLES.pending
      }`}
    >
      {CONTRIBUTION_STATUS_LABELS[status]}
    </span>
  )
}