import Nav from '@/components/landing/Nav';
import Footer from '@/components/landing/Footer';
import { getLandingContent } from '@/lib/content/landing';

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getLandingContent();

  return (
    <>
      <Nav links={content.nav} />
      <main className="relative overflow-hidden">{children}</main>
      <Footer content={content.footer} />
    </>
  );
}
