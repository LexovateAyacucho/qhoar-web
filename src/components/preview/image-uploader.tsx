import React, { useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Upload, X, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
    bucket: 'business-gallery' | 'business-covers' | 'business-logos' | 'events-posters';
    currentUrl?: string;
    onUploadComplete: (url: string) => void;
    label: string;
    description?: string;
}

export function ImageUploader({
                                  bucket,
                                  currentUrl,
                                  onUploadComplete,
                                  label,
                                  description
                              }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentUrl || '');
    const supabase = createClient();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar 5MB');
            return;
        }

        setUploading(true);

        try {
            // Crear nombre único
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Subir a Supabase Storage
            const { error: uploadError, data } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw uploadError;

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onUploadComplete(publicUrl);
        } catch (error: any) {
            console.error('Error uploading:', error);
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview('');
        onUploadComplete('');
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 block">
                {label}
            </label>

            {preview ? (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                                Click para subir imagen
                            </span>
                        </>
                    )}
                </label>
            )}

            {description && (
                <p className="text-xs text-gray-500">{description}</p>
            )}
        </div>
    );
}