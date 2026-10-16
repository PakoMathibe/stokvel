'use client';

import type { SectionHeader } from '@/lib/content/types';
import Reveal from './Reveal';

export default function PageHero({
  header,
  children,
}: {
  header: SectionHeader;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 animate-pulse-slow"
        style={{
          background:
            'radial-gradient(circle, rgba(52,211,153,0.35) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at top, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at top, black 30%, transparent 75%)',
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            {header.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05]">
            {header.headline}
          </h1>
        </Reveal>
        {header.subheadline && (
          <Reveal delay={160}>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
              {header.subheadline}
            </p>
          </Reveal>
        )}
        {children && <Reveal delay={240}>{children}</Reveal>}
      </div>
    </section>
  );
}
