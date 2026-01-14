import React, { useState, useEffect } from 'react';
import { Business, DesignConfig, BusinessImage } from '@/src/types/qhoar';

interface Props {
    business: Business;
    config: DesignConfig;
    gallery: BusinessImage[];
}

export function VisualLayoutWeb({ business, config, gallery }: Props) {

    const bgImage = config.background_url || config.cover_url || business.hero_image_url || 'https://via.placeholder.com/800x1200';
    const socialLinks = business.social_links || {};

    const primaryColor = config.primary_color || '#f97316';
    const secondaryColor = config.secondary_color || '#fbbf24';
    const opacity = config.background_opacity ?? 0.5;
    return (
        // CAMBIO 1: Quitamos overflow-y-auto de aquí y ponemos overflow-hidden
        // Esto crea el marco fijo del celular
        <div className="flex-1 bg-black relative h-full overflow-hidden">

            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    opacity: opacity
                }}
            />

            {/* CAPA 2: GRADIENTE (FIJO) */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-transparent to-black/95"
                 style={{
                     background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 30%, rgba(0,0,0,0.95) 85%)'
                 }}
            />

            {/* CAPA 3: CONTENEDOR DE SCROLL (FLOTANTE) */}
            {/* Este div ocupa toda la pantalla y es el único que se mueve */}
            <div className="absolute inset-0 z-10 overflow-y-auto">
                <div className="px-6 pt-24 pb-32">
                    {/* LOGO DESTACADO */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="mb-6 relative">
                            <div
                                className="w-28 h-28 rounded-full p-1 border-2"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderColor: 'rgba(255,255,255,0.3)'
                                }}
                            >
                                <img
                                    src={business.logo_url}
                                    alt={business.name}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>

                            {gallery.length > 0 && (
                                <div
                                    className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                <span className="text-white text-xs font-bold">
                                    {gallery.length}
                                </span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-white font-black text-4xl text-center leading-tight mb-3">
                            {business.name}
                        </h1>

                        <div
                            className="w-24 h-1 rounded-full mb-4"
                            style={{
                                background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                            }}
                        />

                        <p className="text-gray-300 text-center text-sm font-medium tracking-[3px] uppercase">
                            Experiencia Exclusiva
                        </p>
                    </div>

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex justify-center gap-3 mb-8">
                        <button
                            className="px-8 py-4 rounded-full flex items-center border"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                borderColor: 'rgba(255,255,255,0.25)'
                            }}
                        >
                            <svg className="w-5 h-5 mr-3" fill="white" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            <span className="text-white font-bold">Contacto</span>
                        </button>

                        {business.phone && (
                            <button
                                className="w-14 h-14 rounded-full flex items-center justify-center border"
                                style={{
                                    backgroundColor: secondaryColor,
                                    borderColor: 'rgba(255,255,255,0.2)'
                                }}
                            >
                                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                    <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"/>
                                    <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.086-1.391l-4.064-3.696z"/>
                                </svg>
                            </button>
                        )}

                        {business.address && (
                            <button
                                className="w-14 h-14 rounded-full flex items-center justify-center border"
                                style={{
                                    backgroundColor: primaryColor,
                                    borderColor: 'rgba(255,255,255,0.2)'
                                }}
                            >
                                <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* DESCRIPCIÓN */}
                    <div
                        className="backdrop-blur-2xl rounded-3xl p-6 border border-white/10 mb-8"
                        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    >
                        <h2 className="text-white/90 text-lg font-bold mb-4">
                            Sobre nosotros
                        </h2>
                        <p className="text-gray-300 leading-7 mb-6">
                            {business.description}
                        </p>

                        {business.address && (
                            <div className="flex items-start pt-4 border-t border-white/10">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                                    style={{ backgroundColor: `${primaryColor}40` }}
                                >
                                    <svg className="w-4 h-4" fill={primaryColor} viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-white/70 text-xs uppercase tracking-wide mb-1 font-semibold">
                                        Ubicación
                                    </p>
                                    <p className="text-white text-sm">
                                        {business.address}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* IMAGEN DESTACADA */}
                    {business.hero_image_url && (
                        <div className="mb-8">
                            <h3 className="text-white font-bold text-xl mb-4">
                                Destacado
                            </h3>
                            <div className="relative rounded-3xl overflow-hidden">
                                <img
                                    src={business.hero_image_url}
                                    alt="Destacado"
                                    className="w-full h-64 object-cover"
                                />
                                <div
                                    className="absolute bottom-0 w-full h-24"
                                    style={{
                                        background: `linear-gradient(180deg, transparent 0%, ${primaryColor}40 100%)`
                                    }}
                                />
                                <div
                                    className="absolute inset-0 rounded-3xl border-2"
                                    style={{ borderColor: `${primaryColor}30` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* GALERÍA */}
                    {gallery.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-bold text-xl">
                                    Galería
                                </h3>
                                <div
                                    className="px-3 py-1 rounded-full backdrop-blur-xl border border-white/20"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                >
                                <span className="text-white text-xs font-bold">
                                    {gallery.length} fotos
                                </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {gallery.slice(0, 4).map((img, idx) => (
                                    <div
                                        key={img.id}
                                        className="relative rounded-2xl overflow-hidden border border-white/20"
                                        style={{
                                            height: idx === 0 ? '240px' : '180px'
                                        }}
                                    >
                                        <img
                                            src={img.image_url}
                                            alt={img.title || `Imagen ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        <div
                                            className="absolute bottom-0 w-full h-20 flex items-end p-3"
                                            style={{
                                                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)'
                                            }}
                                        >
                                            {img.title && (
                                                <span className="text-white text-sm font-bold">
                                                {img.title}
                                            </span>
                                            )}
                                        </div>

                                        <div
                                            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/20"
                                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                                        >
                                        <span className="text-white text-xs font-bold">
                                            {idx + 1}
                                        </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {gallery.length > 4 && (
                                <button
                                    className="w-full mt-4 py-3 backdrop-blur-xl border border-white/20 rounded-2xl items-center"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                >
                                <span className="text-white font-semibold">
                                    Ver todas las fotos ({gallery.length})
                                </span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* REDES SOCIALES */}
                    {(socialLinks.facebook || socialLinks.instagram || socialLinks.tiktok || business.website_url) && (
                        <div className="mb-10">
                            <h3 className="text-white font-bold text-xl mb-4">
                                Síguenos
                            </h3>
                            <div className="flex justify-center gap-4">
                                {business.website_url && (
                                    <button
                                        className="w-14 h-14 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                        </svg>
                                    </button>
                                )}
                                {socialLinks.instagram && (
                                    <button
                                        className="w-14 h-14 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(225,48,108,0.2)' }}
                                    >
                                        <svg className="w-6 h-6" fill="#E1306C" viewBox="0 0 24 24">
                                            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                                        </svg>
                                    </button>
                                )}
                                {socialLinks.facebook && (
                                    <button
                                        className="w-14 h-14 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(24,119,242,0.2)' }}
                                    >
                                        <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CTA FINAL */}
                    <div className="rounded-3xl overflow-hidden">
                        <button className="w-full">
                            <div
                                className="py-5 px-6 flex items-center justify-between"
                                style={{
                                    background: `linear-gradient(90deg, ${primaryColor} 0%, ${primaryColor} 100%)`
                                }}
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
        </div>
    );
}