import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatsCards from '@/components/dashboard/StatsCards'
import WeightChart from '@/components/dashboard/WeightChart'

export const metadata: Metadata = { title: 'Dashboard | Vital' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data } = await supabase
    .from('weight_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('fecha', { ascending: true })

  const entries = data ?? []

  const stats = {
    current: entries.length > 0 ? entries[entries.length - 1].peso_kg : null,
    initial: entries.length > 0 ? entries[0].peso_kg : null,
    change:
      entries.length > 1
        ? entries[entries.length - 1].peso_kg - entries[0].peso_kg
        : null,
    count: entries.length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/peso"
          className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          + Agregar peso
        </Link>
      </div>

      <StatsCards stats={stats} />

      {entries.length > 0 ? (
        <WeightChart entries={entries} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <p className="text-gray-500 text-sm mb-3">Aún no tenés registros de peso.</p>
          <Link href="/peso" className="text-emerald-600 hover:underline text-sm font-medium">
            Agregar tu primer registro →
          </Link>
        </div>
      )}
    </div>
  )
}
