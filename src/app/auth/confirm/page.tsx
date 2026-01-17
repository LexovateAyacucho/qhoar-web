'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import Link from 'next/link';

export default function ConfirmPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando tu cuenta...');
    const supabase = createClient();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            // 1. Buscamos el código en la URL (?code=...)
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('code');
            const error = searchParams.get('error_description');

            if (error) {
                setStatus('error');
                setMessage(error);
                return;
            }

            if (code) {
                // 2. Intercambiamos el código por una sesión válida
                const { error: verifyError } = await supabase.auth.exchangeCodeForSession(code);

                if (verifyError) {
                    setStatus('error');
                    setMessage(verifyError.message);
                } else {
                    setStatus('success');
                }
            } else {
                // Si no hay código, quizás ya llegó verificado o entró directo
                setStatus('error');
                setMessage('Enlace inválido o expirado.');
            }
        };

        handleEmailConfirmation();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">

                {/* LOGO (Opcional, usa tu imagen si tienes) */}
                <div className="mb-6 flex justify-center">
                    <span className="text-4xl">🐱</span> {/* Reemplaza con <Image /> de tu logo Qhoar */}
                </div>

                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-800">Verificando...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-orange-500 text-6xl mb-4">✨</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cuenta Verificada!</h2>
                        <p className="text-gray-600 mb-8">
                            Tu correo ha sido confirmado correctamente. Ya puedes regresar a la aplicación e iniciar sesión.
                        </p>
                        {/* Este botón intenta abrir la app si están en celular (Deep Linking opcional) */}
                        <p className="text-sm text-gray-400">Ya puedes cerrar esta ventana.</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Algo salió mal</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link href="/" className="text-orange-600 font-semibold hover:underline">
                            Volver al inicio
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}