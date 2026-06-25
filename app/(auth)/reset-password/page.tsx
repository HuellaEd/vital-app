import type { Metadata } from 'next'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export const metadata: Metadata = { title: 'Recuperar contraseña | Vital' }

export default function ResetPasswordPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Recuperá tu contraseña</h2>
      <p className="text-sm text-gray-500 mb-6">
        Ingresá tu email y te enviamos un link para restablecer tu contraseña.
      </p>
      <ResetPasswordForm />
    </>
  )
}
