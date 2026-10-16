'use client';

import Link from 'next/link';
import {
  ArrowRight,
  FileText,
  TrendingUp,
  AlertTriangle,
  Wallet,
} from 'lucide-react';
import type { ReportsPreviewContent } from '@/lib/content/landing';
import Reveal from './Reveal';

export default function ReportsPreview({
  content,
}: {
  content: ReportsPreviewContent;
}) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              {content.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              {content.headline}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              {content.subheadline}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed italic">
              {content.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative bg-white border border-gray-200/80 rounded-2xl shadow-[0_24px_60px_-20px_rgba(16,24,40,0.15)] p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      Group overview
                    </p>
                    <p className="text-lg font-bold text-gray-900 mt-1 tracking-tight">
                      March 2026
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FileText size={16} className="text-emerald-700" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      label: 'Recorded',
                      amount: 'R 12,500',
                      icon: Wallet,
                      tone: 'text-blue-700 bg-blue-50',
                    },
                    {
                      label: 'Verified',
                      amount: 'R 11,800',
                      icon: TrendingUp,
                      tone: 'text-emerald-700 bg-emerald-50',
                    },
                    {
                      label: 'Available',
                      amount: 'R 9,300',
                      icon: TrendingUp,
                      tone: 'text-emerald-700 bg-emerald-50',
                    },
                    {
                      label: 'Owed (21+ days)',
                      amount: 'R 1,000',
                      icon: AlertTriangle,
                      tone: 'text-amber-700 bg-amber-50',
                    },
                  ].map((row, i) => {
                    const I = row.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${row.tone}`}
                          >
                            <I size={13} />
                          </span>
                          <span className="text-sm text-gray-700">
                            {row.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 tabular-nums">
                          {row.amount}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                    Report exports
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['PDF', 'Excel', 'CSV'].map((f) => (
                      <span key={f} className="badge badge-emerald">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {content.sampleReports.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-sm text-gray-700 leading-snug">
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={240}>
              <Link
                href={content.cta.href}
                className="mt-8 inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-800 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5 group"
              >
                {content.cta.label}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
