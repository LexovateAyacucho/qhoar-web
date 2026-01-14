'use client'

import { useTransition } from 'react'
import { approveBusiness } from '@/src/app/(admin)/admin/actions'
import { Loader2, CheckCircle } from 'lucide-react'

export function ApproveButton({ businessId }: { businessId: string }) {
    const [isPending, startTransition] = useTransition()

    const handleApprove = () => {
        // startTransition permite invocar la server action sin bloquear la UI
        startTransition(async () => {
            await approveBusiness(businessId)
        })
    }

    return (
        <button
            onClick={handleApprove}
            disabled={isPending}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-900 font-bold border border-green-200 px-3 py-1 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Procesando...</span>
                </>
            ) : (
                <>
                    <CheckCircle size={16} />
                    <span>Aprobar</span>
                </>
            )}
        </button>
    )
}