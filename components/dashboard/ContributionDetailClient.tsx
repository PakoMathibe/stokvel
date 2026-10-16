'use client'

import { useState } from 'react'
import { Plus, ShieldCheck } from 'lucide-react'
import type { PaymentWithRecorder } from '@/lib/types/contribution'
import PaymentList from './PaymentList'
import RecordPaymentDialog from './RecordPaymentDialog'
import VerifyPaymentDialog from './VerifyPaymentDialog'

export default function ContributionDetailClient({
  stokvelId,
  contributionId,
  amountDue,
  currency,
  payments,
  canRecord,
  canVerify,
}: {
  stokvelId: string
  contributionId: string
  amountDue: number
  currency: string
  payments: PaymentWithRecorder[]
  canRecord: boolean
  canVerify: boolean
}) {
  const [recording, setRecording] = useState(false)
  const [verifyingUnverified, setVerifyingUnverified] = useState(false)

  const unverified = payments.filter((p) => p.status === 'recorded')

  return (
    <>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Payments</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {payments.length} recorded ·{' '}
            {unverified.length > 0
              ? `${unverified.length} awaiting verification`
              : 'all verified'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {canVerify && unverified.length > 0 && (
            <button
              onClick={() => setVerifyingUnverified(true)}
              className="inline-flex items-center gap-2 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all"
            >
              <ShieldCheck size={14} />
              Verify next
            </button>
          )}
          {canRecord && (
            <button
              onClick={() => setRecording(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-px"
            >
              <Plus size={14} />
              Record payment
            </button>
          )}
        </div>
      </div>

      <PaymentList
        payments={payments}
        currency={currency}
        canVerify={canVerify}
      />

      {recording && (
        <RecordPaymentDialog
          stokvelId={stokvelId}
          contributionId={contributionId}
          amountDue={amountDue}
          currency={currency}
          onClose={() => setRecording(false)}
        />
      )}

      {verifyingUnverified && unverified.length > 0 && (
        <VerifyPaymentDialog
          paymentId={unverified[0].id}
          amount={Number(unverified[0].amount)}
          currency={currency}
          onClose={() => setVerifyingUnverified(false)}
        />
      )}
    </>
  )
}