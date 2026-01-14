// components/admin/create-event-form.tsx
'use client'

import { useActionState } from 'react'
import { useState } from 'react'
import { createEvent } from '@/src/app/(admin)/admin/actions'
import { MapPin, Link as LinkIcon, MessageSquare } from 'lucide-react'

type Props = {
    businesses: { id: string, name: string }[] | null
}

export function CreateEventForm({ businesses }: Props) {
    const [state, action, isPending] = useActionState(createEvent, null)
    const [organizerType, setOrganizerType] = useState<'business' | 'manual'>('business')
    const [hasCoordinates, setHasCoordinates] = useState(false)
    const [hasExternalLink, setHasExternalLink] = useState(false)

    return (
        <form action={action} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">

            {/* Título y Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Título del Evento *</label>
                    <input
                        name="title"
                        required
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Ej: Concierto de Guitarra"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Categoría *</label>
                    <select
                        name="category"
                        required
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        <option value="cultural">Cultural</option>
                        <option value="social">Social</option>
                        <option value="academico">Académico</option>
                        <option value="deportivo">Deportivo</option>
                        <option value="religioso">Religioso</option>
                        <option value="entretenimiento">Entrenimiento</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fecha y Hora de Inicio *</label>
                    <input
                        type="datetime-local"
                        name="start_date"
                        required
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fecha y Hora de Fin</label>
                    <input
                        type="datetime-local"
                        name="end_date"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <p className="text-xs text-gray-400">Déjalo vacío si es evento de un solo día.</p>
                </div>
            </div>

            {/* Lógica de Organizador */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                <label className="text-sm font-bold text-gray-800">¿Quién organiza? *</label>

                <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="organizer_type"
                            value="business"
                            checked={organizerType === 'business'}
                            onChange={() => setOrganizerType('business')}
                        />
                        <span className="text-sm">Empresa Registrada</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="organizer_type"
                            value="manual"
                            checked={organizerType === 'manual'}
                            onChange={() => setOrganizerType('manual')}
                        />
                        <span className="text-sm">Externo / Otro</span>
                    </label>
                </div>

                {organizerType === 'business' ? (
                    <select name="business_id" className="w-full p-2 border rounded-md bg-white">
                        <option value="">-- Seleccionar Empresa --</option>
                        {businesses?.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        name="organizer_name"
                        placeholder="Escribe el nombre del organizador"
                        className="w-full p-2 border rounded-md bg-white"
                    />
                )}
            </div>

            {/* Ubicación Textual */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin size={16} />
                    Ubicación (Texto) *
                </label>
                <input
                    name="location_text"
                    required
                    placeholder="Ej: Plaza de Armas, Ayacucho"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            {/* NUEVO: Coordenadas GPS */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-blue-900 flex items-center gap-2">
                        <MapPin size={16} />
                        Coordenadas GPS
                    </label>
                    <button
                        type="button"
                        onClick={() => setHasCoordinates(!hasCoordinates)}
                        className="text-xs bg-blue-100 px-3 py-1 rounded-full text-blue-700 hover:bg-blue-200"
                    >
                        {hasCoordinates ? 'Ocultar' : 'Agregar'}
                    </button>
                </div>

                {hasCoordinates && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-blue-700">Latitud</label>
                            <input
                                type="number"
                                step="any"
                                name="latitude"
                                placeholder="-13.1631"
                                className="w-full p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-blue-700">Longitud</label>
                            <input
                                type="number"
                                step="any"
                                name="longitude"
                                placeholder="-74.2236"
                                className="w-full p-2 border rounded-md text-sm"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* URL del Poster */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">URL del Poster / Imagen</label>
                <input
                    name="poster_url"
                    placeholder="https://ejemplo.com/poster.jpg"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    name="description"
                    rows={3}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Describe el evento..."
                />
            </div>

            {/* NUEVO: Enlace Externo */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-purple-900 flex items-center gap-2">
                        <LinkIcon size={16} />
                        Enlace Externo
                    </label>
                    <button
                        type="button"
                        onClick={() => setHasExternalLink(!hasExternalLink)}
                        className="text-xs bg-purple-100 px-3 py-1 rounded-full text-purple-700 hover:bg-purple-200"
                    >
                        {hasExternalLink ? 'Ocultar' : 'Agregar'}
                    </button>
                </div>

                {hasExternalLink && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-purple-700 flex items-center gap-1 mb-1">
                                <LinkIcon size={12} />
                                URL del Enlace
                            </label>
                            <input
                                type="url"
                                name="external_link"
                                placeholder="https://eventbrite.com/mi-evento"
                                className="w-full p-2 border rounded-md text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-purple-700 flex items-center gap-1 mb-1">
                                <MessageSquare size={12} />
                                Texto del Botón
                            </label>
                            <input
                                name="action_text"
                                placeholder="Ej: Comprar Entradas, Más Información"
                                className="w-full p-2 border rounded-md text-sm"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Switch de Patrocinado */}
            <div className="flex items-center gap-3 p-3 border border-indigo-100 bg-indigo-50 rounded-lg">
                <input
                    type="checkbox"
                    name="is_featured"
                    id="featured"
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <div>
                    <label htmlFor="featured" className="font-bold text-gray-800 cursor-pointer">
                        Evento Patrocinado / Destacado
                    </label>
                    <p className="text-xs text-gray-500">Aparecerá primero en el carrusel del app.</p>
                </div>
            </div>

            {/* Mensajes de error */}
            {state?.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{state.error}</p>
                </div>
            )}

            {/* Mensaje de éxito */}
            {state?.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm font-semibold">✓ Evento publicado exitosamente</p>
                </div>
            )}

            {/* Botón de envío */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-slate-900 text-white py-3 rounded-md hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
                {isPending ? 'Publicando...' : ' Publicar Evento'}
            </button>
        </form>
    )
}