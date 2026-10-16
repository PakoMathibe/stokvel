import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import StokvelForm from '@/components/dashboard/StokvelForm'

export const metadata = {
  title: 'New stokvel',
}

export default function NewStokvelPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/stokvels"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to stokvels
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Create a stokvel
        </h1>
        <p className="mt-2 text-gray-600 leading-relaxed">
          You&apos;ll be added as the chairperson automatically. You can invite
          members and change roles afterwards.
        </p>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8">
        <StokvelForm mode="create" />
      </div>
    </div>
  )
}