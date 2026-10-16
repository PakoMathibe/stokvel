import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Users,
  Wallet,
  Calendar,
  Archive,
  TrendingUp,
} from 'lucide-react'
import { getStokvelById } from '@/lib/actions/stokvels'
import { getMoneyStatesAction } from '@/lib/actions/ledger'
import {
  STOKVEL_TYPE_LABELS,
  FREQUENCY_LABELS,
} from '@/lib/types/stokvel'
import MemberList from '@/components/dashboard/MemberList'
import StokvelActions from '@/components/dashboard/StokvelActions'

export const metadata = {
  title: 'Stokvel',
}

export default async function StokvelDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const stokvel = await getStokvelById(params.id)

  if (!stokvel) {
    notFound()
  }

  const moneyStates = await getMoneyStatesAction(params.id)

  const canManage = ['chairperson', 'secretary'].includes(
    stokvel.membership.role
  )
  const isArchived = stokvel.status === 'archived'
  const activeMembers = stokvel.members.filter((m) => m.status === 'active')

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard/stokvels"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to stokvels
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              {STOKVEL_TYPE_LABELS[stokvel.stokvel_type]}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
              Your role: {stokvel.membership.role}
            </span>
            {isArchived && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                <Archive size={10} />
                Archived
              </span>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
            {stokvel.name}
          </h1>
          {stokvel.description && (
            <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">
              {stokvel.description}
            </p>
          )}
        </div>
        <StokvelActions
          stokvelId={stokvel.id}
          status={stokvel.status}
          canManage={canManage}
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Wallet size={16} />}
          label="Contribution"
          value={`${stokvel.currency} ${stokvel.contribution_amount.toLocaleString()}`}
          sub={FREQUENCY_LABELS[stokvel.contribution_frequency]}
        />
        <SummaryCard
          icon={<Users size={16} />}
          label="Active members"
          value={String(activeMembers.length)}
          sub={
            stokvel.target_members
              ? `of ${stokvel.target_members} target`
              : 'no target set'
          }
        />
        <SummaryCard
          icon={<TrendingUp size={16} />}
          label="Verified to date"
          value={`${stokvel.currency} ${moneyStates.verified.toLocaleString()}`}
          sub={
            moneyStates.owed > 0
              ? `${stokvel.currency} ${moneyStates.owed.toLocaleString()} owed`
              : 'All contributions paid'
          }
        />
        <SummaryCard
          icon={<Calendar size={16} />}
          label="Started"
          value={new Date(stokvel.created_at).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
          sub={`by ${stokvel.membership.role}`}
        />
      </div>

      {/* Members section */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Members</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {activeMembers.length} active
              {stokvel.members.length > activeMembers.length &&
                ` · ${stokvel.members.length - activeMembers.length} other`}
            </p>
          </div>
          {canManage && (
            <Link
              href={`/dashboard/stokvels/${stokvel.id}/members`}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px"
            >
              <Users size={14} />
              Manage members
            </Link>
          )}
        </div>
        <MemberList members={stokvel.members} />
      </section>

      {/* Contributions section */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Contributions</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Generate obligations, track payments and chase arrears.
            </p>
          </div>
          <Link
            href={`/dashboard/stokvels/${stokvel.id}/contributions`}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-800 font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all hover:-translate-y-px"
          >
            <Wallet size={14} />
            View contributions
          </Link>
        </div>
      </section>
    </div>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-emerald-700">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {label}
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 tabular-nums">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-gray-500">{sub}</p>
    </div>
  )
}