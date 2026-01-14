// app/(admin)/admin/dashboard/page.tsx
import { createClient } from '@/src/utils/supabase/server'
import Link from 'next/link'
import {
    Building2,
    Calendar,
    AlertCircle,
    TrendingUp,
    Clock,
    MapPin,
    User
} from 'lucide-react'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    const [
        { count: activeCount },
        { data: pendingBusinesses }, // Ahora incluimos profiles
        { count: premiumCount },
        { data: upcomingEvents }
    ] = await Promise.all([
        // Total Empresas Activas
        supabase
            .from('businesses')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active'),

        // Pendientes CON información del dueño
        supabase
            .from('businesses')
            .select(`
                id, 
                name, 
                created_at, 
                phone,
                owner_id,
                owner:profiles!businesses_owner_id_fkey (
                    full_name,
                    phone,
                    dni
                )
            `)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(5),

        // Empresas Premium
        supabase
            .from('businesses')
            .select('*', { count: 'exact', head: true })
            .eq('is_premium', true),

        // Próximos Eventos (desde hoy en adelante)
        supabase
            .from('events')
            .select('id, title, start_date, location_text')
            .gte('start_date', new Date().toISOString())
            .order('start_date', { ascending: true })
            .limit(5)
    ])

    // Count total de pendientes
    const { count: totalPendingReal } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Panel de Control</h2>
                <p className="text-gray-500 mt-1">Resumen de la actividad en Qhoar Ayacucho</p>
            </div>

            {/* SECCIÓN 1: TARJETAS DE ESTADÍSTICAS (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Solicitudes Pendientes */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Solicitudes Pendientes</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalPendingReal || 0}</h3>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-full">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/businesses" className="text-sm text-yellow-700 font-medium hover:underline">
                            Revisar solicitudes &rarr;
                        </Link>
                    </div>
                </div>

                {/* Card 2: Empresas Activas */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Empresas Activas</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{activeCount || 0}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-full">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">Total en el directorio</p>
                </div>

                {/* Card 3: Suscripciones Premium */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Usuarios Premium</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{premiumCount || 0}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400">Negocios destacados</p>
                </div>

                {/* Card 4: Eventos Próximos */}
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-pink-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Próximos Eventos</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{upcomingEvents?.length || 0}</h3>
                        </div>
                        <div className="p-3 bg-pink-50 rounded-full">
                            <Calendar className="w-6 h-6 text-pink-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/events" className="text-sm text-pink-700 font-medium hover:underline">
                            Gestionar eventos &rarr;
                        </Link>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: LISTAS RECIENTES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Columna Izquierda: Últimas Solicitudes CON INFO DEL DUEÑO */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Clock size={18} />
                            Recientes por Aprobar
                        </h3>
                        <Link href="/admin/businesses" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Ver todas</Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {pendingBusinesses && pendingBusinesses.length > 0 ? (
                            pendingBusinesses.map((biz) => (
                                <div key={biz.id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">{biz.name}</p>
                                            <p className="text-xs text-gray-500">Registrado: {new Date(biz.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <Link
                                            href={`/admin/businesses/${biz.id}`}
                                            className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50"
                                        >
                                            Revisar
                                        </Link>
                                    </div>

                                    {/* INFO DEL DUEÑO */}
                                    {biz.owner && biz.owner.length > 0 && biz.owner[0] && (
                                        <div className="mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                            <div className="flex items-center gap-2 text-xs text-indigo-900">
                                                <User size={12} />
                                                <span className="font-semibold">Dueño:</span>
                                                <span>{biz.owner[0].full_name || 'Sin nombre'}</span>
                                            </div>
                                            <div className="flex gap-4 mt-1 text-xs text-indigo-700">
                                                <span>📞 {biz.owner[0].phone || biz.phone}</span>
                                                {biz.owner[0].dni && <span>DNI: {biz.owner[0].dni}</span>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>¡Todo al día! No hay solicitudes pendientes.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Próximos Eventos */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar size={18} />
                            Agenda de Ayacucho
                        </h3>
                        <Link href="/admin/events" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">Ver calendario</Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {upcomingEvents && upcomingEvents.length > 0 ? (
                            upcomingEvents.map((evt) => (
                                <div key={evt.id} className="p-4 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">{evt.title}</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <MapPin size={12} />
                                                {evt.location_text}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded">
                                                {new Date(evt.start_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(evt.start_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <p>No hay eventos próximos registrados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}