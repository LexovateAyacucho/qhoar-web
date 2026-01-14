import { createClient } from '@/src/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, Edit, ExternalLink, MapPin, Plus } from 'lucide-react'

export default async function BusinessesPage() {
    const supabase = await createClient()

    // 1. Obtener usuario
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // 2. OJO AQUI: Quitamos .single() para recibir un Array []
    const { data: businesses, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mis Empresas</h1>
                    <p className="text-gray-500">Selecciona una empresa para gestionar su diseño y datos.</p>
                </div>
            </header>

            {/* Manejo de estados vacíos o errores */}
            {(!businesses || businesses.length === 0) ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                    <div className="rounded-full bg-gray-200 p-4">
                        <Building2 className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Aún no tienes empresas</h3>
                    <p className="mt-1 text-sm text-gray-500">Registra tu primer negocio para empezar a aparecer en Qhoar.</p>
                </div>
            ) : (
                /* GRID DE EMPRESAS */
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {businesses.map((business) => (
                        <div
                            key={business.id}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-indigo-300"
                        >
                            {/* Etiqueta de Estado/Premium */}
                            <div className="absolute right-3 top-3 z-10">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                     business.is_premium
                         ? 'bg-amber-100 text-amber-700 border border-amber-200'
                         : 'bg-gray-100 text-gray-600 border border-gray-200'
                 }`}>
                  {business.is_premium ? 'Premium' : 'Gratis'}
                 </span>
                            </div>

                            {/* Portada (Hero o Color Sólido) */}
                            <div className="h-32 w-full bg-gray-100 relative">
                                {business.hero_image_url ? (
                                    <img
                                        src={business.hero_image_url}
                                        className="h-full w-full object-cover"
                                        alt="Portada"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-indigo-50 flex items-center justify-center text-indigo-200">
                                        <Building2 size={40} />
                                    </div>
                                )}
                            </div>

                            {/* Contenido de la Card */}
                            <div className="flex flex-1 flex-col p-5">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600">
                                        {business.name}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                        <MapPin size={12} />
                                        <span className="line-clamp-1">{business.address}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-3">
                                    {/* Botón Principal: GESTIONAR */}
                                    {/* NOTA IMPORTANTE: Fíjate en la URL, pasamos el ID */}
                                    <Link
                                        href={`/portal/business/${business.id}/design`}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
                                    >
                                        <Edit size={16} />
                                        Diseñar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}