'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { forgotPasswordAction } from '@/lib/supabase/auth-actions'

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const result = await forgotPasswordAction(fd)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-emerald-700 text-xl">✓</span>
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Check your inbox
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          If an account exists for that email address, we&apos;ve sent a link to
          reset your password. The link expires in 60 minutes.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.co.za"
        />
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
            Sending reset link…
          </>
        ) : (
          'Send reset link'
        )}
      </button>

      <p className="text-xs text-gray-500 text-center pt-2">
        Remembered it?{' '}
        <Link
          href="/login"
          className="text-emerald-700 font-semibold hover:underline"
        >
          Back to login
        </Link>
      </p>
    </form>
  )
}