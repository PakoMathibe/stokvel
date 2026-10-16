'use client'

import { useState } from 'react'
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import { resetPasswordAction } from '@/lib/supabase/auth-actions'

export default function ResetPasswordForm() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const result = await resetPasswordAction(fd)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // On success, resetPasswordAction redirects to /dashboard
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          New password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={show ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="mt-1.5 text-[11px] text-gray-500">
          At least 8 characters. Mix letters, numbers and symbols.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-xs text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Updating password…
          </>
        ) : (
          'Update password'
        )}
      </button>
    </form>
  )
}