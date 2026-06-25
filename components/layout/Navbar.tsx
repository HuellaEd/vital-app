import Link from 'next/link'
import { logout } from '@/lib/actions/auth'
import type { Profile } from '@/lib/types'

type Props = {
  profile: Pick<Profile, 'nombre' | 'apellido' | 'email'> | null
}

export default function Navbar({ profile }: Props) {
  const displayName = profile?.nombre
    ? `${profile.nombre}${profile.apellido ? ` ${profile.apellido}` : ''}`
    : (profile?.email ?? '')

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-emerald-600 text-lg">Vital</span>
          <div className="flex gap-5">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/peso"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Mis registros
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:block">{displayName}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
