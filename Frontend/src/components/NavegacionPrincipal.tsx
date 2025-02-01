import { Link, useLocation } from 'react-router-dom'
import { Home, Wallet, BookOpen, Package, Users, User, ShoppingCart, LogOut } from 'lucide-react'

interface NavegacionPrincipalProps {
  onLogout: () => void;
}

const navItems = [
  { name: "Panel", href: "/", icon: Home },
  { name: "Billetera", href: "/wallet", icon: Wallet },
  { name: "Aprendizaje", href: "/learning", icon: BookOpen },
  { name: "Productos", href: "/products", icon: Package },
  { name: "Clientes", href: "/clients", icon: Users },
  { name: "Pedidos", href: "/orders", icon: ShoppingCart },
  { name: "Perfil", href: "/profile", icon: User },
]

const NavegacionPrincipal: React.FC<NavegacionPrincipalProps> = ({ onLogout }) => {
  const location = useLocation()

  return (
    <>
      {/* Navegación inferior móvil */}
      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white md:hidden">
        <div className="mx-auto flex max-w-screen-xl justify-between px-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-2 ${
                location.pathname === item.href ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Navegación lateral de escritorio */}
      <div className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold">Embajador de Marca</h1>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 space-y-1 px-2 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    location.pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-6 w-6 flex-shrink-0 ${
                      location.pathname === item.href ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={onLogout}
                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full text-left"
              >
                <LogOut className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                Cerrar sesión
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default NavegacionPrincipal
