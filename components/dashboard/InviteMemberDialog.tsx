'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Link2,
  Mail,
  MessageCircle,
  Loader2,
  Check,
  Copy,
} from 'lucide-react'
import { createInvitationAction } from '@/lib/actions/invitations'
import {
  ROLE_LABELS,
  type MemberRole,
  type InviteChannel,
} from '@/lib/types/stokvel'

const ROLES: MemberRole[] = [
  'member',
  'treasurer',
  'secretary',
  'chairperson',
  'auditor',
]

const CHANNELS: {
  key: InviteChannel
  label: string
  description: string
  icon: typeof Link2
}[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    description: 'Send the invite link to a WhatsApp number.',
    icon: MessageCircle,
  },
  {
    key: 'link',
    label: 'Copy link',
    description: 'Generate a link you can share anywhere.',
    icon: Link2,
  },
  {
    key: 'email',
    label: 'Email',
    description: 'Send an email invite via Supabase.',
    icon: Mail,
  },
]

export default function InviteMemberDialog({
  stokvelId,
  defaultChannel = 'whatsapp',
  canAssignRoles = true,
  onClose,
}: {
  stokvelId: string
  defaultChannel?: InviteChannel
  canAssignRoles?: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [channel, setChannel] = useState<InviteChannel>(defaultChannel)
  const [role, setRole] = useState<MemberRole>('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    inviteUrl: string
    channel: InviteChannel
    whatsappUrl?: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    fd.set('channel', channel)
    fd.set('role', role)

    const res = await createInvitationAction(stokvelId, fd)

    if (!res.success) {
      setError(res.error)
      setLoading(false)
      return
    }

    // WhatsApp: open the deep link immediately, then show the result UI
    if (res.data.whatsappUrl) {
      window.open(res.data.whatsappUrl, '_blank', 'noopener,noreferrer')
    }

    setResult(res.data)
    setLoading(false)
    router.refresh()
  }

  async function copyLink() {
    if (!result) return
    await navigator.clipboard.writeText(result.inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in overflow-y-auto"
      onClick={() => !loading && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900">
              Invite a member
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {result
                ? 'Share the invite link with your member.'
                : 'Choose how to send the invitation.'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        {result ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-900">
                  Invitation created
                </p>
                <p className="text-xs text-emerald-800/80">
                  {result.channel === 'whatsapp'
                    ? 'WhatsApp opened in a new tab.'
                    : result.channel === 'email'
                    ? 'We emailed the invite.'
                    : 'Copy the link below and share it.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Invite link
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={result.inviteUrl}
                  className="flex-1 text-xs"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-all shrink-0"
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {result.whatsappUrl && (
              <a
                href={result.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-all"
              >
                <MessageCircle size={15} />
                Open WhatsApp again
              </a>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null)
                  setCopied(false)
                }}
                className="w-full text-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors py-2"
              >
                Invite another member
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Channel selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Send via
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CHANNELS.map((c) => {
                  const active = channel === c.key
                  const Icon = c.icon
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setChannel(c.key)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 transition-all ${
                        active
                          ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <Icon
                        size={17}
                        className={active ? 'text-emerald-700' : 'text-gray-500'}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          active ? 'text-emerald-900' : 'text-gray-700'
                        }`}
                      >
                        {c.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-[11px] text-gray-500">
                {CHANNELS.find((c) => c.key === channel)?.description}
              </p>
            </div>

            {/* Conditional input */}
            {channel === 'email' && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="thabo@example.co.za"
                />
              </div>
            )}

            {channel === 'whatsapp' && (
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  WhatsApp number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="082 123 4567"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  South African numbers are auto-converted to +27 format.
                </p>
              </div>
            )}

            {channel === 'link' && (
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Email{' '}
                  <span className="text-gray-400 font-normal">
                    (optional, for record-keeping)
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="thabo@example.co.za"
                />
              </div>
            )}

            {/* Role selector */}
            {canAssignRoles && (
              <div>
                <label
                  htmlFor="role"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as MemberRole)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-gray-500">
                  You can change a member&apos;s role later.
                </p>
              </div>
            )}

            {/* Optional message */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Personal message{' '}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={2}
                placeholder="Sawubona! Join our stokvel."
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Included in the WhatsApp message. Not shown for link invites.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Creating…
                  </>
                ) : (
                  'Create invitation'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="inline-flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-60 text-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}