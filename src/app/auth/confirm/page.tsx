'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { createClient } from '@/src/utils/supabase/client'; // Verifica tu ruta de importación
import { useSearchParams } from 'next/navigation';

function ConfirmContent() {
    const [status, setStatus] = useState<'loading' | 'success' | 'ambiguous_error' | 'fatal_error'>('loading');
    const [message, setMessage] = useState('Procesando verificación...');

    const supabase = createClient();
    const searchParams = useSearchParams();

    const processingRef = useRef(false);

    useEffect(() => {
        const handleEmailConfirmation = async () => {
            if (processingRef.current) return;

            const code = searchParams.get('code');
            const errorDescription = searchParams.get('error_description');

            if (errorDescription) {
                setStatus('fatal_error');
                setMessage(errorDescription);
                return;
            }

            if (!code) {
                setStatus('fatal_error');
                setMessage('No se encontró el código de verificación.');
                return;
            }

            processingRef.current = true;

            try {
                // 2. INTENTAR CANJEAR EL CÓDIGO
                const { error } = await supabase.auth.exchangeCodeForSession(code);

                if (!error) {
                    setStatus('success');
                } else {
                    console.log("Error al canjear:", error.message);

                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user?.email_confirmed_at) {
                        setStatus('success');
                    } else {
                        setStatus('ambiguous_error');
                    }
                }
            } catch (err) {
                setStatus('ambiguous_error');
            }
        };

        handleEmailConfirmation();
    }, [searchParams, supabase.auth]);

    // Lógica para reenviar (igual que antes)
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
        else alert('Correo reenviado.');
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
                        <h2 className="text-xl font-bold text-gray-900">Validando enlace...</h2>
                    </>
                )}

                {/* CASO 1: ÉXITO TOTAL */}
                {status === 'success' && (
                    <div className="animate-fade-in-up">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl text-green-600">✓</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Todo listo!</h2>
                        <p className="text-gray-600 mb-8">Cuenta verificada correctamente.</p>
                        <BotonAbrirApp />
                    </div>
                )}

                {status === 'ambiguous_error' && (
                    <div className="animate-fade-in-up">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🤔</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Enlace ya procesado</h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            Parece que este enlace ya fue utilizado (posiblemente por tu seguridad de correo).
                            <br/><br/>
                            <b>Lo más probable es que tu cuenta YA esté activa.</b>
                        </p>

                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
                            <p className="font-bold text-orange-800 text-sm mb-2">👉 Intenta esto primero:</p>
                            <a
                                href="qhoar://home"
                                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
                            >
                                Abrir App e Iniciar Sesión
                            </a>
                        </div>

                        <p className="text-xs text-gray-400">¿Sigues sin poder entrar? Solicita otro enlace abajo.</p>
                        <FormularioReenvio email={inputEmail} setEmail={setInputEmail} onResend={handleResend} loading={resending} />
                    </div>
                )}

                {status === 'fatal_error' && (
                    <div>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Error de enlace</h2>
                        <p className="text-gray-600 mb-6 text-sm">{message}</p>
                        <FormularioReenvio email={inputEmail} setEmail={setInputEmail} onResend={handleResend} loading={resending} />
                    </div>
                )}

            </div>
        </div>
    );
}

function BotonAbrirApp() {
    return (
        <a href="qhoar://home" className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-200">
            Ir a Qhoar App
        </a>
    );
}

function FormularioReenvio({ email, setEmail, onResend, loading }: any) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl text-left mt-4 border border-gray-100">
            <label className="text-xs font-bold text-gray-500 uppercase">Solicitar nuevo enlace</label>
            <input
                type="email"
                placeholder="Tu correo..."
                className="w-full mt-2 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                onClick={onResend}
                disabled={loading || !email}
                className="w-full mt-3 bg-gray-900 text-white font-bold py-3 rounded-lg disabled:opacity-50"
            >
                {loading ? 'Enviando...' : 'Reenviar'}
            </button>
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