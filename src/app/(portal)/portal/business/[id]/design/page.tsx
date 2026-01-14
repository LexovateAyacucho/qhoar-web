import { createClient } from '@/src/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import DesignEditor from './design-editor'
import { Lock } from 'lucide-react'

interface Props {
    params: Promise<{ id: string }>
}

export default async function DesignPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/')

    const { data: business, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single()

    if (error || !business) {
        return notFound()
    }
    if (!business.is_premium) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-4 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border border-stone-200">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-stone-900 mb-2">Acceso Premium Requerido</h1>
                    <p className="text-stone-600 mb-6">
                        La personalización web avanzada está disponible exclusivamente para miembros Premium de Qhoar.
                    </p>
                    <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 text-sm text-stone-500 mb-6">
                        Tu suscripción actual no incluye acceso a este panel.
                    </div>

                    {/* Botón para regresar o desloguearse */}
                    <form action={async () => {
                        'use server'
                        const sb = await createClient()
                        await sb.auth.signOut()
                        redirect('/')
                    }}>
                        <button className="w-full py-3 px-4 bg-stone-900 text-white rounded-xl font-medium hover:bg-stone-800 transition-colors">
                            Regresar al Inicio
                        </button>
                    </form>
                </div>
            </div>
        )
    }
    return <DesignEditor initialBusiness={business} />
}