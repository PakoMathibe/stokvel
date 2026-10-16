'use client';

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h1>
        <p className="mt-3 text-gray-600 leading-relaxed">{subtitle}</p>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-[0_24px_60px_-20px_rgba(16,24,40,0.15)] p-6 sm:p-8">
        {children}
      </div>

      {footer && (
        <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>
      )}

      <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
        By continuing you agree to our{' '}
        <a href="/terms" className="text-emerald-700 hover:underline">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-emerald-700 hover:underline">
          Privacy Policy
        </a>
        . Stokvel Manager records money — it does not hold or transfer member
        funds.
      </p>
    </div>
  );
}
