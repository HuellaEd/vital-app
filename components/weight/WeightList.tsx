'use client'

import { useActionState, useCallback, useEffect, useState } from 'react'
import { updateWeight, deleteWeight } from '@/lib/actions/weight'
import type { WeightEntry } from '@/lib/types'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50'

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

function EditForm({ entry, onCancel }: { entry: WeightEntry; onCancel: () => void }) {
  const [state, action, pending] = useActionState(updateWeight, undefined)

  useEffect(() => {
    if (state?.success) onCancel()
  }, [state?.success, onCancel])

  return (
    <form action={action} className="p-4 bg-gray-50 rounded-xl border border-emerald-200 space-y-3">
      <input type="hidden" name="id" value={entry.id} />

      {state?.message && !state.success && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
          <input
            name="fecha"
            type="date"
            required
            defaultValue={entry.fecha}
            disabled={pending}
            className={inputClass}
          />
          {state?.errors?.fecha?.[0] && (
            <p className="text-xs text-red-500 mt-1">{state.errors.fecha[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Peso (kg)</label>
          <input
            name="peso_kg"
            type="number"
            step="0.01"
            min="0.01"
            max="499.99"
            required
            defaultValue={entry.peso_kg}
            disabled={pending}
            className={inputClass}
          />
          {state?.errors?.peso_kg?.[0] && (
            <p className="text-xs text-red-500 mt-1">{state.errors.peso_kg[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Notas <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          name="notas"
          rows={2}
          defaultValue={entry.notas ?? ''}
          disabled={pending}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 transition-colors"
        >
          {pending ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function WeightList({ entries }: { entries: WeightEntry[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const handleCancelEdit = useCallback(() => setEditingId(null), [])

  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-8">
        Todavía no hay registros.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) =>
        editingId === entry.id ? (
          <EditForm key={entry.id} entry={entry} onCancel={handleCancelEdit} />
        ) : (
          <div
            key={entry.id}
            className="flex items-start justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3">
                <span className="text-base font-semibold text-gray-900">
                  {entry.peso_kg.toFixed(1)} kg
                </span>
                <span className="text-sm text-gray-500">{formatDate(entry.fecha)}</span>
              </div>
              {entry.notas && (
                <p className="text-sm text-gray-400 mt-0.5 truncate">{entry.notas}</p>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEditingId(entry.id)}
                className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
              >
                Editar
              </button>
              <form action={deleteWeight}>
                <input type="hidden" name="id" value={entry.id} />
                <button
                  type="submit"
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </div>
        )
      )}
    </div>
  )
}
