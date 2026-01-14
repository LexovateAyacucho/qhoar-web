import Link from 'next/link'
import { LayoutDashboard, Palette, Store, User } from 'lucide-react'
import { SignOutButton } from '@/src/components/ui/sign-out-button'
// Asegúrate de importar bien el botón que acabamos de crear

export default function PortalLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-gray-50">
            {/* Sidebar Fijo */}
            <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
                <div className="flex h-16 items-center border-b border-gray-200 px-6">
                    <span className="text-xl font-bold text-orange-500">Qhoar Portal</span>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    <Link
                        href="/portal/profile"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                    >
                        <User size={20} />
                        Mi Perfil
                    </Link>

                    {/* Opcional: Enlace para ver cómo queda (podríamos llevarlo al preview luego) */}
                    <div className="mt-8 px-3 text-xs font-semibold uppercase text-gray-400">
                        Vista Previa
                    </div>
                </nav>

                <div className="border-t border-gray-200 p-3">
                    <SignOutButton />
                </div>
            </aside>

            {/* Contenido Principal (Aquí se renderizarán las pages) */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}