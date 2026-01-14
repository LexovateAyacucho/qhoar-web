'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/src/utils/supabase/server'

type ActionState = {
    error?: string
} | undefined

export async function login(prevState: ActionState, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Credenciales inválidas. Inténtalo de nuevo.' }
    }
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

    if (profileError || !profile) {
        await supabase.auth.signOut()
        return { error: 'Error crítico: Usuario sin perfil asignado.' }
    }
    if (profile.role === 'admin') {
        redirect('/admin/dashboard')
    } else {
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('is_premium')
            .eq('owner_id', data.user.id)
            .single()
        if (businessError || !business || !business.is_premium) {
            await supabase.auth.signOut()

            return {
                error: 'Acceso restringido. Esta plataforma web es exclusiva para usuarios Premium.'
            }
        }
        redirect('/portal/profile')
    }
}