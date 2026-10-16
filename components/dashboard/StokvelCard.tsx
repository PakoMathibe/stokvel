import Link from 'next/link'
import { ArrowRight, Users, Archive } from 'lucide-react'
import {
  STOKVEL_TYPE_LABELS,
  FREQUENCY_LABELS,
  type StokvelWithMembership,
} from '@/lib/types/stokvel'

export default function StokvelCard({
  stokvel,
  memberCount,
}: {
  stokvel: StokvelWithMembership
  memberCount?: number
}) {
  const archived = stokvel.status === 'archived'

  return (
    <Link
      href={`/dashboard/stokvels/${stokvel.id}`}
      className={`group block bg-white border border-gray-200/80 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-1 ${
        archived ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
          {stokvel.membership.role}
        </span>
        <div className="flex items-center gap-1.5">
          {archived && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              <Archive size={10} />
              Archived
            </span>
          )}
          <ArrowRight
            size={14}
            className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>

      <h3 className="mt-3 text-base font-bold text-gray-900 tracking-tight line-clamp-2">
        {stokvel.name}
      </h3>

      {stokvel.description && (
        <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {stokvel.description}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            {STOKVEL_TYPE_LABELS[stokvel.stokvel_type]}
          </p>
          <p className="mt-0.5 text-xs font-bold text-gray-900 tabular-nums">
            {stokvel.currency} {stokvel.contribution_amount.toLocaleString()}{' '}
            <span className="text-gray-500 font-medium">
              / {FREQUENCY_LABELS[stokvel.contribution_frequency].toLowerCase()}
            </span>
          </p>
        </div>
        {typeof memberCount === 'number' && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={12} />
            {memberCount}
          </div>
        )}
      </div>
    </Link>
  )
}