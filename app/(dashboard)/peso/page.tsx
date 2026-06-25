import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WeightForm from '@/components/weight/WeightForm'
import WeightList from '@/components/weight/WeightList'

export const metadata: Metadata = { title: 'Registros de peso | Vital' }

export default async function PesoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('weight_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: false })

  const entries = data ?? []

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Registros de peso</h1>

      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">Nuevo registro</h2>
        <WeightForm />
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          {entries.length > 0
            ? `${entries.length} registro${entries.length !== 1 ? 's' : ''}`
            : 'Sin registros'}
        </h2>
        <WeightList entries={entries} />
      </section>
    </div>
  )
}
