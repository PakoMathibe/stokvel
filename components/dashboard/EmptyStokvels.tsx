import Link from 'next/link'
import { Users, Plus } from 'lucide-react'

export default function EmptyStokvels() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
        <Users size={22} className="text-emerald-700" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-gray-900">
        No stokvels yet
      </h2>
      <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
        Create your first stokvel to start tracking contributions, payouts, and
        members. It takes less than a minute.
      </p>
      <Link
        href="/dashboard/stokvels/new"
        className="mt-6 inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px text-sm"
      >
        <Plus size={15} />
        Create your first stokvel
      </Link>
    </div>
  )
}