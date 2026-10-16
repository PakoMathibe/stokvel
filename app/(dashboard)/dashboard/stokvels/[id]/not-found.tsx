import Link from 'next/link'
import { ArrowLeft, Search } from 'lucide-react'

export default function StokvelNotFound() {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
        <Search size={22} className="text-emerald-700" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900">
        Stokvel not found
      </h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        Either this stokvel doesn&apos;t exist, or you don&apos;t have access to
        it.
      </p>
      <Link
        href="/dashboard/stokvels"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to stokvels
      </Link>
    </div>
  )
}