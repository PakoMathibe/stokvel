'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Check,
  X,
  AlertTriangle,
  LogIn,
  UserPlus,
} from 'lucide-react'
import {
  acceptInvitationAction,
  declineInvitationAction,
} from '@/lib/actions/invitations'

export default function AcceptInvitationClient({
  token,
  isLoggedIn,
  emailMatch,
  userEmail,
  invitationEmail,
}: {
  token: string
  isLoggedIn: boolean
  emailMatch: boolean
  userEmail: string | null
  invitationEmail: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<'accept' | 'decline' | null>(
    null
  )

  // -----------------------------------------------------------------
  // Not logged in — prompt sign up or log in
  // -----------------------------------------------------------------
  if (!isLoggedIn) {
    const next = encodeURIComponent(`/invitations/${token}`)
    return (
      <div className="space-y-3">
        <Link
          href={`/signup?redirect=${next}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm"
        >
          <UserPlus size={16} />
          Create an account
        </Link>
        <Link
          href={`/login?redirect=${next}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all text-sm"
        >
          <LogIn size={16} />
          I already have an account
        </Link>
        <p className="text-[11px] text-gray-500 text-center leading-relaxed pt-2">
          You need an account to accept this invitation. We&apos;ll bring you
          back here after you sign up or log in.
        </p>
      </div>
    )
  }

  // -----------------------------------------------------------------
  // Logged in but wrong email
  // -----------------------------------------------------------------
  if (!emailMatch) {
    return (
      <div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="text-amber-700 shrink-0 mt-0.5"
            />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Wrong account
              </p>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                This invitation is for <strong>{invitationEmail}</strong>. You
                are logged in as <strong>{userEmail}</strong>.
              </p>
            </div>
          </div>
        </div>
        <Link
          href={`/login?redirect=${encodeURIComponent(`/invitations/${token}`)}`}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all text-sm"
        >
          <LogIn size={16} />
          Switch account
        </Link>
      </div>
    )
  }

  // -----------------------------------------------------------------
  // Ready — accept or decline
  // -----------------------------------------------------------------
  async function handleAccept() {
    setError(null)
    setLoading('accept')
    const res = await acceptInvitationAction(token)
    if (!res.success) {
      setError(res.error)
      setLoading(null)
      setConfirming(null)
      return
    }
    router.push(`/dashboard/stokvels/${res.data.stokvelId}`)
  }

  async function handleDecline() {
    setError(null)
    setLoading('decline')
    const res = await declineInvitationAction(token)
    if (!res.success) {
      setError(res.error)
      setLoading(null)
      setConfirming(null)
      return
    }
    router.push('/dashboard')
  }

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => setConfirming('accept')}
          disabled={loading !== null}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm"
        >
          <Check size={16} strokeWidth={3} />
          Accept invitation
        </button>
        <button
          onClick={() => setConfirming('decline')}
          disabled={loading !== null}
          className="w-full inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-red-300 hover:text-red-600 disabled:opacity-60 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all text-sm"
        >
          <X size={16} />
          Decline
        </button>
      </div>

      {/* Accept confirmation */}
      {confirming === 'accept' && (
        <Modal
          title="Accept this invitation?"
          body="You will become a member of this stokvel and appear on the members list."
          confirmLabel="Yes, accept"
          confirmTone="emerald"
          loading={loading === 'accept'}
          onCancel={() => !loading && setConfirming(null)}
          onConfirm={handleAccept}
        />
      )}

      {/* Decline confirmation */}
      {confirming === 'decline' && (
        <Modal
          title="Decline this invitation?"
          body="The committee member who invited you will be notified. You can be invited again later."
          confirmLabel="Yes, decline"
          confirmTone="red"
          loading={loading === 'decline'}
          onCancel={() => !loading && setConfirming(null)}
          onConfirm={handleDecline}
        />
      )}
    </>
  )
}

// =====================================================================
// Modal
// =====================================================================
function Modal({
  title,
  body,
  confirmLabel,
  confirmTone,
  loading,
  onCancel,
  onConfirm,
}: {
  title: string
  body: string
  confirmLabel: string
  confirmTone: 'emerald' | 'red'
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const tone =
    confirmTone === 'emerald'
      ? 'bg-emerald-600 hover:bg-emerald-700'
      : 'bg-red-600 hover:bg-red-700'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{body}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 ${tone} disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm`}
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Please wait…
              </>
            ) : (
              confirmLabel
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-60 text-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}