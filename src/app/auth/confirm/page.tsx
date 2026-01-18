'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmContent() {
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const [status, setStatus] = useState<string>('loading');
    const [errorMessage, setErrorMessage] = useState('');
    const [inputEmail, setInputEmail] = useState(emailFromUrl);
    const [resending, setResending] = useState(false);
    const supabase = createClient();
    const processingRef = useRef(false);

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            if (processingRef.current) return;

            const code = searchParams.get('code');
            const errorDescription = searchParams.get('error_description');

            if (errorDescription) {
                setStatus('error');
                setErrorMessage(errorDescription);
                return;
            }

            if (!code) {
                setStatus('error');
                setErrorMessage('Enlace no válido o incompleto.');
                return;
            }

            processingRef.current = true;

            try {
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (!error) {
                    setStatus('success');
                } else {

                    const isTokenUsed =
                        error.message?.includes('invalid') ||
                        error.message?.includes('expired') ||
                        error.message?.includes('already been used') ||
                        error.status === 403;

                    if (isTokenUsed) {
                        const { data: { user } } = await supabase.auth.getUser();

                        if (user && user.email_confirmed_at) {

                            setStatus('success');
                        } else {

                            setStatus('already_verified');
                        }
                    } else {
                        // Otro tipo de error
                        setStatus('error');
                        setErrorMessage(error.message || 'Error al verificar el enlace');
                    }
                }
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Error inesperado de red.';
                setStatus('error');
                setErrorMessage(errorMsg);
            }
        };

        handleEmailConfirmation();
    }, [searchParams, supabase]);

    const handleResend = async () => {
        if (!inputEmail) return;
        setResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: inputEmail,
            options: {
                emailRedirectTo: `https://qhoar-web.vercel.app/auth/confirm?email=${encodeURIComponent(inputEmail)}`
            }
        });
        setResending(false);
        if (error) alert(error.message);
        else alert('¡Listo! Revisa tu correo (y spam) para el nuevo enlace.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                <div className="mb-6 flex justify-center">
                    <span className="text-6xl">🐱</span>
                </div>

                {status === 'loading' && (
                    <div className="py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold text-gray-800">Verificando enlace...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in-up py-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cuenta Confirmada!</h2>
                        <p className="text-gray-600 mb-8">Tu correo ha sido verificado exitosamente. Ya puedes iniciar sesión.</p>
                        <a
                            href="qhoar://home"
                            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all mb-4"
                        >
                            Abrir la App
                        </a>
                        <Link href="/" className="text-sm text-gray-500 underline">
                            Volver al inicio
                        </Link>
                    </div>
                )}

                {status === 'already_verified' && (
                    <div className="animate-fade-in-up py-4">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">🔐</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enlace ya usado</h2>
                        <p className="text-gray-600 mb-6 text-sm px-2">
                            Este enlace de verificación ya fue procesado. <b>Tu cuenta probablemente ya está activa.</b>
                        </p>
                        <div className="space-y-3">
                            <a
                                href="qhoar://home"
                                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-200"
                            >
                                Intentar Iniciar Sesión
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
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        {resending ? '...' : 'Reenviar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace expirado</h2>
                        <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>
                        <div className="bg-gray-50 p-4 rounded-xl text-left">
                            <label className="text-xs font-bold text-gray-400">SOLICITAR NUEVO ENLACE</label>
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="email"
                                    value={inputEmail}
                                    onChange={(e) => setInputEmail(e.target.value)}
                                    placeholder="tu@correo.com"
                                    className="flex-1 p-3 border rounded-lg"
                                />
                                <button
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="bg-gray-900 text-white px-4 rounded-lg font-bold disabled:opacity-50"
                                >
                                    {resending ? '...' : 'Enviar'}
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
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
            </div>
        }>
            <ConfirmContent />
        </Suspense>
    );
}