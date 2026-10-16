'use client';

import type { PricingSectionContent } from '@/lib/content/landing';
import Reveal from './Reveal';
import PricingTable from './PricingTable';

export default function Pricing({
  content,
}: {
  content: PricingSectionContent;
}) {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
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

        <div className="mt-16">
          <PricingTable
            tiers={content.tiers}
            enterprise={content.enterprise}
            footnote={content.footnote}
          />
        </div>
      </div>
    </section>
  );
}
