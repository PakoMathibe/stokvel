'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, Check, AlertTriangle } from 'lucide-react'
import { generateContributionsAction } from '@/lib/actions/contributions'

function currentMonthLabel(): string {
  const d = new Date()
  return d.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
}

function defaultDueDate(): string {
  const d = new Date()
  d.setDate(7) // 7th of current month
  if (d.getTime() < Date.now()) {
    d.setMonth(d.getMonth() + 1)
    d.setDate(7)
  }
  return d.toISOString().slice(0, 10)
}

export default function GenerateContributionsDialog({
  stokvelId,
  defaultAmount,
  currency = 'ZAR',
  onClose,
}: {
  stokvelId: string
  defaultAmount: number
  currency?: string
  onClose: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    created: number
    skipped: number
  } | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const res = await generateContributionsAction(stokvelId, fd)

    setLoading(false)

    if (!res.success) {
      setError(res.error)
      return
    }

    setResult(res.data)
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
              Generate contributions
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {result
                ? 'Obligations created for this period.'
                : 'Create a contribution obligation for every active member.'}
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

        {result ? (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check size={16} className="text-white" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-emerald-900">
                  {result.created} contribution
                  {result.created === 1 ? '' : 's'} created
                </p>
                {result.skipped > 0 && (
                  <p className="text-xs text-emerald-800/80">
                    {result.skipped} already existed for this period — skipped.
                  </p>
                )}
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
                htmlFor="period_label"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Period label <span className="text-red-500">*</span>
              </label>
              <input
                id="period_label"
                name="period_label"
                type="text"
                required
                maxLength={50}
                defaultValue={currentMonthLabel()}
                placeholder="March 2026"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Members who already have a contribution for this period will be
                skipped. Use a different label for a new cycle.
              </p>
            </div>

            <div>
              <label
                htmlFor="due_date"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Due date <span className="text-red-500">*</span>
              </label>
              <input
                id="due_date"
                name="due_date"
                type="date"
                required
                defaultValue={defaultDueDate()}
              />
            </div>

            <div>
              <label
                htmlFor="amount_override"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Amount per member
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 shrink-0">
                  {currency}
                </span>
                <input
                  id="amount_override"
                  name="amount_override"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={defaultAmount}
                  placeholder={String(defaultAmount)}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Defaults to the stokvel&apos;s contribution amount (
                {currency} {defaultAmount.toLocaleString()}). Override here for
                a one-off period.
              </p>
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
                    Generating…
                  </>
                ) : (
                  'Generate contributions'
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