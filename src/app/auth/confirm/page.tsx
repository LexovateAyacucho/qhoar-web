'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { useSearchParams } from 'next/navigation';

function ConfirmContent() {
    // Solo usamos loading, success o error. Nada de "ambiguos".
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando...');

    const supabase = createClient();
    const searchParams = useSearchParams();
    const processingRef = useRef(false);

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            if (processingRef.current) return;

            const code = searchParams.get('code');
            const errorDescription = searchParams.get('error_description');

            if (errorDescription) {
                setStatus('error');
                setMessage('Error en la verificación: ' + errorDescription);
                return;
            }

            if (!code) {
                setStatus('error');
                setMessage('Enlace no válido.');
                return;
            }

            processingRef.current = true;

            try {
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (!error) {
                    setStatus('success');
                } else {
                    const { data: { user } } = await supabase.auth.getUser();

                    if (user?.email_confirmed_at) {
                        setStatus('success');
                    } else {
                        setStatus('error');
                        setMessage('El enlace ha expirado o ya fue utilizado.');
                    }
                }
            } catch (err) {
                setStatus('error');
                setMessage('Ocurrió un error inesperado.');
            }
        };

        handleEmailConfirmation();
    }, [searchParams, supabase.auth]);

    // Lógica de reenvío
    const [inputEmail, setInputEmail] = useState('');
    const [resending, setResending] = useState(false);
    const handleResend = async () => {
        if (!inputEmail) return;
        setResending(true);
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: inputEmail,
            options: { emailRedirectTo: 'https://qhoar-web.vercel.app/auth/confirm' }
        });
        setResending(false);
        if (error) alert(error.message);
        else alert('Correo enviado. Revisa tu bandeja de entrada y spam.');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">

                <div className="mb-6 flex justify-center">
                    {/* Logo simple o Emoji */}
                    <span className="text-6xl">🐱</span>
                </div>

                {status === 'loading' && (
                    <div className="py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold text-gray-800">Verificando cuenta...</h2>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in-up py-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cuenta Verificada!</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            Todo listo. Ya puedes disfrutar de Qhoar.
                        </p>

                        <a
                            href="qhoar://home"
                            className="block w-full bg-gray-900 hover:bg-black text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-transform transform active:scale-95"
                        >
                            Abrir la App
                        </a>
                        <p className="text-sm text-gray-400 mt-6">Si la app no se abre, ábrela manualmente en tu celular.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-4">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enlace expirado</h2>
                        <p className="text-gray-500 mb-8">{message}</p>

                        <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Solicitar nuevo enlace</label>
                            <div className="flex flex-col gap-3 mt-2">
                                <input
                                    type="email"
                                    placeholder="nombre@empresa.com"
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                    value={inputEmail}
                                    onChange={(e) => setInputEmail(e.target.value)}
                                />
                                <button
                                    onClick={handleResend}
                                    disabled={resending || !inputEmail}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 transition-colors shadow-md shadow-orange-200"
                                >
                                    {resending ? 'Enviando...' : 'Reenviar Correo'}
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
        <Suspense fallback={<div className="p-10 text-center">Cargando verificación...</div>}>
            <ConfirmContent />
        </Suspense>
    );
}