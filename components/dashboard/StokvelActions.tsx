'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Settings, Archive, Loader2, RotateCcw } from 'lucide-react'
import {
  archiveStokvelAction,
  restoreStokvelAction,
} from '@/lib/actions/stokvels'

export default function StokvelActions({
  stokvelId,
  status,
  canManage,
}: {
  stokvelId: string
  status: 'active' | 'archived' | 'closed'
  canManage: boolean
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!canManage) return null

  async function handleArchive() {
    setError(null)
    setLoading(true)
    const result = await archiveStokvelAction(stokvelId)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    setConfirming(false)
    router.refresh()
  }

  async function handleRestore() {
    setError(null)
    setLoading(true)
    const result = await restoreStokvelAction(stokvelId)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        href={`/dashboard/stokvels/${stokvelId}/settings`}
        className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all text-sm"
      >
        <Settings size={15} />
        Settings
      </Link>

      {status === 'active' ? (
        <button
          onClick={() => setConfirming(true)}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all text-sm"
        >
          <Archive size={15} />
          Archive
        </button>
      ) : (
        <button
          onClick={handleRestore}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all text-sm disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <RotateCcw size={15} />
          )}
          Restore
        </button>
      )}

      {error && (
        <p className="text-xs text-red-700 w-full mt-1">{error}</p>
      )}

      {confirming && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => !loading && setConfirming(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Archive size={20} className="text-amber-700" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">
              Archive this stokvel?
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              The stokvel will be hidden from active lists. All members,
              contributions, payments, and audit history are preserved. You can
              restore it at any time.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleArchive}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Archiving…
                  </>
                ) : (
                  'Yes, archive'
                )}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={loading}
                className="inline-flex items-center justify-center bg-white border border-gray-200 hover:border-gray-300 disabled:opacity-60 text-gray-700 font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}