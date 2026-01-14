'use client'

import React, {useEffect, useState} from 'react';
import { createClient } from '@/src/utils/supabase/client';
import {DesignConfig, Business, BusinessImage} from '@/src/types/qhoar';
import { MobileFrame } from '@/src/components/preview/mobile-frame';
import StandardLayoutWeb from '@/src/components/preview/layouts/standard-layout-web';
import { VisualLayoutWeb } from '@/src/components/preview/layouts/visual-layout-web';
import { ModernLayoutWeb } from '@/src/components/preview/layouts/modern-layout-web';
import { ImageUploader } from '@/src/components/preview/image-uploader';
import { GalleryManager } from '@/src/components/preview/gallery-manager';
import { Loader2, Save, Layout, Palette, Image, CheckCircle, Images } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DEFAULT_THEME: DesignConfig = {
    layout_variant: 'standard',
    primary_color: '#f97316',
    secondary_color: '#374151',
    cover_type: 'color',
    background_opacity: 0.3
};

export default function DesignEditor({ initialBusiness }: { initialBusiness: Business }) {
    const router = useRouter();
    const supabase = createClient();

    const [business, setBusiness] = useState(initialBusiness);
    const [config, setConfig] = useState<DesignConfig>(
        initialBusiness.design_config
            ? { ...DEFAULT_THEME, ...initialBusiness.design_config }
            : DEFAULT_THEME
    );
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [galleryKey, setGalleryKey] = useState(0);
    const [gallery, setGallery] = useState<BusinessImage[]>([]); // Estado para galería

    const updateConfig = (key: keyof DesignConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveSuccess(false);

        const { error } = await supabase
            .from('businesses')
            .update({
                design_config: config,
                logo_url: business.logo_url,
                hero_image_url: business.hero_image_url
            })
            .eq('id', business.id);

        setSaving(false);

        if (!error) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            router.refresh();
        } else {
            alert('Error al guardar: ' + error.message);
        }
    };
    useEffect(() => {
        const fetchGallery = async () => {
            const { data } = await supabase
                .from('business_images')
                .select('*')
                .eq('business_id', business.id)
                .order('order_index');

            if (data) setGallery(data);
        };
        fetchGallery();
    }, [business.id]);
    const handleGalleryUpdate = async () => {
        setGalleryKey(prev => prev + 1);
        const { data } = await supabase
            .from('business_images')
            .select('*')
            .eq('business_id', business.id)
            .order('order_index');
        if (data) setGallery(data);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)] p-6">
            {/* PANEL IZQUIERDO */}
            <div className="w-full lg:w-1/3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold text-gray-900">Personalización</h2>
                        {business.is_premium && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full border border-amber-200 font-semibold">
                                Premium
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500">Personaliza tu perfil empresarial</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* LOGOS E IMÁGENES PRINCIPALES */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                            <Image size={16} /> Imágenes Principales
                        </h3>

                        <div className="space-y-5">
                            <ImageUploader
                                bucket="business-logos"
                                currentUrl={business.logo_url}
                                onUploadComplete={(url) => setBusiness({ ...business, logo_url: url })}
                                label="Logo del Negocio"
                                description="Imagen cuadrada recomendada (500x500px)"
                            />

                            <ImageUploader
                                bucket="business-covers"
                                currentUrl={business.hero_image_url}
                                onUploadComplete={(url) => setBusiness({ ...business, hero_image_url: url })}
                                label="Imagen Destacada"
                                description="Se mostrará en la sección principal"
                            />
                        </div>
                    </section>

                    {/* SELECTOR DE DISEÑO */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                            <Layout size={16} /> Estructura Visual
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'standard', label: 'Standard', premium: false },
                                { value: 'modern', label: 'Modern', premium: true },
                                { value: 'visual', label: 'Visual', premium: true }
                            ].map((variant) => (
                                <button
                                    key={variant.value}
                                    onClick={() => updateConfig('layout_variant', variant.value as any)}
                                    disabled={!business.is_premium && variant.premium}
                                    className={`
                                        relative p-4 rounded-xl border-2 text-sm font-semibold transition-all
                                        ${config.layout_variant === variant.value
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }
                                        ${(!business.is_premium && variant.premium) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    {variant.label}
                                    {variant.premium && !business.is_premium && (
                                        <span className="absolute -top-1 -right-1 bg-amber-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                            PRO
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        {!business.is_premium && (
                            <p className="text-xs text-gray-500 mt-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                💎 Actualiza a Premium para desbloquear más diseños
                            </p>
                        )}
                    </section>

                    {/* COLORES */}
                    <section>
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                            <Palette size={16} /> Colores de Marca
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-2">
                                    Color Primario
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={config.primary_color || '#f97316'}
                                        onChange={(e) => updateConfig('primary_color', e.target.value)}
                                        className="h-12 w-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={config.primary_color || '#f97316'}
                                        onChange={(e) => updateConfig('primary_color', e.target.value)}
                                        className="flex-1 rounded-lg border-2 border-gray-200 px-4 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {business.is_premium && (
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-2">
                                        Color Secundario
                                    </label>
                                    <div className="flex gap-3">
                                        <input
                                            type="color"
                                            value={config.secondary_color || '#374151'}
                                            onChange={(e) => updateConfig('secondary_color', e.target.value)}
                                            className="h-12 w-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={config.secondary_color || '#374151'}
                                            onChange={(e) => updateConfig('secondary_color', e.target.value)}
                                            className="flex-1 rounded-lg border-2 border-gray-200 px-4 text-sm font-mono focus:border-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* MULTIMEDIA PREMIUM */}
                    {business.is_premium && (
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                                <Image size={16} /> Multimedia Avanzada
                            </h3>

                            <div className="space-y-5">
                                <ImageUploader
                                    bucket="business-covers"
                                    currentUrl={config.background_url}
                                    onUploadComplete={(url) => updateConfig('background_url', url)}
                                    label="Imagen de Fondo (Visual Layout)"
                                    description="Se verá detrás del contenido en layout Visual"
                                />

                                <ImageUploader
                                    bucket="business-covers"
                                    currentUrl={config.cover_url}
                                    onUploadComplete={(url) => {
                                        setConfig(prev => ({
                                            ...prev,
                                            cover_url: url,
                                            cover_type: 'image'
                                        }));
                                    }}
                                    label="Imagen de Portada"
                                    description="Aparecerá en la parte superior del perfil"
                                />

                                {config.background_url && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <label className="text-xs font-medium text-gray-600 block mb-2 flex justify-between">
                                            <span>Opacidad del Fondo</span>
                                            <span>{((config.background_opacity || 0) * 100).toFixed(0)}%</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            /* Si es undefined o 0, usa 0. Si quieres un default visual usa || 0.1 */
                                            value={config.background_opacity ?? 0.1}
                                            onChange={(e) => updateConfig('background_opacity', parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            Ajusta la transparencia para que el texto sea legible.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* GALERÍA (SOLO PREMIUM) */}
                    {business.is_premium && (
                        <section>
                            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                                <Images size={16} /> Galería
                            </h3>
                            <GalleryManager
                                businessId={business.id}
                                onGalleryUpdate={handleGalleryUpdate}
                            />
                        </section>
                    )}
                </div>

                {/* BOTÓN GUARDAR */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`
                            w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold 
                            transition-all shadow-sm
                            ${saveSuccess
                            ? 'bg-green-600 text-white'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Guardando...
                            </>
                        ) : saveSuccess ? (
                            <>
                                <CheckCircle size={20} />
                                ¡Guardado!
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* PANEL DERECHO: SIMULADOR */}
            <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center p-8 border border-gray-200 shadow-inner relative">
                <MobileFrame>
                    {config.layout_variant === 'visual' ? (
                        <VisualLayoutWeb
                            key={galleryKey}
                            business={business}
                            config={config}
                            gallery={gallery}
                        />
                    ) : config.layout_variant === 'modern' ? (
                        <ModernLayoutWeb
                            key={galleryKey}
                            business={business}
                            config={config}
                            gallery={gallery}
                        />
                    ) : (
                        <StandardLayoutWeb
                            key={galleryKey}
                            business={business}
                            config={config}
                            gallery={gallery}
                        />
                    )}
                </MobileFrame>

                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs text-gray-500 shadow-sm border border-gray-200">
                    Vista previa · {config.layout_variant === 'standard' ? 'Standard' : config.layout_variant === 'modern' ? 'Modern' : 'Visual'}
                </div>
            </div>
        </div>
    );
}