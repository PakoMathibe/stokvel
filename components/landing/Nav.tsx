'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Sparkles, X } from 'lucide-react';
import type { NavLink } from '@/lib/content/types';

export default function Nav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isAnchor(href: string) {
    return href.startsWith('#') || href.startsWith('/#');
  }

  function renderLink(l: NavLink) {
    const isActive =
      !isAnchor(l.href) &&
      (pathname === l.href || pathname.startsWith(l.href + '/'));

    const classes = `text-sm font-medium transition-colors ${
      isActive ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'
    }`;

    if (isAnchor(l.href)) {
      return (
        <a key={l.href} href={l.href} className={classes}>
          {l.label}
        </a>
      );
    }
    return (
      <Link key={l.href} href={l.href} className={classes}>
        {l.label}
      </Link>
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-gray-200 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-700/20 transition-transform group-hover:scale-105">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-[15px] font-bold tracking-tight text-gray-900">
                  Stokvel
                </div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-700/80 font-semibold">
                  Manager
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {links.map((l) => renderLink(l))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-emerald-700 transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-md shadow-sm shadow-emerald-500/20 transition-all hover:-translate-y-px"
              >
                Start free
              </Link>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden p-2 -mr-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
              aria-label="Open menu"
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white animate-fade-in overflow-y-auto">
          <nav className="px-6 py-6 space-y-1">
            {links.map((l) =>
              isAnchor(l.href) ? (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  {l.label}
                </Link>
              )
            )}
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-center px-4 py-3 rounded-lg text-base font-medium text-gray-800 border border-gray-200 hover:bg-gray-50"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="text-center px-4 py-3 rounded-lg text-base font-semibold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-sm"
              >
                Start free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
