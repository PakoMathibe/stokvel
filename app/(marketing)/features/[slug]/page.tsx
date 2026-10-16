import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getFeatureBySlug, PILLARS } from '@/lib/content/features';
import PageHero from '@/components/landing/PageHero';
import Prose from '@/components/landing/Prose';
import Icon from '@/components/landing/Icon';
import Reveal from '@/components/landing/Reveal';

export async function generateStaticParams() {
  return PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const pillar = await getFeatureBySlug(params.slug);
  if (!pillar) return {};
  return {
    title: pillar.title,
    description: pillar.summary,
  };
}

export default async function FeatureDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const pillar = await getFeatureBySlug(params.slug);
  if (!pillar) notFound();

  return (
    <>
      <PageHero
        header={{
          eyebrow: 'Feature',
          headline: pillar.title,
          subheadline: pillar.summary,
        }}
      />

      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-start gap-4 p-5 rounded-2xl border border-emerald-200/70 bg-emerald-50/50">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Icon name={pillar.icon} size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                  {pillar.tagline}
                </p>
                <ul className="mt-3 space-y-2">
                  {pillar.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {pillar.detail && pillar.detail.length > 0 && (
        <section className="pb-20">
          <Prose blocks={pillar.detail} />
        </section>
      )}

      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-gray-200">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft size={16} />
              All features
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px group"
            >
              Start free
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
