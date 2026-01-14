import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Por ahora permitimos todo para desarrollo. Luego restringe a tu bucket de supabase.
            },
        ],
    },
};

export default nextConfig;