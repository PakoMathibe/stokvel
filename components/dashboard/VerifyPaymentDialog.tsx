'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Loader2,
  ShieldCheck,
  XCircle,
  AlertTriangle,
} from 'lucide-react'
import {
  verifyPaymentAction,
  rejectPaymentAction,
} from '@/lib/actions/payments'

export default function VerifyPaymentDialog({
  paymentId,
  amount,
  currency = 'ZAR',
  onClose,
}: {
  paymentId: string
  amount: number
  currency?: string
  onClose: () => void
}) {
  const router = useRouter()
  const [mode, setMode] = useState<'verify' | 'reject'>('verify')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleVerify(reconciled: boolean) {
    setError(null)
    setLoading(true)
    const res = await verifyPaymentAction(paymentId, { reconciled })
    setLoading(false)

    if (!res.success) {
      setError(res.error)
      return
    }

    router.refresh()
    onClose()
  }

  async function handleReject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const reason = String(fd.get('reason') ?? '').trim()

    const res = await rejectPaymentAction(paymentId, reason)
    setLoading(false)

    if (!res.success) {
      setError(res.error)
      return
    }

    router.refresh()
    onClose()
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
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-gray-900">
              {mode === 'verify' ? 'Verify payment' : 'Reject payment'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {currency} {amount.toLocaleString()}
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

        {mode === 'verify' ? (
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Verifying marks the payment as cleared. This is the step where the
              treasurer confirms against bank statement data or another trusted
              source — never against a proof of payment alone.
            </p>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-900 leading-relaxed">
              <strong>Verified</strong> means the payment is confirmed and counts
              toward the group balance. Choose <strong>Reconciled</strong> if you
              have also matched it to a specific bank statement line.
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800 flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={() => handleVerify(false)}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Verify (counts toward balance)
                  </>
                )}
              </button>
              <button
                onClick={() => handleVerify(true)}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-white border border-emerald-300 hover:bg-emerald-50 disabled:opacity-60 text-emerald-800 font-semibold px-5 py-3 rounded-lg shadow-sm transition-all text-sm"
              >
                <ShieldCheck size={16} />
                Verify and reconcile with bank
              </button>
              <button
                type="button"
                onClick={() => setMode('reject')}
                disabled={loading}
                className="w-full text-center text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors py-2"
              >
                Reject this payment instead
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full text-center text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReject} className="p-5 space-y-5">
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-4">
              <div className="flex items-start gap-2.5">
                <XCircle size={16} className="text-red-700 shrink-0 mt-0.5" />
                <p className="text-xs text-red-900 leading-relaxed">
                  Rejecting removes this payment from the contribution. The
                  member will see the contribution back at its previous balance.
                  Use this when the money never arrived or the amount was wrong.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                required
                minLength={3}
                placeholder="e.g. No matching line on the bank statement"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800 flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Rejecting…
                  </>
                ) : (
                  'Reject payment'
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode('verify')}
                disabled={loading}
                className="inline-flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-60 text-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}