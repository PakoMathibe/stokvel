import { Suspense } from 'react';
import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import SignupForm from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Create your account',
  description:
    'Start free. Create your stokvel account in under a minute. No card required.',
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start free. No card required. Set up your stokvel in under a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 skeleton" />}>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
