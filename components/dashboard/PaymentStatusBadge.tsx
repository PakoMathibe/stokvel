import {
  PAYMENT_STATUS_LABELS,
  type PaymentStatus,
} from '@/lib/types/contribution'

const STYLES: Record<PaymentStatus, string> = {
  recorded: 'bg-blue-100 text-blue-800',
  verified: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800',
  reconciled: 'bg-emerald-200 text-emerald-900',
}

export default function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        STYLES[status] ?? STYLES.recorded
      }`}
    >
      {PAYMENT_STATUS_LABELS[status]}
    </span>
  )
}