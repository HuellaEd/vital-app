import type { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'

export const metadata: Metadata = { title: 'Iniciar sesión | Vital' }

export default function LoginPage() {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Iniciá sesión</h2>
      <LoginForm />
    </>
  )
}
