interface Stats {
  current: number | null
  initial: number | null
  change: number | null
  count: number
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const { current, initial, change, count } = stats

  const changeStr =
    change === null
      ? '—'
      : change > 0
        ? `+${change.toFixed(1)} kg`
        : change < 0
          ? `${change.toFixed(1)} kg`
          : '0 kg'

  const changeColor =
    change === null || change === 0
      ? 'text-gray-900'
      : change < 0
        ? 'text-emerald-600'
        : 'text-red-500'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Peso actual" value={current ? `${current.toFixed(1)} kg` : '—'} />
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500">Variación total</p>
        <p className={`text-2xl font-bold mt-1 ${changeColor}`}>{changeStr}</p>
      </div>
      <StatCard label="Peso inicial" value={initial ? `${initial.toFixed(1)} kg` : '—'} />
      <StatCard
        label="Registros"
        value={count.toString()}
        sub={count === 1 ? 'entrada' : 'entradas'}
      />
    </div>
  )
}
