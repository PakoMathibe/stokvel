import AuthShell from '@/components/auth/AuthShell';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const metadata = {
  title: 'Reset your password',
  description:
    'Enter your email address and we’ll send you a link to reset your password.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email address on your account and we’ll send you a link to set a new password."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
