import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/dashboard brand/login';
import Dashboard from './pages/dashboard brand/dashboard';
import NavegacionPrincipal from './components/NavegacionPrincipal';
import Productos from './pages/dashboard brand/products/productos';
import ProductDetails from './pages/dashboard brand/products/product-list';
import Wallet from './pages/dashboard brand/wallet';
import Clients from './pages/dashboard brand/clients';
import Learning from './pages/dashboard brand/learning';
import Profile from './pages/dashboard brand/profile';
import Pedidos from './pages/dashboard brand/pedidos';
import CatalogPage from './pages/dashboard brand/catalog';
import Catalog_view from './components/catalog-view-men';
import { CartProvider } from './components/carritoContext';
import Cart from './components/cart';
import CheckoutEnvio from './pages/dashboard brand/checkout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pais, setPais] = useState<string | null>(null);

  // Verificación del token y el país al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedPais = localStorage.getItem('pais');

    if (token) {
      // Aquí puedes agregar una verificación adicional del token si es necesario
      // Ejemplo: verificar si el token es válido mediante una llamada a la API o con JWT
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false); // Si no hay token, no está autenticado
    }

    if (storedPais) {
      setPais(storedPais);
    }
  }, []);

  const handleLogin = (token: string, pais: string) => {
    localStorage.setItem('access_token', token); // Almacena el token en localStorage
    localStorage.setItem('pais', pais);  // Almacena el país en localStorage
    setIsAuthenticated(true);
    setPais(pais);  // Actualiza el estado del país
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Elimina el token de localStorage
    localStorage.removeItem('pais');  // Elimina el país de localStorage
    setIsAuthenticated(false);
    setPais(null);
  };

  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/catalog-view-men" element={<Catalog_view />} />
          <Route path="/checkout" element={<CheckoutEnvio />} />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* Rutas privadas */}
          {isAuthenticated && (
            <Route
              path="*"
              element={
                <div className="flex h-screen bg-gray-100">
                  <NavegacionPrincipal onLogout={handleLogout} />
                  <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/wallet" element={<Wallet pais={pais} />} />
                      <Route path="/learning" element={<Learning />} />
                      <Route path="/products" element={<Productos />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/orders" element={<Pedidos />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </main>
                </div>
              }
            />
          )}

          {/* Redirección para rutas no autenticadas */}
          {!isAuthenticated && <Route path="*" element={<Navigate to="/" />} />}
        </Routes>

        {/* Condicionar la renderización del carrito flotante */}
        <CartWithLocation />
      </Router>
    </CartProvider>
  );
}

// Componente auxiliar que maneja la lógica de Cart y useLocation
function CartWithLocation() {
  const location = useLocation();

  const routesWithCart = ['/catalog', '/catalog-view-men'];

  if (!routesWithCart.includes(location.pathname)) {
    return null;
  }

  return <Cart />;
}

export default App;
