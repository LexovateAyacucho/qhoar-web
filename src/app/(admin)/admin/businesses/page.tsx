// app/(admin)/admin/businesses/page.tsx
import { createClient } from '@/src/utils/supabase/server'
import { ApproveButton } from '@/src/components/admin/approve-button'
import Link from 'next/link'
import { BadgeCheck, Eye, Phone, MapPin, User, IdCard } from 'lucide-react'

export default async function AdminBusinessesPage() {
    const supabase = await createClient()

    // Ahora incluimos los datos del profile (dueño)
    const { data: businesses } = await supabase
        .from('businesses')
        .select(`
            *,
            owner:profiles!businesses_owner_id_fkey (
                full_name,
                phone,
                dni,
                job_title
            )
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Empresas</h2>
                    <p className="text-slate-500 mt-1">Gestiona las solicitudes y el directorio.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-600 border border-slate-200">
                    Total: {businesses?.length || 0}
                </div>
            </div>

            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Empresa</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Dueño / Contacto</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Detalles</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                    {businesses?.map((business) => (
                        <tr key={business.id} className="hover:bg-slate-50 transition-colors">
                            {/* COLUMNA 1: EMPRESA */}
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                        {business.name.substring(0,2).toUpperCase()}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-bold text-slate-900">{business.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">RUC: {business.ruc || 'N/A'}</div>
                                    </div>
                                </div>
                            </td>

                            {/* COLUMNA 2: DUEÑO/CONTACTO */}
                            <td className="px-6 py-4">
                                {business.owner ? (
                                    <div className="space-y-1">
                                        <div className="flex items-center text-sm font-semibold text-slate-800">
                                            <User size={14} className="mr-1.5 text-indigo-500" />
                                            {business.owner.full_name || 'Sin nombre'}
                                        </div>
                                        {business.owner.dni && (
                                            <div className="flex items-center text-xs text-slate-600">
                                                <IdCard size={12} className="mr-1.5" />
                                                DNI: {business.owner.dni}
                                            </div>
                                        )}
                                        {business.owner.phone && (
                                            <div className="flex items-center text-xs text-slate-600">
                                                <Phone size={12} className="mr-1.5" />
                                                {business.owner.phone}
                                            </div>
                                        )}
                                        {business.owner.job_title && (
                                            <div className="text-xs text-slate-500 italic">
                                                {business.owner.job_title}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">Sin perfil asociado</span>
                                )}
                            </td>

                            {/* COLUMNA 3: DETALLES EMPRESA */}
                            <td className="px-6 py-4">
                                <div className="flex flex-col space-y-1">
                                    <div className="flex items-center text-xs text-slate-600">
                                        <Phone size={12} className="mr-1.5" />
                                        {business.phone}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 truncate max-w-[200px]">
                                        <MapPin size={12} className="mr-1.5" />
                                        {business.address}
                                    </div>
                                </div>
                            </td>

                            {/* COLUMNA 4: ESTADO */}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                        business.status === 'active'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : business.status === 'pending'
                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                        {business.status === 'active' ? 'Activo' :
                                            business.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                                    </span>
                                    {business.is_premium && (
                                        <span className="flex items-center px-2 py-0.5 text-xs font-bold rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                                            <BadgeCheck size={12} className="mr-1" /> Premium
                                        </span>
                                    )}
                                </div>
                            </td>

                            {/* COLUMNA 5: ACCIONES */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end items-center gap-3">
                                    {business.status === 'pending' && (
                                        <ApproveButton businessId={business.id} />
                                    )}
                                    <Link
                                        href={`/admin/businesses/${business.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        <Eye size={16} />
                                        <span className="text-xs font-bold">Gestionar</span>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}