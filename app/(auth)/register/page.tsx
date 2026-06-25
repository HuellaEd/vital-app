import type { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata: Metadata = { title: 'Crear cuenta | Vital' }

export default function RegisterPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Creá tu cuenta</h2>
      <RegisterForm />
    </>
  )
}
