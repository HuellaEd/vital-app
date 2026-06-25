import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <h1 className="text-5xl font-bold text-emerald-600 mb-3">Vital</h1>
      <p className="text-lg text-gray-500 mb-10">Tu cuerpo · Tu data</p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/login"
          className="bg-emerald-600 text-white text-center py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="border border-emerald-600 text-emerald-600 text-center py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
        >
          Crear cuenta
        </Link>
      </div>
    </main>
  )
}
