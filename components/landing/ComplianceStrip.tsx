'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import type { ComplianceStripContent } from '@/lib/content/landing';
import Reveal from './Reveal';

export default function ComplianceStrip({
  content,
}: {
  content: ComplianceStripContent;
}) {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 p-8 sm:p-12">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-40"
              style={{
                background:
                  'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 65%)',
              }}
            />
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Shield size={18} className="text-white" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Trust
                  </p>
                </div>
                <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  {content.headline}
                </h2>
                <p className="mt-3 text-gray-600 leading-relaxed max-w-2xl">
                  {content.subheadline}
                </p>
                <Link
                  href={content.cta.href}
                  className="mt-6 inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 transition-colors group"
                >
                  {content.cta.label}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
              <div className="lg:col-span-5">
                <div className="flex flex-wrap gap-2">
                  {content.badges.map((b, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-white border border-emerald-200/70 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
