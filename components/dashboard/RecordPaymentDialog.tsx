'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, Check, AlertTriangle } from 'lucide-react'
import { recordPaymentAction } from '@/lib/actions/payments'
import { PAYMENT_METHOD_LABELS } from '@/lib/types/contribution'
import type { PaymentMethod } from '@/lib/types/contribution'

const METHODS: PaymentMethod[] = [
  'eft',
  'cash',
  'card',
  'debit_order',
  'other',
]

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function RecordPaymentDialog({
  stokvelId,
  contributionId,
  amountDue,
  currency = 'ZAR',
  onClose,
}: {
  stokvelId: string
  contributionId: string
  amountDue: number
  currency?: string
  onClose: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    fd.set('contribution_id', contributionId)

    const res = await recordPaymentAction(stokvelId, fd)
    setLoading(false)

    if (!res.success) {
      setError(res.error)
      return
    }

    setDone(true)
    router.refresh()
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
              Record payment
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {done
                ? 'Payment recorded. It will appear as recorded until verified.'
                : 'Recorded payments are not counted as paid until a treasurer verifies them.'}
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

        {done ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-blue-900">
                  Payment recorded
                </p>
                <p className="text-xs text-blue-800/80">
                  Status is <strong>recorded</strong>. A treasurer must verify
                  it before it counts toward the group balance.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            <div>
              <label
                htmlFor="amount"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Amount received <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 shrink-0">
                  {currency}
                </span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min={0.01}
                  step={0.01}
                  required
                  defaultValue={amountDue}
                  placeholder={String(amountDue)}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Full amount due: {currency} {amountDue.toLocaleString()}
              </p>
            </div>

            <div>
              <label
                htmlFor="payment_date"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Payment date <span className="text-red-500">*</span>
              </label>
              <input
                id="payment_date"
                name="payment_date"
                type="date"
                required
                defaultValue={today()}
                max={today()}
              />
            </div>

            <div>
              <label
                htmlFor="payment_method"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Payment method <span className="text-red-500">*</span>
              </label>
              <select
                id="payment_method"
                name="payment_method"
                required
                defaultValue="eft"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {PAYMENT_METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="reference"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Payment reference
              </label>
              <input
                id="reference"
                name="reference"
                type="text"
                placeholder="e.g. bank reference or proof of payment number"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Optional, but strongly recommended. Used to match against bank
                statement imports.
              </p>
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="e.g. proof of payment received by WhatsApp"
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
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Recording…
                  </>
                ) : (
                  'Record payment'
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