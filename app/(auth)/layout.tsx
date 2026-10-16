import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
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
        {children}
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
  );
}
