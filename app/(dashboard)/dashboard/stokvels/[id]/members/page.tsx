import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStokvelById } from '@/lib/actions/stokvels'
import { getInvitationsForStokvel } from '@/lib/actions/invitations'
import MembersPageClient from '@/components/dashboard/MembersPageClient'

export const metadata = {
  title: 'Members',
}

export default async function StokvelMembersPage({
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

  const invitations = await getInvitationsForStokvel(params.id)

  const isCommittee = ['chairperson', 'secretary'].includes(
    stokvel.membership.role
  )
  const canManage = stokvel.membership.role === 'chairperson'
  const canInvite = isCommittee || stokvel.allow_member_invites

  return (
    <div className="space-y-6">
      <Link
        href={`/dashboard/stokvels/${stokvel.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to {stokvel.name}
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Members
        </h1>
        <p className="mt-2 text-gray-600">
          Manage who belongs to {stokvel.name}. Only the chairperson can change
          roles or remove members.
        </p>
      </div>

      <MembersPageClient
        stokvelId={stokvel.id}
        stokvelName={stokvel.name}
        members={stokvel.members}
        invitations={invitations}
        currentUserId={user.id}
        canManage={canManage}
        canInvite={canInvite}
        allowMemberInvites={stokvel.allow_member_invites}
        defaultChannel={stokvel.default_invite_channel}
      />
    </div>
  )
}