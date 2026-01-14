import type { Metadata } from "next";
import { LoginForm } from "@/src/components/auth/login-form";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Qhoar | Acceso Empresas",
    description: "Gestión de presencia digital para empresas en Ayacucho",
};

export default function LoginPage() {
    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-200 px-4 sm:px-6 lg:px-8">

            {/* Tarjeta principal */}
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-stone-100">

                {/* Encabezado: Logo y Título */}
                <div className="flex flex-col items-center text-center">

                    {/* Placeholder del Logo: Un icono minimalista si no hay imagen aún */}
                    <div className="mb-6 relative h-20 w-auto">
                        <Image
                            src="/logoQhoar.png"
                            alt="Logo Qhoar"
                            width={450}
                            height={450}
                            className="h-20 w-auto object-contain"
                            priority
                        />
                    </div>

                    <h2 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
                        Bienvenido a Qhoar
                    </h2>
                    <p className="mt-2 text-sm text-stone-500 font-medium">
                        Gestión empresarial
                    </p>
                </div>

                {/* Formulario (Client Component) */}
                <LoginForm />

                <div className="mt-6 text-center">
                    <p className="text-xs text-stone-400">
                        © {new Date().getFullYear()} Qhoar. Ayacucho.
                    </p>
                </div>
            </div>
        </div>
    );
}