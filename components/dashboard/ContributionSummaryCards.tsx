import { Wallet, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import type { ContributionSummary } from '@/lib/types/contribution'

export default function ContributionSummaryCards({
  summary,
  currency = 'ZAR',
}: {
  summary: ContributionSummary
  currency?: string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={<Wallet size={16} />}
        label="Total due"
        value={`${currency} ${summary.total_due.toLocaleString()}`}
        sub={`${summary.members_pending + summary.members_partial + summary.members_overdue + summary.members_paid + summary.members_waived} contributions`}
      />
      <Card
        icon={<CheckCircle2 size={16} />}
        label="Total paid"
        value={`${currency} ${summary.total_paid.toLocaleString()}`}
        sub={`${summary.members_paid} fully paid`}
        tone="emerald"
      />
      <Card
        icon={<AlertCircle size={16} />}
        label="Outstanding"
        value={`${currency} ${summary.total_outstanding.toLocaleString()}`}
        sub={`${summary.members_overdue} overdue · ${summary.members_partial} partial`}
        tone={
          summary.total_outstanding > 0 ? 'amber' : 'emerald'
        }
      />
      <Card
        icon={<Clock size={16} />}
        label="Pending"
        value={String(summary.members_pending)}
        sub="awaiting payment"
      />
    </div>
  )
}

function Card({
  icon,
  label,
  value,
  sub,
  tone = 'default',
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  tone?: 'default' | 'emerald' | 'amber'
}) {
  const tones = {
    default: {
      wrap: 'bg-white border-gray-200/80',
      icon: 'bg-emerald-50 text-emerald-700',
      value: 'text-gray-900',
    },
    emerald: {
      wrap: 'bg-emerald-50/60 border-emerald-200',
      icon: 'bg-white text-emerald-700',
      value: 'text-emerald-900',
    },
    amber: {
      wrap: 'bg-amber-50/60 border-amber-200',
      icon: 'bg-white text-amber-700',
      value: 'text-amber-900',
    },
  }
  const t = tones[tone]

  return (
    <div className={`rounded-2xl border ${t.wrap} p-5`}>
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.icon}`}
        >
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {label}
        </span>
      </div>
      <p className={`mt-3 text-2xl font-extrabold tracking-tight tabular-nums ${t.value}`}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">{sub}</p>
    </div>
  )
}