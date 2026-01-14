import React, { useState, useEffect } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { BusinessImage } from '@/src/types/qhoar';
import { Upload, Trash2, Loader2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface GalleryManagerProps {
    businessId: string;
    onGalleryUpdate: () => void;
}

export function GalleryManager({ businessId, onGalleryUpdate }: GalleryManagerProps) {
    const [gallery, setGallery] = useState<BusinessImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [enabled, setEnabled] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        fetchGallery();
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, [businessId]);

    const fetchGallery = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('business_images')
            .select('*')
            .eq('business_id', businessId)
            .order('order_index');

        if (data) setGallery(data);
        setLoading(false);
    };

    const handleLocalUpdate = (id: number, field: 'title' | 'description', value: string) => {
        setGallery(prev => prev.map(img =>
            img.id === id ? { ...img, [field]: value } : img
        ));
    };

    const handleSaveMetadata = async (img: BusinessImage) => {
        setSavingId(img.id);

        try {
            const { error } = await supabase
                .from('business_images')
                .update({
                    title: img.title,
                    description: img.description
                })
                .eq('id', img.id);

            if (error) throw error;
            onGalleryUpdate();
        } catch (error) {
            console.error("Error guardando:", error);
        } finally {
            setSavingId(null);
        }
    };

    // Maneja el reordenamiento
    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(gallery);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        const updatedItems = items.map((item, index) => ({
            ...item,
            order_index: index
        }));

        setGallery(updatedItems);

        // 2. Guardar el nuevo orden en Supabase
        try {
            const updates = updatedItems.map(item => ({
                id: item.id,
                business_id: businessId,
                order_index: item.order_index,
                image_url: item.image_url
            }));

            // Upsert es eficiente para actualizaciones masivas
            const { error } = await supabase
                .from('business_images')
                .upsert(updates, { onConflict: 'id' });

            if (error) throw error;

            // Avisar al simulador
            onGalleryUpdate();
        } catch (error) {
            console.error("Error reordenando:", error);
            fetchGallery();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) continue;
                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name} supera 5MB`);
                    continue;
                }

                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('business-gallery')
                    .upload(fileName, file);

                if (uploadError) continue;

                const { data: { publicUrl } } = supabase.storage
                    .from('business-gallery')
                    .getPublicUrl(fileName);

                const nextOrder = gallery.length + i;
                await supabase
                    .from('business_images')
                    .insert({
                        business_id: businessId,
                        image_url: publicUrl,
                        order_index: nextOrder,
                        title: '',
                        description: ''
                    });
            }

            await fetchGallery();
            onGalleryUpdate();
        } catch (error: any) {
            alert('Error al subir imágenes: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number, imageUrl: string) => {
        if (!confirm('¿Eliminar esta imagen?')) return;
        try {
            const path = imageUrl.split('/').pop();
            if (path) await supabase.storage.from('business-gallery').remove([path]);

            await supabase.from('business_images').delete().eq('id', id);

            await fetchGallery();
            onGalleryUpdate();
        } catch (error: any) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="p-4"><Loader2 className="animate-spin text-gray-400" /></div>;
    if (!enabled) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">Galería y Orden</h4>
                <span className="text-xs text-gray-500">{gallery.length} imágenes</span>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="gallery-list">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-3"
                        >
                            {gallery.map((img, index) => (
                                <Draggable
                                    key={img.id}
                                    draggableId={img.id.toString()}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`bg-white p-3 rounded-xl border flex gap-4 transition-shadow ${
                                                snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500 z-50' : 'border-gray-200 shadow-sm'
                                            }`}
                                            style={provided.draggableProps.style}
                                        >
                                            {/* HANDLE PARA ARRASTRAR */}
                                            <div
                                                {...provided.dragHandleProps}
                                                className="flex items-center justify-center text-gray-300 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                                            >
                                                <GripVertical size={20} />
                                            </div>

                                            {/* IMAGEN Y BORRAR */}
                                            <div className="w-20 h-20 flex-shrink-0 relative group">
                                                <img
                                                    src={img.image_url}
                                                    alt="Thumb"
                                                    className="w-full h-full object-cover rounded-lg bg-gray-100"
                                                />
                                                <button
                                                    onClick={() => handleDelete(img.id, img.image_url)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>

                                            {/* CAMPOS DE EDICIÓN */}
                                            <div className="flex-1 space-y-2 min-w-0">
                                                <input
                                                    type="text"
                                                    value={img.title || ''}
                                                    onChange={(e) => handleLocalUpdate(img.id, 'title', e.target.value)}
                                                    onBlur={() => handleSaveMetadata(img)}
                                                    className="w-full px-2 py-1.5 text-sm  text-gray-600 font-medium border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                                    placeholder="Título de la imagen"
                                                />
                                                <div className="relative">
                                                    <textarea
                                                        value={img.description || ''}
                                                        onChange={(e) => handleLocalUpdate(img.id, 'description', e.target.value)}
                                                        onBlur={() => handleSaveMetadata(img)}
                                                        rows={2}
                                                        className="w-full px-2 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                                        placeholder="Descripción opcional..."
                                                    />
                                                    {savingId === img.id && (
                                                        <div className="absolute bottom-2 right-2">
                                                            <Loader2 className="w-3 h-3 animate-spin text-green-600" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* BOTÓN UPLOAD */}
            <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all gap-2">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                />
                {uploading ? (
                    <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                ) : (
                    <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-500">
                            Agregar imágenes
                        </span>
                    </>
                )}
            </label>
        </div>
    );
}