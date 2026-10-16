import { getLandingContent } from '@/lib/content/landing';
import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import MoneyStates from '@/components/landing/MoneyStates';
import HowItWorks from '@/components/landing/HowItWorks';
import Types from '@/components/landing/Types';
import RolesTeaser from '@/components/landing/RolesTeaser';
import ReportsPreview from '@/components/landing/ReportsPreview';
import ComplianceStrip from '@/components/landing/ComplianceStrip';
import SaasTeaser from '@/components/landing/SaasTeaser';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';

export const revalidate = 60;

export default async function LandingPage() {
  const content = await getLandingContent();

  return (
    <main className="relative overflow-hidden">
      <Nav links={content.nav} />

      <Hero content={content.hero} />

      <section className="relative py-12 border-y border-gray-200/60 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.14em] font-semibold text-gray-400">
            Trusted by stokvels across South Africa
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {[
              'Soweto',
              'Tembisa',
              'Durban',
              'Pretoria',
              'Cape Town',
              'Port Elizabeth',
            ].map((city) => (
              <span
                key={city}
                className="text-sm font-semibold text-gray-500 tracking-wide"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Features content={content.features} />
      <MoneyStates content={content.moneyStates} />
      <HowItWorks content={content.howItWorks} />
      <Types content={content.types} />
      <RolesTeaser content={content.rolesTeaser} />
      <ReportsPreview content={content.reportsPreview} />
      <ComplianceStrip content={content.compliance} />
      <SaasTeaser content={content.saasTeaser} />
      <Testimonials content={content.testimonials} />
      <Pricing content={content.pricing} />
      <Faq content={content.faq} />
      <FinalCta content={content.cta} />
      <Footer content={content.footer} />
    </main>
  );
}
