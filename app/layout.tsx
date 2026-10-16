import type { Metadata } from 'next'
import './globals.css'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Stokvel Manager — The modern home for South African stokvels',
    template: '%s · Stokvel Manager',
  },
  description:
    'Track contributions, run payouts, manage members, and keep every rand transparent. Built for South African savings groups.',
  applicationName: 'Stokvel Manager',
  authors: [{ name: 'Stokvel Manager' }],
  keywords: [
    'stokvel',
    'stokvel management',
    'savings group',
    'South Africa',
    'contributions',
    'payouts',
    'POPIA',
  ],
  themeColor: '#059669',
  openGraph: {
    title: 'Stokvel Manager',
    description:
      'The modern home for South African stokvels. Track contributions, run payouts, keep every rand transparent.',
    type: 'website',
    locale: 'en_ZA',
    siteName: 'Stokvel Manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stokvel Manager',
    description:
      'The modern home for South African stokvels. Track contributions, run payouts, keep every rand transparent.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-ZA">
      <body className="antialiased">{children}</body>
    </html>
  )
}