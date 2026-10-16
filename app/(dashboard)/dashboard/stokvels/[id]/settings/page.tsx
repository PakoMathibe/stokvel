import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getStokvelById } from '@/lib/actions/stokvels'
import StokvelForm from '@/components/dashboard/StokvelForm'

export const metadata = {
  title: 'Stokvel settings',
}

export default async function StokvelSettingsPage({
  params,
}: {
  params: { id: string }
}) {
  const stokvel = await getStokvelById(params.id)

  if (!stokvel) notFound()

  // Only chairperson or secretary can edit
  const canManage = ['chairperson', 'secretary'].includes(
    stokvel.membership.role
  )
  if (!canManage) {
    redirect(`/dashboard/stokvels/${params.id}`)
  }

  return (
    <div className="max-w-2xl">
      <Link
        href={`/dashboard/stokvels/${stokvel.id}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to {stokvel.name}
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Stokvel settings
        </h1>
        <p className="mt-2 text-gray-600 leading-relaxed">
          Update the name, description, contribution amount, and other details.
          The stokvel type cannot be changed after creation.
        </p>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8">
        <StokvelForm mode="edit" initial={stokvel} />
      </div>
    </div>
  )
}