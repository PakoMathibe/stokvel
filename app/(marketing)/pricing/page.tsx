import { getPricingContent } from '@/lib/content/pricing'
import PageHero from '@/components/landing/PageHero'
import PricingTable from '@/components/landing/PricingTable'
import Reveal from '@/components/landing/Reveal'
import { ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'Pricing',
  description:
    'Simple pricing for South African stokvels. Start free, upgrade when your group grows. Enterprise white-labelling available.',
}

export default async function PricingPage() {
  const { header, intro, tiers, enterprise, footnote, faq } =
    await getPricingContent()

  return (
    <>
      <PageHero header={header}>
        <p className="mt-6 text-base text-gray-600 leading-relaxed max-w-2xl">
          {intro}
        </p>
      </PageHero>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PricingTable
            tiers={tiers}
            enterprise={enterprise}
            footnote={footnote}
          />
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 text-center">
              Pricing questions
            </h2>
          </Reveal>
          <div className="mt-10 space-y-3">
            {faq.map((f, i) => (
              <Reveal key={i} delay={i * 30}>
                <details className="group bg-white border border-gray-200/80 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 p-5">
                    <span className="font-semibold text-gray-900">
                      {f.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 text-gray-400 transition-transform group-open:rotate-180 group-open:text-emerald-600"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                    {f.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}