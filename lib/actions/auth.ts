'use server'

import { redirect } from 'next/navigation'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { ActionState } from '@/lib/types'

const LoginSchema = z.object({
  email: z.email({ error: 'Ingresá un email válido.' }),
  password: z.string().min(6, { error: 'La contraseña debe tener al menos 6 caracteres.' }),
})

const RegisterSchema = z.object({
  email: z.email({ error: 'Ingresá un email válido.' }),
  password: z.string().min(6, { error: 'La contraseña debe tener al menos 6 caracteres.' }),
  nombre: z.string().optional(),
  apellido: z.string().optional(),
})

const ResetSchema = z.object({
  email: z.email({ error: 'Ingresá un email válido.' }),
})

export async function login(state: ActionState, formData: FormData): Promise<ActionState> {
  const validated = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(validated.data)

  if (error) {
    return { message: 'Email o contraseña incorrectos.' }
  }

  redirect('/dashboard')
}

export async function register(state: ActionState, formData: FormData): Promise<ActionState> {
  const validated = RegisterSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    nombre: (formData.get('nombre') as string) || undefined,
    apellido: (formData.get('apellido') as string) || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password, nombre, apellido } = validated.data

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { message: error.message }
  }

  if (!data.session) {
    return { message: 'Revisá tu email para confirmar tu cuenta y luego iniciá sesión.', success: true }
  }

  // Sesión inmediata (email confirmation desactivado): actualizar perfil
  if (nombre || apellido) {
    await supabase
      .from('profiles')
      .update({ nombre: nombre ?? null, apellido: apellido ?? null })
      .eq('id', data.session.user.id)
  }

  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPassword(state: ActionState, formData: FormData): Promise<ActionState> {
  const validated = ResetSchema.safeParse({
    email: formData.get('email'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(validated.data.email)

  if (error) {
    return { message: 'No se pudo enviar el email. Intentá de nuevo.' }
  }

  return { message: 'Te enviamos un email con instrucciones para restablecer tu contraseña.', success: true }
}
