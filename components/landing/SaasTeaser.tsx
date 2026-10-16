'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Layers,
  QrCode,
  Zap,
  Globe2,
  Lock,
  Code2,
} from 'lucide-react';
import type { SaasTeaserContent } from '@/lib/content/landing';
import Reveal from './Reveal';

const ICONS = [Layers, QrCode, Zap, Globe2, Lock, Code2];

export default function SaasTeaser({
  content,
}: {
  content: SaasTeaserContent;
}) {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent">
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
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              {content.intro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.bullets.map((b, i) => {
            const I = ICONS[i % ICONS.length];
            return (
              <Reveal key={i} delay={i * 60}>
                <div className="group h-full bg-white border border-gray-200/80 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                    <I size={18} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {b}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={400}>
          <div className="mt-12 text-center">
            <Link
              href={content.cta.href}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3.5 rounded-lg shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 group"
            >
              {content.cta.label}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
