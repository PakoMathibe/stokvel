import { Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import { getContactContent } from '@/lib/content/contact';
import PageHero from '@/components/landing/PageHero';
import ContactForm from '@/components/forms/ContactForm';
import Reveal from '@/components/landing/Reveal';

export const metadata = {
  title: 'Contact',
  description:
    'Questions about pricing, security, POPIA, or the platform? We answer within one business day.',
};

const CHANNELS = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@stokvelmanager.co.za',
    href: 'mailto:hello@stokvelmanager.co.za',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+27 10 000 0000',
    href: 'https://wa.me/27100000000',
  },
  {
    icon: Clock,
    label: 'Response time',
    value: 'Within 1 business day',
    href: null,
  },
  {
    icon: MapPin,
    label: 'Based in',
    value: 'Johannesburg, South Africa',
    href: null,
  },
];

export default async function ContactPage() {
  const { header } = await getContactContent();

  return (
    <>
      <PageHero header={header} />

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="space-y-3">
                  {CHANNELS.map((c, i) => {
                    const I = c.icon;
                    const inner = (
                      <>
                        <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                          <I size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            {c.label}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-gray-900">
                            {c.value}
                          </p>
                        </div>
                      </>
                    );

                    return c.href ? (
                      <a
                        key={i}
                        href={c.href}
                        className="flex items-center gap-4 bg-white border border-gray-200/80 rounded-2xl p-4 hover:border-emerald-300 hover:shadow-[0_12px_30px_-15px_rgba(16,185,129,0.2)] transition-all"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-white border border-gray-200/80 rounded-2xl p-4"
                      >
                        {inner}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                    Enterprise enquiries
                  </p>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    Interested in white-labelling the platform for your
                    organisation or clients? Mention &ldquo;Enterprise&rdquo; in
                    your message and we&apos;ll route it to the right person.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={120}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
