'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { RolesTeaserContent } from '@/lib/content/landing';
import Reveal from './Reveal';

const ROLE_CHIPS = [
  { name: 'Chairperson', tone: 'from-emerald-500 to-emerald-700' },
  { name: 'Treasurer', tone: 'from-teal-500 to-emerald-700' },
  { name: 'Secretary', tone: 'from-emerald-400 to-teal-600' },
  { name: 'Member', tone: 'from-emerald-300 to-emerald-500' },
  { name: 'Auditor', tone: 'from-slate-500 to-slate-700' },
  { name: 'Admin', tone: 'from-amber-500 to-amber-700' },
];

export default function RolesTeaser({
  content,
}: {
  content: RolesTeaserContent;
}) {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
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
              <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                {content.intro}
              </p>
            </Reveal>
            <Reveal delay={280}>
              <Link
                href={content.cta.href}
                className="mt-8 inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 group"
              >
                {content.cta.label}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={200}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ROLE_CHIPS.map((r, i) => (
                  <div
                    key={r.name}
                    className="group relative rounded-2xl bg-white border border-gray-200/80 p-5 text-center transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)]"
                    style={{
                      animation: `fadeInUp 500ms cubic-bezier(0.22,1,0.36,1) ${
                        i * 60
                      }ms both`,
                    }}
                  >
                    <div
                      className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${r.tone} shadow-md flex items-center justify-center text-white text-sm font-bold tracking-tight`}
                    >
                      {r.name.slice(0, 2)}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-900">
                      {r.name}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
