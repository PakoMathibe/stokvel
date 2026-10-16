import { User } from 'lucide-react'
import {
  ROLE_LABELS,
  STATUS_LABELS,
  type MembershipWithProfile,
} from '@/lib/types/stokvel'

const ROLE_STYLES: Record<string, string> = {
  chairperson: 'bg-emerald-100 text-emerald-800',
  treasurer: 'bg-teal-100 text-teal-800',
  secretary: 'bg-cyan-100 text-cyan-800',
  member: 'bg-gray-100 text-gray-700',
  auditor: 'bg-blue-100 text-blue-800',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-700',
  resigned: 'bg-gray-100 text-gray-500',
}

export default function MemberList({
  members,
}: {
  members: MembershipWithProfile[]
}) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No members yet. Invite people to join this stokvel.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left px-5 py-3">Member</th>
            <th className="text-left px-5 py-3">Role</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const name = m.profile?.full_name || m.profile?.email || 'Unknown'
            const initials = name
              .split(' ')
              .slice(0, 2)
              .map((w) => w[0])
              .join('')
              .toUpperCase()

            return (
              <tr key={m.id}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center text-xs font-bold text-emerald-800 shrink-0">
                      {initials || <User size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {name}
                      </p>
                      {m.profile?.email && m.profile.full_name && (
                        <p className="text-xs text-gray-500 truncate">
                          {m.profile.email}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      ROLE_STYLES[m.role] ?? ROLE_STYLES.member
                    }`}
                  >
                    {ROLE_LABELS[m.role]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      STATUS_STYLES[m.status] ?? STATUS_STYLES.active
                    }`}
                  >
                    {STATUS_LABELS[m.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-gray-500">
                  {new Date(m.joined_at).toLocaleDateString('en-ZA', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}