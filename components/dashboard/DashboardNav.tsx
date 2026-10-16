'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sparkles,
  LayoutDashboard,
  Users,
  Wallet,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { logoutAction } from '@/lib/supabase/auth-actions'

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Stokvels', href: '/dashboard/stokvels', icon: Users, exact: false },
  {
    label: 'Contributions',
    href: '/dashboard/contributions',
    icon: Wallet,
    exact: false,
  },
  { label: 'Reports', href: '/dashboard/reports', icon: FileText, exact: false },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    exact: false,
  },
]

export default function DashboardNav({ profile }: { profile: any }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(item: (typeof NAV)[number]) {
    return item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-200/70">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-[14px] font-bold tracking-tight text-gray-900">
              Stokvel
            </div>
            <div className="text-[10px] uppercase tracking-widest text-emerald-700/80 font-semibold">
              Manager
            </div>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
              }`}
            >
              <Icon
                size={17}
                className={
                  active
                    ? 'text-emerald-600'
                    : 'text-gray-400 group-hover:text-emerald-600'
                }
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-200/70 p-3">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-semibold text-gray-900 leading-tight truncate">
            {profile?.full_name || 'User'}
          </p>
          <p className="text-[10px] text-gray-500 leading-tight truncate">
            {profile?.email}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Log out
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-gray-900">
              Stokvel Manager
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -mr-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40 animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-end p-2 border-b border-gray-100">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  )
}