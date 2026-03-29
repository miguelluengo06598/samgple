'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  { href: '/finanzas', label: 'Finanzas', icon: '💰' },
  { href: '/pedidos', label: 'Pedidos', icon: '📦' },
  { href: '/tienda', label: 'Tienda', icon: '🏪' },
  { href: '/herramientas', label: 'Herramientas', icon: '🛠️' },
  { href: '/configuracion', label: 'Config', icon: '⚙️' },
]

export default function NavBottom() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 flex items-center justify-around px-2 py-2 safe-area-pb">
      {links.map(link => {
        const isActive = pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
              isActive
                ? 'text-teal-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-xl leading-none">{link.icon}</span>
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}