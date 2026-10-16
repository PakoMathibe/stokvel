'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Loader2, Trash2, AlertTriangle } from 'lucide-react'
import {
  ROLE_LABELS,
  STATUS_LABELS,
  type MembershipWithProfile,
  type MemberRole,
} from '@/lib/types/stokvel'
import {
  updateMemberRoleAction,
  removeMemberAction,
} from '@/lib/actions/invitations'

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

const ASSIGNABLE_ROLES: MemberRole[] = [
  'chairperson',
  'treasurer',
  'secretary',
  'member',
  'auditor',
]

export default function MembersTable({
  members,
  currentUserId,
  canManage,
}: {
  members: MembershipWithProfile[]
  currentUserId: string
  canManage: boolean
}) {
  const router = useRouter()
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [removing, setRemoving] = useState<MembershipWithProfile | null>(null)
  const [removingLoading, setRemovingLoading] = useState(false)

  async function handleRoleChange(membershipId: string, newRole: MemberRole) {
    setError(null)
    setPendingId(membershipId)
    const result = await updateMemberRoleAction(membershipId, newRole)
    setPendingId(null)
    if (!result.success) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  async function confirmRemove() {
    if (!removing) return
    setError(null)
    setRemovingLoading(true)
    const result = await removeMemberAction(removing.id)
    setRemovingLoading(false)
    if (!result.success) {
      setError(result.error)
      setRemoving(null)
      return
    }
    setRemoving(null)
    router.refresh()
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left px-5 py-3">Member</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Joined</th>
              {canManage && <th className="text-right px-5 py-3">Actions</th>}
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
              const isSelf = m.user_id === currentUserId
              const isBusy = pendingId === m.id

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
                          {isSelf && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              You
                            </span>
                          )}
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
                    {canManage && !isSelf ? (
                      <select
                        value={m.role}
                        disabled={isBusy}
                        onChange={(e) =>
                          handleRoleChange(m.id, e.target.value as MemberRole)
                        }
                        className="text-xs font-semibold rounded-md py-1 px-2 w-auto min-w-[130px]"
                      >
                        {ASSIGNABLE_ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          ROLE_STYLES[m.role] ?? ROLE_STYLES.member
                        }`}
                      >
                        {isBusy && (
                          <Loader2 size={11} className="animate-spin mr-1" />
                        )}
                        {ROLE_LABELS[m.role]}
                      </span>
                    )}
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
                  {canManage && (
                    <td className="px-5 py-4 text-right">
                      {!isSelf && m.status === 'active' && (
                        <button
                          onClick={() => setRemoving(m)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors disabled:opacity-40 px-2 py-1.5 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Remove confirmation */}
      {removing && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !removingLoading && setRemoving(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-700" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              Remove{' '}
              {removing.profile?.full_name || removing.profile?.email}?
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              They will lose access to this stokvel. Their historical records
              and audit trail are preserved. You can invite them again later.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={confirmRemove}
                disabled={removingLoading}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
              >
                {removingLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Removing…
                  </>
                ) : (
                  'Yes, remove'
                )}
              </button>
              <button
                onClick={() => setRemoving(null)}
                disabled={removingLoading}
                className="inline-flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-60 text-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}