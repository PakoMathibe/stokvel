'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { CtaSection } from '@/lib/content/types'
import Reveal from './Reveal'

export default function FinalCta({ content }: { content: CtaSection }) {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-800 to-emerald-900 rounded-3xl p-10 sm:p-16 text-center shadow-2xl shadow-emerald-900/20">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -right-24 w-96 h-96 rounded-full opacity-30"
              style={{
                background:
                  'radial-gradient(circle, rgba(52,211,153,0.6) 0%, transparent 65%)',
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -left-24 w-[500px] h-[500px] rounded-full opacity-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 65%)',
              }}
            />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.1]">
                {content.headline}
              </h2>
              <p className="mt-5 text-lg text-emerald-50/80 max-w-2xl mx-auto leading-relaxed">
                {content.subheadline}
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={content.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 bg-white text-emerald-800 font-semibold px-7 py-3.5 rounded-lg shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:shadow-xl group"
                >
                  {content.primaryCta.label}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href={content.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  {content.secondaryCta.label}
                </Link>
              </div>

              <p className="mt-6 text-xs text-emerald-50/60">
                No card required · Cancel any time · POPIA compliant
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}