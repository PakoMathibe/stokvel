'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import {
  STOKVEL_TYPE_LABELS,
  FREQUENCY_LABELS,
  type Stokvel,
  type StokvelType,
  type ContributionFrequency,
} from '@/lib/types/stokvel'
import {
  createStokvelAction,
  updateStokvelAction,
} from '@/lib/actions/stokvels'

type Props = {
  mode: 'create' | 'edit'
  initial?: Stokvel
}

export default function StokvelForm({ mode, initial }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)

    try {
      if (mode === 'create') {
        const result = await createStokvelAction(fd)
        if (!result.success) {
          setError(result.error)
          setLoading(false)
          return
        }
        router.push(`/dashboard/stokvels/${result.data.id}`)
      } else if (mode === 'edit' && initial) {
        const result = await updateStokvelAction(initial.id, fd)
        if (!result.success) {
          setError(result.error)
          setLoading(false)
          return
        }
        router.push(`/dashboard/stokvels/${initial.id}`)
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Stokvel name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={3}
          maxLength={100}
          defaultValue={initial?.name ?? ''}
          placeholder="e.g. Soweto Savers Club"
        />
        <p className="mt-1 text-[11px] text-gray-500">
          3–100 characters. This is what members will see.
        </p>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ''}
          placeholder="What is this stokvel for? When did it start? Anything members should know."
        />
      </div>

      {/* Type — disabled on edit */}
      <div>
        <label
          htmlFor="stokvel_type"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Type <span className="text-red-500">*</span>
        </label>
        <select
          id="stokvel_type"
          name="stokvel_type"
          required
          defaultValue={initial?.stokvel_type ?? 'rotational'}
          disabled={mode === 'edit'}
        >
          {(Object.keys(STOKVEL_TYPE_LABELS) as StokvelType[]).map((k) => (
            <option key={k} value={k}>
              {STOKVEL_TYPE_LABELS[k]}
            </option>
          ))}
        </select>
        {mode === 'edit' ? (
          <p className="mt-1 text-[11px] text-gray-500">
            Type cannot be changed after creation.
          </p>
        ) : (
          <p className="mt-1 text-[11px] text-gray-500">
            Rotational pays out in turns. Burial covers funeral costs. Grocery
            saves for bulk shopping.
          </p>
        )}
      </div>

      {/* Contribution amount + frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contribution_amount"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Contribution amount (ZAR) <span className="text-red-500">*</span>
          </label>
          <input
            id="contribution_amount"
            name="contribution_amount"
            type="number"
            min={0}
            step={0.01}
            required
            defaultValue={initial?.contribution_amount ?? 0}
            placeholder="500"
          />
        </div>
        <div>
          <label
            htmlFor="contribution_frequency"
            className="block text-xs font-semibold text-gray-700 mb-1.5"
          >
            Frequency <span className="text-red-500">*</span>
          </label>
          <select
            id="contribution_frequency"
            name="contribution_frequency"
            required
            defaultValue={initial?.contribution_frequency ?? 'monthly'}
          >
            {(Object.keys(FREQUENCY_LABELS) as ContributionFrequency[]).map(
              (k) => (
                <option key={k} value={k}>
                  {FREQUENCY_LABELS[k]}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* Target members */}
      <div>
        <label
          htmlFor="target_members"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Target members
        </label>
        <input
          id="target_members"
          name="target_members"
          type="number"
          min={2}
          max={500}
          defaultValue={initial?.target_members ?? ''}
          placeholder="e.g. 12"
        />
        <p className="mt-1 text-[11px] text-gray-500">
          Optional. Helps track how close you are to your intended group size.
        </p>
      </div>

      {/* NASASA */}
      <div>
        <label
          htmlFor="nasasa_registration"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          NASASA registration
        </label>
        <input
          id="nasasa_registration"
          name="nasasa_registration"
          type="text"
          defaultValue={initial?.nasasa_registration ?? ''}
          placeholder="Optional registration reference"
        />
        <p className="mt-1 text-[11px] text-gray-500">
          If your group is formally registered with NASASA, store the reference
          here.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {mode === 'create' ? 'Creating…' : 'Saving…'}
            </>
          ) : mode === 'create' ? (
            'Create stokvel'
          ) : (
            'Save changes'
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-60 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}