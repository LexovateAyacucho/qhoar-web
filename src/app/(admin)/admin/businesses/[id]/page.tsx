// app/(admin)/admin/businesses/[id]/page.tsx
import { createClient } from '@/src/utils/supabase/server'
import { BusinessEditor } from '@/src/components/admin/business-editor'
import { notFound } from 'next/navigation'

export default async function BusinessDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { id } = await params

    // Obtenemos todos los datos incluyendo el profile del dueño
    const { data: business } = await supabase
        .from('businesses')
        .select(`
            *,
            owner:profiles!businesses_owner_id_fkey (
                full_name,
                phone,
                dni,
                job_title,
                avatar_url
            )
        `)
        .eq('id', id)
        .single()

    if (!business) {
        notFound()
    }

    return (
        <BusinessEditor business={business} />
    )
}