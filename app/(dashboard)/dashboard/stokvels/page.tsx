import Link from 'next/link'
import { Plus, Archive } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStokvelsForUser } from '@/lib/actions/stokvels'
import StokvelCard from '@/components/dashboard/StokvelCard'
import EmptyStokvels from '@/components/dashboard/EmptyStokvels'

export const metadata = {
  title: 'Stokvels',
}

export default async function StokvelsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const stokvels = await getStokvelsForUser()

  // Count members for each stokvel (single query)
  const stokvelIds = stokvels.map((s) => s.id)
  const memberCounts = new Map<string, number>()

  if (stokvelIds.length > 0) {
    const { data: counts } = await supabase
      .from('memberships')
      .select('stokvel_id')
      .in('stokvel_id', stokvelIds)
      .eq('status', 'active')

    counts?.forEach((row: { stokvel_id: string }) => {
      memberCounts.set(
        row.stokvel_id,
        (memberCounts.get(row.stokvel_id) ?? 0) + 1
      )
    })
  }

  const active = stokvels.filter((s) => s.status === 'active')
  const archived = stokvels.filter((s) => s.status === 'archived')

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Your stokvels
          </h1>
          <p className="mt-2 text-gray-600">
            {stokvels.length === 0
              ? 'You are not in any stokvel yet.'
              : `${active.length} active${
                  archived.length > 0
                    ? `, ${archived.length} archived`
                    : ''
                }.`}
          </p>
        </div>
        <Link
          href="/dashboard/stokvels/new"
          className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px text-sm"
        >
          <Plus size={15} />
          New stokvel
        </Link>
      </div>

      {stokvels.length === 0 ? (
        <EmptyStokvels />
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
                Active
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((s) => (
                  <StokvelCard
                    key={s.id}
                    stokvel={s}
                    memberCount={memberCounts.get(s.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {archived.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <Archive size={13} />
                Archived
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {archived.map((s) => (
                  <StokvelCard
                    key={s.id}
                    stokvel={s}
                    memberCount={memberCounts.get(s.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}