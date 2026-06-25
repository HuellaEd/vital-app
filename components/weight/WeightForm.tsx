'use client'

import { useActionState, useCallback, useEffect, useState } from 'react'
import { createWeight } from '@/lib/actions/weight'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50'

function getLocalDate() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function WeightFormInner({ onSuccess }: { onSuccess: () => void }) {
  const [state, action, pending] = useActionState(createWeight, undefined)
  const [fecha, setFecha] = useState('')

  useEffect(() => {
    setFecha(getLocalDate())
  }, [])

  useEffect(() => {
    if (state?.success) onSuccess()
  }, [state?.success, onSuccess])

  return (
    <form action={action} className="space-y-4">
      {state?.message && !state.success && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled={pending}
            className={inputClass}
          />
          {state?.errors?.fecha?.[0] && (
            <p className="text-xs text-red-500 mt-1">{state.errors.fecha[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="peso_kg" className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg)
          </label>
          <input
            id="peso_kg"
            name="peso_kg"
            type="number"
            step="0.01"
            min="0.01"
            max="499.99"
            required
            placeholder="70.5"
            disabled={pending}
            className={inputClass}
          />
          {state?.errors?.peso_kg?.[0] && (
            <p className="text-xs text-red-500 mt-1">{state.errors.peso_kg[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
          Notas <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={2}
          placeholder="Ej: en ayunas, después del gym..."
          disabled={pending}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Guardando...' : 'Guardar registro'}
      </button>
    </form>
  )
}

export default function WeightForm() {
  const [key, setKey] = useState(0)
  const handleSuccess = useCallback(() => setKey((k) => k + 1), [])
  return <WeightFormInner key={key} onSuccess={handleSuccess} />
}
