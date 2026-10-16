'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqContent } from '@/lib/content/landing';
import Reveal from './Reveal';

export default function Faq({ content }: { content: FaqContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
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

        <div className="mt-14 space-y-3">
          {content.items.map((f, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={i} delay={i * 30}>
                <div className="bg-white border border-gray-200/80 rounded-xl overflow-hidden transition-all hover:border-emerald-200">
                  <button
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-gray-900">
                      {f.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                        open ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: open ? '1fr' : '0fr',
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                        {f.answer}
                      </p>
                    </div>
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
