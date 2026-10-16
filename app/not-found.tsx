import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/30 px-4">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
          <Search size={12} />
          404
        </div>

        <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
          We couldn&apos;t find that page.
        </h1>

        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          The link might be broken, or the page may have moved. Let&apos;s get
          you back on track.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3.5 rounded-lg shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 group"
          >
            <Home size={16} />
            Back to home
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-800 font-semibold px-6 py-3.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5 group"
          >
            Browse features
            <ArrowLeft
              size={16}
              className="rotate-180 transition-transform group-hover:-translate-x-0.5"
            />
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200/70">
          <p className="text-xs uppercase tracking-widest font-bold text-gray-400">
            Popular pages
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { label: 'Features', href: '/features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Roles', href: '/roles' },
              { label: 'POPIA', href: '/popia' },
              { label: 'Contact', href: '/contact' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
