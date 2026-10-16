import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPrivacyContent } from '@/lib/content/privacy';
import PageHero from '@/components/landing/PageHero';
import Prose from '@/components/landing/Prose';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How we handle personal information on the Stokvel Manager platform, aligned with POPIA.',
};

export default async function PrivacyPage() {
  const { header, blocks, cta } = await getPrivacyContent();

  return (
    <>
      <PageHero header={header} />
      <section className="pb-16">
        <Prose blocks={blocks} />
      </section>
      {cta && (
        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 group"
            >
              {cta.label}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
