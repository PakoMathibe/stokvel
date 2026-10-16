// lib/supabase/auth-actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// =====================================================================
// SITE URL HELPER
// =====================================================================
// Prefers explicit env var; falls back to the request Origin header.
// This is what makes auth emails work on localhost, Vercel previews,
// and production without code changes.
// =====================================================================
function getSiteUrl(): string {
  // 1. Explicit env (set in Vercel + .env.local)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }

  // 2. Request origin (works on Vercel preview deployments)
  const origin = headers().get('origin')
  if (origin) {
    return origin.replace(/\/$/, '')
  }

  // 3. Sensible dev fallback
  return 'http://localhost:3000'
}

// =====================================================================
// SIGN UP
// =====================================================================
export async function signUpAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const fullName = String(formData.get('name') ?? '').trim()

  if (!email || !password || !fullName) {
    return { error: 'All fields are required.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const supabase = createClient()
  const siteUrl = getSiteUrl()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.session) {
    redirect('/dashboard')
  }

  return { success: true, message: 'Check your inbox to confirm your email.' }
}

// =====================================================================
// LOG IN
// =====================================================================
export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

// =====================================================================
// LOG OUT
// =====================================================================
export async function logoutAction() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}

// =====================================================================
// FORGOT PASSWORD
// =====================================================================
export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim()

  if (!email) {
    return { error: 'Email is required.' }
  }

  const supabase = createClient()
  const siteUrl = getSiteUrl()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: 'If an account exists for that email, we sent a reset link.',
  }
}

// =====================================================================
// RESET PASSWORD (after clicking the email link)
// =====================================================================
export async function resetPasswordAction(formData: FormData) {
  const password = String(formData.get('password') ?? '')

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}