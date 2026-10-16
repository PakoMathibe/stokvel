'use client';

import { ArrowUpRight } from 'lucide-react';
import type { TypesContent } from '@/lib/content/landing';
import Reveal from './Reveal';

export default function Types({ content }: { content: TypesContent }) {
  return (
    <section id="types" className="relative py-24 sm:py-32">
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
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.types.map((t, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="group h-full bg-white border border-gray-200/80 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                    {t.name}
                  </h3>
                  <ArrowUpRight
                    size={16}
                    className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed flex-1">
                  {t.description}
                </p>
                <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Example
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-800">
                    {t.example}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
