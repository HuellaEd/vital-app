'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/lib/actions/auth'

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50'

export default function ResetPasswordForm() {
  const [state, action, pending] = useActionState(resetPassword, undefined)

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <p
          className={`text-sm rounded-lg px-3 py-2 border ${
            state.success
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-red-600 bg-red-50 border-red-200'
          }`}
        >
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
        {state?.errors?.email?.[0] && (
          <p className="text-xs text-red-500 mt-1">{state.errors.email[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || state?.success === true}
        className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Enviando...' : 'Enviar instrucciones'}
      </button>

      <p className="text-center text-sm text-gray-500 pt-1">
        <Link href="/login" className="text-emerald-600 hover:underline font-medium">
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
  )
}
