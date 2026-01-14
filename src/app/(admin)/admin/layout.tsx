'use client' // Lo pasamos a Client Component para manejar estilos activos fácilmente

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Building2, Calendar, LogOut } from 'lucide-react'
import { SignOutButton } from '@/src/components/ui/sign-out-button'
import clsx from 'clsx'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Empresas', href: '/admin/businesses', icon: Building2 },
        { name: 'Eventos', href: '/admin/events', icon: Calendar },
    ]

    return (
        <div className="flex h-screen bg-slate-50"> {/* Fondo general gris muy suave */}

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl z-10">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                        Qhoar Admin
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => {
                        // Verificamos si la ruta actual empieza con la del item (para subpáginas)
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-lg p-1">
                        <SignOutButton/>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}