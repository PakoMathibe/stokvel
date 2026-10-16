import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, User, Calendar, Wallet, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getContributionById } from '@/lib/actions/contributions'
import { listPaymentsForContribution } from '@/lib/actions/payments'
import ContributionStatusBadge from '@/components/dashboard/ContributionStatusBadge'
import ContributionDetailClient from '@/components/dashboard/ContributionDetailClient'

export const metadata = {
  title: 'Contribution',
}

export default async function ContributionDetailPage({
  params,
}: {
  params: { id: string; contributionId: string }
}) {
  const contribution = await getContributionById(params.contributionId)

  if (!contribution || contribution.stokvel_id !== params.id) {
    notFound()
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Caller's role in this stokvel
  const { data: callerMembership } = await supabase
    .from('memberships')
    .select('id, role')
    .eq('stokvel_id', params.id)
    .eq('user_id', user!.id)
    .eq('status', 'active')
    .maybeSingle()

  const role = callerMembership?.role ?? 'member'
  const isCommittee = ['chairperson', 'treasurer'].includes(role)
  const isOwner = callerMembership?.id === contribution.membership_id

  // Load stokvel for currency
  const { data: stokvel } = await supabase
    .from('stokvels')
    .select('currency')
    .eq('id', params.id)
    .single()

  const currency = stokvel?.currency ?? 'ZAR'

  const payments = await listPaymentsForContribution(params.contributionId)

  const name =
    contribution.member?.profile?.full_name ||
    contribution.member?.profile?.email ||
    'Unknown'
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const due =
    Number(contribution.amount_due) + Number(contribution.penalty_amount ?? 0)
  const paid = Number(contribution.amount_paid)
  const balance = due - paid

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/stokvels/${params.id}/contributions`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to contributions
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
            Contribution
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
            {contribution.period_label ?? 'Unnamed period'}
          </h1>
        </div>
        <ContributionStatusBadge status={contribution.status} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <User size={15} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Member
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800">
              {initials || <User size={13} />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {name}
              </p>
              {contribution.member?.profile?.email && (
                <p className="text-xs text-gray-500 truncate">
                  {contribution.member.profile.email}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet size={15} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Amount
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-gray-900 tabular-nums">
            {currency} {due.toLocaleString()}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {paid > 0
              ? `${currency} ${paid.toLocaleString()} verified`
              : 'No verified payments yet'}
          </p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-700">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Calendar size={15} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Due date
            </span>
          </div>
          <p className="mt-3 text-lg font-bold text-gray-900">
            {new Date(contribution.due_date).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p
            className={`mt-0.5 text-xs ${
              balance > 0 ? 'text-amber-700 font-semibold' : 'text-emerald-700'
            }`}
          >
            Balance: {currency} {balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Notes */}
      {contribution.notes && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-900">
                Notes
              </p>
              <p className="mt-1 text-sm text-amber-900/90 leading-relaxed">
                {contribution.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payments section */}
      <section>
        <ContributionDetailClient
          stokvelId={params.id}
          contributionId={params.contributionId}
          amountDue={due - paid}
          currency={currency}
          payments={payments}
          canRecord={isCommittee || isOwner}
          canVerify={isCommittee}
        />
      </section>
    </div>
  )
}