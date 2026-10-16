import Link from 'next/link';
import AuthShell from '@/components/auth/AuthShell';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Log in',
  description: 'Log in to your Stokvel Manager account.',
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your stokvel, members and contributions."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-emerald-700 font-semibold hover:underline"
          >
            Start free
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
