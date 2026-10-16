'use client';

import type { HowItWorksContent } from '@/lib/content/landing';
import Reveal from './Reveal';

export default function HowItWorks({
  content,
}: {
  content: HowItWorksContent;
}) {
  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
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
        </div>

        <div className="mt-20 relative">
          <div
            aria-hidden
            className="hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {content.steps.map((s, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="relative text-center">
                  <div className="relative inline-flex w-24 h-24 rounded-2xl bg-white border border-emerald-200 shadow-[0_12px_30px_-12px_rgba(16,185,129,0.3)] items-center justify-center mb-6">
                    <span className="text-3xl font-extrabold bg-gradient-to-br from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
                      {s.number}
                    </span>
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-emerald-100 ring-offset-2 ring-offset-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {s.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
