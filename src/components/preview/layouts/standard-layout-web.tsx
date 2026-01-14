import React from 'react';
import {Business, BusinessImage, DesignConfig} from '@/src/types/qhoar';

const PLACEHOLDER_LOGO = 'https://via.placeholder.com/150';

interface Props {
    business: Business;
    config: DesignConfig;
    gallery: BusinessImage[];
}

export default function StandardLayoutWeb({ business, config, gallery }: Props) {
    const hasCover = !!config.cover_url && config.cover_url.length > 0;
    const socialLinks = business.social_links || {};
    const isPremium = business.is_premium;

    // Verificar si hay redes sociales
    const hasSocials = socialLinks.facebook || socialLinks.instagram || socialLinks.tiktok || business.website_url;

    return (
        <div className="flex-1 h-full overflow-y-auto relative" style={{ backgroundColor: config.background_url ? 'transparent' : '#fafafa' }}>
            {/* CAPA DE FONDO (BACKGROUND PATTERN) */}
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
                {/* HEADER / COVER */}
                {hasCover ? (
                    <div
                        className="h-48 w-full relative bg-cover bg-center"
                        style={{ backgroundImage: `url(${config.cover_url})` }}
                    >
                        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-black/40" />
                    </div>
                ) : (
                    <div
                        className="h-48 w-full relative overflow-hidden"
                        style={{ backgroundColor: config.primary_color || '#f97316' }}
                    >
                        {/* Patrón decorativo de fondo */}
                        <div className="absolute -right-8 -top-8 opacity-10">
                            <svg className="w-36 h-36" fill="white" viewBox="0 0 24 24">
                                <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
                            </svg>
                        </div>
                        <div className="absolute -left-12 bottom-4 opacity-5">
                            <svg className="w-28 h-28" fill="white" viewBox="0 0 24 24">
                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
                            </svg>
                        </div>
                        <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-black/10" />
                    </div>
                )}

                {/* Contenedor Principal */}
                <div className={config.background_url ? 'bg-white/95 mx-4 -mt-8 rounded-3xl shadow-2xl' : 'bg-white -mt-8 rounded-t-3xl'} style={{ paddingBottom: '13px'}}>

                    {/* Logo con Badge Premium */}
                    <div className="-mt-16 px-6 mb-4">
                        <div className="relative w-fit">
                            <div className="bg-white p-2 rounded-3xl shadow-lg">
                                <img
                                    src={business.logo_url || PLACEHOLDER_LOGO}
                                    alt={business.name}
                                    className="w-28 h-28 rounded-2xl border-2 border-gray-100 object-cover"
                                />
                            </div>
                            {isPremium && (
                                <div className="absolute -bottom-1 -right-1 bg-amber-400 px-2.5 py-1.5 rounded-full flex items-center shadow-md">
                                    <svg className="w-3 h-3 mr-1" fill="white" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <span className="text-white text-xs font-bold">PRO</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información Principal */}
                    <div className="px-6">
                        {/* Título y Dirección */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">
                                {business.name}
                            </h1>
                            {business.address && (
                                <div className="flex items-start mt-3">
                                    <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="#9ca3af" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <p className="text-gray-500 text-sm leading-relaxed">{business.address}</p>
                                </div>
                            )}
                        </div>

                        {/* Botones de Contacto Mejorados */}
                        <div className="flex gap-3 mb-6">
                            <button
                                className="flex-1 bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center py-4 rounded-2xl shadow-md"
                                onClick={() => {
                                    if (business.whatsapp) {
                                        const text = `Hola ${business.name}, los vi en la app Qhoar.`;
                                        window.open(`https://wa.me/${business.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                                    }
                                }}
                            >
                                <svg className="w-5 h-5 mr-2" fill="white" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <span className="text-white font-bold text-base">WhatsApp</span>
                            </button>

                            {business.phone && (
                                <button
                                    className="w-16 h-16 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center rounded-2xl shadow-sm"
                                    onClick={() => window.open(`tel:${business.phone}`, '_blank')}
                                >
                                    <svg className="w-5 h-5" fill="#374151" viewBox="0 0 24 24">
                                        <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z" />
                                        <path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a.997.997 0 0 0-.086-1.391l-4.064-3.696z" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Descripción con Card Mejorada */}
                        <div className="mb-6">
                            <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div className="flex items-center mb-3">
                                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4" fill="#f97316" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-gray-900 font-bold text-lg ml-3">Sobre Nosotros</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    {business.description || "Bienvenido a nuestro negocio. Estamos aquí para atenderte con la mejor calidad y servicio."}
                                </p>
                            </div>
                        </div>

                        {/* Hero Image (si existe) */}
                        {business.hero_image_url && (
                            <div className="mb-6">
                                <img
                                    src={business.hero_image_url}
                                    alt="Imagen destacada"
                                    className="w-full rounded-2xl object-cover shadow-sm"
                                    style={{ height: '200px' }}
                                />
                            </div>
                        )}

                        {/* Botón de Mapa Mejorado */}
                        {(business.latitude && business.longitude) && (
                            <button
                                className="w-full mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
                                onClick={() => {
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${business.latitude},${business.longitude}`, '_blank');
                                }}
                            >
                                <div className="flex items-center flex-1">
                                    <div className="w-11 h-11 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3 text-left flex-1">
                                        <p className="text-blue-900 font-bold text-base">Cómo llegar</p>
                                        <p className="text-blue-600 text-sm">Ver ubicación en el mapa</p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 flex-shrink-0" fill="#93c5fd" viewBox="0 0 24 24">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </button>
                        )}

                        {/* Redes Sociales Mejoradas */}
                        {hasSocials && (
                            <div className="mb-10 pb-10" >
                                <div className="flex items-center mb-4 ">
                                    <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4" fill="#9333ea" viewBox="0 0 24 24">
                                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-gray-900 font-bold text-base ml-3">Síguenos</h3>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {business.website_url && (
                                        <button
                                            onClick={() => window.open(business.website_url, '_blank')}
                                            className="bg-gray-100 hover:bg-gray-200 transition-colors px-5 py-3 rounded-xl flex items-center"
                                        >
                                            <svg className="w-5 h-5" fill="#6b7280" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                            </svg>
                                            <span className="text-gray-700 font-semibold ml-2 text-sm">Sitio Web</span>
                                        </button>
                                    )}
                                    {socialLinks.facebook && (
                                        <button
                                            onClick={() => window.open(socialLinks.facebook, '_blank')}
                                            className="bg-blue-50 hover:bg-blue-100 transition-colors px-5 py-3 rounded-xl flex items-center"
                                        >
                                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                            <span className="text-blue-700 font-semibold ml-2 text-sm">Facebook</span>
                                        </button>
                                    )}
                                    {socialLinks.instagram && (
                                        <button
                                            onClick={() => window.open(socialLinks.instagram, '_blank')}
                                            className="bg-pink-50 hover:bg-pink-100 transition-colors px-5 py-3 rounded-xl flex items-center"
                                        >
                                            <svg className="w-5 h-5" fill="#E1306C" viewBox="0 0 24 24">
                                                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                                            </svg>
                                            <span className="text-pink-700 font-semibold ml-2 text-sm">Instagram</span>
                                        </button>
                                    )}
                                    {socialLinks.tiktok && (
                                        <button
                                            onClick={() => window.open(socialLinks.tiktok, '_blank')}
                                            className="bg-gray-100 hover:bg-gray-200 transition-colors px-5 py-3 rounded-xl flex items-center"
                                        >
                                            <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                            </svg>
                                            <span className="text-gray-800 font-semibold ml-2 text-sm">TikTok</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Galería Premium (solo si es premium y tiene imágenes) */}
                {isPremium && gallery.length > 0 && (
                    <div className="mt-6 mb-8">
                        <div className="px-6 mb-4">
                            <div className="flex items-center">
                                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="#f97316" viewBox="0 0 24 24">
                                        <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 font-bold text-lg ml-3">Galería</h3>
                            </div>
                        </div>
                        <div className="flex gap-4 overflow-x-auto px-6 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {gallery.map((img) => (
                                <div key={img.id} className="flex-shrink-0">
                                    <img
                                        src={img.image_url}
                                        alt={img.title || 'Imagen de galería'}
                                        className="w-72 h-48 rounded-2xl bg-gray-200 object-cover shadow-sm"
                                    />
                                    {img.title && (
                                        <p className="text-sm font-semibold text-gray-800 mt-2">{img.title}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Decorativo */}
                <div className="mt-4 mb-6 px-6">
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-center opacity-50">
                            <svg className="w-4 h-4" fill="#9ca3af" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                            </svg>
                            <p className="text-gray-400 text-xs ml-2">Descubre Ayacucho en Qhoar</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .overflow-x-auto::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}