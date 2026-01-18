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
    const [needsManualConfirm, setNeedsManualConfirm] = useState(false);
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
                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
                if (!exchangeError) {
                    setStatus('success');
                    return;
                }
                console.log('Error de exchange:', exchangeError);
                const msg = exchangeError.message?.toLowerCase() || '';
                const isTokenIssue =
                    msg.includes('invalid') ||
                    msg.includes('expired') ||
                    msg.includes('consumed') ||
                    msg.includes('already used') ||
                    exchangeError.code === 'otp_expired' ||
                    exchangeError.status === 401 ||
                    exchangeError.status === 403;

                if (isTokenIssue) {
                    console.log('Token inválido/usado. Asumiendo intercepción de bot o doble click.');
                    setStatus('already_verified');
                    setNeedsManualConfirm(true);
                } else {
                    setStatus('error');
                    setErrorMessage(exchangeError.message || 'Error desconocido');
                }

            } catch (err) {
                console.error('Error general:', err);
                const errorMsg = err instanceof Error ? err.message : 'Error inesperado de red.';
                setStatus('error');
                setErrorMessage(errorMsg);
            }
        };

        handleEmailConfirmation();
    }, [searchParams, supabase]);

    const handleResend = async () => {
        if (!inputEmail) {
            alert('Por favor ingresa tu correo electrónico');
            return;
        }

        setResending(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: inputEmail,
                options: {
                    emailRedirectTo: `https://qhoar-web.vercel.app/auth/confirm?email=${encodeURIComponent(inputEmail)}`
                }
            });

            if (error) {
                if (error.message?.includes('already confirmed')) {
                    alert('✓ Tu cuenta ya fue verificada. Intenta iniciar sesión en la app.');
                } else {
                    throw error;
                }
            } else {
                alert('✓ Nuevo enlace enviado. Revisa tu correo (incluyendo spam).');
            }
        } catch (e) {
            const errorMsg = e instanceof Error ? e.message : 'Error al reenviar';
            alert(`Error: ${errorMsg}`);
        } finally {
            setResending(false);
        }
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
                        <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in-up py-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cuenta Confirmada! ✓</h2>
                        <p className="text-gray-600 mb-8">
                            Tu correo <strong>{inputEmail || 'ha sido'}</strong> verificado exitosamente.
                            <br />Ya puedes iniciar sesión en la app.
                        </p>
                        <a
                            href="qhoar://home"
                            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all mb-4"
                        >
                            📱 Abrir Qhoar App
                        </a>
                        <Link href="/" className="text-sm text-gray-500 underline">
                            Volver al inicio
                        </Link>
                    </div>
                )}

                {status === 'already_verified' && (
                    <div className="animate-fade-in-up py-4">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Enlace ya procesado</h2>

                        {needsManualConfirm ? (
                            <div className="space-y-4">
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                                    <p className="text-sm text-amber-900 leading-relaxed">
                                        <strong>¿Qué pasó?</strong><br />
                                        Tu enlace de verificación fue procesado automáticamente por medidas de seguridad de tu proveedor de email.
                                    </p>
                                </div>

                                <p className="text-gray-600 text-sm">
                                    <strong>Sigue estos pasos:</strong>
                                </p>

                                <div className="bg-gray-50 rounded-lg p-4 text-left space-y-3">
                                    <div className="flex gap-3">
                                        <span className="text-lg">1️⃣</span>
                                        <p className="text-sm text-gray-700">
                                            Abre la app Qhoar e intenta <strong>iniciar sesión</strong> con tu correo y contraseña
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <span className="text-lg">2️⃣</span>
                                        <p className="text-sm text-gray-700">
                                            Si no te deja entrar, solicita un <strong>nuevo enlace</strong> abajo
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href="qhoar://home"
                                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md"
                                >
                                    📱 Abrir App e Intentar Login
                                </a>

                                <div className="pt-6 border-t border-gray-100">
                                    <p className="text-xs text-gray-400 mb-3 font-medium">¿SIGUE SIN FUNCIONAR?</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            value={inputEmail}
                                            onChange={(e) => setInputEmail(e.target.value)}
                                            placeholder="tu@correo.com"
                                            className="flex-1 p-3 border border-gray-200 rounded-lg text-sm"
                                        />
                                        <button
                                            onClick={handleResend}
                                            disabled={resending}
                                            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {resending ? '⏳' : '📧 Reenviar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 mb-6 text-sm px-2">
                                Tu cuenta probablemente ya está activa. Intenta iniciar sesión en la app.
                            </p>
                        )}
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">❌</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Verificación</h2>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                            <p className="text-red-700 text-sm font-mono">{errorMessage}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl text-left">
                            <label className="text-xs font-bold text-gray-400 mb-2 block">SOLICITAR NUEVO ENLACE</label>
                            <div className="flex gap-2">
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
                                    {resending ? '⏳' : 'Enviar'}
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
            </div>
        }>
            <ConfirmContent />
        </Suspense>
    );
}