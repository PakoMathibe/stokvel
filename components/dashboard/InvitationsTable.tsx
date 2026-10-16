'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Mail,
  MessageCircle,
  Link2,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import type { InvitationWithMeta } from '@/lib/types/invitation'
import { INVITATION_STATUS_LABELS } from '@/lib/types/invitation'
import { ROLE_LABELS } from '@/lib/types/stokvel'
import {
  revokeInvitationAction,
  resendInvitationAction,
} from '@/lib/actions/invitations'

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  declined: 'bg-gray-100 text-gray-600',
  expired: 'bg-gray-100 text-gray-500',
  revoked: 'bg-red-50 text-red-700',
}

const CHANNEL_ICONS = {
  email: Mail,
  whatsapp: MessageCircle,
  link: Link2,
}

export default function InvitationsTable({
  invitations,
  canManage,
}: {
  invitations: InvitationWithMeta[]
  canManage: boolean
}) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (invitations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No invitations sent yet. Invite your first member to get started.
        </p>
      </div>
    )
  }

  async function handleResend(id: string) {
    setError(null)
    setBusyId(id)
    const res = await resendInvitationAction(id)
    setBusyId(null)
    if (!res.success) {
      setError(res.error)
      return
    }
    // Copy new link to clipboard for convenience
    try {
      await navigator.clipboard.writeText(res.data.inviteUrl)
    } catch {
      /* clipboard may be blocked */
    }
    router.refresh()
  }

  async function handleRevoke(id: string) {
    setError(null)
    setBusyId(id)
    const res = await revokeInvitationAction(id)
    setBusyId(null)
    if (!res.success) {
      setError(res.error)
      return
    }
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
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              <th className="text-left px-5 py-3">Invitee</th>
              <th className="text-left px-5 py-3">Role</th>
              <th className="text-left px-5 py-3">Sent</th>
              <th className="text-left px-5 py-3">Status</th>
              {canManage && <th className="text-right px-5 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {invitations.map((inv) => {
              const ChannelIcon = CHANNEL_ICONS[inv.invite_channel] ?? Link2
              const contact = inv.email || inv.phone || 'Link only'
              const isBusy = busyId === inv.id
              const canResend =
                inv.status === 'pending' ||
                inv.status === 'expired' ||
                inv.status === 'revoked'

              return (
                <tr key={inv.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <ChannelIcon size={15} className="text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {contact}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          via {inv.invite_channel}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-700 font-medium">
                    {ROLE_LABELS[inv.role]}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500">
                    {new Date(inv.created_at).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        STATUS_STYLES[inv.status] ?? STATUS_STYLES.pending
                      }`}
                    >
                      {inv.is_expired && inv.status === 'pending'
                        ? 'Expired'
                        : INVITATION_STATUS_LABELS[inv.status]}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {canResend && (
                        <button
                          onClick={() => handleResend(inv.id)}
                          disabled={isBusy}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors disabled:opacity-40 px-2 py-1.5 rounded-md hover:bg-emerald-50"
                          title="Regenerate token and copy new link"
                        >
                          {isBusy ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <RefreshCw size={13} />
                          )}
                          Resend
                        </button>
                      )}
                      {inv.status === 'pending' && (
                        <button
                          onClick={() => handleRevoke(inv.id)}
                          disabled={isBusy}
                          className="ml-2 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors disabled:opacity-40 px-2 py-1.5 rounded-md hover:bg-red-50"
                        >
                          <XCircle size={13} />
                          Revoke
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
    </>
  )
}