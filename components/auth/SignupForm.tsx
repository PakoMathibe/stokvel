'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import { signUpAction } from '@/lib/supabase/auth-actions'

const PLANS = [
  { key: 'free', label: 'Free', price: 'R0', note: 'forever' },
  { key: 'basic', label: 'Basic', price: 'R199', note: '/month' },
  { key: 'medium', label: 'Medium', price: 'R449', note: '/month' },
  { key: 'large', label: 'Large', price: 'R899', note: '/month' },
] as const

type PlanKey = (typeof PLANS)[number]['key']

export default function SignupForm() {
  const params = useSearchParams()
  const initialPlanParam = params.get('plan')
  const initialPlan: PlanKey =
    initialPlanParam === 'basic' ||
    initialPlanParam === 'medium' ||
    initialPlanParam === 'large'
      ? initialPlanParam
      : 'free'

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>(initialPlan)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)

    const result = await signUpAction(fd)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // If we get here, the action returned success (session or email confirm)
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
          <Check size={22} className="text-emerald-700" strokeWidth={3} />
        </div>
        <h2 className="mt-4 text-xl font-bold text-gray-900">
          Check your inbox
        </h2>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          We&apos;ve sent a verification link to your email. Click it to finish
          setting up your stokvel.
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
          htmlFor="name"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Nomsa Mahlangu"
        />
      </div>

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

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          Password
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
          Use at least 8 characters. Mix letters, numbers and symbols.
        </p>
      </div>

      <fieldset>
        <legend className="block text-xs font-semibold text-gray-700 mb-1.5">
          Plan
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {PLANS.map((p) => {
            const active = selectedPlan === p.key
            return (
              <label
                key={p.key}
                className={`relative flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2.5 cursor-pointer transition ${
                  active
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.key}
                  checked={active}
                  onChange={() => setSelectedPlan(p.key)}
                  className="sr-only"
                />
                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  {p.label}
                  {active && (
                    <Check
                      size={11}
                      className="text-emerald-600"
                      strokeWidth={3}
                    />
                  )}
                </span>
                <span className="text-[11px] text-gray-500">
                  {p.price} {p.note}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" required className="mt-0.5 shrink-0" />
        <span className="text-xs text-gray-600 leading-relaxed">
          I agree to the{' '}
          <Link
            href="/terms"
            className="text-emerald-700 hover:underline font-medium"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="text-emerald-700 hover:underline font-medium"
          >
            Privacy Policy
          </Link>
          , and I understand that Stokvel Manager records money but does not
          hold or transfer member funds.
        </span>
      </label>

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
            Creating account…
          </>
        ) : (
          'Create free account'
        )}
      </button>

      <p className="text-[11px] text-gray-500 text-center leading-relaxed pt-1">
        No credit card required. Free forever on the Free plan.
      </p>
    </form>
  )
}