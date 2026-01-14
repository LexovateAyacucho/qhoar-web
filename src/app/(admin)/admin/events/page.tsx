// app/(admin)/admin/events/page.tsx
import { createClient } from '@/src/utils/supabase/server'
import { CreateEventForm } from '@/src/components/admin/create-event-form'
import { MapPin, Calendar, User, Building2, ExternalLink, Star } from 'lucide-react'

export default async function AdminEventsPage() {
    const supabase = await createClient()

    // Obtener todos los eventos con información del organizador
    const { data: events } = await supabase
        .from('events')
        .select(`
            *,
            businesses (
                name,
                logo_url
            )
        `)
        .order('start_date', { ascending: false })

    // Obtener lista de empresas para el formulario
    const { data: businesses } = await supabase
        .from('businesses')
        .select('id, name')
        .eq('status', 'active')
        .order('name')

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Gestión de Eventos</h2>
                <p className="text-gray-500 mt-1">Crea y administra eventos en Ayacucho</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* COLUMNA IZQUIERDA: Formulario (1/3) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Crear Nuevo Evento</h3>
                        <CreateEventForm businesses={businesses} />
                    </div>
                </div>

                {/* COLUMNA DERECHA: Lista de Eventos (2/3) */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Eventos Registrados</h3>

                    {events && events.length > 0 ? (
                        <div className="space-y-4">
                            {events.map((event) => {
                                const startDate = new Date(event.start_date)
                                const endDate = event.end_date ? new Date(event.end_date) : null
                                const isUpcoming = startDate > new Date()
                                const isPast = startDate < new Date()

                                return (
                                    <div
                                        key={event.id}
                                        className={`bg-white p-6 rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                                            event.is_featured
                                                ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-white'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                {/* Título y Badges */}
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                                            {event.title}
                                                            {event.is_featured && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                                                    <Star size={12} className="mr-1" /> Destacado
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${
                                                            event.category === 'cultural' ? 'bg-purple-100 text-purple-700' :
                                                                event.category === 'social' ? 'bg-blue-100 text-blue-700' :
                                                                    event.category === 'academico' ? 'bg-green-100 text-green-700' :
                                                                        event.category === 'deportivo' ? 'bg-orange-100 text-orange-700' :
                                                                            'bg-gray-100 text-gray-700'
                                                        }`}>
                                                            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                                                        </span>
                                                    </div>

                                                    {/* Estado del evento */}
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        isUpcoming ? 'bg-green-100 text-green-700' :
                                                            isPast ? 'bg-gray-100 text-gray-600' :
                                                                'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {isUpcoming ? '📅 Próximo' : isPast ? '✓ Pasado' : '🔴 En Curso'}
                                                    </span>
                                                </div>

                                                {/* Descripción */}
                                                {event.description && (
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        {event.description}
                                                    </p>
                                                )}

                                                {/* Información en Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                    {/* Fecha */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <Calendar size={16} className="text-indigo-500" />
                                                        <div>
                                                            <span className="font-semibold">
                                                                {startDate.toLocaleDateString('es-PE', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </span>
                                                            <span className="text-gray-500 ml-1">
                                                                {startDate.toLocaleTimeString('es-PE', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                            {endDate && (
                                                                <span className="text-xs text-gray-400 block">
                                                                    hasta {endDate.toLocaleDateString('es-PE', {
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Ubicación */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        <MapPin size={16} className="text-red-500" />
                                                        <div>
                                                            <span>{event.location_text}</span>
                                                            {event.latitude && event.longitude && (
                                                                <span className="text-xs text-green-600 block">
                                                                    ✓ Coordenadas GPS disponibles
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Organizador */}
                                                    <div className="flex items-center gap-2 text-gray-700">
                                                        {event.businesses ? (
                                                            <>
                                                                <Building2 size={16} className="text-blue-500" />
                                                                <span className="font-medium">{event.businesses.name}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <User size={16} className="text-gray-500" />
                                                                <span>{event.organizer_name || 'Sin organizador'}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {/* Enlace Externo */}
                                                    {event.external_link && (
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <ExternalLink size={16} className="text-purple-500" />
                                                            <a
                                                                href={event.external_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-purple-600 hover:text-purple-800 font-medium underline text-sm"
                                                            >
                                                                {event.action_text || 'Ver más información'}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Poster (si existe) */}
                                            {event.poster_url && (
                                                <div className="ml-4 flex-shrink-0">
                                                    <img
                                                        src={event.poster_url}
                                                        alt={event.title}
                                                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Metadata al pie */}
                                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                                            <span>ID: {event.id.slice(0, 8)}...</span>
                                            <span>Creado: {new Date(event.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">No hay eventos registrados aún.</p>
                            <p className="text-sm text-gray-400 mt-1">Crea el primer evento usando el formulario de la izquierda.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}