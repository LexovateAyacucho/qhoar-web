'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

function ConfirmContent() {
    // Estados: loading | success | already_verified | error
    const [status, setStatus] = useState<string>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    // Capturamos el email si viene en la URL (gracias al cambio en el App)
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const [inputEmail, setInputEmail] = useState(emailFromUrl);
    const [resending, setResending] = useState(false);

    const supabase = createClient();
    const processingRef = useRef(false);

    useEffect(() => {
        // Actualizar el input si llega tarde el param
        if (emailFromUrl) setInputEmail(emailFromUrl);

        const handleEmailConfirmation = async () => {
            if (processingRef.current) return;

            const code = searchParams.get('code');
            const errorDescription = searchParams.get('error_description');

            // 1. Error explícito desde Supabase (ej: usuario baneado)
            if (errorDescription) {
                setStatus('error');
                setErrorMessage(errorDescription);
                return;
            }

            // 2. Sin código
            if (!code) {
                setStatus('error');
                setErrorMessage('Enlace no válido o incompleto.');
                return;
            }

            processingRef.current = true;

            try {
                // 3. Intentamos canjear
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (!error) {
                    // ÉXITO PURO: El usuario hizo click primero
                    setStatus('success');
                } else {
                    // 4. EL TOKEN FALLÓ (Lo más probable es que sea el caso del bot)
                    console.log("Token inválido o usado:", error.message);

                    // NO intentamos getUser() porque fallará.
                    // Asumimos el estado "Yellow" (Posiblemente ya verificado)
                    setStatus('already_verified');
                }
            } catch (err) {
                setStatus('error');
                setErrorMessage('Error inesperado de red.');
            }
        };

        handleEmailConfirmation();
    }, [searchParams, emailFromUrl]); // Eliminamos supabase.auth de deps para evitar loops

    const handleResend = async () => {
        if (!inputEmail) return;
        setResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: inputEmail,
            options: { emailRedirectTo: `https://qhoar-web.vercel.app/auth/confirm?email=${encodeURIComponent(inputEmail)}` }
        });
        setResending(false);
        if (error) alert(error.message);
        else alert('¡Listo! Revisa tu correo (y spam) para el nuevo enlace.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">

                {/* LOGO */}
                <div className="mb-6 flex justify-center">
                    <span className="text-6xl">🐱</span>
                </div>

                {/* --- ESTADO CARGANDO --- */}
                {status === 'loading' && (
                    <div className="py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold text-gray-800">Verificando enlace...</h2>
                    </div>
                )}

                {/* --- ESTADO ÉXITO (Verde) --- */}
                {status === 'success' && (
                    <div className="animate-fade-in-up py-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cuenta Confirmada!</h2>
                        <p className="text-gray-600 mb-8">Bienvenido a Qhoar.</p>
                        <a href="qhoar://home" className="block w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all">
                            Abrir la App
                        </a>
                    </div>
                )}

                {/* --- ESTADO "YA VERIFICADO / TOKEN USADO" (Amarillo) --- */}
                {/* Este es el que saldrá cuando el bot se coma el link. UX arreglada. */}
                {status === 'already_verified' && (
                    <div className="animate-fade-in-up py-4">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🧐</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enlace procesado</h2>
                        <p className="text-gray-600 mb-6 text-sm px-2">
                            Este enlace ya fue validado automáticamente por tu seguridad. <b>Tu cuenta probablemente ya está activa.</b>
                        </p>

                        <div className="space-y-3">
                            <a href="qhoar://home" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-200">
                                Ir a la App e Iniciar Sesión
                            </a>

                            <div className="pt-6 border-t border-gray-100 mt-6">
                                <p className="text-xs text-gray-400 mb-3">¿Sigues sin poder entrar? Solicita un nuevo enlace:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        value={inputEmail}
                                        onChange={(e) => setInputEmail(e.target.value)}
                                        placeholder="Tu correo..."
                                        className="flex-1 p-2 border border-gray-200 rounded-lg text-sm"
                                    />
                                    <button
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-300"
                                    >
                                        Reenviar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ESTADO ERROR FATAL (Rojo) --- */}
                {status === 'error' && (
                    <div className="py-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace expirado</h2>
                        <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>

                        <div className="bg-gray-50 p-4 rounded-xl text-left">
                            <label className="text-xs font-bold text-gray-400">SOLICITAR NUEVO</label>
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="email"
                                    value={inputEmail}
                                    onChange={(e) => setInputEmail(e.target.value)}
                                    className="flex-1 p-3 border rounded-lg"
                                />
                                <button
                                    onClick={handleResend}
                                    className="bg-gray-900 text-white px-4 rounded-lg font-bold"
                                >
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default function ConfirmPage() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ConfirmContent />
        </Suspense>
    );
}