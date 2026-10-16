// app/reset-password/page.tsx
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata = {
  title: 'Set a new password',
  description: 'Choose a new password for your Stokvel Manager account.',
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const code = searchParams.code

  // -----------------------------------------------------------------
  // Case 1: No code in URL — user navigated here directly
  // -----------------------------------------------------------------
  if (!code) {
    return (
      <AuthShell
        title="Reset link required"
        subtitle="This page is only reachable from the reset link we sent to your email."
        icon="warn"
      >
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm w-full"
          >
            Request a new reset link
          </Link>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </AuthShell>
    )
  }

  // -----------------------------------------------------------------
  // Case 2: Exchange code for session
  // -----------------------------------------------------------------
  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return (
      <AuthShell
        title="Reset link expired"
        subtitle="This reset link is no longer valid. Reset links expire after a short time for security."
        icon="warn"
      >
        <div className="text-center">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md shadow-emerald-500/25 transition-all text-sm w-full"
          >
            Request a new reset link
          </Link>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to login
          </Link>
        </div>
      </AuthShell>
    )
  }

  // -----------------------------------------------------------------
  // Case 3: Session active — show the reset form
  // -----------------------------------------------------------------
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password. You'll be logged in automatically afterward."
    >
      <ResetPasswordForm />
    </AuthShell>
  )
}

// =====================================================================
// Local AuthShell (self-contained so this page has no layout deps)
// =====================================================================
function AuthShell({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle: string
  icon?: 'warn'
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/30">
      <header className="px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-700/20 transition-transform group-hover:scale-105">
              <Sparkles size={16} className="text-white" />
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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={13} />
            Back to home
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-8 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {icon === 'warn' && (
              <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-amber-700" />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              {title}
            </h1>
            <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>
          </div>

          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_24px_60px_-20px_rgba(16,24,40,0.15)] p-6 sm:p-8">
            {children}
          </div>
        </div>
      </main>

      <footer className="px-4 sm:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Stokvel Manager. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-gray-400 hover:text-emerald-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-400 hover:text-emerald-700 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/popia"
              className="text-xs text-gray-400 hover:text-emerald-700 transition-colors"
            >
              POPIA
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}