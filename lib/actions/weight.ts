'use server'

import { revalidatePath } from 'next/cache'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/server'
import type { ActionState } from '@/lib/types'

const WeightSchema = z.object({
  fecha: z.string().min(1, { error: 'La fecha es obligatoria.' }),
  peso_kg: z.coerce
    .number()
    .positive({ error: 'El peso debe ser mayor a 0.' })
    .max(499.99, { error: 'El peso debe ser menor a 500 kg.' }),
  notas: z.string().optional(),
})

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function createWeight(state: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { message: 'No autenticado.' }

  const validated = WeightSchema.safeParse({
    fecha: formData.get('fecha'),
    peso_kg: formData.get('peso_kg'),
    notas: (formData.get('notas') as string) || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase.from('weight_entries').insert({
    user_id: user.id,
    ...validated.data,
    notas: validated.data.notas ?? null,
  })

  if (error) {
    if (error.code === '23505') {
      return { message: 'Ya existe un registro para esa fecha.' }
    }
    return { message: 'Error al guardar el registro.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/peso')
  return { success: true }
}

export async function updateWeight(state: ActionState, formData: FormData): Promise<ActionState> {
  const id = formData.get('id') as string
  if (!id) return { message: 'ID de registro inválido.' }

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { message: 'No autenticado.' }

  const validated = WeightSchema.safeParse({
    fecha: formData.get('fecha'),
    peso_kg: formData.get('peso_kg'),
    notas: (formData.get('notas') as string) || undefined,
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase
    .from('weight_entries')
    .update({
      ...validated.data,
      notas: validated.data.notas ?? null,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    if (error.code === '23505') {
      return { message: 'Ya existe un registro para esa fecha.' }
    }
    return { message: 'Error al actualizar el registro.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/peso')
  return { success: true }
}

export async function deleteWeight(formData: FormData): Promise<void> {
  const id = formData.get('id') as string
  if (!id) return

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return

  await supabase
    .from('weight_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  revalidatePath('/dashboard')
  revalidatePath('/peso')
}
