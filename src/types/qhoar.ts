// Tipos para la configuración de diseño (JSONB)
export type DesignConfig = {
    layout_variant: 'standard' | 'modern' | 'visual';
    primary_color?: string;
    secondary_color?: string;
    cover_type?: 'color' | 'image' | 'video';
    cover_url?: string;
    background_url?: string;
    background_opacity?: number;
};

// Tipos para redes sociales (JSONB)
export type SocialLinks = {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
    website?: string;
};

// Interfaz principal de la Empresa (Mapeando tu tabla Supabase)
export interface Business {
    id: string;
    owner_id: string;
    name: string;
    ruc: string;
    description: string;
    address: string;
    phone: string;
    whatsapp: string;
    latitude: number;
    longitude: number;
    website_url?: string;
    logo_url: string;
    hero_image_url: string;
    status: 'pending' | 'active' | 'inactive';
    is_premium: boolean;
    subcategory_id: number;
    // Aquí aplicamos los tipos JSON
    design_config: DesignConfig;
    social_links: SocialLinks;
    created_at: string;
}
//Imagen del Carrusel

export interface BusinessImage {
    id: number;
    image_url: string;
    title?: string;
    description?: string;
    order_index: number;
}

interface LayoutProps {
    business: Business;
    config: DesignConfig;
    gallery: BusinessImage[]; // Agregamos esto
}

export type EventCategory = 'cultural' | 'social' | 'academico' | 'deportivo' | 'religioso' |'entretenimiento' | 'otro';

export interface Event {
    id: string;
    business_id?: string | null; // Puede ser null si es externo
    organizer_name?: string | null; // Nombre manual si no tiene business_id
    title: string;
    description: string;
    start_date: string;
    end_date?: string | null;
    location_text: string;
    poster_url?: string;
    is_featured: boolean; // Esto será el check de "Patrocinado"
    category: EventCategory;
    created_at: string;
    // Relación con business (opcional)
    businesses?: {
        name: string;
        logo_url?: string;
    };
}