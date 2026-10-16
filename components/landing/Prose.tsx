'use client';

import type { ProseBlock } from '@/lib/content/types';
import Reveal from './Reveal';

const CALLOUT_STYLES: Record<
  'info' | 'warn' | 'success',
  { wrap: string; title: string; icon: string }
> = {
  info: {
    wrap: 'bg-emerald-50/70 border-emerald-200',
    title: 'text-emerald-900',
    icon: 'ℹ',
  },
  warn: {
    wrap: 'bg-amber-50/80 border-amber-200',
    title: 'text-amber-900',
    icon: '⚠',
  },
  success: {
    wrap: 'bg-emerald-50/80 border-emerald-200',
    title: 'text-emerald-900',
    icon: '✓',
  },
};

export default function Prose({ blocks }: { blocks: ProseBlock[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h2':
            return (
              <Reveal key={i}>
                <h2 className="mt-14 mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  {b.text}
                </h2>
              </Reveal>
            );
          case 'h3':
            return (
              <Reveal key={i}>
                <h3 className="mt-10 mb-3 text-xl font-bold text-gray-900">
                  {b.text}
                </h3>
              </Reveal>
            );
          case 'p':
            return (
              <Reveal key={i}>
                <p className="my-4 text-gray-700 leading-relaxed">{b.text}</p>
              </Reveal>
            );
          case 'ul':
            return (
              <Reveal key={i}>
                <ul className="my-5 space-y-2.5">
                  {b.items.map((it, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-gray-700 leading-relaxed"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          case 'ol':
            return (
              <Reveal key={i}>
                <ol className="my-5 space-y-2.5 list-decimal list-inside marker:text-emerald-700 marker:font-semibold">
                  {b.items.map((it, j) => (
                    <li key={j} className="text-gray-700 leading-relaxed">
                      {it}
                    </li>
                  ))}
                </ol>
              </Reveal>
            );
          case 'callout': {
            const s = CALLOUT_STYLES[b.tone];
            return (
              <Reveal key={i}>
                <div className={`my-8 rounded-2xl border ${s.wrap} p-5 sm:p-6`}>
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className={`shrink-0 w-6 h-6 rounded-full bg-white border border-current/10 flex items-center justify-center text-sm font-bold ${s.title}`}
                    >
                      {s.icon}
                    </span>
                    <div>
                      <p className={`font-bold ${s.title}`}>{b.title}</p>
                      <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">
                        {b.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          }
        }
      })}
    </div>
  );
}
