'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import type { FooterContent } from '@/lib/content/landing';

export default function Footer({ content }: { content: FooterContent }) {
  return (
    <footer className="border-t border-gray-200/70 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
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
            <p className="mt-5 text-sm text-gray-600 leading-relaxed max-w-sm">
              {content.tagline}
            </p>
          </div>

          {content.columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-900">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l, j) => (
                  <li key={j}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-600 hover:text-emerald-700 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-gray-200/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{content.copyright}</p>
          <div className="flex items-center gap-6">
            {content.legal.map((l, i) => (
              <Link
                key={i}
                href={l.href}
                className="text-xs text-gray-500 hover:text-emerald-700 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
