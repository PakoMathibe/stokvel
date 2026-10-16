'use client';

import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import type { EnterpriseTier, PricingTier } from '@/lib/content/types';
import Reveal from './Reveal';

export default function PricingTable({
  tiers,
  enterprise,
  footnote,
}: {
  tiers: PricingTier[];
  enterprise: EnterpriseTier;
  footnote?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tiers.map((t, i) => (
          <Reveal key={t.key} delay={i * 60}>
            <div
              className={`group h-full flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                t.highlighted
                  ? 'bg-gradient-to-b from-emerald-800 to-emerald-900 text-white shadow-[0_24px_60px_-20px_rgba(6,95,70,0.5)] border border-emerald-800'
                  : 'bg-white border border-gray-200/80 hover:border-emerald-300 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)]'
              }`}
            >
              {t.highlighted && (
                <div className="mb-4 inline-flex items-center gap-1.5 self-start bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  <Sparkles size={11} />
                  Most popular
                </div>
              )}
              <h3
                className={`text-lg font-bold tracking-tight ${
                  t.highlighted ? 'text-white' : 'text-gray-900'
                }`}
              >
                {t.name}
              </h3>
              <p
                className={`mt-1 text-xs leading-snug ${
                  t.highlighted ? 'text-emerald-50/70' : 'text-gray-500'
                }`}
              >
                {t.tagline}
              </p>

              <div className="mt-5 flex items-baseline gap-1.5">
                <span
                  className={`text-4xl font-extrabold tracking-tight ${
                    t.highlighted ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {t.price}
                </span>
                <span
                  className={`text-xs font-medium ${
                    t.highlighted ? 'text-emerald-50/70' : 'text-gray-500'
                  }`}
                >
                  {t.priceNote}
                </span>
              </div>
              <p
                className={`mt-2 text-[11px] uppercase tracking-wider font-semibold ${
                  t.highlighted ? 'text-emerald-200/80' : 'text-emerald-700'
                }`}
              >
                {t.audience}
              </p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {t.features.map((f, j) => (
                  <li
                    key={j}
                    className={`flex items-start gap-2.5 text-sm leading-snug ${
                      t.highlighted ? 'text-emerald-50/90' : 'text-gray-700'
                    }`}
                  >
                    <span
                      className={`shrink-0 mt-0.5 inline-flex w-4 h-4 items-center justify-center rounded-full ${
                        t.highlighted
                          ? 'bg-emerald-400/25 text-emerald-100'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <Check size={10} strokeWidth={3.5} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.cta.href}
                className={`mt-7 inline-flex items-center justify-center gap-1.5 w-full font-semibold px-4 py-2.5 rounded-lg text-sm transition-all ${
                  t.highlighted
                    ? 'bg-white text-emerald-800 hover:bg-emerald-50 shadow-lg shadow-black/10'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {t.cta.label}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={280}>
        <div className="mt-6 relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-40"
            style={{
              background:
                'radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)',
            }}
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold tracking-tight text-gray-900">
                {enterprise.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{enterprise.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                  {enterprise.priceFrom}
                </span>
                <span className="text-xs font-medium text-gray-500">
                  {enterprise.priceNote}
                </span>
              </div>
              <Link
                href={enterprise.cta.href}
                className="mt-6 inline-flex items-center justify-center w-full sm:w-auto bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px"
              >
                {enterprise.cta.label}
              </Link>
            </div>
            <div className="lg:col-span-2">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {enterprise.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-gray-700 leading-snug"
                  >
                    <span className="shrink-0 mt-0.5 inline-flex w-4 h-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check size={10} strokeWidth={3.5} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {footnote && (
        <Reveal delay={340}>
          <p className="mt-6 text-center text-xs text-gray-500 leading-relaxed max-w-2xl mx-auto">
            {footnote}
          </p>
        </Reveal>
      )}
    </>
  );
}
