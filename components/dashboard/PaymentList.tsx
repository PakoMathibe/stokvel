'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  FileText,
  User,
  Paperclip,
} from 'lucide-react'
import type { PaymentWithRecorder } from '@/lib/types/contribution'
import {
  PAYMENT_METHOD_LABELS,
} from '@/lib/types/contribution'
import PaymentStatusBadge from './PaymentStatusBadge'
import VerifyPaymentDialog from './VerifyPaymentDialog'

export default function PaymentList({
  payments,
  currency = 'ZAR',
  canVerify,
}: {
  payments: PaymentWithRecorder[]
  currency?: string
  canVerify: boolean
}) {
  const [verifying, setVerifying] = useState<PaymentWithRecorder | null>(null)

  if (payments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <p className="text-sm text-gray-500">
          No payments recorded yet.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3">Method</th>
              <th className="text-left px-5 py-3">Reference</th>
              <th className="text-right px-5 py-3">Amount</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Recorded by</th>
              {canVerify && <th className="text-right px-5 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => {
              const recorder =
                p.recorder?.full_name || p.recorder?.email || 'Unknown'
              const canBeVerified =
                canVerify &&
                (p.status === 'recorded')

              return (
                <tr key={p.id}>
                  <td className="px-5 py-4 text-xs text-gray-600 whitespace-nowrap">
                    {new Date(p.payment_date).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    {PAYMENT_METHOD_LABELS[p.payment_method]}
                  </td>
                  <td className="px-5 py-4 text-xs font-mono text-gray-600 max-w-[160px] truncate">
                    {p.reference ?? '—'}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900 text-right tabular-nums whitespace-nowrap">
                    {currency} {Number(p.amount).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <PaymentStatusBadge status={p.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <User size={11} className="text-gray-400" />
                      <span className="truncate max-w-[120px]">{recorder}</span>
                    </div>
                  </td>
                  {canVerify && (
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      {canBeVerified ? (
                        <button
                          onClick={() => setVerifying(p)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors px-2 py-1.5 rounded-md hover:bg-emerald-50"
                        >
                          <ShieldCheck size={13} />
                          Verify
                        </button>
                      ) : p.proof_url ? (
                        <a
                          href={p.proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors px-2 py-1.5 rounded-md hover:bg-gray-50"
                        >
                          <Paperclip size={12} />
                          Proof
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {verifying && (
        <VerifyPaymentDialog
          paymentId={verifying.id}
          amount={Number(verifying.amount)}
          currency={currency}
          onClose={() => setVerifying(null)}
        />
      )}
    </>
  )
}