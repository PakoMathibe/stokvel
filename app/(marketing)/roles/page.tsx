import { getRolesContent } from '@/lib/content/roles';
import PageHero from '@/components/landing/PageHero';
import RoleMatrix from '@/components/landing/RoleMatrix';
import Reveal from '@/components/landing/Reveal';

export const metadata = {
  title: 'Roles & permissions',
  description:
    'The chairperson, treasurer and secretary do different jobs. The system gives each exactly the access they need — and nothing more.',
};

export default async function RolesPage() {
  const { header, intro, roles, matrix, note } = await getRolesContent();

  return (
    <>
      <PageHero header={header}>
        <p className="mt-6 text-base text-gray-600 leading-relaxed max-w-2xl">
          {intro}
        </p>
      </PageHero>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {roles.map((r, i) => (
              <Reveal key={r.key} delay={i * 60}>
                <div className="h-full bg-white border border-gray-200/80 rounded-2xl p-6">
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    {r.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">{r.short}</p>
                  <ul className="mt-5 space-y-2">
                    {r.responsibilities.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Permission matrix
            </h2>
            <p className="mt-2 text-gray-600 max-w-3xl">
              A quick view of who can do what. Permissions are enforced at the
              platform level, not by convention.
            </p>
          </Reveal>
          <div className="mt-8">
            <RoleMatrix matrix={matrix} note={note} />
          </div>
        </div>
      </section>
    </>
  );
}
