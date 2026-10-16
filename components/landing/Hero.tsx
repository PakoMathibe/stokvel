'use client';

import Link from 'next/link';
import { ArrowRight, Check, Play, TrendingUp, Wallet } from 'lucide-react';
import type { HeroContent } from '@/lib/content/landing';
import Reveal from './Reveal';

export default function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-40 animate-pulse-slow"
        style={{
          background:
            'radial-gradient(circle, rgba(52,211,153,0.35) 0%, transparent 65%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full opacity-30 animate-pulse-slow"
        style={{
          background:
            'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 65%)',
          animationDelay: '1.5s',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/70 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
                </span>
                {content.eyebrow}
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.05]">
                {content.headline}{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-emerald-700 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    {content.headlineAccent}
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 300 12"
                    className="absolute -bottom-2 left-0 w-full h-3 text-emerald-300/60"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2,10 Q150,-2 298,10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                {content.subheadline}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={content.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3.5 rounded-lg shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 group"
                >
                  {content.primaryCta.label}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <a
                  href={content.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-800 font-semibold px-6 py-3.5 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
                >
                  <Play size={16} className="text-emerald-600" />
                  {content.secondaryCta.label}
                </a>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
                {content.stats.map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                      {s.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 leading-snug">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 relative">
            <Reveal delay={200}>
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative bg-white border border-gray-200/80 rounded-2xl shadow-[0_24px_60px_-20px_rgba(16,24,40,0.18)] p-6 animate-float">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                        Group balance
                      </p>
                      <p className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
                        R 48,250<span className="text-gray-400">.00</span>
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/25">
                      <Wallet size={20} className="text-white" />
                    </div>
                  </div>

                  <div className="h-24 mb-5">
                    <svg
                      viewBox="0 0 300 80"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <defs>
                        <linearGradient
                          id="heroFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="rgba(16,185,129,0.28)" />
                          <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                        </linearGradient>
                        <linearGradient
                          id="heroStroke"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,60 C50,55 70,30 110,35 C150,40 170,15 210,20 C250,25 270,10 300,5 L300,80 L0,80 Z"
                        fill="url(#heroFill)"
                      />
                      <path
                        d="M0,60 C50,55 70,30 110,35 C150,40 170,15 210,20 C250,25 270,10 300,5"
                        fill="none"
                        stroke="url(#heroStroke)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: 500,
                          animation:
                            'drawLine 1600ms cubic-bezier(0.22,1,0.36,1) 400ms both',
                        }}
                      />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Nomsa M.', amount: 500, paid: true },
                      { name: 'Thabo K.', amount: 500, paid: true },
                      { name: 'Aisha P.', amount: 500, paid: false },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-t border-gray-100 first:border-0"
                        style={{
                          animation: `fadeInUp 500ms cubic-bezier(0.22,1,0.36,1) ${
                            600 + i * 100
                          }ms both`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center text-[11px] font-bold text-emerald-800">
                            {row.name
                              .split(' ')
                              .map((s) => s[0])
                              .join('')}
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {row.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 tabular-nums">
                            R {row.amount}
                          </span>
                          {row.paid ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check
                                size={11}
                                className="text-emerald-700"
                                strokeWidth={3}
                              />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="absolute -top-4 -left-4 sm:-left-8 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-900/5 px-3.5 py-2.5 flex items-center gap-2.5 animate-float-delay"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp size={14} className="text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                      This month
                    </p>
                    <p className="text-xs font-bold text-gray-900">+R 4,500</p>
                  </div>
                </div>

                <div
                  className="absolute -bottom-4 -right-4 sm:-right-8 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-900/5 px-3.5 py-2.5 flex items-center gap-2.5 animate-float"
                  style={{ animationDelay: '2s' }}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Check
                      size={14}
                      className="text-amber-700"
                      strokeWidth={3}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                      3 of 3 paid
                    </p>
                    <p className="text-xs font-bold text-gray-900">
                      All caught up
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
