'use client';

import type { TestimonialsContent } from '@/lib/content/landing';
import Reveal from './Reveal';

export default function Testimonials({
  content,
}: {
  content: TestimonialsContent;
}) {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent">
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
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((t, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="relative h-full bg-white border border-gray-200/80 rounded-2xl p-6 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.2)] hover:-translate-y-1 transition-all duration-300">
                <div
                  aria-hidden
                  className="absolute -top-3 left-6 text-6xl leading-none text-emerald-200/70 font-serif"
                >
                  &ldquo;
                </div>
                <p className="relative text-gray-700 leading-relaxed pt-3">
                  {t.quote}
                </p>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-xs font-bold tracking-wide">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {t.author}
                    </p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
