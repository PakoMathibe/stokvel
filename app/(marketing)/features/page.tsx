import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getFeaturesIndex } from '@/lib/content/features';
import PageHero from '@/components/landing/PageHero';
import Icon from '@/components/landing/Icon';
import Reveal from '@/components/landing/Reveal';

export const metadata = {
  title: 'Features',
  description:
    'Nine modules covering the full lifecycle of a South African stokvel: members, contributions, financial management, payouts, reports, governance, payments, security and SaaS.',
};

export default async function FeaturesIndexPage() {
  const { header, pillars } = await getFeaturesIndex();

  return (
    <>
      <PageHero header={header} />

      <section className="pb-24 sm:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((p, i) => (
              <Reveal key={p.slug} delay={i * 50}>
                <Link
                  href={`/features/${p.slug}`}
                  className="group block h-full bg-white border border-gray-200/80 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-[0_18px_40px_-20px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:border-emerald-500 transition-all duration-300">
                      <Icon name={p.icon} size={20} />
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-gray-900 tracking-tight">
                    {p.title}
                  </h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    {p.tagline}
                  </p>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {p.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
