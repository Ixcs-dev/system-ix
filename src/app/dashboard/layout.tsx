import Link from 'next/link'
import { Home, Package, ClipboardList, LogOut } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-4 flex items-center">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Recurso%203-8-pWUZqzearpjc0vIHUAxQAlWHmALKgF.png" alt="Logo" className="h-12 w-auto mr-2" />
            <h1 className="text-xl font-bold">System.ix</h1>
        </div>
        </div>
        </div>
        <div className="text-sm text-gray-600 uppercase font-bold tracking-wide flex items-center space-x-2 p-2">Panel de control</div>
        <nav className="space-y-2 px-4">
          <Link href="/dashboard" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
            <Home className="w-5 h-5" />
            <span>Inicio</span>
          </Link>
          <Link href="/dashboard/productos" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
            <Package className="w-5 h-5" />
            <span>Productos</span>
          </Link>
          <Link href="/dashboard/registro-productos-apartados" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
            <ClipboardList className="w-5 h-5" />
            <span>Registros</span>
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4">
          <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded text-red-500">
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}