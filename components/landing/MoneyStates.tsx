'use client';

import type { MoneyStatesContent } from '@/lib/content/landing';
import Reveal from './Reveal';

const TONE: Record<
  'recorded' | 'verified' | 'available' | 'owed',
  { bg: string; ring: string; dot: string; label: string }
> = {
  recorded: {
    bg: 'bg-blue-50/60',
    ring: 'ring-blue-100',
    dot: 'bg-blue-500',
    label: 'text-blue-900',
  },
  verified: {
    bg: 'bg-emerald-50/60',
    ring: 'ring-emerald-100',
    dot: 'bg-emerald-500',
    label: 'text-emerald-900',
  },
  available: {
    bg: 'bg-emerald-50/60',
    ring: 'ring-emerald-100',
    dot: 'bg-emerald-700',
    label: 'text-emerald-900',
  },
  owed: {
    bg: 'bg-amber-50/60',
    ring: 'ring-amber-100',
    dot: 'bg-amber-500',
    label: 'text-amber-900',
  },
};

export default function MoneyStates({
  content,
}: {
  content: MoneyStatesContent;
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

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.states.map((s, i) => {
            const t = TONE[s.key];
            return (
              <Reveal key={s.key} delay={i * 80}>
                <div
                  className={`h-full rounded-2xl ${t.bg} ring-1 ${t.ring} p-6 transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)]`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${t.dot} ring-2 ring-white`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${t.label}`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 tracking-tight">
                    {s.label}
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="mt-5 pt-4 border-t border-current/10">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                      Example
                    </p>
                    <p className="mt-1 text-xs text-gray-700 italic leading-relaxed">
                      {s.example}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
