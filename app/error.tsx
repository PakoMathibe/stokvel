'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/40 via-white to-emerald-50/30 px-4">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/70 text-amber-800 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
          <AlertTriangle size={12} />
          Something went wrong
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
          An unexpected error occurred.
        </h1>

        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          We&apos;ve logged the issue. You can try again, or head back to the
          home page.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-gray-400 font-mono">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3.5 rounded-lg shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-800 font-semibold px-6 py-3.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
          >
            <Home size={16} />
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
