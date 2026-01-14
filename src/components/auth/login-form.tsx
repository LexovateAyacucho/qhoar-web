'use client'

import { useActionState } from 'react'
import { login } from '@/src/app/(auth)/login/actions'
import { User, Lock, ArrowRight } from 'lucide-react'

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(login, undefined)

    return (
        <form action={formAction} className="mt-8 space-y-6">
            <div className="space-y-5">

                {/* Input Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-stone-50 focus:bg-white sm:text-sm"
                            placeholder="tu@empresa.com"
                        />
                    </div>
                </div>

                {/* Input Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1.5">
                        Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="block w-full pl-10 pr-3 py-3 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-stone-50 focus:bg-white sm:text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex justify-end mt-1">
                        <a href="#" className="text-xs font-medium text-orange-500-600 hover:text-orange-500 transition-colors">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>
                </div>
            </div>

            {/* Mensaje de Error */}
            {state?.error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                    <div className="flex-shrink-0 w-1 h-full bg-red-500 rounded-full" />
                    <p className="text-sm text-red-600 font-medium">{state.error}</p>
                </div>
            )}

            {/* Botón de Submit */}
            <button
                type="submit"
                disabled={isPending}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando...
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        Ingresar al Portal
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                )}
            </button>
        </form>
    )
}