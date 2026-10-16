'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { MembershipWithProfile, InviteChannel } from '@/lib/types/stokvel'
import type { InvitationWithMeta } from '@/lib/types/invitation'
import MembersTable from './MembersTable'
import InvitationsTable from './InvitationsTable'
import InviteMemberDialog from './InviteMemberDialog'

export default function MembersPageClient({
  stokvelId,
  stokvelName,
  members,
  invitations,
  currentUserId,
  canManage,
  canInvite,
  allowMemberInvites,
  defaultChannel,
}: {
  stokvelId: string
  stokvelName: string
  members: MembershipWithProfile[]
  invitations: InvitationWithMeta[]
  currentUserId: string
  canManage: boolean
  canInvite: boolean
  allowMemberInvites: boolean
  defaultChannel: InviteChannel
}) {
  const [inviting, setInviting] = useState(false)

  const activeMembers = members.filter((m) => m.status === 'active')
  const pastMembers = members.filter((m) => m.status !== 'active')
  const pendingInvitations = invitations.filter(
    (i) => i.status === 'pending' && !i.is_expired
  )
  const pastInvitations = invitations.filter(
    (i) => i.status !== 'pending' || i.is_expired
  )

  return (
    <div className="space-y-8">
      {/* Active members */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Members</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {activeMembers.length} active
              {pastMembers.length > 0 && ` · ${pastMembers.length} inactive`}
            </p>
          </div>
          {canInvite && (
            <button
              onClick={() => setInviting(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px text-sm"
            >
              <Plus size={15} />
              Invite member
            </button>
          )}
        </div>
        <MembersTable
          members={activeMembers}
          currentUserId={currentUserId}
          canManage={canManage}
        />
      </section>

      {/* Pending invitations */}
      {canManage && pendingInvitations.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Pending invitations
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {pendingInvitations.length} pending · they expire after 7 days
            </p>
          </div>
          <InvitationsTable
            invitations={pendingInvitations}
            canManage={canManage}
          />
        </section>
      )}

      {/* Invitation history */}
      {canManage && pastInvitations.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Invitation history
            </h2>
          </div>
          <InvitationsTable
            invitations={pastInvitations}
            canManage={canManage}
          />
        </section>
      )}

      {/* Inactive members */}
      {pastMembers.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Inactive members
            </h2>
          </div>
          <MembersTable
            members={pastMembers}
            currentUserId={currentUserId}
            canManage={canManage}
          />
        </section>
      )}

      {/* Invite dialog */}
      {inviting && (
        <InviteMemberDialog
          stokvelId={stokvelId}
          defaultChannel={defaultChannel}
          canAssignRoles={canManage}
          onClose={() => setInviting(false)}
        />
      )}
    </div>
  )
}