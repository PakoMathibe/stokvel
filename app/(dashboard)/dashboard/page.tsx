// app/(dashboard)/dashboard/page.tsx
import Link from 'next/link'
import { ArrowRight, Users, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStokvelsForUser } from '@/lib/actions/stokvels'
import { STOKVEL_TYPE_LABELS } from '@/lib/types/stokvel'

export const metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const stokvels = await getStokvelsForUser()
  const activeStokvels = stokvels.filter((s) => s.status === 'active')

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome, {profile?.full_name?.split(' ')[0] || 'there'}.
          </h1>
          <p className="mt-2 text-gray-600">
            {activeStokvels.length === 0
              ? "You're not in any stokvel yet. Create your first one to get started."
              : `You're a member of ${activeStokvels.length} stokvel${
                  activeStokvels.length === 1 ? '' : 's'
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

      {activeStokvels.length > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Your stokvels
            </h2>
            <Link
              href="/dashboard/stokvels"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStokvels.slice(0, 6).map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/stokvels/${s.id}`}
                className="group block bg-white border border-gray-200/80 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                    {s.membership.role}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all"
                  />
                </div>
                <h3 className="mt-3 text-base font-bold text-gray-900 tracking-tight line-clamp-2">
                  {s.name}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {STOKVEL_TYPE_LABELS[s.stokvel_type]} ·{' '}
                  {s.currency} {s.contribution_amount.toLocaleString()} /{' '}
                  {s.contribution_frequency}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <Users size={20} className="text-emerald-700" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">
            No stokvels yet
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Create your first stokvel, or wait for a chairperson to invite you
            to one.
          </p>
          <Link
            href="/dashboard/stokvels/new"
            className="mt-6 inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px text-sm"
          >
            <Plus size={15} />
            Create your first stokvel
          </Link>
        </div>
      )}
    </div>
  )
}