export interface Profile {
  id: string
  email: string
  nombre: string | null
  apellido: string | null
  fecha_nacimiento: string | null
  sexo: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir' | null
  altura_cm: number | null
  created_at: string
}

export interface WeightEntry {
  id: string
  user_id: string
  fecha: string
  peso_kg: number
  notas: string | null
  created_at: string
}

export type ActionState =
  | {
      errors?: { [field: string]: string[] | undefined }
      message?: string
      success?: boolean
    }
  | undefined
