import React, {useEffect, useState} from 'react';
import {Business, BusinessImage, DesignConfig} from '@/src/types/qhoar';
import {createClient} from '@/src/utils/supabase/client';

interface Props {
    business: Business;
    config: DesignConfig;
    gallery: BusinessImage[];
}

export function ModernLayoutWeb({business, config, gallery}: Props) {
    const headerImage = config.cover_url || business.hero_image_url || 'https://via.placeholder.com/400';
    const socialLinks = business.social_links || {};

    const primaryColor = config.primary_color || '#f97316';
    const secondaryColor = config.secondary_color || '#374151';


    return (
        <div className="flex-1 h-full overflow-y-auto relative bg-white">
            {/* CAPA DE FONDO */}
            {config.background_url && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${config.background_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: config.background_opacity ?? 0.1
                    }}
                />
            )}

            <div className="relative z-10">
                {/* HERO DRAMÁTICO */}
                <div className="relative">
                    <img
                        src={headerImage}
                        alt="Header"
                        className="w-full h-96 object-cover"
                    />

                    {/* Gradiente dramático */}
                    <div
                        className="absolute bottom-0 w-full h-20"
                        style={{
                            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 50%, rgba(255,255,255,1) 100%)'
                        }}
                    />

                    {/* Logo flotante minimalista */}
                    <div className="absolute bottom-0 left-6 -mb-8">
                        <div className="bg-white rounded-3xl p-2 shadow-2xl">
                            <img
                                src={business.logo_url}
                                alt={business.name}
                                className="w-24 h-24 rounded-2xl object-cover"
                            />
                        </div>
                    </div>

                    {/* Badge galería */}
                    {gallery.length > 0 && (
                        <div
                            className="absolute top-12 right-6 px-4 py-2 rounded-full backdrop-blur-xl"
                            style={{backgroundColor: 'rgba(255,255,255,0.25)'}}
                        >
                        <span className="text-white text-sm font-semibold">
                            {gallery.length} {gallery.length === 1 ? 'foto' : 'fotos'}
                        </span>
                        </div>
                    )}
                </div>

                {/* CONTENIDO */}
                <div className="px-6 pt-12 pb-24">
                    {/* Título asimétrico */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-gray-900 leading-tight mb-3">
                            {business.name}
                        </h1>

                        {/* Subrayado orgánico */}
                        <div className="flex items-center">
                            <div
                                className="h-1.5 rounded-full"
                                style={{width: '60px', backgroundColor: secondaryColor}}
                            />
                            <div
                                className="h-1.5 rounded-full ml-2"
                                style={{width: '30px', backgroundColor: primaryColor}}
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-700 text-base leading-7 mb-10 tracking-wide">
                        {business.description}
                    </p>

                    {/* Botones de contacto */}
                    <div className="flex gap-3 mb-12">
                        <button
                            className="flex-1 py-4 rounded-2xl flex items-center justify-center"
                            style={{backgroundColor: primaryColor}}
                        >
                            <svg className="w-5 h-5 mr-3" fill="white" viewBox="0 0 24 24">
                                <path
                                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span className="text-white font-semibold text-base">
                            WhatsApp
                        </span>
                        </button>

                        {business.phone && (
                            <button
                                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{backgroundColor: secondaryColor}}
                            >
                                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                    <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                                    <path
                                        d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.086-1.391l-4.064-3.696z"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* IMAGEN DESTACADA - estilo editorial */}
                    {business.hero_image_url && (
                        <div className="mb-12">
                            <div className="overflow-hidden rounded-3xl relative">
                                <img
                                    src={business.hero_image_url}
                                    alt="Hero"
                                    className="w-full h-80 object-cover"
                                />
                                {/* Detalle de color en esquina */}
                                <div
                                    className="absolute bottom-0 right-0 w-20 h-20 opacity-30"
                                    style={{backgroundColor: secondaryColor}}
                                />
                            </div>
                        </div>
                    )}

                    {/* REDES SOCIALES - minimalista */}
                    {(socialLinks.facebook || socialLinks.instagram || socialLinks.tiktok || business.website_url) && (
                        <div className="mb-12">
                            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4 font-semibold">
                                Encuéntranos
                            </h3>
                            <div className="flex gap-4">
                                {business.website_url && (
                                    <button
                                        className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="#374151" viewBox="0 0 24 24">
                                            <path
                                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                        </svg>
                                    </button>
                                )}
                                {socialLinks.facebook && (
                                    <button
                                        className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                            <path
                                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </button>
                                )}
                                {socialLinks.instagram && (
                                    <button
                                        className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="#E1306C" viewBox="0 0 24 24">
                                            <path
                                                d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                                        </svg>
                                    </button>
                                )}
                                {socialLinks.tiktok && (
                                    <button
                                        className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                                            <path
                                                d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* GALERÍA - Lookbook style */}
                    {gallery.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-end justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    Galería
                                </h3>
                                <div
                                    className="px-3 py-1 rounded-full"
                                    style={{backgroundColor: `${secondaryColor}15`}}
                                >
                                <span
                                    className="text-xs font-bold"
                                    style={{color: secondaryColor}}
                                >
                                    {gallery.length}
                                </span>
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
                                {gallery.map((img, idx) => {
                                    // Variación de altura para efecto lookbook
                                    const heights = [240, 200, 260, 220];
                                    const height = heights[idx % heights.length];

                                    return (
                                        <div key={img.id} className="flex-shrink-0" style={{width: '70%'}}>
                                            <div
                                                className="rounded-3xl overflow-hidden bg-gray-100 relative"
                                                style={{height: `${height}px`}}
                                            >
                                                <img
                                                    src={img.image_url}
                                                    alt={img.title}
                                                    className="w-full h-full object-cover"
                                                />

                                                {img.title && (
                                                    <div
                                                        className="absolute bottom-0 left-0 right-0 p-5"
                                                        style={{
                                                            background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)'
                                                        }}
                                                    >
                                                        <p className="text-white font-semibold text-base">
                                                            {img.title}
                                                        </p>
                                                        {img.description && (
                                                            <p className="text-white/80 text-sm mt-1">
                                                                {img.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* UBICACIÓN - Card limpia */}
                    {business.address && (
                        <div className="mb-12">
                            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-4 font-semibold">
                                Ubicación
                            </h3>

                            <button className="w-full bg-gray-50 rounded-3xl p-6 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                                        style={{backgroundColor: `${primaryColor}15`}}
                                    >
                                        <svg className="w-5 h-5" fill={primaryColor} viewBox="0 0 24 24">
                                            <path
                                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                        </svg>
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-gray-900 font-semibold text-base mb-1">
                                            Cómo llegar
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {business.address}
                                        </p>
                                    </div>
                                    <svg className="w-4 h-4" fill={primaryColor} viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                    </svg>
                                </div>

                                {/* Mapa placeholder */}
                                <div
                                    className="h-32 rounded-2xl overflow-hidden relative"
                                    style={{backgroundColor: `${primaryColor}10`}}
                                >
                                    <div className="w-full h-full bg-gray-100 opacity-40"/>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* CTA FINAL */}
                    <button className="w-full rounded-3xl overflow-hidden">
                        <div
                            className="py-5 px-8 flex items-center justify-between"
                            style={{
                                background: `linear-gradient(90deg, ${primaryColor} 0%, ${primaryColor} 100%)`
                            }}
                        >
                            <div className="flex items-center">
                                <div
                                    className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                    <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                        <path
                                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold text-lg">
                                        Conversemos
                                    </p>
                                    <p className="text-white/80 text-sm">
                                        Respuesta inmediata
                                    </p>
                                </div>
                            </div>
                            <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}