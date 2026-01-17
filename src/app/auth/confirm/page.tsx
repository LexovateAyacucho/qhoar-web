'use client';

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

function ConfirmContent() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando seguridad...');
    const [emailForResend, setEmailForResend] = useState<string | null>(null);
    const supabase = createClient();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            const code = searchParams.get('code');
            const errorDescription = searchParams.get('error_description');
            if (errorDescription) {
                setStatus('error');
                setMessage(errorDescription);
                return;
            }

            if (!code) {
                setStatus('error');
                setMessage('El enlace no es válido.');
                return;
            }
            const { error: verifyError } = await supabase.auth.exchangeCodeForSession(code);

            if (!verifyError) {
                setStatus('success');
            } else {

                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email_confirmed_at) {
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage('El enlace ha expirado o ya fue utilizado anteriormente.');
                }
            }
        };

        handleEmailConfirmation();
    }, [searchParams, supabase.auth]);

    const [inputEmail, setInputEmail] = useState('');
    const [resending, setResending] = useState(false);

    const handleResend = async () => {
        if (!inputEmail) return;
        setResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: inputEmail,
            options: {
                emailRedirectTo: 'https://qhoar-web.vercel.app/auth/confirm'
            }
        });
        setResending(false);
        if (error) alert(error.message);
        else alert('Correo reenviado. Revisa tu bandeja.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">

                <div className="mb-6 flex justify-center">
                    <span className="text-5xl">🐱</span>
                </div>

                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-900">Verificando...</h2>
                        <p className="text-gray-500 mt-2">Estamos validando tu enlace.</p>
                    </>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta Verificada!</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Gracias por confirmar tu correo. Tu cuenta en <b>Qhoar</b> está activa y segura.
                        </p>

                        <a
                            href="qhoar://home" // Deep Link para intentar abrir la app
                            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-200"
                        >
                            Abrir App Qhoar
                        </a>
                        <p className="text-xs text-gray-400 mt-4">Si no abre automáticamente, abre la app en tu celular.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace expirado</h2>
                        <p className="text-gray-600 mb-6 text-sm">{message}</p>

                        <div className="bg-gray-50 p-4 rounded-xl text-left">
                            <label className="text-xs font-bold text-gray-500 uppercase">Solicitar nuevo enlace</label>
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="w-full mt-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                                value={inputEmail}
                                onChange={(e) => setInputEmail(e.target.value)}
                            />
                            <button
                                onClick={handleResend}
                                disabled={resending || !inputEmail}
                                className="w-full mt-3 bg-gray-900 text-white font-bold py-3 rounded-lg disabled:opacity-50"
                            >
                                {resending ? 'Enviando...' : 'Reenviar Correo'}
                            </button>
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