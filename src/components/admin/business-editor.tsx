// components/admin/business-editor.tsx
'use client'

import { useState } from 'react'
import { Business } from '@/src/types/qhoar'
import { updateBusiness } from '@/src/app/(admin)/admin/actions'
import { GalleryManager } from '@/src/components/preview/gallery-manager'
import { Save, ChevronLeft, Building, BadgeCheck, User, Phone, Mail, IdCard, Briefcase } from 'lucide-react'
import Link from 'next/link'

type BusinessWithProfile = Business & {
    owner?: {
        full_name: string | null
        phone: string | null
        dni: string | null
        job_title: string | null
        avatar_url: string | null
    } | null
}

export function BusinessEditor({ business }: { business: BusinessWithProfile }) {
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)

        const res = await updateBusiness(business.id, formData)
        setLoading(false)
        if (res?.error) alert('Error: ' + res.error)
        else alert('Empresa actualizada correctamente')
    }

    return (
        <div className="space-y-6">
            {/* Header de la página de detalle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/businesses" className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                        <ChevronLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{business.name}</h1>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            ID: <span className="font-mono text-xs">{business.id}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full ${
                        business.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                        {business.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: Formulario de Datos (2/3 ancho) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* NUEVA SECCIÓN: INFO DEL DUEÑO */}
                    {business.owner && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border-2 border-indigo-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-full">
                                    <User className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="text-lg font-bold text-indigo-900">
                                    Información del Propietario
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                    <div className="flex items-center gap-2 text-xs text-indigo-600 mb-1">
                                        <User size={14} />
                                        <span className="font-semibold">Nombre Completo</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">
                                        {business.owner.full_name || 'No registrado'}
                                    </p>
                                </div>

                                {business.owner.dni && (
                                    <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                        <div className="flex items-center gap-2 text-xs text-indigo-600 mb-1">
                                            <IdCard size={14} />
                                            <span className="font-semibold">DNI</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{business.owner.dni}</p>
                                    </div>
                                )}

                                {business.owner.phone && (
                                    <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                        <div className="flex items-center gap-2 text-xs text-indigo-600 mb-1">
                                            <Phone size={14} />
                                            <span className="font-semibold">Teléfono Personal</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{business.owner.phone}</p>
                                    </div>
                                )}

                                {business.owner.job_title && (
                                    <div className="bg-white p-3 rounded-lg border border-indigo-100">
                                        <div className="flex items-center gap-2 text-xs text-indigo-600 mb-1">
                                            <Briefcase size={14} />
                                            <span className="font-semibold">Cargo</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">{business.owner.job_title}</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                    {/* FORMULARIO DE LA EMPRESA */}
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Building size={20} className="text-indigo-600" />
                                Información General
                            </h3>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                <Save size={18} />
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial</label>
                                <input name="name" defaultValue={business.name} className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>

                            {/* Descripción */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                                <textarea name="description" rows={4} defaultValue={business.description} className="w-full rounded-lg border-slate-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>

                            {/* RUC & Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">RUC</label>
                                <input name="ruc" defaultValue={business.ruc || ''} className="w-full rounded-lg border-slate-300 border p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono Empresa</label>
                                <input name="phone" defaultValue={business.phone} className="w-full rounded-lg border-slate-300 border p-2" />
                            </div>

                            {/* Dirección */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección Física</label>
                                <input name="address" defaultValue={business.address} className="w-full rounded-lg border-slate-300 border p-2" />
                            </div>

                            <div className="border-t border-slate-100 col-span-2 my-2"></div>

                            {/* Estado y Premium */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estado de la Empresa</label>
                                <select name="status" defaultValue={business.status} className="w-full rounded-lg border-slate-300 border p-2 bg-slate-50">
                                    <option value="pending">Pendiente (Revisión)</option>
                                    <option value="active">Activa (Pública)</option>
                                    <option value="inactive">Inactiva (Oculta)</option>
                                </select>
                            </div>

                            <div className="flex items-center p-4 border border-indigo-100 bg-indigo-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    name="is_premium"
                                    defaultChecked={business.is_premium}
                                    id="premium_check"
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="premium_check" className="ml-3 block text-sm font-bold text-indigo-900 flex items-center gap-2">
                                    <BadgeCheck size={18} />
                                    Habilitar Funciones Premium
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* COLUMNA DERECHA: Galería y Otros (1/3 ancho) */}
                <div className="space-y-6">

                    {/* Componente de Galería */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-800">Galería de Imágenes</h3>
                            <p className="text-xs text-slate-500">Gestiona las fotos que aparecen en el perfil.</p>
                        </div>
                        <GalleryManager
                            businessId={business.id}
                            onGalleryUpdate={() => {
                                console.log('Galería actualizada')
                            }}
                        />
                    </div>

                    {/* Metadata Read-only */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Metadata</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Creado el:</span>
                                <span className="font-medium text-slate-700">{new Date(business.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Owner ID:</span>
                                <span className="font-mono text-xs text-slate-700 truncate w-24" title={business.owner_id}>{business.owner_id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}