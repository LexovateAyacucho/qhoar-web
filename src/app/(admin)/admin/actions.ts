// app/(admin)/admin/actions.ts
'use server'

import { createClient } from '@/src/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionState = {
    error?: string
    success?: boolean
} | null

export async function approveBusiness(businessId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('businesses')
        .update({ status: 'active' })
        .eq('id', businessId)

    if (error) {
        console.error('Error aprobando empresa:', error)
        return { error: 'No se pudo aprobar la empresa.' }
    }

    revalidatePath('/admin/businesses')
    revalidatePath('/admin/dashboard')
    return { success: true }
}

export async function togglePremium(businessId: string, isPremium: boolean) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('businesses')
        .update({ is_premium: isPremium })
        .eq('id', businessId)

    if (error) return { error: 'Error actualizando premium' }

    revalidatePath('/admin/businesses')
    revalidatePath('/admin/dashboard')
}

export async function createEvent(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string || ''
    const start_date = formData.get('start_date') as string

    const end_date_raw = formData.get('end_date') as string
    const end_date = end_date_raw ? end_date_raw : null

    const location_text = formData.get('location_text') as string
    const poster_url = formData.get('poster_url') as string || ''
    const category = formData.get('category') as string

    const is_featured = formData.get('is_featured') === 'on'

    const organizerType = formData.get('organizer_type')
    let business_id = null
    let organizer_name = null

    if (organizerType === 'business') {
        const bId = formData.get('business_id') as string
        if (!bId) return { error: 'Debes seleccionar una empresa registrada.' }
        business_id = bId
    } else {
        const manualName = formData.get('organizer_name') as string
        if (!manualName) return { error: 'Debes escribir el nombre del organizador.' }
        organizer_name = manualName
    }

    // NUEVOS CAMPOS
    const latitude_raw = formData.get('latitude') as string
    const longitude_raw = formData.get('longitude') as string
    const latitude = latitude_raw ? parseFloat(latitude_raw) : null
    const longitude = longitude_raw ? parseFloat(longitude_raw) : null

    const external_link = formData.get('external_link') as string || null
    const action_text = formData.get('action_text') as string || null

    const { error } = await supabase
        .from('events')
        .insert({
            title,
            description,
            start_date,
            end_date,
            location_text,
            poster_url,
            category,
            is_featured,
            business_id,
            organizer_name,
            latitude,
            longitude,
            external_link,
            action_text
        })

    if (error) {
        console.error('Error creando evento:', error)
        return { error: 'Error al crear evento: ' + error.message }
    }

    revalidatePath('/admin/events')
    revalidatePath('/admin/dashboard')
    return { success: true }
}

export async function updateBusiness(businessId: string, formData: FormData) {
    const supabase = await createClient()

    const updates = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        ruc: formData.get('ruc') as string,
        status: formData.get('status') as string,
        is_premium: formData.get('is_premium') === 'on',
    }

    const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', businessId)

    if (error) return { error: error.message }

    revalidatePath('/admin/businesses')
    revalidatePath(`/admin/businesses/${businessId}`)
    revalidatePath('/admin/dashboard')
    return { success: true }
}