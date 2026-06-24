export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-5xl font-bold text-green-700 mb-4">
        Vital
      </h1>

      <p className="text-xl text-gray-600 mb-10">
        Tu cuerpo · Tu data
      </p>

      <div className="flex flex-col gap-4 w-64">
        <button className="bg-green-600 text-white py-3 rounded-lg">
          Iniciar sesión
        </button>

        <button className="border border-green-600 text-green-600 py-3 rounded-lg">
          Crear cuenta
        </button>
      </div>
    </main>
  );
}