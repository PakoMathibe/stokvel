import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, Users, ArrowRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getInvitationByToken } from '@/lib/actions/invitations'
import { ROLE_LABELS, STOKVEL_TYPE_LABELS } from '@/lib/types/stokvel'
import type { StokvelType } from '@/lib/types/stokvel'
import AcceptInvitationClient from '@/components/dashboard/AcceptInvitationClient'

export const metadata = {
  title: 'You have an invitation',
}

export default async function InvitationPage({
  params,
}: {
  params: { token: string }
}) {
  const invitation = await getInvitationByToken(params.token)

  // -------------------------------------------------------------
  // Invalid or already-used invitation
  // -------------------------------------------------------------
  if (!invitation) {
    return (
      <InvitationShell>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={24} className="text-red-700" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900">
            Invitation not found
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            This invitation link is invalid or has been deleted. Ask the
            committee member who invited you to send a new one.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Back to home
            <ArrowRight size={14} />
          </Link>
        </div>
      </InvitationShell>
    )
  }

  const isPending = invitation.status === 'pending'
  const isExpired =
    invitation.is_expired ||
    (invitation.status === 'pending' &&
      new Date(invitation.expires_at).getTime() < Date.now())

  // -------------------------------------------------------------
  // Expired, accepted, declined, or revoked
  // -------------------------------------------------------------
  if (!isPending) {
    return (
      <InvitationShell>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock size={24} className="text-amber-700" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900">
            Invitation {invitation.status}
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            {invitation.status === 'accepted' &&
              'This invitation has already been accepted.'}
            {invitation.status === 'declined' &&
              'This invitation was declined. Ask the committee member to send a new one.'}
            {invitation.status === 'expired' &&
              'This invitation has expired. Ask the committee member to send a new one.'}
            {invitation.status === 'revoked' &&
              'This invitation was revoked. Ask the committee member to send a new one.'}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Back to home
            <ArrowRight size={14} />
          </Link>
        </div>
      </InvitationShell>
    )
  }

  if (isExpired) {
    return (
      <InvitationShell>
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock size={24} className="text-amber-700" />
          </div>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900">
            Invitation expired
          </h1>
          <p className="mt-3 text-gray-600 leading-relaxed">
            This invitation has expired. Ask{' '}
            {invitation.inviter?.full_name ?? 'the committee member'} to send a
            new one.
          </p>
        </div>
      </InvitationShell>
    )
  }

  // -------------------------------------------------------------
  // Valid invitation — check auth state
  // -------------------------------------------------------------
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const stokvelName = invitation.stokvel?.name ?? 'a stokvel'
  const inviterName = invitation.inviter?.full_name ?? 'A committee member'
  const stokvelType = (invitation.stokvel?.stokvel_type ??
    'rotational') as StokvelType

  const emailMatch =
    !user?.email || !invitation.email
      ? true
      : user.email.toLowerCase() === invitation.email.toLowerCase()

  return (
    <InvitationShell>
      <div className="text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <Users size={24} className="text-emerald-700" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-emerald-700">
          You&apos;ve been invited
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
          Join {stokvelName}
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">
          {inviterName} invited you as a{' '}
          <strong>{ROLE_LABELS[invitation.role]}</strong> in a{' '}
          {STOKVEL_TYPE_LABELS[stokvelType].toLowerCase()} stokvel.
        </p>

        {invitation.message && (
          <div className="mt-5 p-4 rounded-xl bg-gray-50 border border-gray-200 text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
              Message
            </p>
            <p className="text-sm text-gray-700 italic leading-relaxed">
              &ldquo;{invitation.message}&rdquo;
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <AcceptInvitationClient
          token={params.token}
          isLoggedIn={!!user}
          emailMatch={emailMatch}
          userEmail={user?.email ?? null}
          invitationEmail={invitation.email}
        />
      </div>
    </InvitationShell>
  )
}

// =====================================================================
// Local shell (self-contained — no reliance on (auth) layout)
// =====================================================================
function InvitationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/30">
      <header className="px-4 sm:px-8 py-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-700/20 transition-transform group-hover:scale-105">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-bold tracking-tight text-gray-900">
                Stokvel
              </div>
              <div className="text-[10px] uppercase tracking-widest text-emerald-700/80 font-semibold">
                Manager
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-lg">
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_24px_60px_-20px_rgba(16,24,40,0.15)] p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>

      <footer className="px-4 sm:px-8 py-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Stokvel Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}