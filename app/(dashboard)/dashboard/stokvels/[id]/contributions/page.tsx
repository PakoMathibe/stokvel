import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStokvelById } from '@/lib/actions/stokvels'
import {
  listContributionsAction,
  getContributionSummaryAction,
  getArrearsAction,
} from '@/lib/actions/contributions'
import ContributionsPageClient from '@/components/dashboard/ContributionsPageClient'
import ArrearsTable from '@/components/dashboard/ArrearsTable'

export const metadata = {
  title: 'Contributions',
}

export default async function StokvelContributionsPage({
  params,
}: {
  params: { id: string }
}) {
  const stokvel = await getStokvelById(params.id)
  if (!stokvel) notFound()

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  const [contributions, summary, arrears] = await Promise.all([
    listContributionsAction(params.id),
    getContributionSummaryAction(params.id),
    getArrearsAction(params.id),
  ])

  const canManage = ['chairperson', 'treasurer'].includes(
    stokvel.membership.role
  )

  return (
    <div className="space-y-10">
      <Link
        href={`/dashboard/stokvels/${stokvel.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to {stokvel.name}
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Contributions
        </h1>
        <p className="mt-2 text-gray-600">
          Every obligation, payment and balance for {stokvel.name}.
        </p>
      </div>

      <ContributionsPageClient
        stokvelId={stokvel.id}
        currency={stokvel.currency}
        defaultAmount={Number(stokvel.contribution_amount)}
        contributions={contributions}
        summary={summary}
        canManage={canManage}
      />

      {/* Arrears section */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">Arrears</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Outstanding contributions aged by days late
          </p>
        </div>
        <ArrearsTable
          rows={arrears}
          stokvelId={stokvel.id}
          currency={stokvel.currency}
        />
      </section>
    </div>
  )
}